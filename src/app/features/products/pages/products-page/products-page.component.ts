import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.interface';
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { LoaderComponent } from "../../../loader/loader.component";

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductListComponent, PaginationComponent, LoaderComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  
  // SIGNAL ES PARA CREAR BANDERAS, PUEDE SER DE CUALQUIER COSA
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly total = signal(0);

  readonly pageSize: number = 12;
  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize));

  errorMessage: string = '';

  private search: string = '';

  buscar(termino: string): void {
    this.search = termino;
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.loading.set(true);
    this.error.set(null);

    const skip = (page - 1) * this.pageSize;

    this.productService.getProducts(this.pageSize, skip, this.search).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.total.set(response.total);
        this.page.set(page);
        this.loading.set(false);

      },
      error: () => {
        this.error.set('No pudimos cargar los productos. Reintentá');
        this.loading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadPage(1);
  }
}

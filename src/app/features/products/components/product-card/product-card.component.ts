import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../../../core/models/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}

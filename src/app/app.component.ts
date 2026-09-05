import { Component } from '@angular/core';
import { ProductsPageComponent } from './features/products/pages/products-page/products-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ministore';
}

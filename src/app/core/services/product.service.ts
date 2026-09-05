import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../models/products-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor() { }

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/products';

  getProducts(limit: number, skip: number, search = ''): Observable<ProductsResponse> {
    const url = search
      ? `${this.apiUrl}/search?q=${search}&limit=${limit}&skip=${skip}`
      : `${this.apiUrl}?limit=${limit}&skip=${skip}`;

    return this.http.get<ProductsResponse>(url);
  }
}

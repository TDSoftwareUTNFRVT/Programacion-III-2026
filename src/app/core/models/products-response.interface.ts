import { Product } from "./product.interface";

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

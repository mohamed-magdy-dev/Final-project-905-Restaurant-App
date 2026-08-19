import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../model/product";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = 'http://localhost:8080/products/';

  constructor(private http: HttpClient) {
  }

  getProducts(page, size): Observable<any> {
    return this.http.get<Product[]>(
      this.baseUrl + "all-products?page=" + page + "&size=" + size
    );
  }

  getProductsByCategoryId(id, page, size): Observable<any> {
    return this.http.get<Product[]>(
      this.baseUrl + 'all-products/' + id + "?page=" + page + "&size=" + size
    );
  }

  search(key, page, size): Observable<any> {
    return this.http.get<Product[]>(
      this.baseUrl + 'all-products-by-key?key=' + key + "&page=" + page + "&size=" + size
    );
  }

  // ADD PRODUCT FEAT -->
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(
      this.baseUrl + "add",
      product
    );
  }

  // DELETE PRODUCT FEAT --> 
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(
      this.baseUrl + "delete/" + id
    );
  }
}
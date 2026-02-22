import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"; // زودنا HttpHeaders
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RequestOrderService {

  url = 'http://localhost:8080/orders/';

  constructor(private http: HttpClient) { }

  // 1. دي دالة المفتاح (التوكين) عشان السيرفر يعرف إنك أدمن
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // أو localStorage حسب ما انت مخزن فين
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  // دالة عمل أوردر جديد (لليوزر)
  createOrder(productsIds: any, totalPrice: any, totalNumber: any): Observable<any> {
    return this.http.post<any>(this.url + 'create-orders', { productsIds, totalPrice, totalNumber }, { headers: this.getHeaders() }).pipe(
      map(response => response)
    );
  }

  // دالة جلب الأوردرات (لليوزر يشوف طلباته)
  getOrder(): Observable<any> {
    return this.http.get<any>(this.url + 'all-orders', { headers: this.getHeaders() }).pipe(
      map(response => response)
    );
  }
  // http://localhost:8080/orders/
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'admin/all-orders', { headers: this.getHeaders() });
  }
}
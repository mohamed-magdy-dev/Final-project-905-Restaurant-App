import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  // تأكد إن الرابط ده مطابق للكونترولر بتاعك في الباك إند
  private apiUrl = 'http://localhost:8080/api/contact/send';

  constructor(private http: HttpClient) { }

  // الدالة دي هي اللي هتبعت الداتا
  sendMessage(contactDto: any): Observable<any> {
    return this.http.post(this.apiUrl, contactDto);
  }
}
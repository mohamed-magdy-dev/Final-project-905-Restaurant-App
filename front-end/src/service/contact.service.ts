import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) { }

  // --- Helper to get Token Headers ---
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // تأكد إن ده الاسم الصح عندك
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  // 1. إرسال رسالة (User)
  sendMessage(contactDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, contactDto, { headers: this.getHeaders() });
  }

  // 2. عداد النوتيفيكشن (User)
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`, { headers: this.getHeaders() });
  }

  // 3. عرض الرسايل السابقة (User)
  getMyMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-messages`, { headers: this.getHeaders() });
  }

  // 4. تعليم الرسايل كمقروءة (User)
  markAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-read`, {}, { headers: this.getHeaders() });
  }

  // 5. عرض كل الرسايل (Admin)
  getAllMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }

  // 6. الرد على رسالة (Admin)
  replyToMessage(replyDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reply`, replyDto, { headers: this.getHeaders() });
  }
}
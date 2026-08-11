import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; 
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'http://localhost:8080/api/contact';

  public unreadCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

 

  sendMessage(contactDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, contactDto, { headers: this.getHeaders() });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`, { headers: this.getHeaders() })
      .pipe(
        tap(count => {
          this.unreadCount.next(count);
        })
      );
  }

  getMyMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-messages`, { headers: this.getHeaders() });
  }

  markAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/mark-read`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.unreadCount.next(0);
        })
      );
  }

  getAllMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }

  replyToMessage(replyDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reply`, replyDto, { headers: this.getHeaders() });
  }
}
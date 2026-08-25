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
    const token = localStorage.getItem('token'); // we sending the JWT with the request 1
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

 
  // we have this url 'http://localhost:8080/api/contact' and this function will add "/send" to it
  sendMessage(contactDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, contactDto, { headers: this.getHeaders() });
  } // so that the endpoint is something like this --> POST http://localhost:8080/api/contact/send

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
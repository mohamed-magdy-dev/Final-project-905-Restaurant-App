import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService { // the bridge to --> backend

  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

      createAccount(username, password, email): Observable<any> {
        return this.http.post<any>(this.baseUrl + "/sign-up", { username, password, email });
      }

  
    login(username, password): Observable<any> { // This is the HTTP request for login = send it to backend for check (Auth controller Java)
      return this.http.post<any>(this.baseUrl + "/login", { username, password }).pipe( // HTTP.POST method. ex."POST http://localhost:8080/auth/login"
        tap(response => { // information in body : 
          if (response && response.token) {
            sessionStorage.setItem("token", response.token);
            
            if (response.userRoles) {
              sessionStorage.setItem("roles", JSON.stringify(response.userRoles));
            }
            if (response.username) {
              sessionStorage.setItem("username", response.username);
            }
            if (response.email) {
              sessionStorage.setItem("email", response.email); // Storage for email
            }
          }
        })
      );
    }

  isUserLogin(): boolean {
    return sessionStorage.getItem("token") != null;
  }

  isAdmin(): boolean {
    const roles = sessionStorage.getItem("roles");
    return roles ? roles.includes("ADMIN") : false;
  }

  updateProfile(data: any): Observable<any> {
    return this.http.post('http://localhost:8080/account/profile', data);
  }

  logOut() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("roles");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("email");
  }
}
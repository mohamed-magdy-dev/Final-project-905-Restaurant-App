import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../../service/auth.service";
import { ContactService } from '../../../service/contact.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit { 

  unreadCount: number = 0;
  
  // we dont need isLogin .. we will use the function directly here

  constructor(
    private routes: Router, 
    private authService: AuthService,
    private contactService: ContactService // service injection
  ) {}

  ngOnInit(): void {
   if (this.isUserLogin()) {
    // call the API to get the first number
      this.contactService.getUnreadCount().subscribe();
      
      // to get any changes we subscribe to the storage 
      this.contactService.unreadCount.subscribe(count => {
        this.unreadCount = count;
      });
    }
  }
  
  isUserLogin(): boolean {
    return this.authService.isUserLogin();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAuthPage(): boolean {
  return this.routes.url === '/login' || this.routes.url === '/signup';
} // this.routes.url: bring the url that the Angular is currently on

  search(key: any){ // زودت any عشان التايب سكريبت ميزعلش
    this.routes.navigateByUrl("/products/" + key);
  }

  logOut(){
    this.authService.logOut();
    this.routes.navigateByUrl("/login");
  }
}
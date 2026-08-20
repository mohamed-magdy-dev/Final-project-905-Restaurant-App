import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../../service/auth.service";
import { ContactService } from '../../../service/contact.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit { // 1. زودنا implements OnInit

  unreadCount: number = 0;
  
  // مش محتاجين isLoggedIn كمتغير، هنعتمد على الفانكشن علطول

  constructor(
    private routes: Router, 
    private authService: AuthService,
    private contactService: ContactService // 2. حقنا السيرفس 
  ) {}

  // 3.  التشغيل أول ما الصفحة تفتح
  ngOnInit(): void {
   if (this.isUserLogin()) {
      // 1. نادي الـ API عشان يجيب أول رقم ويحطه في المخزن
      this.contactService.getUnreadCount().subscribe();
      
      // 2. اشترك في المخزن عشان أي تغيير مستقبلي يوصلك
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
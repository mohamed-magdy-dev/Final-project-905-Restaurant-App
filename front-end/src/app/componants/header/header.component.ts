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
    private contactService: ContactService // 2. حقنا السيرفس هنا
  ) {}

  // 3. دالة التشغيل أول ما الصفحة تفتح
  ngOnInit(): void {
    // لو اليوزر مسجل دخول، هات عدد الرسايل
    if (this.isUserLogin()) {
      this.getNotificationCount();
    }
  }

  getNotificationCount() {
    this.contactService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
        console.log('Unread Messages:', count);
      },
      error: (err) => {
        console.error('Failed to get notifications', err);
      }
    });
  }

  isUserLogin(): boolean {
    return this.authService.isUserLogin();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  search(key: any){ // زودت any عشان التايب سكريبت ميزعلش
    this.routes.navigateByUrl("/products/" + key);
  }

  logOut(){
    this.authService.logOut();
    this.routes.navigateByUrl("/login");
  }
}
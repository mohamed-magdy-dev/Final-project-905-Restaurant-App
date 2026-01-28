import { Component, OnInit } from '@angular/core';

// 1. تعريف شكل البيانات (Interface) لترتيب الكود
export interface Chef {
  name: string;
  designation: string; // يقابل SPECIALTY في قاعدة البيانات
  image: string;       // يقابل LOGO_PATH
  facebook: string;
  twitter: string;
  instagram: string;
}

@Component({
  selector: 'app-chefs',
  templateUrl: './chefs.component.html',
  styleUrls: ['./chefs.component.css']
})
export class ChefsComponent implements OnInit {

  // 2. وضع البيانات التي لديك في مصفوفة
  chefsList: Chef[] = [
    {
      name: 'Ahmed moahmed',
      designation: 'Pizza',
      image: 'team-1.jpg',
      facebook: 'https://facebook.com/chef1',
      instagram: 'https://instagram.com/chef1',
      twitter: 'https://twitter.com/chef1'
    },
    {
      name: 'Osama Alem',
      designation: 'Chicken shawarma',
      image: 'team-2.jpg',
      facebook: 'https://facebook.com/chef2',
      instagram: 'https://instagram.com/chef2',
      twitter: 'https://twitter.com/chef2'
    },
    {
      name: 'Ayman ali',
      designation: 'Burger',
      image: 'team-3.jpg',
      facebook: 'https://facebook.com/chef3',
      instagram: 'https://instagram.com/chef3',
      twitter: 'https://twitter.com/chef3'
    },
    {
      name: 'Nasser Karim',
      designation: 'Candies',
      image: 'team-4.jpg',
      facebook: 'https://facebook.com/chef4',
      instagram: 'https://instagram.com/chef4',
      twitter: 'https://twitter.com/chef4'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // دالة مساعدة لحساب التأخير في الأنيميشن (اختياري)
  getAnimationDelay(index: number): string {
    return (0.1 + (index * 0.2)) + 's';
  }
}

// ماذا تغير ولماذا هذا أفضل؟
// Code Maintenance (سهولة الصيانة): في السابق، إذا أردت تغيير كلاس معين في التصميم، كنت ستضطر لتغييره في 8 أماكن. الآن تغيره في مكان واحد فقط.

// Dynamic Data: البيانات الآن مفصولة عن التصميم. في المستقبل، يمكنك جلب البيانات من "Backend API" بسهولة عن طريق استبدال المصفوفة الثابتة ببيانات قادمة من السيرفر، ولن تحتاج لتغيير حرف واحد في الـ HTML.

// Images Path: قمنا بربط الصور بشكل صحيح: src]="'assets/img/' + chef.image"، بحيث يأخذ الاسم من الداتا (team-1.jpg) ويضيف له المسار (assets/img/).

// Animation Delay: في الكود القديم كان التأخير مكتوباً يدوياً (0.1, 0.3, 0.5...). الآن قمنا بحسابه ديناميكياً بناءً على الـ index ليعطي تأثير التتابع الجميل (0.1 + (i * 0.2)).
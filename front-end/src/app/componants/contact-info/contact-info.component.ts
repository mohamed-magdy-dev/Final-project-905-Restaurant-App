import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../../service/contact.service';
@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {

  contactForm!: FormGroup;
  isSubmitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) { }

  ngOnInit(): void {
    // 1. تجهيز الفورم
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    // 2. تعبئة البيانات أوتوماتيكياً (Auto-fill)
    this.fillUserData();
  }

  fillUserData() {
    // افترض هنا أنك مخزن بيانات اليوزر في localStorage بعد اللوجين
    // أو ممكن تجيبها من UserService لو عندك
    const userString = localStorage.getItem('user');
     // أو حسب ما أنت مخزنها فين
   console.log('USER FROM STORAGE:', userString);
     if (userString) {
      const user = JSON.parse(userString);
      
      // نملأ الفورم بالبيانات الجاهزة
      this.contactForm.patchValue({
        name: user.name || '', // تأكد من أسماء الحقول في الـ LocalStorage عندك
        email: user.email || ''
      });
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.contactForm.invalid) return;

    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Message sent successfully!';
        this.contactForm.get('subject')?.reset(); // نمسح الموضوع والرسالة بس
        this.contactForm.get('message')?.reset();
        this.isSubmitted = false;
        
        // إخفاء الرسالة بعد 3 ثواني
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to send message. Please try again.';
        console.error(err);
      }
    });
  }

  get f() { return this.contactForm.controls; }
}
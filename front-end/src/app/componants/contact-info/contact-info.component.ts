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
    // بنجيب اليوزر من المتصفح
    const userString = localStorage.getItem('user'); // أو 'currentUser' حسب أنت مسميه إيه في الـ LoginService
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        
        // تعديل مهم: استخدمنا username بدل name
        // وخلينا الايميل فاضي عشان اليوزر يكتبه هو
        this.contactForm.patchValue({
          name: user.username || user.name || '', 
          email: '' 
        });
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    
    // 1. تنظيف مبدئي قبل الإرسال
    this.errorMessage = '';
    this.successMessage = '';

    if (this.contactForm.invalid) return;

    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: (res) => {
        // 2. حالة النجاح
        this.errorMessage = ''; // تأكيد مسح الخطأ
        this.successMessage = 'Message sent successfully! We will reply soon.';
        
        this.contactForm.get('subject')?.reset();
        this.contactForm.get('message')?.reset();
        this.isSubmitted = false;
        
        // إخفاء رسالة النجاح بعد 6 ثواني (مدة كافية للقراءة)
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        // 3. حالة الفشل
        this.successMessage = ''; // تأكيد مسح النجاح
        
        if (err.error && err.error.error === 'PROFILE_INCOMPLETE') {
            this.errorMessage = 'Please complete your profile first!';
        } else {
            this.errorMessage = 'Failed to send message. Please try again.';
        }
        
        console.error(err);

        // إخفاء رسالة الخطأ بعد 5 ثواني
        setTimeout(() => {
            this.errorMessage = '';
        }, 2000);
      }
    });
  }

  get f() { return this.contactForm.controls; }
}
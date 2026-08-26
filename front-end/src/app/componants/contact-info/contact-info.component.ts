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
    this.contactForm = this.formBuilder.group({
      subject: ['', Validators.required], // subject must be there
      message: ['', [Validators.required, Validators.minLength(10)]] // the message must be there and has a min length of 10 (for now)
    });
  }

  onSubmit() { // gets called from HTML when user submits a forum
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.contactForm.invalid) return; // validation .. if user entered the fields correctly(Subject & message) then ignore (will not return)

    // Retrieve active user details from "sessionStorage" 
    const userName = sessionStorage.getItem('username') || 'Unknown User';
    const userEmail = sessionStorage.getItem('email') || 'No Email Provided';

    const finalMessageData = { // this is the request body 
      name: userName,
      email: userEmail,
      subject: this.contactForm.value.subject.trim(),
      message: this.contactForm.value.message.trim()
    };

    this.contactService.sendMessage(finalMessageData).subscribe({ // then go to contact.service
      next: () => { // true or success
        this.successMessage = 'Message sent successfully! We will reply soon.';
        this.contactForm.reset();
        this.isSubmitted = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => { // if not success ...
        if (err.error && err.error.error === 'PROFILE_INCOMPLETE') {
          this.errorMessage = 'Please complete your profile first!';
        } else {
          this.errorMessage = 'Failed to send message. Please try again.';
        }
        console.error(err);

        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    }); 
  }

  get f() { return this.contactForm.controls; }
}
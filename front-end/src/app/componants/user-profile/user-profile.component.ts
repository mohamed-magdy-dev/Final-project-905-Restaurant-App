import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from "../../../service/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  profileForm: FormGroup;
  message: string = '';
  isSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // تعريف الفورم
    this.profileForm = this.fb.group({
      address: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      age: ['']
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.authService.updateProfile(this.profileForm.value).subscribe(
      response => {
        this.isSuccess = true;
        this.message = 'Profile updated successfully! Redirecting...';
        
        // after two seconds we get back to carts .. or anything i want later.
        setTimeout(() => {
          this.router.navigate(['/cart']); // أو products حسب ما احب بقى
        }, 2000);
      },
      error => {
        this.isSuccess = false;
        this.message = 'Error updating profile. Please try again.';
      }
    );
  }
}
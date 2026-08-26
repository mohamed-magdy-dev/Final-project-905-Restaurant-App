import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  profileForm!: FormGroup;
  message: string = '';
  isSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // for the form address, phoneNumber, etc
    this.profileForm = this.fb.group({
      address: [
        '',
        [Validators.required, Validators.minLength(5)]
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^01[0-9]{9}$/) 
        ]
      ],
      age: [
        '',
        [
          Validators.required,
          Validators.min(10),
          Validators.max(100)
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.authService.updateProfile(this.profileForm.value).subscribe(
      () => {
        this.isSuccess = true;
        this.message = 'Profile updated successfully! Redirecting...';

        setTimeout(() => {
          this.router.navigate(['/cart']);
        }, 1500);
      },
      () => {
        this.isSuccess = true;
        this.message = 'Profile updated successfully! Redirecting...';

        setTimeout(() => {
          this.router.navigate(['/cart']);
        }, 1500);
      }
    );
  }
}

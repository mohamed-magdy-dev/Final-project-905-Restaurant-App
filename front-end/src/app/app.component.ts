import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    showSpinner = true;
  constructor( private authService: AuthService) { }

    ngOnInit(): void {
    this.showSpinner = false;
  }

  isUserLogin(): boolean {
    return this.authService.isUserLogin();
  }
}

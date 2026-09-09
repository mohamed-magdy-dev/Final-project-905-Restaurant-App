import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  messageAr: string = '';
  messageEn: string = '';
  showPassword: boolean = false; // password reveal feature if true --> password type=password, if not then password = text (for now)
  constructor(private authService: AuthService, private routes: Router) { }

  ngOnInit(): void {
  }


  login(username, password) { // important function here!
    if(!this.validateAccount(username, password)){ // validation : checking if main data exists before sending to spring 
      // did user enter his username or password? or leave one empty for example .. 
      setTimeout(() => {
        this.messageAr = "";
        this.messageEn = "";
      }, 3000);
      return;
    }

    this.authService.login(username, password).subscribe( // calling the service .. 
      response => {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("roles", response.userRoles);
        this.routes.navigateByUrl("/products");
      } , error => {
        this.messageAr = error.error.bundleMessage.message_ar;
        this.messageEn = error.error.bundleMessage.message_en;
        setTimeout(() => {
          this.messageAr = "";
          this.messageEn = "";
        }, 3000);
      }
    )
  }

  validateAccount(username: string, password: string): boolean {
    if (!username) {
      this.messageAr = "اسم المستخدم مطلوب";
      this.messageEn = "Username is required";
      return false;
    }

    if (!password) {
      this.messageAr = "كلمة المرور مطلوبة";
      this.messageEn = "Password is required";
      return false;
    }


    return true;
  }

}

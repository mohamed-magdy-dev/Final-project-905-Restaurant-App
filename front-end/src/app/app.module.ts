import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // FormsModule مهم جدا هنا
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { APP_BASE_HREF } from '@angular/common';

// Components Imports
import { AppComponent } from './app.component';
import { ProductsComponent } from './componants/products/products.component';
import { HeaderComponent } from './componants/header/header.component';
import { CategoryComponent } from './componants/category/category.component';
import { CardDetailsComponent } from './componants/card-details/card-details.component';
import { CardComponent } from './componants/card/card.component';
import { FooterComponent } from './componants/footer/footer.component';
import { ChefsComponent } from './componants/chefs/chefs.component';
import { ContactInfoComponent } from './componants/contact-info/contact-info.component';
import { LoginComponent } from './componants/login/login.component';
import { SignupComponent } from './componants/signup/signup.component';
import { OrderCodeComponent } from './componants/order-code/order-code.component';
import { OrderUserComponent } from './componants/order-user/order-user.component';
import { UserProfileComponent } from './componants/user-profile/user-profile.component';
import { OrderSummaryComponent } from './componants/order-summary/order-summary.component';
import { MyMessagesComponent } from './componants/my-messages/my-messages.component';
import { AdminMessagesComponent } from './componants/admin-messages/admin-messages.component';
import { AuthGuard } from 'src/guard/auth.guard';
import { LoginSignUpGuard } from 'src/guard/login-sign-up.guard';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { AdminDashboardComponent } from './componants/admin-dashboard/admin-dashboard.component';

// Interceptors & Guards


export const routes: Routes = [
  {path: 'products', component: ProductsComponent, canActivate:[AuthGuard]},
  {path: 'category/:id', component: ProductsComponent, canActivate:[AuthGuard]},
  {path: 'products/:key', component: ProductsComponent, canActivate:[AuthGuard]},
  {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  {path: 'cardDetails', component: CardDetailsComponent, canActivate:[AuthGuard]},
  {path: 'contact-info', component: ContactInfoComponent, canActivate:[AuthGuard]},
  {path: 'order-summary/:code', component: OrderSummaryComponent},
  {path: 'login', component: LoginComponent, canActivate:[LoginSignUpGuard]},
  {path: 'signup', component: SignupComponent, canActivate:[LoginSignUpGuard]},
  {path: 'chefs', component: ChefsComponent, canActivate:[AuthGuard]},
  {path: 'my-messages', component: MyMessagesComponent, canActivate:[AuthGuard]},
  {path: 'admin-messages', component: AdminMessagesComponent, canActivate:[AuthGuard] },
  {path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  {path: 'order-code/:code', component: OrderCodeComponent, canActivate:[AuthGuard]},
  {path: 'orders-user', component: OrderUserComponent, canActivate:[AuthGuard]},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    HeaderComponent,
    CategoryComponent,
    CardDetailsComponent,
    CardComponent,
    FooterComponent,
    ChefsComponent,
    ContactInfoComponent,
    LoginComponent,
    SignupComponent,
    OrderCodeComponent,
    OrderUserComponent,
    UserProfileComponent,
    OrderSummaryComponent,
    MyMessagesComponent,
    AdminMessagesComponent,
    AdminDashboardComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule // ده اللي بيحل مشكلة ngModel
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { Component } from '@angular/core';
import {CartService} from "../../../service/cart.service";
import {ProductOrder} from "../../../model/product-order";
import {Product} from "../../../model/product";
import {RequestOrderService} from "../../../service/request-order.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent {
profileErrorMessage: string | null = null;
  productOrders: ProductOrder[] = [];
  totalProductSize: number = 0;
  totalProductPrice: number = 0;

  constructor(private cartService: CartService, private requestOrderService :RequestOrderService, private router: Router) {

  }

  ngOnInit(): void {
    
    this.productOrders = this.cartService.productOrders;

    this.cartService.totalOrderSize.subscribe(
      value => this.totalProductSize = value
    )
    this.cartService.totalPrice.subscribe(
      value => this.totalProductPrice = value
    )
  }

  addProduct(productOrder: ProductOrder){
    this.cartService.addProductToOrder(productOrder);
  }



  removeSelectedProduct(productOrder: ProductOrder){
    this.cartService.removeProduct(productOrder);
  }

  removeFullProduct(productOrder: ProductOrder){
    this.cartService.remove(productOrder);
  }



  createOrder() {
   

  const productIds = this.cartService.productOrders.map(or => or.id);

  this.requestOrderService.createOrder(productIds, this.totalProductPrice, this.totalProductSize).subscribe(
    response => {
      // السيناريو الناجح
      this.cartService.productOrders = [];
      this.cartService.totalPrice.next(0);
      this.cartService.totalOrderSize.next(0);
      this.router.navigateByUrl("/order-code/" + response.code);
    },


error => {
  const errorMsg = error.error?.message || '';

  if (errorMsg === 'PROFILE_INCOMPLETE') {
    this.profileErrorMessage = 'Please complete your profile first to be able to checkout.';
    // لا تقم بإخفاء الرسالة هنا، اترك الزر ظاهراً للمستخدم ليضغط عليه
  } else {
    this.profileErrorMessage = 'Something went wrong. Please try again.';
    // هنا يمكن إخفاؤه لأنه مجرد تنبيه عام
    setTimeout(() => {
      this.profileErrorMessage = null;
    }, 5000);
  }
}



//    error => {
//   const errorMsg = error.error?.message || '';

//   if (errorMsg === 'PROFILE_INCOMPLETE') {
//     this.profileErrorMessage =
//       'Please complete your profile first to be able to checkout.';

//     // Hide message after 5 seconds
//     setTimeout(() => {
//       this.profileErrorMessage = null;
//     }, 5000);
//   } else {
//     this.profileErrorMessage = 'Something went wrong. Please try again.';
//     setTimeout(() => {
//       this.profileErrorMessage = null;
//     }, 5000);
//   }
// }
  );
}
  // createOrder() {
  //   const productIds = this.cartService.productOrders.map(or => or.id);

  //   this.requestOrderService.createOrder(productIds, this.totalProductPrice, this.totalProductSize).subscribe(
  //     response => {
  //       this.cartService.productOrders = [];
  //       this.cartService.totalPrice.next(0);
  //       this.cartService.totalOrderSize.next(0);
  //       this.router.navigateByUrl("/order-code/" + response.code)
  //     }
  //   )
  // }
}

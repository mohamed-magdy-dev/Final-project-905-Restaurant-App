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
      console.error(error); // عشان نشوف شكل الإيرور في الكونسول

      // لو الرسالة جاية في error.error.message أو حسب الـ Structure بتاعك
      // ممكن تحتاج تطبع error كله في الكونسول الأول عشان تعرف المسار الصح للرسالة
      let errorMsg = error.error?.message || error.message || ""; 

      if (errorMsg.includes("PROFILE_INCOMPLETE")) {
        // 1. طلع رسالة لليوزر
        alert("⚠️ Please complete your profile (Address & Phone) before checkout!");
        
        // 2. حوله لصفحة البروفايل (لو عندك صفحة أو مودال)
        // this.router.navigateByUrl('/profile'); // (لو عملنا راوت للبروفايل)
        
        // أو ممكن تفتحله مودال البروفايل لو بتستخدم Bootstrap Modal
      } else {
        alert("Something went wrong with your order.");
      }
    }
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

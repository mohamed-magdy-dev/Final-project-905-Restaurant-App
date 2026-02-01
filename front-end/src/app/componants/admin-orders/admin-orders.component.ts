import { Component, OnInit } from '@angular/core';
import { RequestOrderService } from 'src/service/request-order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];

  // هنا استخدمنا RequestOrderService بدل OrderService الوهمية
  constructor(private requestOrderService: RequestOrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.requestOrderService.getAllOrders().subscribe({
      next: (data: any) => {
        console.log('Final Data:', data); // عشان نتأكد في الكونسول
        
        // التعديل: الداتا جاية "قائمة" جاهزة، مش محتاجة فك
        this.orders = data; 
      },
      error: (err) => {
        console.error('Error fetching orders', err);
      }
    });
  }
}
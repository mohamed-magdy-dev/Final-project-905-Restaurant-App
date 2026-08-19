import { Component } from '@angular/core';
import { Product } from "../../../model/product";
import { ProductService } from "../../../service/product.service";

@Component({
  selector: 'app-admin-food',
  templateUrl: './admin-food.component.html',
  styleUrls: ['./admin-food.component.css']
})
export class AdminFoodComponent {

  // Product we are creating
 product: Product = {
    id: null,
    name: '',
    description: '',
    price: null,
    imagePath: '',
    category: {
      id: null
    }
  };

  // ID of product to delete
  deleteId: number;

  message: string = '';

  constructor(private productService: ProductService) {
  }

  addProduct() {

    this.productService.addProduct(this.product).subscribe(
      response => {

        this.message = 'Food added successfully!';

        this.product = {
          id: null,
          name: '',
          description: '',
          price: null,
          imagePath: '',
          category: {
            id: null
          } };
          

        console.log('Added product:', response);
      },
      error => {

        this.message = 'Failed to add food.';

        console.error(error);
      }
    );
  }

  deleteProduct() {

    this.productService.deleteProduct(this.deleteId).subscribe(
      response => {

        this.message = 'Food deleted successfully!';

        this.deleteId = null;

      },
      error => {

        this.message = 'Failed to delete food.';

        console.error(error);
      }
    );
  }
}
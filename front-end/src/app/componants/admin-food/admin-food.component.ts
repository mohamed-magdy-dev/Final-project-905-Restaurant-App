import { Component, OnInit } from '@angular/core';
import { Product } from "../../../model/product";
import { ProductService } from "../../../service/product.service";

@Component({
  selector: 'app-admin-food',
  templateUrl: './admin-food.component.html',
  styleUrls: ['./admin-food.component.css']
})
export class AdminFoodComponent implements OnInit {

  // product 
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

  products: Product[] = [];

  deleteId: number;
  message: string = '';

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Get all products
  loadProducts() {
    this.productService.getProducts(1, 100).subscribe(
      response => {
        this.products = response.products;
      },
      error => {
        console.error(error);
      }
    );
  }

  // Add product
  addProduct() {

    this.productService.addProduct(this.product).subscribe(
      response => {

        this.message = 'Food added successfully!';

        // Refresh product list
        this.loadProducts();

        // Clear form
        this.product = {
          id: null,
          name: '',
          description: '',
          price: null,
          imagePath: '',
          category: {
            id: null
          }
        };
      },
      error => {
        this.message = 'Failed to add food.';
        console.error(error);
      }
    );
  }

  // Delete product
  deleteProduct(id: number) {

    this.productService.deleteProduct(id).subscribe(
      response => {

        this.message = 'Food deleted successfully!';

        // Refresh list
        this.loadProducts();
      },
      error => {
        this.message = 'Failed to delete food.';
        console.error(error);
      }
    );
  }
}
export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;

    // Category selected for this product
  category: {
    id: number;
  };
}

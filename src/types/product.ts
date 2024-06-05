import { Category } from "./category";

export interface Product {
  _id: string;
  name: string;
  price: number;
  price_before_discount: number;
  quantity: number;
  description: string;
  sold: number;
  view: number;
  rating: number;
  images: string[];
  image: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

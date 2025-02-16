import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemSale } from '../models/item-sale.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private products: ItemSale[] = [];
  private cartSubject = new BehaviorSubject<ItemSale[]>([]);
  cart$ = this.cartSubject.asObservable();

  add(product: ItemSale) {
    const index = this.products.findIndex((p) => p.bookId === product.bookId);
    if (index > -1) {
      this.products[index].quantity += 1;
    } else {
      this.products.push({ ...product, quantity: 1 });
    }
    this.cartSubject.next(this.products);
  }

  remove(productId: number) {
    this.products = this.products.filter((p) => p.id !== productId);
    this.cartSubject.next(this.products);
  }

  updateQuantity(productId: number, quantity: number) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.quantity = quantity > 0 ? quantity : 1;
      this.cartSubject.next(this.products);
    }
  }
  clear() {
    this.products = [];
    this.cartSubject.next(this.products);
  }
  getTotal(): number {
    return this.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }
}

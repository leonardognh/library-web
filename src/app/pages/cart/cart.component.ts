import { Component, inject, OnInit } from '@angular/core';
import { ItemSale } from 'src/app/shared/models/item-sale.model';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  products: ItemSale[] = [];
  total = 0;
  dropdownAberto = false;

  ngOnInit(): void {
    this.cartService.cart$.subscribe((products) => {
      this.products = products;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(produtoId: number, quantidade: number) {
    this.cartService.updateQuantity(produtoId, quantidade);
  }

  remove(produtoId: number) {
    this.cartService.remove(produtoId);
  }

  toggleDropdown() {
    this.dropdownAberto = !this.dropdownAberto;
  }
}

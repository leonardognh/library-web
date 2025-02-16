import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemSale } from 'src/app/shared/models/item-sale.model';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  products: ItemSale[] = [];
  total = 0;

  ngOnInit(): void {
    this.cartService.cart$.subscribe((products) => {
      this.products = products;
      this.total = this.cartService.getTotal();
    });
  }

  buy() {
    this.cartService.clear();
    this.router.navigate(['/']);
  }
}

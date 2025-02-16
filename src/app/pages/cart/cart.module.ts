import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [CartComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [CartComponent],
})
export class CartModule {}

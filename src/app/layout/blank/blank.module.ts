import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankComponent } from './blank.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [BlankComponent],
  imports: [CommonModule, AppRoutingModule],
})
export class BlankModule {}

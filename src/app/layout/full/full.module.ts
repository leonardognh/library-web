import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullComponent } from './full.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NavBarModule } from 'src/app/shared/components/nav-bar/nav-bar.module';

@NgModule({
  declarations: [FullComponent],
  imports: [CommonModule, AppRoutingModule, NavBarModule],
})
export class FullModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlankModule } from './layout/blank/blank.module';
import { FullModule } from './layout/full/full.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from './shared/services/cart.service';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BlankModule,
    FullModule,
    ToastrModule.forRoot(),
    NgbModule,
  ],
  providers: [CartService],
  bootstrap: [AppComponent],
})
export class AppModule {}

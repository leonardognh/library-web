import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlankModule } from './layout/blank/blank.module';
import { FullModule } from './layout/full/full.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BlankModule, FullModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

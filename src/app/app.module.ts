import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    HttpClientModule,
    RouterLink
  ],

  providers: [
    FormBuilder
  ],

  bootstrap: [
    AppComponent
  ]

})
export class AppModule {
}

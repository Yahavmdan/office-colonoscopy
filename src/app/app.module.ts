import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/shared/services/User/auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    HttpClientModule,
    RouterLink,
  ],

  providers: [
    FormBuilder,
    AuthService
  ],

  bootstrap: [
    AppComponent
  ]

})
export class AppModule {
}

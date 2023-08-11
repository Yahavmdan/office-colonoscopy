import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {LoginComponent} from 'src/app/login/login.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

const routes = [
  { path: '', loadChildren: () => import('./game-links/game-links.module').then(m => m.GameLinksModule) },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    FormBuilder
  ]
})

export class AppRoutingModule {
}

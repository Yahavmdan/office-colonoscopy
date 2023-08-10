import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {LoginComponent} from 'src/app/login/login.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {AdminGuard} from 'src/app/shared/guards/admin.guard';
const routes = [
  { path: '', loadChildren: () => import('./game-links/game-links.module').then(m => m.GameLinksModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canLoad: [AdminGuard] },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatInputModule,
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

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/login/login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ShbzakComponent} from "./shbzak/shbzak.component";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";

const routes = [
  {path: '', loadChildren: () => import('./game-links/game-links.module').then(m => m.GameLinksModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    CdkDrag,
    CdkDropList,
    NgClass,
    DatePipe,
  ],
  declarations: [
    LoginComponent,
    ShbzakComponent
  ],
  providers: [
    FormBuilder
  ]
})

export class AppRoutingModule {
}

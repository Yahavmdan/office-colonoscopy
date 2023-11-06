import {NgModule} from "@angular/core";
import {GameLinksComponent} from 'src/app/game-links/game-links.component';
import {RouterModule, Routes} from '@angular/router';
import {Categories} from 'src/app/shared/resolves/Game-Link/categories.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {GameLinkService} from 'src/app/shared/services/Game-Link/game-link.service';
import {MatDialogModule} from '@angular/material/dialog';
import {AuthService} from 'src/app/shared/services/User/auth.service';
import {GameLinkFormComponent} from 'src/app/game-links/game-link-form/game-link-form.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {GameLinkComponent} from './game/game-link.component';
import {GameListComponent} from './game-list/game-list.component';
import {LoginComponent} from "../login/login.component";
import {CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {WheelClickModule} from "../shared/directives/wheel-click.module";
import {ShbzakComponent} from "../shbzak/shbzak.component";

const routes: Routes = [
  {
    path: '',
    component: GameLinksComponent,
    resolve: {categories: Categories}
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'shbzak',
    component: ShbzakComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    NgClass,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TitleCasePipe,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDragHandle,
    WheelClickModule
  ],
  providers: [
    Categories,
    GameLinkService,
    AuthService
  ],
  declarations: [
    GameLinksComponent,
    GameLinkFormComponent,
    GameLinkComponent,
    GameListComponent
  ],
})
export class GameLinksModule {
}

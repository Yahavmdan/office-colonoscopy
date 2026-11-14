import { NgModule } from "@angular/core";
import { GameLinksComponent } from 'src/app/game-links/game-links.component';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { Categories } from 'src/app/shared/resolves/Game-Link/categories.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { GameLinkService } from 'src/app/shared/services/Game-Link/game-link.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { GameLinkFormComponent } from 'src/app/game-links/game-link-form/game-link-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GameLinkComponent } from './game/game-link.component';
import { GameListComponent } from './game-list/game-list.component';
import { LoginComponent } from "../login/login.component";
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";
import { WheelClickModule } from "../shared/directives/wheel-click.module";
import { ShbzakComponent } from "../shbzak/shbzak.component";
import { AdminComponent } from "../admin/admin.component";
import { ConfirmDialogComponent } from "../shared/components/confirm-dialog/confirm-dialog.component";
import { adminGuard, loginGuard } from "../shared/guards/admin.guard";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GameLinksComponent,
    resolve: {categories: Categories},
    title: 'Office Colonoscopy · Daily break games'
  },
  {
    // category view, e.g. /games/geo or /games/all (title set by the component)
    path: 'games/:category',
    component: GameLinksComponent,
    resolve: {categories: Categories}
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    title: 'Admin login · Office Colonoscopy'
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    title: 'Admin · Office Colonoscopy'
  },
  {
    path: 'shbzak',
    component: ShbzakComponent,
    title: 'שבצ"ק'
  },
  {
    path: '**',
    redirectTo: ''
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
    WheelClickModule,
    NgOptimizedImage,
    RouterLink,
    MatSnackBarModule,
    MatTooltipModule,
    MatCheckboxModule
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
    GameListComponent,
    AdminComponent,
    ConfirmDialogComponent
  ],
})
export class GameLinksModule {
}

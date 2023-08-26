import { NgModule } from "@angular/core";
import { GameLinksComponent } from 'src/app/game-links/game-links.component';
import { RouterModule, Routes } from '@angular/router';
import { Categories } from 'src/app/shared/resolves/Game-Link/categories.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { GameLinkService } from 'src/app/shared/services/Game-Link/game-link.service';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { GameLinkFormComponent } from 'src/app/game-links/game-link-form/game-link-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GameLinkComponent } from './game-link/game-link.component';
import { GameCategoryListComponent } from './game-category-list/game-category-list.component';

const routes: Routes = [
  {
    path: '',
    component: GameLinksComponent,
    resolve: {categories: Categories}
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
    MatSelectModule
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
    GameCategoryListComponent
  ],
})
export class GameLinksModule {
}

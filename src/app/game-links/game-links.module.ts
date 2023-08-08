import { NgModule } from "@angular/core";
import {GameLinksComponent} from 'src/app/game-links/game-links.component';
import {RouterModule, Routes} from '@angular/router';
import {GameLinkResolve} from 'src/app/resolves/game-link.resolve';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {GameLinkService} from 'src/app/services/game-link.service';

const routes: Routes = [
  {
    path: '',
    component: GameLinksComponent,
    resolve: {gameLinks: GameLinkResolve}
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  providers: [
    GameLinkResolve,
    GameLinkService
  ],
  declarations: [GameLinksComponent],
})
export class GameLinksModule {
}

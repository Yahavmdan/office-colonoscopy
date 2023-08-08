import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
const routes = [
  { path: '', loadChildren: () => import('./game-links/game-links.module').then(m => m.GameLinksModule) },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  declarations: []
})

export class AppRoutingModule {
}

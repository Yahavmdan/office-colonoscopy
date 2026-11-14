import { GameLinkService } from 'src/app/shared/services/Game-Link/game-link.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Categories as CategoriesModel } from 'src/app/shared/models/Game-Link/category.model';

@Injectable()
export class Categories {
  constructor(private gameLinkService: GameLinkService) {
  }

  /** First load fetches; later route changes (e.g. switching category tabs) reuse the cache. */
  resolve(): Observable<CategoriesModel> {
    const cached = this.gameLinkService.cachedCategories;
    return cached ? of(cached) : this.gameLinkService.getCategories();
  }
}

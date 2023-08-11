
import {GameLinkService} from 'src/app/shared/services/game-link.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Categories as CategoriesModel} from 'src/app/shared/models/category.model';

@Injectable()
export class Categories {
  constructor(private gameLinkService: GameLinkService) {
  }
  resolve(): Observable<CategoriesModel> {
    return this.gameLinkService.getCategories();
  }
}

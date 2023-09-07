import { Component, Input } from '@angular/core';
import { GameLink } from "../../shared/models/Game-Link/game-link.model";
import { GameLinkService } from "../../shared/services/Game-Link/game-link.service";

@Component({
  selector: 'app-game',
  templateUrl: './game-link.component.html',
  styleUrls: ['./game-link.component.scss']
})
export class GameLinkComponent {

  @Input() data: { link: GameLink, isAdmin: boolean };

  constructor(private gameLinkService: GameLinkService) {
  }

  public nav(game: GameLink): void {
    this.gameLinkService.increaseClickCount(game.id).subscribe((res: boolean): void => {
      if (res) {
        this.data.link.clickCount++
      }
    })
    window.open(game.link, '_blank');
    this.data.link.clicked = true;
  }

  public setSubCategory(subCategory: string): string {
    let base: string = 'mx-1 bi'
    switch (subCategory) {
      case 'map':return base += ' bi-map text-grey3';
      case 'geography':return base += ' bi-globe2 text-grey3';
      case 'picture':return base += ' bi-card-image text-grey3';
      case 'language':return base += ' bi-translate text-grey3';
      case 'puzzle':return base += ' bi-puzzle text-grey3';
      case 'quiz':return base += ' bi-question-circle text-grey3';
      case 'movies':return base += ' bi-film text-grey3';
      case 'flag':return base += ' bi-flag text-grey3';
    }
    return base;
  }

}




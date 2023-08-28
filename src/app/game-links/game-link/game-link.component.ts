import { Component, Input } from '@angular/core';
import { GameLink } from "../../shared/models/Game-Link/game-link.model";

@Component({
  selector: 'app-game-link',
  templateUrl: './game-link.component.html',
  styleUrls: ['./game-link.component.scss']
})
export class GameLinkComponent {

  protected readonly JSON = JSON;
  @Input() gameLink: GameLink

  public nav(game: GameLink): void {
    window.open(game.link, '_blank');
    this.gameLink.clicked = true;
    this.gameLink.clickCount++
  }

  public setSubCategory(sc: string): string {
    let base = 'mx-1 bi'
      switch (sc) {
        case 'map': return base += ' bi-map';
        case 'geography': return base += ' bi-globe2';
        case 'picture': return base += ' bi-card-image';
        case 'language': return base += ' bi-translate';
        case 'puzzle': return base += ' bi-puzzle';
        case 'quiz': return base += ' bi-question-circle';
        case 'movies': return base += ' bi-film';
        case 'flag': return base += ' bi-flag';
      }
      return ''
  }

}




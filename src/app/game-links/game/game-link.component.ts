import { Component, Input } from '@angular/core';
import { GameLink } from "../../shared/models/Game-Link/game-link.model";
import { GameLinkService } from "../../shared/services/Game-Link/game-link.service";
import { markPlayed } from "../../shared/played";

const SUB_CATEGORY_ICONS: Record<string, string> = {
  map: 'bi-map',
  geography: 'bi-globe2',
  picture: 'bi-card-image',
  language: 'bi-translate',
  puzzle: 'bi-puzzle',
  quiz: 'bi-question-circle',
  movies: 'bi-film',
  video: 'bi-play-btn',
  flag: 'bi-flag',
};

@Component({
  selector: 'app-game',
  templateUrl: './game-link.component.html',
  styleUrls: ['./game-link.component.scss']
})
export class GameLinkComponent {

  @Input() data: { link: GameLink, isAdmin: boolean };

  constructor(private gameLinkService: GameLinkService) {
  }

  /** Counts the click and marks the game as played; the anchor itself opens the tab. */
  public nav(game: GameLink): void {
    this.gameLinkService.increaseClickCount(game.id).subscribe((res: boolean): void => {
      if (res) {
        this.data.link.clickCount++;
      }
    });
    this.data.link.clicked = true;
    markPlayed([game.id]);
  }

  public setGamePic(game: GameLink): string {
    return 'assets/images/game-pic/' + (game.image ? game.image : 'null.png');
  }

  public onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('null.png')) {
      img.src = 'assets/images/game-pic/null.png';
    }
  }

  public subCategoryIcon(subCategory: string): string {
    return 'bi ' + (SUB_CATEGORY_ICONS[subCategory] || 'bi-dot');
  }

  public get clicks(): string {
    const n = this.data.link.clickCount;
    return n > 999 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  }
}

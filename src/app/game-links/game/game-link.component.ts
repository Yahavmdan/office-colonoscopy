import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GameLink } from "../../shared/models/Game-Link/game-link.model";
import { GameLinkService } from "../../shared/services/Game-Link/game-link.service";
import { markPlayed, unmarkPlayed } from "../../shared/played";

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

// Sites that send X-Frame-Options / frame-ancestors and render as an error page inside an iframe.
// The browser can't tell us this from JS, so they're listed here and keep the placeholder image.
const NO_FRAME_HOSTS = ['mapgame.net', 'histordle.com'];

function canFrame(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return /^https?:/.test(url) && !NO_FRAME_HOSTS.some(h => host === h || host.endsWith('.' + h));
  } catch {
    return false;
  }
}

@Component({
  selector: 'app-game',
  templateUrl: './game-link.component.html',
  styleUrls: ['./game-link.component.scss']
})
export class GameLinkComponent implements OnChanges {

  @Input() data: { link: GameLink, isAdmin: boolean };
  public previewUrl: SafeResourceUrl | null = null;

  constructor(private gameLinkService: GameLinkService,
              private sanitizer: DomSanitizer) {
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

  ngOnChanges(): void {
    const link = this.data?.link;
    // computed once per input change: a fresh SafeResourceUrl on every check would reload the iframe
    this.previewUrl = link && !link.image && canFrame(link.link)
      ? this.sanitizer.bypassSecurityTrustResourceUrl(link.link)
      : null;
  }

  public unplay(): void {
    this.data.link.clicked = false;
    unmarkPlayed([this.data.link.id]);
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

import { Component, Input } from '@angular/core';
import { GameLink } from "../../shared/models/Game-Link/game-link.model";

@Component({
  selector: 'app-game-link',
  templateUrl: './game-link.component.html',
  styleUrls: ['./game-link.component.scss']
})
export class GameLinkComponent {

  @Input() gameLink: GameLink

  public nav(link: string): void {
    window.open(link, '_blank');
  }
}

import { Component, Input } from '@angular/core';
import { GameLink } from "../../shared/models/Game-Link/game-link.model";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})

export class GameListComponent {

  @Input() data: {link: GameLink, isAdmin: boolean};


}

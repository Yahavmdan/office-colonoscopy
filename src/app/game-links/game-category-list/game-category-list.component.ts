import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GameLink } from "../../shared/models/Game-Link/game-link.model";
import { GameLinkService } from "../../shared/services/Game-Link/game-link.service";

@Component({
  selector: 'app-game-category-list',
  templateUrl: './game-category-list.component.html',
  styleUrls: ['./game-category-list.component.scss']
})
export class GameCategoryListComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: GameLink[],
              private gameLinkService: GameLinkService) {
  }

  public handleClick(id: number): void {
    this.gameLinkService.increaseClickCount(id).subscribe((res: boolean) => res);
  }

}

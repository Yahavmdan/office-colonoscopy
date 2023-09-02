import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameLink } from "../../shared/models/Game-Link/game-link.model";
import { MatDialog } from "@angular/material/dialog";
import { GameLinkFormComponent } from "../game-link-form/game-link-form.component";
import { GameLinkService } from "../../shared/services/Game-Link/game-link.service";

@Component({
  selector: 'app-game',
  templateUrl: './game-link.component.html',
  styleUrls: ['./game-link.component.scss']
})
export class GameLinkComponent {

  constructor(private dialog: MatDialog,
              private gameLinkService: GameLinkService) {
  }

  @Input() data: { link: GameLink, isAdmin: boolean };

  public nav(game: GameLink): void {
    this.gameLinkService.increaseClickCount(game.id).subscribe(res => {
      this.data.link.clickCount++
    })
    window.open(game.link, '_blank');
    this.data.link.clicked = true;
  }

  edit(gameLink: GameLink): void {
    this.dialog.open(GameLinkFormComponent, {
      width: '500px',
      height: '600px',
      data: {gameLink}
    }).afterClosed().subscribe(res => {
      if (res) {
        this.gameLinkService.getCategories().subscribe(categories => {
        })
      }
    });
  }

  delete(gameLinkId: number): void {
    this.gameLinkService.delete(gameLinkId).subscribe(isDeleted => {
      if (isDeleted) {
        this.gameLinkService.getCategories().subscribe(categories => {
        })
      }
    })
  }

  public setSubCategory(sc: string): string {
    let base: string = 'mx-1 bi'
      switch (sc) {
        case 'map': return base += ' bi-map text-grey3';
        case 'geography': return base += ' bi-globe2 text-grey3';
        case 'picture': return base += ' bi-card-image text-grey3';
        case 'language': return base += ' bi-translate text-grey3';
        case 'puzzle': return base += ' bi-puzzle text-grey3';
        case 'quiz': return base += ' bi-question-circle text-grey3';
        case 'movies': return base += ' bi-film text-grey3';
        case 'flag': return base += ' bi-flag text-grey3';
      }
      return ''
  }

}




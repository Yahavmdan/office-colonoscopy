import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, GameLink } from "../../shared/models/Game-Link/game-link.model";
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
  @Output() changed: EventEmitter<{ changed: boolean, category: Category }> = new EventEmitter;

  public nav(game: GameLink): void {
    this.gameLinkService.increaseClickCount(game.id).subscribe((res: boolean): void => {
      if (res) {
        this.data.link.clickCount++
      }
    })
    window.open(game.link, '_blank');
    this.data.link.clicked = true;
  }

  public edit(gameLink: GameLink): void {
    this.dialog.open(GameLinkFormComponent, {
      width: '500px',
      height: '600px',
      data: {gameLink},
      autoFocus: false
    }).afterClosed()
      .subscribe(res => {
        if (res) {
          this.gameLinkService.getCategories()
            .subscribe(() => this.changed.emit({changed: res, category: gameLink.category}))
        }
      })
  }

  public delete(gameLink: GameLink): void {
    let answer: boolean = confirm('Are you sure you want to delete?');
    if (!answer) return;
    this.gameLinkService.delete(gameLink.id).subscribe(isDeleted => {
      if (isDeleted) {
        this.gameLinkService.getCategories()
          .subscribe(() => this.changed.emit({changed: isDeleted, category: gameLink.category}))
      }
    })
  }

  public setSubCategory(sc: string): string {
    let base: string = 'mx-1 bi'
    switch (sc) {
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




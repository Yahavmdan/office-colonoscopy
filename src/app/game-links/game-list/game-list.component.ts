import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, GameLink } from "../../shared/models/Game-Link/game-link.model";
import { GameLinkFormComponent } from "../game-link-form/game-link-form.component";
import { MatDialog } from "@angular/material/dialog";
import { GameLinkService } from "../../shared/services/Game-Link/game-link.service";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html'
})

export class GameListComponent {

  @Input() data: { link: GameLink, isAdmin: boolean };
  @Output() change: EventEmitter<{ changed: boolean, category: Category }> =
    new EventEmitter<{ changed: boolean, category: Category }>();
  @Output() dragging: EventEmitter<boolean> = new EventEmitter();
  @Output() dropping: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MatDialog,
              private gameLinkService: GameLinkService) {
  }

  public edit(link: GameLink): void {
    this.dialog.open(GameLinkFormComponent, {
      width: '500px',
      height: '600px',
      data: { link },
      autoFocus: false
    }).afterClosed()
      .subscribe(res => {
        if (res) {
          this.gameLinkService.getCategories()
            .subscribe(() => this.change
              .emit({changed: res.changed.message === 'Success', category: res.category}))
        }
      })
  }

  public delete(gameLink: GameLink): void {
    let answer: boolean = confirm('Are you sure you want to delete?');
    if (!answer) return;
    this.gameLinkService.delete(gameLink.id).subscribe(isDeleted => {
      if (isDeleted) {
        this.gameLinkService.getCategories()
          .subscribe(() => this.change
            .emit({changed: isDeleted, category: gameLink.category}))
      }
    })
  }

  public drag(): void {
    this.dragging.emit(true);
  }

  public drop(): void {
    this.dropping.emit(false);
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, GameLink } from "../../shared/models/Game-Link/game-link.model";
import { GameLinkFormComponent } from "../game-link-form/game-link-form.component";
import { MatDialog } from "@angular/material/dialog";
import { GameLinkService } from "../../shared/services/Game-Link/game-link.service";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";

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
      width: '520px',
      maxWidth: '95vw',
      data: { link },
      autoFocus: false
    }).afterClosed()
      .subscribe(res => {
        if (res?.changed) {
          this.change.emit({changed: true, category: res.category});
        }
      })
  }

  public delete(gameLink: GameLink): void {
    ConfirmDialogComponent.open(this.dialog, `Delete "${gameLink.name}"?`)
      .subscribe((yes: boolean): void => {
        if (!yes) return;
        this.gameLinkService.delete(gameLink.id).subscribe(() =>
          this.change.emit({changed: true, category: gameLink.category}));
      });
  }

}

import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GameLink } from "../../shared/models/Game-Link/game-link.model";

@Component({
  selector: 'app-game-category-list',
  templateUrl: './game-category-list.component.html',
  styleUrls: ['./game-category-list.component.scss']
})
export class GameCategoryListComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { categories: GameLink[], isAdmin: boolean },
              public dialogRef: MatDialogRef<GameCategoryListComponent> ) {
  }

  public changed(event: boolean): void {
    this.dialogRef.close(event);
  }
}

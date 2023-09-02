import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, GameLink } from "../../shared/models/Game-Link/game-link.model";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})

export class GameListComponent {

  @Input() data: { link: GameLink, isAdmin: boolean };
  @Output() change: EventEmitter<{ changed: boolean, category: Category }> = new EventEmitter<{ changed: boolean, category: Category }>()

  public changed(event: { changed: boolean, category: Category }): void {
    this.change.emit(event)
  }

}

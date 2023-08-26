import { GameLink } from 'src/app/shared/models/Game-Link/game-link.model';

export interface Categories {
  geo: GameLink[];
  movies: GameLink[];
  word: GameLink[];
  "video-game": GameLink[];
  other: GameLink[]
}

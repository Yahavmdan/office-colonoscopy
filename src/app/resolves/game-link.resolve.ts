import {Resolve} from '@angular/router';
import {GameLinkService} from 'src/app/services/game-link.service';
import {Injectable} from '@angular/core';

@Injectable()
export class GameLinkResolve implements Resolve<any> {
  constructor(private gameLinkService: GameLinkService) {
  }
  resolve() {
    return this.gameLinkService.getGameLinks();
  }
}

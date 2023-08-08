import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GameLink} from 'src/app/models/game-link.model';
import {environmentUrl} from 'src/environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class GameLinkService {
  path = environmentUrl.api + '/gameLink';
  constructor(private http: HttpClient) {
  }

  getGameLinks(): Observable<GameLink[]> {
    return this.http.get<GameLink[]>(this.path);
  }
}

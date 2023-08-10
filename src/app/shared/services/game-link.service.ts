import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {GameLink} from 'src/app/shared/models/game-link.model';
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

  login(value: any) {
    return this.http.post<{token: string}>(this.path + '/login', value);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}

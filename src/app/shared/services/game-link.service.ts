import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GameLink} from 'src/app/shared/models/game-link.model';
import {environmentUrl} from 'src/environments/environment';
import {Injectable} from '@angular/core';
import {AuthService} from 'src/app/shared/services/auth.service';
import {Categories} from 'src/app/shared/models/category.model';

@Injectable()
export class GameLinkService {
  path = environmentUrl.api + '/gameLink';
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getCategories(): Observable<Categories> {
    return this.http.get<Categories>(this.path);
  }

  add(gameLink: any): Observable<boolean> {
    return this.http.post<boolean>(this.path, gameLink, this.getHeaders());
  }

  update(gameLink: any, gameLinkId: number): Observable<boolean> {
    return this.http.put<boolean>(this.path + '/' + gameLinkId, gameLink, this.getHeaders());
  }

  private getHeaders(): {headers: HttpHeaders} {
    console.log(this.authService.getUserSData());
    const headers = new HttpHeaders({
      Authorization: this.authService.getUserSData()?.token ? this.authService.getUserSData()?.token : ''
    });

    return {headers};
  }

  delete(gameLinkId: number) {
    return this.http.delete<boolean>(this.path + '/' + gameLinkId, this.getHeaders());
  }

  increaseClickCount(gameLinkId: number): Observable<boolean> {
    return this.http.put<boolean>(this.path + '/increase/' + gameLinkId, {});
  }

  increaseClickCountByCategory(category: string) {
    return this.http.put<boolean>(this.path + '/increaseByCategory', {category})
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentUrl } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/services/User/auth.service';
import { Categories } from 'src/app/shared/models/Game-Link/category.model';
import { Category, GameLink } from "../../models/Game-Link/game-link.model";

@Injectable()
export class GameLinkService {
  path: string = environmentUrl.api + '/gameLink';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  public getCategories(): Observable<Categories> {
    return this.http.get<Categories>(this.path);
  }

  public getLinksByCategory(category: Category): Observable<GameLink[]> {
    return this.http.get<GameLink[]>(this.path + '/' + category);
  }

  public add(gameLink: any): Observable<boolean> {
    return this.http.post<boolean>(this.path, gameLink, {headers: this.getHeaders()});
  }

  public update(gameLink: any, gameLinkId: number): Observable<boolean> {
    return this.http.put<boolean>(this.path + '/' + gameLinkId, gameLink, {headers: this.getHeaders()});
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.authService.getUserSData()?.token ? this.authService.getUserSData()?.token : ''
    });
  }

  public delete(gameLinkId: number): Observable<boolean> {
    return this.http.delete<boolean>(this.path + '/' + gameLinkId, {headers: this.getHeaders()});
  }

  public increaseClickCount(gameLinkId: number): Observable<boolean> {
    return this.http.put<boolean>(this.path + '/increase/' + gameLinkId, {});
  }

}

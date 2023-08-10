import {Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment} from '@angular/router';

@Injectable()
export class AdminGuard implements CanLoad {
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return !!localStorage.getItem('user');
  }
}

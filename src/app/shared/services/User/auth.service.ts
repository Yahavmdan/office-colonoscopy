import { Injectable } from '@angular/core';
import { delay, of, Subject, Subscription } from 'rxjs';
import { environmentUrl } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from 'src/app/shared/models/User/auth-user.model';

@Injectable()
export class AuthService {
  path = environmentUrl.api + '/auth';
  tokenSubscription = new Subscription();
  isAdminAuthenticated = new Subject<boolean>();
  private userData: any;

  constructor(private http: HttpClient) {
  }

  public login(userCredentials: any) {
    return this.http.post<AuthUser>(this.path + '/login', userCredentials);
  }

  public storeUserData(authUser: AuthUser): void {
    localStorage.setItem('user', JSON.stringify(authUser));
    this.isAdminAuthenticated.next(true);
  }

  public autoLogout(): void {
    this.setUserData();
    if (!this.userData.hasOwnProperty('token')) {
      this.isAdminAuthenticated.next(false);
      return;
    }
    const timeout = ((+this.userData.tokenExpirationAt * 1000) - new Date().getTime());
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe(() => {
      this.logout();
    })
  }

  public logout(): void {
    this.tokenSubscription.unsubscribe();
    this.isAdminAuthenticated.next(false);
    localStorage.removeItem('user');
    this.userData = null;
  }

  public setUserData(): void {
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  }

  public getUserSData(): any {
    return this.userData;
  }

  public autoLogin(): void {
    this.setUserData();
    if (!this.userData.hasOwnProperty('token')) {
      this.isAdminAuthenticated.next(false);
      return;
    }

    this.isAdminAuthenticated.next(true);

  }

}

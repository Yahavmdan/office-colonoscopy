import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/User/auth.service';

/** Lets only a logged-in admin with a non-expired token into admin routes. */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.hasValidToken()) {
    return true;
  }
  authService.logout();
  return inject(Router).createUrlTree(['/login']);
};

/** Already logged in? Skip the login form and go straight to the admin panel. */
export const loginGuard: CanActivateFn = () => {
  return inject(AuthService).hasValidToken()
    ? inject(Router).createUrlTree(['/admin'])
    : true;
};

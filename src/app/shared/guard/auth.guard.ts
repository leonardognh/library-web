import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.getUserLoggedIn()) return true;

  return redirecionarParaLogin(authService, router);
};

const redirecionarParaLogin = (authService: AuthService, router: Router) => {
  authService.logout();
  router.navigate(['/login']);
  return false;
};

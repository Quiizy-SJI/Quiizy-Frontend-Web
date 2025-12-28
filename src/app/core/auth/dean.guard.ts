import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthStoreService } from './auth-store.service';

export const deanGuard: CanActivateFn = () => {
  const store = inject(AuthStoreService);
  const router = inject(Router);

  const session = store.getSession();
  if (!session) {
    return router.parseUrl('/login');
  }

  if (session.user.role !== 'DEAN') {
    return router.parseUrl('/login');
  }

  return true;
};

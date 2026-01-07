import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStoreService } from './auth-store.service';

export const roleRedirectGuard: CanActivateFn = () => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  const session = authStore.getSession();
  
  if (!session) {
    void router.navigateByUrl('/login');
    return false;
  }

  // Redirect based on user role
  switch (session.user?.role) {
    case 'DEAN':
      void router.navigateByUrl('/dean');
      break;
    case 'TEACHER':
      void router.navigateByUrl('/teacher');
      break;
    case 'SPECIALITY_HEAD':
      // Add mini-admin route when implemented
      void router.navigateByUrl('/head');
      break;
    case 'STUDENT':
      // Add student route when implemented
      void router.navigateByUrl('/showcase');
      break;
    default:
      void router.navigateByUrl('/login');
      break;
  }

  return false; // Always return false since we're redirecting
};
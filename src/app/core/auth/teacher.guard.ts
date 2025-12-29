import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStoreService } from './auth-store.service';

export const teacherGuard: CanActivateFn = () => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  const session = authStore.getSession();
  
  if (!session) {
    void router.navigateByUrl('/login');
    return false;
  }

  // Check if user has teacher role
  if (session.user?.role !== 'TEACHER') {
    void router.navigateByUrl('/login');
    return false;
  }

  return true;
};
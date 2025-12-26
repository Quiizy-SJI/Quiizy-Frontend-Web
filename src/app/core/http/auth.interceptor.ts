import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { APP_CONFIG } from '../config/app-config';
import { AuthStoreService } from '../auth/auth-store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStoreService);
  const config = inject(APP_CONFIG);

  const token = authStore.getAccessToken();
  const base = config.apiBaseUrl.replace(/\/$/, '');

  const shouldAttach =
    !!token &&
    req.url.startsWith(base) &&
    !req.headers.has('Authorization');

  if (!shouldAttach) return next(req);

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};

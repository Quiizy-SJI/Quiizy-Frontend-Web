import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { APP_CONFIG } from '../config/app-config';
import { AuthStoreService } from '../auth/auth-store.service';
import { AuthService } from '../auth/auth.service';

// Shared state for token refresh coordination
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStoreService);
  const authService = inject(AuthService);
  const config = inject(APP_CONFIG);

  const token = authStore.getAccessToken();
  const base = config.apiBaseUrl.replace(/\/$/, '');

  // Don't intercept non-API requests or requests that already have auth
  if (!req.url.startsWith(base)) {
    return next(req);
  }

  // Skip token refresh for auth endpoints to prevent infinite loops
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

  const shouldAttach = !!token && !req.headers.has('Authorization') && !isAuthEndpoint;

  const authReq = shouldAttach
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthEndpoint) {
        return handle401Error(authReq, next, authStore, authService);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Handle 401 errors by attempting to refresh the token and retry the request.
 * Uses a lock mechanism to prevent multiple simultaneous refresh attempts.
 */
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authStore: AuthStoreService,
  authService: AuthService
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authStore.getSession()?.tokens.refreshToken;

    if (!refreshToken) {
      // No refresh token available, force logout
      isRefreshing = false;
      authStore.clear();
      return throwError(() => new Error('Session expired. Please login again.'));
    }

    return authService.refreshTokens(refreshToken).pipe(
      switchMap((newTokens) => {
        isRefreshing = false;
        refreshTokenSubject.next(newTokens.accessToken);

        // Retry the original request with the new token
        return next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${newTokens.accessToken}` },
          })
        );
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);

        // Refresh failed, clear session and redirect to login
        authStore.clear();
        return throwError(() => new Error('Session expired. Please login again.'));
      })
    );
  } else {
    // Another request is already refreshing the token, wait for it
    return refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) =>
        next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        )
      )
    );
  }
}

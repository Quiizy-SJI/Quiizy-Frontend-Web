import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import type { LoginRequest } from '../../domain/dtos/login.dto';
import { ApiClientService } from '../http/api-client.service';
import { toStringRequired } from '../utils/payload-sanitizer';
import { AuthStoreService } from './auth-store.service';
import type { AuthResponse, AuthSession, AuthTokens } from './auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly api: ApiClientService,
    private readonly store: AuthStoreService,
  ) {}

  login(request: LoginRequest): Observable<AuthSession> {
    const payload: Record<string, unknown> = {
      identifier: toStringRequired(request.identifier),
      password: toStringRequired(request.password),
      role: toStringRequired(request.role),
    };
    if (request.rememberMe !== undefined) {
      payload['rememberMe'] = Boolean(request.rememberMe);
    }
    return this.api.post<AuthResponse>('/auth/login', payload).pipe(
      map((res) => ({
        user: res.user,
        tokens: res.tokens,
        createdAt: new Date().toISOString(),
      })),
      tap((session) => this.store.setSession(session)),
    );
  }

  /**
   * Refresh the access token using the refresh token.
   * Updates the stored session with new tokens.
   */
  refreshTokens(refreshToken: string): Observable<AuthTokens> {
    const payload: Record<string, unknown> = {
      refreshToken: toStringRequired(refreshToken),
    };
    return this.api.post<AuthTokens>('/auth/refresh', payload).pipe(
      tap((tokens) => {
        const currentSession = this.store.getSession();
        if (currentSession) {
          this.store.setSession({
            ...currentSession,
            tokens,
          });
        }
      }),
    );
  }

  logout(): Observable<void> {
    // Always clear local session even if backend rejects the token.
    return this.api
      .post<{ message: string }>('/auth/logout', {})
      .pipe(
        map(() => void 0),
        finalize(() => this.store.clear()),
      );
  }
}

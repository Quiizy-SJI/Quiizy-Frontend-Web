import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { finalize, map, mapTo, tap } from 'rxjs/operators';
import type { LoginRequest } from '../../domain/dtos/login.dto';
import { ApiClientService } from '../http/api-client.service';
import { AuthStoreService } from './auth-store.service';
import type { AuthResponse, AuthSession } from './auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly api: ApiClientService,
    private readonly store: AuthStoreService,
  ) {}

  login(request: LoginRequest): Observable<AuthSession> {
    return this.api.post<AuthResponse>('/auth/login', request).pipe(
      map((res) => ({
        user: res.user,
        tokens: res.tokens,
        createdAt: new Date().toISOString(),
      })),
      tap((session) => this.store.setSession(session)),
    );
  }

  logout(): Observable<void> {
    // Always clear local session even if backend rejects the token.
    return this.api
      .post<{ message: string }>('/auth/logout', {})
      .pipe(
        mapTo(void 0),
        finalize(() => this.store.clear()),
      );
  }
}

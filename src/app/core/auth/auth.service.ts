import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import type { Observable } from 'rxjs';
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

  logout(): void {
    this.store.clear();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import type { AuthSession } from './auth-models';

const STORAGE_KEY = 'quiizy.auth.session.v1';

@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(
    this.loadSession(),
  );

  readonly session$ = this.sessionSubject.asObservable();

  constructor(private readonly storage: StorageService) {}

  getSession(): AuthSession | null {
    return this.sessionSubject.value;
  }

  getAccessToken(): string | null {
    return this.sessionSubject.value?.tokens.accessToken ?? null;
  }

  setSession(session: AuthSession): void {
    this.sessionSubject.next(session);
    this.storage.set(STORAGE_KEY, JSON.stringify(session));
  }

  clear(): void {
    this.sessionSubject.next(null);
    this.storage.remove(STORAGE_KEY);
  }

  private loadSession(): AuthSession | null {
    const raw = this.storage.get(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      this.storage.remove(STORAGE_KEY);
      return null;
    }
  }
}

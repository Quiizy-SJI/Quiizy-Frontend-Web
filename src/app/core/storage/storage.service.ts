import { Injectable } from '@angular/core';

export interface KeyValueStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService implements KeyValueStorage {
  private readonly hasLocalStorage = typeof localStorage !== 'undefined';

  get(key: string): string | null {
    if (!this.hasLocalStorage) return null;
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    if (!this.hasLocalStorage) return;
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    if (!this.hasLocalStorage) return;
    localStorage.removeItem(key);
  }
}

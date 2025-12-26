import { Injectable, signal, effect } from '@angular/core';
import { StorageService } from '../core/storage/storage.service';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'quizzy-theme';

  theme = signal<Theme>('light');

  constructor(private readonly storage: StorageService) {
    this.theme.set(this.getInitialTheme());
    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);
      this.storage.set(this.STORAGE_KEY, theme);
    });
  }

  private getInitialTheme(): Theme {
    const stored = this.storage.get(this.STORAGE_KEY) as Theme | null;
    if (stored) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggle(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }
}

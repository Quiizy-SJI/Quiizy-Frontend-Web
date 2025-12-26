import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, finalize } from 'rxjs/operators';

import {
  ButtonComponent,
  TabsComponent,
  type TabItem,
} from '../../../components/ui';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthStoreService } from '../../../core/auth/auth-store.service';

@Component({
  selector: 'app-dean-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, TabsComponent],
  templateUrl: './dean-layout.html',
  styleUrl: './dean-layout.scss',
})
export class DeanLayout {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStoreService);
  private readonly destroyRef = inject(DestroyRef);

  logoutLoading = false;
  errorMessage = '';

  readonly session = computed(() => this.authStore.getSession());

  readonly tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'academic-years', label: 'Academic Years' },
    { id: 'semesters', label: 'Semesters' },
    { id: 'exam-types', label: 'Exam Types' },
    { id: 'teaching-units', label: 'Teaching Units' },
    { id: 'mini-admins', label: 'Mini Admins' },
    { id: 'ai-analytics', label: 'AI Analytics' },
  ];

  activeTab: TabItem['id'] = 'dashboard';

  constructor() {
    this.syncTabFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.syncTabFromUrl(e.urlAfterRedirects));
  }

  private syncTabFromUrl(url: string): void {
    if (url.includes('/dean/academic-years')) this.activeTab = 'academic-years';
    else if (url.includes('/dean/semesters')) this.activeTab = 'semesters';
    else if (url.includes('/dean/exam-types')) this.activeTab = 'exam-types';
    else if (url.includes('/dean/teaching-units')) this.activeTab = 'teaching-units';
    else if (url.includes('/dean/mini-admins')) this.activeTab = 'mini-admins';
    else if (url.includes('/dean/ai-analytics')) this.activeTab = 'ai-analytics';
    else this.activeTab = 'dashboard';
  }

  onTabChange(tabId: string | number): void {
    const nextTabId = String(tabId);
    this.activeTab = nextTabId;

    switch (nextTabId) {
      case 'dashboard':
        void this.router.navigateByUrl('/dean');
        break;
      case 'academic-years':
        void this.router.navigateByUrl('/dean/academic-years');
        break;
      case 'semesters':
        void this.router.navigateByUrl('/dean/semesters');
        break;
      case 'exam-types':
        void this.router.navigateByUrl('/dean/exam-types');
        break;
      case 'teaching-units':
        void this.router.navigateByUrl('/dean/teaching-units');
        break;
      case 'mini-admins':
        void this.router.navigateByUrl('/dean/mini-admins');
        break;
      case 'ai-analytics':
        void this.router.navigateByUrl('/dean/ai-analytics');
        break;
    }
  }

  onLogout(): void {
    this.errorMessage = '';
    this.logoutLoading = true;

    this.authService
      .logout()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.logoutLoading = false;
        }),
      )
      .subscribe({
        next: async () => {
          await this.router.navigateByUrl('/login');
        },
        error: (err: unknown) => {
          this.errorMessage = err instanceof Error ? err.message : 'Logout failed.';
        },
      });
  }
}

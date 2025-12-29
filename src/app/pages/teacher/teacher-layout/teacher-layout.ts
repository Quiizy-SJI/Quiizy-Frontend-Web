import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, ChangeDetectorRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, finalize } from 'rxjs/operators';

import { type TabItem } from '../../../components/ui';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthStoreService } from '../../../core/auth/auth-store.service';
import { SidebarComponent } from '../../../components/navigation/sidebar/sidebar.component';
import { TopbarComponent } from '../../../components/navigation/topbar/topbar.component';

@Component({
  selector: 'app-teacher-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent],
  templateUrl: './teacher-layout.html',
  styleUrl: './teacher-layout.scss',
})
export class TeacherLayout implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStoreService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  logoutLoading = false;
  errorMessage = '';

  readonly session = computed(() => this.authStore.getSession());

  readonly tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'exam-manager', label: 'Exam Manager' },
    { id: 'sentiment-review', label: 'Sentiment Review' },
    { id: 'question-bank', label: 'Question Bank' },
    { id: 'mock-tests', label: 'Mock Tests' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'create-exam', label: 'Create Exam' },
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

  // Sidebar state
  isCollapsed = false;
  isMobile = window.innerWidth <= 900;
  mobileOpen = false;

  menuItems = [
    { id: 'dashboard', label: 'Dashboard', route: '/teacher', icon: 'dashboard' },
    { id: 'exam-manager', label: 'Exam Manager', route: '/teacher/exam-manager', icon: 'assignment' },
    { id: 'sentiment-review', label: 'Sentiment Review', route: '/teacher/sentiment-review', icon: 'sentiment_satisfied' },
    { id: 'question-bank', label: 'Question Bank', route: '/teacher/question-bank', icon: 'quiz' },
    { id: 'mock-tests', label: 'Mock Tests', route: '/teacher/mock-tests', icon: 'psychology' },
    { id: 'statistics', label: 'Statistics', route: '/teacher/statistics', icon: 'analytics' },
    { id: 'create-exam', label: 'Create Exam', route: '/teacher/create-exam', icon: 'add_circle' },
  ];

  get currentTitle(): string {
    return this.tabs.find((t) => t.id === this.activeTab)?.label ?? 'Dashboard';
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth <= 900;
    if (!this.isMobile) this.mobileOpen = false;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    try {
      localStorage.setItem('teacher.sidebar.collapsed', String(this.isCollapsed));
    } catch {}
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile(): void {
    if (this.isMobile) this.mobileOpen = false;
  }

  private syncTabFromUrl(url: string): void {
    if (url.includes('/teacher/exam-manager')) this.activeTab = 'exam-manager';
    else if (url.includes('/teacher/sentiment-review')) this.activeTab = 'sentiment-review';
    else if (url.includes('/teacher/question-bank')) this.activeTab = 'question-bank';
    else if (url.includes('/teacher/mock-tests')) this.activeTab = 'mock-tests';
    else if (url.includes('/teacher/statistics')) this.activeTab = 'statistics';
    else if (url.includes('/teacher/create-exam')) this.activeTab = 'create-exam';
    else this.activeTab = 'dashboard';
  }

  onTabChange(tabId: string | number): void {
    const nextTabId = String(tabId);
    this.activeTab = nextTabId;

    switch (nextTabId) {
      case 'dashboard':
        void this.router.navigateByUrl('/teacher');
        break;
      case 'exam-manager':
        void this.router.navigateByUrl('/teacher/exam-manager');
        break;
      case 'sentiment-review':
        void this.router.navigateByUrl('/teacher/sentiment-review');
        break;
      case 'question-bank':
        void this.router.navigateByUrl('/teacher/question-bank');
        break;
      case 'mock-tests':
        void this.router.navigateByUrl('/teacher/mock-tests');
        break;
      case 'statistics':
        void this.router.navigateByUrl('/teacher/statistics');
        break;
      case 'create-exam':
        void this.router.navigateByUrl('/teacher/create-exam');
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
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: async () => {
          await this.router.navigateByUrl('/login');
        },
        error: (err: unknown) => {
          this.errorMessage = err instanceof Error ? err.message : 'Logout failed.';
          this.cdr.markForCheck();
        },
      });
  }

  ngOnInit(): void {
    // Load persisted collapse state; if none, set responsive defaults
    const saved = (() => {
      try {
        return localStorage.getItem('teacher.sidebar.collapsed');
      } catch {
        return null;
      }
    })();

    const width = window.innerWidth;
    this.isMobile = width <= 900;

    if (saved === 'true' || saved === 'false') {
      this.isCollapsed = saved === 'true';
    } else {
      // Defaults: tablet collapsed, desktop expanded, mobile ignored (overlay)
      if (!this.isMobile && width <= 1200) {
        this.isCollapsed = true;
      } else {
        this.isCollapsed = false;
      }
    }
  }
}
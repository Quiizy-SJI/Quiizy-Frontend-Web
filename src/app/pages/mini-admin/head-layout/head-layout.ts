import { ChangeDetectorRef, Component, computed, DestroyRef, HostListener, inject } from '@angular/core';
import { TopbarComponent } from "../../../components/navigation/topbar/topbar.component";
import { SidebarComponent } from "../../../components/navigation/sidebar/sidebar.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, finalize } from 'rxjs';
import { TabItem } from '../../../components/ui';
import { AuthService, AuthStoreService } from '../../../services';

@Component({
  selector: 'app-head-layout',
  imports: [TopbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './head-layout.html',
  styleUrl: './head-layout.scss',
})
export class HeadLayout {
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
    { id: 'classes', label: 'Classes'},
    { id: 'students', label: 'Students' },
    { id: 'courses', label: 'Courses' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'sentiment-analysis', label: 'Sentiment Analysis' },
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
    { id: 'dashboard', label: 'Dashboard', route: '/head/', icon: 'dashboard' },
    { id: 'classes', label: 'Classes', route: '/head/classes', icon: 'school' },
    { id: 'students', label: 'Students', route: '/head/students', icon: 'badge' },
    { id: 'courses', label: 'Courses', route: '/head/courses', icon: 'menu_book' },
    { id: 'teachers', label: 'Teachers', route: '/head/teachers', icon: 'menu_book' },
    { id: 'sentiment-analysis', label: 'Sentiment Analysis', route: '/head/sentiment-analysis', icon: 'insights' },
  ];

   private syncTabFromUrl(url: string): void {
    if (url.includes('/head/classes')) this.activeTab = 'classes';
    else if (url.includes('/head/students')) this.activeTab = 'students';
    else if (url.includes('/head/courses')) this.activeTab = 'courses';
    else if (url.includes('/head/teachers')) this.activeTab = 'teachers';
    else if (url.includes('/head/sentiment-analysis')) this.activeTab = 'sentiment-analysis';
    else if (url.includes('/head/dashboard')) this.activeTab = 'dashboard';
  }

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
      localStorage.setItem('head.sidebar.collapsed', String(this.isCollapsed));
    } catch {}
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile(): void {
    if (this.isMobile) this.mobileOpen = false;
  }

 

  onTabChange(tabId: string | number): void {
    const nextTabId = String(tabId);
    this.activeTab = nextTabId;

    switch (nextTabId) {
      case 'dashboard':
        void this.router.navigateByUrl('/head');
        break;
      case 'classes':
        void this.router.navigateByUrl('/head/classes');
        break;
      case 'students':
        void this.router.navigateByUrl('/head/students');
        break;
      case 'courses':
        void this.router.navigateByUrl('/head/courses');
        break;
      case 'teachers':
        void this.router.navigateByUrl('/head/teachers');
        break;
      case 'sentiment-analysis':
        void this.router.navigateByUrl('/head/sentiment-analysis');
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
          this.router.navigateByUrl('/login');
        },

      });
  }

  ngOnInit(): void {
    // Load persisted collapse state; if none, set responsive defaults
    const saved = (() => {
      try {
        return localStorage.getItem('dean.sidebar.collapsed');
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

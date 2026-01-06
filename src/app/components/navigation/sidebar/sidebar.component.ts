import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipDirective, IconButtonComponent } from '../../ui';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../services';

export type SidebarItem = {
  id: string;
  label: string;
  route: string;
  icon: string; // material icon name
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TooltipDirective, IconButtonComponent],
  template: `

   <aside class="sidebar" 
    [attr.data-theme]="themeService.getCurrentTheme()"
    [class.collapsed]="collapsed && !isMobile"
    [class.mobile-open]="isMobile && open"
    role="navigation"
   >
      <!-- Logo/Brand -->
      <a class="brand" [routerLink]="brandLink" aria-label="App home" (click)="onItemClick()">
          <span class="brand-logo">Q</span>
          <span class="brand-text" [attr.aria-hidden]="(collapsed && !isMobile) ? 'true' : 'false'">Quizzy</span>
        </a>
       
      <!-- Main Navigation -->
      <nav class="nav-main">
        <div class="nav-section-title">MAIN</div>
        
        <a *ngFor="let item of items" (click)="onItemClick()" 
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.route === '/dean' }"
          #rla="routerLinkActive"
          (click)="onItemClick()"
          [uiTooltip]="(collapsed && !isMobile) ? item.label : ''"
          [tooltipDisabled]="!(collapsed && !isMobile)"
          tooltipPosition="right"
          [attr.aria-current]="rla.isActive ? 'page' : null"
           class="nav-item">
          <mat-icon class="icon" fontSet="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</mat-icon>
          <span class="label" [attr.aria-hidden]="(collapsed && !isMobile) ? 'true' : 'false'">{{ item.label }}</span>
        </a>
      </nav>

      @if (!isMobile) {
        <div class="sidebar-footer">
          <ui-icon-button
            variant="ghost"
            color="neutral"
            size="md"
            [ariaLabel]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            [tooltip]="collapsed ? 'Expand' : 'Collapse'"
            (clicked)="toggle.emit()"
          >
            <mat-icon class="chevron" fontSet="material-symbols-outlined" [class.rotated]="collapsed" aria-hidden="true">chevron_left</mat-icon>
          </ui-icon-button>
        </div>
      }
      
      <!-- Support Section -->
      <nav class="nav-support">
        <div class="nav-section-title">Support</div>
        <a *ngFor="let item of supportMenuItems" class="nav-item">
          {{ item.label }}
        </a>
      </nav>
    </aside>
    
    
    <!-- <aside
      class="sidebar"
      [class.collapsed]="collapsed && !isMobile"
      [class.mobile-open]="isMobile && open"
      role="navigation"
      aria-label="Primary"
    >
      <div class="sidebar-top">
        <a class="brand" [routerLink]="brandLink" aria-label="App home" (click)="onItemClick()">
          <span class="brand-logo">Q</span>
          <span class="brand-text" [attr.aria-hidden]="(collapsed && !isMobile) ? 'true' : 'false'">Quizzy</span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <a
          *ngFor="let item of items"
          class="nav-item"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.route === '/dean' }"
          #rla="routerLinkActive"
          (click)="onItemClick()"
          [uiTooltip]="(collapsed && !isMobile) ? item.label : ''"
          [tooltipDisabled]="!(collapsed && !isMobile)"
          tooltipPosition="right"
          [attr.aria-current]="rla.isActive ? 'page' : null"
        >
          <mat-icon class="icon" fontSet="material-symbols-outlined" aria-hidden="true">{{ item.icon }}</mat-icon>
          <span class="label" [attr.aria-hidden]="(collapsed && !isMobile) ? 'true' : 'false'">{{ item.label }}</span>
        </a>
      </nav>

      @if (!isMobile) {
        <div class="sidebar-footer">
          <ui-icon-button
            variant="ghost"
            color="neutral"
            size="md"
            [ariaLabel]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            [tooltip]="collapsed ? 'Expand' : 'Collapse'"
            (clicked)="toggle.emit()"
          >
            <mat-icon class="chevron" fontSet="material-symbols-outlined" [class.rotated]="collapsed" aria-hidden="true">chevron_left</mat-icon>
          </ui-icon-button>
        </div>
      }
    </aside> -->
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() items: SidebarItem[] = [];
  @Input() collapsed = false;
  @Input() isMobile = false;
  @Input() open = false;
  @Input() brandLink = '/';

  @Output() toggle = new EventEmitter<void>();
  @Output() itemSelected = new EventEmitter<void>();

  supportMenuItems = [
    { label: 'Help Center' },
    { label: 'Logout' }
  ];
  @Input({ required: true }) role!: 'teacher' | 'dean' | 'mini-admin';
  constructor(public themeService: ThemeService) { }

  onItemClick(): void {
    if (this.isMobile) this.itemSelected.emit();
  }

  ngOnInit() {
    if (this.role === 'dean') {
      this.items = [
        { id: 'dashboard', label: 'Dashboard', route: '/dean', icon: 'dashboard' },
        { id: 'academic-years', label: 'Academic Years', route: '/dean/academic-years', icon: 'calendar_month' },
        { id: 'semesters', label: 'Semesters', route: '/dean/semesters', icon: 'school' },
        { id: 'exam-types', label: 'Exam Types', route: '/dean/exam-types', icon: 'assignment' },
        { id: 'teaching-units', label: 'Teaching Units', route: '/dean/teaching-units', icon: 'menu_book' },
        { id: 'mini-admins', label: 'Mini Admins', route: '/dean/mini-admins', icon: 'groups' },
        { id: 'ai-analytics', label: 'AI Analytics', route: '/dean/ai-analytics', icon: 'insights' },
      ];
    } else if (this.role === 'mini-admin') {
      this.items = [
        {
          label: 'Classes', route: 'classes',
          id: '',
          icon: 'dashboard'
        },
        {
          label: 'Students', route: 'students',
          id: '',
          icon: 'psychology'
        },
        {
          label: 'Teachers', route: 'teachers',
          id: '',
          icon: 'people'
        },
        {
          label: 'Exams', route: 'exams',
          id: '',
          icon: 'assignment'
        },
        {
          label: 'Analytics', route: 'analytics',
          id: '',
          icon: 'analytics'
        },
      ];

    } else {
      this.items = [
        { id: 'dashboard', label: 'Dashboard', route: '/teacher', icon: 'dashboard' },
        { id: 'exam-manager', label: 'Exam Manager', route: '/teacher/exam-manager', icon: 'assignment' },
        { id: 'sentiment-review', label: 'Sentiment Review', route: '/teacher/sentiment-review', icon: 'sentiment_satisfied' },
        { id: 'question-bank', label: 'Question Bank', route: '/teacher/question-bank', icon: 'quiz' },
        { id: 'mock-tests', label: 'Mock Tests', route: '/teacher/mock-tests', icon: 'psychology' },
        { id: 'statistics', label: 'Statistics', route: '/teacher/statistics', icon: 'analytics' },
        { id: 'create-exam', label: 'Create Exam', route: '/teacher/create-exam', icon: 'add_circle' },
      ];
    }
  }
}

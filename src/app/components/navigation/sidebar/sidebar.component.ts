import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipDirective, IconButtonComponent } from '../../ui';
import { MatIconModule } from '@angular/material/icon';

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
    <aside
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
    </aside>
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

  onItemClick(): void {
    if (this.isMobile) this.itemSelected.emit();
  }
}

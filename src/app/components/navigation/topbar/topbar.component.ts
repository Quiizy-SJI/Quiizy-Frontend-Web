import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonComponent, ButtonComponent, ThemeToggleComponent, AvatarComponent } from '../../ui';
import type { Role } from '../../../domain/dtos/login.dto';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, IconButtonComponent, ButtonComponent, ThemeToggleComponent, AvatarComponent],
  template: `
    <header class="topbar surface-raised" role="banner">
      <div class="topbar__left">
        @if (isMobile) {
          <ui-icon-button
            variant="ghost"
            color="primary"
            [ariaLabel]="'Open menu'"
            (clicked)="menuClick.emit()"
          >
            <mat-icon fontSet="material-symbols-outlined">menu</mat-icon>
          </ui-icon-button>
        }
        <div class="topbar__title h1" [attr.title]="title">{{ title }}</div>
      </div>

      <div class="topbar__right">
        @if (userName) {
          <div
            class="user-profile"
            role="button"
            tabindex="0"
            (click)="userMenuClick.emit()"
            (keydown.enter)="userMenuClick.emit()"
            (keydown.space)="userMenuClick.emit(); $event.preventDefault()"
          >
            <div class="user-info">
              <div class="user-details">
                <div class="user-name">{{ getFullName() }}</div>
                <div class="user-role">
                  <mat-icon
                    fontSet="material-symbols-outlined"
                    [class]="getRoleIconClass()"
                  >
                    {{ getRoleIcon() }}
                  </mat-icon>
                  <span>{{ getRoleLabel() }}</span>
                </div>
              </div>
              <ui-avatar
                [initials]="getInitials(userName + (userSurname ? ' ' + userSurname : ''))"
                size="md"
                color="primary"
                [attr.title]="getFullName()"
                class="user-avatar"
              />
            </div>
            <ui-button
              color="danger"
              variant="ghost"
              size="sm"
              [loading]="logoutLoading"
              (clicked)="logoutClick.emit()"
              [iconLeft]="true"
              class="logout-btn"
            >
              <span slot="icon-left">
                <mat-icon fontSet="material-symbols-outlined">logout</mat-icon>
              </span>
              Logout
            </ui-button>
          </div>
        }
        <ui-theme-toggle />
      </div>
    </header>
  `,
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  @Input() title = '';
  @Input() isMobile = false;
  @Input() userName: string | null | undefined = null;
  @Input() userSurname: string | null | undefined = null;
  @Input() userRole: Role | null | undefined = null;
  @Input() logoutLoading = false;

  @Output() menuClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();
  @Output() userMenuClick = new EventEmitter<void>();

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getFullName(): string {
    if (!this.userName) return '';
    return this.userSurname ? `${this.userName} ${this.userSurname}` : this.userName;
  }

  getRoleIcon(): string {
    switch (this.userRole) {
      case 'STUDENT':
        return 'school';
      case 'TEACHER':
        return 'person_book';
      case 'DEAN':
        return 'admin_panel_settings';
      case 'SPECIALITY_HEAD':
        return 'engineering';
      default:
        return 'person';
    }
  }

  getRoleIconClass(): string {
    const baseClass = 'user-role__icon';
    switch (this.userRole) {
      case 'STUDENT':
        return `${baseClass} user-role__icon--student`;
      case 'TEACHER':
        return `${baseClass} user-role__icon--teacher`;
      case 'DEAN':
        return `${baseClass} user-role__icon--dean`;
      case 'SPECIALITY_HEAD':
        return `${baseClass} user-role__icon--speciality-head`;
      default:
        return baseClass;
    }
  }

  getRoleLabel(): string {
    switch (this.userRole) {
      case 'STUDENT':
        return 'Student';
      case 'TEACHER':
        return 'Teacher';
      case 'DEAN':
        return 'Dean';
      case 'SPECIALITY_HEAD':
        return 'Speciality Head';
      default:
        return 'User';
    }
  }
}

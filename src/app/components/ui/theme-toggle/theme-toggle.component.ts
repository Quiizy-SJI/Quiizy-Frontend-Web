import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'ui-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle"
      [class.dark]="themeService.isDark()"
      (click)="themeService.toggle()"
      [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      type="button">
      <div class="toggle-track">
        <div class="toggle-thumb">
          <!-- Sun -->
          <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- Moon -->
          <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>
      </div>
    </button>
  `,
  styles: [`
    .theme-toggle {
      --toggle-width: 56px;
      --toggle-height: 28px;
      --thumb-size: 22px;

      position: relative;
      width: var(--toggle-width);
      height: var(--toggle-height);
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      outline: none;
    }

    .toggle-track {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #87CEEB 0%, #FDB813 100%);
      border-radius: var(--toggle-height);
      transition: background 0.4s ease;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }

    .dark .toggle-track {
      background: linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%);
    }

    .toggle-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: var(--thumb-size);
      height: var(--thumb-size);
      background: #fff;
      border-radius: 50%;
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .dark .toggle-thumb {
      transform: translateX(calc(var(--toggle-width) - var(--thumb-size) - 6px));
      background: #1e293b;
    }

    .sun, .moon {
      position: absolute;
      width: 14px;
      height: 14px;
      transition: all 0.4s ease;
    }

    .sun {
      color: #FDB813;
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .moon {
      color: #f1f5f9;
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }

    .dark .sun {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }

    .dark .moon {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .theme-toggle:hover .toggle-thumb {
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }

    .theme-toggle:focus-visible .toggle-track {
      outline: 2px solid var(--color-primary-500);
      outline-offset: 2px;
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}

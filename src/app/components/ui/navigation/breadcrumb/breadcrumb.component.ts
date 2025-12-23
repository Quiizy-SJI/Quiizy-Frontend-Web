import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cn } from '../../utils/class-utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  routerLink?: string | string[];
  icon?: string;
}

@Component({
  selector: 'ui-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav [class]="breadcrumbClasses" [attr.aria-label]="ariaLabel">
      <ol class="breadcrumb__list">
        @for (item of items; track item.label; let last = $last; let i = $index) {
          <li class="breadcrumb__item">
            @if (!last && (item.href || item.routerLink)) {
              @if (item.routerLink) {
                <a [routerLink]="item.routerLink" class="breadcrumb__link">
                  @if (item.icon && showIcons) {
                    <span class="breadcrumb__icon">{{ item.icon }}</span>
                  }
                  {{ item.label }}
                </a>
              } @else {
                <a [href]="item.href" class="breadcrumb__link">
                  @if (item.icon && showIcons) {
                    <span class="breadcrumb__icon">{{ item.icon }}</span>
                  }
                  {{ item.label }}
                </a>
              }
            } @else {
              <span class="breadcrumb__current" [attr.aria-current]="last ? 'page' : null">
                @if (item.icon && showIcons) {
                  <span class="breadcrumb__icon">{{ item.icon }}</span>
                }
                {{ item.label }}
              </span>
            }

            @if (!last) {
              <span class="breadcrumb__separator" aria-hidden="true">
                @switch (separator) {
                  @case ('slash') {
                    /
                  }
                  @case ('arrow') {
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  }
                  @case ('dot') {
                    •
                  }
                  @default {
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6.776 4.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L9.293 8 6.776 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  }
                }
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: 'chevron' | 'slash' | 'arrow' | 'dot' = 'chevron';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showIcons = false;
  @Input() ariaLabel = 'Breadcrumb';
  @Input() customClass?: string;

  get breadcrumbClasses(): string {
    return cn(
      'breadcrumb',
      `breadcrumb--${this.size}`,
      this.customClass
    );
  }
}

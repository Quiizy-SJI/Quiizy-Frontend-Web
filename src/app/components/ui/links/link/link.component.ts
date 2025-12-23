import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cn, sizeClass, colorClass } from '../../utils/class-utils';
import type { Size, ColorVariant } from '../../types/component.types';

export type LinkVariant = 'default' | 'underline' | 'ghost' | 'nav';

@Component({
  selector: 'ui-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (href) {
      <a
        [href]="href"
        [target]="external ? '_blank' : target"
        [rel]="external ? 'noopener noreferrer' : rel"
        [class]="linkClasses"
        [attr.aria-label]="ariaLabel"
        [attr.aria-disabled]="disabled"
        [tabindex]="disabled ? -1 : 0"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    } @else if (routerLink) {
      <a
        [routerLink]="routerLink"
        [queryParams]="queryParams"
        [fragment]="fragment"
        [class]="linkClasses"
        [attr.aria-label]="ariaLabel"
        [attr.aria-disabled]="disabled"
        [tabindex]="disabled ? -1 : 0"
        routerLinkActive="link--active"
        [routerLinkActiveOptions]="{ exact: exactActiveMatch }"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    } @else {
      <button
        type="button"
        [class]="linkClasses"
        [disabled]="disabled"
        [attr.aria-label]="ariaLabel"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </button>
    }

    <ng-template #content>
      @if (iconLeft) {
        <span class="link__icon link__icon--left">
          <ng-content select="[slot=icon-left]"></ng-content>
        </span>
      }
      <span class="link__text">
        <ng-content></ng-content>
      </span>
      @if (iconRight || external) {
        <span class="link__icon link__icon--right">
          @if (external) {
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 3h7v7M13 3L6 10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          } @else {
            <ng-content select="[slot=icon-right]"></ng-content>
          }
        </span>
      }
    </ng-template>
  `,
  styleUrl: './link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {
  @Input() href?: string;
  @Input() routerLink?: string | any[];
  @Input() queryParams?: { [key: string]: any };
  @Input() fragment?: string;
  @Input() target: '_self' | '_blank' | '_parent' | '_top' = '_self';
  @Input() rel?: string;
  @Input() variant: LinkVariant = 'default';
  @Input() color: ColorVariant = 'primary';
  @Input() size: Size = 'md';
  @Input() external = false;
  @Input() disabled = false;
  @Input() iconLeft = false;
  @Input() iconRight = false;
  @Input() ariaLabel?: string;
  @Input() exactActiveMatch = false;
  @Input() customClass?: string;

  get linkClasses(): string {
    return cn(
      'link',
      `link--${this.variant}`,
      colorClass('link', this.color),
      sizeClass('link', this.size),
      this.external && 'link--external',
      this.disabled && 'link--disabled',
      this.customClass
    );
  }
}

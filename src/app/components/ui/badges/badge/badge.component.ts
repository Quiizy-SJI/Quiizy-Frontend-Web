import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, sizeClass, colorClass, variantClass } from '../../utils/class-utils';
import type { Size, ColorVariant, BadgeVariant } from '../../types/component.types';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <!-- Dot indicator -->
      @if (variant === 'dot') {
        <span class="badge__dot"></span>
      }

      <!-- Icon left -->
      @if (iconLeft) {
        <span class="badge__icon badge__icon--left">
          <ng-content select="[slot=icon-left]"></ng-content>
        </span>
      }

      <!-- Content -->
      <span class="badge__content">
        <ng-content></ng-content>
      </span>

      <!-- Icon right -->
      @if (iconRight) {
        <span class="badge__icon badge__icon--right">
          <ng-content select="[slot=icon-right]"></ng-content>
        </span>
      }

      <!-- Dismiss button -->
      @if (dismissible) {
        <button
          type="button"
          class="badge__dismiss"
          (click)="onDismiss($event)"
          [attr.aria-label]="dismissLabel"
        >
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      }
    </span>
  `,
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'solid';
  @Input() color: ColorVariant = 'primary';
  @Input() size: Size = 'md';
  @Input() pill = false;
  @Input() iconLeft = false;
  @Input() iconRight = false;
  @Input() dismissible = false;
  @Input() dismissLabel = 'Dismiss';
  @Input() customClass?: string;

  @Output() dismissed = new EventEmitter<void>();

  get badgeClasses(): string {
    return cn(
      'badge',
      variantClass('badge', this.variant),
      colorClass('badge', this.color),
      sizeClass('badge', this.size),
      this.pill && 'badge--pill',
      this.dismissible && 'badge--dismissible',
      this.customClass
    );
  }

  onDismiss(event: MouseEvent): void {
    event.stopPropagation();
    this.dismissed.emit();
  }
}

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, sizeClass, colorClass, variantClass } from '../../utils/class-utils';
import type { Size, ColorVariant, ButtonVariant } from '../../types/component.types';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      [attr.aria-disabled]="disabled || loading"
      [attr.aria-busy]="loading"
      (click)="handleClick($event)"
    >
      <!-- Loading Spinner -->
      @if (loading) {
        <span class="btn__spinner">
          <svg class="btn__spinner-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="10" />
          </svg>
        </span>
      }

      <!-- Left Icon -->
      @if (iconLeft && !loading) {
        <span class="btn__icon btn__icon--left">
          <ng-content select="[slot=icon-left]"></ng-content>
        </span>
      }

      <!-- Button Content -->
      @if (!iconOnly) {
        <span class="btn__content">
          <ng-content></ng-content>
        </span>
      }

      <!-- Right Icon -->
      @if (iconRight) {
        <span class="btn__icon btn__icon--right">
          <ng-content select="[slot=icon-right]"></ng-content>
        </span>
      }
    </button>
  `,
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'solid';
  @Input() color: ColorVariant = 'primary';
  @Input() size: Size = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() iconLeft = false;
  @Input() iconRight = false;
  @Input() iconOnly = false;
  @Input() rounded = false;
  @Input() ariaLabel?: string;
  @Input() customClass?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return cn(
      'btn',
      variantClass('btn', this.variant),
      colorClass('btn', this.color),
      sizeClass('btn', this.size),
      this.fullWidth && 'btn--full-width',
      this.iconOnly && 'btn--icon-only',
      this.rounded && 'btn--rounded',
      this.loading && 'btn--loading',
      this.disabled && 'btn--disabled',
      this.customClass
    );
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

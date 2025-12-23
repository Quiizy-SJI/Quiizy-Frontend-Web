import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, sizeClass, colorClass } from '../../utils/class-utils';
import type { Size, ColorVariant } from '../../types/component.types';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [class]="spinnerClasses"
      viewBox="0 0 24 24"
      fill="none"
      [attr.aria-label]="label"
      role="status"
    >
      <circle
        class="spinner__track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
      />
      <circle
        class="spinner__indicator"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    @if (showLabel) {
      <span class="spinner__label">{{ label }}</span>
    }
  `,
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  @Input() size: Size = 'md';
  @Input() color: ColorVariant = 'primary';
  @Input() label = 'Loading...';
  @Input() showLabel = false;
  @Input() customClass?: string;

  @HostBinding('class')
  get hostClasses(): string {
    return cn(
      'spinner-wrapper',
      sizeClass('spinner-wrapper', this.size),
      this.showLabel && 'spinner-wrapper--with-label',
      this.customClass
    );
  }

  get spinnerClasses(): string {
    return cn(
      'spinner',
      sizeClass('spinner', this.size),
      colorClass('spinner', this.color)
    );
  }
}

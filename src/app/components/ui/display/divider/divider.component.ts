import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/class-utils';

@Component({
  selector: 'ui-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (label) {
      <span class="divider__label">{{ label }}</span>
    }
    <ng-content></ng-content>
  `,
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() variant: 'solid' | 'dashed' | 'dotted' = 'solid';
  @Input() label?: string;
  @Input() labelPosition: 'left' | 'center' | 'right' = 'center';
  @Input() spacing: 'sm' | 'md' | 'lg' = 'md';
  @Input() customClass?: string;

  @HostBinding('class')
  get hostClasses(): string {
    return cn(
      'divider',
      `divider--${this.orientation}`,
      `divider--${this.variant}`,
      `divider--spacing-${this.spacing}`,
      this.label && `divider--with-label`,
      this.label && `divider--label-${this.labelPosition}`,
      this.customClass
    );
  }

  @HostBinding('role')
  get role(): string {
    return 'separator';
  }

  @HostBinding('attr.aria-orientation')
  get ariaOrientation(): string {
    return this.orientation;
  }
}

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { cn, sizeClass, colorClass } from '../../utils/class-utils';
import type { Size, ColorVariant } from '../../types/component.types';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <button
      [type]="type"
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel"
      [attr.aria-disabled]="disabled || loading"
      [attr.aria-busy]="loading"
      [attr.title]="tooltip"
      (click)="handleClick($event)"
    >
      @if (loading) {
        <mat-icon class="icon-btn__spinner" fontSet="material-symbols-outlined">progress_activity</mat-icon>
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent {
  @Input() variant: 'solid' | 'outline' | 'ghost' | 'soft' = 'ghost';
  @Input() color: ColorVariant = 'neutral';
  @Input() size: Size = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() rounded = true;
  @Input() ariaLabel!: string;
  @Input() tooltip?: string;
  @Input() customClass?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return cn(
      'icon-btn',
      `icon-btn--${this.variant}`,
      colorClass('icon-btn', this.color),
      sizeClass('icon-btn', this.size),
      this.rounded && 'icon-btn--rounded',
      this.loading && 'icon-btn--loading',
      this.disabled && 'icon-btn--disabled',
      this.customClass
    );
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

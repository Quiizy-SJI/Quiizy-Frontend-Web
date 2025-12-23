import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, sizeClass, colorClass } from '../../utils/class-utils';
import type { Size, ColorVariant } from '../../types/component.types';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="avatarClasses">
      @if (src && !imageError) {
        <img
          [src]="src"
          [alt]="alt"
          class="avatar__image"
          (error)="onImageError()"
        />
      } @else if (initials) {
        <span class="avatar__initials">{{ initials }}</span>
      } @else {
        <span class="avatar__fallback">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </span>
      }

      @if (showBadge) {
        <span [class]="badgeClasses"></span>
      }
    </div>
  `,
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = '';
  @Input() initials?: string;
  @Input() size: Size = 'md';
  @Input() color: ColorVariant = 'primary';
  @Input() variant: 'circle' | 'square' | 'rounded' = 'circle';
  @Input() showBadge = false;
  @Input() badgePosition: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' = 'bottom-right';
  @Input() badgeColor: ColorVariant = 'success';
  @Input() bordered = false;
  @Input() customClass?: string;

  imageError = false;

  get avatarClasses(): string {
    return cn(
      'avatar',
      sizeClass('avatar', this.size),
      colorClass('avatar', this.color),
      `avatar--${this.variant}`,
      this.bordered && 'avatar--bordered',
      this.customClass
    );
  }

  get badgeClasses(): string {
    return cn(
      'avatar__badge',
      `avatar__badge--${this.badgePosition}`,
      colorClass('avatar__badge', this.badgeColor)
    );
  }

  onImageError(): void {
    this.imageError = true;
  }
}

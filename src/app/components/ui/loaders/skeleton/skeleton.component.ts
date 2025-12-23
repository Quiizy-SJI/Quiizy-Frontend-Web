import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/class-utils';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
  @Input() variant: 'text' | 'circular' | 'rectangular' | 'rounded' = 'text';
  @Input() width?: string;
  @Input() height?: string;
  @Input() lines = 1;
  @Input() animated = true;
  @Input() customClass?: string;

  @HostBinding('class')
  get hostClasses(): string {
    return cn(
      'skeleton',
      `skeleton--${this.variant}`,
      this.animated && 'skeleton--animated',
      this.customClass
    );
  }

  @HostBinding('style.width')
  get widthStyle(): string | null {
    return this.width ?? null;
  }

  @HostBinding('style.height')
  get heightStyle(): string | null {
    return this.height ?? null;
  }
}

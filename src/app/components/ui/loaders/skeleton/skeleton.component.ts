import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/class-utils';

@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="skeletonClasses" [style.width]="width" [style.height]="height"></div>`,
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

  get skeletonClasses(): string {
    return cn(
      'skeleton',
      `skeleton--${this.variant}`,
      this.animated && 'skeleton--animated',
      this.customClass
    );
  }
}

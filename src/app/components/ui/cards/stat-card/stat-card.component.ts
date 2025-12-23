import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, colorClass } from '../../utils/class-utils';
import type { ColorVariant } from '../../types/component.types';

type TrendDirection = 'up' | 'down' | 'neutral';

@Component({
  selector: 'ui-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Icon -->
    @if (showIcon) {
      <div [class]="iconClasses">
        <ng-content select="[slot=icon]"></ng-content>
      </div>
    }

    <!-- Stat Content -->
    <div class="stat-card__content">
      <span class="stat-card__label">{{ label }}</span>
      <div class="stat-card__value-row">
        <span class="stat-card__value">{{ formattedValue }}</span>
        @if (showTrend && trendValue !== undefined) {
          <span [class]="trendClasses">
            @if (trendDirection === 'up') {
              <svg viewBox="0 0 16 16" fill="currentColor" class="stat-card__trend-icon">
                <path d="M8 4l4 4H9v4H7V8H4l4-4z"/>
              </svg>
            }
            @if (trendDirection === 'down') {
              <svg viewBox="0 0 16 16" fill="currentColor" class="stat-card__trend-icon">
                <path d="M8 12l-4-4h3V4h2v4h3l-4 4z"/>
              </svg>
            }
            {{ trendValue }}{{ trendSuffix }}
          </span>
        }
      </div>
      @if (description) {
        <span class="stat-card__description">{{ description }}</span>
      }
    </div>

    <!-- Progress Bar -->
    @if (showProgress && progress !== undefined) {
      <div class="stat-card__progress">
        <div class="stat-card__progress-bar" [style.width.%]="progressPercentage"></div>
      </div>
    }

    <!-- Footer Slot -->
    <ng-content select="[slot=footer]"></ng-content>
  `,
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses'
  }
})
export class StatCardComponent {
  @Input() label!: string;
  @Input() value!: number | string;
  @Input() description?: string;
  @Input() color: ColorVariant = 'primary';
  @Input() showIcon = true;
  @Input() showTrend = false;
  @Input() trendValue?: number | string;
  @Input() trendDirection: TrendDirection = 'neutral';
  @Input() trendSuffix = '%';
  @Input() showProgress = false;
  @Input() progress?: number;
  @Input() progressMax = 100;
  @Input() format: 'number' | 'currency' | 'percent' | 'compact' | 'none' = 'none';
  @Input() currencyCode = 'USD';
  @Input() compact = false;
  @Input() customClass?: string;

  get hostClasses(): string {
    return cn(
      'stat-card',
      colorClass('stat-card', this.color),
      this.compact && 'stat-card--compact',
      this.customClass
    );
  }

  get formattedValue(): string {
    if (typeof this.value === 'string') return this.value;

    switch (this.format) {
      case 'number':
        return new Intl.NumberFormat().format(this.value);
      case 'currency':
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: this.currencyCode
        }).format(this.value);
      case 'percent':
        return new Intl.NumberFormat(undefined, {
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        }).format(this.value / 100);
      case 'compact':
        return new Intl.NumberFormat(undefined, { notation: 'compact' }).format(this.value);
      default:
        return String(this.value);
    }
  }

  get iconClasses(): string {
    return cn(
      'stat-card__icon',
      colorClass('stat-card__icon', this.color)
    );
  }

  get trendClasses(): string {
    return cn(
      'stat-card__trend',
      this.trendDirection === 'up' && 'stat-card__trend--up',
      this.trendDirection === 'down' && 'stat-card__trend--down',
      this.trendDirection === 'neutral' && 'stat-card__trend--neutral'
    );
  }

  get progressPercentage(): number {
    if (this.progress === undefined) return 0;
    return Math.min(100, Math.max(0, (this.progress / this.progressMax) * 100));
  }
}

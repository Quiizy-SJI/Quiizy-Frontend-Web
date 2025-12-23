import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, sizeClass, variantClass } from '../../utils/class-utils';
import type { Size, CardVariant } from '../../types/component.types';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses" [style.backgroundImage]="backgroundImageStyle">
      <!-- Card Image (Top) -->
      @if (imagePosition === 'top' && imageSrc) {
        <div class="card__image-container" [class.card__image-container--cover]="imageCover">
          <img [src]="imageSrc" [alt]="imageAlt" class="card__image" />
          @if (imageOverlay) {
            <div class="card__image-overlay">
              <ng-content select="[slot=image-overlay]"></ng-content>
            </div>
          }
        </div>
      }

      <!-- Card Header -->
      @if (title || subtitle || showHeader) {
        <div class="card__header">
          <ng-content select="[slot=header-left]"></ng-content>
          <div class="card__header-content">
            @if (title) {
              <h3 class="card__title">{{ title }}</h3>
            }
            @if (subtitle) {
              <p class="card__subtitle">{{ subtitle }}</p>
            }
          </div>
          <ng-content select="[slot=header-right]"></ng-content>
        </div>
      }

      <!-- Card Body -->
      <div class="card__body">
        @if (imagePosition === 'left' && imageSrc) {
          <div class="card__image-container card__image-container--side">
            <img [src]="imageSrc" [alt]="imageAlt" class="card__image" />
          </div>
        }

        <div class="card__content">
          <ng-content></ng-content>
        </div>

        @if (imagePosition === 'right' && imageSrc) {
          <div class="card__image-container card__image-container--side">
            <img [src]="imageSrc" [alt]="imageAlt" class="card__image" />
          </div>
        }
      </div>

      <!-- Card Footer -->
      @if (showFooter) {
        <div class="card__footer">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }

      <!-- Expandable Content -->
      @if (expandable && isExpanded) {
        <div class="card__expandable" [@expand]>
          <ng-content select="[slot=expandable]"></ng-content>
        </div>
      }

      <!-- Loading Overlay -->
      @if (loading) {
        <div class="card__loading">
          <div class="card__loading-spinner"></div>
        </div>
      }
    </div>
  `,
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() variant: CardVariant = 'elevated';
  @Input() size: Size = 'md';
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() imageSrc?: string;
  @Input() imageAlt = '';
  @Input() imagePosition: 'top' | 'left' | 'right' | 'background' = 'top';
  @Input() imageCover = false;
  @Input() imageOverlay = false;
  @Input() showHeader = false;
  @Input() showFooter = false;
  @Input() hoverable = false;
  @Input() clickable = false;
  @Input() expandable = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() customClass?: string;

  @Output() cardClick = new EventEmitter<void>();
  @Output() expandedChange = new EventEmitter<boolean>();

  isExpanded = false;

  get cardClasses(): string {
    return cn(
      'card',
      variantClass('card', this.variant),
      sizeClass('card', this.size),
      this.variant === 'glass' && 'liquid-glass',
      this.hoverable && 'card--hoverable',
      this.clickable && 'card--clickable',
      this.fullWidth && 'card--full-width',
      this.imagePosition === 'background' && 'card--bg-image',
      (this.imagePosition === 'left' || this.imagePosition === 'right') && 'card--horizontal',
      this.loading && 'card--loading',
      this.customClass
    );
  }

  get backgroundImageStyle(): string | null {
    return this.imagePosition === 'background' && this.imageSrc
      ? `url(${this.imageSrc})`
      : null;
  }

  @HostBinding('tabindex')
  get tabIndex(): number {
    return this.clickable ? 0 : -1;
  }

  @HostBinding('role')
  get role(): string | null {
    return this.clickable ? 'button' : null;
  }

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }

  toggleExpanded(): void {
    if (this.expandable) {
      this.isExpanded = !this.isExpanded;
      this.expandedChange.emit(this.isExpanded);
    }
  }
}

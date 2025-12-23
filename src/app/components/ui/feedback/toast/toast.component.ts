import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, colorClass } from '../../utils/class-utils';
import type { ColorVariant, Position } from '../../types/component.types';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Toast Icon -->
    @if (showIcon) {
      <div class="toast__icon">
        @switch (color) {
          @case ('success') {
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          }
          @case ('warning') {
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          }
          @case ('danger') {
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          }
          @default {
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          }
        }
      </div>
    }

    <!-- Toast Content -->
    <div class="toast__content">
      @if (title) {
        <div class="toast__title">{{ title }}</div>
      }
      <div class="toast__message">{{ message }}</div>
    </div>

    <!-- Toast Action -->
    @if (actionLabel) {
      <button
        type="button"
        class="toast__action"
        (click)="onAction()"
      >
        {{ actionLabel }}
      </button>
    }

    <!-- Close Button -->
    @if (dismissible) {
      <button
        type="button"
        class="toast__close"
        (click)="dismiss()"
        aria-label="Dismiss toast"
      >
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    }

    <!-- Progress Bar -->
    @if (showProgress && duration) {
      <div class="toast__progress">
        <div
          class="toast__progress-bar"
          [style.animation-duration.ms]="duration"
        ></div>
      </div>
    }
  `,
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses',
    'role': 'alert'
  }
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() message!: string;
  @Input() title?: string;
  @Input() color: ColorVariant = 'neutral';
  @Input() showIcon = true;
  @Input() dismissible = true;
  @Input() duration?: number = 5000;
  @Input() showProgress = true;
  @Input() actionLabel?: string;
  @Input() customClass?: string;

  @Output() dismissed = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<void>();

  private timeoutId?: ReturnType<typeof setTimeout>;

  get hostClasses(): string {
    return cn(
      'toast',
      colorClass('toast', this.color),
      this.customClass
    );
  }

  ngOnInit(): void {
    if (this.duration && this.duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  dismiss(): void {
    this.dismissed.emit();
  }

  onAction(): void {
    this.actionClicked.emit();
    this.dismiss();
  }
}

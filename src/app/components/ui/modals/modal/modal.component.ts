import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn, sizeClass } from '../../utils/class-utils';
import type { ModalSize } from '../../types/component.types';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div
          [class]="modalClasses"
          role="dialog"
          [attr.aria-modal]="true"
          [attr.aria-labelledby]="title ? 'modal-title' : null"
          [attr.aria-describedby]="description ? 'modal-description' : null"
        >
          <!-- Modal Header -->
          @if (showHeader) {
            <div class="modal__header">
              <div class="modal__header-content">
                @if (title) {
                  <h2 id="modal-title" class="modal__title">{{ title }}</h2>
                }
                @if (description) {
                  <p id="modal-description" class="modal__description">{{ description }}</p>
                }
              </div>
              @if (showCloseButton) {
                <button
                  type="button"
                  class="modal__close"
                  (click)="close()"
                  aria-label="Close modal"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              }
            </div>
          }

          <!-- Modal Body -->
          <div class="modal__body" [class.modal__body--scrollable]="scrollable">
            <ng-content></ng-content>
          </div>

          <!-- Modal Footer -->
          @if (showFooter) {
            <div class="modal__footer" [class.modal__footer--stacked]="stackedActions">
              <ng-content select="[slot=footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() size: ModalSize = 'md';
  @Input() title?: string;
  @Input() description?: string;
  @Input() showHeader = true;
  @Input() showFooter = false;
  @Input() showCloseButton = true;
  @Input() closeOnOverlay = true;
  @Input() closeOnEscape = true;
  @Input() scrollable = true;
  @Input() stackedActions = false;
  @Input() centered = true;
  @Input() fullScreen = false;
  @Input() customClass?: string;

  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();

  private previousActiveElement: HTMLElement | null = null;

  get modalClasses(): string {
    return cn(
      'modal',
      sizeClass('modal', this.size),
      this.centered && 'modal--centered',
      this.fullScreen && 'modal--fullscreen',
      this.customClass
    );
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.closeOnEscape) {
      this.close();
    }
  }

  ngOnInit(): void {
    if (this.isOpen) {
      this.onOpen();
    }
  }

  ngOnDestroy(): void {
    this.restoreBodyScroll();
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.closeOnOverlay && event.target === event.currentTarget) {
      this.close();
    }
  }

  open(): void {
    this.isOpen = true;
    this.onOpen();
  }

  close(): void {
    this.isOpen = false;
    this.restoreBodyScroll();
    this.restoreFocus();
    this.closed.emit();
  }

  private onOpen(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.preventBodyScroll();
    this.opened.emit();
  }

  private preventBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private restoreBodyScroll(): void {
    document.body.style.overflow = '';
  }

  private restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
}

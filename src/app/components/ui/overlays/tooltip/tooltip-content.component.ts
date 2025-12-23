import { Component, Input, ChangeDetectionStrategy, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Position } from '../../types/component.types';

@Component({
  selector: 'ui-tooltip-content',
  standalone: true,
  imports: [CommonModule],
  template: `{{ content }}`,
  styles: [`
    :host {
      position: fixed;
      z-index: 10000;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: white;
      background: var(--text-primary);
      border-radius: 8px;
      box-shadow: var(--elevation-3);
      pointer-events: none;
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.15s ease, transform 0.15s ease;
      max-width: 250px;
      word-wrap: break-word;
    }

    :host(.visible) {
      opacity: 1;
      transform: scale(1);
    }

    :host::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: inherit;
      transform: rotate(45deg);
    }

    :host(.position-top)::before {
      bottom: -4px;
      left: 50%;
      margin-left: -4px;
    }

    :host(.position-bottom)::before {
      top: -4px;
      left: 50%;
      margin-left: -4px;
    }

    :host(.position-left)::before {
      right: -4px;
      top: 50%;
      margin-top: -4px;
    }

    :host(.position-right)::before {
      left: -4px;
      top: 50%;
      margin-top: -4px;
    }
  `],
  host: {
    '[class.visible]': 'visible',
    '[class.position-top]': 'position === "top"',
    '[class.position-bottom]': 'position === "bottom"',
    '[class.position-left]': 'position === "left"',
    '[class.position-right]': 'position === "right"'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipContentComponent implements AfterViewInit {
  @Input() content = '';
  @Input() position: Position = 'top';
  @Input() hostElement!: HTMLElement;

  visible = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.visible = true;
    }, 10);
  }

  updatePosition(): void {
    const hostRect = this.hostElement.getBoundingClientRect();
    const tooltipEl = this.elementRef.nativeElement as HTMLElement;
    const tooltipRect = tooltipEl.getBoundingClientRect();

    let top = 0;
    let left = 0;
    const gap = 8;

    switch (this.position) {
      case 'top':
        top = hostRect.top - tooltipRect.height - gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + gap;
        break;
    }

    // Ensure tooltip stays within viewport
    const padding = 10;
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
  }
}

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { cn } from '../../utils/class-utils';
import type { TabItem } from '../../types/component.types';

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tabs__list" role="tablist">
      @for (tab of tabs; track tab.id) {
        <button
          type="button"
          [id]="'tab-' + tab.id"
          role="tab"
          [attr.aria-selected]="activeTab === tab.id"
          [attr.aria-controls]="'panel-' + tab.id"
          [disabled]="tab.disabled"
          [class]="getTabClasses(tab)"
          (click)="selectTab(tab)"
        >
          @if (tab.icon) {
            <span class="tabs__icon">
              <!-- Icon would be rendered here -->
            </span>
          }
          <span class="tabs__label">{{ tab.label }}</span>
          @if (tab.badge) {
            <span class="tabs__badge">{{ tab.badge }}</span>
          }
        </button>
      }
      <div class="tabs__indicator" [style.transform]="indicatorTransform" [style.width]="indicatorWidth"></div>
    </div>

    <div class="tabs__content">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab!: string | number;
  @Input() variant: 'line' | 'enclosed' | 'pills' | 'soft' = 'line';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;
  @Input() centered = false;
  @Input() vertical = false;
  @Input() customClass?: string;

  @Output() tabChange = new EventEmitter<string | number>();

  @HostBinding('class')
  get hostClasses(): string {
    return cn(
      'tabs',
      `tabs--${this.variant}`,
      `tabs--${this.size}`,
      this.fullWidth && 'tabs--full-width',
      this.centered && 'tabs--centered',
      this.vertical && 'tabs--vertical',
      this.customClass
    );
  }

  get activeIndex(): number {
    return this.tabs.findIndex(tab => tab.id === this.activeTab);
  }

  get indicatorTransform(): string {
    if (this.variant === 'line') {
      return `translateX(${this.activeIndex * 100}%)`;
    }
    return '';
  }

  get indicatorWidth(): string {
    if (this.variant === 'line' && this.tabs.length > 0) {
      return `${100 / this.tabs.length}%`;
    }
    return '0';
  }

  getTabClasses(tab: TabItem): string {
    return cn(
      'tabs__tab',
      this.activeTab === tab.id && 'tabs__tab--active',
      tab.disabled && 'tabs__tab--disabled'
    );
  }

  selectTab(tab: TabItem): void {
    if (!tab.disabled && this.activeTab !== tab.id) {
      this.tabChange.emit(tab.id);
    }
  }
}

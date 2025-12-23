import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { cn, sizeClass } from '../../utils/class-utils';
import type { Size, Orientation } from '../../types/component.types';

@Component({
  selector: 'ui-button-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="groupClasses" role="group" [attr.aria-label]="ariaLabel">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './button-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroupComponent implements AfterContentInit {
  @Input() orientation: Orientation = 'horizontal';
  @Input() size: Size = 'md';
  @Input() attached = false;
  @Input() spacing: 'none' | 'xs' | 'sm' | 'md' = 'sm';
  @Input() ariaLabel?: string;
  @Input() customClass?: string;

  @ContentChildren(ButtonComponent) buttons!: QueryList<ButtonComponent>;

  get groupClasses(): string {
    return cn(
      'btn-group',
      `btn-group--${this.orientation}`,
      sizeClass('btn-group', this.size),
      this.attached && 'btn-group--attached',
      `btn-group--spacing-${this.spacing}`,
      this.customClass
    );
  }

  ngAfterContentInit(): void {
    // Propagate size to child buttons if needed
    if (this.buttons) {
      this.buttons.forEach(btn => {
        if (btn.size !== this.size) {
          btn.size = this.size;
        }
      });
    }
  }
}

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn, sizeClass, colorClass } from '../../utils/class-utils';
import type { Size, ColorVariant } from '../../types/component.types';
import { generateId } from '../../utils/class-utils';

@Component({
  selector: 'ui-toggle',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ],
  template: `
    <label [class]="wrapperClasses" [for]="toggleId">
      <input
        type="checkbox"
        role="switch"
        [id]="toggleId"
        [name]="name"
        [checked]="checked"
        [disabled]="disabled"
        [attr.aria-describedby]="description ? toggleId + '-desc' : null"
        (change)="onToggleChange($event)"
        class="toggle__input"
      />
      <span [class]="toggleClasses">
        <span class="toggle__thumb">
          @if (showIcons) {
            <span class="toggle__icon toggle__icon--on">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M9.86 3.14a.5.5 0 0 1 0 .72l-4.5 4.5a.5.5 0 0 1-.72 0l-2-2a.5.5 0 1 1 .72-.72L5 7.29l4.14-4.15a.5.5 0 0 1 .72 0z"/>
              </svg>
            </span>
            <span class="toggle__icon toggle__icon--off">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M3.28 3.28a.5.5 0 0 1 .72 0L6 5.29l2-2.01a.5.5 0 1 1 .72.72L6.71 6l2.01 2a.5.5 0 0 1-.72.72L6 6.71l-2 2.01a.5.5 0 0 1-.72-.72L5.29 6 3.28 4a.5.5 0 0 1 0-.72z"/>
              </svg>
            </span>
          }
        </span>
      </span>
      @if (label || description) {
        <div class="toggle__content">
          @if (label) {
            <span class="toggle__label">{{ label }}</span>
          }
          @if (description) {
            <span [id]="toggleId + '-desc'" class="toggle__description">{{ description }}</span>
          }
        </div>
      }
    </label>
  `,
  styleUrl: './toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() description?: string;
  @Input() name?: string;
  @Input() color: ColorVariant = 'primary';
  @Input() size: Size = 'md';
  @Input() disabled = false;
  @Input() showIcons = false;
  @Input() toggleId = generateId('toggle');
  @Input() customClass?: string;

  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  get wrapperClasses(): string {
    return cn(
      'toggle-wrapper',
      sizeClass('toggle-wrapper', this.size),
      this.disabled && 'toggle-wrapper--disabled',
      this.customClass
    );
  }

  get toggleClasses(): string {
    return cn(
      'toggle',
      colorClass('toggle', this.color),
      sizeClass('toggle', this.size),
      this.checked && 'toggle--checked',
      this.disabled && 'toggle--disabled',
      this.showIcons && 'toggle--with-icons'
    );
  }

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onToggleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }
}

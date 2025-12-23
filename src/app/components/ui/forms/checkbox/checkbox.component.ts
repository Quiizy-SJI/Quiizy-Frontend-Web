import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn, sizeClass, colorClass } from '../../utils/class-utils';
import type { Size, ColorVariant } from '../../types/component.types';
import { generateId } from '../../utils/class-utils';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <label [class]="wrapperClasses" [for]="checkboxId">
      <input
        type="checkbox"
        [id]="checkboxId"
        [name]="name"
        [checked]="checked"
        [disabled]="disabled"
        [indeterminate]="indeterminate"
        [attr.aria-describedby]="description ? checkboxId + '-desc' : null"
        (change)="onCheckboxChange($event)"
        class="checkbox__input"
      />
      <span [class]="checkboxClasses">
        @if (checked && !indeterminate) {
          <svg viewBox="0 0 16 16" fill="none" class="checkbox__check">
            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
        @if (indeterminate) {
          <svg viewBox="0 0 16 16" fill="none" class="checkbox__check">
            <path d="M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        }
      </span>
      @if (label || description) {
        <div class="checkbox__content">
          @if (label) {
            <span class="checkbox__label">{{ label }}</span>
          }
          @if (description) {
            <span [id]="checkboxId + '-desc'" class="checkbox__description">{{ description }}</span>
          }
        </div>
      }
    </label>
  `,
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() description?: string;
  @Input() name?: string;
  @Input() color: ColorVariant = 'primary';
  @Input() size: Size = 'md';
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() checkboxId = generateId('checkbox');
  @Input() customClass?: string;

  @Output() checkedChange = new EventEmitter<boolean>();

  checked = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  get wrapperClasses(): string {
    return cn(
      'checkbox-wrapper',
      sizeClass('checkbox-wrapper', this.size),
      this.disabled && 'checkbox-wrapper--disabled',
      this.customClass
    );
  }

  get checkboxClasses(): string {
    return cn(
      'checkbox',
      colorClass('checkbox', this.color),
      sizeClass('checkbox', this.size),
      this.checked && 'checkbox--checked',
      this.indeterminate && 'checkbox--indeterminate',
      this.disabled && 'checkbox--disabled'
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

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }
}

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn, sizeClass, colorClass } from '../../utils/class-utils';
import type { Size, ColorVariant } from '../../types/component.types';
import { generateId } from '../../utils/class-utils';

@Component({
  selector: 'ui-radio',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ],
  template: `
    <label [class]="wrapperClasses" [for]="radioId">
      <input
        type="radio"
        [id]="radioId"
        [name]="name"
        [value]="value"
        [checked]="checked"
        [disabled]="disabled"
        [attr.aria-describedby]="description ? radioId + '-desc' : null"
        (change)="onRadioChange()"
        class="radio__input"
      />
      <span [class]="radioClasses">
        <span class="radio__dot"></span>
      </span>
      @if (label || description) {
        <div class="radio__content">
          @if (label) {
            <span class="radio__label">{{ label }}</span>
          }
          @if (description) {
            <span [id]="radioId + '-desc'" class="radio__description">{{ description }}</span>
          }
        </div>
      }
    </label>
  `,
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() description?: string;
  @Input() name!: string;
  @Input() value: any;
  @Input() color: ColorVariant = 'primary';
  @Input() size: Size = 'md';
  @Input() disabled = false;
  @Input() radioId = generateId('radio');
  @Input() customClass?: string;

  @Output() valueChange = new EventEmitter<any>();

  checked = false;
  private groupValue: any;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get wrapperClasses(): string {
    return cn(
      'radio-wrapper',
      sizeClass('radio-wrapper', this.size),
      this.disabled && 'radio-wrapper--disabled',
      this.customClass
    );
  }

  get radioClasses(): string {
    return cn(
      'radio',
      colorClass('radio', this.color),
      sizeClass('radio', this.size),
      this.checked && 'radio--checked',
      this.disabled && 'radio--disabled'
    );
  }

  writeValue(value: any): void {
    this.groupValue = value;
    this.checked = this.value === value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onRadioChange(): void {
    if (!this.disabled) {
      this.checked = true;
      this.onChange(this.value);
      this.onTouched();
      this.valueChange.emit(this.value);
    }
  }
}

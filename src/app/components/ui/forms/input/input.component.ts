import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn, sizeClass, variantClass } from '../../utils/class-utils';
import type { Size, InputVariant, ValidationState } from '../../types/component.types';
import { generateId } from '../../utils/class-utils';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="wrapperClasses">
      <!-- Label -->
      @if (label && variant !== 'floating') {
        <label [for]="inputId" class="input__label">
          {{ label }}
          @if (required) {
            <span class="input__required">*</span>
          }
        </label>
      }

      <!-- Input Container -->
      <div class="input__container" [class.input__container--focused]="focused">
        <!-- Prefix -->
        @if (prefix) {
          <span class="input__addon input__addon--prefix">
            <ng-content select="[slot=prefix]"></ng-content>
          </span>
        }

        <!-- Icon Left -->
        @if (iconLeft) {
          <span class="input__icon input__icon--left">
            <ng-content select="[slot=icon-left]"></ng-content>
          </span>
        }

        <!-- Input Field -->
        <input
          #inputRef
          [id]="inputId"
          [type]="showPassword ? 'text' : type"
          [class]="inputClasses"
          [placeholder]="variant === 'floating' ? ' ' : placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [attr.aria-invalid]="validationState === 'invalid'"
          [attr.aria-describedby]="helperText || errorMessage ? inputId + '-helper' : null"
          [attr.autocomplete]="autocomplete"
          [attr.min]="min"
          [attr.max]="max"
          [attr.minlength]="minlength"
          [attr.maxlength]="maxlength"
          [attr.pattern]="pattern"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (input)="onInput($event)"
        />

        <!-- Floating Label -->
        @if (label && variant === 'floating') {
          <label [for]="inputId" class="input__floating-label">
            {{ label }}
            @if (required) {
              <span class="input__required">*</span>
            }
          </label>
        }

        <!-- Password Toggle -->
        @if (type === 'password' && showPasswordToggle) {
          <button
            type="button"
            class="input__toggle"
            (click)="togglePassword()"
            [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
          >
            @if (showPassword) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            }
          </button>
        }

        <!-- Clear Button -->
        @if (clearable && value && !disabled && !readonly) {
          <button
            type="button"
            class="input__clear"
            (click)="clearValue()"
            aria-label="Clear input"
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        }

        <!-- Icon Right -->
        @if (iconRight) {
          <span class="input__icon input__icon--right">
            <ng-content select="[slot=icon-right]"></ng-content>
          </span>
        }

        <!-- Suffix -->
        @if (suffix) {
          <span class="input__addon input__addon--suffix">
            <ng-content select="[slot=suffix]"></ng-content>
          </span>
        }

        <!-- Validation Icon -->
        @if (showValidationIcon && validationState !== 'default') {
          <span class="input__validation-icon input__validation-icon--{{ validationState }}">
            @if (validationState === 'valid') {
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
            }
            @if (validationState === 'invalid') {
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            }
            @if (validationState === 'pending') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input__spinner">
                <circle cx="12" cy="12" r="10" stroke-dasharray="31.416" stroke-dashoffset="10"/>
              </svg>
            }
          </span>
        }
      </div>

      <!-- Helper Text / Error Message -->
      @if (helperText || errorMessage) {
        <div [id]="inputId + '-helper'" class="input__helper" [class.input__helper--error]="validationState === 'invalid'">
          {{ validationState === 'invalid' && errorMessage ? errorMessage : helperText }}
        </div>
      }

      <!-- Character Count -->
      @if (showCharacterCount && maxlength) {
        <div class="input__count">
          {{ value?.length || 0 }} / {{ maxlength }}
        </div>
      }
    </div>
  `,
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' = 'text';
  @Input() variant: InputVariant = 'outlined';
  @Input() size: Size = 'md';
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() validationState: ValidationState = 'default';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() clearable = false;
  @Input() showPasswordToggle = true;
  @Input() showValidationIcon = true;
  @Input() showCharacterCount = false;
  @Input() prefix = false;
  @Input() suffix = false;
  @Input() iconLeft = false;
  @Input() iconRight = false;
  @Input() autocomplete?: string;
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() pattern?: string;
  @Input() inputId = generateId('input');
  @Input() customClass?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();
  @Output() inputEvent = new EventEmitter<Event>();
  @Output() cleared = new EventEmitter<void>();

  value = '';
  focused = false;
  showPassword = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get wrapperClasses(): string {
    return cn(
      'input-wrapper',
      sizeClass('input-wrapper', this.size),
      this.customClass
    );
  }

  get inputClasses(): string {
    return cn(
      'input',
      variantClass('input', this.variant),
      sizeClass('input', this.size),
      this.validationState !== 'default' && `input--${this.validationState}`,
      this.disabled && 'input--disabled',
      this.readonly && 'input--readonly',
      this.iconLeft && 'input--has-icon-left',
      this.iconRight && 'input--has-icon-right',
      this.prefix && 'input--has-prefix',
      this.suffix && 'input--has-suffix'
    );
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onFocus(): void {
    this.focused = true;
    this.focusEvent.emit();
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.blurEvent.emit();
  }

  onInput(event: Event): void {
    this.inputEvent.emit(event);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearValue(): void {
    this.value = '';
    this.onChange('');
    this.valueChange.emit('');
    this.cleared.emit();
    this.inputRef?.nativeElement?.focus();
  }

  focus(): void {
    this.inputRef?.nativeElement?.focus();
  }

  blur(): void {
    this.inputRef?.nativeElement?.blur();
  }
}

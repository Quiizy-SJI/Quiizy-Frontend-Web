import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn, sizeClass, variantClass } from '../../utils/class-utils';
import type { Size, InputVariant, ValidationState } from '../../types/component.types';
import { generateId } from '../../utils/class-utils';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="wrapperClasses">
      <!-- Label -->
      @if (label) {
        <label [for]="textareaId" class="textarea__label">
          {{ label }}
          @if (required) {
            <span class="textarea__required">*</span>
          }
        </label>
      }

      <!-- Textarea Container -->
      <div class="textarea__container" [class.textarea__container--focused]="focused">
        <textarea
          #textareaRef
          [id]="textareaId"
          [class]="textareaClasses"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [rows]="rows"
          [attr.aria-invalid]="validationState === 'invalid'"
          [attr.aria-describedby]="helperText || errorMessage ? textareaId + '-helper' : null"
          [attr.minlength]="minlength"
          [attr.maxlength]="maxlength"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (input)="onInput($event)"
        ></textarea>

        <!-- Resize Handle (if resizable) -->
        @if (resizable) {
          <span class="textarea__resize-handle"></span>
        }
      </div>

      <!-- Footer -->
      <div class="textarea__footer">
        <!-- Helper Text / Error Message -->
        @if (helperText || errorMessage) {
          <div [id]="textareaId + '-helper'" class="textarea__helper" [class.textarea__helper--error]="validationState === 'invalid'">
            {{ validationState === 'invalid' && errorMessage ? errorMessage : helperText }}
          </div>
        }

        <!-- Character Count -->
        @if (showCharacterCount && maxlength) {
          <div class="textarea__count" [class.textarea__count--warning]="(value.length || 0) > (maxlength || 0) * 0.9">
            {{ value.length || 0 }} / {{ maxlength }}
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements ControlValueAccessor {
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;

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
  @Input() rows = 4;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() showCharacterCount = false;
  @Input() resizable: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';
  @Input() autoResize = false;
  @Input() textareaId = generateId('textarea');
  @Input() customClass?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();

  value = '';
  focused = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get wrapperClasses(): string {
    return cn(
      'textarea-wrapper',
      sizeClass('textarea-wrapper', this.size),
      this.customClass
    );
  }

  get textareaClasses(): string {
    return cn(
      'textarea',
      variantClass('textarea', this.variant),
      sizeClass('textarea', this.size),
      this.validationState !== 'default' && `textarea--${this.validationState}`,
      this.disabled && 'textarea--disabled',
      this.readonly && 'textarea--readonly',
      `textarea--resize-${this.resizable}`
    );
  }

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

    if (this.autoResize) {
      this.adjustHeight();
    }
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
    if (this.autoResize) {
      this.adjustHeight();
    }
  }

  private adjustHeight(): void {
    if (!this.textareaRef?.nativeElement) return;

    const textarea = this.textareaRef.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  focus(): void {
    this.textareaRef?.nativeElement?.focus();
  }

  blur(): void {
    this.textareaRef?.nativeElement?.blur();
  }
}

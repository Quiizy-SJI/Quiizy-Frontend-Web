import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { cn, sizeClass, variantClass } from '../../utils/class-utils';
import type { Size, InputVariant, ValidationState, DropdownOption } from '../../types/component.types';
import { generateId } from '../../utils/class-utils';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div [class]="wrapperClasses" #selectWrapper>
      <!-- Label -->
      @if (label) {
        <label [for]="selectId" class="select__label">
          {{ label }}
          @if (required) {
            <span class="select__required">*</span>
          }
        </label>
      }

      <!-- Select Trigger -->
      <button
        type="button"
        [id]="selectId"
        [class]="selectClasses"
        [disabled]="disabled"
        [attr.aria-expanded]="isOpen"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-labelledby]="label ? selectId + '-label' : null"
        [attr.aria-invalid]="validationState === 'invalid'"
        (click)="toggleDropdown()"
        (keydown)="onKeyDown($event)"
      >
        <!-- Icon Left -->
        @if (iconLeft) {
          <span class="select__icon select__icon--left">
            <ng-content select="[slot=icon-left]"></ng-content>
          </span>
        }

        <!-- Selected Value -->
        <span class="select__value" [class.select__value--placeholder]="!selectedOption">
          {{ selectedOption?.label || placeholder }}
        </span>

        <!-- Clear Button -->
        @if (clearable && selectedOption && !disabled) {
          <button
            type="button"
            class="select__clear"
            (click)="clearSelection($event)"
            aria-label="Clear selection"
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        }

        <!-- Dropdown Arrow -->
        <span class="select__arrow" [class.select__arrow--open]="isOpen">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 6.646a.5.5 0 0 1 .708 0L8 9.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"/>
          </svg>
        </span>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen) {
        <div class="select__dropdown" role="listbox" [attr.aria-activedescendant]="focusedOptionId">
          <!-- Search -->
          @if (searchable) {
            <div class="select__search">
              <input
                #searchInput
                type="text"
                class="select__search-input"
                [placeholder]="searchPlaceholder"
                [(ngModel)]="searchQuery"
                (input)="onSearchInput()"
                (keydown)="onSearchKeyDown($event)"
              />
            </div>
          }

          <!-- Options List -->
          <div class="select__options">
            @for (option of filteredOptions; track option.value; let i = $index) {
              <button
                type="button"
                [id]="selectId + '-option-' + i"
                class="select__option"
                [class.select__option--selected]="option.value === value"
                [class.select__option--focused]="i === focusedIndex"
                [class.select__option--disabled]="option.disabled"
                [disabled]="option.disabled"
                role="option"
                [attr.aria-selected]="option.value === value"
                (click)="selectOption(option)"
                (mouseenter)="focusedIndex = i"
              >
                @if (option.icon) {
                  <span class="select__option-icon">{{ option.icon }}</span>
                }
                <span class="select__option-label">{{ option.label }}</span>
                @if (option.value === value) {
                  <span class="select__option-check">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </span>
                }
              </button>
            }

            @if (filteredOptions.length === 0) {
              <div class="select__empty">
                {{ emptyMessage }}
              </div>
            }
          </div>
        </div>
      }

      <!-- Helper Text / Error Message -->
      @if (helperText || errorMessage) {
        <div class="select__helper" [class.select__helper--error]="validationState === 'invalid'">
          {{ validationState === 'invalid' && errorMessage ? errorMessage : helperText }}
        </div>
      }
    </div>
  `,
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild('selectWrapper') selectWrapper!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @Input() options: DropdownOption[] = [];
  @Input() variant: InputVariant = 'outlined';
  @Input() size: Size = 'md';
  @Input() label?: string;
  @Input() placeholder = 'Select an option';
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() validationState: ValidationState = 'default';
  @Input() disabled = false;
  @Input() required = false;
  @Input() clearable = false;
  @Input() searchable = false;
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyMessage = 'No options found';
  @Input() iconLeft = false;
  @Input() selectId = generateId('select');
  @Input() customClass?: string;

  @Output() valueChange = new EventEmitter<any>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  value: any = null;
  isOpen = false;
  searchQuery = '';
  focusedIndex = -1;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  get wrapperClasses(): string {
    return cn(
      'select-wrapper',
      sizeClass('select-wrapper', this.size),
      this.isOpen && 'select-wrapper--open',
      this.customClass
    );
  }

  get selectClasses(): string {
    return cn(
      'select',
      variantClass('select', this.variant),
      sizeClass('select', this.size),
      this.validationState !== 'default' && `select--${this.validationState}`,
      this.disabled && 'select--disabled',
      this.isOpen && 'select--open',
      this.iconLeft && 'select--has-icon-left'
    );
  }

  get selectedOption(): DropdownOption | undefined {
    return this.options.find(opt => opt.value === this.value);
  }

  get filteredOptions(): DropdownOption[] {
    if (!this.searchQuery) return this.options;
    const query = this.searchQuery.toLowerCase();
    return this.options.filter(opt =>
      opt.label.toLowerCase().includes(query)
    );
  }

  get focusedOptionId(): string | null {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredOptions.length) {
      return `${this.selectId}-option-${this.focusedIndex}`;
    }
    return null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.selectWrapper?.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  writeValue(value: any): void {
    this.value = value;
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

  toggleDropdown(): void {
    if (this.disabled) return;

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    this.isOpen = true;
    this.searchQuery = '';
    this.focusedIndex = this.options.findIndex(opt => opt.value === this.value);
    this.opened.emit();

    // Focus search input if searchable
    setTimeout(() => {
      if (this.searchable && this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    });
  }

  closeDropdown(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.searchQuery = '';
    this.focusedIndex = -1;
    this.onTouched();
    this.closed.emit();
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled) return;

    this.value = option.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.closeDropdown();
  }

  clearSelection(event: MouseEvent): void {
    event.stopPropagation();
    this.value = null;
    this.onChange(null);
    this.valueChange.emit(null);
  }

  onSearchInput(): void {
    this.focusedIndex = 0;
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.focusNextOption();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen) {
          this.focusPreviousOption();
        }
        break;
      case 'Escape':
        this.closeDropdown();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredOptions.length) {
          this.selectOption(this.filteredOptions[this.focusedIndex]);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousOption();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  private focusNextOption(): void {
    const options = this.filteredOptions.filter(opt => !opt.disabled);
    if (options.length === 0) return;

    let nextIndex = this.focusedIndex + 1;
    while (nextIndex < this.filteredOptions.length && this.filteredOptions[nextIndex].disabled) {
      nextIndex++;
    }

    if (nextIndex < this.filteredOptions.length) {
      this.focusedIndex = nextIndex;
    }
  }

  private focusPreviousOption(): void {
    let prevIndex = this.focusedIndex - 1;
    while (prevIndex >= 0 && this.filteredOptions[prevIndex].disabled) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      this.focusedIndex = prevIndex;
    }
  }
}

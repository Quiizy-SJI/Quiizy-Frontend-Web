// ============================================
// QUIZZY UI COMPONENT LIBRARY - TYPE DEFINITIONS
// ============================================

// ==========================================
// SIZE VARIANTS
// ==========================================
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const SIZES: Record<Size, string> = {
  xs: 'size-xs',
  sm: 'size-sm',
  md: 'size-md',
  lg: 'size-lg',
  xl: 'size-xl'
};

// ==========================================
// COLOR VARIANTS
// ==========================================
export type ColorVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const COLORS: Record<ColorVariant, string> = {
  primary: 'color-primary',
  secondary: 'color-secondary',
  accent: 'color-accent',
  success: 'color-success',
  warning: 'color-warning',
  danger: 'color-danger',
  info: 'color-info',
  neutral: 'color-neutral'
};

// ==========================================
// BUTTON VARIANTS
// ==========================================
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link' | 'soft';

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  solid: 'btn--solid',
  outline: 'btn--outline',
  ghost: 'btn--ghost',
  link: 'btn--link',
  soft: 'btn--soft'
};

// ==========================================
// BADGE VARIANTS
// ==========================================
export type BadgeVariant = 'solid' | 'outline' | 'subtle' | 'dot';

export const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  solid: 'badge--solid',
  outline: 'badge--outline',
  subtle: 'badge--subtle',
  dot: 'badge--dot'
};

// ==========================================
// INPUT VARIANTS
// ==========================================
export type InputVariant = 'outlined' | 'filled' | 'underlined' | 'floating';

export const INPUT_VARIANTS: Record<InputVariant, string> = {
  outlined: 'input--outlined',
  filled: 'input--filled',
  underlined: 'input--underlined',
  floating: 'input--floating'
};

// ==========================================
// CARD VARIANTS
// ==========================================
export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass';

export const CARD_VARIANTS: Record<CardVariant, string> = {
  elevated: 'card--elevated',
  outlined: 'card--outlined',
  filled: 'card--filled',
  glass: 'card--glass'
};

// ==========================================
// MODAL SIZES
// ==========================================
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export const MODAL_SIZES: Record<ModalSize, string> = {
  sm: 'modal--sm',
  md: 'modal--md',
  lg: 'modal--lg',
  xl: 'modal--xl',
  fullscreen: 'modal--fullscreen'
};

// ==========================================
// POSITION TYPES
// ==========================================
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'center';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

// ==========================================
// ALERT TYPES
// ==========================================
export type AlertType = 'success' | 'warning' | 'danger' | 'info';

// ==========================================
// TABLE TYPES
// ==========================================
export type TableDensity = 'compact' | 'normal' | 'spacious';
export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  template?: string;
  formatter?: (value: any, row: T) => string;
}

export interface TableConfig {
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  density?: TableDensity;
  selectable?: boolean;
  stickyHeader?: boolean;
}

// ==========================================
// PAGINATION TYPES
// ==========================================
export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

// ==========================================
// FORM TYPES
// ==========================================
export type ValidationState = 'default' | 'valid' | 'invalid' | 'pending';

export interface FormFieldConfig {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

// ==========================================
// NAVIGATION TYPES
// ==========================================
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  active?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
  href?: string;
  icon?: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  status?: 'pending' | 'current' | 'completed' | 'error';
}

// ==========================================
// DROPDOWN TYPES
// ==========================================
export interface DropdownOption<T = any> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
  group?: string;
}

export interface DropdownGroup {
  label: string;
  options: DropdownOption[];
}

// ==========================================
// TOAST/NOTIFICATION TYPES
// ==========================================
export interface ToastConfig {
  id?: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

// ==========================================
// AVATAR TYPES
// ==========================================
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'square' | 'rounded';

// ==========================================
// LOADER TYPES
// ==========================================
export type LoaderVariant = 'spinner' | 'dots' | 'bars' | 'pulse' | 'ring';

// ==========================================
// UTILITY TYPES
// ==========================================
export type Orientation = 'horizontal' | 'vertical';
export type Alignment = 'start' | 'center' | 'end' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

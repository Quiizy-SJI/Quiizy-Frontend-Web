// ============================================
// UI COMPONENT LIBRARY - MAIN EXPORTS
// ============================================

// Types
export * from './types/component.types';

// Utilities
export * from './utils/class-utils';
export * from './utils/animation-utils';

// Buttons
export { ButtonComponent } from './buttons/button/button.component';
export { ButtonGroupComponent } from './buttons/button-group/button-group.component';
export { IconButtonComponent } from './buttons/icon-button/icon-button.component';

// Badges
export { BadgeComponent } from './badges/badge/badge.component';

// Links
export { LinkComponent } from './links/link/link.component';

// Forms
export { InputComponent } from './forms/input/input.component';
export { TextareaComponent } from './forms/textarea/textarea.component';
export { SelectComponent } from './forms/select/select.component';
export { CheckboxComponent } from './forms/checkbox/checkbox.component';
export { RadioComponent } from './forms/radio/radio.component';
export { ToggleComponent } from './forms/toggle/toggle.component';

// Cards
export { CardComponent } from './cards/card/card.component';
export { StatCardComponent } from './cards/stat-card/stat-card.component';

// Modals
export { ModalComponent } from './modals/modal/modal.component';

// Feedback
export { AlertComponent } from './feedback/alert/alert.component';
export { ToastComponent } from './feedback/toast/toast.component';

// Tables
export { TableComponent } from './tables/table/table.component';

// Navigation
export { TabsComponent } from './navigation/tabs/tabs.component';
export { BreadcrumbComponent } from './navigation/breadcrumb/breadcrumb.component';

// Loaders
export { SpinnerComponent } from './loaders/spinner/spinner.component';
export { SkeletonComponent } from './loaders/skeleton/skeleton.component';

// Display
export { AvatarComponent } from './display/avatar/avatar.component';
export { DividerComponent } from './display/divider/divider.component';

// Overlays
export { TooltipDirective } from './overlays/tooltip/tooltip.directive';
export { TooltipContentComponent } from './overlays/tooltip/tooltip-content.component';

// ============================================
// CONVENIENCE ARRAYS FOR BULK IMPORTS
// ============================================

// All button components
export const BUTTON_COMPONENTS = [
  ButtonComponent,
  ButtonGroupComponent,
  IconButtonComponent
] as const;

// All form components
export const FORM_COMPONENTS = [
  InputComponent,
  TextareaComponent,
  SelectComponent,
  CheckboxComponent,
  RadioComponent,
  ToggleComponent
] as const;

// All card components
export const CARD_COMPONENTS = [
  CardComponent,
  StatCardComponent
] as const;

// All feedback components
export const FEEDBACK_COMPONENTS = [
  AlertComponent,
  ToastComponent,
  ModalComponent
] as const;

// All navigation components
export const NAVIGATION_COMPONENTS = [
  TabsComponent,
  BreadcrumbComponent
] as const;

// All loader components
export const LOADER_COMPONENTS = [
  SpinnerComponent,
  SkeletonComponent
] as const;

// All display components
export const DISPLAY_COMPONENTS = [
  AvatarComponent,
  DividerComponent,
  BadgeComponent
] as const;

// All directive exports
export const UI_DIRECTIVES = [
  TooltipDirective
] as const;

// All UI components combined
export const UI_COMPONENTS = [
  ...BUTTON_COMPONENTS,
  ...FORM_COMPONENTS,
  ...CARD_COMPONENTS,
  ...FEEDBACK_COMPONENTS,
  ...NAVIGATION_COMPONENTS,
  ...LOADER_COMPONENTS,
  ...DISPLAY_COMPONENTS,
  LinkComponent,
  TableComponent
] as const;

// Import ButtonComponent for convenience array
import { ButtonComponent } from './buttons/button/button.component';
import { ButtonGroupComponent } from './buttons/button-group/button-group.component';
import { IconButtonComponent } from './buttons/icon-button/icon-button.component';
import { BadgeComponent } from './badges/badge/badge.component';
import { LinkComponent } from './links/link/link.component';
import { InputComponent } from './forms/input/input.component';
import { TextareaComponent } from './forms/textarea/textarea.component';
import { SelectComponent } from './forms/select/select.component';
import { CheckboxComponent } from './forms/checkbox/checkbox.component';
import { RadioComponent } from './forms/radio/radio.component';
import { ToggleComponent } from './forms/toggle/toggle.component';
import { CardComponent } from './cards/card/card.component';
import { StatCardComponent } from './cards/stat-card/stat-card.component';
import { ModalComponent } from './modals/modal/modal.component';
import { AlertComponent } from './feedback/alert/alert.component';
import { ToastComponent } from './feedback/toast/toast.component';
import { TableComponent } from './tables/table/table.component';
import { TabsComponent } from './navigation/tabs/tabs.component';
import { BreadcrumbComponent } from './navigation/breadcrumb/breadcrumb.component';
import { SpinnerComponent } from './loaders/spinner/spinner.component';
import { SkeletonComponent } from './loaders/skeleton/skeleton.component';
import { AvatarComponent } from './display/avatar/avatar.component';
import { DividerComponent } from './display/divider/divider.component';
import { TooltipDirective } from './overlays/tooltip/tooltip.directive';

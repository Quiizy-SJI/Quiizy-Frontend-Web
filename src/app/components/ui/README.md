# Quizzy UI Component Library

A comprehensive, customizable, and reusable UI component library built for Angular 19+ with standalone components.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
- [Theming](#theming)
- [Customization](#customization)

## Installation

All components are standalone and can be imported directly:

```typescript
import { ButtonComponent, InputComponent } from './components/ui';
```

Or import component groups:

```typescript
import { FORM_COMPONENTS, BUTTON_COMPONENTS } from './components/ui';
```

## Quick Start

### Using a Button

```html
<ui-button variant="solid" color="primary" size="md">
  Click Me
</ui-button>

<ui-button variant="outline" color="danger" [loading]="true">
  Loading...
</ui-button>
```

### Using Form Components

```html
<ui-input
  label="Email"
  type="email"
  placeholder="Enter your email"
  [(ngModel)]="email"
  [validationState]="emailValid ? 'valid' : 'invalid'"
  errorMessage="Please enter a valid email"
/>

<ui-select
  label="Country"
  [options]="countries"
  [(ngModel)]="selectedCountry"
  [searchable]="true"
  [clearable]="true"
/>

<ui-checkbox
  label="Accept terms"
  [(ngModel)]="accepted"
  color="primary"
/>
```

## Components

### Buttons

| Component | Description |
|-----------|-------------|
| `ui-button` | Main button with variants: solid, outline, ghost, soft, link |
| `ui-button-group` | Group multiple buttons together |
| `ui-icon-button` | Icon-only button |

**Button Props:**
- `variant`: 'solid' | 'outline' | 'ghost' | 'soft' | 'link'
- `color`: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean

### Form Components

| Component | Description |
|-----------|-------------|
| `ui-input` | Text input with validation, clearable, password toggle |
| `ui-textarea` | Multi-line input with auto-resize |
| `ui-select` | Dropdown select with search |
| `ui-checkbox` | Checkbox with indeterminate state |
| `ui-radio` | Radio button for groups |
| `ui-toggle` | Toggle/Switch component |

**Input Variants:**
- `outlined` (default)
- `filled`
- `underlined`
- `floating`

### Cards

| Component | Description |
|-----------|-------------|
| `ui-card` | Flexible card with image, header, footer slots |
| `ui-stat-card` | Statistics card with trends and progress |

**Card Example:**
```html
<ui-card 
  title="Card Title" 
  subtitle="Card subtitle"
  [imageSrc]="imageUrl"
  imagePosition="top"
  [hoverable]="true"
>
  Card content goes here
</ui-card>
```

### Feedback

| Component | Description |
|-----------|-------------|
| `ui-alert` | Alert messages with variants |
| `ui-toast` | Toast notifications |
| `ui-modal` | Modal dialogs |

**Alert Variants:**
- `soft` - Light background
- `filled` - Solid background
- `outlined` - Border only
- `accent` - Left border accent

### Navigation

| Component | Description |
|-----------|-------------|
| `ui-tabs` | Tabbed interface |
| `ui-breadcrumb` | Breadcrumb navigation |

### Tables

| Component | Description |
|-----------|-------------|
| `ui-table` | Data table with sorting, pagination, selection |

**Table Example:**
```html
<ui-table
  [columns]="columns"
  [data]="data"
  [selectable]="true"
  [showPagination]="true"
  [pagination]="paginationConfig"
  (sortChange)="onSort($event)"
  (selectionChange)="onSelect($event)"
/>
```

### Loaders

| Component | Description |
|-----------|-------------|
| `ui-spinner` | Animated spinner |
| `ui-skeleton` | Skeleton placeholder |

### Display

| Component | Description |
|-----------|-------------|
| `ui-avatar` | User avatar with fallback |
| `ui-badge` | Badge/tag component |
| `ui-divider` | Horizontal/vertical divider |

### Overlays

| Directive | Description |
|-----------|-------------|
| `uiTooltip` | Tooltip directive |

**Tooltip Example:**
```html
<button [uiTooltip]="'Click to submit'" tooltipPosition="top">
  Submit
</button>
```

## Theming

### Light/Dark Mode

Toggle dark mode by adding `data-theme="dark"` to your HTML element:

```typescript
document.documentElement.setAttribute('data-theme', 'dark');
```

### Color System

The library uses CSS custom properties for colors:

- `--color-primary-{50-900}` - Primary color scale
- `--color-secondary-{50-900}` - Secondary color scale
- `--color-accent-{50-900}` - Accent color scale
- `--color-success-{50-900}` - Success states
- `--color-warning-{50-900}` - Warning states
- `--color-danger-{50-900}` - Error/danger states
- `--color-info-{50-900}` - Info states

### Surface & Text Colors

- `--surface-base` - Main background
- `--surface-raised` - Elevated surfaces
- `--surface-hover` - Hover states
- `--text-primary` - Main text color
- `--text-secondary` - Secondary text
- `--text-tertiary` - Muted text

## Customization

### Custom Classes

All components accept a `customClass` input for additional styling:

```html
<ui-button customClass="my-custom-button">Custom</ui-button>
```

### Component Slots

Many components support content projection via slots:

```html
<ui-card>
  <span slot="header-left">
    <ui-avatar [initials]="'AB'" size="sm" />
  </span>
  
  Card content
  
  <div slot="footer">
    <ui-button>Action</ui-button>
  </div>
</ui-card>
```

### Extending Components

All components are standalone and can be extended:

```typescript
@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <ui-button [variant]="variant" [color]="color">
      <ng-content />
    </ui-button>
  `
})
export class CustomButtonComponent {
  @Input() variant = 'solid';
  @Input() color = 'primary';
}
```

## Size Reference

| Size | Height | Font Size |
|------|--------|-----------|
| xs | 28px | 0.75rem |
| sm | 34px | 0.8125rem |
| md | 40px | 0.875rem |
| lg | 48px | 1rem |
| xl | 56px | 1.125rem |

## Accessibility

All components follow WCAG guidelines:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Color contrast ratios
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

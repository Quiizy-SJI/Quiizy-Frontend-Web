# SCSS Configuration Guide

## Quick Customization

All theme colors can be changed at the top of `styles.scss` in the **CONFIGURATION SECTION**.

### Main Brand Colors

```scss
// LIGHT MODE
$primary-base: #3572ef;     // Your primary brand color
$secondary-base: #8b5cf6;   // Secondary brand color
$accent-base: #06b6d4;      // Accent highlights

// DARK MODE
$primary-dark: #60a5fa;     // Primary color for dark theme
$secondary-dark: #a78bfa;   // Secondary for dark theme
$accent-dark: #22d3ee;      // Accent for dark theme
```

### Semantic Colors

```scss
// LIGHT MODE
$success-base: #10b981;     // Success states (green)
$warning-base: #f59e0b;     // Warning states (orange)
$danger-base: #ef4444;      // Error/danger states (red)
$info-base: #3b82f6;        // Info states (blue)

// DARK MODE
$success-dark: #34d399;
$warning-dark: #fbbf24;
$danger-dark: #f87171;
$info-dark: #60a5fa;
```

### Typography Colors

```scss
// LIGHT MODE
$text-primary-light: #0f172a;     // Main text
$text-secondary-light: #334155;   // Secondary text
$text-tertiary-light: #64748b;    // Tertiary text
$text-quaternary-light: #94a3b8;  // Quaternary text

// DARK MODE
$text-primary-dark: #f1f5f9;
$text-secondary-dark: #cbd5e1;
$text-tertiary-dark: #94a3b8;
$text-quaternary-dark: #64748b;
```

### Surface Colors

```scss
// LIGHT MODE
$surface-base-light: #ffffff;      // Base background
$surface-raised-light: #ffffff;    // Elevated surfaces
$surface-sunken-light: #f8fafc;    // Sunken surfaces

// DARK MODE
$surface-base-dark: #0f172a;
$surface-raised-dark: #1e293b;
$surface-overlay-dark: #334155;
$surface-sunken-dark: #020617;
```

### Border Colors

```scss
// LIGHT MODE
$border-subtle-light: #f1f5f9;
$border-default-light: #e2e8f0;
$border-emphasis-light: #cbd5e1;
$border-strong-light: #94a3b8;

// DARK MODE
$border-subtle-dark: #1e293b;
$border-default-dark: #334155;
$border-emphasis-dark: #475569;
$border-strong-dark: #64748b;
```

### Other Configuration Options

```scss
// Font
$font-family: 'Product Sans', -apple-system, ...;
$font-path: 'assets/fonts/';

// Motion
$motion-duration-instant: 0ms;
$motion-duration-fast: 150ms;
$motion-duration-normal: 300ms;
$motion-duration-slow: 500ms;
$motion-duration-slower: 750ms;

// UI
$min-touch-target: 44px;    // Minimum size for touch targets
$border-radius: 12px;       // Default border radius
```

## How to Use

1. **Edit Configuration**: Change the color values at the top of `styles.scss`
2. **Compile SCSS**: Use your preferred SCSS compiler (Sass, node-sass, dart-sass, etc.)
3. **Use CSS Variables**: The compiled CSS will use CSS custom properties that can be changed dynamically

### Compilation

```bash
# Using Sass
sass styles.scss styles.css

# Using node-sass
node-sass styles.scss styles.css

# Watch mode
sass --watch styles.scss:styles.css
```

## Advanced Features

### Color Scale Generator
The SCSS automatically generates color scales (50-950) from your base colors:

```scss
@include color-scale('primary', $primary-base);
```

This creates:
- `--color-primary-50` (lightest)
- `--color-primary-100`
- ...
- `--color-primary-900`
- `--color-primary-950` (darkest)

### Theme Switching
Toggle between light and dark themes by adding/removing the `data-theme="dark"` attribute:

```html
<html data-theme="dark">
  <!-- Dark theme -->
</html>

<html>
  <!-- Light theme (or system preference) -->
</html>
```

### Utility Classes

Use pre-built utility classes for common patterns:

```html
<!-- Surfaces -->
<div class="surface-base"></div>
<div class="surface-raised"></div>
<div class="surface-floating"></div>

<!-- Buttons -->
<button class="btn-primary"></button>
<button class="btn-secondary"></button>
<button class="btn-ghost"></button>

<!-- Effects -->
<div class="glass-morphism"></div>
<div class="liquid-glass"></div>
<div class="holographic"></div>

<!-- Gradients -->
<div class="gradient-primary"></div>
<div class="gradient-aurora"></div>

<!-- Semantic Colors -->
<div class="bg-success text-success"></div>
<div class="bg-danger text-danger"></div>

<!-- Elevation -->
<div class="elevation-3"></div>
```

## Benefits of This Structure

1. **Easy Customization**: Change colors in one place at the top
2. **Automatic Color Scales**: Generated from base colors
3. **Theme Support**: Built-in light/dark mode
4. **CSS Variables**: Runtime customization possible
5. **SCSS Features**: Nesting, mixins, functions for cleaner code
6. **Maintainable**: Clear organization and structure
7. **Responsive**: Mobile-first approach with breakpoints
8. **Accessible**: Focus states, reduced motion support

## Example: Changing to a Different Theme

Want a purple theme? Just change:

```scss
// LIGHT MODE
$primary-base: #9333ea;     // Purple
$secondary-base: #ec4899;   // Pink
$accent-base: #06b6d4;      // Cyan (keep or change)

// DARK MODE
$primary-dark: #a855f7;     // Lighter purple
$secondary-dark: #f472b6;   // Lighter pink
$accent-dark: #22d3ee;      // Lighter cyan
```

That's it! All buttons, links, focus states, and brand elements will update automatically.

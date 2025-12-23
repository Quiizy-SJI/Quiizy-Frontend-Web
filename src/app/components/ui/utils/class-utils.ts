// ============================================
// QUIZZY UI COMPONENT LIBRARY - CLASS UTILITIES
// ============================================

/**
 * Combines multiple class names into a single string, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Creates a class string from a record of conditional classes
 */
export function classMap(classes: Record<string, boolean | undefined>): string {
  return Object.entries(classes)
    .filter(([_, condition]) => condition)
    .map(([className]) => className)
    .join(' ');
}

/**
 * Creates a BEM class name
 */
export function bem(block: string, element?: string, modifier?: string | string[]): string {
  let className = block;

  if (element) {
    className += `__${element}`;
  }

  if (modifier) {
    if (Array.isArray(modifier)) {
      return modifier.map(m => `${className}--${m}`).join(' ');
    }
    className += `--${modifier}`;
  }

  return className;
}

/**
 * Creates size class based on component prefix
 */
export function sizeClass(prefix: string, size: string): string {
  return `${prefix}--${size}`;
}

/**
 * Creates color variant class based on component prefix
 */
export function colorClass(prefix: string, color: string): string {
  return `${prefix}--${color}`;
}

/**
 * Creates variant class based on component prefix
 */
export function variantClass(prefix: string, variant: string): string {
  return `${prefix}--${variant}`;
}

/**
 * Generates unique ID for components
 */
export function generateId(prefix: string = 'quizzy'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates responsive classes for different breakpoints
 */
export function responsive(
  base: string,
  breakpoints?: { sm?: string; md?: string; lg?: string; xl?: string }
): string {
  const classes = [base];

  if (breakpoints) {
    if (breakpoints.sm) classes.push(`sm:${breakpoints.sm}`);
    if (breakpoints.md) classes.push(`md:${breakpoints.md}`);
    if (breakpoints.lg) classes.push(`lg:${breakpoints.lg}`);
    if (breakpoints.xl) classes.push(`xl:${breakpoints.xl}`);
  }

  return classes.join(' ');
}

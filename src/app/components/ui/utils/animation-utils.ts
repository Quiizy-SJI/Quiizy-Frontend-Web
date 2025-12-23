// ============================================
// QUIZZY UI COMPONENT LIBRARY - ANIMATION UTILITIES
// ============================================

/**
 * CSS Animation timing configurations
 */
export const ANIMATION_TIMING = {
  instant: '0ms',
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '750ms'
} as const;

export const EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;

/**
 * Animation keyframes for common animations
 */
export const KEYFRAMES = {
  fadeIn: [
    { opacity: 0 },
    { opacity: 1 }
  ],
  fadeOut: [
    { opacity: 1 },
    { opacity: 0 }
  ],
  slideInUp: [
    { transform: 'translateY(10px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  slideInDown: [
    { transform: 'translateY(-10px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  slideInLeft: [
    { transform: 'translateX(-10px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  slideInRight: [
    { transform: 'translateX(10px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  scaleIn: [
    { transform: 'scale(0.95)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  scaleOut: [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(0.95)', opacity: 0 }
  ],
  pulse: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.05)' },
    { transform: 'scale(1)' }
  ],
  shake: [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(0)' }
  ]
} as const;

/**
 * Creates Web Animation API options
 */
export function createAnimationOptions(
  duration: keyof typeof ANIMATION_TIMING = 'normal',
  easing: keyof typeof EASING = 'easeOut',
  options?: Partial<KeyframeAnimationOptions>
): KeyframeAnimationOptions {
  return {
    duration: parseInt(ANIMATION_TIMING[duration]),
    easing: EASING[easing],
    fill: 'forwards',
    ...options
  };
}

/**
 * Animate element with Web Animation API
 */
export function animate(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation {
  return element.animate(keyframes, options);
}

/**
 * Fade in animation helper
 */
export function fadeIn(element: HTMLElement, duration: keyof typeof ANIMATION_TIMING = 'normal'): Animation {
  return animate(element, [...KEYFRAMES.fadeIn], createAnimationOptions(duration));
}

/**
 * Fade out animation helper
 */
export function fadeOut(element: HTMLElement, duration: keyof typeof ANIMATION_TIMING = 'normal'): Animation {
  return animate(element, [...KEYFRAMES.fadeOut], createAnimationOptions(duration));
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate duration based on reduced motion preference
 */
export function getMotionDuration(duration: keyof typeof ANIMATION_TIMING): string {
  return prefersReducedMotion() ? ANIMATION_TIMING.instant : ANIMATION_TIMING[duration];
}

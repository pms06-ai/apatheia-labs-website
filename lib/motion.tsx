'use client';

import { Variants } from 'framer-motion';

/**
 * Vercel-style easing curve - smooth and modern
 */
export const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Standard animation duration
 */
export const duration = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

/**
 * Fade in from opacity 0
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

/**
 * Fade in and slide up from below
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

/**
 * Fade in and slide down from above
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

/**
 * Scale in from slightly smaller
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

/**
 * Container for staggered children animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Fast stagger for dense content
 */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/**
 * Slow stagger for hero sections
 */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

/**
 * Hover scale effect for cards
 */
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: duration.fast,
    ease: easeOut,
  },
};

/**
 * Tap scale effect for buttons
 */
export const tapScale = {
  scale: 0.98,
};

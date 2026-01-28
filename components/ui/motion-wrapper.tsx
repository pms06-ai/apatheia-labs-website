'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/motion';

interface MotionWrapperProps {
  children: ReactNode;
  /** Custom animation variants */
  variants?: Variants;
  /** Viewport amount needed to trigger (0-1) */
  amount?: number;
  /** Whether to animate only once */
  once?: boolean;
  /** Additional delay in seconds */
  delay?: number;
  /** Custom className */
  className?: string;
}

/**
 * Scroll-triggered animation wrapper using Framer Motion.
 * Replaces CSS `.animate-fade-in-up` pattern with proper scroll detection.
 */
export function MotionWrapper({
  children,
  variants = fadeInUp,
  amount = 0.2,
  once = true,
  delay = 0,
  className,
}: MotionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  /** Custom stagger variants */
  variants?: Variants;
  /** Viewport amount needed to trigger (0-1) */
  amount?: number;
  /** Whether to animate only once */
  once?: boolean;
  /** Custom className */
  className?: string;
  /** Element tag to render */
  as?: 'div' | 'ul' | 'ol';
}

/**
 * Container for staggered children animations.
 * Children should use MotionItem with fadeInUp variants.
 */
export function StaggerContainer({
  children,
  variants = staggerContainer,
  amount = 0.1,
  once = true,
  className,
  as = 'div',
}: StaggerContainerProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const olRef = useRef<HTMLOListElement>(null);

  const activeRef = as === 'ul' ? ulRef : as === 'ol' ? olRef : divRef;
  const isInView = useInView(activeRef, { once, amount });

  if (as === 'ul') {
    return (
      <motion.ul
        ref={ulRef}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={variants}
        className={className}
      >
        {children}
      </motion.ul>
    );
  }

  if (as === 'ol') {
    return (
      <motion.ol
        ref={olRef}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={variants}
        className={className}
      >
        {children}
      </motion.ol>
    );
  }

  return (
    <motion.div
      ref={divRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MotionItemProps {
  children: ReactNode;
  /** Custom animation variants */
  variants?: Variants;
  /** Custom className */
  className?: string;
  /** Element tag to render */
  as?: 'div' | 'li' | 'span';
}

/**
 * Motion item for use inside StaggerContainer.
 * Inherits animation timing from parent container.
 */
export function MotionItem({
  children,
  variants = fadeInUp,
  className,
  as = 'div',
}: MotionItemProps) {
  if (as === 'li') {
    return (
      <motion.li variants={variants} className={className}>
        {children}
      </motion.li>
    );
  }

  if (as === 'span') {
    return (
      <motion.span variants={variants} className={className}>
        {children}
      </motion.span>
    );
  }

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

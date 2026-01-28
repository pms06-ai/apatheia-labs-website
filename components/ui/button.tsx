'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { tapScale } from '@/lib/motion';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-500 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-bronze-600 to-bronze-500 text-white hover:from-bronze-500 hover:to-bronze-400 shadow-lg shadow-bronze-900/20',
        secondary:
          'border border-charcoal-700 bg-charcoal-850 text-charcoal-200 hover:bg-charcoal-800 hover:border-charcoal-600 hover:text-charcoal-100',
        ghost:
          'text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800/50',
        outline:
          'border border-bronze-600/40 text-bronze-400 hover:bg-bronze-600/10 hover:border-bronze-500/60',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  children: React.ReactNode;
}

/**
 * Button component with Framer Motion tap animation.
 * Can render as a button or Next.js Link.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileTap={tapScale}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };

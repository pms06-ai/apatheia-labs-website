'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ButtonSpinner } from './spinner'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-bronze-600 text-white hover:bg-bronze-500 active:bg-bronze-700',
        secondary:
          'bg-charcoal-700 text-charcoal-100 hover:bg-charcoal-600 active:bg-charcoal-800',
        ghost:
          'bg-transparent text-charcoal-100 hover:bg-charcoal-800 active:bg-charcoal-700',
        destructive:
          'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child component (Radix Slot pattern) */
  asChild?: boolean
  /** Show loading spinner and disable interactions */
  loading?: boolean
}

/**
 * Button component with variants following the Apatheia Labs design system.
 *
 * @example
 * ```tsx
 * <Button>Default</Button>
 * <Button variant="primary" size="lg">Primary Large</Button>
 * <Button variant="ghost" disabled>Disabled Ghost</Button>
 * <Button loading>Saving...</Button>
 * <Button asChild><a href="/link">Link Button</a></Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <ButtonSpinner />}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }

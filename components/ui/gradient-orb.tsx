'use client';

import { cn } from '@/lib/utils';

type OrbPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type OrbSize = 'sm' | 'md' | 'lg' | 'xl';

interface GradientOrbProps {
  /** Position of the orb */
  position?: OrbPosition;
  /** Size of the orb */
  size?: OrbSize;
  /** Opacity of the orb (0-100) */
  opacity?: number;
  /** Custom className */
  className?: string;
  /** Use bronze accent color instead of default */
  bronze?: boolean;
}

const positionClasses: Record<OrbPosition, string> = {
  'top-left': '-top-1/4 -left-1/4',
  'top-center': '-top-1/4 left-1/2 -translate-x-1/2',
  'top-right': '-top-1/4 -right-1/4',
  'center-left': 'top-1/2 -left-1/4 -translate-y-1/2',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-right': 'top-1/2 -right-1/4 -translate-y-1/2',
  'bottom-left': '-bottom-1/4 -left-1/4',
  'bottom-center': '-bottom-1/4 left-1/2 -translate-x-1/2',
  'bottom-right': '-bottom-1/4 -right-1/4',
};

const sizeClasses: Record<OrbSize, string> = {
  sm: 'w-64 h-64',
  md: 'w-96 h-96',
  lg: 'w-[32rem] h-[32rem]',
  xl: 'w-[48rem] h-[48rem]',
};

/**
 * Vercel-style gradient orb background effect.
 * Place inside a relatively positioned container.
 */
export function GradientOrb({
  position = 'top-right',
  size = 'lg',
  opacity = 30,
  className,
  bronze = false,
}: GradientOrbProps) {
  const gradientColor = bronze
    ? 'from-bronze-600/40 via-bronze-500/20 to-transparent'
    : 'from-charcoal-600/30 via-charcoal-700/10 to-transparent';

  return (
    <div
      className={cn(
        'pointer-events-none absolute rounded-full bg-gradient-radial blur-3xl',
        gradientColor,
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      style={{ opacity: opacity / 100 }}
      aria-hidden="true"
    />
  );
}

interface GradientOrbContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Convenience wrapper that provides relative positioning for orbs.
 */
export function GradientOrbContainer({
  children,
  className,
}: GradientOrbContainerProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
    </div>
  );
}

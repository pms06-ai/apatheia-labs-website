'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'avatar' | 'button'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles = 'bg-charcoal-600'

  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    avatar: 'rounded-full h-10 w-10',
    button: 'rounded-lg h-9 w-24',
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-charcoal-600 via-charcoal-500 to-charcoal-600 bg-[length:200%_100%]',
    none: '',
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], animations[animation], className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  )
}

// Pre-built skeleton compositions
export function SkeletonCard() {
  return (
    <div className="bg-charcoal-800 rounded-lg p-4 animate-pulse">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonFinding() {
  return (
    <div className="bg-charcoal-800 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonDocument() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="flex-1">
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-4 rounded-lg border border-charcoal-700 bg-bg-secondary">
          <Skeleton width={32} height={32} className="mb-2" />
          <Skeleton width="60%" height={24} className="mb-1" />
          <Skeleton width="40%" height={12} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-charcoal-700 overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-3 bg-bg-tertiary border-b border-charcoal-700">
        <Skeleton width="20%" height={14} />
        <Skeleton width="30%" height={14} />
        <Skeleton width="25%" height={14} />
        <Skeleton width="15%" height={14} />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border-b border-charcoal-700 last:border-0">
          <Skeleton width="20%" height={14} />
          <Skeleton width="30%" height={14} />
          <Skeleton width="25%" height={14} />
          <Skeleton width="15%" height={14} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonEngine() {
  return (
    <div className="p-4 rounded-lg border border-charcoal-700 bg-bg-secondary">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton width="50%" height={16} />
            <Skeleton width={40} height={18} className="rounded" />
          </div>
          <Skeleton width="70%" height={12} />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton width={80} height={12} />
            <Skeleton width={60} height={18} className="rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Full page loading state
export function SkeletonPage() {
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width={200} height={28} />
          <Skeleton width={300} height={14} />
        </div>
        <Skeleton width={120} height={40} className="rounded-lg" />
      </div>

      {/* Stats */}
      <SkeletonStats />

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <Skeleton width={150} height={16} />
          {[1, 2, 3].map(i => (
            <SkeletonEngine key={i} />
          ))}
        </div>
        <div className="col-span-2 space-y-4">
          <Skeleton width={200} height={16} />
          {[1, 2, 3].map(i => (
            <SkeletonFinding key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Flexible list skeleton for loading multiple items
export function SkeletonList({
  count = 5,
  variant = 'card',
}: {
  count?: number
  variant?: 'card' | 'finding' | 'document'
}) {
  const Component =
    variant === 'finding'
      ? SkeletonFinding
      : variant === 'document'
        ? SkeletonDocument
        : SkeletonCard
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}

// Entity linkage skeleton
export function SkeletonLinkage() {
  return (
    <div className="rounded-lg border border-charcoal-700 bg-charcoal-800/80 p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}

// Job queue skeleton
export function SkeletonJob() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-charcoal-700 bg-charcoal-800/50 animate-pulse">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-1.5 w-full rounded-full" />
      </div>
      <Skeleton className="h-6 w-10" />
    </div>
  )
}

// SAM results skeleton
export function SkeletonSAMResults() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      {/* Tabs placeholder */}
      <div className="flex gap-2 border-b border-charcoal-800 pb-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-8 w-24 rounded" />
        ))}
      </div>
      {/* Content placeholder */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-lg border border-charcoal-700 bg-charcoal-800/50 p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

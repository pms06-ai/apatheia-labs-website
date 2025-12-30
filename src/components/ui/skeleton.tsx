'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
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
  const baseStyles = 'bg-[#2C2C2E]'
  
  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }
  
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-[#2C2C2E] via-[#3C3C3E] to-[#2C2C2E] bg-[length:200%_100%]',
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
    <div className="p-4 rounded-lg border border-[rgba(245,245,241,0.06)] bg-[#161618]">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="80%" height={12} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonFinding() {
  return (
    <div className="p-4 rounded-lg border-l-4 border-l-[#6B6B6B] border border-[rgba(245,245,241,0.06)] bg-[#161618]">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton width={60} height={20} className="rounded" />
            <Skeleton width={80} height={20} className="rounded" />
          </div>
          <Skeleton width="70%" height={18} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="85%" height={14} />
          <div className="flex gap-2 mt-3">
            <Skeleton width={100} height={24} className="rounded" />
            <Skeleton width={100} height={24} className="rounded" />
          </div>
        </div>
        <Skeleton width={50} height={30} />
      </div>
    </div>
  )
}

export function SkeletonDocument() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgba(245,245,241,0.06)] bg-[#161618]">
      <Skeleton variant="rectangular" width={40} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={12} />
      </div>
      <Skeleton variant="circular" width={24} height={24} />
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="p-4 rounded-lg border border-[rgba(245,245,241,0.06)] bg-[#161618]">
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
    <div className="rounded-lg border border-[rgba(245,245,241,0.06)] overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-3 bg-[#1C1C1E] border-b border-[rgba(245,245,241,0.06)]">
        <Skeleton width="20%" height={14} />
        <Skeleton width="30%" height={14} />
        <Skeleton width="25%" height={14} />
        <Skeleton width="15%" height={14} />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border-b border-[rgba(245,245,241,0.06)] last:border-0">
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
    <div className="p-4 rounded-lg border border-[rgba(245,245,241,0.06)] bg-[#161618]">
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

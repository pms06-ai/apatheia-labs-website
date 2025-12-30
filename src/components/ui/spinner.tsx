'use client'

import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  label?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label || 'Loading'}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-[#B8860B] border-t-transparent',
          sizes[size]
        )}
      />
      {label && (
        <span className="ml-2 text-sm text-[#9A9A9A]">{label}</span>
      )}
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  )
}

// Full page loading spinner
export function PageSpinner({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0F0F10]/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Apatheia Alpha logo */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#B8860B] to-[#8B7355] flex items-center justify-center text-3xl text-[#F5F5F1] font-serif shadow-lg shadow-[#B8860B]/20">
          Α
        </div>
        <Spinner size="lg" />
        {message && (
          <p className="text-[#9A9A9A] text-sm font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// Inline loading state
export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-[#9A9A9A]">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  )
}

// Button spinner for loading states
export function ButtonSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// Progress indicator for long operations
interface ProgressSpinnerProps {
  progress?: number
  label?: string
  showPercentage?: boolean
}

export function ProgressSpinner({
  progress,
  label,
  showPercentage = true,
}: ProgressSpinnerProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = progress !== undefined
    ? circumference - (progress / 100) * circumference
    : 0

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="#2C2C2E"
            strokeWidth="6"
            fill="none"
          />
          {progress !== undefined ? (
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="#B8860B"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          ) : (
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="#B8860B"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.75}
              className="animate-spin origin-center"
              style={{ animationDuration: '1.5s' }}
            />
          )}
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {progress !== undefined && showPercentage ? (
            <span className="text-lg font-semibold text-[#F5F5F1]">
              {Math.round(progress)}%
            </span>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#B8860B] animate-pulse" />
          )}
        </div>
      </div>
      {label && (
        <p className="text-sm text-[#9A9A9A]">{label}</p>
      )}
    </div>
  )
}

// Engine processing indicator
export function EngineProcessing({ engineName }: { engineName: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-[#161618] border border-[#B8860B]/30">
      <div className="relative">
        <Spinner size="md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#B8860B] animate-ping" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-[#F5F5F1]">
          Running {engineName}
        </p>
        <p className="text-xs text-[#6B6B6B]">
          Analyzing documents...
        </p>
      </div>
    </div>
  )
}

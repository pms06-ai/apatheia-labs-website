'use client'

import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ErrorCardProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  variant?: 'inline' | 'card' | 'fullPage'
  showReportLink?: boolean
}

export function ErrorCard({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  variant = 'card',
  showReportLink = false,
}: ErrorCardProps) {
  const isInline = variant === 'inline'
  const isFullPage = variant === 'fullPage'

  return (
    <div
      className={cn(
        'flex items-center gap-4',
        isInline && 'py-2',
        variant === 'card' &&
          'rounded-lg border border-red-500/30 bg-charcoal-800 p-4',
        isFullPage &&
          'min-h-[300px] flex-col justify-center rounded-lg border border-red-500/30 bg-charcoal-800/50 p-8 text-center'
      )}
      role="alert"
    >
      <AlertTriangle
        className={cn(
          'shrink-0 text-red-500',
          isInline && 'h-4 w-4',
          variant === 'card' && 'h-5 w-5',
          isFullPage && 'h-10 w-10'
        )}
        aria-hidden="true"
      />

      <div className={cn('flex-1', isFullPage && 'space-y-2')}>
        <h3
          className={cn(
            'font-medium text-charcoal-100',
            isInline && 'text-sm',
            variant === 'card' && 'text-sm',
            isFullPage && 'text-lg'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-charcoal-400',
            isInline && 'text-xs',
            variant === 'card' && 'mt-1 text-sm',
            isFullPage && 'text-sm'
          )}
        >
          {message}
        </p>
      </div>

      <div
        className={cn(
          'flex gap-2',
          isFullPage && 'mt-4 flex-col items-center sm:flex-row'
        )}
      >
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {retryLabel}
          </Button>
        )}

        {showReportLink && (
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <a
              href="https://github.com/apatheia-labs/phronesis/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Report Issue
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

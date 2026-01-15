'use client'

/**
 * APATHEIA LABS - ERROR BOUNDARY
 *
 * Catches React rendering errors and displays fallback UI.
 * Logs errors for debugging and provides recovery options.
 */

import React, { Component, type ErrorInfo, type ReactNode, useState } from 'react'
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Default error fallback component using the design system
 */
function DefaultErrorFallback({
  error,
  errorInfo,
  showDetails,
  onReset,
  onReload,
}: {
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
  onReset: () => void
  onReload: () => void
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="flex min-h-[400px] items-center justify-center p-10">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
        </div>

        {/* Error Title */}
        <h2 className="mb-3 font-display text-xl text-charcoal-100">
          Something went wrong
        </h2>

        {/* Error Message */}
        <p className="mb-6 text-sm leading-relaxed text-charcoal-400">
          An unexpected error occurred. Our team has been notified.
          You can try refreshing the page or going back.
        </p>

        {/* Error Details (Development or opt-in) */}
        {(showDetails || isDevelopment) && error && (
          <div className="mb-6 rounded-lg border border-charcoal-700 bg-charcoal-800 text-left">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-mono text-xs text-red-400">
                {error.name}: {error.message}
              </span>
              {detailsOpen ? (
                <ChevronUp className="h-4 w-4 text-charcoal-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-charcoal-500" />
              )}
            </button>

            {detailsOpen && (
              <div className="border-t border-charcoal-700 p-4">
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-charcoal-400">
                  {error.stack}
                </pre>
                {errorInfo?.componentStack && (
                  <>
                    <div className="my-3 border-t border-charcoal-700" />
                    <p className="mb-2 text-xs font-medium text-charcoal-300">
                      Component Stack:
                    </p>
                    <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-charcoal-500">
                      {errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg border border-charcoal-700 bg-charcoal-800 px-4 py-2.5 text-sm font-medium text-charcoal-100 transition-colors hover:border-charcoal-600 hover:bg-charcoal-700"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </button>
          <button
            onClick={onReload}
            className="flex items-center gap-2 rounded-lg bg-bronze-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bronze-500"
          >
            Reload Page
          </button>
        </div>

        {/* Report Issue Link */}
        <a
          href="https://github.com/apatheia-labs/phronesis/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-charcoal-500 transition-colors hover:text-charcoal-300"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Report this issue
        </a>
      </div>
    </div>
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })

    // Log error
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)

    // Call optional error handler
    this.props.onError?.(error, errorInfo)

    // In production, you might want to send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking (e.g., Sentry)
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI using design system
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          showDetails={this.props.showDetails ?? false}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      )
    }

    return this.props.children
  }
}

/**
 * HOC to wrap component with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}

/**
 * Hook-friendly error boundary wrapper
 */
export function ErrorBoundaryWrapper({
  children,
  name,
}: {
  children: ReactNode
  name?: string
}) {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error(`[ErrorBoundary:${name || 'unknown'}]`, error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary

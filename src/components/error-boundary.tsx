'use client'

/**
 * APATHEIA LABS - ERROR BOUNDARY
 * 
 * Catches React rendering errors and displays fallback UI.
 * Logs errors for debugging and provides recovery options.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react'

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

      // Default fallback UI
      return (
        <div
          style={{
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            backgroundColor: '#0F0F10',
            borderRadius: '12px',
            margin: '20px',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(201, 74, 74, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              ⚠️
            </div>

            {/* Error Title */}
            <h2
              style={{
                color: '#F5F5F1',
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                fontFamily: 'Georgia, serif',
              }}
            >
              Something went wrong
            </h2>

            {/* Error Message */}
            <p
              style={{
                color: '#9A9A9A',
                fontSize: '14px',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              An unexpected error occurred. Our team has been notified.
              You can try refreshing the page or going back.
            </p>

            {/* Error Details (Development only) */}
            {(this.props.showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
              <details
                style={{
                  textAlign: 'left',
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: '#1C1C1E',
                  borderRadius: '8px',
                  border: '1px solid rgba(245, 245, 241, 0.06)',
                }}
              >
                <summary
                  style={{
                    color: '#C94A4A',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    marginBottom: '8px',
                  }}
                >
                  {this.state.error.name}: {this.state.error.message}
                </summary>
                <pre
                  style={{
                    color: '#6B6B6B',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: '8px',
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#F5F5F1',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(245, 245, 241, 0.1)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 245, 241, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(245, 245, 241, 0.1)'
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1C1C1E',
                  backgroundColor: '#B8860B',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4A017'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#B8860B'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
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

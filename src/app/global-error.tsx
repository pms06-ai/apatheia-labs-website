'use client'

import { useEffect } from 'react'

const brand = {
  charcoal: '#1C1C1E',
  bronze: '#B8860B',
  offWhite: '#F5F5F1',
  warmGray: '#6B6B6B',
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F0F10',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '48px',
          maxWidth: '480px',
        }}>
          {/* Logo */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${brand.bronze} 0%, #8B7355 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            color: brand.offWhite,
            boxShadow: `0 4px 16px rgba(184,134,11,0.3)`,
          }}>
            Α
          </div>

          {/* Error Icon */}
          <div style={{
            fontSize: 48,
            marginBottom: 16,
          }}>
            ⚠️
          </div>

          {/* Title */}
          <h1 style={{
            color: brand.offWhite,
            fontFamily: 'Georgia, serif',
            fontSize: 28,
            fontWeight: 400,
            margin: '0 0 8px',
          }}>
            Something Went Wrong
          </h1>

          {/* Message */}
          <p style={{
            color: brand.warmGray,
            fontSize: 14,
            lineHeight: 1.6,
            margin: '0 0 24px',
          }}>
            An unexpected error occurred. Our team has been notified 
            and is working to resolve the issue.
          </p>

          {/* Error digest for debugging */}
          {error.digest && (
            <p style={{
              color: brand.warmGray,
              fontSize: 11,
              fontFamily: 'monospace',
              background: brand.charcoal,
              padding: '8px 12px',
              borderRadius: 6,
              marginBottom: 24,
            }}>
              Error ID: {error.digest}
            </p>
          )}

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
          }}>
            <button
              onClick={reset}
              style={{
                background: brand.bronze,
                color: brand.charcoal,
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: 'transparent',
                color: brand.offWhite,
                border: `1px solid ${brand.warmGray}40`,
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Go Home
            </button>
          </div>

          {/* Footer */}
          <p style={{
            marginTop: 48,
            color: brand.warmGray,
            fontSize: 11,
          }}>
            Phronesis FCIP • Apatheia Labs
          </p>
        </div>
      </body>
    </html>
  )
}

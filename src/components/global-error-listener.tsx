'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { logger } from '@/lib/logger'
import { normalizeError } from '@/lib/error-report'

const TOAST_ID = 'global-error'
const TOAST_COOLDOWN_MS = 8000

export function GlobalErrorListener() {
  useEffect(() => {
    let lastToastAt = 0

    const maybeNotify = () => {
      const now = Date.now()
      if (now - lastToastAt < TOAST_COOLDOWN_MS) return
      lastToastAt = now
      if (process.env.NODE_ENV !== 'development') {
        toast.error('Unexpected error occurred. Try reloading or report the issue.', {
          id: TOAST_ID,
        })
      }
    }

    const handleError = (event: ErrorEvent) => {
      const error = event.error instanceof Error ? event.error : new Error(event.message)
      const normalized = normalizeError(error)

      logger.error('Unhandled window error', error, {
        name: normalized.name,
        message: normalized.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
      })

      maybeNotify()
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      const normalized = normalizeError(reason)

      logger.error('Unhandled promise rejection', reason, {
        name: normalized.name,
        message: normalized.message,
      })

      maybeNotify()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}

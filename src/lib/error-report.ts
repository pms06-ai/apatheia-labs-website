export interface NormalizedError {
  name: string
  message: string
  stack?: string
}

export interface ErrorReportOptions {
  error: unknown
  componentStack?: string
  errorId?: string | null
  context?: Record<string, unknown>
}

const REPORT_TRUNCATE_LIMIT = 3000

function safeStringify(value: unknown, space?: number): string {
  try {
    return JSON.stringify(value, null, space)
  } catch {
    return String(value)
  }
}

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof Error) {
    return {
      name: error.name || 'Error',
      message: error.message || 'Unknown error',
      stack: error.stack,
    }
  }

  if (typeof error === 'string') {
    return { name: 'Error', message: error }
  }

  if (error && typeof error === 'object') {
    const errorObj = error as { name?: unknown; message?: unknown; stack?: unknown }
    const name = typeof errorObj.name === 'string' && errorObj.name ? errorObj.name : 'Error'
    const message =
      typeof errorObj.message === 'string' && errorObj.message
        ? errorObj.message
        : safeStringify(error)
    const stack = typeof errorObj.stack === 'string' ? errorObj.stack : undefined

    return { name, message, stack }
  }

  return { name: 'Error', message: String(error) }
}

function getAppMode(): string {
  if (typeof window === 'undefined') return 'unknown'
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window ? 'desktop' : 'web'
}

export function buildErrorReport({
  error,
  componentStack,
  errorId,
  context,
}: ErrorReportOptions): string {
  const normalized = normalizeError(error)
  const lines: string[] = [
    'Phronesis Error Report',
    `Error ID: ${errorId || 'unknown'}`,
    `Timestamp: ${new Date().toISOString()}`,
    `Mode: ${getAppMode()}`,
  ]

  if (typeof window !== 'undefined') {
    lines.push(`Location: ${window.location.href}`)
  }
  if (typeof navigator !== 'undefined') {
    lines.push(`User Agent: ${navigator.userAgent}`)
  }

  lines.push(`Name: ${normalized.name}`)
  lines.push(`Message: ${normalized.message}`)

  if (normalized.stack) {
    lines.push('Stack:')
    lines.push(normalized.stack)
  }

  if (componentStack) {
    lines.push('Component Stack:')
    lines.push(componentStack.trim())
  }

  if (context && Object.keys(context).length > 0) {
    lines.push('Context:')
    lines.push(safeStringify(context, 2))
  }

  return lines.join('\n')
}

export function buildIssueUrl(report: string, title: string = 'Crash report'): string {
  const truncated =
    report.length > REPORT_TRUNCATE_LIMIT
      ? `${report.slice(0, REPORT_TRUNCATE_LIMIT)}\n\n[truncated]`
      : report
  const params = new URLSearchParams({
    title,
    body: truncated,
  })
  return `https://github.com/apatheia-labs/phronesis/issues/new?${params.toString()}`
}

export async function copyReportToClipboard(report: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(report)
    return true
  }

  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea')
    textarea.value = report
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }

  return false
}

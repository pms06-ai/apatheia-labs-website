/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * APATHEIA LABS - ERROR HANDLING SYSTEM
 * 
 * Structured error types for consistent error handling across the platform.
 * All errors extend AppError which provides:
 * - Consistent error structure
 * - HTTP status codes
 * - Error codes for client handling
 * - Contextual metadata
 */

export type ErrorCode =
  // Auth errors
  | 'AUTH_REQUIRED'
  | 'AUTH_INVALID'
  | 'AUTH_EXPIRED'
  | 'AUTH_FORBIDDEN'
  // Validation errors
  | 'VALIDATION_ERROR'
  | 'INVALID_INPUT'
  | 'MISSING_FIELD'
  | 'INVALID_FORMAT'
  // Resource errors
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'CONFLICT'
  // Engine errors
  | 'ENGINE_NOT_FOUND'
  | 'ENGINE_EXECUTION_FAILED'
  | 'ENGINE_TIMEOUT'
  | 'ENGINE_INVALID_INPUT'
  // External service errors
  | 'AI_SERVICE_ERROR'
  | 'AI_RATE_LIMITED'
  | 'AI_CONTEXT_EXCEEDED'
  | 'STORAGE_ERROR'
  | 'DATABASE_ERROR'
  // Processing errors
  | 'PROCESSING_FAILED'
  | 'DOCUMENT_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  // General
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'RATE_LIMITED'

export interface ErrorContext {
  [key: string]: unknown
}

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly context?: ErrorContext
  public readonly timestamp: string
  public readonly isOperational: boolean

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    context?: ErrorContext,
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.context = context
    this.timestamp = new Date().toISOString()
    this.isOperational = isOperational

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(process.env.NODE_ENV === 'development' && this.context && { context: this.context }),
      },
      timestamp: this.timestamp,
    }
  }
}

// ============================================
// SPECIFIC ERROR TYPES
// ============================================

export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'VALIDATION_ERROR', 400, context)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`
    super(message, 'NOT_FOUND', 404, { resource, identifier })
    this.name = 'NotFoundError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_REQUIRED', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 'AUTH_FORBIDDEN', 403)
    this.name = 'AuthorizationError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 'CONFLICT', 409, context)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter: number

  constructor(retryAfter: number = 60) {
    super(`Rate limit exceeded. Retry after ${retryAfter} seconds`, 'RATE_LIMITED', 429, { retryAfter })
    this.name = 'RateLimitError'
    this.retryAfter = retryAfter
  }
}

export class EngineError extends AppError {
  public readonly engineId: string

  constructor(engineId: string, message: string, context?: ErrorContext) {
    super(message, 'ENGINE_EXECUTION_FAILED', 500, { engineId, ...context })
    this.name = 'EngineError'
    this.engineId = engineId
  }
}

export class AIServiceError extends AppError {
  public readonly provider: string

  constructor(provider: string, message: string, context?: ErrorContext) {
    super(`${provider}: ${message}`, 'AI_SERVICE_ERROR', 502, { provider, ...context })
    this.name = 'AIServiceError'
    this.provider = provider
  }
}

export class DocumentProcessingError extends AppError {
  constructor(documentId: string, message: string, context?: ErrorContext) {
    super(message, 'PROCESSING_FAILED', 500, { documentId, ...context })
    this.name = 'DocumentProcessingError'
  }
}

// ============================================
// ERROR UTILITIES
// ============================================

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      'INTERNAL_ERROR',
      500,
      { originalError: error.name, stack: error.stack },
      false
    )
  }

  return new AppError(
    String(error),
    'INTERNAL_ERROR',
    500,
    undefined,
    false
  )
}

/**
 * Create error response for API routes
 */
export function errorResponse(error: unknown) {
  const appError = toAppError(error)

  return {
    body: appError.toJSON(),
    status: appError.statusCode,
  }
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorTransformer?: (error: unknown) => AppError
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      if (errorTransformer) {
        throw errorTransformer(error)
      }
      throw toAppError(error)
    }
  }) as T
}

/**
 * Retry wrapper for transient failures
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delayMs?: number
    backoffMultiplier?: number
    shouldRetry?: (error: unknown) => boolean
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
  } = options

  let lastError: unknown
  let currentDelay = delayMs

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error
      }

      console.warn(`[Retry] Attempt ${attempt}/${maxAttempts} failed, retrying in ${currentDelay}ms...`)
      await new Promise(resolve => setTimeout(resolve, currentDelay))
      currentDelay *= backoffMultiplier
    }
  }

  throw lastError
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!isAppError(error)) return true

  const retryableCodes: ErrorCode[] = [
    'AI_SERVICE_ERROR',
    'AI_RATE_LIMITED',
    'DATABASE_ERROR',
    'SERVICE_UNAVAILABLE',
  ]

  return retryableCodes.includes(error.code)
}

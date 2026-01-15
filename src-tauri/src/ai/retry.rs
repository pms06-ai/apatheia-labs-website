//! Retry logic for AI API calls
//!
//! Provides exponential backoff with jitter for handling transient API errors.

use std::time::Duration;

/// Configuration for retry behavior
#[derive(Debug, Clone)]
pub struct RetryConfig {
    /// Maximum number of attempts (including the first one)
    pub max_attempts: u32,
    /// Base delay in milliseconds for exponential backoff
    pub base_delay_ms: u64,
    /// Maximum delay in milliseconds (cap for exponential growth)
    pub max_delay_ms: u64,
    /// Jitter range in milliseconds to add randomness
    pub jitter_ms: u64,
}

impl Default for RetryConfig {
    fn default() -> Self {
        Self {
            max_attempts: 3,
            base_delay_ms: 1000,
            max_delay_ms: 10_000,
            jitter_ms: 250,
        }
    }
}

/// Classification of errors for retry decisions
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ErrorClass {
    /// Retry with backoff (rate limit, overloaded, server error)
    Retryable,
    /// Do not retry (auth, invalid request, client error)
    NonRetryable,
}

/// Classify HTTP status codes for retry decisions
pub fn classify_status(status: u16) -> ErrorClass {
    match status {
        // Rate limiting
        429 => ErrorClass::Retryable,
        // Anthropic overloaded
        529 => ErrorClass::Retryable,
        // Server errors
        500 | 502 | 503 | 504 => ErrorClass::Retryable,
        // Everything else (including 4xx client errors)
        _ => ErrorClass::NonRetryable,
    }
}

/// Classify error messages for retry decisions
pub fn classify_error_message(msg: &str) -> ErrorClass {
    let lower = msg.to_lowercase();

    // Retryable conditions
    if lower.contains("rate limit")
        || lower.contains("overloaded")
        || lower.contains("timeout")
        || lower.contains("timed out")
        || lower.contains("temporarily unavailable")
        || lower.contains("connection reset")
        || lower.contains("connection refused")
    {
        return ErrorClass::Retryable;
    }

    // Non-retryable conditions
    if lower.contains("invalid api key")
        || lower.contains("authentication")
        || lower.contains("unauthorized")
        || lower.contains("permission denied")
        || lower.contains("invalid request")
    {
        return ErrorClass::NonRetryable;
    }

    // Default to non-retryable for unknown errors
    ErrorClass::NonRetryable
}

/// Calculate delay for a given attempt using exponential backoff with jitter
pub fn calculate_delay(attempt: u32, config: &RetryConfig) -> Duration {
    // Exponential backoff: base * 2^attempt
    let base = config.base_delay_ms.saturating_mul(2u64.saturating_pow(attempt));

    // Cap at max delay
    let capped = base.min(config.max_delay_ms);

    // Add jitter (simple pseudo-random using system time)
    let jitter = if config.jitter_ms > 0 {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_nanos() as u64)
            .unwrap_or(0);
        now % config.jitter_ms
    } else {
        0
    };

    Duration::from_millis(capped.saturating_add(jitter))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_classify_429_as_retryable() {
        assert_eq!(classify_status(429), ErrorClass::Retryable);
    }

    #[test]
    fn test_classify_529_as_retryable() {
        assert_eq!(classify_status(529), ErrorClass::Retryable);
    }

    #[test]
    fn test_classify_500_as_retryable() {
        assert_eq!(classify_status(500), ErrorClass::Retryable);
        assert_eq!(classify_status(502), ErrorClass::Retryable);
        assert_eq!(classify_status(503), ErrorClass::Retryable);
        assert_eq!(classify_status(504), ErrorClass::Retryable);
    }

    #[test]
    fn test_classify_401_as_non_retryable() {
        assert_eq!(classify_status(401), ErrorClass::NonRetryable);
        assert_eq!(classify_status(403), ErrorClass::NonRetryable);
        assert_eq!(classify_status(400), ErrorClass::NonRetryable);
    }

    #[test]
    fn test_classify_error_messages() {
        assert_eq!(
            classify_error_message("rate limit exceeded"),
            ErrorClass::Retryable
        );
        assert_eq!(
            classify_error_message("API is overloaded"),
            ErrorClass::Retryable
        );
        assert_eq!(
            classify_error_message("invalid api key"),
            ErrorClass::NonRetryable
        );
    }

    #[test]
    fn test_delay_calculation_exponential() {
        let config = RetryConfig {
            max_attempts: 5,
            base_delay_ms: 1000,
            max_delay_ms: 10_000,
            jitter_ms: 0, // Disable jitter for predictable tests
        };

        assert_eq!(calculate_delay(0, &config).as_millis(), 1000);
        assert_eq!(calculate_delay(1, &config).as_millis(), 2000);
        assert_eq!(calculate_delay(2, &config).as_millis(), 4000);
        assert_eq!(calculate_delay(3, &config).as_millis(), 8000);
    }

    #[test]
    fn test_delay_capped_at_max() {
        let config = RetryConfig {
            max_attempts: 5,
            base_delay_ms: 1000,
            max_delay_ms: 5000,
            jitter_ms: 0,
        };

        // 2^4 * 1000 = 16000, but should be capped at 5000
        assert_eq!(calculate_delay(4, &config).as_millis(), 5000);
    }
}

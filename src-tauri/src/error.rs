//! Centralized error handling for the Phronesis application.
//!
//! Provides `AppError` enum with variants for all error categories,
//! implementing standard error traits and Serde serialization for IPC.

use serde::{Serialize, Serializer};
use thiserror::Error;

/// Application-wide error type for consistent error handling across all modules.
///
/// Each variant represents a distinct error category, enabling proper error
/// classification and user-friendly messaging in the frontend.
///
/// # Serialization
///
/// Serializes to JSON with structure:
/// ```json
/// { "error_type": "variant_name", "message": "details" }
/// ```
#[derive(Debug, Error)]
pub enum AppError {
    /// Database operation failures (SQLite, connection issues, query errors)
    #[error("Database error: {0}")]
    Database(String),

    /// File storage operations (read, write, delete, path resolution)
    #[error("Storage error: {0}")]
    Storage(String),

    /// AI/LLM API errors (Claude, model inference, token limits)
    #[error("AI error: {0}")]
    Ai(String),

    /// Input validation failures (invalid data, constraint violations)
    #[error("Validation error: {0}")]
    Validation(String),

    /// Resource not found (case, document, finding)
    #[error("Not found: {0}")]
    NotFound(String),

    /// Authentication/authorization failures
    #[error("Unauthorized: {0}")]
    Unauthorized(String),

    /// Document/data processing errors (PDF extraction, parsing)
    #[error("Processing error: {0}")]
    Processing(String),

    /// Sidecar process errors (engine runner, external tools)
    #[error("Sidecar error: {0}")]
    Sidecar(String),

    /// Operation cancelled by user or system
    #[error("Operation cancelled")]
    Cancelled,
}

impl AppError {
    /// Returns the error type name for serialization
    fn error_type(&self) -> &'static str {
        match self {
            AppError::Database(_) => "Database",
            AppError::Storage(_) => "Storage",
            AppError::Ai(_) => "Ai",
            AppError::Validation(_) => "Validation",
            AppError::NotFound(_) => "NotFound",
            AppError::Unauthorized(_) => "Unauthorized",
            AppError::Processing(_) => "Processing",
            AppError::Sidecar(_) => "Sidecar",
            AppError::Cancelled => "Cancelled",
        }
    }

    /// Returns the error message content
    fn message(&self) -> String {
        match self {
            AppError::Database(msg) => msg.clone(),
            AppError::Storage(msg) => msg.clone(),
            AppError::Ai(msg) => msg.clone(),
            AppError::Validation(msg) => msg.clone(),
            AppError::NotFound(msg) => msg.clone(),
            AppError::Unauthorized(msg) => msg.clone(),
            AppError::Processing(msg) => msg.clone(),
            AppError::Sidecar(msg) => msg.clone(),
            AppError::Cancelled => "Operation cancelled".to_string(),
        }
    }
}

/// Custom serialization for IPC compatibility.
///
/// Produces JSON in the format:
/// ```json
/// { "error_type": "Database", "message": "Connection failed" }
/// ```
impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        use serde::ser::SerializeStruct;

        let mut state = serializer.serialize_struct("AppError", 2)?;
        state.serialize_field("error_type", self.error_type())?;
        state.serialize_field("message", &self.message())?;
        state.end()
    }
}

// ============================================================================
// From implementations for automatic error conversion
// ============================================================================

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        match &err {
            sqlx::Error::RowNotFound => AppError::NotFound("Record not found".to_string()),
            sqlx::Error::Database(db_err) => {
                AppError::Database(format!("Database error: {}", db_err))
            }
            sqlx::Error::Io(io_err) => {
                AppError::Database(format!("Database I/O error: {}", io_err))
            }
            sqlx::Error::Configuration(config_err) => {
                AppError::Database(format!("Database configuration error: {}", config_err))
            }
            _ => AppError::Database(err.to_string()),
        }
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        match err.kind() {
            std::io::ErrorKind::NotFound => {
                AppError::NotFound(format!("File not found: {}", err))
            }
            std::io::ErrorKind::PermissionDenied => {
                AppError::Unauthorized(format!("Permission denied: {}", err))
            }
            std::io::ErrorKind::InvalidInput | std::io::ErrorKind::InvalidData => {
                AppError::Validation(format!("Invalid data: {}", err))
            }
            _ => AppError::Storage(err.to_string()),
        }
    }
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        if err.is_timeout() {
            AppError::Ai(format!("Request timeout: {}", err))
        } else if err.is_connect() {
            AppError::Ai(format!("Connection failed: {}", err))
        } else if err.is_status() {
            if let Some(status) = err.status() {
                match status.as_u16() {
                    401 | 403 => AppError::Unauthorized(format!("API authentication failed: {}", err)),
                    404 => AppError::NotFound(format!("API endpoint not found: {}", err)),
                    429 => AppError::Ai("Rate limit exceeded".to_string()),
                    500..=599 => AppError::Ai(format!("API server error: {}", err)),
                    _ => AppError::Ai(format!("API error ({}): {}", status, err)),
                }
            } else {
                AppError::Ai(err.to_string())
            }
        } else if err.is_decode() {
            AppError::Processing(format!("Failed to decode response: {}", err))
        } else {
            AppError::Ai(err.to_string())
        }
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        match err.classify() {
            serde_json::error::Category::Io => {
                AppError::Storage(format!("JSON I/O error: {}", err))
            }
            serde_json::error::Category::Syntax => {
                AppError::Validation(format!("Invalid JSON syntax: {}", err))
            }
            serde_json::error::Category::Data => {
                AppError::Validation(format!("Invalid JSON data: {}", err))
            }
            serde_json::error::Category::Eof => {
                AppError::Validation(format!("Unexpected end of JSON: {}", err))
            }
        }
    }
}

// ============================================================================
// Convenience type alias
// ============================================================================

/// Result type alias using AppError
pub type AppResult<T> = Result<T, AppError>;

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let err = AppError::Database("Connection failed".to_string());
        assert_eq!(err.to_string(), "Database error: Connection failed");

        let err = AppError::Cancelled;
        assert_eq!(err.to_string(), "Operation cancelled");
    }

    #[test]
    fn test_error_serialization() {
        let err = AppError::Database("Connection failed".to_string());
        let json = serde_json::to_string(&err).unwrap();
        assert!(json.contains("\"error_type\":\"Database\""));
        assert!(json.contains("\"message\":\"Connection failed\""));

        let err = AppError::Cancelled;
        let json = serde_json::to_string(&err).unwrap();
        assert!(json.contains("\"error_type\":\"Cancelled\""));
        assert!(json.contains("\"message\":\"Operation cancelled\""));
    }

    #[test]
    fn test_error_type_classification() {
        assert_eq!(AppError::Database("test".to_string()).error_type(), "Database");
        assert_eq!(AppError::Storage("test".to_string()).error_type(), "Storage");
        assert_eq!(AppError::Ai("test".to_string()).error_type(), "Ai");
        assert_eq!(AppError::Validation("test".to_string()).error_type(), "Validation");
        assert_eq!(AppError::NotFound("test".to_string()).error_type(), "NotFound");
        assert_eq!(AppError::Unauthorized("test".to_string()).error_type(), "Unauthorized");
        assert_eq!(AppError::Processing("test".to_string()).error_type(), "Processing");
        assert_eq!(AppError::Sidecar("test".to_string()).error_type(), "Sidecar");
        assert_eq!(AppError::Cancelled.error_type(), "Cancelled");
    }

    #[test]
    fn test_io_error_conversion() {
        let io_err = std::io::Error::new(std::io::ErrorKind::NotFound, "file missing");
        let app_err: AppError = io_err.into();
        assert!(matches!(app_err, AppError::NotFound(_)));

        let io_err = std::io::Error::new(std::io::ErrorKind::PermissionDenied, "access denied");
        let app_err: AppError = io_err.into();
        assert!(matches!(app_err, AppError::Unauthorized(_)));
    }

    #[test]
    fn test_json_error_conversion() {
        let json_err = serde_json::from_str::<String>("invalid").unwrap_err();
        let app_err: AppError = json_err.into();
        assert!(matches!(app_err, AppError::Validation(_)));
    }
}

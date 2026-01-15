//! AI Client Module
//!
//! Provides native Rust integration with AI providers (Claude).
//! This replaces the TypeScript sidecar approach with direct API calls.

mod client;
mod providers;
pub mod retry;
pub mod json_extract;

pub use client::{AIClient, AIConfig, AIResponse, Message, Role, Usage};
pub use providers::{AnthropicProvider, Provider};
pub use retry::{RetryConfig, ErrorClass, classify_status, classify_error_message, calculate_delay};
pub use json_extract::extract_json;

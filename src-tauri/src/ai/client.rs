//! AI Client - Unified interface for AI providers
//!
//! Provides a consistent API for interacting with different AI providers
//! (Claude) with automatic JSON parsing and error handling.

use serde::{Deserialize, Serialize};
use std::sync::Arc;

use super::providers::{AnthropicProvider, Provider, ProviderConfig};

/// Message role in a conversation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Role {
    User,
    Assistant,
    System,
}

/// A message in a conversation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub role: Role,
    pub content: String,
}

impl Message {
    pub fn user(content: impl Into<String>) -> Self {
        Self {
            role: Role::User,
            content: content.into(),
        }
    }

    pub fn assistant(content: impl Into<String>) -> Self {
        Self {
            role: Role::Assistant,
            content: content.into(),
        }
    }

    pub fn system(content: impl Into<String>) -> Self {
        Self {
            role: Role::System,
            content: content.into(),
        }
    }
}

/// Response from an AI provider
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIResponse {
    pub content: String,
    pub model: String,
    pub usage: Option<Usage>,
    pub stop_reason: Option<String>,
}

/// Token usage information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Usage {
    pub input_tokens: u32,
    pub output_tokens: u32,
}

/// Configuration for the AI client
#[derive(Debug, Clone)]
pub struct AIConfig {
    /// Which AI provider to use
    pub provider: ProviderType,
    /// API key for the provider (currently Anthropic)
    pub api_key: Option<String>,
    /// Model to use (e.g., "claude-sonnet-4-20250514")
    pub model: Option<String>,
    /// Maximum tokens in response
    pub max_tokens: u32,
    /// Temperature for response randomness (0.0 = deterministic)
    pub temperature: f32,
}

impl Default for AIConfig {
    fn default() -> Self {
        Self {
            provider: ProviderType::Anthropic,
            api_key: None,
            model: None,
            max_tokens: 4096,
            temperature: 0.0,
        }
    }
}

/// Supported AI providers
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ProviderType {
    Anthropic,
}

/// The main AI client
pub struct AIClient {
    provider: Arc<dyn Provider>,
    config: AIConfig,
}

impl AIClient {
    /// Create a new AI client with the given configuration
    pub fn new(config: AIConfig) -> Result<Self, String> {
        let provider: Arc<dyn Provider> = match config.provider {
            ProviderType::Anthropic => {
                let api_key = config.api_key.clone()
                    .ok_or_else(|| "API key not configured".to_string())?;

                let provider_config = ProviderConfig {
                    api_key: Some(api_key),
                    model: config.model.clone()
                        .unwrap_or_else(|| "claude-sonnet-4-20250514".to_string()),
                    max_tokens: config.max_tokens,
                    temperature: config.temperature,
                };

                Arc::new(AnthropicProvider::new(provider_config))
            }
        };

        Ok(Self { provider, config })
    }

    /// Create a client from environment variables
    pub fn from_env() -> Result<Self, String> {
        let api_key = std::env::var("ANTHROPIC_API_KEY").ok();

        if api_key.is_none() {
            return Err("ANTHROPIC_API_KEY not found in environment".to_string());
        }

        let config = AIConfig {
            provider: ProviderType::Anthropic,
            api_key,
            ..Default::default()
        };

        Self::new(config)
    }

    /// Send a simple prompt and get a response
    pub async fn prompt(&self, prompt: &str) -> Result<AIResponse, String> {
        let messages = vec![Message::user(prompt)];
        self.provider.complete(messages, None).await
    }

    /// Send a prompt with a system message
    pub async fn prompt_with_system(&self, system: &str, prompt: &str) -> Result<AIResponse, String> {
        let messages = vec![Message::user(prompt)];
        self.provider.complete(messages, Some(system)).await
    }

    /// Send a multi-turn conversation
    pub async fn chat(&self, messages: Vec<Message>, system: Option<&str>) -> Result<AIResponse, String> {
        self.provider.complete(messages, system).await
    }

    /// Send a prompt and parse the response as JSON
    pub async fn prompt_json<T: for<'de> Deserialize<'de>>(&self, prompt: &str) -> Result<T, String> {
        let system = "You are a helpful assistant. Respond ONLY with valid JSON. Do not include any text before or after the JSON object. Do not use markdown code blocks.";
        let response = self.prompt_with_system(system, prompt).await?;
        self.parse_json(&response.content)
    }

    /// Send a prompt with system message and parse the response as JSON
    pub async fn prompt_json_with_system<T: for<'de> Deserialize<'de>>(
        &self,
        system: &str,
        prompt: &str,
    ) -> Result<T, String> {
        let full_system = format!(
            "{}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON object. Do not use markdown code blocks.",
            system
        );
        let response = self.prompt_with_system(&full_system, prompt).await?;
        self.parse_json(&response.content)
    }

    /// Parse JSON from the AI response, handling markdown code blocks
    fn parse_json<T: for<'de> Deserialize<'de>>(&self, content: &str) -> Result<T, String> {
        // Use robust JSON extraction to handle markdown code blocks
        let json_str = super::json_extract::extract_json(content)?;

        serde_json::from_str(json_str).map_err(|e| {
            format!(
                "Failed to parse extracted JSON: {}. Extracted: {}",
                e,
                &json_str[..json_str.len().min(500)]
            )
        })
    }

    /// Get the provider name
    pub fn provider_name(&self) -> &'static str {
        self.provider.name()
    }

    /// Check if the client is properly configured
    pub fn is_configured(&self) -> bool {
        self.provider.is_configured()
    }

    /// Get the current configuration
    pub fn config(&self) -> &AIConfig {
        &self.config
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_message_creation() {
        let user_msg = Message::user("Hello");
        assert_eq!(user_msg.role, Role::User);
        assert_eq!(user_msg.content, "Hello");

        let assistant_msg = Message::assistant("Hi there");
        assert_eq!(assistant_msg.role, Role::Assistant);
    }

    #[test]
    fn test_default_config() {
        let config = AIConfig::default();
        assert_eq!(config.provider, ProviderType::Anthropic);
        assert_eq!(config.max_tokens, 4096);
        assert_eq!(config.temperature, 0.0);
    }
}

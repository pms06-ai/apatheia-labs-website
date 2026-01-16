//! Cloud storage integration module.
//!
//! Provides OAuth authentication and API clients for cloud storage providers
//! (Google Drive, OneDrive). All OAuth flows use PKCE for desktop security.

pub mod google_drive;
pub mod oauth;

pub use google_drive::GoogleDriveClient;
pub use oauth::{OAuthConfig, OAuthTokens, PKCEChallenge};

use serde::{Deserialize, Serialize};

/// Cloud storage provider types
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CloudProvider {
    GoogleDrive,
    OneDrive,
}

/// Connection status for a cloud provider
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CloudConnectionStatus {
    pub connected: bool,
    pub provider: CloudProvider,
    pub email: Option<String>,
    pub expires_at: Option<String>,
}

/// A file or folder in cloud storage
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CloudFile {
    pub id: String,
    pub name: String,
    pub mime_type: String,
    pub size: Option<i64>,
    pub modified_time: Option<String>,
    pub is_folder: bool,
    pub icon_link: Option<String>,
}

/// Result of listing files from cloud storage
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CloudFileListResult {
    pub success: bool,
    pub files: Vec<CloudFile>,
    pub next_page_token: Option<String>,
    pub error: Option<String>,
}

/// Result of starting OAuth flow
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthFlowResult {
    pub auth_url: String,
    pub state_token: String,
}

/// Keyring key names for Google Drive tokens
pub mod keyring_keys {
    pub const GOOGLE_CLIENT_ID: &str = "google_drive_client_id";
    pub const GOOGLE_ACCESS_TOKEN: &str = "google_drive_access_token";
    pub const GOOGLE_REFRESH_TOKEN: &str = "google_drive_refresh_token";
    pub const GOOGLE_EXPIRES_AT: &str = "google_drive_expires_at";
    pub const GOOGLE_USER_EMAIL: &str = "google_drive_user_email";
}

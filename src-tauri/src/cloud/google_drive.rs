//! Google Drive API client.
//!
//! Provides methods for listing files and downloading from Google Drive
//! using the Drive API v3.

use super::{CloudFile, CloudFileListResult};
use crate::credentials;
use serde::Deserialize;
use std::path::PathBuf;

const DRIVE_API_BASE: &str = "https://www.googleapis.com/drive/v3";
const USERINFO_API: &str = "https://www.googleapis.com/oauth2/v2/userinfo";

/// Google Drive API client
pub struct GoogleDriveClient {
    client: reqwest::Client,
    access_token: String,
}

/// Google Drive file metadata from API
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DriveFileMetadata {
    id: String,
    name: String,
    mime_type: String,
    #[serde(default)]
    size: Option<String>,
    modified_time: Option<String>,
    icon_link: Option<String>,
}

/// Google Drive list response
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DriveListResponse {
    files: Vec<DriveFileMetadata>,
    next_page_token: Option<String>,
}

/// User info response from Google
#[derive(Debug, Deserialize)]
struct UserInfoResponse {
    email: String,
}

impl GoogleDriveClient {
    /// Create a new client with the given access token
    pub fn new(access_token: String) -> Self {
        Self {
            client: reqwest::Client::new(),
            access_token,
        }
    }

    /// Create a client from stored credentials (if available)
    pub fn from_stored_credentials() -> Result<Option<Self>, String> {
        match credentials::get_api_key(super::keyring_keys::GOOGLE_ACCESS_TOKEN)? {
            Some(token) => Ok(Some(Self::new(token))),
            None => Ok(None),
        }
    }

    /// Get user info (email) to display connection status
    pub async fn get_user_info(&self) -> Result<String, String> {
        let response = self
            .client
            .get(USERINFO_API)
            .bearer_auth(&self.access_token)
            .send()
            .await
            .map_err(|e| format!("Failed to fetch user info: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(format!("User info request failed ({}): {}", status, text));
        }

        let info: UserInfoResponse = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse user info: {}", e))?;

        Ok(info.email)
    }

    /// List files in a folder (or root if folder_id is None)
    pub async fn list_files(
        &self,
        folder_id: Option<&str>,
        page_token: Option<&str>,
    ) -> Result<CloudFileListResult, String> {
        // Build query: files in folder, not trashed
        let parent = folder_id.unwrap_or("root");
        let query = format!("'{}' in parents and trashed = false", parent);

        let mut request = self
            .client
            .get(format!("{}/files", DRIVE_API_BASE))
            .bearer_auth(&self.access_token)
            .query(&[
                ("q", query.as_str()),
                ("fields", "nextPageToken,files(id,name,mimeType,size,modifiedTime,iconLink)"),
                ("pageSize", "100"),
                ("orderBy", "folder,name"),
            ]);

        if let Some(token) = page_token {
            request = request.query(&[("pageToken", token)]);
        }

        let response = request
            .send()
            .await
            .map_err(|e| format!("Failed to list files: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Ok(CloudFileListResult {
                success: false,
                files: vec![],
                next_page_token: None,
                error: Some(format!("Drive API error ({}): {}", status, text)),
            });
        }

        let drive_response: DriveListResponse = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse Drive response: {}", e))?;

        let files = drive_response
            .files
            .into_iter()
            .map(|f| CloudFile {
                id: f.id,
                name: f.name,
                mime_type: f.mime_type.clone(),
                size: f.size.and_then(|s| s.parse().ok()),
                modified_time: f.modified_time,
                is_folder: f.mime_type == "application/vnd.google-apps.folder",
                icon_link: f.icon_link,
            })
            .collect();

        Ok(CloudFileListResult {
            success: true,
            files,
            next_page_token: drive_response.next_page_token,
            error: None,
        })
    }

    /// Download a file to a temporary location.
    /// Returns the path to the downloaded file.
    pub async fn download_file(
        &self,
        file_id: &str,
        filename: &str,
    ) -> Result<PathBuf, String> {
        // Get file metadata first to check if it's a Google Docs type
        let metadata = self.get_file_metadata(file_id).await?;

        let download_url = if metadata.mime_type.starts_with("application/vnd.google-apps.") {
            // Google Docs format - need to export
            let export_mime = match metadata.mime_type.as_str() {
                "application/vnd.google-apps.document" => "application/pdf",
                "application/vnd.google-apps.spreadsheet" => "application/pdf",
                "application/vnd.google-apps.presentation" => "application/pdf",
                _ => return Err(format!("Cannot download Google {} files", metadata.mime_type)),
            };
            format!(
                "{}/files/{}/export?mimeType={}",
                DRIVE_API_BASE, file_id, export_mime
            )
        } else {
            // Regular file - direct download
            format!("{}/files/{}?alt=media", DRIVE_API_BASE, file_id)
        };

        let response = self
            .client
            .get(&download_url)
            .bearer_auth(&self.access_token)
            .send()
            .await
            .map_err(|e| format!("Failed to download file: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(format!("Download failed ({}): {}", status, text));
        }

        let bytes = response
            .bytes()
            .await
            .map_err(|e| format!("Failed to read download: {}", e))?;

        // Create temp file with appropriate extension
        let temp_dir = std::env::temp_dir().join("phronesis_drive_import");
        std::fs::create_dir_all(&temp_dir)
            .map_err(|e| format!("Failed to create temp dir: {}", e))?;

        // Use original filename, adjusting extension for exports
        let final_filename = if metadata.mime_type.starts_with("application/vnd.google-apps.") {
            // Add .pdf extension for exported Google Docs
            let base = std::path::Path::new(filename)
                .file_stem()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_else(|| "document".to_string());
            format!("{}.pdf", base)
        } else {
            filename.to_string()
        };

        let file_path = temp_dir.join(&final_filename);
        std::fs::write(&file_path, &bytes)
            .map_err(|e| format!("Failed to write temp file: {}", e))?;

        Ok(file_path)
    }

    /// Get metadata for a single file
    async fn get_file_metadata(&self, file_id: &str) -> Result<DriveFileMetadata, String> {
        let response = self
            .client
            .get(format!("{}/files/{}", DRIVE_API_BASE, file_id))
            .bearer_auth(&self.access_token)
            .query(&[("fields", "id,name,mimeType,size,modifiedTime")])
            .send()
            .await
            .map_err(|e| format!("Failed to get file metadata: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let text = response.text().await.unwrap_or_default();
            return Err(format!("Metadata request failed ({}): {}", status, text));
        }

        response
            .json()
            .await
            .map_err(|e| format!("Failed to parse metadata: {}", e))
    }
}

/// Check if we have stored Google Drive credentials
pub fn has_stored_credentials() -> Result<bool, String> {
    Ok(credentials::get_api_key(super::keyring_keys::GOOGLE_ACCESS_TOKEN)?.is_some())
}

/// Store Google Drive tokens in keyring
pub fn store_tokens(
    access_token: &str,
    refresh_token: Option<&str>,
    expires_at: Option<&str>,
    user_email: Option<&str>,
) -> Result<(), String> {
    credentials::store_api_key(super::keyring_keys::GOOGLE_ACCESS_TOKEN, access_token)?;

    if let Some(refresh) = refresh_token {
        credentials::store_api_key(super::keyring_keys::GOOGLE_REFRESH_TOKEN, refresh)?;
    }

    if let Some(expires) = expires_at {
        credentials::store_api_key(super::keyring_keys::GOOGLE_EXPIRES_AT, expires)?;
    }

    if let Some(email) = user_email {
        credentials::store_api_key(super::keyring_keys::GOOGLE_USER_EMAIL, email)?;
    }

    Ok(())
}

/// Get stored refresh token
pub fn get_refresh_token() -> Result<Option<String>, String> {
    credentials::get_api_key(super::keyring_keys::GOOGLE_REFRESH_TOKEN)
}

/// Get stored user email
pub fn get_stored_email() -> Result<Option<String>, String> {
    credentials::get_api_key(super::keyring_keys::GOOGLE_USER_EMAIL)
}

/// Get stored expiration time
pub fn get_stored_expires_at() -> Result<Option<String>, String> {
    credentials::get_api_key(super::keyring_keys::GOOGLE_EXPIRES_AT)
}

/// Get stored client ID
pub fn get_client_id() -> Result<Option<String>, String> {
    credentials::get_api_key(super::keyring_keys::GOOGLE_CLIENT_ID)
}

/// Store client ID
pub fn store_client_id(client_id: &str) -> Result<(), String> {
    credentials::store_api_key(super::keyring_keys::GOOGLE_CLIENT_ID, client_id)
}

/// Clear all Google Drive credentials
pub fn clear_credentials() -> Result<(), String> {
    credentials::delete_api_key(super::keyring_keys::GOOGLE_ACCESS_TOKEN)?;
    credentials::delete_api_key(super::keyring_keys::GOOGLE_REFRESH_TOKEN)?;
    credentials::delete_api_key(super::keyring_keys::GOOGLE_EXPIRES_AT)?;
    credentials::delete_api_key(super::keyring_keys::GOOGLE_USER_EMAIL)?;
    // Note: Don't delete client_id - user configured it
    Ok(())
}

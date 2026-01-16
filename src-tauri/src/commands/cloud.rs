//! Cloud storage commands for Tauri IPC.
//!
//! Handles Google Drive authentication and file operations.

use crate::cloud::{google_drive, oauth, AuthFlowResult, CloudFileListResult};
use crate::commands::documents::DocumentResult;
use crate::AppState;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::sync::Arc;
use tauri::{AppHandle, State};
use tokio::sync::Mutex;

/// Pending OAuth flow state stored in memory
pub struct PendingOAuthFlow {
    pub state_token: String,
    pub pkce_verifier: String,
    pub callback_port: u16,
    pub config: oauth::OAuthConfig,
    pub result_rx: Option<tokio::sync::oneshot::Receiver<String>>,
}

// Store pending auth flow globally (one at a time)
lazy_static::lazy_static! {
    static ref PENDING_AUTH: Arc<Mutex<Option<PendingOAuthFlow>>> = Arc::new(Mutex::new(None));
}

/// Result from Google connection check
#[derive(Debug, Serialize, Deserialize)]
pub struct GoogleConnectionStatus {
    pub connected: bool,
    pub email: Option<String>,
    pub expires_at: Option<String>,
    pub has_client_id: bool,
}

/// Start Google OAuth flow - returns auth URL to open in browser
#[tauri::command]
pub async fn start_google_auth(_app_handle: AppHandle) -> Result<AuthFlowResult, String> {
    // Get client ID from stored credentials
    let client_id = google_drive::get_client_id()?
        .ok_or_else(|| "Google Drive client ID not configured. Please add it in Settings.".to_string())?;

    // Generate PKCE challenge
    let pkce = oauth::PKCEChallenge::generate();
    let state_token = oauth::generate_state_token();

    // Start callback server
    let (port, result_rx) = oauth::start_callback_server(state_token.clone())?;

    // Build OAuth config with dynamic redirect URI
    let mut config = oauth::OAuthConfig::google_drive(client_id);
    config.redirect_uri = format!("http://127.0.0.1:{}/callback", port);

    // Build auth URL
    let auth_url = oauth::build_auth_url(&config, &pkce, &state_token);

    // Store pending flow
    {
        let mut pending = PENDING_AUTH.lock().await;
        *pending = Some(PendingOAuthFlow {
            state_token: state_token.clone(),
            pkce_verifier: pkce.verifier.clone(),
            callback_port: port,
            config,
            result_rx: Some(result_rx),
        });
    }

    Ok(AuthFlowResult {
        auth_url,
        state_token,
    })
}

/// Check if OAuth callback has been received and complete the flow
#[tauri::command]
pub async fn check_google_auth_callback() -> Result<bool, String> {
    let mut pending = PENDING_AUTH.lock().await;

    let flow = match pending.as_mut() {
        Some(f) => f,
        None => return Ok(false),
    };

    // Check if we've received the callback (non-blocking)
    let result_rx = match flow.result_rx.take() {
        Some(rx) => rx,
        None => return Ok(false),
    };

    // Try to receive with a short timeout
    match tokio::time::timeout(std::time::Duration::from_millis(100), result_rx).await {
        Ok(Ok(auth_code)) => {
            // Exchange code for tokens
            let tokens = oauth::exchange_code(&flow.config, &auth_code, &flow.pkce_verifier).await?;

            // Create client and get user info
            let client = google_drive::GoogleDriveClient::new(tokens.access_token.clone());
            let email = client.get_user_info().await.ok();

            // Calculate expiration time
            let expires_at = tokens.expires_in.map(|secs| {
                chrono::Utc::now()
                    .checked_add_signed(chrono::Duration::seconds(secs))
                    .map(|dt| dt.to_rfc3339())
                    .unwrap_or_default()
            });

            // Store tokens
            google_drive::store_tokens(
                &tokens.access_token,
                tokens.refresh_token.as_deref(),
                expires_at.as_deref(),
                email.as_deref(),
            )?;

            // Clear pending flow
            *pending = None;

            Ok(true)
        }
        Ok(Err(_)) => {
            // Channel closed without value - auth failed
            *pending = None;
            Err("Authentication failed - no code received".to_string())
        }
        Err(_) => {
            // Timeout - still waiting, put receiver back
            flow.result_rx = None; // Already taken, can't put back
            Ok(false)
        }
    }
}

/// Check Google Drive connection status
#[tauri::command]
pub async fn check_google_connection() -> Result<GoogleConnectionStatus, String> {
    let has_client_id = google_drive::get_client_id()?.is_some();

    // Check if we have stored credentials
    if !google_drive::has_stored_credentials()? {
        return Ok(GoogleConnectionStatus {
            connected: false,
            email: None,
            expires_at: None,
            has_client_id,
        });
    }

    // Get stored email and expiration
    let email = google_drive::get_stored_email()?;
    let expires_at = google_drive::get_stored_expires_at()?;

    // Check if token is expired
    let is_expired = expires_at.as_ref().map_or(false, |exp| {
        chrono::DateTime::parse_from_rfc3339(exp)
            .map(|dt| dt < chrono::Utc::now())
            .unwrap_or(true)
    });

    if is_expired {
        // Try to refresh token
        if let Some(refresh_token) = google_drive::get_refresh_token()? {
            if let Some(client_id) = google_drive::get_client_id()? {
                let config = oauth::OAuthConfig::google_drive(client_id);
                match oauth::refresh_access_token(&config, &refresh_token).await {
                    Ok(new_tokens) => {
                        let new_expires_at = new_tokens.expires_in.map(|secs| {
                            chrono::Utc::now()
                                .checked_add_signed(chrono::Duration::seconds(secs))
                                .map(|dt| dt.to_rfc3339())
                                .unwrap_or_default()
                        });

                        google_drive::store_tokens(
                            &new_tokens.access_token,
                            new_tokens.refresh_token.as_deref(),
                            new_expires_at.as_deref(),
                            None, // Keep existing email
                        )?;

                        return Ok(GoogleConnectionStatus {
                            connected: true,
                            email,
                            expires_at: new_expires_at,
                            has_client_id,
                        });
                    }
                    Err(_) => {
                        // Refresh failed - clear credentials
                        google_drive::clear_credentials()?;
                        return Ok(GoogleConnectionStatus {
                            connected: false,
                            email: None,
                            expires_at: None,
                            has_client_id,
                        });
                    }
                }
            }
        }
    }

    Ok(GoogleConnectionStatus {
        connected: true,
        email,
        expires_at,
        has_client_id,
    })
}

/// Disconnect Google Drive - clear stored credentials
#[tauri::command]
pub async fn disconnect_google() -> Result<(), String> {
    google_drive::clear_credentials()
}

/// Set Google Drive client ID
#[tauri::command]
pub async fn set_google_client_id(client_id: String) -> Result<(), String> {
    if client_id.is_empty() {
        return Err("Client ID cannot be empty".to_string());
    }
    google_drive::store_client_id(&client_id)
}

/// List files from Google Drive
#[tauri::command]
pub async fn list_drive_files(
    folder_id: Option<String>,
    page_token: Option<String>,
) -> Result<CloudFileListResult, String> {
    let client = google_drive::GoogleDriveClient::from_stored_credentials()?
        .ok_or_else(|| "Not connected to Google Drive".to_string())?;

    client
        .list_files(folder_id.as_deref(), page_token.as_deref())
        .await
}

/// Download a file from Google Drive and import it into the case
#[tauri::command]
pub async fn download_drive_file(
    app_handle: AppHandle,
    state: State<'_, AppState>,
    file_id: String,
    file_name: String,
    case_id: String,
    doc_type: Option<String>,
) -> Result<DocumentResult, String> {
    // Get Drive client
    let client = google_drive::GoogleDriveClient::from_stored_credentials()?
        .ok_or_else(|| "Not connected to Google Drive".to_string())?;

    // Download file to temp location
    let temp_path = client.download_file(&file_id, &file_name).await?;
    let temp_path_str = temp_path.to_string_lossy().to_string();

    // Add to allowed uploads
    {
        let mut allowed: tokio::sync::MutexGuard<'_, HashSet<String>> = state.allowed_uploads.lock().await;
        allowed.insert(temp_path_str.clone());
    }

    // Use existing upload_from_path logic
    crate::commands::documents::upload_from_path(app_handle, state, case_id, temp_path_str, doc_type)
        .await
}

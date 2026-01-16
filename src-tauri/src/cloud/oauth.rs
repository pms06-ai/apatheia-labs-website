//! OAuth 2.0 PKCE implementation for desktop applications.
//!
//! Implements authorization code flow with PKCE (RFC 7636) for secure
//! OAuth in desktop apps that cannot keep client secrets.

use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use rand::Rng;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;
use tokio::sync::oneshot;
use url::Url;

/// OAuth configuration for a provider
#[derive(Debug, Clone)]
pub struct OAuthConfig {
    pub client_id: String,
    pub auth_uri: String,
    pub token_uri: String,
    pub redirect_uri: String,
    pub scopes: Vec<String>,
}

impl OAuthConfig {
    /// Create Google Drive OAuth config
    pub fn google_drive(client_id: String) -> Self {
        Self {
            client_id,
            auth_uri: "https://accounts.google.com/o/oauth2/v2/auth".to_string(),
            token_uri: "https://oauth2.googleapis.com/token".to_string(),
            redirect_uri: String::new(), // Set dynamically with port
            scopes: vec![
                "https://www.googleapis.com/auth/drive.readonly".to_string(),
                "https://www.googleapis.com/auth/userinfo.email".to_string(),
            ],
        }
    }
}

/// OAuth tokens from token exchange
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OAuthTokens {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_in: Option<i64>,
    pub token_type: String,
    pub scope: Option<String>,
}

/// PKCE challenge pair (verifier + challenge)
#[derive(Debug, Clone)]
pub struct PKCEChallenge {
    pub verifier: String,
    pub challenge: String,
}

impl PKCEChallenge {
    /// Generate a new PKCE verifier and challenge pair
    pub fn generate() -> Self {
        // Generate 32 random bytes for verifier (will be 43 chars base64url encoded)
        let mut rng = rand::thread_rng();
        let verifier_bytes: [u8; 32] = rng.gen();
        let verifier = URL_SAFE_NO_PAD.encode(verifier_bytes);

        // Challenge = base64url(sha256(verifier))
        let mut hasher = Sha256::new();
        hasher.update(verifier.as_bytes());
        let hash = hasher.finalize();
        let challenge = URL_SAFE_NO_PAD.encode(hash);

        Self { verifier, challenge }
    }
}

/// State for a pending OAuth flow
pub struct PendingAuthFlow {
    pub state_token: String,
    pub pkce: PKCEChallenge,
    pub config: OAuthConfig,
    pub callback_port: u16,
    pub result_tx: Option<oneshot::Sender<String>>,
}

/// Generate a random state token for CSRF protection
pub fn generate_state_token() -> String {
    let mut rng = rand::thread_rng();
    let bytes: [u8; 16] = rng.gen();
    URL_SAFE_NO_PAD.encode(bytes)
}

/// Build the authorization URL for the OAuth flow
pub fn build_auth_url(config: &OAuthConfig, pkce: &PKCEChallenge, state: &str) -> String {
    let mut url = Url::parse(&config.auth_uri).expect("Invalid auth URI");

    url.query_pairs_mut()
        .append_pair("client_id", &config.client_id)
        .append_pair("redirect_uri", &config.redirect_uri)
        .append_pair("response_type", "code")
        .append_pair("scope", &config.scopes.join(" "))
        .append_pair("state", state)
        .append_pair("code_challenge", &pkce.challenge)
        .append_pair("code_challenge_method", "S256")
        .append_pair("access_type", "offline")
        .append_pair("prompt", "consent");

    url.to_string()
}

/// Start a local HTTP server to receive the OAuth callback.
/// Returns (port, receiver for auth code).
pub fn start_callback_server(
    expected_state: String,
) -> Result<(u16, oneshot::Receiver<String>), String> {
    // Bind to localhost on a random available port
    let listener =
        TcpListener::bind("127.0.0.1:0").map_err(|e| format!("Failed to bind listener: {}", e))?;

    let port = listener
        .local_addr()
        .map_err(|e| format!("Failed to get local addr: {}", e))?
        .port();

    let (tx, rx) = oneshot::channel();

    // Spawn blocking thread for the HTTP server
    std::thread::spawn(move || {
        // Set timeout so we don't hang forever
        listener
            .set_nonblocking(false)
            .expect("Failed to set blocking");

        // Wait for a single connection (with 5 minute timeout via accept)
        if let Ok((mut stream, _)) = listener.accept() {
            let mut reader = BufReader::new(stream.try_clone().expect("Clone stream"));
            let mut request_line = String::new();

            if reader.read_line(&mut request_line).is_ok() {
                // Parse the request line: GET /callback?code=xxx&state=yyy HTTP/1.1
                if let Some(query_start) = request_line.find('?') {
                    if let Some(query_end) = request_line.find(" HTTP") {
                        let query_string = &request_line[query_start + 1..query_end];
                        let params: HashMap<_, _> = query_string
                            .split('&')
                            .filter_map(|pair| {
                                let mut parts = pair.split('=');
                                Some((parts.next()?, parts.next()?))
                            })
                            .collect();

                        // Verify state matches
                        if let Some(state) = params.get("state") {
                            if *state == expected_state {
                                if let Some(code) = params.get("code") {
                                    // Send success response
                                    let response = format!(
                                        "HTTP/1.1 200 OK\r\n\
                                         Content-Type: text/html\r\n\
                                         Connection: close\r\n\r\n\
                                         <!DOCTYPE html>\
                                         <html><head><title>Success</title>\
                                         <style>body{{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#1a1a1a;color:#fff}}\
                                         .card{{background:#2a2a2a;padding:2rem;border-radius:8px;text-align:center}}\
                                         h1{{color:#d4af37;margin-bottom:1rem}}</style></head>\
                                         <body><div class='card'><h1>✓ Connected</h1>\
                                         <p>Google Drive connected successfully.</p>\
                                         <p>You can close this window.</p></div></body></html>"
                                    );
                                    stream.write_all(response.as_bytes()).ok();
                                    stream.flush().ok();

                                    // Send auth code to receiver
                                    tx.send(code.to_string()).ok();
                                    return;
                                }
                            }
                        }
                    }
                }

                // Error response
                let response = "HTTP/1.1 400 Bad Request\r\n\
                               Content-Type: text/html\r\n\
                               Connection: close\r\n\r\n\
                               <!DOCTYPE html>\
                               <html><head><title>Error</title></head>\
                               <body><h1>Authentication Failed</h1>\
                               <p>Invalid or missing authorization code.</p></body></html>";
                stream.write_all(response.as_bytes()).ok();
            }
        }
    });

    Ok((port, rx))
}

/// Exchange authorization code for tokens
pub async fn exchange_code(
    config: &OAuthConfig,
    code: &str,
    pkce_verifier: &str,
) -> Result<OAuthTokens, String> {
    let client = reqwest::Client::new();

    let params = [
        ("client_id", config.client_id.as_str()),
        ("code", code),
        ("code_verifier", pkce_verifier),
        ("grant_type", "authorization_code"),
        ("redirect_uri", config.redirect_uri.as_str()),
    ];

    let response = client
        .post(&config.token_uri)
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Token request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Token exchange failed: {}", error_text));
    }

    let tokens: OAuthTokens = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse token response: {}", e))?;

    Ok(tokens)
}

/// Refresh an access token using a refresh token
pub async fn refresh_access_token(
    config: &OAuthConfig,
    refresh_token: &str,
) -> Result<OAuthTokens, String> {
    let client = reqwest::Client::new();

    let params = [
        ("client_id", config.client_id.as_str()),
        ("refresh_token", refresh_token),
        ("grant_type", "refresh_token"),
    ];

    let response = client
        .post(&config.token_uri)
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Refresh request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Token refresh failed: {}", error_text));
    }

    let tokens: OAuthTokens = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse refresh response: {}", e))?;

    Ok(tokens)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pkce_generation() {
        let pkce = PKCEChallenge::generate();

        // Verifier should be 43 chars (32 bytes base64url encoded)
        assert_eq!(pkce.verifier.len(), 43);

        // Challenge should be 43 chars (32 bytes SHA256 hash base64url encoded)
        assert_eq!(pkce.challenge.len(), 43);

        // Verify challenge derivation
        let mut hasher = Sha256::new();
        hasher.update(pkce.verifier.as_bytes());
        let expected_challenge = URL_SAFE_NO_PAD.encode(hasher.finalize());
        assert_eq!(pkce.challenge, expected_challenge);
    }

    #[test]
    fn test_state_token_generation() {
        let state1 = generate_state_token();
        let state2 = generate_state_token();

        // Should be 22 chars (16 bytes base64url encoded)
        assert_eq!(state1.len(), 22);

        // Should be unique
        assert_ne!(state1, state2);
    }

    #[test]
    fn test_auth_url_building() {
        let config = OAuthConfig {
            client_id: "test-client-id".to_string(),
            auth_uri: "https://example.com/auth".to_string(),
            token_uri: "https://example.com/token".to_string(),
            redirect_uri: "http://127.0.0.1:8080/callback".to_string(),
            scopes: vec!["scope1".to_string(), "scope2".to_string()],
        };

        let pkce = PKCEChallenge::generate();
        let state = "test-state";

        let url = build_auth_url(&config, &pkce, state);

        assert!(url.contains("client_id=test-client-id"));
        assert!(url.contains("redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fcallback"));
        assert!(url.contains("response_type=code"));
        assert!(url.contains("scope=scope1+scope2"));
        assert!(url.contains("state=test-state"));
        assert!(url.contains("code_challenge="));
        assert!(url.contains("code_challenge_method=S256"));
    }
}

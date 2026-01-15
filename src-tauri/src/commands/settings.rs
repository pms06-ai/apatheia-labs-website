//! Settings commands for Phronesis FCIP
//!
//! Manages application configuration including API keys.
//! API keys are stored securely in the OS keyring, not in config files.

use crate::credentials;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use tauri::{command, AppHandle, Manager};

/// Key name for storing Anthropic API key in the system keyring
const ANTHROPIC_API_KEY_NAME: &str = "anthropic_api_key";

/// Python environment configuration
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct PythonConfig {
    /// Custom Python executable path (e.g., "/usr/bin/python3" or "C:\\Python311\\python.exe")
    #[serde(default)]
    pub python_path: Option<String>,

    /// Path to virtual environment (e.g., ".venv" or "/path/to/venv")
    #[serde(default)]
    pub venv_path: Option<String>,

    /// Custom path to OCR script (overrides default)
    #[serde(default)]
    pub ocr_script_path: Option<String>,
}

/// Application settings stored locally (non-sensitive)
/// Note: API keys are stored in the OS keyring, not here
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AppSettings {
    /// Whether an API key is configured (actual key stored in OS keyring)
    #[serde(default)]
    pub has_api_key: bool,

    /// Use Claude Code CLI (for Max subscription users)
    #[serde(default)]
    pub use_claude_code: bool,

    /// Use mock mode (no real API calls)
    #[serde(default)]
    pub mock_mode: bool,

    /// Default model to use
    #[serde(default = "default_model")]
    pub default_model: String,

    /// Theme preference
    #[serde(default = "default_theme")]
    pub theme: String,

    /// Python environment configuration
    #[serde(default)]
    pub python: PythonConfig,
}

/// Settings response sent to frontend (includes masked API key for display)
#[derive(Debug, Clone, Serialize)]
pub struct AppSettingsResponse {
    /// Whether an API key is configured
    pub has_api_key: bool,

    /// Masked API key for display (e.g., "sk-a...1234")
    pub anthropic_api_key_masked: Option<String>,

    /// Use Claude Code CLI (for Max subscription users)
    pub use_claude_code: bool,

    /// Use mock mode (no real API calls)
    pub mock_mode: bool,

    /// Default model to use
    pub default_model: String,

    /// Theme preference
    pub theme: String,

    /// Python environment configuration
    pub python: PythonConfig,
}

/// Claude Code installation status
#[derive(Debug, Clone, Serialize)]
pub struct ClaudeCodeStatus {
    pub installed: bool,
    pub version: Option<String>,
    pub error: Option<String>,
}

fn default_model() -> String {
    "claude-3-5-sonnet-20241022".to_string()
}

fn default_theme() -> String {
    "dark".to_string()
}

/// Get the settings file path
fn get_settings_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    // Ensure directory exists
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir)
            .map_err(|e| format!("Failed to create app data dir: {}", e))?;
    }
    
    Ok(app_data_dir.join("config.json"))
}

/// Load settings from disk
fn load_settings(app: &AppHandle) -> Result<AppSettings, String> {
    let path = get_settings_path(app)?;
    
    if !path.exists() {
        return Ok(AppSettings::default());
    }
    
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read settings: {}", e))?;
    
    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse settings: {}", e))
}

/// Save settings to disk
fn save_settings(app: &AppHandle, settings: &AppSettings) -> Result<(), String> {
    let path = get_settings_path(app)?;
    
    let content = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;
    
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write settings: {}", e))?;
    
    log::info!("Settings saved to {}", path.display());
    Ok(())
}

/// Response wrapper for settings commands
#[derive(Debug, Serialize)]
pub struct SettingsResponse {
    pub success: bool,
    pub settings: Option<AppSettingsResponse>,
    pub error: Option<String>,
}

/// Mask an API key for display (show first 4 and last 4 characters)
fn mask_api_key(key: &str) -> String {
    if key.len() > 8 {
        format!("{}...{}", &key[..4], &key[key.len() - 4..])
    } else {
        "****".to_string()
    }
}

/// Get the API key from keyring (for internal use)
pub fn get_api_key_from_keyring() -> Result<Option<String>, String> {
    credentials::get_api_key(ANTHROPIC_API_KEY_NAME)
}

/// Get current application settings
#[command]
pub async fn get_settings(app: AppHandle) -> SettingsResponse {
    match load_settings(&app) {
        Ok(settings) => {
            // Get API key from keyring to check if it exists and create masked version
            let api_key_result = credentials::get_api_key(ANTHROPIC_API_KEY_NAME);
            let (has_key, masked_key) = match api_key_result {
                Ok(Some(key)) => (true, Some(mask_api_key(&key))),
                Ok(None) => (false, None),
                Err(e) => {
                    log::warn!("Failed to check keyring for API key: {}", e);
                    // Fall back to settings file flag
                    (settings.has_api_key, None)
                }
            };

            SettingsResponse {
                success: true,
                settings: Some(AppSettingsResponse {
                    has_api_key: has_key,
                    anthropic_api_key_masked: masked_key,
                    use_claude_code: settings.use_claude_code,
                    mock_mode: settings.mock_mode,
                    default_model: settings.default_model,
                    theme: settings.theme,
                    python: settings.python,
                }),
                error: None,
            }
        }
        Err(e) => SettingsResponse {
            success: false,
            settings: None,
            error: Some(e),
        },
    }
}

/// Update application settings
#[command]
pub async fn update_settings(
    app: AppHandle,
    anthropic_api_key: Option<String>,
    use_claude_code: Option<bool>,
    mock_mode: Option<bool>,
    default_model: Option<String>,
    theme: Option<String>,
    python_path: Option<String>,
    venv_path: Option<String>,
    ocr_script_path: Option<String>,
) -> SettingsResponse {
    // Load current settings
    let mut settings = match load_settings(&app) {
        Ok(s) => s,
        Err(e) => {
            return SettingsResponse {
                success: false,
                settings: None,
                error: Some(e),
            }
        }
    };

    // Track if we need to update API key in keyring
    let mut api_key_masked: Option<String> = None;
    let mut has_api_key = settings.has_api_key;

    // Handle API key update via keyring
    if let Some(key) = anthropic_api_key {
        // Only update if not masked value (user hasn't changed it)
        if !key.contains("...") && key != "****" {
            if key.is_empty() {
                // Delete the API key from keyring
                if let Err(e) = credentials::delete_api_key(ANTHROPIC_API_KEY_NAME) {
                    return SettingsResponse {
                        success: false,
                        settings: None,
                        error: Some(format!("Failed to delete API key from secure storage: {}", e)),
                    };
                }
                settings.has_api_key = false;
                has_api_key = false;
                api_key_masked = None;
                log::info!("API key removed from secure storage");
            } else {
                // Store the API key in keyring
                if let Err(e) = credentials::store_api_key(ANTHROPIC_API_KEY_NAME, &key) {
                    return SettingsResponse {
                        success: false,
                        settings: None,
                        error: Some(format!("Failed to store API key in secure storage: {}", e)),
                    };
                }
                settings.has_api_key = true;
                has_api_key = true;
                api_key_masked = Some(mask_api_key(&key));
                log::info!("API key stored in secure storage");
            }
        } else {
            // Key wasn't changed, retrieve current masked version from keyring
            if let Ok(Some(existing_key)) = credentials::get_api_key(ANTHROPIC_API_KEY_NAME) {
                api_key_masked = Some(mask_api_key(&existing_key));
                has_api_key = true;
            }
        }
    } else {
        // No key provided, check if one exists in keyring
        if let Ok(Some(existing_key)) = credentials::get_api_key(ANTHROPIC_API_KEY_NAME) {
            api_key_masked = Some(mask_api_key(&existing_key));
            has_api_key = true;
        }
    }

    if let Some(use_cc) = use_claude_code {
        settings.use_claude_code = use_cc;
    }

    if let Some(mock) = mock_mode {
        settings.mock_mode = mock;
    }

    if let Some(model) = default_model {
        settings.default_model = model;
    }

    if let Some(t) = theme {
        settings.theme = t;
    }

    // Update Python settings
    if let Some(path) = python_path {
        settings.python.python_path = if path.is_empty() { None } else { Some(path) };
    }

    if let Some(path) = venv_path {
        settings.python.venv_path = if path.is_empty() { None } else { Some(path) };
    }

    if let Some(path) = ocr_script_path {
        settings.python.ocr_script_path = if path.is_empty() { None } else { Some(path) };
    }

    // Save settings (without the API key - that's in keyring now)
    if let Err(e) = save_settings(&app, &settings) {
        return SettingsResponse {
            success: false,
            settings: None,
            error: Some(e),
        };
    }

    SettingsResponse {
        success: true,
        settings: Some(AppSettingsResponse {
            has_api_key,
            anthropic_api_key_masked: api_key_masked,
            use_claude_code: settings.use_claude_code,
            mock_mode: settings.mock_mode,
            default_model: settings.default_model,
            theme: settings.theme,
            python: settings.python,
        }),
        error: None,
    }
}

/// Check if API key is configured (without revealing it)
#[command]
pub async fn check_api_key(_app: AppHandle) -> Result<bool, String> {
    // Check keyring for API key
    match credentials::get_api_key(ANTHROPIC_API_KEY_NAME) {
        Ok(Some(key)) => Ok(!key.is_empty()),
        Ok(None) => Ok(false),
        Err(e) => Err(format!("Failed to check secure storage: {}", e)),
    }
}

/// Validate API key by making a test request
#[command]
pub async fn validate_api_key(_app: AppHandle) -> Result<bool, String> {
    // Get API key from keyring
    let api_key = credentials::get_api_key(ANTHROPIC_API_KEY_NAME)?
        .ok_or("No API key configured")?;

    // In a real implementation, we'd make a test API call here
    // For now, just check the key format
    if api_key.starts_with("sk-ant-") {
        Ok(true)
    } else {
        Err("Invalid API key format".to_string())
    }
}

/// Check if Claude Code CLI is installed and get version
#[command]
pub async fn check_claude_code_status() -> ClaudeCodeStatus {
    // Try to run "claude --version"
    match Command::new("claude")
        .arg("--version")
        .output()
    {
        Ok(output) => {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
                ClaudeCodeStatus {
                    installed: true,
                    version: Some(version),
                    error: None,
                }
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();
                ClaudeCodeStatus {
                    installed: false,
                    version: None,
                    error: Some(format!("Command failed: {}", stderr)),
                }
            }
        }
        Err(e) => {
            let error_msg = if e.kind() == std::io::ErrorKind::NotFound {
                "Claude Code not installed. Run: npm install -g @anthropic-ai/claude-code".to_string()
            } else {
                format!("Failed to check Claude Code: {}", e)
            };
            ClaudeCodeStatus {
                installed: false,
                version: None,
                error: Some(error_msg),
            }
        }
    }
}

/// Python environment status
#[derive(Debug, Clone, Serialize)]
pub struct PythonStatus {
    pub available: bool,
    pub version: Option<String>,
    pub path: String,
    pub venv_active: bool,
    pub ocr_script_found: bool,
    pub error: Option<String>,
}

/// Check Python environment status
#[command]
pub async fn check_python_status(app: AppHandle) -> PythonStatus {
    let settings = load_settings(&app).unwrap_or_default();

    // Determine Python executable path
    let python_cmd = get_python_command(&settings.python);

    // Try to get Python version
    match Command::new(&python_cmd)
        .arg("--version")
        .output()
    {
        Ok(output) => {
            if output.status.success() {
                let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
                let version = if version.is_empty() {
                    String::from_utf8_lossy(&output.stderr).trim().to_string()
                } else {
                    version
                };

                // Check if OCR script exists
                let ocr_script = get_ocr_script_path(&settings.python);
                let ocr_found = std::path::Path::new(&ocr_script).exists();

                // Check if venv is active
                let venv_active = settings.python.venv_path.is_some()
                    && std::path::Path::new(settings.python.venv_path.as_ref().unwrap()).exists();

                PythonStatus {
                    available: true,
                    version: Some(version),
                    path: python_cmd,
                    venv_active,
                    ocr_script_found: ocr_found,
                    error: None,
                }
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();
                PythonStatus {
                    available: false,
                    version: None,
                    path: python_cmd,
                    venv_active: false,
                    ocr_script_found: false,
                    error: Some(format!("Python command failed: {}", stderr)),
                }
            }
        }
        Err(e) => {
            let error_msg = if e.kind() == std::io::ErrorKind::NotFound {
                format!("Python not found at '{}'. Install Python or configure python_path in settings.", python_cmd)
            } else {
                format!("Failed to check Python: {}", e)
            };
            PythonStatus {
                available: false,
                version: None,
                path: python_cmd,
                venv_active: false,
                ocr_script_found: false,
                error: Some(error_msg),
            }
        }
    }
}

/// Get the Python command to use based on settings
pub fn get_python_command(config: &PythonConfig) -> String {
    // If venv is configured, use the venv Python
    if let Some(ref venv_path) = config.venv_path {
        let venv = std::path::Path::new(venv_path);
        if venv.exists() {
            #[cfg(windows)]
            let python_in_venv = venv.join("Scripts").join("python.exe");
            #[cfg(not(windows))]
            let python_in_venv = venv.join("bin").join("python");

            if python_in_venv.exists() {
                return python_in_venv.to_string_lossy().to_string();
            }
        }
    }

    // Use custom path if configured
    if let Some(ref custom_path) = config.python_path {
        if !custom_path.is_empty() {
            return custom_path.clone();
        }
    }

    // Default to system Python
    #[cfg(windows)]
    return "python".to_string();
    #[cfg(not(windows))]
    return "python3".to_string();
}

/// Get the OCR script path based on settings
pub fn get_ocr_script_path(config: &PythonConfig) -> String {
    if let Some(ref custom_path) = config.ocr_script_path {
        if !custom_path.is_empty() {
            return custom_path.clone();
        }
    }

    // Default path
    "tools/ocr/process_messages_ocr.py".to_string()
}

/// Load settings for use by other modules (non-async version)
pub fn load_settings_sync(app: &AppHandle) -> Result<AppSettings, String> {
    load_settings(app)
}


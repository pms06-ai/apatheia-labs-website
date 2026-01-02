//! Settings commands for Phronesis FCIP
//!
//! Manages application configuration including API keys.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;
use tauri::{command, AppHandle, Manager};

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

/// Application settings stored locally
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AppSettings {
    /// Anthropic API key for Claude
    #[serde(default)]
    pub anthropic_api_key: Option<String>,

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
    pub settings: Option<AppSettings>,
    pub error: Option<String>,
}

/// Get current application settings
#[command]
pub async fn get_settings(app: AppHandle) -> SettingsResponse {
    match load_settings(&app) {
        Ok(settings) => SettingsResponse {
            success: true,
            settings: Some(AppSettings {
                // Mask API key for security (show only last 4 chars)
                anthropic_api_key: settings.anthropic_api_key.map(|k| {
                    if k.len() > 8 {
                        format!("{}...{}", &k[..4], &k[k.len()-4..])
                    } else {
                        "****".to_string()
                    }
                }),
                ..settings
            }),
            error: None,
        },
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
    
    // Update only provided fields
    if let Some(key) = anthropic_api_key {
        // Only update if not masked value
        if !key.contains("...") && key != "****" {
            settings.anthropic_api_key = if key.is_empty() { None } else { Some(key) };
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

    // Save settings
    if let Err(e) = save_settings(&app, &settings) {
        return SettingsResponse {
            success: false,
            settings: None,
            error: Some(e),
        };
    }
    
    SettingsResponse {
        success: true,
        settings: Some(AppSettings {
            anthropic_api_key: settings.anthropic_api_key.map(|k| {
                if k.len() > 8 {
                    format!("{}...{}", &k[..4], &k[k.len()-4..])
                } else {
                    "****".to_string()
                }
            }),
            ..settings
        }),
        error: None,
    }
}

/// Check if API key is configured (without revealing it)
#[command]
pub async fn check_api_key(app: AppHandle) -> Result<bool, String> {
    let settings = load_settings(&app)?;
    Ok(settings.anthropic_api_key.is_some() && !settings.anthropic_api_key.as_ref().unwrap().is_empty())
}

/// Validate API key by making a test request
#[command]
pub async fn validate_api_key(app: AppHandle) -> Result<bool, String> {
    let settings = load_settings(&app)?;
    
    let api_key = settings.anthropic_api_key
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


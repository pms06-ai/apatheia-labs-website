//! Phronesis FCIP - Tauri Backend Library
//! 
//! Local-first forensic case intelligence platform.

pub mod commands;
pub mod db;
pub mod orchestrator;
pub mod processing;
pub mod storage;

use tauri::Manager;

use db::Database;
use orchestrator::EngineOrchestrator;
use storage::Storage;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::{Mutex, RwLock};

/// Application state shared across commands
pub struct AppState {
    pub db: Arc<Mutex<Database>>,
    pub storage: Arc<Mutex<Storage>>,
}

impl AppState {
    pub async fn new(app_data_dir: PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let db_path = app_data_dir.join("phronesis.db");
        let storage_path = app_data_dir.join("storage");
        
        let db = Database::new(db_path).await?;
        let storage = Storage::new(storage_path);
        
        Ok(Self {
            db: Arc::new(Mutex::new(db)),
            storage: Arc::new(Mutex::new(storage)),
        })
    }
}

/// Initialize Tauri application with all plugins and commands
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Get app data directory
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");
            
            log::info!("App data directory: {}", app_data_dir.display());
            
            // Initialize orchestrator with app handle
            let orchestrator = EngineOrchestrator::new()
                .with_app_handle(app.handle().clone());
            app.manage(Arc::new(RwLock::new(orchestrator)));
            log::info!("Engine orchestrator initialized");
            
            // Initialize state asynchronously
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                match AppState::new(app_data_dir).await {
                    Ok(state) => {
                        app_handle.manage(state);
                        log::info!("Application state initialized successfully");
                    }
                    Err(e) => {
                        log::error!("Failed to initialize application state: {}", e);
                    }
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Case commands
            commands::get_cases,
            commands::get_case,
            commands::create_case,
            commands::delete_case,
            // Document commands
            commands::get_documents,
            commands::get_document,
            commands::upload_document,
            commands::update_document_status,
            commands::delete_document,
            commands::process_document,
            commands::pick_documents,
            commands::upload_from_path,
            // Analysis commands
            commands::get_findings,
            commands::get_analysis,
            commands::run_engine,
            commands::save_finding,
            // Orchestrator commands
            commands::submit_analysis,
            commands::get_job_progress,
            commands::cancel_job,
            commands::list_jobs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

//! Case management commands

use crate::db::schema::Case;
use crate::AppState;
use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCaseInput {
    pub reference: String,
    pub name: String,
    pub case_type: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CaseResult {
    pub success: bool,
    pub data: Option<Case>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CasesListResult {
    pub success: bool,
    pub data: Vec<Case>,
    pub error: Option<String>,
}

/// Get all cases
#[tauri::command]
pub async fn get_cases(state: State<'_, AppState>) -> Result<CasesListResult, String> {
    let db = state.db.lock().await;
    
    match sqlx::query_as::<_, Case>("SELECT * FROM cases ORDER BY created_at DESC")
        .fetch_all(db.pool())
        .await
    {
        Ok(cases) => Ok(CasesListResult {
            success: true,
            data: cases,
            error: None,
        }),
        Err(e) => Ok(CasesListResult {
            success: false,
            data: vec![],
            error: Some(e.to_string()),
        }),
    }
}

/// Get a single case by ID
#[tauri::command]
pub async fn get_case(state: State<'_, AppState>, case_id: String) -> Result<CaseResult, String> {
    let db = state.db.lock().await;
    
    match sqlx::query_as::<_, Case>("SELECT * FROM cases WHERE id = ?")
        .bind(&case_id)
        .fetch_optional(db.pool())
        .await
    {
        Ok(Some(case)) => Ok(CaseResult {
            success: true,
            data: Some(case),
            error: None,
        }),
        Ok(None) => Ok(CaseResult {
            success: false,
            data: None,
            error: Some("Case not found".to_string()),
        }),
        Err(e) => Ok(CaseResult {
            success: false,
            data: None,
            error: Some(e.to_string()),
        }),
    }
}

/// Create a new case
#[tauri::command]
pub async fn create_case(
    state: State<'_, AppState>,
    input: CreateCaseInput,
) -> Result<CaseResult, String> {
    let db = state.db.lock().await;
    let id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();
    
    match sqlx::query(
        "INSERT INTO cases (id, reference, name, case_type, status, description, metadata, created_at, updated_at) 
         VALUES (?, ?, ?, ?, 'active', ?, '{}', ?, ?)"
    )
    .bind(&id)
    .bind(&input.reference)
    .bind(&input.name)
    .bind(&input.case_type)
    .bind(&input.description)
    .bind(&now)
    .bind(&now)
    .execute(db.pool())
    .await
    {
        Ok(_) => {
            // Fetch the created case
            match sqlx::query_as::<_, Case>("SELECT * FROM cases WHERE id = ?")
                .bind(&id)
                .fetch_one(db.pool())
                .await
            {
                Ok(case) => Ok(CaseResult {
                    success: true,
                    data: Some(case),
                    error: None,
                }),
                Err(e) => Ok(CaseResult {
                    success: false,
                    data: None,
                    error: Some(e.to_string()),
                }),
            }
        }
        Err(e) => Ok(CaseResult {
            success: false,
            data: None,
            error: Some(e.to_string()),
        }),
    }
}

/// Delete a case
#[tauri::command]
pub async fn delete_case(state: State<'_, AppState>, case_id: String) -> Result<CaseResult, String> {
    let db = state.db.lock().await;
    
    match sqlx::query("DELETE FROM cases WHERE id = ?")
        .bind(&case_id)
        .execute(db.pool())
        .await
    {
        Ok(_) => Ok(CaseResult {
            success: true,
            data: None,
            error: None,
        }),
        Err(e) => Ok(CaseResult {
            success: false,
            data: None,
            error: Some(e.to_string()),
        }),
    }
}


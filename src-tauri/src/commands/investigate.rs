//! Unified Investigation Command
//!
//! Orchestrates all analysis engines and S.A.M. phases into a single
//! unified investigation flow. Produces findings across all 11 output categories.

use crate::db::schema::Finding;
use crate::sam::{SAMConfig, SAMExecutor};
use crate::AppState;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::State;
use tokio_util::sync::CancellationToken;
use uuid::Uuid;

/// Investigation mode determines which engines run
#[derive(Debug, Clone, Copy, Serialize, Deserialize, Default)]
#[serde(rename_all = "snake_case")]
pub enum InvestigationMode {
    /// Quick scan - core findings only (contradiction, omission, temporal)
    Quick,
    /// Full investigation - S.A.M. + all engines
    #[default]
    Full,
    /// Custom - user picks specific engines
    Custom,
}

/// Engine selection for custom mode
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct EngineSelection {
    /// Run S.A.M. analysis (false premise tracking)
    #[serde(default)]
    pub sam: bool,
    /// Run contradiction detection
    #[serde(default)]
    pub contradiction: bool,
    /// Run omission detection
    #[serde(default)]
    pub omission: bool,
    /// Run temporal analysis
    #[serde(default)]
    pub temporal: bool,
    /// Run entity resolution
    #[serde(default)]
    pub entity: bool,
    /// Run bias detection
    #[serde(default)]
    pub bias: bool,
    /// Run professional tracker
    #[serde(default)]
    pub professional: bool,
    /// Run expert witness analysis
    #[serde(default)]
    pub expert: bool,
    /// Run accountability audit
    #[serde(default)]
    pub accountability: bool,
    /// Run narrative evolution
    #[serde(default)]
    pub narrative: bool,
    /// Run documentary analysis
    #[serde(default)]
    pub documentary: bool,
}

impl EngineSelection {
    /// Returns engines for quick mode
    pub fn quick() -> Self {
        Self {
            sam: false,
            contradiction: true,
            omission: true,
            temporal: true,
            entity: true,
            bias: false,
            professional: false,
            expert: false,
            accountability: false,
            narrative: false,
            documentary: false,
        }
    }

    /// Returns engines for full mode
    pub fn full() -> Self {
        Self {
            sam: true,
            contradiction: true,
            omission: true,
            temporal: true,
            entity: true,
            bias: true,
            professional: true,
            expert: true,
            accountability: true,
            narrative: true,
            documentary: true,
        }
    }

    /// Count how many engines are selected
    pub fn count(&self) -> usize {
        let mut count = 0;
        if self.sam { count += 1; }
        if self.contradiction { count += 1; }
        if self.omission { count += 1; }
        if self.temporal { count += 1; }
        if self.entity { count += 1; }
        if self.bias { count += 1; }
        if self.professional { count += 1; }
        if self.expert { count += 1; }
        if self.accountability { count += 1; }
        if self.narrative { count += 1; }
        if self.documentary { count += 1; }
        count
    }

    /// Get list of selected engine names
    pub fn selected_names(&self) -> Vec<&'static str> {
        let mut names = Vec::new();
        if self.sam { names.push("S.A.M."); }
        if self.contradiction { names.push("Contradiction"); }
        if self.omission { names.push("Omission"); }
        if self.temporal { names.push("Temporal"); }
        if self.entity { names.push("Entity"); }
        if self.bias { names.push("Bias"); }
        if self.professional { names.push("Professional"); }
        if self.expert { names.push("Expert"); }
        if self.accountability { names.push("Accountability"); }
        if self.narrative { names.push("Narrative"); }
        if self.documentary { names.push("Documentary"); }
        names
    }
}

/// Input for starting an investigation
#[derive(Debug, Serialize, Deserialize)]
pub struct InvestigateInput {
    pub case_id: String,
    pub document_ids: Vec<String>,
    #[serde(default)]
    pub mode: InvestigationMode,
    /// Custom engine selection (only used when mode is Custom)
    #[serde(default)]
    pub engines: Option<EngineSelection>,
    /// Focus claims for S.A.M. analysis
    #[serde(default)]
    pub focus_claims: Option<Vec<String>>,
}

/// Status of the investigation
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum InvestigationStatus {
    Pending,
    Running,
    Completed,
    Failed,
    Cancelled,
}

/// Progress update for a single engine
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EngineProgress {
    pub engine: String,
    pub status: InvestigationStatus,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
    pub findings_count: usize,
    pub error: Option<String>,
}

/// Overall investigation progress
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InvestigationProgress {
    pub investigation_id: String,
    pub case_id: String,
    pub status: InvestigationStatus,
    pub mode: InvestigationMode,
    pub total_engines: usize,
    pub completed_engines: usize,
    pub current_engine: Option<String>,
    pub engines: Vec<EngineProgress>,
    pub sam_analysis_id: Option<String>,
    pub started_at: String,
    pub updated_at: String,
    pub error: Option<String>,
}

/// Result of starting an investigation
#[derive(Debug, Serialize, Deserialize)]
pub struct InvestigateStartResult {
    pub success: bool,
    pub investigation_id: Option<String>,
    pub error: Option<String>,
}

/// Result of getting investigation progress
#[derive(Debug, Serialize, Deserialize)]
pub struct InvestigateProgressResult {
    pub success: bool,
    pub progress: Option<InvestigationProgress>,
    pub error: Option<String>,
}

/// Finding category for filtering
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum FindingCategory {
    /// Contradictions (K)
    Contradiction,
    /// Omissions (O)
    Omission,
    /// Temporal anomalies (T)
    Temporal,
    /// Entity issues (E)
    Entity,
    /// Bias indicators (B)
    Bias,
    /// Narrative mutations (M) - from S.A.M. INHERIT
    Narrative,
    /// Authority laundering (Λ) - from S.A.M. COMPOUND
    Authority,
    /// Professional conduct (Π)
    Professional,
    /// Expert witness issues (Ξ)
    Expert,
    /// Documentary/media issues (Δ)
    Documentary,
    /// Outcomes linked to false premises - from S.A.M. ARRIVE
    Outcome,
    /// Accountability breaches
    Accountability,
}

/// Results view with category filtering
#[derive(Debug, Serialize, Deserialize)]
pub struct InvestigationResults {
    pub investigation_id: String,
    pub case_id: String,
    pub total_findings: usize,
    pub findings_by_category: std::collections::HashMap<String, usize>,
    pub findings: Vec<Finding>,
    pub sam_summary: Option<SAMSummary>,
}

/// S.A.M. analysis summary
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SAMSummary {
    pub false_premises_found: i32,
    pub propagation_chains_found: i32,
    pub authority_accumulations_found: i32,
    pub outcomes_linked: i32,
}

/// Result of getting investigation results
#[derive(Debug, Serialize, Deserialize)]
pub struct InvestigateResultsResponse {
    pub success: bool,
    pub results: Option<InvestigationResults>,
    pub error: Option<String>,
}

/// Generic action result
#[derive(Debug, Serialize, Deserialize)]
pub struct InvestigateActionResult {
    pub success: bool,
    pub error: Option<String>,
}

// In-memory storage for investigation state with automatic cleanup
use std::collections::HashMap;
use std::sync::OnceLock;
use tokio::sync::Mutex;

/// Investigation entry with creation timestamp for TTL-based cleanup
#[derive(Debug, Clone)]
struct InvestigationEntry {
    progress: InvestigationProgress,
    created_at: chrono::DateTime<chrono::Utc>,
}

/// TTL for completed/cancelled/failed investigations (15 minutes)
const INVESTIGATION_TTL_SECONDS: i64 = 900;

/// Maximum investigations to keep in memory
const MAX_INVESTIGATIONS: usize = 100;

static INVESTIGATIONS: OnceLock<Arc<Mutex<HashMap<String, InvestigationEntry>>>> = OnceLock::new();

fn get_investigations() -> Arc<Mutex<HashMap<String, InvestigationEntry>>> {
    INVESTIGATIONS.get_or_init(|| Arc::new(Mutex::new(HashMap::new()))).clone()
}

/// Clean up stale investigations from memory
async fn cleanup_stale_investigations() {
    let investigations = get_investigations();
    let mut map = investigations.lock().await;
    let now = chrono::Utc::now();

    // Remove completed/failed/cancelled investigations older than TTL
    map.retain(|_, entry| {
        let is_terminal = matches!(
            entry.progress.status,
            InvestigationStatus::Completed | InvestigationStatus::Failed | InvestigationStatus::Cancelled
        );
        if is_terminal {
            let age = now.signed_duration_since(entry.created_at).num_seconds();
            age < INVESTIGATION_TTL_SECONDS
        } else {
            true // Keep running/pending investigations
        }
    });

    // If still too many, remove oldest completed ones
    if map.len() > MAX_INVESTIGATIONS {
        let mut entries: Vec<_> = map.iter()
            .filter(|(_, e)| matches!(
                e.progress.status,
                InvestigationStatus::Completed | InvestigationStatus::Failed | InvestigationStatus::Cancelled
            ))
            .map(|(k, e)| (k.clone(), e.created_at))
            .collect();
        entries.sort_by_key(|(_, ts)| *ts);

        let to_remove = map.len() - MAX_INVESTIGATIONS;
        for (id, _) in entries.into_iter().take(to_remove) {
            map.remove(&id);
        }
    }
}

/// Start a new unified investigation
#[tauri::command]
pub async fn start_investigation(
    state: State<'_, AppState>,
    input: InvestigateInput,
) -> Result<InvestigateStartResult, String> {
    // Clean up stale investigations before starting a new one
    cleanup_stale_investigations().await;

    let investigation_id = Uuid::new_v4().to_string();
    let now = chrono::Utc::now();
    let now_str = now.to_rfc3339();

    // Validate we have documents
    if input.document_ids.is_empty() {
        return Ok(InvestigateStartResult {
            success: false,
            investigation_id: None,
            error: Some("No documents selected for investigation".to_string()),
        });
    }

    // Determine which engines to run based on mode
    let engines = match input.mode {
        InvestigationMode::Quick => EngineSelection::quick(),
        InvestigationMode::Full => EngineSelection::full(),
        InvestigationMode::Custom => input.engines.unwrap_or_default(),
    };

    // Validate at least one engine is selected
    if engines.count() == 0 {
        return Ok(InvestigateStartResult {
            success: false,
            investigation_id: None,
            error: Some("At least one analysis engine must be selected".to_string()),
        });
    }

    // Build engine progress list
    let mut engine_progress = Vec::new();
    for name in engines.selected_names() {
        engine_progress.push(EngineProgress {
            engine: name.to_string(),
            status: InvestigationStatus::Pending,
            started_at: None,
            completed_at: None,
            findings_count: 0,
            error: None,
        });
    }

    // Create investigation progress
    let progress = InvestigationProgress {
        investigation_id: investigation_id.clone(),
        case_id: input.case_id.clone(),
        status: InvestigationStatus::Running,
        mode: input.mode,
        total_engines: engines.count(),
        completed_engines: 0,
        current_engine: None,
        engines: engine_progress,
        sam_analysis_id: None,
        started_at: now_str.clone(),
        updated_at: now_str,
        error: None,
    };

    // Store progress with timestamp for cleanup
    {
        let investigations = get_investigations();
        let mut map = investigations.lock().await;
        map.insert(investigation_id.clone(), InvestigationEntry {
            progress,
            created_at: now,
        });
    }

    // Create cancellation token
    let cancel_token = CancellationToken::new();
    {
        let mut tokens = state.sam_tokens.lock().await;
        tokens.insert(investigation_id.clone(), cancel_token.clone());
    }

    // Get pool for spawned task
    let db = state.db.read().await;
    let pool = db.pool().clone();
    drop(db);

    let investigation_id_clone = investigation_id.clone();
    let case_id = input.case_id.clone();
    let document_ids = input.document_ids.clone();
    let focus_claims = input.focus_claims.clone();
    let sam_tokens = state.sam_tokens.clone();

    // Spawn the investigation task
    tokio::spawn(async move {
        let result = run_investigation(
            pool,
            investigation_id_clone.clone(),
            case_id,
            document_ids,
            engines,
            focus_claims,
            cancel_token,
        ).await;

        if let Err(e) = result {
            log::error!("Investigation {} failed: {}", investigation_id_clone, e);
            // Update status to failed
            let investigations = get_investigations();
            let mut map = investigations.lock().await;
            if let Some(entry) = map.get_mut(&investigation_id_clone) {
                entry.progress.status = InvestigationStatus::Failed;
                entry.progress.error = Some(e);
                entry.progress.updated_at = chrono::Utc::now().to_rfc3339();
            }
        }

        // Clean up token
        let mut tokens = sam_tokens.lock().await;
        tokens.remove(&investigation_id_clone);
    });

    Ok(InvestigateStartResult {
        success: true,
        investigation_id: Some(investigation_id),
        error: None,
    })
}

/// Helper to update engine progress
async fn update_engine_progress(
    investigation_id: &str,
    engine_name: &str,
    status: InvestigationStatus,
    findings: usize,
    error: Option<String>,
) {
    let investigations = get_investigations();
    let mut map = investigations.lock().await;
    if let Some(entry) = map.get_mut(investigation_id) {
        for ep in &mut entry.progress.engines {
            if ep.engine == engine_name {
                ep.status = status;
                ep.findings_count = findings;
                ep.error = error;
                if status == InvestigationStatus::Running {
                    ep.started_at = Some(chrono::Utc::now().to_rfc3339());
                    entry.progress.current_engine = Some(engine_name.to_string());
                } else if status == InvestigationStatus::Completed || status == InvestigationStatus::Failed {
                    ep.completed_at = Some(chrono::Utc::now().to_rfc3339());
                    entry.progress.completed_engines += 1;
                }
                break;
            }
        }
        entry.progress.updated_at = chrono::Utc::now().to_rfc3339();
    }
}

/// Raw document data fetched from database (shared across all engines)
#[derive(Debug, Clone)]
struct RawDocumentData {
    id: String,
    filename: String,
    doc_type: String,
    date: Option<String>,
    content: String,
}

/// Fetch all documents once from database (optimization: single pass)
async fn fetch_raw_documents(pool: &sqlx::SqlitePool, doc_ids: &[String]) -> Vec<RawDocumentData> {
    let mut docs = Vec::with_capacity(doc_ids.len());
    for doc_id in doc_ids {
        let row: Option<(String, Option<String>, Option<String>, Option<String>)> = sqlx::query_as(
            "SELECT filename, doc_type, extracted_text, created_at FROM documents WHERE id = ?"
        )
        .bind(doc_id)
        .fetch_optional(pool)
        .await
        .ok()
        .flatten();

        if let Some((filename, doc_type, text, created_at)) = row {
            if let Some(content) = text {
                docs.push(RawDocumentData {
                    id: doc_id.clone(),
                    filename,
                    doc_type: doc_type.unwrap_or_else(|| "unknown".to_string()),
                    date: created_at,
                    content,
                });
            }
        }
    }
    docs
}

/// Internal function to run the investigation
async fn run_investigation(
    pool: sqlx::SqlitePool,
    investigation_id: String,
    case_id: String,
    document_ids: Vec<String>,
    engines: EngineSelection,
    focus_claims: Option<Vec<String>>,
    cancel_token: CancellationToken,
) -> Result<(), String> {
    use crate::engines::*;

    let investigations = get_investigations();

    // Fetch all documents ONCE at the start (optimization)
    let raw_docs = fetch_raw_documents(&pool, &document_ids).await;

    // Run S.A.M. if enabled
    if engines.sam {
        if cancel_token.is_cancelled() {
            return Ok(());
        }

        update_engine_progress(&investigation_id,"S.A.M.", InvestigationStatus::Running, 0, None).await;

        let sam_analysis_id = Uuid::new_v4().to_string();

        // Store SAM analysis ID
        {
            let mut map = investigations.lock().await;
            if let Some(entry) = map.get_mut(&investigation_id) {
                entry.progress.sam_analysis_id = Some(sam_analysis_id.clone());
            }
        }

        // Create SAM record
        let now = chrono::Utc::now().to_rfc3339();
        sqlx::query(
            "INSERT INTO sam_analyses (id, case_id, status, document_ids, focus_claims, metadata, created_at, updated_at)
             VALUES (?, ?, 'pending', ?, ?, '{}', ?, ?)"
        )
        .bind(&sam_analysis_id)
        .bind(&case_id)
        .bind(serde_json::to_string(&document_ids).unwrap_or_else(|_| "[]".to_string()))
        .bind(serde_json::to_string(&focus_claims.as_ref().unwrap_or(&vec![])).unwrap_or_else(|_| "[]".to_string()))
        .bind(&now)
        .bind(&now)
        .execute(&pool)
        .await
        .map_err(|e| format!("Failed to create SAM analysis: {}", e))?;

        let config = SAMConfig {
            analysis_id: sam_analysis_id.clone(),
            case_id: case_id.clone(),
            document_ids: document_ids.clone(),
            focus_claims: focus_claims.clone(),
            stop_after_phase: None,
            timeout_seconds: 300,
        };

        let mut executor = SAMExecutor::new(pool.clone(), config, cancel_token.clone());
        if executor.try_init_ai().is_err() {
            log::warn!("AI client not available for S.A.M. analysis");
        }

        match executor.execute().await {
            Ok(()) => {
                // Get SAM counts from database
                let sam_counts: Option<(i32, i32, i32, i32)> = sqlx::query_as(
                    "SELECT false_premises_found, propagation_chains_found, authority_accumulations_found, outcomes_linked
                     FROM sam_analyses WHERE id = ?"
                )
                .bind(&sam_analysis_id)
                .fetch_optional(&pool)
                .await
                .ok()
                .flatten();

                let total = sam_counts.map(|(a, b, c, d)| (a + b + c + d) as usize).unwrap_or(0);
                update_engine_progress(&investigation_id,"S.A.M.", InvestigationStatus::Completed, total, None).await;
            }
            Err(e) => {
                update_engine_progress(&investigation_id,"S.A.M.", InvestigationStatus::Failed, 0, Some(e)).await;
            }
        }
    }

    // Helper to convert raw docs to engine-specific DocumentInfo
    // All engine DocumentInfo types have identical fields, so this is a simple mapping
    macro_rules! convert_docs {
        ($raw_docs:expr, $doc_type:path) => {
            $raw_docs.iter().map(|d| {
                $doc_type {
                    id: d.id.clone(),
                    name: d.filename.clone(),
                    doc_type: d.doc_type.clone(),
                    date: d.date.clone(),
                    content: d.content.clone(),
                }
            }).collect::<Vec<_>>()
        };
    }

    // Run Contradiction engine
    if engines.contradiction {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Contradiction", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, contradiction::DocumentInfo);
        let mut engine = ContradictionEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Contradiction engine, running in mock mode");
        }
        match engine.detect_contradictions(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Contradiction", InvestigationStatus::Completed, result.contradictions.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Contradiction", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Omission engine
    if engines.omission {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Omission", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, omission::DocumentInfo);
        let mut engine = OmissionEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Omission engine, running in mock mode");
        }
        match engine.detect_omissions(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Omission", InvestigationStatus::Completed, result.omissions.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Omission", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Temporal engine
    if engines.temporal {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Temporal", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, temporal::DocumentInfo);
        let mut engine = TemporalEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Temporal engine, running in mock mode");
        }
        match engine.analyze_timeline(docs, &case_id).await {
            Ok(result) => {
                let count = result.events.len() + result.anomalies.len() + result.gaps.len();
                update_engine_progress(&investigation_id, "Temporal", InvestigationStatus::Completed, count, None).await;
            }
            Err(e) => update_engine_progress(&investigation_id, "Temporal", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Entity engine
    if engines.entity {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Entity", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, entity::DocumentInfo);
        let mut engine = EntityEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Entity engine, running in mock mode");
        }
        match engine.resolve_entities(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Entity", InvestigationStatus::Completed, result.entities.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Entity", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Bias engine
    if engines.bias {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Bias", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, bias::DocumentInfo);
        let mut engine = BiasEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Bias engine, running in mock mode");
        }
        match engine.detect_bias(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Bias", InvestigationStatus::Completed, result.findings.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Bias", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Professional engine
    if engines.professional {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Professional", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, professional::DocumentInfo);
        let mut engine = ProfessionalEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Professional engine, running in mock mode");
        }
        match engine.track_professionals(docs, &case_id).await {
            Ok(result) => {
                let count: usize = result.professionals.iter().map(|p| p.concerns.len()).sum();
                update_engine_progress(&investigation_id, "Professional", InvestigationStatus::Completed, count, None).await;
            }
            Err(e) => update_engine_progress(&investigation_id, "Professional", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Expert engine
    if engines.expert {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Expert", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, expert::DocumentInfo);
        let mut engine = ExpertEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Expert engine, running in mock mode");
        }
        match engine.analyze_experts(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Expert", InvestigationStatus::Completed, result.issues.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Expert", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Accountability engine
    if engines.accountability {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Accountability", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, accountability::DocumentInfo);
        let mut engine = AccountabilityEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Accountability engine, running in mock mode");
        }
        match engine.audit_accountability(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Accountability", InvestigationStatus::Completed, result.breaches.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Accountability", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Narrative engine
    if engines.narrative {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Narrative", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, narrative::DocumentInfo);
        let mut engine = NarrativeEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Narrative engine, running in mock mode");
        }
        match engine.analyze_narrative(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Narrative", InvestigationStatus::Completed, result.mutations.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Narrative", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Run Documentary engine
    if engines.documentary {
        if cancel_token.is_cancelled() { return Ok(()); }
        update_engine_progress(&investigation_id, "Documentary", InvestigationStatus::Running, 0, None).await;
        let docs = convert_docs!(&raw_docs, documentary::DocumentInfo);
        let mut engine = DocumentaryEngine::new(pool.clone());
        if engine.try_init_ai().is_err() {
            log::warn!("AI client not available for Documentary engine, running in mock mode");
        }
        match engine.analyze_documentary(docs, &case_id).await {
            Ok(result) => update_engine_progress(&investigation_id, "Documentary", InvestigationStatus::Completed, result.editorial_choices.len(), None).await,
            Err(e) => update_engine_progress(&investigation_id, "Documentary", InvestigationStatus::Failed, 0, Some(e)).await,
        }
    }

    // Mark investigation as completed
    {
        let mut map = investigations.lock().await;
        if let Some(entry) = map.get_mut(&investigation_id) {
            entry.progress.status = InvestigationStatus::Completed;
            entry.progress.current_engine = None;
            entry.progress.updated_at = chrono::Utc::now().to_rfc3339();
        }
    }

    log::info!("Investigation {} completed successfully", investigation_id);
    Ok(())
}

/// Get investigation progress
#[tauri::command]
pub async fn get_investigation_progress(
    investigation_id: String,
) -> Result<InvestigateProgressResult, String> {
    let investigations = get_investigations();
    let map = investigations.lock().await;

    match map.get(&investigation_id) {
        Some(entry) => Ok(InvestigateProgressResult {
            success: true,
            progress: Some(entry.progress.clone()),
            error: None,
        }),
        None => Ok(InvestigateProgressResult {
            success: false,
            progress: None,
            error: Some("Investigation not found".to_string()),
        }),
    }
}

/// Get investigation results (findings)
#[tauri::command]
pub async fn get_investigation_results(
    state: State<'_, AppState>,
    investigation_id: String,
    category: Option<String>,
) -> Result<InvestigateResultsResponse, String> {
    let investigations = get_investigations();
    let map = investigations.lock().await;

    let progress = match map.get(&investigation_id) {
        Some(entry) => entry.progress.clone(),
        None => return Ok(InvestigateResultsResponse {
            success: false,
            results: None,
            error: Some("Investigation not found".to_string()),
        }),
    };
    drop(map);

    let db = state.db.read().await;

    // Build query based on category filter
    let findings: Vec<Finding> = if let Some(cat) = category {
        let engine_filter = match cat.as_str() {
            "contradiction" => "contradiction",
            "omission" => "omission",
            "temporal" => "temporal_parser",
            "entity" => "entity_resolution",
            "bias" => "bias_detection",
            "professional" => "professional_tracker",
            "expert" => "expert_witness",
            "accountability" => "accountability",
            "narrative" => "narrative",
            "documentary" => "documentary",
            _ => "",
        };

        if engine_filter.is_empty() {
            sqlx::query_as::<_, Finding>(
                "SELECT * FROM findings WHERE case_id = ? ORDER BY created_at DESC"
            )
            .bind(&progress.case_id)
            .fetch_all(db.pool())
            .await
            .unwrap_or_default()
        } else {
            sqlx::query_as::<_, Finding>(
                "SELECT * FROM findings WHERE case_id = ? AND engine = ? ORDER BY created_at DESC"
            )
            .bind(&progress.case_id)
            .bind(engine_filter)
            .fetch_all(db.pool())
            .await
            .unwrap_or_default()
        }
    } else {
        sqlx::query_as::<_, Finding>(
            "SELECT * FROM findings WHERE case_id = ? ORDER BY created_at DESC"
        )
        .bind(&progress.case_id)
        .fetch_all(db.pool())
        .await
        .unwrap_or_default()
    };

    // Count by category
    let mut by_category: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    for finding in &findings {
        *by_category.entry(finding.engine.clone()).or_insert(0) += 1;
    }

    // Get S.A.M. summary if available
    let sam_summary = if let Some(sam_id) = &progress.sam_analysis_id {
        let row: Option<(i32, i32, i32, i32)> = sqlx::query_as(
            "SELECT false_premises_found, propagation_chains_found, authority_accumulations_found, outcomes_linked
             FROM sam_analyses WHERE id = ?"
        )
        .bind(sam_id)
        .fetch_optional(db.pool())
        .await
        .ok()
        .flatten();

        row.map(|(fp, pc, aa, ol)| SAMSummary {
            false_premises_found: fp,
            propagation_chains_found: pc,
            authority_accumulations_found: aa,
            outcomes_linked: ol,
        })
    } else {
        None
    };

    Ok(InvestigateResultsResponse {
        success: true,
        results: Some(InvestigationResults {
            investigation_id,
            case_id: progress.case_id,
            total_findings: findings.len(),
            findings_by_category: by_category,
            findings,
            sam_summary,
        }),
        error: None,
    })
}

/// Cancel a running investigation
#[tauri::command]
pub async fn cancel_investigation(
    state: State<'_, AppState>,
    investigation_id: String,
) -> Result<InvestigateActionResult, String> {
    // Cancel the token
    {
        let tokens = state.sam_tokens.lock().await;
        if let Some(token) = tokens.get(&investigation_id) {
            token.cancel();
        }
    }

    // Update status
    let investigations = get_investigations();
    let mut map = investigations.lock().await;

    if let Some(entry) = map.get_mut(&investigation_id) {
        entry.progress.status = InvestigationStatus::Cancelled;
        entry.progress.updated_at = chrono::Utc::now().to_rfc3339();
        Ok(InvestigateActionResult {
            success: true,
            error: None,
        })
    } else {
        Ok(InvestigateActionResult {
            success: false,
            error: Some("Investigation not found".to_string()),
        })
    }
}

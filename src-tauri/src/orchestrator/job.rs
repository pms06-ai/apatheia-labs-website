//! Engine job definitions

use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

use super::EngineId;

/// Status of an engine job
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum JobStatus {
    Pending,
    Running,
    Completed,
    Failed,
    Cancelled,
}

/// Finding from an engine run
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EngineFinding {
    pub id: String,
    pub engine_id: String,
    pub finding_type: String,
    pub title: String,
    pub description: String,
    pub severity: String,
    pub confidence: f64,
    pub document_ids: Vec<String>,
    pub evidence: serde_json::Value,
    pub metadata: serde_json::Value,
}

/// Result of running an engine
pub type EngineResult = Result<Vec<EngineFinding>, String>;

/// An analysis job queued for execution
#[derive(Debug, Clone)]
pub struct EngineJob {
    pub id: String,
    pub case_id: String,
    pub document_ids: Vec<String>,
    pub engines: Vec<EngineId>,
    pub status: JobStatus,
    pub created_at: DateTime<Utc>,
    pub started_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
    pub results: HashMap<EngineId, EngineResult>,
}

impl EngineJob {
    /// Create a new engine job
    pub fn new(
        id: String,
        case_id: String,
        document_ids: Vec<String>,
        engines: Vec<EngineId>,
    ) -> Self {
        Self {
            id,
            case_id,
            document_ids,
            engines,
            status: JobStatus::Pending,
            created_at: Utc::now(),
            started_at: None,
            completed_at: None,
            results: HashMap::new(),
        }
    }
    
    /// Get progress information
    pub fn get_progress(&self) -> JobProgress {
        let total = self.engines.len();
        let completed = self.results.len();
        let succeeded = self.results.values().filter(|r| r.is_ok()).count();
        let failed = self.results.values().filter(|r| r.is_err()).count();
        
        let duration_ms = match (self.started_at, self.completed_at) {
            (Some(start), Some(end)) => Some((end - start).num_milliseconds() as u64),
            (Some(start), None) => Some((Utc::now() - start).num_milliseconds() as u64),
            _ => None,
        };
        
        JobProgress {
            job_id: self.id.clone(),
            case_id: self.case_id.clone(),
            status: self.status,
            total_engines: total,
            completed_engines: completed,
            succeeded_engines: succeeded,
            failed_engines: failed,
            duration_ms,
            current_engine: if completed < total && self.status == JobStatus::Running {
                self.engines.get(completed).map(|e| e.to_string())
            } else {
                None
            },
        }
    }
    
    /// Get total findings count
    pub fn total_findings(&self) -> usize {
        self.results
            .values()
            .filter_map(|r| r.as_ref().ok())
            .map(|findings| findings.len())
            .sum()
    }
}

/// Progress information for a job
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JobProgress {
    pub job_id: String,
    pub case_id: String,
    pub status: JobStatus,
    pub total_engines: usize,
    pub completed_engines: usize,
    pub succeeded_engines: usize,
    pub failed_engines: usize,
    pub duration_ms: Option<u64>,
    pub current_engine: Option<String>,
}


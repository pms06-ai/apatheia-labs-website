//! Engine runner - executes TypeScript engines via sidecar

use std::process::Stdio;
use tokio::process::Command;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use serde::{Deserialize, Serialize};
use log::{info, debug};

use super::{EngineId, job::EngineFinding};

/// Request sent to the TypeScript engine runner
#[derive(Debug, Serialize)]
struct EngineRequest {
    engine_id: String,
    case_id: String,
    document_ids: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    options: Option<serde_json::Value>,
}

/// Response from the TypeScript engine runner
#[derive(Debug, Deserialize)]
struct EngineResponse {
    success: bool,
    engine_id: String,
    findings: Option<Vec<EngineFinding>>,
    error: Option<String>,
    duration_ms: u64,
}

/// Engine runner that communicates with TypeScript sidecar
pub struct EngineRunner {
    /// Path to the engine runner executable/script
    sidecar_path: Option<String>,
}

impl EngineRunner {
    pub fn new() -> Self {
        Self {
            sidecar_path: None,
        }
    }
    
    /// Set the sidecar path
    pub fn with_sidecar_path(mut self, path: String) -> Self {
        self.sidecar_path = Some(path);
        self
    }
    
    /// Run an engine and return findings
    pub async fn run_engine(
        &self,
        engine_id: EngineId,
        case_id: &str,
        document_ids: &[String],
    ) -> Result<Vec<EngineFinding>, String> {
        info!("Running engine {} for case {}", engine_id, case_id);
        
        // For now, return mock findings since we don't have the sidecar set up
        // In production, this would spawn the TypeScript sidecar process
        
        if let Some(ref sidecar_path) = self.sidecar_path {
            self.run_via_sidecar(sidecar_path, engine_id, case_id, document_ids).await
        } else {
            // Mock implementation for development
            self.run_mock_engine(engine_id, case_id, document_ids).await
        }
    }
    
    /// Run engine via TypeScript sidecar process
    async fn run_via_sidecar(
        &self,
        sidecar_path: &str,
        engine_id: EngineId,
        case_id: &str,
        document_ids: &[String],
    ) -> Result<Vec<EngineFinding>, String> {
        let request = EngineRequest {
            engine_id: engine_id.to_string(),
            case_id: case_id.to_string(),
            document_ids: document_ids.to_vec(),
            options: None,
        };
        
        let request_json = serde_json::to_string(&request)
            .map_err(|e| format!("Failed to serialize request: {}", e))?;
        
        // Spawn the sidecar process
        let mut child = Command::new("node")
            .arg(sidecar_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Failed to spawn sidecar: {}", e))?;
        
        // Send request
        if let Some(stdin) = child.stdin.as_mut() {
            stdin.write_all(request_json.as_bytes()).await
                .map_err(|e| format!("Failed to write to sidecar: {}", e))?;
            stdin.write_all(b"\n").await
                .map_err(|e| format!("Failed to write newline: {}", e))?;
        }
        
        // Read response
        let stdout = child.stdout.take()
            .ok_or("Failed to get stdout")?;
        let mut reader = BufReader::new(stdout);
        let mut response_line = String::new();
        reader.read_line(&mut response_line).await
            .map_err(|e| format!("Failed to read response: {}", e))?;
        
        // Wait for process to complete
        let status = child.wait().await
            .map_err(|e| format!("Failed to wait for sidecar: {}", e))?;
        
        if !status.success() {
            return Err(format!("Sidecar exited with status: {}", status));
        }
        
        // Parse response
        let response: EngineResponse = serde_json::from_str(&response_line)
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        
        if response.success {
            Ok(response.findings.unwrap_or_default())
        } else {
            Err(response.error.unwrap_or_else(|| "Unknown error".to_string()))
        }
    }
    
    /// Mock engine implementation for development
    async fn run_mock_engine(
        &self,
        engine_id: EngineId,
        case_id: &str,
        document_ids: &[String],
    ) -> Result<Vec<EngineFinding>, String> {
        debug!("Running mock engine {} for case {}", engine_id, case_id);
        
        // Simulate processing time
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        
        // Return mock findings based on engine type
        let findings = match engine_id {
            EngineId::Contradiction => vec![
                EngineFinding {
                    id: uuid::Uuid::new_v4().to_string(),
                    engine_id: engine_id.to_string(),
                    finding_type: "factual_contradiction".to_string(),
                    title: "Date discrepancy detected".to_string(),
                    description: "Document A states incident occurred on 15th, Document B states 17th".to_string(),
                    severity: "high".to_string(),
                    confidence: 0.85,
                    document_ids: document_ids.to_vec(),
                    evidence: serde_json::json!({
                        "doc_a_excerpt": "The incident took place on the 15th of March",
                        "doc_b_excerpt": "As recorded on March 17th, the incident..."
                    }),
                    metadata: serde_json::json!({}),
                },
            ],
            EngineId::Omission => vec![
                EngineFinding {
                    id: uuid::Uuid::new_v4().to_string(),
                    engine_id: engine_id.to_string(),
                    finding_type: "material_omission".to_string(),
                    title: "Key witness not mentioned".to_string(),
                    description: "Source document references witness statements not present in summary".to_string(),
                    severity: "medium".to_string(),
                    confidence: 0.72,
                    document_ids: document_ids.to_vec(),
                    evidence: serde_json::json!({
                        "missing_reference": "Witness John Doe's statement dated 2024-01-15"
                    }),
                    metadata: serde_json::json!({}),
                },
            ],
            _ => vec![],
        };
        
        info!("Mock engine {} produced {} findings", engine_id, findings.len());
        
        Ok(findings)
    }
}

impl Default for EngineRunner {
    fn default() -> Self {
        Self::new()
    }
}


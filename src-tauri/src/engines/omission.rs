//! OMISSION ENGINE (Ο)
//!
//! "Source-to-Report Gap Analysis"
//!
//! Detects what was deliberately or negligently left out when
//! information was transmitted from source documents to reports.
//!
//! Core Question: What material information was omitted, and does the
//! pattern of omissions reveal directional bias?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Types of omissions detected
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum OmissionType {
    /// Partial quotes that change meaning
    SelectiveQuoting,
    /// Important information completely left out
    CompleteExclusion,
    /// Removing surrounding context that changes meaning
    ContextStripping,
    /// Only presenting favorable evidence
    CherryPicking,
    /// Omitting exculpatory evidence
    ExculpatoryOmission,
    /// Omitting procedural violations
    ProceduralOmission,
    /// Omitting contradictory evidence
    ContradictoryOmission,
}

impl OmissionType {
    pub fn as_str(&self) -> &'static str {
        match self {
            OmissionType::SelectiveQuoting => "selective_quoting",
            OmissionType::CompleteExclusion => "complete_exclusion",
            OmissionType::ContextStripping => "context_stripping",
            OmissionType::CherryPicking => "cherry_picking",
            OmissionType::ExculpatoryOmission => "exculpatory_omission",
            OmissionType::ProceduralOmission => "procedural_omission",
            OmissionType::ContradictoryOmission => "contradictory_omission",
        }
    }
}

/// Severity of an omission
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Severity {
    Critical,
    High,
    Medium,
    Low,
}

impl Severity {
    pub fn as_str(&self) -> &'static str {
        match self {
            Severity::Critical => "critical",
            Severity::High => "high",
            Severity::Medium => "medium",
            Severity::Low => "low",
        }
    }
}

/// Direction of bias (who benefits from the omission)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BiasDirection {
    /// Omission favors prosecution/claimant/applicant
    ProsecutionFavoring,
    /// Omission favors defense/respondent
    DefenseFavoring,
    /// Omission favors institution/authority
    InstitutionFavoring,
    /// Omission favors individual against institution
    IndividualFavoring,
    /// Direction unclear or neutral
    Neutral,
}

impl BiasDirection {
    pub fn as_str(&self) -> &'static str {
        match self {
            BiasDirection::ProsecutionFavoring => "prosecution_favoring",
            BiasDirection::DefenseFavoring => "defense_favoring",
            BiasDirection::InstitutionFavoring => "institution_favoring",
            BiasDirection::IndividualFavoring => "individual_favoring",
            BiasDirection::Neutral => "neutral",
        }
    }
}

/// Reference to source material that was omitted
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceReference {
    pub document_id: String,
    pub document_name: String,
    pub text: String,
    pub page_ref: Option<i32>,
    pub date: Option<String>,
}

/// Reference to the report that performed the omission
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReportReference {
    pub document_id: String,
    pub document_name: String,
    pub author: Option<String>,
    pub date: Option<String>,
    /// What was said instead (if anything)
    pub substitute_text: Option<String>,
}

/// A detected omission
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OmissionFinding {
    pub id: String,
    #[serde(rename = "type")]
    pub omission_type: OmissionType,
    pub severity: Severity,
    pub bias_direction: BiasDirection,
    /// The source document containing omitted information
    pub source: SourceReference,
    /// The report that omitted the information
    pub report: ReportReference,
    /// What was omitted (the actual content)
    pub omitted_content: String,
    /// Why this omission matters
    pub significance: String,
    /// Impact on fairness/accuracy
    pub impact: String,
}

/// Bias analysis summary
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiasAnalysis {
    /// Total omissions favoring prosecution/claimant
    pub prosecution_favoring: i32,
    /// Total omissions favoring defense/respondent
    pub defense_favoring: i32,
    /// Bias score: (pro - def) / total, range -1.0 to +1.0
    pub bias_score: f64,
    /// Statistical significance of the bias
    pub is_significant: bool,
    /// Assessment of the bias pattern
    pub assessment: String,
}

/// Summary of omission analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OmissionSummary {
    pub total_omissions: i32,
    pub critical_count: i32,
    pub by_type: Vec<TypeCount>,
    pub bias_analysis: BiasAnalysis,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TypeCount {
    pub omission_type: String,
    pub count: i32,
}

/// Complete result of omission analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OmissionAnalysisResult {
    pub omissions: Vec<OmissionFinding>,
    pub summary: OmissionSummary,
    pub is_mock: bool,
}

/// Document info for analysis
#[derive(Debug, Clone)]
pub struct DocumentInfo {
    pub id: String,
    pub name: String,
    pub doc_type: String,
    pub date: Option<String>,
    pub content: String,
}

/// AI response format for omission detection
#[derive(Debug, Deserialize)]
struct AIOmissionResponse {
    omissions: Vec<AIOmission>,
    #[serde(rename = "biasAnalysis")]
    bias_analysis: AIBiasAnalysis,
}

#[derive(Debug, Deserialize)]
struct AIOmission {
    #[serde(rename = "type")]
    omission_type: String,
    severity: String,
    #[serde(rename = "biasDirection")]
    bias_direction: String,
    source: AISourceRef,
    report: AIReportRef,
    #[serde(rename = "omittedContent")]
    omitted_content: String,
    significance: String,
    impact: String,
}

#[derive(Debug, Deserialize)]
struct AISourceRef {
    #[serde(rename = "documentId")]
    document_id: String,
    text: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
    date: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIReportRef {
    #[serde(rename = "documentId")]
    document_id: String,
    author: Option<String>,
    date: Option<String>,
    #[serde(rename = "substituteText")]
    substitute_text: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIBiasAnalysis {
    #[serde(rename = "prosecutionFavoring")]
    prosecution_favoring: i32,
    #[serde(rename = "defenseFavoring")]
    defense_favoring: i32,
    #[serde(rename = "biasScore")]
    bias_score: f64,
    #[serde(rename = "isSignificant")]
    is_significant: bool,
    assessment: String,
}

/// The Omission Engine
pub struct OmissionEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl OmissionEngine {
    /// Create a new omission engine with database connection
    pub fn new(pool: SqlitePool) -> Self {
        Self {
            pool,
            ai_client: None,
            mock_mode: false,
        }
    }

    /// Configure with AI client
    pub fn with_ai_client(mut self, client: AIClient) -> Self {
        self.ai_client = Some(client);
        self
    }

    /// Enable mock mode for testing
    pub fn with_mock_mode(mut self, mock: bool) -> Self {
        self.mock_mode = mock;
        self
    }

    /// Try to initialize AI client from environment
    pub fn try_init_ai(&mut self) -> Result<(), String> {
        match AIClient::from_env() {
            Ok(client) => {
                self.ai_client = Some(client);
                Ok(())
            }
            Err(e) => {
                log::warn!("AI client not available: {}", e);
                self.mock_mode = true;
                Err(e)
            }
        }
    }

    /// Detect omissions between source documents and reports
    pub async fn detect_omissions(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<OmissionAnalysisResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_detect_omissions(&documents, case_id).await;
        }

        let ai_client = self.ai_client.as_ref().unwrap();

        // Format documents for prompt
        let formatted_docs = documents
            .iter()
            .map(|d| {
                format!(
                    "=== DOCUMENT: {} (ID: {}, Type: {}, Date: {}) ===\n{}",
                    d.name,
                    d.id,
                    d.doc_type,
                    d.date.as_deref().unwrap_or("unknown"),
                    &d.content[..d.content.len().min(50000)]
                )
            })
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let prompt = format!(
            r#"Analyze these documents to detect OMISSIONS - material information from source documents
that was left out when information was transmitted to reports or subsequent documents.

Types of omissions to detect:
1. SELECTIVE_QUOTING: Partial quotes that change meaning by removing key context
2. COMPLETE_EXCLUSION: Important information entirely left out
3. CONTEXT_STRIPPING: Removing surrounding context that changes interpretation
4. CHERRY_PICKING: Only presenting evidence that supports one side
5. EXCULPATORY_OMISSION: Omitting evidence that clears or exonerates
6. PROCEDURAL_OMISSION: Omitting violations of procedure or protocol
7. CONTRADICTORY_OMISSION: Omitting evidence that contradicts the narrative

For each omission:
- Identify the SOURCE document containing the omitted information
- Identify the REPORT that performed the omission
- Quote the exact omitted content
- Determine who benefits (BIAS DIRECTION)
- Rate severity based on impact

BIAS DIRECTION categories:
- prosecution_favoring: Benefits prosecution/claimant/applicant
- defense_favoring: Benefits defense/respondent
- institution_favoring: Benefits the institution/authority
- individual_favoring: Benefits individual against institution
- neutral: Direction unclear

Calculate overall BIAS SCORE:
- Count omissions favoring each side
- Score = (prosecution - defense) / total
- Range: -1.0 (all defense-favoring) to +1.0 (all prosecution-favoring)
- Significant if |score| > 0.6 AND count > 3

DOCUMENTS TO ANALYZE:
{}

Respond in JSON:
{{
  "omissions": [
    {{
      "type": "selective_quoting|complete_exclusion|context_stripping|cherry_picking|exculpatory_omission|procedural_omission|contradictory_omission",
      "severity": "critical|high|medium|low",
      "biasDirection": "prosecution_favoring|defense_favoring|institution_favoring|individual_favoring|neutral",
      "source": {{
        "documentId": "...",
        "text": "the full text that was available",
        "pageRef": number,
        "date": "..."
      }},
      "report": {{
        "documentId": "...",
        "author": "...",
        "date": "...",
        "substituteText": "what was said instead, if anything"
      }},
      "omittedContent": "the specific content that was omitted",
      "significance": "why this omission matters",
      "impact": "how this affects fairness/accuracy of the case"
    }}
  ],
  "biasAnalysis": {{
    "prosecutionFavoring": number,
    "defenseFavoring": number,
    "biasScore": number,
    "isSignificant": boolean,
    "assessment": "overall assessment of the bias pattern"
  }}
}}"#,
            formatted_docs
        );

        let system = "You are a forensic document analyst specializing in detecting omissions and \
            selective presentation of evidence. You read documents with adversarial skepticism, \
            comparing what source documents contain against what reports claim or present. \
            You are particularly attuned to patterns of omission that reveal directional bias.";

        let response: AIOmissionResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert AI response to our types
        let omissions = response
            .omissions
            .into_iter()
            .enumerate()
            .map(|(idx, o)| {
                let source_name = documents
                    .iter()
                    .find(|d| d.id == o.source.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                let report_name = documents
                    .iter()
                    .find(|d| d.id == o.report.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                OmissionFinding {
                    id: format!("omission-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    omission_type: parse_omission_type(&o.omission_type),
                    severity: parse_severity(&o.severity),
                    bias_direction: parse_bias_direction(&o.bias_direction),
                    source: SourceReference {
                        document_id: o.source.document_id,
                        document_name: source_name,
                        text: o.source.text,
                        page_ref: o.source.page_ref,
                        date: o.source.date,
                    },
                    report: ReportReference {
                        document_id: o.report.document_id,
                        document_name: report_name,
                        author: o.report.author,
                        date: o.report.date,
                        substitute_text: o.report.substitute_text,
                    },
                    omitted_content: o.omitted_content,
                    significance: o.significance,
                    impact: o.impact,
                }
            })
            .collect::<Vec<_>>();

        // Build summary
        let summary = self.build_summary(&omissions, &response.bias_analysis);

        // Store in database
        self.store_omissions(case_id, &omissions).await?;

        Ok(OmissionAnalysisResult {
            omissions,
            summary,
            is_mock: false,
        })
    }

    /// Build analysis summary
    fn build_summary(&self, omissions: &[OmissionFinding], bias: &AIBiasAnalysis) -> OmissionSummary {
        let total = omissions.len() as i32;
        let critical = omissions.iter().filter(|o| o.severity == Severity::Critical).count() as i32;

        // Count by type
        let mut type_counts: std::collections::HashMap<String, i32> = std::collections::HashMap::new();
        for o in omissions {
            *type_counts.entry(o.omission_type.as_str().to_string()).or_insert(0) += 1;
        }
        let by_type: Vec<TypeCount> = type_counts
            .into_iter()
            .map(|(t, c)| TypeCount { omission_type: t, count: c })
            .collect();

        OmissionSummary {
            total_omissions: total,
            critical_count: critical,
            by_type,
            bias_analysis: BiasAnalysis {
                prosecution_favoring: bias.prosecution_favoring,
                defense_favoring: bias.defense_favoring,
                bias_score: bias.bias_score,
                is_significant: bias.is_significant,
                assessment: bias.assessment.clone(),
            },
        }
    }

    /// Store omissions in database
    async fn store_omissions(
        &self,
        case_id: &str,
        omissions: &[OmissionFinding],
    ) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for o in omissions {
            let id = Uuid::new_v4().to_string();
            let title = format!(
                "{} omission: {}...",
                o.omission_type.as_str(),
                &o.omitted_content[..o.omitted_content.len().min(50)]
            );

            let doc_ids = serde_json::json!([o.source.document_id, o.report.document_id]).to_string();
            let evidence = serde_json::json!({
                "type": o.omission_type.as_str(),
                "bias_direction": o.bias_direction.as_str(),
                "source": o.source,
                "report": o.report,
                "omitted_content": o.omitted_content,
                "significance": o.significance,
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'omission', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&o.impact)
            .bind(o.severity.as_str())
            .bind(&doc_ids)
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store omission: {}", e))?;
        }

        log::info!("Stored {} omissions for case {}", omissions.len(), case_id);
        Ok(())
    }

    /// Mock detection for testing/development
    async fn mock_detect_omissions(
        &self,
        _documents: &[DocumentInfo],
        case_id: &str,
    ) -> Result<OmissionAnalysisResult, String> {
        log::warn!("Running omission detection in mock mode");

        // Simulate processing time
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        // Return mock data that demonstrates the engine's capabilities
        let omissions = vec![
            OmissionFinding {
                id: format!("omission-{}-0", &case_id[..8.min(case_id.len())]),
                omission_type: OmissionType::ExculpatoryOmission,
                severity: Severity::Critical,
                bias_direction: BiasDirection::ProsecutionFavoring,
                source: SourceReference {
                    document_id: "mock-source-1".to_string(),
                    document_name: "Police Investigation Report".to_string(),
                    text: "Investigation found no evidence of wrongdoing. Subject fully cooperated.".to_string(),
                    page_ref: Some(5),
                    date: Some("2023-04-03".to_string()),
                },
                report: ReportReference {
                    document_id: "mock-report-1".to_string(),
                    document_name: "Social Work Assessment".to_string(),
                    author: Some("Mock Author".to_string()),
                    date: Some("2023-06-15".to_string()),
                    substitute_text: Some("Subject was investigated by police.".to_string()),
                },
                omitted_content: "No evidence of wrongdoing. Subject fully cooperated.".to_string(),
                significance: "The exculpatory finding was completely removed, leaving only the fact of investigation.".to_string(),
                impact: "Creates false impression of guilt when police actually cleared the subject.".to_string(),
            },
            OmissionFinding {
                id: format!("omission-{}-1", &case_id[..8.min(case_id.len())]),
                omission_type: OmissionType::ContextStripping,
                severity: Severity::High,
                bias_direction: BiasDirection::ProsecutionFavoring,
                source: SourceReference {
                    document_id: "mock-source-2".to_string(),
                    document_name: "Meeting Transcript".to_string(),
                    text: "I really don't want to be in it. I've told you this before.".to_string(),
                    page_ref: Some(12),
                    date: Some("2023-11-18".to_string()),
                },
                report: ReportReference {
                    document_id: "mock-report-2".to_string(),
                    document_name: "Production Statement".to_string(),
                    author: Some("Mock Producer".to_string()),
                    date: Some("2023-11-27".to_string()),
                    substitute_text: Some("Subject engaged in discussions about the project.".to_string()),
                },
                omitted_content: "Explicit refusal of consent to participate.".to_string(),
                significance: "Removes evidence of consent withdrawal, presenting engagement as acceptance.".to_string(),
                impact: "Allows claim of consent when consent was explicitly refused.".to_string(),
            },
        ];

        let summary = OmissionSummary {
            total_omissions: 2,
            critical_count: 1,
            by_type: vec![
                TypeCount { omission_type: "exculpatory_omission".to_string(), count: 1 },
                TypeCount { omission_type: "context_stripping".to_string(), count: 1 },
            ],
            bias_analysis: BiasAnalysis {
                prosecution_favoring: 2,
                defense_favoring: 0,
                bias_score: 1.0,
                is_significant: true,
                assessment: "All omissions favor prosecution/claimant. Bias score of +1.0 indicates systematic one-directional omission pattern.".to_string(),
            },
        };

        Ok(OmissionAnalysisResult {
            omissions,
            summary,
            is_mock: true,
        })
    }
}

// Helper functions for parsing AI response strings

fn parse_omission_type(s: &str) -> OmissionType {
    match s.to_lowercase().as_str() {
        "selective_quoting" => OmissionType::SelectiveQuoting,
        "complete_exclusion" => OmissionType::CompleteExclusion,
        "context_stripping" => OmissionType::ContextStripping,
        "cherry_picking" => OmissionType::CherryPicking,
        "exculpatory_omission" => OmissionType::ExculpatoryOmission,
        "procedural_omission" => OmissionType::ProceduralOmission,
        "contradictory_omission" => OmissionType::ContradictoryOmission,
        _ => OmissionType::CompleteExclusion,
    }
}

fn parse_severity(s: &str) -> Severity {
    match s.to_lowercase().as_str() {
        "critical" => Severity::Critical,
        "high" => Severity::High,
        "medium" => Severity::Medium,
        "low" => Severity::Low,
        _ => Severity::Medium,
    }
}

fn parse_bias_direction(s: &str) -> BiasDirection {
    match s.to_lowercase().as_str() {
        "prosecution_favoring" => BiasDirection::ProsecutionFavoring,
        "defense_favoring" => BiasDirection::DefenseFavoring,
        "institution_favoring" => BiasDirection::InstitutionFavoring,
        "individual_favoring" => BiasDirection::IndividualFavoring,
        "neutral" => BiasDirection::Neutral,
        _ => BiasDirection::Neutral,
    }
}

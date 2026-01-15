//! DOCUMENTARY ANALYSIS ENGINE (Δ)
//!
//! "Broadcast vs Source Comparison"
//!
//! Analyzes how broadcast/published content differs from source materials,
//! identifying editorial choices, framing decisions, and material omissions.
//!
//! Core Question: How did the documentary present vs what actually happened?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Type of editorial choice made in broadcast
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EditorialChoiceType {
    /// Material completely excluded
    Omission,
    /// Material included but shortened
    Truncation,
    /// Context removed from quote
    DecontextualizaHtion,
    /// Order of events changed
    Resequencing,
    /// Added commentary or interpretation
    Commentary,
    /// Visual/audio emphasis added
    EmphasisAdded,
    /// Juxtaposition of unrelated items
    Juxtaposition,
    /// Selective use of footage
    SelectiveEditing,
}

impl EditorialChoiceType {
    pub fn as_str(&self) -> &'static str {
        match self {
            EditorialChoiceType::Omission => "omission",
            EditorialChoiceType::Truncation => "truncation",
            EditorialChoiceType::DecontextualizaHtion => "decontextualization",
            EditorialChoiceType::Resequencing => "resequencing",
            EditorialChoiceType::Commentary => "commentary",
            EditorialChoiceType::EmphasisAdded => "emphasis_added",
            EditorialChoiceType::Juxtaposition => "juxtaposition",
            EditorialChoiceType::SelectiveEditing => "selective_editing",
        }
    }
}

/// Direction of editorial bias
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EditorialDirection {
    ProsecutionFavoring,
    DefenseFavoring,
    SensationFavoring,
    NarrativeFavoring,
    Neutral,
}

/// Severity of editorial issue
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Severity {
    Critical,
    High,
    Medium,
    Low,
}

/// An editorial choice identified in broadcast
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EditorialChoice {
    pub id: String,
    pub choice_type: EditorialChoiceType,
    pub severity: Severity,
    pub direction: EditorialDirection,
    /// What the source material said/showed
    pub source_content: String,
    pub source_document_id: String,
    pub source_document_name: String,
    pub source_page_ref: Option<i32>,
    /// How it was presented in broadcast
    pub broadcast_content: Option<String>,
    pub broadcast_timestamp: Option<String>,
    /// Analysis of the impact
    pub description: String,
    pub impact: String,
    /// Regulatory relevance (Ofcom codes)
    pub ofcom_section: Option<String>,
    pub regulatory_relevance: Option<String>,
}

/// A source-to-broadcast mapping
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceMapping {
    pub id: String,
    /// Source document reference
    pub source_document_id: String,
    pub source_document_name: String,
    pub source_content: String,
    pub source_page_ref: Option<i32>,
    /// Broadcast usage
    pub used_in_broadcast: bool,
    pub broadcast_timestamp: Option<String>,
    pub broadcast_content: Option<String>,
    pub accuracy_assessment: String,
}

/// Analysis of broadcast balance
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceAnalysis {
    /// Screen time or coverage for each party
    pub party_coverage: Vec<PartyCoverage>,
    /// Overall balance score (-1 = fully prosecution, +1 = fully defense)
    pub balance_score: f64,
    /// Whether imbalance is statistically significant
    pub is_significant: bool,
    pub assessment: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PartyCoverage {
    pub party: String,
    pub screen_time_seconds: Option<i32>,
    pub word_count: i32,
    pub positive_mentions: i32,
    pub negative_mentions: i32,
    pub neutral_mentions: i32,
}

/// Summary of documentary analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentarySummary {
    pub total_editorial_choices: i32,
    pub critical_choices: i32,
    pub omissions_found: i32,
    pub decontextualizations_found: i32,
    pub sources_mapped: i32,
    pub sources_used: i32,
    pub sources_omitted: i32,
    pub balance_assessment: String,
    pub ofcom_sections_implicated: Vec<String>,
}

/// Complete result of documentary analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentaryResult {
    pub editorial_choices: Vec<EditorialChoice>,
    pub source_mappings: Vec<SourceMapping>,
    pub balance_analysis: BalanceAnalysis,
    pub summary: DocumentarySummary,
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

/// AI response structures
#[derive(Debug, Deserialize)]
struct AIDocumentaryResponse {
    editorial_choices: Vec<AIEditorialChoice>,
    source_mappings: Vec<AISourceMapping>,
    balance: AIBalance,
}

#[derive(Debug, Deserialize)]
struct AIEditorialChoice {
    choice_type: String,
    severity: String,
    direction: String,
    source_content: String,
    #[serde(rename = "sourceDocumentId")]
    source_document_id: String,
    #[serde(rename = "sourcePageRef")]
    source_page_ref: Option<i32>,
    broadcast_content: Option<String>,
    broadcast_timestamp: Option<String>,
    description: String,
    impact: String,
    ofcom_section: Option<String>,
    regulatory_relevance: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AISourceMapping {
    #[serde(rename = "sourceDocumentId")]
    source_document_id: String,
    source_content: String,
    #[serde(rename = "sourcePageRef")]
    source_page_ref: Option<i32>,
    used_in_broadcast: bool,
    broadcast_timestamp: Option<String>,
    broadcast_content: Option<String>,
    accuracy_assessment: String,
}

#[derive(Debug, Deserialize)]
struct AIBalance {
    party_coverage: Vec<AIPartyCoverage>,
    balance_score: f64,
    is_significant: bool,
    assessment: String,
}

#[derive(Debug, Deserialize)]
struct AIPartyCoverage {
    party: String,
    word_count: i32,
    positive_mentions: i32,
    negative_mentions: i32,
    neutral_mentions: i32,
}

/// The Documentary Analysis Engine
pub struct DocumentaryEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl DocumentaryEngine {
    pub fn new(pool: SqlitePool) -> Self {
        Self {
            pool,
            ai_client: None,
            mock_mode: false,
        }
    }

    pub fn with_ai_client(mut self, client: AIClient) -> Self {
        self.ai_client = Some(client);
        self
    }

    pub fn with_mock_mode(mut self, mock: bool) -> Self {
        self.mock_mode = mock;
        self
    }

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

    /// Analyze documentary content against sources
    pub async fn analyze_documentary(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<DocumentaryResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_analyze(case_id).await;
        }

        let ai_client = self.ai_client.as_ref().unwrap();

        // Separate broadcast/media from source documents
        let (broadcast_docs, source_docs): (Vec<_>, Vec<_>) = documents
            .iter()
            .partition(|d| d.doc_type == "media" || d.doc_type == "transcript");

        let formatted_broadcast = broadcast_docs
            .iter()
            .map(|d| {
                format!(
                    "=== BROADCAST: {} (ID: {}) ===\n{}",
                    d.name,
                    d.id,
                    &d.content[..d.content.len().min(30000)]
                )
            })
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let formatted_sources = source_docs
            .iter()
            .map(|d| {
                format!(
                    "=== SOURCE: {} (ID: {}, Type: {}) ===\n{}",
                    d.name,
                    d.id,
                    d.doc_type,
                    &d.content[..d.content.len().min(20000)]
                )
            })
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let prompt = format!(
            r#"Analyze how this BROADCAST/DOCUMENTARY presents information compared to SOURCE materials.

EDITORIAL CHOICE TYPES:
- omission: Material completely excluded
- truncation: Material shortened
- decontextualization: Context removed from quote
- resequencing: Order of events changed
- commentary: Added interpretation
- emphasis_added: Visual/audio emphasis
- juxtaposition: Unrelated items placed together
- selective_editing: Cherry-picked footage

SEVERITY: critical, high, medium, low

DIRECTION:
- prosecution_favoring: Makes subject look guilty
- defense_favoring: Makes subject look innocent
- sensation_favoring: Prioritizes drama over accuracy
- narrative_favoring: Supports predetermined story
- neutral

OFCOM BROADCASTING CODE SECTIONS:
- Section 5: Due impartiality
- Section 7: Privacy
- Section 8: Fairness

BROADCAST CONTENT:
{}

SOURCE MATERIALS:
{}

Respond in JSON:
{{
  "editorial_choices": [
    {{
      "choice_type": "omission|truncation|decontextualization|...",
      "severity": "critical|high|medium|low",
      "direction": "prosecution_favoring|...",
      "source_content": "what the source said",
      "sourceDocumentId": "doc-id",
      "sourcePageRef": number or null,
      "broadcast_content": "how broadcast presented it" or null,
      "broadcast_timestamp": "HH:MM:SS" or null,
      "description": "what happened",
      "impact": "effect on viewer understanding",
      "ofcom_section": "Section X" or null,
      "regulatory_relevance": "how this relates to code" or null
    }}
  ],
  "source_mappings": [
    {{
      "sourceDocumentId": "doc-id",
      "source_content": "key content from source",
      "sourcePageRef": number or null,
      "used_in_broadcast": true/false,
      "broadcast_timestamp": "HH:MM:SS" or null,
      "broadcast_content": "how it appeared" or null,
      "accuracy_assessment": "accurate|partial|misleading|omitted"
    }}
  ],
  "balance": {{
    "party_coverage": [
      {{
        "party": "party name",
        "word_count": number,
        "positive_mentions": number,
        "negative_mentions": number,
        "neutral_mentions": number
      }}
    ],
    "balance_score": -1 to +1 (negative = prosecution-favoring),
    "is_significant": true/false,
    "assessment": "overall balance assessment"
  }}
}}"#,
            formatted_broadcast, formatted_sources
        );

        let system = "You are a forensic media analyst specializing in comparing broadcast content \
            against source materials. You identify editorial choices, omissions, and framing decisions \
            that affect how viewers perceive events. You understand UK broadcasting regulations \
            (Ofcom Code) and can identify potential violations.";

        let response: AIDocumentaryResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert response
        let editorial_choices: Vec<EditorialChoice> = response
            .editorial_choices
            .into_iter()
            .enumerate()
            .map(|(idx, c)| {
                let doc_name = documents
                    .iter()
                    .find(|d| d.id == c.source_document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());
                EditorialChoice {
                    id: format!("ec-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    choice_type: parse_choice_type(&c.choice_type),
                    severity: parse_severity(&c.severity),
                    direction: parse_direction(&c.direction),
                    source_content: c.source_content,
                    source_document_id: c.source_document_id,
                    source_document_name: doc_name,
                    source_page_ref: c.source_page_ref,
                    broadcast_content: c.broadcast_content,
                    broadcast_timestamp: c.broadcast_timestamp,
                    description: c.description,
                    impact: c.impact,
                    ofcom_section: c.ofcom_section,
                    regulatory_relevance: c.regulatory_relevance,
                }
            })
            .collect();

        let source_mappings: Vec<SourceMapping> = response
            .source_mappings
            .into_iter()
            .enumerate()
            .map(|(idx, m)| {
                let doc_name = documents
                    .iter()
                    .find(|d| d.id == m.source_document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());
                SourceMapping {
                    id: format!("sm-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    source_document_id: m.source_document_id,
                    source_document_name: doc_name,
                    source_content: m.source_content,
                    source_page_ref: m.source_page_ref,
                    used_in_broadcast: m.used_in_broadcast,
                    broadcast_timestamp: m.broadcast_timestamp,
                    broadcast_content: m.broadcast_content,
                    accuracy_assessment: m.accuracy_assessment,
                }
            })
            .collect();

        let party_coverage: Vec<PartyCoverage> = response
            .balance
            .party_coverage
            .into_iter()
            .map(|p| PartyCoverage {
                party: p.party,
                screen_time_seconds: None,
                word_count: p.word_count,
                positive_mentions: p.positive_mentions,
                negative_mentions: p.negative_mentions,
                neutral_mentions: p.neutral_mentions,
            })
            .collect();

        let balance_analysis = BalanceAnalysis {
            party_coverage,
            balance_score: response.balance.balance_score,
            is_significant: response.balance.is_significant,
            assessment: response.balance.assessment,
        };

        // Build summary
        let ofcom_sections: Vec<String> = editorial_choices
            .iter()
            .filter_map(|c| c.ofcom_section.clone())
            .collect::<std::collections::HashSet<_>>()
            .into_iter()
            .collect();

        let omissions = editorial_choices
            .iter()
            .filter(|c| c.choice_type == EditorialChoiceType::Omission)
            .count() as i32;
        let decontextualizations = editorial_choices
            .iter()
            .filter(|c| c.choice_type == EditorialChoiceType::DecontextualizaHtion)
            .count() as i32;

        let sources_used = source_mappings.iter().filter(|m| m.used_in_broadcast).count() as i32;
        let sources_omitted = source_mappings.iter().filter(|m| !m.used_in_broadcast).count() as i32;

        let summary = DocumentarySummary {
            total_editorial_choices: editorial_choices.len() as i32,
            critical_choices: editorial_choices
                .iter()
                .filter(|c| c.severity == Severity::Critical)
                .count() as i32,
            omissions_found: omissions,
            decontextualizations_found: decontextualizations,
            sources_mapped: source_mappings.len() as i32,
            sources_used,
            sources_omitted,
            balance_assessment: balance_analysis.assessment.clone(),
            ofcom_sections_implicated: ofcom_sections,
        };

        // Store findings
        self.store_findings(case_id, &editorial_choices).await?;

        Ok(DocumentaryResult {
            editorial_choices,
            source_mappings,
            balance_analysis,
            summary,
            is_mock: false,
        })
    }

    async fn store_findings(
        &self,
        case_id: &str,
        choices: &[EditorialChoice],
    ) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for choice in choices.iter().filter(|c| {
            matches!(c.severity, Severity::Critical | Severity::High)
        }) {
            let id = Uuid::new_v4().to_string();
            let title = format!(
                "Editorial Choice: {}",
                choice.choice_type.as_str()
            );

            let evidence = serde_json::json!({
                "source_content": choice.source_content,
                "broadcast_content": choice.broadcast_content,
                "ofcom_section": choice.ofcom_section,
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'documentary', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&choice.description)
            .bind(match choice.severity {
                Severity::Critical => "critical",
                Severity::High => "high",
                Severity::Medium => "medium",
                Severity::Low => "low",
            })
            .bind(serde_json::json!([choice.source_document_id]).to_string())
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store finding: {}", e))?;
        }

        log::info!("Stored documentary findings for case {}", case_id);
        Ok(())
    }

    async fn mock_analyze(&self, case_id: &str) -> Result<DocumentaryResult, String> {
        log::warn!("Running documentary analysis in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let editorial_choices = vec![EditorialChoice {
            id: format!("ec-{}-0", &case_id[..8.min(case_id.len())]),
            choice_type: EditorialChoiceType::Omission,
            severity: Severity::Critical,
            direction: EditorialDirection::ProsecutionFavoring,
            source_content: "Police confirmed no evidence of conspiracy".to_string(),
            source_document_id: "mock-source-1".to_string(),
            source_document_name: "DI Butler Letter".to_string(),
            source_page_ref: Some(2),
            broadcast_content: None,
            broadcast_timestamp: None,
            description: "Complete omission of police exoneration".to_string(),
            impact: "Viewers unaware subjects were cleared".to_string(),
            ofcom_section: Some("Section 5".to_string()),
            regulatory_relevance: Some("Due impartiality requires material facts".to_string()),
        }];

        let source_mappings = vec![SourceMapping {
            id: format!("sm-{}-0", &case_id[..8.min(case_id.len())]),
            source_document_id: "mock-source-1".to_string(),
            source_document_name: "DI Butler Letter".to_string(),
            source_content: "NFA decision with full reasoning".to_string(),
            source_page_ref: Some(1),
            used_in_broadcast: false,
            broadcast_timestamp: None,
            broadcast_content: None,
            accuracy_assessment: "omitted".to_string(),
        }];

        let balance_analysis = BalanceAnalysis {
            party_coverage: vec![
                PartyCoverage {
                    party: "Prosecution narrative".to_string(),
                    screen_time_seconds: None,
                    word_count: 5000,
                    positive_mentions: 0,
                    negative_mentions: 25,
                    neutral_mentions: 5,
                },
                PartyCoverage {
                    party: "Defense perspective".to_string(),
                    screen_time_seconds: None,
                    word_count: 200,
                    positive_mentions: 0,
                    negative_mentions: 2,
                    neutral_mentions: 3,
                },
            ],
            balance_score: -0.9,
            is_significant: true,
            assessment: "Severe imbalance favoring prosecution narrative".to_string(),
        };

        let summary = DocumentarySummary {
            total_editorial_choices: 1,
            critical_choices: 1,
            omissions_found: 1,
            decontextualizations_found: 0,
            sources_mapped: 1,
            sources_used: 0,
            sources_omitted: 1,
            balance_assessment: "Severely imbalanced".to_string(),
            ofcom_sections_implicated: vec!["Section 5".to_string()],
        };

        Ok(DocumentaryResult {
            editorial_choices,
            source_mappings,
            balance_analysis,
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_choice_type(s: &str) -> EditorialChoiceType {
    match s.to_lowercase().as_str() {
        "omission" => EditorialChoiceType::Omission,
        "truncation" => EditorialChoiceType::Truncation,
        "decontextualization" => EditorialChoiceType::DecontextualizaHtion,
        "resequencing" => EditorialChoiceType::Resequencing,
        "commentary" => EditorialChoiceType::Commentary,
        "emphasis_added" => EditorialChoiceType::EmphasisAdded,
        "juxtaposition" => EditorialChoiceType::Juxtaposition,
        "selective_editing" => EditorialChoiceType::SelectiveEditing,
        _ => EditorialChoiceType::Omission,
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

fn parse_direction(s: &str) -> EditorialDirection {
    match s.to_lowercase().as_str() {
        "prosecution_favoring" => EditorialDirection::ProsecutionFavoring,
        "defense_favoring" => EditorialDirection::DefenseFavoring,
        "sensation_favoring" => EditorialDirection::SensationFavoring,
        "narrative_favoring" => EditorialDirection::NarrativeFavoring,
        "neutral" => EditorialDirection::Neutral,
        _ => EditorialDirection::Neutral,
    }
}

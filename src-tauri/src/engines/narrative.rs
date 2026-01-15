//! NARRATIVE EVOLUTION ENGINE (Μ)
//!
//! "Claim Mutation Tracking"
//!
//! Tracks how claims change as they propagate through institutional documents,
//! identifying amplification, attenuation, and unauthorized modifications.
//! Also detects coordination patterns between supposedly independent sources.
//!
//! Core Question: How did this claim change as it moved between documents?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Type of mutation observed in a claim
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MutationType {
    /// Claim strengthened beyond evidence
    Amplification,
    /// Claim weakened from original
    Attenuation,
    /// Certainty increased ("might" -> "did")
    CertaintyDrift,
    /// Attribution changed
    AttributionShift,
    /// Scope expanded beyond original
    ScopeExpansion,
    /// Scope contracted from original
    ScopeContraction,
    /// Context removed
    ContextStripping,
    /// New content added
    Addition,
    /// Content removed
    Deletion,
    /// Meaning inverted
    Inversion,
}

impl MutationType {
    pub fn as_str(&self) -> &'static str {
        match self {
            MutationType::Amplification => "amplification",
            MutationType::Attenuation => "attenuation",
            MutationType::CertaintyDrift => "certainty_drift",
            MutationType::AttributionShift => "attribution_shift",
            MutationType::ScopeExpansion => "scope_expansion",
            MutationType::ScopeContraction => "scope_contraction",
            MutationType::ContextStripping => "context_stripping",
            MutationType::Addition => "addition",
            MutationType::Deletion => "deletion",
            MutationType::Inversion => "inversion",
        }
    }
}

/// Type of coordination pattern detected
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CoordinationType {
    /// Identical or near-identical language
    SharedLanguage,
    /// Synchronized timing of statements
    SynchronizedTiming,
    /// Circular citation between sources
    CircularCitation,
    /// Pre-disclosure information flow
    PreDisclosureKnowledge,
    /// Unexplained consistency
    UnexplainedConsistency,
    /// Coordinated omissions
    CoordinatedOmissions,
}

impl CoordinationType {
    pub fn as_str(&self) -> &'static str {
        match self {
            CoordinationType::SharedLanguage => "shared_language",
            CoordinationType::SynchronizedTiming => "synchronized_timing",
            CoordinationType::CircularCitation => "circular_citation",
            CoordinationType::PreDisclosureKnowledge => "pre_disclosure_knowledge",
            CoordinationType::UnexplainedConsistency => "unexplained_consistency",
            CoordinationType::CoordinatedOmissions => "coordinated_omissions",
        }
    }
}

/// Severity level
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Severity {
    Critical,
    High,
    Medium,
    Low,
}

/// Direction of mutation effect
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MutationDirection {
    ProsecutionFavoring,
    DefenseFavoring,
    InstitutionFavoring,
    IndividualFavoring,
    Neutral,
}

/// A tracked claim showing its evolution
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaimEvolution {
    pub id: String,
    pub original_claim: String,
    pub original_document_id: String,
    pub original_document_name: String,
    pub original_date: Option<String>,
    pub original_author: Option<String>,
    /// Sequence of versions as claim propagated
    pub versions: Vec<ClaimVersion>,
    /// Net direction of mutations
    pub net_direction: MutationDirection,
    /// Total mutations tracked
    pub mutation_count: i32,
}

/// A single version of a claim
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaimVersion {
    pub document_id: String,
    pub document_name: String,
    pub date: Option<String>,
    pub author: Option<String>,
    pub text: String,
    pub mutation_from_previous: Option<MutationType>,
    pub mutation_description: Option<String>,
    pub page_ref: Option<i32>,
}

/// A detected claim mutation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaimMutation {
    pub id: String,
    pub claim_evolution_id: String,
    pub mutation_type: MutationType,
    pub severity: Severity,
    pub direction: MutationDirection,
    /// Text before mutation
    pub source_text: String,
    pub source_document_id: String,
    pub source_document_name: String,
    pub source_date: Option<String>,
    /// Text after mutation
    pub target_text: String,
    pub target_document_id: String,
    pub target_document_name: String,
    pub target_date: Option<String>,
    /// Analysis
    pub description: String,
    pub impact: String,
}

/// A detected coordination pattern
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CoordinationPattern {
    pub id: String,
    pub coordination_type: CoordinationType,
    pub severity: Severity,
    /// Documents involved
    pub document_ids: Vec<String>,
    pub document_names: Vec<String>,
    /// Evidence of coordination
    pub shared_content: Option<String>,
    pub timing_analysis: Option<String>,
    pub description: String,
    pub significance: String,
}

/// Summary of narrative analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NarrativeSummary {
    pub claims_tracked: i32,
    pub total_mutations: i32,
    pub amplifications: i32,
    pub attenuations: i32,
    pub certainty_drifts: i32,
    pub coordination_patterns: i32,
    pub prosecution_favoring_mutations: i32,
    pub defense_favoring_mutations: i32,
    pub most_mutated_claim: Option<String>,
}

/// Complete result of narrative analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NarrativeResult {
    pub claim_evolutions: Vec<ClaimEvolution>,
    pub mutations: Vec<ClaimMutation>,
    pub coordination_patterns: Vec<CoordinationPattern>,
    pub summary: NarrativeSummary,
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
struct AINarrativeResponse {
    claim_evolutions: Vec<AIClaimEvolution>,
    mutations: Vec<AIMutation>,
    coordination_patterns: Vec<AICoordination>,
}

#[derive(Debug, Deserialize)]
struct AIClaimEvolution {
    original_claim: String,
    #[serde(rename = "originalDocumentId")]
    original_document_id: String,
    original_date: Option<String>,
    original_author: Option<String>,
    versions: Vec<AIVersion>,
    net_direction: String,
}

#[derive(Debug, Deserialize)]
struct AIVersion {
    #[serde(rename = "documentId")]
    document_id: String,
    date: Option<String>,
    author: Option<String>,
    text: String,
    mutation_type: Option<String>,
    mutation_description: Option<String>,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
}

#[derive(Debug, Deserialize)]
struct AIMutation {
    mutation_type: String,
    severity: String,
    direction: String,
    source_text: String,
    #[serde(rename = "sourceDocumentId")]
    source_document_id: String,
    source_date: Option<String>,
    target_text: String,
    #[serde(rename = "targetDocumentId")]
    target_document_id: String,
    target_date: Option<String>,
    description: String,
    impact: String,
}

#[derive(Debug, Deserialize)]
struct AICoordination {
    coordination_type: String,
    severity: String,
    #[serde(rename = "documentIds")]
    document_ids: Vec<String>,
    shared_content: Option<String>,
    timing_analysis: Option<String>,
    description: String,
    significance: String,
}

/// The Narrative Evolution Engine
pub struct NarrativeEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl NarrativeEngine {
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

    /// Analyze narrative evolution and coordination
    pub async fn analyze_narrative(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<NarrativeResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_analyze(case_id).await;
        }

        let ai_client = self.ai_client.as_ref().unwrap();

        // Sort documents by date for temporal analysis
        let mut sorted_docs = documents.clone();
        sorted_docs.sort_by(|a, b| a.date.cmp(&b.date));

        let formatted_docs = sorted_docs
            .iter()
            .map(|d| {
                format!(
                    "=== DOCUMENT: {} (ID: {}, Date: {}, Type: {}) ===\n{}",
                    d.name,
                    d.id,
                    d.date.as_deref().unwrap_or("Unknown"),
                    d.doc_type,
                    &d.content[..d.content.len().min(25000)]
                )
            })
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let prompt = format!(
            r#"Analyze how CLAIMS EVOLVE as they propagate through these documents, and identify COORDINATION patterns.

MUTATION TYPES:
- amplification: Claim strengthened beyond evidence
- attenuation: Claim weakened from original
- certainty_drift: Certainty increased ("might" → "did")
- attribution_shift: Attribution changed
- scope_expansion: Scope expanded beyond original
- scope_contraction: Scope contracted
- context_stripping: Context removed
- addition: New content added
- deletion: Content removed
- inversion: Meaning inverted

COORDINATION TYPES:
- shared_language: Identical or near-identical wording
- synchronized_timing: Coordinated timing of statements
- circular_citation: Sources citing each other
- pre_disclosure_knowledge: Knowledge before official disclosure
- unexplained_consistency: Suspiciously consistent details
- coordinated_omissions: Same omissions across documents

DIRECTION: prosecution_favoring, defense_favoring, institution_favoring, individual_favoring, neutral
SEVERITY: critical, high, medium, low

DOCUMENTS (chronological order):
{}

Respond in JSON:
{{
  "claim_evolutions": [
    {{
      "original_claim": "the claim as first stated",
      "originalDocumentId": "doc-id",
      "original_date": "YYYY-MM-DD" or null,
      "original_author": "name" or null,
      "versions": [
        {{
          "documentId": "doc-id",
          "date": "YYYY-MM-DD" or null,
          "author": "name" or null,
          "text": "claim text in this document",
          "mutation_type": "amplification|..." or null,
          "mutation_description": "how it changed" or null,
          "pageRef": number or null
        }}
      ],
      "net_direction": "prosecution_favoring|..."
    }}
  ],
  "mutations": [
    {{
      "mutation_type": "amplification|...",
      "severity": "critical|high|medium|low",
      "direction": "prosecution_favoring|...",
      "source_text": "original text",
      "sourceDocumentId": "doc-id",
      "source_date": "YYYY-MM-DD" or null,
      "target_text": "mutated text",
      "targetDocumentId": "doc-id",
      "target_date": "YYYY-MM-DD" or null,
      "description": "what changed",
      "impact": "effect on narrative"
    }}
  ],
  "coordination_patterns": [
    {{
      "coordination_type": "shared_language|...",
      "severity": "critical|high|medium|low",
      "documentIds": ["doc-id-1", "doc-id-2"],
      "shared_content": "the shared text" or null,
      "timing_analysis": "timing observations" or null,
      "description": "evidence of coordination",
      "significance": "why this matters"
    }}
  ]
}}"#,
            formatted_docs
        );

        let system = "You are a forensic narrative analyst specializing in tracking how claims mutate \
            as they propagate through institutional documents. You identify unauthorized modifications, \
            certainty drift, and coordination patterns between supposedly independent sources. \
            You understand institutional dynamics and can detect hidden collaboration.";

        let response: AINarrativeResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert claim evolutions
        let claim_evolutions: Vec<ClaimEvolution> = response
            .claim_evolutions
            .into_iter()
            .enumerate()
            .map(|(idx, e)| {
                let doc_name = documents
                    .iter()
                    .find(|d| d.id == e.original_document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                let versions: Vec<ClaimVersion> = e
                    .versions
                    .into_iter()
                    .map(|v| {
                        let vdoc_name = documents
                            .iter()
                            .find(|d| d.id == v.document_id)
                            .map(|d| d.name.clone())
                            .unwrap_or_else(|| "Unknown".to_string());
                        ClaimVersion {
                            document_id: v.document_id,
                            document_name: vdoc_name,
                            date: v.date,
                            author: v.author,
                            text: v.text,
                            mutation_from_previous: v.mutation_type.as_ref().map(|t| parse_mutation_type(t)),
                            mutation_description: v.mutation_description,
                            page_ref: v.page_ref,
                        }
                    })
                    .collect();

                let mutation_count = versions
                    .iter()
                    .filter(|v| v.mutation_from_previous.is_some())
                    .count() as i32;

                ClaimEvolution {
                    id: format!("ce-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    original_claim: e.original_claim,
                    original_document_id: e.original_document_id,
                    original_document_name: doc_name,
                    original_date: e.original_date,
                    original_author: e.original_author,
                    versions,
                    net_direction: parse_direction(&e.net_direction),
                    mutation_count,
                }
            })
            .collect();

        // Convert mutations
        let mutations: Vec<ClaimMutation> = response
            .mutations
            .into_iter()
            .enumerate()
            .map(|(idx, m)| {
                let source_name = documents
                    .iter()
                    .find(|d| d.id == m.source_document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());
                let target_name = documents
                    .iter()
                    .find(|d| d.id == m.target_document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                ClaimMutation {
                    id: format!("cm-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    claim_evolution_id: String::new(), // Would need correlation
                    mutation_type: parse_mutation_type(&m.mutation_type),
                    severity: parse_severity(&m.severity),
                    direction: parse_direction(&m.direction),
                    source_text: m.source_text,
                    source_document_id: m.source_document_id,
                    source_document_name: source_name,
                    source_date: m.source_date,
                    target_text: m.target_text,
                    target_document_id: m.target_document_id,
                    target_document_name: target_name,
                    target_date: m.target_date,
                    description: m.description,
                    impact: m.impact,
                }
            })
            .collect();

        // Convert coordination patterns
        let coordination_patterns: Vec<CoordinationPattern> = response
            .coordination_patterns
            .into_iter()
            .enumerate()
            .map(|(idx, c)| {
                let doc_names: Vec<String> = c
                    .document_ids
                    .iter()
                    .map(|id| {
                        documents
                            .iter()
                            .find(|d| &d.id == id)
                            .map(|d| d.name.clone())
                            .unwrap_or_else(|| "Unknown".to_string())
                    })
                    .collect();

                CoordinationPattern {
                    id: format!("cp-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    coordination_type: parse_coordination_type(&c.coordination_type),
                    severity: parse_severity(&c.severity),
                    document_ids: c.document_ids,
                    document_names: doc_names,
                    shared_content: c.shared_content,
                    timing_analysis: c.timing_analysis,
                    description: c.description,
                    significance: c.significance,
                }
            })
            .collect();

        // Build summary
        let amplifications = mutations
            .iter()
            .filter(|m| m.mutation_type == MutationType::Amplification)
            .count() as i32;
        let attenuations = mutations
            .iter()
            .filter(|m| m.mutation_type == MutationType::Attenuation)
            .count() as i32;
        let certainty_drifts = mutations
            .iter()
            .filter(|m| m.mutation_type == MutationType::CertaintyDrift)
            .count() as i32;
        let prosecution_favoring = mutations
            .iter()
            .filter(|m| m.direction == MutationDirection::ProsecutionFavoring)
            .count() as i32;
        let defense_favoring = mutations
            .iter()
            .filter(|m| m.direction == MutationDirection::DefenseFavoring)
            .count() as i32;

        let most_mutated = claim_evolutions
            .iter()
            .max_by_key(|e| e.mutation_count)
            .map(|e| e.original_claim.clone());

        let summary = NarrativeSummary {
            claims_tracked: claim_evolutions.len() as i32,
            total_mutations: mutations.len() as i32,
            amplifications,
            attenuations,
            certainty_drifts,
            coordination_patterns: coordination_patterns.len() as i32,
            prosecution_favoring_mutations: prosecution_favoring,
            defense_favoring_mutations: defense_favoring,
            most_mutated_claim: most_mutated,
        };

        // Store findings
        self.store_findings(case_id, &mutations, &coordination_patterns)
            .await?;

        Ok(NarrativeResult {
            claim_evolutions,
            mutations,
            coordination_patterns,
            summary,
            is_mock: false,
        })
    }

    async fn store_findings(
        &self,
        case_id: &str,
        mutations: &[ClaimMutation],
        patterns: &[CoordinationPattern],
    ) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        // Store significant mutations
        for mutation in mutations
            .iter()
            .filter(|m| matches!(m.severity, Severity::Critical | Severity::High))
        {
            let id = Uuid::new_v4().to_string();
            let title = format!("Claim Mutation: {}", mutation.mutation_type.as_str());

            let evidence = serde_json::json!({
                "source_text": mutation.source_text,
                "target_text": mutation.target_text,
                "direction": format!("{:?}", mutation.direction),
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'narrative', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&mutation.description)
            .bind(match mutation.severity {
                Severity::Critical => "critical",
                Severity::High => "high",
                Severity::Medium => "medium",
                Severity::Low => "low",
            })
            .bind(
                serde_json::json!([mutation.source_document_id, mutation.target_document_id])
                    .to_string(),
            )
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store mutation finding: {}", e))?;
        }

        // Store coordination patterns
        for pattern in patterns
            .iter()
            .filter(|p| matches!(p.severity, Severity::Critical | Severity::High))
        {
            let id = Uuid::new_v4().to_string();
            let title = format!(
                "Coordination Pattern: {}",
                pattern.coordination_type.as_str()
            );

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'narrative', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&pattern.description)
            .bind(match pattern.severity {
                Severity::Critical => "critical",
                Severity::High => "high",
                Severity::Medium => "medium",
                Severity::Low => "low",
            })
            .bind(serde_json::to_string(&pattern.document_ids).unwrap_or_else(|_| "[]".to_string()))
            .bind(&pattern.significance)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store coordination finding: {}", e))?;
        }

        log::info!("Stored narrative findings for case {}", case_id);
        Ok(())
    }

    async fn mock_analyze(&self, case_id: &str) -> Result<NarrativeResult, String> {
        log::warn!("Running narrative analysis in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let claim_evolutions = vec![ClaimEvolution {
            id: format!("ce-{}-0", &case_id[..8.min(case_id.len())]),
            original_claim: "Police investigation ongoing".to_string(),
            original_document_id: "mock-doc-1".to_string(),
            original_document_name: "Initial Report".to_string(),
            original_date: Some("2023-01-15".to_string()),
            original_author: Some("DI Butler".to_string()),
            versions: vec![
                ClaimVersion {
                    document_id: "mock-doc-2".to_string(),
                    document_name: "Social Work Assessment".to_string(),
                    date: Some("2023-02-20".to_string()),
                    author: Some("Social Worker".to_string()),
                    text: "Police are actively investigating serious concerns".to_string(),
                    mutation_from_previous: Some(MutationType::Amplification),
                    mutation_description: Some(
                        "Added 'serious concerns' not in original".to_string(),
                    ),
                    page_ref: Some(5),
                },
            ],
            net_direction: MutationDirection::ProsecutionFavoring,
            mutation_count: 1,
        }];

        let mutations = vec![ClaimMutation {
            id: format!("cm-{}-0", &case_id[..8.min(case_id.len())]),
            claim_evolution_id: claim_evolutions[0].id.clone(),
            mutation_type: MutationType::Amplification,
            severity: Severity::High,
            direction: MutationDirection::ProsecutionFavoring,
            source_text: "Police investigation ongoing".to_string(),
            source_document_id: "mock-doc-1".to_string(),
            source_document_name: "Initial Report".to_string(),
            source_date: Some("2023-01-15".to_string()),
            target_text: "Police are actively investigating serious concerns".to_string(),
            target_document_id: "mock-doc-2".to_string(),
            target_document_name: "Social Work Assessment".to_string(),
            target_date: Some("2023-02-20".to_string()),
            description: "Amplified from neutral to negative framing".to_string(),
            impact: "Creates false impression of severity".to_string(),
        }];

        let summary = NarrativeSummary {
            claims_tracked: 1,
            total_mutations: 1,
            amplifications: 1,
            attenuations: 0,
            certainty_drifts: 0,
            coordination_patterns: 0,
            prosecution_favoring_mutations: 1,
            defense_favoring_mutations: 0,
            most_mutated_claim: Some("Police investigation ongoing".to_string()),
        };

        Ok(NarrativeResult {
            claim_evolutions,
            mutations,
            coordination_patterns: vec![],
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_mutation_type(s: &str) -> MutationType {
    match s.to_lowercase().as_str() {
        "amplification" => MutationType::Amplification,
        "attenuation" => MutationType::Attenuation,
        "certainty_drift" => MutationType::CertaintyDrift,
        "attribution_shift" => MutationType::AttributionShift,
        "scope_expansion" => MutationType::ScopeExpansion,
        "scope_contraction" => MutationType::ScopeContraction,
        "context_stripping" => MutationType::ContextStripping,
        "addition" => MutationType::Addition,
        "deletion" => MutationType::Deletion,
        "inversion" => MutationType::Inversion,
        _ => MutationType::Amplification,
    }
}

fn parse_coordination_type(s: &str) -> CoordinationType {
    match s.to_lowercase().as_str() {
        "shared_language" => CoordinationType::SharedLanguage,
        "synchronized_timing" => CoordinationType::SynchronizedTiming,
        "circular_citation" => CoordinationType::CircularCitation,
        "pre_disclosure_knowledge" => CoordinationType::PreDisclosureKnowledge,
        "unexplained_consistency" => CoordinationType::UnexplainedConsistency,
        "coordinated_omissions" => CoordinationType::CoordinatedOmissions,
        _ => CoordinationType::SharedLanguage,
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

fn parse_direction(s: &str) -> MutationDirection {
    match s.to_lowercase().as_str() {
        "prosecution_favoring" => MutationDirection::ProsecutionFavoring,
        "defense_favoring" => MutationDirection::DefenseFavoring,
        "institution_favoring" => MutationDirection::InstitutionFavoring,
        "individual_favoring" => MutationDirection::IndividualFavoring,
        "neutral" => MutationDirection::Neutral,
        _ => MutationDirection::Neutral,
    }
}

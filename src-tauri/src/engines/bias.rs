//! BIAS DETECTION ENGINE (Β)
//!
//! "Statistical Imbalance Analysis"
//!
//! Detects systematic bias in document framing, presentation, and coverage.
//! Calculates framing ratios and statistical significance of imbalances.
//!
//! Core Question: Is information being presented in a systematically biased way?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Type of bias detected
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BiasType {
    /// Unequal time/space given to different parties
    FramingImbalance,
    /// Consistently negative/positive language for one party
    ToneAsymmetry,
    /// Selective presentation of evidence
    SelectivePresentation,
    /// Questions/challenges directed primarily at one party
    InterrogationAsymmetry,
    /// One party's narrative given more prominence
    NarrativePrivilege,
    /// Expert opinions weighted toward one side
    ExpertImbalance,
    /// Emotive language used asymmetrically
    EmotiveAsymmetry,
    /// Headlines/leads favor one interpretation
    HeadlineBias,
}

impl BiasType {
    pub fn as_str(&self) -> &'static str {
        match self {
            BiasType::FramingImbalance => "framing_imbalance",
            BiasType::ToneAsymmetry => "tone_asymmetry",
            BiasType::SelectivePresentation => "selective_presentation",
            BiasType::InterrogationAsymmetry => "interrogation_asymmetry",
            BiasType::NarrativePrivilege => "narrative_privilege",
            BiasType::ExpertImbalance => "expert_imbalance",
            BiasType::EmotiveAsymmetry => "emotive_asymmetry",
            BiasType::HeadlineBias => "headline_bias",
        }
    }
}

/// Direction the bias favors
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BiasDirection {
    /// Favors prosecution/accuser/authority
    ProsecutionFavoring,
    /// Favors defense/accused/individual
    DefenseFavoring,
    /// Favors institutional narrative
    InstitutionFavoring,
    /// Favors individual against institution
    IndividualFavoring,
    /// Direction unclear
    Unclear,
}

impl BiasDirection {
    pub fn as_str(&self) -> &'static str {
        match self {
            BiasDirection::ProsecutionFavoring => "prosecution_favoring",
            BiasDirection::DefenseFavoring => "defense_favoring",
            BiasDirection::InstitutionFavoring => "institution_favoring",
            BiasDirection::IndividualFavoring => "individual_favoring",
            BiasDirection::Unclear => "unclear",
        }
    }
}

/// Severity of bias
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

/// A framing ratio measurement
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FramingRatio {
    pub metric: String,           // What was measured (e.g., "suspect framing vs cleared")
    pub party_a_label: String,    // Label for first party
    pub party_a_count: i32,       // Count for first party
    pub party_b_label: String,    // Label for second party
    pub party_b_count: i32,       // Count for second party
    pub ratio: f64,               // party_a / party_b (or infinity if party_b is 0)
    pub ratio_display: String,    // Human readable (e.g., "13.2:1")
    pub z_score: Option<f64>,     // Statistical z-score
    pub p_value: Option<f64>,     // Statistical significance
    pub is_significant: bool,     // p < 0.05
}

/// A detected bias instance
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiasFinding {
    pub id: String,
    pub bias_type: BiasType,
    pub severity: Severity,
    pub direction: BiasDirection,
    pub description: String,
    pub evidence: String,
    pub framing_ratio: Option<FramingRatio>,
    pub document_id: String,
    pub document_name: String,
    pub page_ref: Option<i32>,
    pub regulatory_relevance: Option<String>,
}

/// Statistical summary of bias analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiasStatistics {
    pub total_items_analyzed: i32,
    pub items_favoring_prosecution: i32,
    pub items_favoring_defense: i32,
    pub items_neutral: i32,
    pub overall_bias_score: f64,    // -1.0 (defense) to +1.0 (prosecution)
    pub is_statistically_significant: bool,
    pub dominant_bias_types: Vec<String>,
}

/// Summary of bias analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiasSummary {
    pub total_findings: i32,
    pub critical_findings: i32,
    pub primary_framing_ratio: Option<FramingRatio>,
    pub statistics: BiasStatistics,
    pub regulatory_assessment: String,
    pub ofcom_relevance: Option<String>,
}

/// Complete result of bias analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiasAnalysisResult {
    pub findings: Vec<BiasFinding>,
    pub framing_ratios: Vec<FramingRatio>,
    pub summary: BiasSummary,
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
struct AIBiasResponse {
    findings: Vec<AIBiasFinding>,
    #[serde(rename = "framingRatios")]
    framing_ratios: Vec<AIFramingRatio>,
    statistics: AIStatistics,
    #[serde(rename = "regulatoryAssessment")]
    regulatory_assessment: String,
    #[serde(rename = "ofcomRelevance")]
    ofcom_relevance: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIBiasFinding {
    #[serde(rename = "biasType")]
    bias_type: String,
    severity: String,
    direction: String,
    description: String,
    evidence: String,
    #[serde(rename = "framingRatio")]
    framing_ratio: Option<AIFramingRatio>,
    #[serde(rename = "documentId")]
    document_id: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
    #[serde(rename = "regulatoryRelevance")]
    regulatory_relevance: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
struct AIFramingRatio {
    metric: String,
    #[serde(rename = "partyALabel")]
    party_a_label: String,
    #[serde(rename = "partyACount")]
    party_a_count: i32,
    #[serde(rename = "partyBLabel")]
    party_b_label: String,
    #[serde(rename = "partyBCount")]
    party_b_count: i32,
    ratio: f64,
    #[serde(rename = "ratioDisplay")]
    ratio_display: String,
    #[serde(rename = "zScore")]
    z_score: Option<f64>,
    #[serde(rename = "pValue")]
    p_value: Option<f64>,
    #[serde(rename = "isSignificant")]
    is_significant: bool,
}

#[derive(Debug, Deserialize)]
struct AIStatistics {
    #[serde(rename = "totalItemsAnalyzed")]
    total_items_analyzed: i32,
    #[serde(rename = "itemsFavoringProsecution")]
    items_favoring_prosecution: i32,
    #[serde(rename = "itemsFavoringDefense")]
    items_favoring_defense: i32,
    #[serde(rename = "itemsNeutral")]
    items_neutral: i32,
    #[serde(rename = "overallBiasScore")]
    overall_bias_score: f64,
    #[serde(rename = "isStatisticallySignificant")]
    is_statistically_significant: bool,
    #[serde(rename = "dominantBiasTypes", default)]
    dominant_bias_types: Vec<String>,
}

/// The Bias Detection Engine
pub struct BiasEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl BiasEngine {
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

    /// Analyze documents for systematic bias
    pub async fn detect_bias(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<BiasAnalysisResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_detect_bias(&documents, case_id).await;
        }

        let ai_client = self.ai_client.as_ref().unwrap();

        let formatted_docs = documents
            .iter()
            .map(|d| {
                format!(
                    "=== DOCUMENT: {} (ID: {}, Type: {}) ===\n{}",
                    d.name,
                    d.id,
                    d.doc_type,
                    &d.content[..d.content.len().min(50000)]
                )
            })
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let prompt = format!(
            r#"Analyze these documents for SYSTEMATIC BIAS in presentation and framing.

BIAS TYPES TO DETECT:
1. FRAMING_IMBALANCE: Unequal coverage/time given to different parties
2. TONE_ASYMMETRY: Consistently different tone (sympathetic vs hostile) for different parties
3. SELECTIVE_PRESENTATION: Evidence cherry-picked to favor one narrative
4. INTERROGATION_ASYMMETRY: Challenges/questions directed primarily at one party
5. NARRATIVE_PRIVILEGE: One party's account presented as default/authoritative
6. EXPERT_IMBALANCE: Expert opinions weighted toward one interpretation
7. EMOTIVE_ASYMMETRY: Emotive language used more for one side
8. HEADLINE_BIAS: Headlines/leads favor one interpretation

For each document, QUANTIFY where possible:
- Count mentions framing subject as "suspect/accused" vs "cleared/innocent"
- Count time/words dedicated to each party's perspective
- Count challenges/questions directed at each party
- Calculate FRAMING RATIOS (e.g., 13.2:1 suspect vs cleared framing)

STATISTICAL ANALYSIS:
- For ratios, calculate z-score assuming fair coverage would be 1:1
- z = (observed - expected) / sqrt(variance)
- Report p-value and whether statistically significant (p < 0.05)

REGULATORY RELEVANCE:
- Ofcom Section 5: Due impartiality on matters of political controversy
- Ofcom Section 7: Privacy
- Ofcom Section 8: Fairness

DOCUMENTS TO ANALYZE:
{}

Respond in JSON:
{{
  "findings": [
    {{
      "biasType": "framing_imbalance|tone_asymmetry|selective_presentation|interrogation_asymmetry|narrative_privilege|expert_imbalance|emotive_asymmetry|headline_bias",
      "severity": "critical|high|medium|low",
      "direction": "prosecution_favoring|defense_favoring|institution_favoring|individual_favoring|unclear",
      "description": "description of the bias",
      "evidence": "specific quotes/examples",
      "framingRatio": {{
        "metric": "what was measured",
        "partyALabel": "suspect framing",
        "partyACount": 66,
        "partyBLabel": "cleared framing",
        "partyBCount": 5,
        "ratio": 13.2,
        "ratioDisplay": "13.2:1",
        "zScore": 4.67,
        "pValue": 0.00001,
        "isSignificant": true
      }} or null,
      "documentId": "doc-id",
      "pageRef": number or null,
      "regulatoryRelevance": "Ofcom Section X violation" or null
    }}
  ],
  "framingRatios": [
    {{
      "metric": "overall suspect vs cleared framing",
      "partyALabel": "suspect framing",
      "partyACount": 66,
      "partyBLabel": "cleared framing",
      "partyBCount": 5,
      "ratio": 13.2,
      "ratioDisplay": "13.2:1",
      "zScore": 4.67,
      "pValue": 0.00001,
      "isSignificant": true
    }}
  ],
  "statistics": {{
    "totalItemsAnalyzed": number,
    "itemsFavoringProsecution": number,
    "itemsFavoringDefense": number,
    "itemsNeutral": number,
    "overallBiasScore": -1.0 to +1.0,
    "isStatisticallySignificant": boolean,
    "dominantBiasTypes": ["most common bias types"]
  }},
  "regulatoryAssessment": "overall assessment of regulatory violations",
  "ofcomRelevance": "specific Ofcom sections violated" or null
}}"#,
            formatted_docs
        );

        let system = "You are a forensic media analyst specializing in detecting bias and imbalance in news coverage and documentary programming. \
            You quantify bias using statistical methods and assess regulatory compliance against broadcasting codes. \
            You are particularly skilled at calculating framing ratios and determining statistical significance of imbalances.";

        let response: AIBiasResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert response
        let findings = response
            .findings
            .into_iter()
            .enumerate()
            .map(|(idx, f)| {
                let doc_name = documents
                    .iter()
                    .find(|d| d.id == f.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                BiasFinding {
                    id: format!("bias-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    bias_type: parse_bias_type(&f.bias_type),
                    severity: parse_severity(&f.severity),
                    direction: parse_direction(&f.direction),
                    description: f.description,
                    evidence: f.evidence,
                    framing_ratio: f.framing_ratio.map(convert_ratio),
                    document_id: f.document_id,
                    document_name: doc_name,
                    page_ref: f.page_ref,
                    regulatory_relevance: f.regulatory_relevance,
                }
            })
            .collect::<Vec<_>>();

        let framing_ratios = response
            .framing_ratios
            .into_iter()
            .map(convert_ratio)
            .collect::<Vec<_>>();

        let summary = BiasSummary {
            total_findings: findings.len() as i32,
            critical_findings: findings.iter().filter(|f| f.severity == Severity::Critical).count() as i32,
            primary_framing_ratio: framing_ratios.first().cloned(),
            statistics: BiasStatistics {
                total_items_analyzed: response.statistics.total_items_analyzed,
                items_favoring_prosecution: response.statistics.items_favoring_prosecution,
                items_favoring_defense: response.statistics.items_favoring_defense,
                items_neutral: response.statistics.items_neutral,
                overall_bias_score: response.statistics.overall_bias_score,
                is_statistically_significant: response.statistics.is_statistically_significant,
                dominant_bias_types: response.statistics.dominant_bias_types,
            },
            regulatory_assessment: response.regulatory_assessment,
            ofcom_relevance: response.ofcom_relevance,
        };

        // Store findings
        self.store_findings(case_id, &findings).await?;

        Ok(BiasAnalysisResult {
            findings,
            framing_ratios,
            summary,
            is_mock: false,
        })
    }

    async fn store_findings(&self, case_id: &str, findings: &[BiasFinding]) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for f in findings {
            let id = Uuid::new_v4().to_string();
            let title = format!(
                "Bias: {} - {}",
                f.bias_type.as_str(),
                f.framing_ratio.as_ref().map(|r| r.ratio_display.as_str()).unwrap_or("detected")
            );

            let evidence = serde_json::json!({
                "bias_type": f.bias_type.as_str(),
                "direction": f.direction.as_str(),
                "evidence_text": f.evidence,
                "framing_ratio": f.framing_ratio,
                "regulatory_relevance": f.regulatory_relevance,
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'bias_detection', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&f.description)
            .bind(f.severity.as_str())
            .bind(serde_json::json!([f.document_id]).to_string())
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store bias finding: {}", e))?;
        }

        log::info!("Stored {} bias findings for case {}", findings.len(), case_id);
        Ok(())
    }

    async fn mock_detect_bias(
        &self,
        _documents: &[DocumentInfo],
        case_id: &str,
    ) -> Result<BiasAnalysisResult, String> {
        log::warn!("Running bias detection in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let primary_ratio = FramingRatio {
            metric: "Suspect vs Cleared framing".to_string(),
            party_a_label: "Suspect/accused framing".to_string(),
            party_a_count: 66,
            party_b_label: "Cleared/innocent framing".to_string(),
            party_b_count: 5,
            ratio: 13.2,
            ratio_display: "13.2:1".to_string(),
            z_score: Some(4.67),
            p_value: Some(0.00001),
            is_significant: true,
        };

        let findings = vec![
            BiasFinding {
                id: format!("bias-{}-0", &case_id[..8.min(case_id.len())]),
                bias_type: BiasType::FramingImbalance,
                severity: Severity::Critical,
                direction: BiasDirection::ProsecutionFavoring,
                description: "Documentary frames subjects as suspects 13.2x more often than acknowledging they were cleared".to_string(),
                evidence: "66 instances of suspect framing vs 5 instances acknowledging cleared status (NFA decisions)".to_string(),
                framing_ratio: Some(primary_ratio.clone()),
                document_id: "mock-doc-1".to_string(),
                document_name: "Documentary Transcript".to_string(),
                page_ref: None,
                regulatory_relevance: Some("Ofcom Section 5.1: Due impartiality not maintained".to_string()),
            },
            BiasFinding {
                id: format!("bias-{}-1", &case_id[..8.min(case_id.len())]),
                bias_type: BiasType::SelectivePresentation,
                severity: Severity::Critical,
                direction: BiasDirection::ProsecutionFavoring,
                description: "8 material omissions identified, all favoring prosecution narrative".to_string(),
                evidence: "DI Butler's 'effectively innocent' finding omitted. CCTV showing subjects sleeping omitted.".to_string(),
                framing_ratio: None,
                document_id: "mock-doc-1".to_string(),
                document_name: "Documentary Transcript".to_string(),
                page_ref: None,
                regulatory_relevance: Some("Ofcom Section 8: Fairness - material facts omitted".to_string()),
            },
        ];

        let summary = BiasSummary {
            total_findings: 2,
            critical_findings: 2,
            primary_framing_ratio: Some(primary_ratio.clone()),
            statistics: BiasStatistics {
                total_items_analyzed: 71,
                items_favoring_prosecution: 66,
                items_favoring_defense: 5,
                items_neutral: 0,
                overall_bias_score: 0.93,
                is_statistically_significant: true,
                dominant_bias_types: vec!["framing_imbalance".to_string(), "selective_presentation".to_string()],
            },
            regulatory_assessment: "Severe bias detected. Framing ratio of 13.2:1 (z=4.67, p<0.00001) demonstrates systematic imbalance violating due impartiality requirements.".to_string(),
            ofcom_relevance: Some("Sections 5.1 (due impartiality), 7.1 (privacy), 8.1 (fairness)".to_string()),
        };

        Ok(BiasAnalysisResult {
            findings,
            framing_ratios: vec![primary_ratio],
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn convert_ratio(r: AIFramingRatio) -> FramingRatio {
    FramingRatio {
        metric: r.metric,
        party_a_label: r.party_a_label,
        party_a_count: r.party_a_count,
        party_b_label: r.party_b_label,
        party_b_count: r.party_b_count,
        ratio: r.ratio,
        ratio_display: r.ratio_display,
        z_score: r.z_score,
        p_value: r.p_value,
        is_significant: r.is_significant,
    }
}

fn parse_bias_type(s: &str) -> BiasType {
    match s.to_lowercase().as_str() {
        "framing_imbalance" => BiasType::FramingImbalance,
        "tone_asymmetry" => BiasType::ToneAsymmetry,
        "selective_presentation" => BiasType::SelectivePresentation,
        "interrogation_asymmetry" => BiasType::InterrogationAsymmetry,
        "narrative_privilege" => BiasType::NarrativePrivilege,
        "expert_imbalance" => BiasType::ExpertImbalance,
        "emotive_asymmetry" => BiasType::EmotiveAsymmetry,
        "headline_bias" => BiasType::HeadlineBias,
        _ => BiasType::FramingImbalance,
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

fn parse_direction(s: &str) -> BiasDirection {
    match s.to_lowercase().as_str() {
        "prosecution_favoring" => BiasDirection::ProsecutionFavoring,
        "defense_favoring" => BiasDirection::DefenseFavoring,
        "institution_favoring" => BiasDirection::InstitutionFavoring,
        "individual_favoring" => BiasDirection::IndividualFavoring,
        _ => BiasDirection::Unclear,
    }
}

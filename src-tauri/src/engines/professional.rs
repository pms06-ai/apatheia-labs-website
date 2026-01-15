//! PROFESSIONAL TRACKER ENGINE (Π)
//!
//! "Per-Professional Behavior Pattern Analysis"
//!
//! Tracks patterns of professional conduct across documents,
//! identifying consistency issues and regulatory concerns.
//!
//! Core Question: How does this professional behave across cases and documents?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Type of professional
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ProfessionalType {
    SocialWorker,
    Psychologist,
    Psychiatrist,
    CAFCASS,
    Guardian,
    Solicitor,
    Barrister,
    Judge,
    PoliceOfficer,
    Doctor,
    Nurse,
    Teacher,
    Other,
}

impl ProfessionalType {
    pub fn as_str(&self) -> &'static str {
        match self {
            ProfessionalType::SocialWorker => "social_worker",
            ProfessionalType::Psychologist => "psychologist",
            ProfessionalType::Psychiatrist => "psychiatrist",
            ProfessionalType::CAFCASS => "cafcass",
            ProfessionalType::Guardian => "guardian",
            ProfessionalType::Solicitor => "solicitor",
            ProfessionalType::Barrister => "barrister",
            ProfessionalType::Judge => "judge",
            ProfessionalType::PoliceOfficer => "police_officer",
            ProfessionalType::Doctor => "doctor",
            ProfessionalType::Nurse => "nurse",
            ProfessionalType::Teacher => "teacher",
            ProfessionalType::Other => "other",
        }
    }
}

/// Regulatory body
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RegulatoryBody {
    HCPC,
    GMC,
    NMC,
    SRA,
    BSB,
    BPS,
    SWE,
    OFSTED,
    Other,
}

impl RegulatoryBody {
    pub fn as_str(&self) -> &'static str {
        match self {
            RegulatoryBody::HCPC => "hcpc",
            RegulatoryBody::GMC => "gmc",
            RegulatoryBody::NMC => "nmc",
            RegulatoryBody::SRA => "sra",
            RegulatoryBody::BSB => "bsb",
            RegulatoryBody::BPS => "bps",
            RegulatoryBody::SWE => "swe",
            RegulatoryBody::OFSTED => "ofsted",
            RegulatoryBody::Other => "other",
        }
    }
}

/// Severity of concern
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

/// Type of conduct concern
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ConcernType {
    /// Failed to verify information
    VerificationFailure,
    /// Inconsistent statements
    Inconsistency,
    /// Bias in analysis
    Bias,
    /// Missed deadline
    Timeliness,
    /// Exceeded scope
    ScopeExceeded,
    /// Methodology issue
    Methodology,
    /// Documentation failure
    Documentation,
    /// Breach of code
    CodeBreach,
    /// Conflict of interest
    ConflictOfInterest,
    /// Communication failure
    Communication,
    /// Other
    Other,
}

impl ConcernType {
    pub fn as_str(&self) -> &'static str {
        match self {
            ConcernType::VerificationFailure => "verification_failure",
            ConcernType::Inconsistency => "inconsistency",
            ConcernType::Bias => "bias",
            ConcernType::Timeliness => "timeliness",
            ConcernType::ScopeExceeded => "scope_exceeded",
            ConcernType::Methodology => "methodology",
            ConcernType::Documentation => "documentation",
            ConcernType::CodeBreach => "code_breach",
            ConcernType::ConflictOfInterest => "conflict_of_interest",
            ConcernType::Communication => "communication",
            ConcernType::Other => "other",
        }
    }
}

/// A tracked professional
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrackedProfessional {
    pub id: String,
    pub name: String,
    pub professional_type: ProfessionalType,
    pub regulatory_body: Option<RegulatoryBody>,
    pub registration_number: Option<String>,
    pub role_in_case: String,
    pub documents_authored: Vec<String>,
    pub documents_referenced: Vec<String>,
    pub first_appearance: Option<String>,
    pub concerns: Vec<ConductConcern>,
    pub behavioral_patterns: Vec<BehavioralPattern>,
}

/// A conduct concern
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConductConcern {
    pub id: String,
    pub concern_type: ConcernType,
    pub severity: Severity,
    pub description: String,
    pub evidence: String,
    pub document_id: String,
    pub document_name: String,
    pub page_ref: Option<i32>,
    pub relevant_code: Option<String>,  // e.g., "HCPC Standard 3.1"
    pub regulatory_relevance: Option<String>,
}

/// A behavioral pattern across documents
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BehavioralPattern {
    pub id: String,
    pub pattern_type: String,
    pub description: String,
    pub frequency: i32,
    pub examples: Vec<String>,
    pub significance: String,
}

/// Summary of professional tracking
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProfessionalSummary {
    pub professionals_tracked: i32,
    pub total_concerns: i32,
    pub critical_concerns: i32,
    pub professionals_with_concerns: Vec<String>,
    pub most_common_concern: Option<String>,
    pub regulatory_bodies_involved: Vec<String>,
}

/// Complete result of professional tracking
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProfessionalTrackerResult {
    pub professionals: Vec<TrackedProfessional>,
    pub summary: ProfessionalSummary,
    pub is_mock: bool,
}

/// Document info
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
struct AIProfessionalResponse {
    professionals: Vec<AIProfessional>,
}

#[derive(Debug, Deserialize)]
struct AIProfessional {
    name: String,
    #[serde(rename = "professionalType")]
    professional_type: String,
    #[serde(rename = "regulatoryBody")]
    regulatory_body: Option<String>,
    #[serde(rename = "registrationNumber")]
    registration_number: Option<String>,
    #[serde(rename = "roleInCase")]
    role_in_case: String,
    #[serde(rename = "documentsAuthored")]
    documents_authored: Vec<String>,
    #[serde(rename = "documentsReferenced")]
    documents_referenced: Vec<String>,
    #[serde(rename = "firstAppearance")]
    first_appearance: Option<String>,
    concerns: Vec<AIConcern>,
    #[serde(rename = "behavioralPatterns")]
    behavioral_patterns: Vec<AIPattern>,
}

#[derive(Debug, Deserialize)]
struct AIConcern {
    #[serde(rename = "concernType")]
    concern_type: String,
    severity: String,
    description: String,
    evidence: String,
    #[serde(rename = "documentId")]
    document_id: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
    #[serde(rename = "relevantCode")]
    relevant_code: Option<String>,
    #[serde(rename = "regulatoryRelevance")]
    regulatory_relevance: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIPattern {
    #[serde(rename = "patternType")]
    pattern_type: String,
    description: String,
    frequency: i32,
    examples: Vec<String>,
    significance: String,
}

/// The Professional Tracker Engine
pub struct ProfessionalEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl ProfessionalEngine {
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

    /// Track professionals across documents
    pub async fn track_professionals(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<ProfessionalTrackerResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_track(&documents, case_id).await;
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
                    &d.content[..d.content.len().min(40000)]
                )
            })
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let prompt = format!(
            r#"Analyze these documents to TRACK PROFESSIONALS and their conduct patterns.

PROFESSIONAL TYPES:
- social_worker, psychologist, psychiatrist, cafcass, guardian
- solicitor, barrister, judge
- police_officer, doctor, nurse, teacher
- other

REGULATORY BODIES:
- hcpc (Health and Care Professions Council)
- gmc (General Medical Council)
- nmc (Nursing and Midwifery Council)
- sra (Solicitors Regulation Authority)
- bsb (Bar Standards Board)
- bps (British Psychological Society)
- swe (Social Work England)
- ofsted (Office for Standards in Education)

CONDUCT CONCERN TYPES:
- verification_failure: Failed to verify information before acting
- inconsistency: Made inconsistent statements across documents
- bias: Showed bias in analysis or recommendations
- timeliness: Missed deadlines or caused delays
- scope_exceeded: Exceeded professional scope/remit
- methodology: Used flawed or inappropriate methodology
- documentation: Failed to properly document
- code_breach: Breached professional code of conduct
- conflict_of_interest: Had undisclosed conflict
- communication: Failed in professional communication

For EACH professional:
1. Identify their role and regulatory body
2. Track which documents they authored vs referenced
3. Identify conduct concerns with specific evidence
4. Note behavioral patterns across documents

DOCUMENTS TO ANALYZE:
{}

Respond in JSON:
{{
  "professionals": [
    {{
      "name": "Full name",
      "professionalType": "social_worker|psychologist|...",
      "regulatoryBody": "hcpc|gmc|..." or null,
      "registrationNumber": "if known" or null,
      "roleInCase": "their specific role",
      "documentsAuthored": ["doc-id-1"],
      "documentsReferenced": ["doc-id-2"],
      "firstAppearance": "date" or null,
      "concerns": [
        {{
          "concernType": "verification_failure|inconsistency|...",
          "severity": "critical|high|medium|low",
          "description": "what the concern is",
          "evidence": "specific evidence",
          "documentId": "doc-id",
          "pageRef": number or null,
          "relevantCode": "HCPC Standard X" or null,
          "regulatoryRelevance": "complaint potential" or null
        }}
      ],
      "behavioralPatterns": [
        {{
          "patternType": "e.g., always accepts allegations without verification",
          "description": "description",
          "frequency": 3,
          "examples": ["example 1", "example 2"],
          "significance": "why this matters"
        }}
      ]
    }}
  ]
}}"#,
            formatted_docs
        );

        let system = "You are a forensic analyst specializing in professional conduct and regulatory compliance. \
            You track how professionals behave across legal proceedings, identifying conduct concerns \
            and behavioral patterns that may warrant regulatory attention. You are familiar with \
            professional codes of conduct for social workers, psychologists, and other regulated professions.";

        let response: AIProfessionalResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert response
        let professionals: Vec<TrackedProfessional> = response.professionals
            .into_iter()
            .enumerate()
            .map(|(idx, p)| {
                TrackedProfessional {
                    id: format!("prof-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    name: p.name,
                    professional_type: parse_professional_type(&p.professional_type),
                    regulatory_body: p.regulatory_body.as_ref().map(|s| parse_regulatory_body(s)),
                    registration_number: p.registration_number,
                    role_in_case: p.role_in_case,
                    documents_authored: p.documents_authored,
                    documents_referenced: p.documents_referenced,
                    first_appearance: p.first_appearance,
                    concerns: p.concerns.into_iter().enumerate().map(|(c_idx, c)| {
                        let doc_name = documents.iter()
                            .find(|d| d.id == c.document_id)
                            .map(|d| d.name.clone())
                            .unwrap_or_else(|| "Unknown".to_string());
                        ConductConcern {
                            id: format!("concern-{}-{}-{}", &case_id[..8.min(case_id.len())], idx, c_idx),
                            concern_type: parse_concern_type(&c.concern_type),
                            severity: parse_severity(&c.severity),
                            description: c.description,
                            evidence: c.evidence,
                            document_id: c.document_id,
                            document_name: doc_name,
                            page_ref: c.page_ref,
                            relevant_code: c.relevant_code,
                            regulatory_relevance: c.regulatory_relevance,
                        }
                    }).collect(),
                    behavioral_patterns: p.behavioral_patterns.into_iter().enumerate().map(|(p_idx, pat)| {
                        BehavioralPattern {
                            id: format!("pattern-{}-{}-{}", &case_id[..8.min(case_id.len())], idx, p_idx),
                            pattern_type: pat.pattern_type,
                            description: pat.description,
                            frequency: pat.frequency,
                            examples: pat.examples,
                            significance: pat.significance,
                        }
                    }).collect(),
                }
            })
            .collect();

        // Calculate summary
        let all_concerns: Vec<&ConductConcern> = professionals.iter()
            .flat_map(|p| &p.concerns)
            .collect();

        let concern_type_counts = all_concerns.iter()
            .fold(std::collections::HashMap::new(), |mut acc, c| {
                *acc.entry(c.concern_type.as_str()).or_insert(0) += 1;
                acc
            });

        let most_common = concern_type_counts.into_iter()
            .max_by_key(|(_, count)| *count)
            .map(|(t, _)| t.to_string());

        let reg_bodies: Vec<String> = professionals.iter()
            .filter_map(|p| p.regulatory_body.as_ref())
            .map(|r| r.as_str().to_uppercase())
            .collect::<std::collections::HashSet<_>>()
            .into_iter()
            .collect();

        let professionals_with_concerns: Vec<String> = professionals.iter()
            .filter(|p| !p.concerns.is_empty())
            .map(|p| p.name.clone())
            .collect();

        let summary = ProfessionalSummary {
            professionals_tracked: professionals.len() as i32,
            total_concerns: all_concerns.len() as i32,
            critical_concerns: all_concerns.iter().filter(|c| c.severity == Severity::Critical).count() as i32,
            professionals_with_concerns,
            most_common_concern: most_common,
            regulatory_bodies_involved: reg_bodies,
        };

        // Store findings
        self.store_findings(case_id, &professionals).await?;

        Ok(ProfessionalTrackerResult {
            professionals,
            summary,
            is_mock: false,
        })
    }

    async fn store_findings(&self, case_id: &str, professionals: &[TrackedProfessional]) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for prof in professionals {
            for concern in &prof.concerns {
                let id = Uuid::new_v4().to_string();
                let title = format!("Professional Concern: {} - {}", prof.name, concern.concern_type.as_str());

                let evidence = serde_json::json!({
                    "professional_name": prof.name,
                    "professional_type": prof.professional_type.as_str(),
                    "regulatory_body": prof.regulatory_body.as_ref().map(|r| r.as_str()),
                    "concern_type": concern.concern_type.as_str(),
                    "evidence_text": concern.evidence,
                    "relevant_code": concern.relevant_code,
                    "regulatory_relevance": concern.regulatory_relevance,
                })
                .to_string();

                sqlx::query(
                    r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                       VALUES (?, ?, 'professional_tracker', ?, ?, ?, ?, ?, ?)"#,
                )
                .bind(&id)
                .bind(case_id)
                .bind(&title)
                .bind(&concern.description)
                .bind(concern.severity.as_str())
                .bind(serde_json::json!([concern.document_id]).to_string())
                .bind(&evidence)
                .bind(&now)
                .execute(&self.pool)
                .await
                .map_err(|e| format!("Failed to store professional concern: {}", e))?;
            }
        }

        let total_concerns: usize = professionals.iter().map(|p| p.concerns.len()).sum();
        log::info!("Stored {} professional concerns for case {}", total_concerns, case_id);
        Ok(())
    }

    async fn mock_track(
        &self,
        _documents: &[DocumentInfo],
        case_id: &str,
    ) -> Result<ProfessionalTrackerResult, String> {
        log::warn!("Running professional tracker in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let professionals = vec![
            TrackedProfessional {
                id: format!("prof-{}-0", &case_id[..8.min(case_id.len())]),
                name: "Emma Hunnisett".to_string(),
                professional_type: ProfessionalType::SocialWorker,
                regulatory_body: Some(RegulatoryBody::HCPC),
                registration_number: None,
                role_in_case: "Assessment Author".to_string(),
                documents_authored: vec!["mock-doc-1".to_string()],
                documents_referenced: vec!["mock-doc-2".to_string()],
                first_appearance: Some("2023-06-01".to_string()),
                concerns: vec![
                    ConductConcern {
                        id: format!("concern-{}-0-0", &case_id[..8.min(case_id.len())]),
                        concern_type: ConcernType::VerificationFailure,
                        severity: Severity::High,
                        description: "Accepted allegations without verifying against available evidence".to_string(),
                        evidence: "Assessment repeats guardian claims without cross-referencing contact records".to_string(),
                        document_id: "mock-doc-1".to_string(),
                        document_name: "Social Work Assessment".to_string(),
                        page_ref: Some(12),
                        relevant_code: Some("HCPC Standard 3.1 - Verify information".to_string()),
                        regulatory_relevance: Some("Potential HCPC complaint".to_string()),
                    },
                ],
                behavioral_patterns: vec![
                    BehavioralPattern {
                        id: format!("pattern-{}-0-0", &case_id[..8.min(case_id.len())]),
                        pattern_type: "Single-source reliance".to_string(),
                        description: "Consistently relies on guardian's account without independent verification".to_string(),
                        frequency: 5,
                        examples: vec![
                            "Para 23: Accepts contact difficulties at face value".to_string(),
                            "Para 31: No cross-reference to contact logs".to_string(),
                        ],
                        significance: "Pattern suggests verification duties not discharged".to_string(),
                    },
                ],
            },
        ];

        let summary = ProfessionalSummary {
            professionals_tracked: 1,
            total_concerns: 1,
            critical_concerns: 0,
            professionals_with_concerns: vec!["Emma Hunnisett".to_string()],
            most_common_concern: Some("verification_failure".to_string()),
            regulatory_bodies_involved: vec!["HCPC".to_string()],
        };

        Ok(ProfessionalTrackerResult {
            professionals,
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_professional_type(s: &str) -> ProfessionalType {
    match s.to_lowercase().as_str() {
        "social_worker" => ProfessionalType::SocialWorker,
        "psychologist" => ProfessionalType::Psychologist,
        "psychiatrist" => ProfessionalType::Psychiatrist,
        "cafcass" => ProfessionalType::CAFCASS,
        "guardian" => ProfessionalType::Guardian,
        "solicitor" => ProfessionalType::Solicitor,
        "barrister" => ProfessionalType::Barrister,
        "judge" => ProfessionalType::Judge,
        "police_officer" => ProfessionalType::PoliceOfficer,
        "doctor" => ProfessionalType::Doctor,
        "nurse" => ProfessionalType::Nurse,
        "teacher" => ProfessionalType::Teacher,
        _ => ProfessionalType::Other,
    }
}

fn parse_regulatory_body(s: &str) -> RegulatoryBody {
    match s.to_lowercase().as_str() {
        "hcpc" => RegulatoryBody::HCPC,
        "gmc" => RegulatoryBody::GMC,
        "nmc" => RegulatoryBody::NMC,
        "sra" => RegulatoryBody::SRA,
        "bsb" => RegulatoryBody::BSB,
        "bps" => RegulatoryBody::BPS,
        "swe" => RegulatoryBody::SWE,
        "ofsted" => RegulatoryBody::OFSTED,
        _ => RegulatoryBody::Other,
    }
}

fn parse_concern_type(s: &str) -> ConcernType {
    match s.to_lowercase().as_str() {
        "verification_failure" => ConcernType::VerificationFailure,
        "inconsistency" => ConcernType::Inconsistency,
        "bias" => ConcernType::Bias,
        "timeliness" => ConcernType::Timeliness,
        "scope_exceeded" => ConcernType::ScopeExceeded,
        "methodology" => ConcernType::Methodology,
        "documentation" => ConcernType::Documentation,
        "code_breach" => ConcernType::CodeBreach,
        "conflict_of_interest" => ConcernType::ConflictOfInterest,
        "communication" => ConcernType::Communication,
        _ => ConcernType::Other,
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

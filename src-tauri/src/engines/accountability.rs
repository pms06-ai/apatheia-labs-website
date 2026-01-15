//! ACCOUNTABILITY AUDIT ENGINE (Λ)
//!
//! "Statutory Duty Violation Analysis"
//!
//! Maps professional duties to actors and identifies where verification
//! obligations were breached across institutional boundaries.
//!
//! Core Question: Who had what duty, and did they fulfill it?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Type of statutory/professional duty
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DutyType {
    /// Verify information before acting
    VerificationDuty,
    /// Report specific matters to authority
    ReportingDuty,
    /// Assess situation independently
    AssessmentDuty,
    /// Follow court orders
    CourtOrderCompliance,
    /// Maintain confidentiality
    ConfidentialityDuty,
    /// Act in best interests of child
    WelfareDuty,
    /// Ensure procedural fairness
    FairnessDuty,
    /// Document decisions
    DocumentationDuty,
    /// Disclose material information
    DisclosureDuty,
    /// Supervise/monitor situation
    SupervisionDuty,
    /// Meet statutory timescales
    TimescaleDuty,
    /// Other regulatory requirement
    RegulatoryDuty,
}

impl DutyType {
    pub fn as_str(&self) -> &'static str {
        match self {
            DutyType::VerificationDuty => "verification_duty",
            DutyType::ReportingDuty => "reporting_duty",
            DutyType::AssessmentDuty => "assessment_duty",
            DutyType::CourtOrderCompliance => "court_order_compliance",
            DutyType::ConfidentialityDuty => "confidentiality_duty",
            DutyType::WelfareDuty => "welfare_duty",
            DutyType::FairnessDuty => "fairness_duty",
            DutyType::DocumentationDuty => "documentation_duty",
            DutyType::DisclosureDuty => "disclosure_duty",
            DutyType::SupervisionDuty => "supervision_duty",
            DutyType::TimescaleDuty => "timescale_duty",
            DutyType::RegulatoryDuty => "regulatory_duty",
        }
    }
}

/// Source of the duty
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DutySource {
    /// Statutory requirement (e.g., Children Act)
    Statute,
    /// Court order or direction
    CourtOrder,
    /// Professional code of conduct
    ProfessionalCode,
    /// Policy or procedure
    Policy,
    /// Case law requirement
    CaseLaw,
    /// Guidance (e.g., Working Together)
    Guidance,
    /// Contractual obligation
    Contract,
}

impl DutySource {
    pub fn as_str(&self) -> &'static str {
        match self {
            DutySource::Statute => "statute",
            DutySource::CourtOrder => "court_order",
            DutySource::ProfessionalCode => "professional_code",
            DutySource::Policy => "policy",
            DutySource::CaseLaw => "case_law",
            DutySource::Guidance => "guidance",
            DutySource::Contract => "contract",
        }
    }
}

/// Severity of breach
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

/// A professional/statutory duty
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Duty {
    pub id: String,
    pub duty_type: DutyType,
    pub source: DutySource,
    pub source_reference: String,       // e.g., "Children Act 1989 s.17"
    pub description: String,
    pub duty_holder: String,            // Who has the duty
    pub duty_holder_role: String,       // Their role
    pub beneficiary: Option<String>,    // Who the duty is owed to
}

/// A duty breach
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DutyBreach {
    pub id: String,
    pub duty: Duty,
    pub severity: Severity,
    pub breach_date: Option<String>,
    pub description: String,
    pub evidence: String,
    pub document_id: String,
    pub document_name: String,
    pub page_ref: Option<i32>,
    pub impact: String,
    pub regulatory_relevance: Option<String>,
}

/// Verification failure (claim accepted without verification)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerificationFailure {
    pub id: String,
    pub claim_accepted: String,
    pub accepted_by: String,
    pub accepted_from: String,
    pub available_verification: String,  // What they could have checked
    pub verification_performed: bool,
    pub evidence: String,
    pub impact: String,
}

/// Summary of accountability analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountabilitySummary {
    pub total_duties_identified: i32,
    pub duties_breached: i32,
    pub verification_failures: i32,
    pub actors_with_breaches: Vec<String>,
    pub most_common_breach_type: Option<String>,
    pub regulatory_bodies_relevant: Vec<String>,
}

/// Complete result of accountability audit
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountabilityResult {
    pub duties: Vec<Duty>,
    pub breaches: Vec<DutyBreach>,
    pub verification_failures: Vec<VerificationFailure>,
    pub summary: AccountabilitySummary,
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
struct AIAccountabilityResponse {
    duties: Vec<AIDuty>,
    breaches: Vec<AIBreach>,
    #[serde(rename = "verificationFailures")]
    verification_failures: Vec<AIVerificationFailure>,
}

#[derive(Debug, Deserialize)]
struct AIDuty {
    #[serde(rename = "dutyType")]
    duty_type: String,
    source: String,
    #[serde(rename = "sourceReference")]
    source_reference: String,
    description: String,
    #[serde(rename = "dutyHolder")]
    duty_holder: String,
    #[serde(rename = "dutyHolderRole")]
    duty_holder_role: String,
    beneficiary: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIBreach {
    #[serde(rename = "dutyIndex")]
    duty_index: usize,
    severity: String,
    #[serde(rename = "breachDate")]
    breach_date: Option<String>,
    description: String,
    evidence: String,
    #[serde(rename = "documentId")]
    document_id: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
    impact: String,
    #[serde(rename = "regulatoryRelevance")]
    regulatory_relevance: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIVerificationFailure {
    #[serde(rename = "claimAccepted")]
    claim_accepted: String,
    #[serde(rename = "acceptedBy")]
    accepted_by: String,
    #[serde(rename = "acceptedFrom")]
    accepted_from: String,
    #[serde(rename = "availableVerification")]
    available_verification: String,
    #[serde(rename = "verificationPerformed")]
    verification_performed: bool,
    evidence: String,
    impact: String,
}

/// The Accountability Audit Engine
pub struct AccountabilityEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl AccountabilityEngine {
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

    /// Audit accountability across documents
    pub async fn audit_accountability(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<AccountabilityResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_audit(&documents, case_id).await;
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
            r#"Analyze these documents for ACCOUNTABILITY - identify duties, breaches, and verification failures.

DUTY TYPES:
- verification_duty: Duty to verify information before acting on it
- reporting_duty: Duty to report matters to authority
- assessment_duty: Duty to conduct independent assessment
- court_order_compliance: Duty to comply with court orders
- confidentiality_duty: Duty to maintain confidentiality
- welfare_duty: Duty to act in best interests of child
- fairness_duty: Duty to ensure procedural fairness
- documentation_duty: Duty to document decisions
- disclosure_duty: Duty to disclose material information
- supervision_duty: Duty to supervise/monitor
- timescale_duty: Duty to meet statutory timescales
- regulatory_duty: Other regulatory requirement

DUTY SOURCES:
- statute: Children Act, Human Rights Act, etc.
- court_order: Specific court orders
- professional_code: HCPC, GMC, SRA standards
- policy: Local authority procedures
- case_law: Legal precedents
- guidance: Working Together, etc.
- contract: Contractual obligations

For EACH duty:
1. Identify the duty type and source
2. Identify who holds the duty and their role
3. Determine if the duty was breached
4. Document the evidence for breach
5. Assess impact and regulatory relevance

VERIFICATION FAILURES:
Identify instances where claims were accepted without verification:
- What claim was accepted?
- By whom was it accepted?
- From whom was it accepted?
- What verification was available but not performed?

DOCUMENTS TO ANALYZE:
{}

Respond in JSON:
{{
  "duties": [
    {{
      "dutyType": "verification_duty|reporting_duty|assessment_duty|court_order_compliance|...",
      "source": "statute|court_order|professional_code|policy|case_law|guidance|contract",
      "sourceReference": "e.g., Children Act 1989 s.17",
      "description": "description of duty",
      "dutyHolder": "name of person/org with duty",
      "dutyHolderRole": "their role",
      "beneficiary": "who duty is owed to" or null
    }}
  ],
  "breaches": [
    {{
      "dutyIndex": 0,
      "severity": "critical|high|medium|low",
      "breachDate": "date if known" or null,
      "description": "what was breached",
      "evidence": "specific evidence",
      "documentId": "doc-id",
      "pageRef": number or null,
      "impact": "consequence of breach",
      "regulatoryRelevance": "HCPC/LGO/etc. relevance" or null
    }}
  ],
  "verificationFailures": [
    {{
      "claimAccepted": "the claim that was accepted",
      "acceptedBy": "who accepted it",
      "acceptedFrom": "source of claim",
      "availableVerification": "what they could have checked",
      "verificationPerformed": false,
      "evidence": "evidence of failure to verify",
      "impact": "consequence of not verifying"
    }}
  ]
}}"#,
            formatted_docs
        );

        let system = "You are a forensic accountability analyst specializing in public law and professional regulation. \
            You identify statutory and professional duties, determine when they have been breached, \
            and track verification failures where claims were accepted without proper checking. \
            You are particularly skilled at mapping duties to specific legal sources.";

        let response: AIAccountabilityResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Build duties with IDs
        let duties: Vec<Duty> = response.duties
            .into_iter()
            .enumerate()
            .map(|(idx, d)| Duty {
                id: format!("duty-{}-{}", &case_id[..8.min(case_id.len())], idx),
                duty_type: parse_duty_type(&d.duty_type),
                source: parse_duty_source(&d.source),
                source_reference: d.source_reference,
                description: d.description,
                duty_holder: d.duty_holder,
                duty_holder_role: d.duty_holder_role,
                beneficiary: d.beneficiary,
            })
            .collect();

        // Map breaches to duties
        let breaches: Vec<DutyBreach> = response.breaches
            .into_iter()
            .enumerate()
            .map(|(idx, b)| {
                let duty = duties.get(b.duty_index).cloned().unwrap_or_else(|| Duty {
                    id: "unknown".to_string(),
                    duty_type: DutyType::RegulatoryDuty,
                    source: DutySource::Policy,
                    source_reference: "Unknown".to_string(),
                    description: "Unknown duty".to_string(),
                    duty_holder: "Unknown".to_string(),
                    duty_holder_role: "Unknown".to_string(),
                    beneficiary: None,
                });
                let doc_name = documents.iter()
                    .find(|d| d.id == b.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                DutyBreach {
                    id: format!("breach-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    duty,
                    severity: parse_severity(&b.severity),
                    breach_date: b.breach_date,
                    description: b.description,
                    evidence: b.evidence,
                    document_id: b.document_id,
                    document_name: doc_name,
                    page_ref: b.page_ref,
                    impact: b.impact,
                    regulatory_relevance: b.regulatory_relevance,
                }
            })
            .collect();

        let verification_failures: Vec<VerificationFailure> = response.verification_failures
            .into_iter()
            .enumerate()
            .map(|(idx, v)| VerificationFailure {
                id: format!("vf-{}-{}", &case_id[..8.min(case_id.len())], idx),
                claim_accepted: v.claim_accepted,
                accepted_by: v.accepted_by,
                accepted_from: v.accepted_from,
                available_verification: v.available_verification,
                verification_performed: v.verification_performed,
                evidence: v.evidence,
                impact: v.impact,
            })
            .collect();

        // Calculate summary
        let actors_with_breaches: Vec<String> = breaches.iter()
            .map(|b| b.duty.duty_holder.clone())
            .collect::<std::collections::HashSet<_>>()
            .into_iter()
            .collect();

        let breach_type_counts = breaches.iter()
            .fold(std::collections::HashMap::new(), |mut acc, b| {
                *acc.entry(b.duty.duty_type.as_str()).or_insert(0) += 1;
                acc
            });
        let most_common = breach_type_counts.into_iter()
            .max_by_key(|(_, count)| *count)
            .map(|(t, _)| t.to_string());

        let regulatory_bodies: Vec<String> = breaches.iter()
            .filter_map(|b| b.regulatory_relevance.as_ref())
            .flat_map(|r| r.split(',').map(|s| s.trim().to_string()))
            .collect::<std::collections::HashSet<_>>()
            .into_iter()
            .collect();

        let summary = AccountabilitySummary {
            total_duties_identified: duties.len() as i32,
            duties_breached: breaches.len() as i32,
            verification_failures: verification_failures.len() as i32,
            actors_with_breaches,
            most_common_breach_type: most_common,
            regulatory_bodies_relevant: regulatory_bodies,
        };

        // Store findings
        self.store_findings(case_id, &breaches).await?;

        Ok(AccountabilityResult {
            duties,
            breaches,
            verification_failures,
            summary,
            is_mock: false,
        })
    }

    async fn store_findings(&self, case_id: &str, breaches: &[DutyBreach]) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for b in breaches {
            let id = Uuid::new_v4().to_string();
            let title = format!("Duty Breach: {} by {}", b.duty.duty_type.as_str(), b.duty.duty_holder);

            let evidence = serde_json::json!({
                "duty_type": b.duty.duty_type.as_str(),
                "duty_source": b.duty.source.as_str(),
                "source_reference": b.duty.source_reference,
                "duty_holder": b.duty.duty_holder,
                "duty_holder_role": b.duty.duty_holder_role,
                "evidence_text": b.evidence,
                "impact": b.impact,
                "regulatory_relevance": b.regulatory_relevance,
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'accountability_audit', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&b.description)
            .bind(b.severity.as_str())
            .bind(serde_json::json!([b.document_id]).to_string())
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store breach finding: {}", e))?;
        }

        log::info!("Stored {} accountability findings for case {}", breaches.len(), case_id);
        Ok(())
    }

    async fn mock_audit(
        &self,
        _documents: &[DocumentInfo],
        case_id: &str,
    ) -> Result<AccountabilityResult, String> {
        log::warn!("Running accountability audit in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let duties = vec![
            Duty {
                id: format!("duty-{}-0", &case_id[..8.min(case_id.len())]),
                duty_type: DutyType::CourtOrderCompliance,
                source: DutySource::CourtOrder,
                source_reference: "SGO Order 23.01.2024 - Contact Recitals".to_string(),
                description: "Facilitate fortnightly contact between child and parents".to_string(),
                duty_holder: "Mandy Seamark".to_string(),
                duty_holder_role: "Special Guardian".to_string(),
                beneficiary: Some("Ryan Dunmore".to_string()),
            },
            Duty {
                id: format!("duty-{}-1", &case_id[..8.min(case_id.len())]),
                duty_type: DutyType::VerificationDuty,
                source: DutySource::ProfessionalCode,
                source_reference: "HCPC Standards of Conduct 3.1".to_string(),
                description: "Verify information before including in assessment".to_string(),
                duty_holder: "Emma Hunnisett".to_string(),
                duty_holder_role: "Social Worker".to_string(),
                beneficiary: None,
            },
        ];

        let breaches = vec![
            DutyBreach {
                id: format!("breach-{}-0", &case_id[..8.min(case_id.len())]),
                duty: duties[0].clone(),
                severity: Severity::High,
                breach_date: Some("June 2025".to_string()),
                description: "Contact reduced from fortnightly to monthly, then ceased entirely".to_string(),
                evidence: "No contact since June 2025 despite court order specifying fortnightly".to_string(),
                document_id: "mock-doc-1".to_string(),
                document_name: "SGO Order".to_string(),
                page_ref: Some(3),
                impact: "Child deprived of contact with parents for 6+ months".to_string(),
                regulatory_relevance: Some("LGO - maladministration, potential child arrangements enforcement".to_string()),
            },
        ];

        let verification_failures = vec![
            VerificationFailure {
                id: format!("vf-{}-0", &case_id[..8.min(case_id.len())]),
                claim_accepted: "Parents uncooperative with contact".to_string(),
                accepted_by: "Emma Hunnisett".to_string(),
                accepted_from: "Special Guardian".to_string(),
                available_verification: "Contact logs, parent communications, schedule of offered dates".to_string(),
                verification_performed: false,
                evidence: "Assessment repeats guardian's characterization without reviewing contact records".to_string(),
                impact: "Unverified claim influenced professional recommendations".to_string(),
            },
        ];

        let summary = AccountabilitySummary {
            total_duties_identified: 2,
            duties_breached: 1,
            verification_failures: 1,
            actors_with_breaches: vec!["Mandy Seamark".to_string()],
            most_common_breach_type: Some("court_order_compliance".to_string()),
            regulatory_bodies_relevant: vec!["LGO".to_string()],
        };

        Ok(AccountabilityResult {
            duties,
            breaches,
            verification_failures,
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_duty_type(s: &str) -> DutyType {
    match s.to_lowercase().as_str() {
        "verification_duty" => DutyType::VerificationDuty,
        "reporting_duty" => DutyType::ReportingDuty,
        "assessment_duty" => DutyType::AssessmentDuty,
        "court_order_compliance" => DutyType::CourtOrderCompliance,
        "confidentiality_duty" => DutyType::ConfidentialityDuty,
        "welfare_duty" => DutyType::WelfareDuty,
        "fairness_duty" => DutyType::FairnessDuty,
        "documentation_duty" => DutyType::DocumentationDuty,
        "disclosure_duty" => DutyType::DisclosureDuty,
        "supervision_duty" => DutyType::SupervisionDuty,
        "timescale_duty" => DutyType::TimescaleDuty,
        _ => DutyType::RegulatoryDuty,
    }
}

fn parse_duty_source(s: &str) -> DutySource {
    match s.to_lowercase().as_str() {
        "statute" => DutySource::Statute,
        "court_order" => DutySource::CourtOrder,
        "professional_code" => DutySource::ProfessionalCode,
        "policy" => DutySource::Policy,
        "case_law" => DutySource::CaseLaw,
        "guidance" => DutySource::Guidance,
        "contract" => DutySource::Contract,
        _ => DutySource::Policy,
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

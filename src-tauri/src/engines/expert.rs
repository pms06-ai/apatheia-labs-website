//! EXPERT WITNESS ENGINE (Ξ)
//!
//! "FJC Compliance Analysis"
//!
//! Analyzes expert witness reports for compliance with Family Justice Council
//! standards, including scope limitations, methodology, evidence basis, and
//! proper caveating of opinions.
//!
//! Core Question: Does this expert report comply with FJC standards?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Type of expert witness issue
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ExpertIssueType {
    /// Opinion exceeds instructed scope
    ScopeExceed,
    /// Conclusions not supported by evidence
    UnsupportedConclusion,
    /// Methodology not explained or flawed
    MethodologyDeficiency,
    /// Failed to consider alternative explanations
    AlternativeNotConsidered,
    /// Opinion stated without proper caveating
    ImproperlyCaveated,
    /// Bias evident in analysis
    ApparentBias,
    /// Relied on unverified information
    UnverifiedReliance,
    /// Failed to disclose limitations
    UndisclosedLimitation,
    /// Overstepped professional competence
    CompetenceExceed,
    /// Failed to provide balanced view
    ImbalancedAnalysis,
}

impl ExpertIssueType {
    pub fn as_str(&self) -> &'static str {
        match self {
            ExpertIssueType::ScopeExceed => "scope_exceed",
            ExpertIssueType::UnsupportedConclusion => "unsupported_conclusion",
            ExpertIssueType::MethodologyDeficiency => "methodology_deficiency",
            ExpertIssueType::AlternativeNotConsidered => "alternative_not_considered",
            ExpertIssueType::ImproperlyCaveated => "improperly_caveated",
            ExpertIssueType::ApparentBias => "apparent_bias",
            ExpertIssueType::UnverifiedReliance => "unverified_reliance",
            ExpertIssueType::UndisclosedLimitation => "undisclosed_limitation",
            ExpertIssueType::CompetenceExceed => "competence_exceed",
            ExpertIssueType::ImbalancedAnalysis => "imbalanced_analysis",
        }
    }
}

/// Type of expert witness
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ExpertType {
    Psychologist,
    Psychiatrist,
    SocialWorkExpert,
    MedicalExpert,
    FinancialExpert,
    ChildDevelopment,
    DomesticAbuse,
    AddictionsExpert,
    EducationalExpert,
    Other,
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

/// FJC compliance category
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FJCCategory {
    /// Instructions and scope
    Scope,
    /// Methodology and approach
    Methodology,
    /// Evidence basis
    Evidence,
    /// Opinion formation
    Opinion,
    /// Balance and fairness
    Balance,
    /// Disclosure and transparency
    Disclosure,
}

/// Information about an expert
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpertInfo {
    pub name: String,
    pub expert_type: ExpertType,
    pub qualifications: Vec<String>,
    pub instructing_party: Option<String>,
    pub instruction_date: Option<String>,
    pub report_date: Option<String>,
    pub declared_scope: Vec<String>,
}

/// An issue found in expert report
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpertIssue {
    pub id: String,
    pub issue_type: ExpertIssueType,
    pub severity: Severity,
    pub fjc_category: FJCCategory,
    /// The problematic content
    pub content: String,
    pub page_ref: Option<i32>,
    /// Analysis of the issue
    pub description: String,
    /// FJC standard violated
    pub fjc_standard: String,
    /// Impact on proceedings
    pub impact: String,
    /// Relevant document
    pub document_id: String,
    pub document_name: String,
}

/// A scope analysis for an expert report
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScopeAnalysis {
    /// Declared scope from instructions
    pub declared_scope: Vec<String>,
    /// Topics actually addressed
    pub addressed_topics: Vec<String>,
    /// Topics outside scope
    pub exceeded_topics: Vec<String>,
    /// Topics instructed but not addressed
    pub unaddressed_topics: Vec<String>,
    pub assessment: String,
}

/// Methodology assessment
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MethodologyAssessment {
    /// Methods described
    pub methods_used: Vec<String>,
    /// Methods that should have been used
    pub methods_missing: Vec<String>,
    /// Interviews conducted
    pub interviews: Vec<String>,
    /// Documents reviewed
    pub documents_reviewed: Vec<String>,
    /// Assessment tools used
    pub assessment_tools: Vec<String>,
    pub assessment: String,
}

/// Summary of expert report analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpertSummary {
    pub experts_analyzed: i32,
    pub total_issues: i32,
    pub critical_issues: i32,
    pub scope_issues: i32,
    pub methodology_issues: i32,
    pub evidence_issues: i32,
    pub fjc_compliance_score: f64,
    pub overall_assessment: String,
}

/// Complete result of expert witness analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExpertResult {
    pub experts: Vec<ExpertInfo>,
    pub issues: Vec<ExpertIssue>,
    pub scope_analyses: Vec<ScopeAnalysis>,
    pub methodology_assessments: Vec<MethodologyAssessment>,
    pub summary: ExpertSummary,
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
struct AIExpertResponse {
    experts: Vec<AIExpert>,
    issues: Vec<AIIssue>,
    scope_analyses: Vec<AIScopeAnalysis>,
    methodology_assessments: Vec<AIMethodology>,
}

#[derive(Debug, Deserialize)]
struct AIExpert {
    name: String,
    expert_type: String,
    qualifications: Vec<String>,
    instructing_party: Option<String>,
    instruction_date: Option<String>,
    report_date: Option<String>,
    declared_scope: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct AIIssue {
    issue_type: String,
    severity: String,
    fjc_category: String,
    content: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
    description: String,
    fjc_standard: String,
    impact: String,
    #[serde(rename = "documentId")]
    document_id: String,
}

#[derive(Debug, Deserialize)]
struct AIScopeAnalysis {
    declared_scope: Vec<String>,
    addressed_topics: Vec<String>,
    exceeded_topics: Vec<String>,
    unaddressed_topics: Vec<String>,
    assessment: String,
}

#[derive(Debug, Deserialize)]
struct AIMethodology {
    methods_used: Vec<String>,
    methods_missing: Vec<String>,
    interviews: Vec<String>,
    documents_reviewed: Vec<String>,
    assessment_tools: Vec<String>,
    assessment: String,
}

/// The Expert Witness Analysis Engine
pub struct ExpertEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl ExpertEngine {
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

    /// Analyze expert reports for FJC compliance
    pub async fn analyze_experts(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<ExpertResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_analyze(case_id).await;
        }

        let ai_client = self.ai_client.as_ref().unwrap();

        // Focus on expert reports
        let expert_docs: Vec<_> = documents
            .iter()
            .filter(|d| {
                d.doc_type == "expert_report"
                    || d.name.to_lowercase().contains("expert")
                    || d.name.to_lowercase().contains("psychological")
                    || d.name.to_lowercase().contains("psychiatric")
                    || d.name.to_lowercase().contains("assessment")
            })
            .collect();

        let formatted_docs = if expert_docs.is_empty() {
            // No explicit expert docs, analyze all as potential expert material
            documents
                .iter()
                .map(|d| {
                    format!(
                        "=== DOCUMENT: {} (ID: {}, Type: {}) ===\n{}",
                        d.name,
                        d.id,
                        d.doc_type,
                        &d.content[..d.content.len().min(25000)]
                    )
                })
                .collect::<Vec<_>>()
                .join("\n\n---\n\n")
        } else {
            expert_docs
                .iter()
                .map(|d| {
                    format!(
                        "=== EXPERT REPORT: {} (ID: {}) ===\n{}",
                        d.name,
                        d.id,
                        &d.content[..d.content.len().min(30000)]
                    )
                })
                .collect::<Vec<_>>()
                .join("\n\n---\n\n")
        };

        let prompt = format!(
            r#"Analyze these expert witness reports for FJC (Family Justice Council) compliance.

ISSUE TYPES:
- scope_exceed: Opinion exceeds instructed scope
- unsupported_conclusion: Conclusions not supported by evidence
- methodology_deficiency: Methodology not explained or flawed
- alternative_not_considered: Failed to consider alternative explanations
- improperly_caveated: Opinion stated without proper caveating
- apparent_bias: Bias evident in analysis
- unverified_reliance: Relied on unverified information
- undisclosed_limitation: Failed to disclose limitations
- competence_exceed: Overstepped professional competence
- imbalanced_analysis: Failed to provide balanced view

FJC CATEGORIES:
- scope: Instructions and scope compliance
- methodology: Methods and approach
- evidence: Evidence basis for opinions
- opinion: How opinions are formed and expressed
- balance: Fairness and balance
- disclosure: Transparency and limitations

EXPERT TYPES:
psychologist, psychiatrist, social_work_expert, medical_expert, financial_expert,
child_development, domestic_abuse, addictions_expert, educational_expert, other

SEVERITY: critical, high, medium, low

FJC STANDARDS TO CHECK:
1. Expert must stay within instructed scope
2. Opinions must be supported by evidence reviewed
3. Methodology must be explained and appropriate
4. Alternative explanations must be considered
5. Limitations must be disclosed
6. Conclusions must be properly caveated
7. Expert must maintain objectivity and balance

DOCUMENTS:
{}

Respond in JSON:
{{
  "experts": [
    {{
      "name": "expert name",
      "expert_type": "psychologist|...",
      "qualifications": ["qualification1", "..."],
      "instructing_party": "court|applicant|respondent" or null,
      "instruction_date": "YYYY-MM-DD" or null,
      "report_date": "YYYY-MM-DD" or null,
      "declared_scope": ["scope item 1", "..."]
    }}
  ],
  "issues": [
    {{
      "issue_type": "scope_exceed|...",
      "severity": "critical|high|medium|low",
      "fjc_category": "scope|methodology|evidence|opinion|balance|disclosure",
      "content": "problematic text from report",
      "pageRef": number or null,
      "description": "what's wrong",
      "fjc_standard": "which FJC standard is violated",
      "impact": "effect on proceedings",
      "documentId": "doc-id"
    }}
  ],
  "scope_analyses": [
    {{
      "declared_scope": ["what expert was asked"],
      "addressed_topics": ["what expert covered"],
      "exceeded_topics": ["topics beyond scope"],
      "unaddressed_topics": ["scope items not addressed"],
      "assessment": "overall scope compliance"
    }}
  ],
  "methodology_assessments": [
    {{
      "methods_used": ["methods described"],
      "methods_missing": ["expected methods not used"],
      "interviews": ["who was interviewed"],
      "documents_reviewed": ["documents cited"],
      "assessment_tools": ["tests/tools used"],
      "assessment": "methodology adequacy assessment"
    }}
  ]
}}"#,
            formatted_docs
        );

        let system = "You are a forensic analyst specializing in expert witness reports in family \
            court proceedings. You assess compliance with Family Justice Council standards, \
            identifying issues with scope, methodology, evidence basis, and proper caveating. \
            You understand UK family court procedures and expert witness obligations.";

        let response: AIExpertResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert experts
        let experts: Vec<ExpertInfo> = response
            .experts
            .into_iter()
            .map(|e| ExpertInfo {
                name: e.name,
                expert_type: parse_expert_type(&e.expert_type),
                qualifications: e.qualifications,
                instructing_party: e.instructing_party,
                instruction_date: e.instruction_date,
                report_date: e.report_date,
                declared_scope: e.declared_scope,
            })
            .collect();

        // Convert issues
        let issues: Vec<ExpertIssue> = response
            .issues
            .into_iter()
            .enumerate()
            .map(|(idx, i)| {
                let doc_name = documents
                    .iter()
                    .find(|d| d.id == i.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                ExpertIssue {
                    id: format!("ei-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    issue_type: parse_issue_type(&i.issue_type),
                    severity: parse_severity(&i.severity),
                    fjc_category: parse_fjc_category(&i.fjc_category),
                    content: i.content,
                    page_ref: i.page_ref,
                    description: i.description,
                    fjc_standard: i.fjc_standard,
                    impact: i.impact,
                    document_id: i.document_id,
                    document_name: doc_name,
                }
            })
            .collect();

        // Convert scope analyses
        let scope_analyses: Vec<ScopeAnalysis> = response
            .scope_analyses
            .into_iter()
            .map(|s| ScopeAnalysis {
                declared_scope: s.declared_scope,
                addressed_topics: s.addressed_topics,
                exceeded_topics: s.exceeded_topics,
                unaddressed_topics: s.unaddressed_topics,
                assessment: s.assessment,
            })
            .collect();

        // Convert methodology assessments
        let methodology_assessments: Vec<MethodologyAssessment> = response
            .methodology_assessments
            .into_iter()
            .map(|m| MethodologyAssessment {
                methods_used: m.methods_used,
                methods_missing: m.methods_missing,
                interviews: m.interviews,
                documents_reviewed: m.documents_reviewed,
                assessment_tools: m.assessment_tools,
                assessment: m.assessment,
            })
            .collect();

        // Build summary
        let scope_issues = issues
            .iter()
            .filter(|i| matches!(i.fjc_category, FJCCategory::Scope))
            .count() as i32;
        let methodology_issues = issues
            .iter()
            .filter(|i| matches!(i.fjc_category, FJCCategory::Methodology))
            .count() as i32;
        let evidence_issues = issues
            .iter()
            .filter(|i| matches!(i.fjc_category, FJCCategory::Evidence))
            .count() as i32;
        let critical_issues = issues
            .iter()
            .filter(|i| matches!(i.severity, Severity::Critical))
            .count() as i32;

        // Calculate compliance score (lower is worse)
        let total_issues = issues.len() as f64;
        let weighted_issues = critical_issues as f64 * 4.0
            + (issues.iter().filter(|i| matches!(i.severity, Severity::High)).count() as f64) * 2.0
            + (issues.iter().filter(|i| matches!(i.severity, Severity::Medium)).count() as f64)
            + (issues.iter().filter(|i| matches!(i.severity, Severity::Low)).count() as f64) * 0.5;
        let compliance_score = if total_issues > 0.0 {
            (100.0 - (weighted_issues * 5.0).min(100.0)).max(0.0)
        } else {
            100.0
        };

        let overall_assessment = if compliance_score >= 80.0 {
            "Generally compliant with FJC standards".to_string()
        } else if compliance_score >= 60.0 {
            "Some FJC compliance issues requiring attention".to_string()
        } else if compliance_score >= 40.0 {
            "Significant FJC compliance concerns".to_string()
        } else {
            "Serious FJC non-compliance identified".to_string()
        };

        let summary = ExpertSummary {
            experts_analyzed: experts.len() as i32,
            total_issues: issues.len() as i32,
            critical_issues,
            scope_issues,
            methodology_issues,
            evidence_issues,
            fjc_compliance_score: compliance_score,
            overall_assessment,
        };

        // Store findings
        self.store_findings(case_id, &issues).await?;

        Ok(ExpertResult {
            experts,
            issues,
            scope_analyses,
            methodology_assessments,
            summary,
            is_mock: false,
        })
    }

    async fn store_findings(&self, case_id: &str, issues: &[ExpertIssue]) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for issue in issues
            .iter()
            .filter(|i| matches!(i.severity, Severity::Critical | Severity::High))
        {
            let id = Uuid::new_v4().to_string();
            let title = format!("Expert Issue: {}", issue.issue_type.as_str());

            let evidence = serde_json::json!({
                "content": issue.content,
                "fjc_standard": issue.fjc_standard,
                "fjc_category": format!("{:?}", issue.fjc_category),
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'expert_witness', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&issue.description)
            .bind(match issue.severity {
                Severity::Critical => "critical",
                Severity::High => "high",
                Severity::Medium => "medium",
                Severity::Low => "low",
            })
            .bind(serde_json::json!([issue.document_id]).to_string())
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store expert finding: {}", e))?;
        }

        log::info!("Stored expert witness findings for case {}", case_id);
        Ok(())
    }

    async fn mock_analyze(&self, case_id: &str) -> Result<ExpertResult, String> {
        log::warn!("Running expert witness analysis in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let experts = vec![ExpertInfo {
            name: "Dr. Jane Expert".to_string(),
            expert_type: ExpertType::Psychologist,
            qualifications: vec!["PhD Psychology".to_string(), "HCPC Registered".to_string()],
            instructing_party: Some("Court".to_string()),
            instruction_date: Some("2023-06-01".to_string()),
            report_date: Some("2023-08-15".to_string()),
            declared_scope: vec!["Assess parenting capacity".to_string()],
        }];

        let issues = vec![ExpertIssue {
            id: format!("ei-{}-0", &case_id[..8.min(case_id.len())]),
            issue_type: ExpertIssueType::ScopeExceed,
            severity: Severity::High,
            fjc_category: FJCCategory::Scope,
            content: "In my opinion, the allegations are true".to_string(),
            page_ref: Some(45),
            description: "Expert exceeded scope by determining fact rather than assessing capacity"
                .to_string(),
            fjc_standard:
                "Expert must not usurp the role of the court in determining facts".to_string(),
            impact: "Court may rely on improper fact-finding".to_string(),
            document_id: "mock-doc-1".to_string(),
            document_name: "Psychological Assessment".to_string(),
        }];

        let scope_analyses = vec![ScopeAnalysis {
            declared_scope: vec!["Assess parenting capacity".to_string()],
            addressed_topics: vec![
                "Parenting assessment".to_string(),
                "Veracity of allegations".to_string(),
            ],
            exceeded_topics: vec!["Veracity of allegations".to_string()],
            unaddressed_topics: vec![],
            assessment: "Expert exceeded scope by addressing fact-finding".to_string(),
        }];

        let summary = ExpertSummary {
            experts_analyzed: 1,
            total_issues: 1,
            critical_issues: 0,
            scope_issues: 1,
            methodology_issues: 0,
            evidence_issues: 0,
            fjc_compliance_score: 70.0,
            overall_assessment: "Some FJC compliance issues requiring attention".to_string(),
        };

        Ok(ExpertResult {
            experts,
            issues,
            scope_analyses,
            methodology_assessments: vec![],
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_expert_type(s: &str) -> ExpertType {
    match s.to_lowercase().as_str() {
        "psychologist" => ExpertType::Psychologist,
        "psychiatrist" => ExpertType::Psychiatrist,
        "social_work_expert" => ExpertType::SocialWorkExpert,
        "medical_expert" => ExpertType::MedicalExpert,
        "financial_expert" => ExpertType::FinancialExpert,
        "child_development" => ExpertType::ChildDevelopment,
        "domestic_abuse" => ExpertType::DomesticAbuse,
        "addictions_expert" => ExpertType::AddictionsExpert,
        "educational_expert" => ExpertType::EducationalExpert,
        _ => ExpertType::Other,
    }
}

fn parse_issue_type(s: &str) -> ExpertIssueType {
    match s.to_lowercase().as_str() {
        "scope_exceed" => ExpertIssueType::ScopeExceed,
        "unsupported_conclusion" => ExpertIssueType::UnsupportedConclusion,
        "methodology_deficiency" => ExpertIssueType::MethodologyDeficiency,
        "alternative_not_considered" => ExpertIssueType::AlternativeNotConsidered,
        "improperly_caveated" => ExpertIssueType::ImproperlyCaveated,
        "apparent_bias" => ExpertIssueType::ApparentBias,
        "unverified_reliance" => ExpertIssueType::UnverifiedReliance,
        "undisclosed_limitation" => ExpertIssueType::UndisclosedLimitation,
        "competence_exceed" => ExpertIssueType::CompetenceExceed,
        "imbalanced_analysis" => ExpertIssueType::ImbalancedAnalysis,
        _ => ExpertIssueType::ScopeExceed,
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

fn parse_fjc_category(s: &str) -> FJCCategory {
    match s.to_lowercase().as_str() {
        "scope" => FJCCategory::Scope,
        "methodology" => FJCCategory::Methodology,
        "evidence" => FJCCategory::Evidence,
        "opinion" => FJCCategory::Opinion,
        "balance" => FJCCategory::Balance,
        "disclosure" => FJCCategory::Disclosure,
        _ => FJCCategory::Scope,
    }
}

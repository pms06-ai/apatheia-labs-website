//! Complaint Generator
//!
//! Core logic for generating regulatory complaints from findings.

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;

use crate::ai::AIClient;

/// Regulatory body for complaint submission
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RegulatoryBody {
    /// Ofcom - Broadcasting regulator
    Ofcom,
    /// ICO - Information Commissioner's Office (GDPR)
    Ico,
    /// HCPC - Health and Care Professions Council
    Hcpc,
    /// LGO - Local Government Ombudsman
    Lgo,
    /// BPS - British Psychological Society
    Bps,
    /// GMC - General Medical Council
    Gmc,
    /// NMC - Nursing and Midwifery Council
    Nmc,
    /// SRA - Solicitors Regulation Authority
    Sra,
    /// BSB - Bar Standards Board
    Bsb,
    /// SWE - Social Work England
    Swe,
}

impl RegulatoryBody {
    pub fn as_str(&self) -> &'static str {
        match self {
            RegulatoryBody::Ofcom => "ofcom",
            RegulatoryBody::Ico => "ico",
            RegulatoryBody::Hcpc => "hcpc",
            RegulatoryBody::Lgo => "lgo",
            RegulatoryBody::Bps => "bps",
            RegulatoryBody::Gmc => "gmc",
            RegulatoryBody::Nmc => "nmc",
            RegulatoryBody::Sra => "sra",
            RegulatoryBody::Bsb => "bsb",
            RegulatoryBody::Swe => "swe",
        }
    }

    pub fn full_name(&self) -> &'static str {
        match self {
            RegulatoryBody::Ofcom => "Office of Communications (Ofcom)",
            RegulatoryBody::Ico => "Information Commissioner's Office (ICO)",
            RegulatoryBody::Hcpc => "Health and Care Professions Council (HCPC)",
            RegulatoryBody::Lgo => "Local Government and Social Care Ombudsman",
            RegulatoryBody::Bps => "British Psychological Society",
            RegulatoryBody::Gmc => "General Medical Council",
            RegulatoryBody::Nmc => "Nursing and Midwifery Council",
            RegulatoryBody::Sra => "Solicitors Regulation Authority",
            RegulatoryBody::Bsb => "Bar Standards Board",
            RegulatoryBody::Swe => "Social Work England",
        }
    }
}

/// Output format for complaint
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ComplaintFormat {
    /// Markdown format
    Markdown,
    /// Plain text
    Text,
    /// HTML format
    Html,
}

/// A section of the complaint
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplaintSection {
    pub heading: String,
    pub content: String,
    pub evidence_refs: Vec<String>,
}

/// An evidence item referenced in the complaint
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvidenceItem {
    pub id: String,
    pub label: String,
    pub description: String,
    pub document_ref: Option<String>,
    pub page_ref: Option<String>,
    pub quote: Option<String>,
}

/// Request to generate a complaint
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplaintRequest {
    pub case_id: String,
    pub regulatory_body: RegulatoryBody,
    pub format: ComplaintFormat,
    /// Complainant details
    pub complainant_name: String,
    pub complainant_address: Option<String>,
    pub complainant_email: Option<String>,
    pub complainant_phone: Option<String>,
    /// Respondent details
    pub respondent_name: String,
    pub respondent_address: Option<String>,
    /// Complaint details
    pub subject: String,
    pub summary: Option<String>,
    /// Specific finding IDs to include (empty = all relevant)
    pub finding_ids: Vec<String>,
    /// Additional context
    pub additional_context: Option<String>,
    /// Date range of events
    pub events_from: Option<String>,
    pub events_to: Option<String>,
}

/// Generated complaint output
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplaintOutput {
    pub regulatory_body: RegulatoryBody,
    pub format: ComplaintFormat,
    pub title: String,
    pub content: String,
    pub sections: Vec<ComplaintSection>,
    pub evidence_schedule: Vec<EvidenceItem>,
    pub word_count: usize,
    pub generated_at: String,
}

/// Complaint generator
pub struct ComplaintGenerator {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
}

impl ComplaintGenerator {
    pub fn new(pool: SqlitePool) -> Self {
        Self {
            pool,
            ai_client: None,
        }
    }

    pub fn with_ai_client(mut self, client: AIClient) -> Self {
        self.ai_client = Some(client);
        self
    }

    pub fn try_init_ai(&mut self) -> Result<(), String> {
        match AIClient::from_env() {
            Ok(client) => {
                self.ai_client = Some(client);
                Ok(())
            }
            Err(e) => Err(e),
        }
    }

    /// Generate a complaint from findings
    pub async fn generate(&self, request: ComplaintRequest) -> Result<ComplaintOutput, String> {
        // Fetch relevant findings
        let findings = self.fetch_findings(&request).await?;

        if findings.is_empty() {
            return Err("No relevant findings found for this complaint".to_string());
        }

        // Build complaint based on regulatory body
        let output = match request.regulatory_body {
            RegulatoryBody::Ofcom => self.generate_ofcom(&request, &findings).await?,
            RegulatoryBody::Ico => self.generate_ico(&request, &findings).await?,
            RegulatoryBody::Hcpc => self.generate_hcpc(&request, &findings).await?,
            RegulatoryBody::Lgo => self.generate_lgo(&request, &findings).await?,
            _ => self.generate_generic(&request, &findings).await?,
        };

        // Store complaint record
        self.store_complaint(&request, &output).await?;

        Ok(output)
    }

    async fn fetch_findings(&self, request: &ComplaintRequest) -> Result<Vec<FindingRecord>, String> {
        let findings: Vec<FindingRecord> = if request.finding_ids.is_empty() {
            // Fetch all findings for the case
            sqlx::query_as::<_, FindingRecord>(
                r#"SELECT id, case_id, engine, title, description, severity, document_ids, evidence, created_at
                   FROM findings
                   WHERE case_id = ?
                   ORDER BY
                     CASE severity
                       WHEN 'critical' THEN 1
                       WHEN 'high' THEN 2
                       WHEN 'medium' THEN 3
                       ELSE 4
                     END,
                     created_at DESC"#,
            )
            .bind(&request.case_id)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| format!("Failed to fetch findings: {}", e))?
        } else {
            // Fetch specific findings
            let placeholders = request.finding_ids.iter().map(|_| "?").collect::<Vec<_>>().join(",");
            let query = format!(
                r#"SELECT id, case_id, engine, title, description, severity, document_ids, evidence, created_at
                   FROM findings
                   WHERE id IN ({})
                   ORDER BY created_at DESC"#,
                placeholders
            );

            let mut q = sqlx::query_as::<_, FindingRecord>(&query);
            for id in &request.finding_ids {
                q = q.bind(id);
            }

            q.fetch_all(&self.pool)
                .await
                .map_err(|e| format!("Failed to fetch findings: {}", e))?
        };

        // Filter by regulatory body relevance
        let relevant_engines = match request.regulatory_body {
            RegulatoryBody::Ofcom => vec!["bias", "documentary", "omission", "narrative"],
            RegulatoryBody::Ico => vec!["entity", "professional", "accountability"],
            RegulatoryBody::Hcpc => vec!["professional", "accountability", "expert_witness"],
            RegulatoryBody::Lgo => vec!["accountability", "omission", "temporal"],
            _ => vec![],
        };

        if relevant_engines.is_empty() {
            Ok(findings)
        } else {
            Ok(findings
                .into_iter()
                .filter(|f| relevant_engines.contains(&f.engine.as_str()))
                .collect())
        }
    }

    async fn generate_ofcom(
        &self,
        request: &ComplaintRequest,
        findings: &[FindingRecord],
    ) -> Result<ComplaintOutput, String> {
        let mut sections = Vec::new();
        let mut evidence_schedule = Vec::new();
        let mut evidence_idx = 1;

        // Section 1: Complainant Details
        sections.push(ComplaintSection {
            heading: "1. Complainant Details".to_string(),
            content: format!(
                "Name: {}\n{}{}\n",
                request.complainant_name,
                request.complainant_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
                request.complainant_email.as_ref().map(|e| format!("Email: {}\n", e)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        // Section 2: Programme Details
        sections.push(ComplaintSection {
            heading: "2. Programme Details".to_string(),
            content: format!(
                "Broadcaster: {}\n{}\nSubject: {}\n{}",
                request.respondent_name,
                request.respondent_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
                request.subject,
                if let (Some(from), Some(to)) = (&request.events_from, &request.events_to) {
                    format!("Broadcast dates: {} to {}\n", from, to)
                } else {
                    String::new()
                }
            ),
            evidence_refs: vec![],
        });

        // Section 3: Summary of Complaint
        let summary = request.summary.clone().unwrap_or_else(|| {
            format!(
                "This complaint concerns breaches of the Ofcom Broadcasting Code arising from \
                the broadcast of '{}'. The complainant has identified {} issues relating to \
                due impartiality, fairness, and/or privacy.",
                request.subject,
                findings.len()
            )
        });
        sections.push(ComplaintSection {
            heading: "3. Summary of Complaint".to_string(),
            content: summary,
            evidence_refs: vec![],
        });

        // Section 4: Broadcasting Code Breaches
        let mut code_breaches = String::new();

        // Group findings by potential Ofcom section
        let section_5_findings: Vec<_> = findings.iter()
            .filter(|f| f.engine == "bias" || f.engine == "omission")
            .collect();
        let section_7_findings: Vec<_> = findings.iter()
            .filter(|f| f.engine == "documentary" && f.description.to_lowercase().contains("privacy"))
            .collect();
        let section_8_findings: Vec<_> = findings.iter()
            .filter(|f| f.engine == "documentary" || f.engine == "narrative")
            .collect();

        if !section_5_findings.is_empty() {
            code_breaches.push_str("### Section 5 - Due Impartiality\n\n");
            for finding in section_5_findings {
                let evidence_label = format!("E{}", evidence_idx);
                code_breaches.push_str(&format!(
                    "**{}** [{}]\n\n{}\n\nSeverity: {}\n\n",
                    finding.title,
                    evidence_label,
                    finding.description,
                    finding.severity.to_uppercase()
                ));
                evidence_schedule.push(EvidenceItem {
                    id: evidence_label.clone(),
                    label: evidence_label,
                    description: finding.title.clone(),
                    document_ref: None,
                    page_ref: None,
                    quote: Some(finding.description.clone()),
                });
                evidence_idx += 1;
            }
        }

        if !section_7_findings.is_empty() {
            code_breaches.push_str("### Section 7 - Privacy\n\n");
            for finding in section_7_findings {
                let evidence_label = format!("E{}", evidence_idx);
                code_breaches.push_str(&format!(
                    "**{}** [{}]\n\n{}\n\nSeverity: {}\n\n",
                    finding.title,
                    evidence_label,
                    finding.description,
                    finding.severity.to_uppercase()
                ));
                evidence_schedule.push(EvidenceItem {
                    id: evidence_label.clone(),
                    label: evidence_label,
                    description: finding.title.clone(),
                    document_ref: None,
                    page_ref: None,
                    quote: Some(finding.description.clone()),
                });
                evidence_idx += 1;
            }
        }

        if !section_8_findings.is_empty() {
            code_breaches.push_str("### Section 8 - Fairness\n\n");
            for finding in section_8_findings {
                let evidence_label = format!("E{}", evidence_idx);
                code_breaches.push_str(&format!(
                    "**{}** [{}]\n\n{}\n\nSeverity: {}\n\n",
                    finding.title,
                    evidence_label,
                    finding.description,
                    finding.severity.to_uppercase()
                ));
                evidence_schedule.push(EvidenceItem {
                    id: evidence_label.clone(),
                    label: evidence_label,
                    description: finding.title.clone(),
                    document_ref: None,
                    page_ref: None,
                    quote: Some(finding.description.clone()),
                });
                evidence_idx += 1;
            }
        }

        sections.push(ComplaintSection {
            heading: "4. Broadcasting Code Breaches".to_string(),
            content: code_breaches,
            evidence_refs: evidence_schedule.iter().map(|e| e.id.clone()).collect(),
        });

        // Section 5: Remedy Sought
        sections.push(ComplaintSection {
            heading: "5. Remedy Sought".to_string(),
            content: "The complainant requests that Ofcom:\n\n\
                1. Investigate the breaches identified above\n\
                2. Find that the broadcaster has breached the Broadcasting Code\n\
                3. Consider appropriate sanctions\n\
                4. Require a correction or on-air apology where appropriate\n".to_string(),
            evidence_refs: vec![],
        });

        // Build full content
        let content = self.format_output(&sections, &evidence_schedule, &request.format);
        let word_count = content.split_whitespace().count();

        Ok(ComplaintOutput {
            regulatory_body: RegulatoryBody::Ofcom,
            format: request.format,
            title: format!("Ofcom Complaint: {}", request.subject),
            content,
            sections,
            evidence_schedule,
            word_count,
            generated_at: chrono::Utc::now().to_rfc3339(),
        })
    }

    async fn generate_ico(
        &self,
        request: &ComplaintRequest,
        findings: &[FindingRecord],
    ) -> Result<ComplaintOutput, String> {
        let mut sections = Vec::new();
        let mut evidence_schedule = Vec::new();
        let mut evidence_idx = 1;

        // Section 1: Your Details
        sections.push(ComplaintSection {
            heading: "1. Your Details".to_string(),
            content: format!(
                "Name: {}\n{}{}\n",
                request.complainant_name,
                request.complainant_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
                request.complainant_email.as_ref().map(|e| format!("Email: {}\n", e)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        // Section 2: Organisation Details
        sections.push(ComplaintSection {
            heading: "2. Organisation You Are Complaining About".to_string(),
            content: format!(
                "Organisation: {}\n{}\n",
                request.respondent_name,
                request.respondent_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        // Section 3: What Happened
        let mut what_happened = String::new();
        what_happened.push_str(&format!("## Summary\n\n{}\n\n",
            request.summary.clone().unwrap_or_else(||
                "This complaint concerns breaches of UK GDPR relating to the processing of personal data.".to_string()
            )
        ));

        what_happened.push_str("## GDPR Articles Potentially Breached\n\n");

        for finding in findings {
            let evidence_label = format!("E{}", evidence_idx);
            what_happened.push_str(&format!(
                "### {} [{}]\n\n{}\n\nSeverity: {}\n\n",
                finding.title,
                evidence_label,
                finding.description,
                finding.severity.to_uppercase()
            ));
            evidence_schedule.push(EvidenceItem {
                id: evidence_label.clone(),
                label: evidence_label,
                description: finding.title.clone(),
                document_ref: None,
                page_ref: None,
                quote: Some(finding.description.clone()),
            });
            evidence_idx += 1;
        }

        sections.push(ComplaintSection {
            heading: "3. What Happened".to_string(),
            content: what_happened,
            evidence_refs: evidence_schedule.iter().map(|e| e.id.clone()).collect(),
        });

        // Section 4: What You Want
        sections.push(ComplaintSection {
            heading: "4. What You Want to Happen".to_string(),
            content: "I request that the ICO:\n\n\
                1. Investigate the data protection breaches identified\n\
                2. Take appropriate enforcement action\n\
                3. Require erasure of unlawfully processed personal data\n\
                4. Consider whether a fine or other sanction is appropriate\n".to_string(),
            evidence_refs: vec![],
        });

        // Section 5: Steps Taken
        sections.push(ComplaintSection {
            heading: "5. Steps Already Taken".to_string(),
            content: request.additional_context.clone().unwrap_or_else(||
                "I have raised these concerns directly with the organisation but have not received a satisfactory response.".to_string()
            ),
            evidence_refs: vec![],
        });

        let content = self.format_output(&sections, &evidence_schedule, &request.format);
        let word_count = content.split_whitespace().count();

        Ok(ComplaintOutput {
            regulatory_body: RegulatoryBody::Ico,
            format: request.format,
            title: format!("ICO Complaint: {}", request.subject),
            content,
            sections,
            evidence_schedule,
            word_count,
            generated_at: chrono::Utc::now().to_rfc3339(),
        })
    }

    async fn generate_hcpc(
        &self,
        request: &ComplaintRequest,
        findings: &[FindingRecord],
    ) -> Result<ComplaintOutput, String> {
        let mut sections = Vec::new();
        let mut evidence_schedule = Vec::new();
        let mut evidence_idx = 1;

        // Section 1: About You
        sections.push(ComplaintSection {
            heading: "1. About You".to_string(),
            content: format!(
                "Name: {}\n{}{}\nRelationship to registrant: Service user/affected party\n",
                request.complainant_name,
                request.complainant_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
                request.complainant_email.as_ref().map(|e| format!("Email: {}\n", e)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        // Section 2: About the Registrant
        sections.push(ComplaintSection {
            heading: "2. About the Registrant".to_string(),
            content: format!(
                "Name: {}\n{}\nProfession: [To be confirmed]\nRegistration number: [If known]\n",
                request.respondent_name,
                request.respondent_address.as_ref().map(|a| format!("Employer: {}\n", a)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        // Section 3: Concern Details
        let mut concerns = String::new();
        concerns.push_str(&format!("## Summary\n\n{}\n\n",
            request.summary.clone().unwrap_or_else(||
                "This concern relates to the professional conduct of an HCPC registrant.".to_string()
            )
        ));

        concerns.push_str("## Standards of Conduct, Performance and Ethics\n\n");
        concerns.push_str("The following standards may have been breached:\n\n");

        for finding in findings {
            let evidence_label = format!("E{}", evidence_idx);
            concerns.push_str(&format!(
                "### {} [{}]\n\n{}\n\nSeverity: {}\n\n",
                finding.title,
                evidence_label,
                finding.description,
                finding.severity.to_uppercase()
            ));
            evidence_schedule.push(EvidenceItem {
                id: evidence_label.clone(),
                label: evidence_label,
                description: finding.title.clone(),
                document_ref: None,
                page_ref: None,
                quote: Some(finding.description.clone()),
            });
            evidence_idx += 1;
        }

        sections.push(ComplaintSection {
            heading: "3. Details of Your Concern".to_string(),
            content: concerns,
            evidence_refs: evidence_schedule.iter().map(|e| e.id.clone()).collect(),
        });

        // Section 4: Impact
        sections.push(ComplaintSection {
            heading: "4. Impact".to_string(),
            content: "The conduct identified has had a significant impact and raises \
                questions about the registrant's fitness to practise.".to_string(),
            evidence_refs: vec![],
        });

        let content = self.format_output(&sections, &evidence_schedule, &request.format);
        let word_count = content.split_whitespace().count();

        Ok(ComplaintOutput {
            regulatory_body: RegulatoryBody::Hcpc,
            format: request.format,
            title: format!("HCPC Fitness to Practise Concern: {}", request.subject),
            content,
            sections,
            evidence_schedule,
            word_count,
            generated_at: chrono::Utc::now().to_rfc3339(),
        })
    }

    async fn generate_lgo(
        &self,
        request: &ComplaintRequest,
        findings: &[FindingRecord],
    ) -> Result<ComplaintOutput, String> {
        let mut sections = Vec::new();
        let mut evidence_schedule = Vec::new();
        let mut evidence_idx = 1;

        // Section 1: Your Details
        sections.push(ComplaintSection {
            heading: "1. Your Details".to_string(),
            content: format!(
                "Name: {}\n{}{}\n",
                request.complainant_name,
                request.complainant_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
                request.complainant_email.as_ref().map(|e| format!("Email: {}\n", e)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        // Section 2: Council Details
        sections.push(ComplaintSection {
            heading: "2. Council/Organisation".to_string(),
            content: format!(
                "Name: {}\n{}\n",
                request.respondent_name,
                request.respondent_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        // Section 3: Complaint
        let mut complaint = String::new();
        complaint.push_str(&format!("## Summary\n\n{}\n\n",
            request.summary.clone().unwrap_or_else(||
                "This complaint concerns maladministration causing injustice.".to_string()
            )
        ));

        complaint.push_str("## Maladministration and Service Failures\n\n");

        for finding in findings {
            let evidence_label = format!("E{}", evidence_idx);
            complaint.push_str(&format!(
                "### {} [{}]\n\n{}\n\nSeverity: {}\n\n",
                finding.title,
                evidence_label,
                finding.description,
                finding.severity.to_uppercase()
            ));
            evidence_schedule.push(EvidenceItem {
                id: evidence_label.clone(),
                label: evidence_label,
                description: finding.title.clone(),
                document_ref: None,
                page_ref: None,
                quote: Some(finding.description.clone()),
            });
            evidence_idx += 1;
        }

        sections.push(ComplaintSection {
            heading: "3. What Went Wrong".to_string(),
            content: complaint,
            evidence_refs: evidence_schedule.iter().map(|e| e.id.clone()).collect(),
        });

        // Section 4: Injustice
        sections.push(ComplaintSection {
            heading: "4. Injustice Caused".to_string(),
            content: "The maladministration identified has caused significant injustice including:\n\n\
                - Distress and anxiety\n\
                - Loss of opportunity\n\
                - Financial loss\n\
                - Time and trouble pursuing complaints\n".to_string(),
            evidence_refs: vec![],
        });

        // Section 5: Remedy
        sections.push(ComplaintSection {
            heading: "5. Remedy Sought".to_string(),
            content: "I request:\n\n\
                1. A formal finding of maladministration\n\
                2. An apology\n\
                3. Review of procedures to prevent recurrence\n\
                4. Appropriate financial remedy\n".to_string(),
            evidence_refs: vec![],
        });

        let content = self.format_output(&sections, &evidence_schedule, &request.format);
        let word_count = content.split_whitespace().count();

        Ok(ComplaintOutput {
            regulatory_body: RegulatoryBody::Lgo,
            format: request.format,
            title: format!("LGO Complaint: {}", request.subject),
            content,
            sections,
            evidence_schedule,
            word_count,
            generated_at: chrono::Utc::now().to_rfc3339(),
        })
    }

    async fn generate_generic(
        &self,
        request: &ComplaintRequest,
        findings: &[FindingRecord],
    ) -> Result<ComplaintOutput, String> {
        let mut sections = Vec::new();
        let mut evidence_schedule = Vec::new();
        let mut evidence_idx = 1;

        sections.push(ComplaintSection {
            heading: "1. Complainant".to_string(),
            content: format!(
                "Name: {}\n{}{}\n",
                request.complainant_name,
                request.complainant_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
                request.complainant_email.as_ref().map(|e| format!("Email: {}\n", e)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        sections.push(ComplaintSection {
            heading: "2. Respondent".to_string(),
            content: format!(
                "Name: {}\n{}\n",
                request.respondent_name,
                request.respondent_address.as_ref().map(|a| format!("Address: {}\n", a)).unwrap_or_default(),
            ),
            evidence_refs: vec![],
        });

        let mut details = format!("## Summary\n\n{}\n\n## Issues Identified\n\n",
            request.summary.clone().unwrap_or_else(|| "Formal complaint.".to_string())
        );

        for finding in findings {
            let evidence_label = format!("E{}", evidence_idx);
            details.push_str(&format!(
                "### {} [{}]\n\n{}\n\n",
                finding.title,
                evidence_label,
                finding.description
            ));
            evidence_schedule.push(EvidenceItem {
                id: evidence_label.clone(),
                label: evidence_label,
                description: finding.title.clone(),
                document_ref: None,
                page_ref: None,
                quote: Some(finding.description.clone()),
            });
            evidence_idx += 1;
        }

        sections.push(ComplaintSection {
            heading: "3. Complaint Details".to_string(),
            content: details,
            evidence_refs: evidence_schedule.iter().map(|e| e.id.clone()).collect(),
        });

        let content = self.format_output(&sections, &evidence_schedule, &request.format);
        let word_count = content.split_whitespace().count();

        Ok(ComplaintOutput {
            regulatory_body: request.regulatory_body,
            format: request.format,
            title: format!("{} Complaint: {}", request.regulatory_body.full_name(), request.subject),
            content,
            sections,
            evidence_schedule,
            word_count,
            generated_at: chrono::Utc::now().to_rfc3339(),
        })
    }

    fn format_output(
        &self,
        sections: &[ComplaintSection],
        evidence: &[EvidenceItem],
        format: &ComplaintFormat,
    ) -> String {
        match format {
            ComplaintFormat::Markdown => self.format_markdown(sections, evidence),
            ComplaintFormat::Text => self.format_text(sections, evidence),
            ComplaintFormat::Html => self.format_html(sections, evidence),
        }
    }

    fn format_markdown(&self, sections: &[ComplaintSection], evidence: &[EvidenceItem]) -> String {
        let mut output = String::new();

        for section in sections {
            output.push_str(&format!("## {}\n\n{}\n\n", section.heading, section.content));
        }

        if !evidence.is_empty() {
            output.push_str("---\n\n## Evidence Schedule\n\n");
            output.push_str("| Ref | Description |\n|-----|-------------|\n");
            for item in evidence {
                output.push_str(&format!("| {} | {} |\n", item.label, item.description));
            }
        }

        output
    }

    fn format_text(&self, sections: &[ComplaintSection], evidence: &[EvidenceItem]) -> String {
        let mut output = String::new();

        for section in sections {
            output.push_str(&format!("{}\n{}\n\n{}\n\n",
                section.heading,
                "=".repeat(section.heading.len()),
                section.content.replace("##", "").replace("###", "").replace("**", "")
            ));
        }

        if !evidence.is_empty() {
            output.push_str("EVIDENCE SCHEDULE\n=================\n\n");
            for item in evidence {
                output.push_str(&format!("[{}] {}\n", item.label, item.description));
            }
        }

        output
    }

    fn format_html(&self, sections: &[ComplaintSection], evidence: &[EvidenceItem]) -> String {
        let mut output = String::from("<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;}h2{border-bottom:1px solid #ccc;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}</style></head><body>");

        for section in sections {
            let content_html = section.content
                .replace("\n\n", "</p><p>")
                .replace("\n", "<br>");
            output.push_str(&format!("<h2>{}</h2><p>{}</p>", section.heading, content_html));
        }

        if !evidence.is_empty() {
            output.push_str("<hr><h2>Evidence Schedule</h2><table><tr><th>Ref</th><th>Description</th></tr>");
            for item in evidence {
                output.push_str(&format!("<tr><td>{}</td><td>{}</td></tr>", item.label, item.description));
            }
            output.push_str("</table>");
        }

        output.push_str("</body></html>");
        output
    }

    async fn store_complaint(
        &self,
        request: &ComplaintRequest,
        output: &ComplaintOutput,
    ) -> Result<(), String> {
        let id = uuid::Uuid::new_v4().to_string();
        let now = chrono::Utc::now().to_rfc3339();

        sqlx::query(
            r#"INSERT INTO regulatory_submissions
               (id, case_id, regulator, status, submission_date, reference_number, notes, created_at, updated_at)
               VALUES (?, ?, ?, 'draft', ?, NULL, ?, ?, ?)"#,
        )
        .bind(&id)
        .bind(&request.case_id)
        .bind(request.regulatory_body.as_str())
        .bind(&now)
        .bind(&output.title)
        .bind(&now)
        .bind(&now)
        .execute(&self.pool)
        .await
        .map_err(|e| format!("Failed to store complaint: {}", e))?;

        log::info!("Stored complaint {} for case {}", id, request.case_id);
        Ok(())
    }
}

/// Finding record from database
#[derive(Debug, sqlx::FromRow)]
#[allow(dead_code)] // sqlx::FromRow - all SELECT columns must have matching fields
struct FindingRecord {
    id: String,
    case_id: String,
    engine: String,
    title: String,
    description: String,
    severity: String,
    document_ids: Option<String>,
    evidence: Option<String>,
    created_at: String,
}

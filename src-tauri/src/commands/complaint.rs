//! Complaint Generation Commands
//!
//! Tauri commands for generating regulatory complaints from findings.

use serde::{Deserialize, Serialize};
use tauri::State;

use crate::complaint::{
    ComplaintGenerator, ComplaintRequest, ComplaintOutput,
    ComplaintFormat, RegulatoryBody,
};
use crate::AppState;

/// Input for generating a complaint
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenerateComplaintInput {
    pub case_id: String,
    pub regulatory_body: String,
    pub format: String,
    pub complainant_name: String,
    pub complainant_address: Option<String>,
    pub complainant_email: Option<String>,
    pub complainant_phone: Option<String>,
    pub respondent_name: String,
    pub respondent_address: Option<String>,
    pub subject: String,
    pub summary: Option<String>,
    pub finding_ids: Vec<String>,
    pub additional_context: Option<String>,
    pub events_from: Option<String>,
    pub events_to: Option<String>,
}

/// Result of complaint generation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GenerateComplaintResult {
    pub success: bool,
    pub complaint: Option<ComplaintOutput>,
    pub error: Option<String>,
}

/// List of available regulatory bodies
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegulatoryBodyInfo {
    pub id: String,
    pub name: String,
    pub full_name: String,
    pub description: String,
}

/// Generate a complaint from findings
#[tauri::command]
pub async fn generate_complaint(
    state: State<'_, AppState>,
    input: GenerateComplaintInput,
) -> Result<GenerateComplaintResult, String> {
    let db = state.db.read().await;

    // Parse regulatory body
    let regulatory_body = parse_regulatory_body(&input.regulatory_body)?;

    // Parse format
    let format = match input.format.to_lowercase().as_str() {
        "markdown" | "md" => ComplaintFormat::Markdown,
        "text" | "txt" => ComplaintFormat::Text,
        "html" => ComplaintFormat::Html,
        _ => ComplaintFormat::Markdown,
    };

    // Build request
    let request = ComplaintRequest {
        case_id: input.case_id,
        regulatory_body,
        format,
        complainant_name: input.complainant_name,
        complainant_address: input.complainant_address,
        complainant_email: input.complainant_email,
        complainant_phone: input.complainant_phone,
        respondent_name: input.respondent_name,
        respondent_address: input.respondent_address,
        subject: input.subject,
        summary: input.summary,
        finding_ids: input.finding_ids,
        additional_context: input.additional_context,
        events_from: input.events_from,
        events_to: input.events_to,
    };

    // Generate complaint
    let mut generator = ComplaintGenerator::new(db.pool().clone());
    let _ = generator.try_init_ai(); // Optional AI enhancement

    match generator.generate(request).await {
        Ok(complaint) => Ok(GenerateComplaintResult {
            success: true,
            complaint: Some(complaint),
            error: None,
        }),
        Err(e) => Ok(GenerateComplaintResult {
            success: false,
            complaint: None,
            error: Some(e),
        }),
    }
}

/// List available regulatory bodies
#[tauri::command]
pub async fn list_regulatory_bodies() -> Result<Vec<RegulatoryBodyInfo>, String> {
    Ok(vec![
        RegulatoryBodyInfo {
            id: "ofcom".to_string(),
            name: "Ofcom".to_string(),
            full_name: "Office of Communications".to_string(),
            description: "Broadcasting regulator - complaints about TV/radio content".to_string(),
        },
        RegulatoryBodyInfo {
            id: "ico".to_string(),
            name: "ICO".to_string(),
            full_name: "Information Commissioner's Office".to_string(),
            description: "Data protection regulator - GDPR complaints".to_string(),
        },
        RegulatoryBodyInfo {
            id: "hcpc".to_string(),
            name: "HCPC".to_string(),
            full_name: "Health and Care Professions Council".to_string(),
            description: "Regulator for health professionals - fitness to practise concerns".to_string(),
        },
        RegulatoryBodyInfo {
            id: "lgo".to_string(),
            name: "LGO".to_string(),
            full_name: "Local Government and Social Care Ombudsman".to_string(),
            description: "Investigates maladministration by councils".to_string(),
        },
        RegulatoryBodyInfo {
            id: "bps".to_string(),
            name: "BPS".to_string(),
            full_name: "British Psychological Society".to_string(),
            description: "Professional body for psychologists".to_string(),
        },
        RegulatoryBodyInfo {
            id: "gmc".to_string(),
            name: "GMC".to_string(),
            full_name: "General Medical Council".to_string(),
            description: "Regulator for doctors".to_string(),
        },
        RegulatoryBodyInfo {
            id: "nmc".to_string(),
            name: "NMC".to_string(),
            full_name: "Nursing and Midwifery Council".to_string(),
            description: "Regulator for nurses and midwives".to_string(),
        },
        RegulatoryBodyInfo {
            id: "sra".to_string(),
            name: "SRA".to_string(),
            full_name: "Solicitors Regulation Authority".to_string(),
            description: "Regulator for solicitors".to_string(),
        },
        RegulatoryBodyInfo {
            id: "bsb".to_string(),
            name: "BSB".to_string(),
            full_name: "Bar Standards Board".to_string(),
            description: "Regulator for barristers".to_string(),
        },
        RegulatoryBodyInfo {
            id: "swe".to_string(),
            name: "SWE".to_string(),
            full_name: "Social Work England".to_string(),
            description: "Regulator for social workers".to_string(),
        },
    ])
}

/// Get complaint templates for a regulatory body
#[tauri::command]
pub async fn get_complaint_template(
    regulatory_body: String,
) -> Result<ComplaintTemplateInfo, String> {
    let body = parse_regulatory_body(&regulatory_body)?;

    let (required_sections, relevant_codes) = match body {
        RegulatoryBody::Ofcom => (
            vec![
                "Complainant Details".to_string(),
                "Programme Details".to_string(),
                "Summary of Complaint".to_string(),
                "Broadcasting Code Breaches".to_string(),
                "Remedy Sought".to_string(),
            ],
            vec![
                "Section 5: Due Impartiality".to_string(),
                "Section 7: Privacy".to_string(),
                "Section 8: Fairness".to_string(),
            ],
        ),
        RegulatoryBody::Ico => (
            vec![
                "Your Details".to_string(),
                "Organisation Details".to_string(),
                "What Happened".to_string(),
                "What You Want".to_string(),
                "Steps Taken".to_string(),
            ],
            vec![
                "Article 5: Data Protection Principles".to_string(),
                "Article 6: Lawful Basis".to_string(),
                "Article 7: Consent".to_string(),
                "Article 9: Special Category Data".to_string(),
                "Article 17: Right to Erasure".to_string(),
                "Article 21: Right to Object".to_string(),
            ],
        ),
        RegulatoryBody::Hcpc => (
            vec![
                "About You".to_string(),
                "About the Registrant".to_string(),
                "Details of Your Concern".to_string(),
                "Impact".to_string(),
            ],
            vec![
                "Standard 1: Promote and protect interests".to_string(),
                "Standard 3: Work within competence".to_string(),
                "Standard 5: Respect confidentiality".to_string(),
                "Standard 9: Be honest and trustworthy".to_string(),
                "Standard 10: Keep records".to_string(),
            ],
        ),
        RegulatoryBody::Lgo => (
            vec![
                "Your Details".to_string(),
                "Council/Organisation".to_string(),
                "What Went Wrong".to_string(),
                "Injustice Caused".to_string(),
                "Remedy Sought".to_string(),
            ],
            vec![
                "Maladministration: Delay".to_string(),
                "Maladministration: Incorrect action".to_string(),
                "Maladministration: Failure to act".to_string(),
                "Maladministration: Failure to follow procedure".to_string(),
                "Service Failure".to_string(),
            ],
        ),
        _ => (
            vec![
                "Complainant".to_string(),
                "Respondent".to_string(),
                "Complaint Details".to_string(),
            ],
            vec![],
        ),
    };

    Ok(ComplaintTemplateInfo {
        regulatory_body: body.as_str().to_string(),
        name: body.full_name().to_string(),
        required_sections,
        relevant_codes,
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplaintTemplateInfo {
    pub regulatory_body: String,
    pub name: String,
    pub required_sections: Vec<String>,
    pub relevant_codes: Vec<String>,
}

fn parse_regulatory_body(s: &str) -> Result<RegulatoryBody, String> {
    match s.to_lowercase().as_str() {
        "ofcom" => Ok(RegulatoryBody::Ofcom),
        "ico" => Ok(RegulatoryBody::Ico),
        "hcpc" => Ok(RegulatoryBody::Hcpc),
        "lgo" => Ok(RegulatoryBody::Lgo),
        "bps" => Ok(RegulatoryBody::Bps),
        "gmc" => Ok(RegulatoryBody::Gmc),
        "nmc" => Ok(RegulatoryBody::Nmc),
        "sra" => Ok(RegulatoryBody::Sra),
        "bsb" => Ok(RegulatoryBody::Bsb),
        "swe" => Ok(RegulatoryBody::Swe),
        _ => Err(format!("Unknown regulatory body: {}", s)),
    }
}

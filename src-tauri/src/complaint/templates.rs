//! Complaint Templates
//!
//! Template definitions for different regulatory bodies.

use serde::{Deserialize, Serialize};

/// Trait for complaint templates
pub trait ComplaintTemplate {
    fn name(&self) -> &'static str;
    fn required_sections(&self) -> Vec<&'static str>;
    fn regulatory_codes(&self) -> Vec<&'static str>;
}

/// Ofcom complaint template
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OfcomTemplate {
    pub sections: Vec<OfcomSection>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OfcomSection {
    Section5DueImpartiality,
    Section7Privacy,
    Section8Fairness,
}

impl Default for OfcomTemplate {
    fn default() -> Self {
        Self {
            sections: vec![
                OfcomSection::Section5DueImpartiality,
                OfcomSection::Section7Privacy,
                OfcomSection::Section8Fairness,
            ],
        }
    }
}

impl ComplaintTemplate for OfcomTemplate {
    fn name(&self) -> &'static str {
        "Ofcom Broadcasting Code Complaint"
    }

    fn required_sections(&self) -> Vec<&'static str> {
        vec![
            "Complainant Details",
            "Programme Details",
            "Summary of Complaint",
            "Broadcasting Code Breaches",
            "Remedy Sought",
        ]
    }

    fn regulatory_codes(&self) -> Vec<&'static str> {
        vec![
            "Section 5: Due Impartiality",
            "Section 7: Privacy",
            "Section 8: Fairness",
        ]
    }
}

/// ICO GDPR complaint template
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IcoTemplate {
    pub articles: Vec<GdprArticle>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GdprArticle {
    Article5Principles,
    Article6LawfulBasis,
    Article7Consent,
    Article9SpecialCategory,
    Article12Transparency,
    Article13Information,
    Article15Access,
    Article17Erasure,
    Article21Object,
    Article22AutomatedDecisions,
}

impl Default for IcoTemplate {
    fn default() -> Self {
        Self {
            articles: vec![
                GdprArticle::Article6LawfulBasis,
                GdprArticle::Article7Consent,
                GdprArticle::Article17Erasure,
                GdprArticle::Article21Object,
            ],
        }
    }
}

impl ComplaintTemplate for IcoTemplate {
    fn name(&self) -> &'static str {
        "ICO Data Protection Complaint"
    }

    fn required_sections(&self) -> Vec<&'static str> {
        vec![
            "Your Details",
            "Organisation Details",
            "What Happened",
            "What You Want",
            "Steps Taken",
        ]
    }

    fn regulatory_codes(&self) -> Vec<&'static str> {
        vec![
            "UK GDPR Article 5: Principles",
            "UK GDPR Article 6: Lawful Basis",
            "UK GDPR Article 7: Consent",
            "UK GDPR Article 9: Special Category Data",
            "UK GDPR Article 17: Right to Erasure",
            "UK GDPR Article 21: Right to Object",
        ]
    }
}

/// HCPC fitness to practise concern template
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HcpcTemplate {
    pub standards: Vec<HcpcStandard>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum HcpcStandard {
    Standard1ActInBestInterests,
    Standard2Communicate,
    Standard3ObtainConsent,
    Standard4ConfidentialInfo,
    Standard5Competence,
    Standard6ManageRisk,
    Standard7ReportConcerns,
    Standard8OpenAndHonest,
    Standard9Supervision,
    Standard10KeepRecords,
}

impl Default for HcpcTemplate {
    fn default() -> Self {
        Self {
            standards: vec![
                HcpcStandard::Standard1ActInBestInterests,
                HcpcStandard::Standard5Competence,
                HcpcStandard::Standard8OpenAndHonest,
                HcpcStandard::Standard10KeepRecords,
            ],
        }
    }
}

impl ComplaintTemplate for HcpcTemplate {
    fn name(&self) -> &'static str {
        "HCPC Fitness to Practise Concern"
    }

    fn required_sections(&self) -> Vec<&'static str> {
        vec![
            "About You",
            "About the Registrant",
            "Details of Your Concern",
            "Impact",
        ]
    }

    fn regulatory_codes(&self) -> Vec<&'static str> {
        vec![
            "Standard 1: Promote and protect service users' interests",
            "Standard 2: Communicate appropriately and effectively",
            "Standard 3: Work within limits of knowledge and skills",
            "Standard 4: Delegate appropriately",
            "Standard 5: Respect confidentiality",
            "Standard 6: Manage risk",
            "Standard 7: Report concerns about safety",
            "Standard 8: Be open when things go wrong",
            "Standard 9: Be honest and trustworthy",
            "Standard 10: Keep records of work",
        ]
    }
}

/// LGO maladministration complaint template
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LgoTemplate {
    pub maladministration_types: Vec<MaladministrationType>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MaladministrationType {
    Delay,
    IncorrectAction,
    FailureToAct,
    FailureToFollowProcedure,
    FailureToProvideService,
    FailureToGiveInformation,
    Discourtesy,
    Bias,
}

impl Default for LgoTemplate {
    fn default() -> Self {
        Self {
            maladministration_types: vec![
                MaladministrationType::FailureToFollowProcedure,
                MaladministrationType::FailureToAct,
                MaladministrationType::IncorrectAction,
            ],
        }
    }
}

impl ComplaintTemplate for LgoTemplate {
    fn name(&self) -> &'static str {
        "LGO Maladministration Complaint"
    }

    fn required_sections(&self) -> Vec<&'static str> {
        vec![
            "Your Details",
            "Council/Organisation",
            "What Went Wrong",
            "Injustice Caused",
            "Remedy Sought",
        ]
    }

    fn regulatory_codes(&self) -> Vec<&'static str> {
        vec![
            "Maladministration: Delay",
            "Maladministration: Incorrect action",
            "Maladministration: Failure to act",
            "Maladministration: Failure to follow procedure",
            "Service Failure: Failure to provide a service",
        ]
    }
}

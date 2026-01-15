//! ARGUMENTATION ENGINE (Α)
//!
//! "Toulmin Structure Analysis"
//!
//! Builds formal argument structures from claims in documents,
//! identifying claims, grounds, warrants, backing, qualifiers, and rebuttals.
//!
//! Core Question: What is the logical structure of this argument?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Strength of an argument component
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ArgumentStrength {
    Definitive,
    Strong,
    Moderate,
    Weak,
    Asserted,
}

impl ArgumentStrength {
    pub fn as_str(&self) -> &'static str {
        match self {
            ArgumentStrength::Definitive => "definitive",
            ArgumentStrength::Strong => "strong",
            ArgumentStrength::Moderate => "moderate",
            ArgumentStrength::Weak => "weak",
            ArgumentStrength::Asserted => "asserted",
        }
    }
}

/// Type of logical fallacy
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FallacyType {
    /// Circular reasoning
    CircularReasoning,
    /// Appeal to authority without verification
    AppealToAuthority,
    /// Ad hominem attack
    AdHominem,
    /// Straw man argument
    StrawMan,
    /// False dichotomy
    FalseDichotomy,
    /// Slippery slope
    SlipperySlope,
    /// Hasty generalization
    HastyGeneralization,
    /// Post hoc ergo propter hoc
    PostHoc,
    /// Non sequitur
    NonSequitur,
    /// Begging the question
    BeggingTheQuestion,
    /// Red herring
    RedHerring,
    /// Other fallacy
    Other,
}

impl FallacyType {
    pub fn as_str(&self) -> &'static str {
        match self {
            FallacyType::CircularReasoning => "circular_reasoning",
            FallacyType::AppealToAuthority => "appeal_to_authority",
            FallacyType::AdHominem => "ad_hominem",
            FallacyType::StrawMan => "straw_man",
            FallacyType::FalseDichotomy => "false_dichotomy",
            FallacyType::SlipperySlope => "slippery_slope",
            FallacyType::HastyGeneralization => "hasty_generalization",
            FallacyType::PostHoc => "post_hoc",
            FallacyType::NonSequitur => "non_sequitur",
            FallacyType::BeggingTheQuestion => "begging_the_question",
            FallacyType::RedHerring => "red_herring",
            FallacyType::Other => "other",
        }
    }
}

/// A Toulmin argument structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToulminArgument {
    pub id: String,
    /// The main claim being made
    pub claim: String,
    /// Evidence supporting the claim
    pub grounds: Vec<String>,
    /// The reasoning connecting grounds to claim
    pub warrant: Option<String>,
    /// Supporting evidence for the warrant
    pub backing: Vec<String>,
    /// Qualifiers limiting the claim
    pub qualifier: Option<String>,
    /// Potential rebuttals or exceptions
    pub rebuttals: Vec<String>,
    /// Overall strength of the argument
    pub strength: ArgumentStrength,
    /// Document source
    pub document_id: String,
    pub document_name: String,
    pub page_ref: Option<i32>,
    /// Who made this argument
    pub arguer: Option<String>,
}

/// A detected logical fallacy
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogicalFallacy {
    pub id: String,
    pub fallacy_type: FallacyType,
    pub description: String,
    pub argument_text: String,
    pub explanation: String,
    pub document_id: String,
    pub document_name: String,
    pub page_ref: Option<i32>,
}

/// An argument chain showing how arguments build on each other
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArgumentChain {
    pub id: String,
    pub root_argument_id: String,
    pub chain: Vec<String>,  // IDs of arguments in sequence
    pub description: String,
}

/// Summary of argumentation analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArgumentationSummary {
    pub total_arguments: i32,
    pub strong_arguments: i32,
    pub weak_arguments: i32,
    pub fallacies_found: i32,
    pub argument_chains: i32,
    pub most_common_fallacy: Option<String>,
    pub weakest_arguments: Vec<String>,
}

/// Complete result of argumentation analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ArgumentationResult {
    pub arguments: Vec<ToulminArgument>,
    pub fallacies: Vec<LogicalFallacy>,
    pub chains: Vec<ArgumentChain>,
    pub summary: ArgumentationSummary,
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
struct AIArgumentationResponse {
    arguments: Vec<AIArgument>,
    fallacies: Vec<AIFallacy>,
    chains: Vec<AIChain>,
}

#[derive(Debug, Deserialize)]
struct AIArgument {
    claim: String,
    grounds: Vec<String>,
    warrant: Option<String>,
    backing: Vec<String>,
    qualifier: Option<String>,
    rebuttals: Vec<String>,
    strength: String,
    #[serde(rename = "documentId")]
    document_id: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
    arguer: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIFallacy {
    #[serde(rename = "fallacyType")]
    fallacy_type: String,
    description: String,
    #[serde(rename = "argumentText")]
    argument_text: String,
    explanation: String,
    #[serde(rename = "documentId")]
    document_id: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
}

#[derive(Debug, Deserialize)]
struct AIChain {
    #[serde(rename = "rootArgumentIndex")]
    root_argument_index: usize,
    #[serde(rename = "chainIndices")]
    chain_indices: Vec<usize>,
    description: String,
}

/// The Argumentation Engine
pub struct ArgumentationEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl ArgumentationEngine {
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

    /// Analyze arguments in documents
    pub async fn analyze_arguments(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<ArgumentationResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_analyze(case_id).await;
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
            r#"Analyze these documents using TOULMIN ARGUMENTATION STRUCTURE.

TOULMIN MODEL COMPONENTS:
1. CLAIM: The main assertion being made
2. GROUNDS: Evidence/facts supporting the claim
3. WARRANT: The reasoning connecting grounds to claim (often implicit)
4. BACKING: Support for the warrant itself
5. QUALIFIER: Limits on the claim ("usually", "in most cases")
6. REBUTTAL: Exceptions or counter-arguments acknowledged

ARGUMENT STRENGTH:
- definitive: Proven beyond doubt
- strong: Well-supported, few weaknesses
- moderate: Supported but with gaps
- weak: Poorly supported, significant gaps
- asserted: Claimed without support

LOGICAL FALLACIES TO DETECT:
- circular_reasoning: Conclusion assumed in premises
- appeal_to_authority: Citing authority without verification
- ad_hominem: Attacking person instead of argument
- straw_man: Misrepresenting opponent's position
- false_dichotomy: Presenting only two options when more exist
- slippery_slope: Assuming chain of events without justification
- hasty_generalization: Broad conclusion from limited evidence
- post_hoc: Assuming causation from correlation
- non_sequitur: Conclusion doesn't follow from premises
- begging_the_question: Assuming what needs to be proved

DOCUMENTS TO ANALYZE:
{}

Respond in JSON:
{{
  "arguments": [
    {{
      "claim": "the main claim",
      "grounds": ["evidence 1", "evidence 2"],
      "warrant": "reasoning connecting grounds to claim" or null,
      "backing": ["support for warrant"],
      "qualifier": "limitation on claim" or null,
      "rebuttals": ["potential counter-arguments"],
      "strength": "definitive|strong|moderate|weak|asserted",
      "documentId": "doc-id",
      "pageRef": number or null,
      "arguer": "who made this argument" or null
    }}
  ],
  "fallacies": [
    {{
      "fallacyType": "circular_reasoning|appeal_to_authority|...",
      "description": "what the fallacy is",
      "argumentText": "the problematic text",
      "explanation": "why this is a fallacy",
      "documentId": "doc-id",
      "pageRef": number or null
    }}
  ],
  "chains": [
    {{
      "rootArgumentIndex": 0,
      "chainIndices": [0, 2, 5],
      "description": "how arguments build on each other"
    }}
  ]
}}"#,
            formatted_docs
        );

        let system = "You are a forensic argumentation analyst specializing in Toulmin argument structure. \
            You deconstruct arguments into their logical components, identify weaknesses, \
            and detect logical fallacies. You are particularly skilled at finding implicit warrants \
            and unstated assumptions.";

        let response: AIArgumentationResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert response
        let arguments: Vec<ToulminArgument> = response.arguments
            .into_iter()
            .enumerate()
            .map(|(idx, a)| {
                let doc_name = documents.iter()
                    .find(|d| d.id == a.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());
                ToulminArgument {
                    id: format!("arg-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    claim: a.claim,
                    grounds: a.grounds,
                    warrant: a.warrant,
                    backing: a.backing,
                    qualifier: a.qualifier,
                    rebuttals: a.rebuttals,
                    strength: parse_strength(&a.strength),
                    document_id: a.document_id,
                    document_name: doc_name,
                    page_ref: a.page_ref,
                    arguer: a.arguer,
                }
            })
            .collect();

        let fallacies: Vec<LogicalFallacy> = response.fallacies
            .into_iter()
            .enumerate()
            .map(|(idx, f)| {
                let doc_name = documents.iter()
                    .find(|d| d.id == f.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());
                LogicalFallacy {
                    id: format!("fallacy-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    fallacy_type: parse_fallacy_type(&f.fallacy_type),
                    description: f.description,
                    argument_text: f.argument_text,
                    explanation: f.explanation,
                    document_id: f.document_id,
                    document_name: doc_name,
                    page_ref: f.page_ref,
                }
            })
            .collect();

        let chains: Vec<ArgumentChain> = response.chains
            .into_iter()
            .enumerate()
            .map(|(idx, c)| {
                let root_id = arguments.get(c.root_argument_index)
                    .map(|a| a.id.clone())
                    .unwrap_or_else(|| "unknown".to_string());
                let chain_ids: Vec<String> = c.chain_indices.iter()
                    .filter_map(|&i| arguments.get(i).map(|a| a.id.clone()))
                    .collect();
                ArgumentChain {
                    id: format!("chain-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    root_argument_id: root_id,
                    chain: chain_ids,
                    description: c.description,
                }
            })
            .collect();

        // Calculate summary
        let fallacy_counts = fallacies.iter()
            .fold(std::collections::HashMap::new(), |mut acc, f| {
                *acc.entry(f.fallacy_type.as_str()).or_insert(0) += 1;
                acc
            });
        let most_common = fallacy_counts.into_iter()
            .max_by_key(|(_, count)| *count)
            .map(|(t, _)| t.to_string());

        let weak_args: Vec<String> = arguments.iter()
            .filter(|a| matches!(a.strength, ArgumentStrength::Weak | ArgumentStrength::Asserted))
            .take(5)
            .map(|a| a.claim.clone())
            .collect();

        let summary = ArgumentationSummary {
            total_arguments: arguments.len() as i32,
            strong_arguments: arguments.iter()
                .filter(|a| matches!(a.strength, ArgumentStrength::Definitive | ArgumentStrength::Strong))
                .count() as i32,
            weak_arguments: arguments.iter()
                .filter(|a| matches!(a.strength, ArgumentStrength::Weak | ArgumentStrength::Asserted))
                .count() as i32,
            fallacies_found: fallacies.len() as i32,
            argument_chains: chains.len() as i32,
            most_common_fallacy: most_common,
            weakest_arguments: weak_args,
        };

        // Store findings
        self.store_findings(case_id, &arguments, &fallacies).await?;

        Ok(ArgumentationResult {
            arguments,
            fallacies,
            chains,
            summary,
            is_mock: false,
        })
    }

    async fn store_findings(
        &self,
        case_id: &str,
        arguments: &[ToulminArgument],
        fallacies: &[LogicalFallacy],
    ) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        // Store weak arguments as findings
        for arg in arguments.iter().filter(|a| matches!(a.strength, ArgumentStrength::Weak | ArgumentStrength::Asserted)) {
            let id = Uuid::new_v4().to_string();
            let title = format!("Weak Argument: {}", &arg.claim[..50.min(arg.claim.len())]);

            let evidence = serde_json::json!({
                "claim": arg.claim,
                "grounds": arg.grounds,
                "warrant": arg.warrant,
                "strength": arg.strength.as_str(),
                "arguer": arg.arguer,
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'argumentation', ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&format!("Argument has {} strength with {} grounds", arg.strength.as_str(), arg.grounds.len()))
            .bind(if arg.strength == ArgumentStrength::Asserted { "high" } else { "medium" })
            .bind(serde_json::json!([arg.document_id]).to_string())
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store argument finding: {}", e))?;
        }

        // Store fallacies as findings
        for fallacy in fallacies {
            let id = Uuid::new_v4().to_string();
            let title = format!("Logical Fallacy: {}", fallacy.fallacy_type.as_str());

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'argumentation', ?, ?, 'high', ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&fallacy.description)
            .bind(serde_json::json!([fallacy.document_id]).to_string())
            .bind(&fallacy.explanation)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store fallacy finding: {}", e))?;
        }

        log::info!("Stored argumentation findings for case {}", case_id);
        Ok(())
    }

    async fn mock_analyze(&self, case_id: &str) -> Result<ArgumentationResult, String> {
        log::warn!("Running argumentation analysis in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let arguments = vec![
            ToulminArgument {
                id: format!("arg-{}-0", &case_id[..8.min(case_id.len())]),
                claim: "Contact should be reduced due to child's distress".to_string(),
                grounds: vec!["Child displayed distress at handover".to_string()],
                warrant: Some("Child distress at contact indicates contact is harmful".to_string()),
                backing: vec![],
                qualifier: None,
                rebuttals: vec!["Distress may be caused by transition, not contact itself".to_string()],
                strength: ArgumentStrength::Weak,
                document_id: "mock-doc-1".to_string(),
                document_name: "Assessment Report".to_string(),
                page_ref: Some(15),
                arguer: Some("Social Worker".to_string()),
            },
        ];

        let fallacies = vec![
            LogicalFallacy {
                id: format!("fallacy-{}-0", &case_id[..8.min(case_id.len())]),
                fallacy_type: FallacyType::PostHoc,
                description: "Assumes correlation implies causation".to_string(),
                argument_text: "After contact visits, child showed behavioral difficulties".to_string(),
                explanation: "No consideration of other factors that may cause behavioral difficulties".to_string(),
                document_id: "mock-doc-1".to_string(),
                document_name: "Assessment Report".to_string(),
                page_ref: Some(18),
            },
        ];

        let summary = ArgumentationSummary {
            total_arguments: 1,
            strong_arguments: 0,
            weak_arguments: 1,
            fallacies_found: 1,
            argument_chains: 0,
            most_common_fallacy: Some("post_hoc".to_string()),
            weakest_arguments: vec!["Contact should be reduced due to child's distress".to_string()],
        };

        Ok(ArgumentationResult {
            arguments,
            fallacies,
            chains: vec![],
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_strength(s: &str) -> ArgumentStrength {
    match s.to_lowercase().as_str() {
        "definitive" => ArgumentStrength::Definitive,
        "strong" => ArgumentStrength::Strong,
        "moderate" => ArgumentStrength::Moderate,
        "weak" => ArgumentStrength::Weak,
        "asserted" => ArgumentStrength::Asserted,
        _ => ArgumentStrength::Moderate,
    }
}

fn parse_fallacy_type(s: &str) -> FallacyType {
    match s.to_lowercase().as_str() {
        "circular_reasoning" => FallacyType::CircularReasoning,
        "appeal_to_authority" => FallacyType::AppealToAuthority,
        "ad_hominem" => FallacyType::AdHominem,
        "straw_man" => FallacyType::StrawMan,
        "false_dichotomy" => FallacyType::FalseDichotomy,
        "slippery_slope" => FallacyType::SlipperySlope,
        "hasty_generalization" => FallacyType::HastyGeneralization,
        "post_hoc" => FallacyType::PostHoc,
        "non_sequitur" => FallacyType::NonSequitur,
        "begging_the_question" => FallacyType::BeggingTheQuestion,
        "red_herring" => FallacyType::RedHerring,
        _ => FallacyType::Other,
    }
}

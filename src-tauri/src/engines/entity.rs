//! ENTITY RESOLUTION ENGINE (Ε)
//!
//! "Canonical Identity Mapping"
//!
//! Identifies and resolves entities across documents, mapping aliases to
//! canonical identities and tracking entity relationships.
//!
//! Core Question: Who is this person/organization, and how do they appear across documents?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Type of entity
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EntityType {
    /// Individual person
    Person,
    /// Company, institution, government body
    Organization,
    /// Professional with regulatory body
    Professional,
    /// Court or tribunal
    Court,
    /// Police force or investigative body
    Police,
    /// Local authority, NHS trust, etc.
    Agency,
    /// Expert witness or consultant
    Expert,
    /// Media outlet or broadcaster
    Media,
    /// Physical location
    Location,
    /// Document or evidence item
    DocumentRef,
    /// Unknown or other
    Other,
}

impl EntityType {
    pub fn as_str(&self) -> &'static str {
        match self {
            EntityType::Person => "person",
            EntityType::Organization => "organization",
            EntityType::Professional => "professional",
            EntityType::Court => "court",
            EntityType::Police => "police",
            EntityType::Agency => "agency",
            EntityType::Expert => "expert",
            EntityType::Media => "media",
            EntityType::Location => "location",
            EntityType::DocumentRef => "document_ref",
            EntityType::Other => "other",
        }
    }
}

/// Role an entity plays in proceedings
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EntityRole {
    /// Party making allegations/claims
    Applicant,
    /// Party responding to allegations
    Respondent,
    /// Child/vulnerable person subject of proceedings
    Subject,
    /// Judge, magistrate, or decision maker
    Adjudicator,
    /// Professional providing expert opinion
    ExpertWitness,
    /// Lay witness providing testimony
    FactWitness,
    /// Social worker, CAFCASS officer, etc.
    AssessmentAuthor,
    /// Solicitor, barrister, etc.
    LegalRepresentative,
    /// Guardian ad litem, next friend
    LitigationFriend,
    /// Media entity covering case
    MediaEntity,
    /// Investigating officer
    Investigator,
    /// Role unclear or unknown
    Unknown,
}

impl EntityRole {
    pub fn as_str(&self) -> &'static str {
        match self {
            EntityRole::Applicant => "applicant",
            EntityRole::Respondent => "respondent",
            EntityRole::Subject => "subject",
            EntityRole::Adjudicator => "adjudicator",
            EntityRole::ExpertWitness => "expert_witness",
            EntityRole::FactWitness => "fact_witness",
            EntityRole::AssessmentAuthor => "assessment_author",
            EntityRole::LegalRepresentative => "legal_representative",
            EntityRole::LitigationFriend => "litigation_friend",
            EntityRole::MediaEntity => "media_entity",
            EntityRole::Investigator => "investigator",
            EntityRole::Unknown => "unknown",
        }
    }
}

/// Confidence level for entity resolution
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Confidence {
    Definite,
    High,
    Medium,
    Low,
    Speculative,
}

impl Confidence {
    pub fn as_str(&self) -> &'static str {
        match self {
            Confidence::Definite => "definite",
            Confidence::High => "high",
            Confidence::Medium => "medium",
            Confidence::Low => "low",
            Confidence::Speculative => "speculative",
        }
    }
}

/// An alias or alternate name for an entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityAlias {
    pub name: String,
    pub alias_type: String,  // "full_name", "nickname", "title", "maiden_name", etc.
    pub document_id: String,
    pub confidence: Confidence,
}

/// Professional registration info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProfessionalRegistration {
    pub body: String,        // "HCPC", "GMC", "SRA", etc.
    pub registration_number: Option<String>,
    pub status: Option<String>,
}

/// A resolved entity with canonical identity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResolvedEntity {
    pub id: String,
    pub canonical_name: String,
    pub entity_type: EntityType,
    pub role: EntityRole,
    pub aliases: Vec<EntityAlias>,
    pub first_appearance: Option<String>,
    pub documents_mentioned: Vec<String>,
    pub mention_count: i32,
    pub professional_registration: Option<ProfessionalRegistration>,
    pub description: Option<String>,
    pub relationships: Vec<EntityRelationship>,
}

/// Relationship between two entities
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityRelationship {
    pub id: String,
    pub target_entity_id: String,
    pub target_entity_name: String,
    pub relationship_type: String,  // "parent_of", "employer_of", "represented_by", etc.
    pub confidence: Confidence,
    pub evidence: String,
}

/// Summary of entity resolution analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntitySummary {
    pub total_entities: i32,
    pub persons: i32,
    pub organizations: i32,
    pub professionals: i32,
    pub key_parties: Vec<String>,
    pub aliases_resolved: i32,
    pub relationships_found: i32,
}

/// Complete result of entity resolution
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityResolutionResult {
    pub entities: Vec<ResolvedEntity>,
    pub summary: EntitySummary,
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
struct AIEntityResponse {
    entities: Vec<AIEntity>,
}

#[derive(Debug, Deserialize)]
struct AIEntity {
    #[serde(rename = "canonicalName")]
    canonical_name: String,
    #[serde(rename = "entityType")]
    entity_type: String,
    role: String,
    aliases: Vec<AIAlias>,
    #[serde(rename = "firstAppearance")]
    first_appearance: Option<String>,
    #[serde(rename = "documentsMentioned")]
    documents_mentioned: Vec<String>,
    #[serde(rename = "mentionCount")]
    mention_count: i32,
    #[serde(rename = "professionalRegistration")]
    professional_registration: Option<AIProfessionalReg>,
    description: Option<String>,
    relationships: Vec<AIRelationship>,
}

#[derive(Debug, Deserialize)]
struct AIAlias {
    name: String,
    #[serde(rename = "aliasType")]
    alias_type: String,
    #[serde(rename = "documentId")]
    document_id: String,
    confidence: String,
}

#[derive(Debug, Deserialize)]
struct AIProfessionalReg {
    body: String,
    #[serde(rename = "registrationNumber")]
    registration_number: Option<String>,
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
struct AIRelationship {
    #[serde(rename = "targetEntityName")]
    target_entity_name: String,
    #[serde(rename = "relationshipType")]
    relationship_type: String,
    confidence: String,
    evidence: String,
}

/// The Entity Resolution Engine
pub struct EntityEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl EntityEngine {
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

    /// Resolve entities from documents
    pub async fn resolve_entities(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<EntityResolutionResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_resolve_entities(&documents, case_id).await;
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
            r#"Extract and resolve all ENTITIES from these documents into canonical identities.

ENTITY TYPES:
- person: Individual human beings
- organization: Companies, institutions, government bodies
- professional: Individuals with regulatory body registration (social workers, psychologists, etc.)
- court: Courts, tribunals, judges
- police: Police forces, investigators
- agency: Local authorities, NHS trusts, CAFCASS
- expert: Expert witnesses, consultants
- media: News outlets, broadcasters, journalists
- location: Places, addresses
- document_ref: References to specific documents/evidence

ENTITY ROLES (for persons):
- applicant: Party making claims/allegations
- respondent: Party responding
- subject: Child or vulnerable person at center
- adjudicator: Judge, magistrate
- expert_witness: Professional expert
- fact_witness: Lay witness
- assessment_author: Social worker, CAFCASS officer writing reports
- legal_representative: Solicitor, barrister
- investigator: Police officer, investigator
- media_entity: Media covering case

For EACH entity:
1. Identify CANONICAL NAME (most formal/complete version)
2. Collect ALL ALIASES (nicknames, titles, partial names, maiden names)
3. Track which documents mention them
4. Identify professional registrations where mentioned
5. Map relationships to other entities

DOCUMENTS TO ANALYZE:
{}

Respond in JSON:
{{
  "entities": [
    {{
      "canonicalName": "Full formal name",
      "entityType": "person|organization|professional|court|police|agency|expert|media|location|document_ref|other",
      "role": "applicant|respondent|subject|adjudicator|expert_witness|fact_witness|assessment_author|legal_representative|litigation_friend|media_entity|investigator|unknown",
      "aliases": [
        {{
          "name": "alternate name",
          "aliasType": "nickname|title|maiden_name|abbreviation|misspelling",
          "documentId": "doc-id where found",
          "confidence": "definite|high|medium|low|speculative"
        }}
      ],
      "firstAppearance": "earliest document date if known",
      "documentsMentioned": ["doc-id-1", "doc-id-2"],
      "mentionCount": number,
      "professionalRegistration": {{
        "body": "HCPC|GMC|SRA|NMC",
        "registrationNumber": "optional",
        "status": "registered|struck_off|suspended"
      }} or null,
      "description": "Brief description of role/significance",
      "relationships": [
        {{
          "targetEntityName": "other entity name",
          "relationshipType": "parent_of|child_of|spouse_of|employer_of|represented_by|authored_report_on|investigated",
          "confidence": "definite|high|medium|low",
          "evidence": "Source of relationship info"
        }}
      ]
    }}
  ]
}}"#,
            formatted_docs
        );

        let system = "You are a forensic document analyst specializing in entity extraction and resolution. \
            You identify all persons, organizations, and other entities mentioned in legal documents, \
            resolving different references to the same entity into canonical identities. \
            You are particularly skilled at tracking professional registrations and institutional relationships.";

        let response: AIEntityResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Build entity ID lookup for relationships
        let mut entity_id_map: std::collections::HashMap<String, String> = std::collections::HashMap::new();

        // First pass: assign IDs
        let entities: Vec<ResolvedEntity> = response
            .entities
            .into_iter()
            .enumerate()
            .map(|(idx, e)| {
                let id = format!("entity-{}-{}", &case_id[..8.min(case_id.len())], idx);
                entity_id_map.insert(e.canonical_name.clone(), id.clone());

                ResolvedEntity {
                    id,
                    canonical_name: e.canonical_name,
                    entity_type: parse_entity_type(&e.entity_type),
                    role: parse_entity_role(&e.role),
                    aliases: e.aliases.into_iter().map(|a| EntityAlias {
                        name: a.name,
                        alias_type: a.alias_type,
                        document_id: a.document_id,
                        confidence: parse_confidence(&a.confidence),
                    }).collect(),
                    first_appearance: e.first_appearance,
                    documents_mentioned: e.documents_mentioned,
                    mention_count: e.mention_count,
                    professional_registration: e.professional_registration.map(|pr| ProfessionalRegistration {
                        body: pr.body,
                        registration_number: pr.registration_number,
                        status: pr.status,
                    }),
                    description: e.description,
                    relationships: e.relationships.into_iter().enumerate().map(|(r_idx, r)| {
                        EntityRelationship {
                            id: format!("rel-{}", r_idx),
                            target_entity_id: entity_id_map.get(&r.target_entity_name)
                                .cloned()
                                .unwrap_or_else(|| "unknown".to_string()),
                            target_entity_name: r.target_entity_name,
                            relationship_type: r.relationship_type,
                            confidence: parse_confidence(&r.confidence),
                            evidence: r.evidence,
                        }
                    }).collect(),
                }
            })
            .collect();

        // Calculate summary
        let summary = EntitySummary {
            total_entities: entities.len() as i32,
            persons: entities.iter().filter(|e| e.entity_type == EntityType::Person).count() as i32,
            organizations: entities.iter().filter(|e| e.entity_type == EntityType::Organization || e.entity_type == EntityType::Agency).count() as i32,
            professionals: entities.iter().filter(|e| e.entity_type == EntityType::Professional || e.entity_type == EntityType::Expert).count() as i32,
            key_parties: entities.iter()
                .filter(|e| matches!(e.role, EntityRole::Applicant | EntityRole::Respondent | EntityRole::Subject))
                .map(|e| e.canonical_name.clone())
                .collect(),
            aliases_resolved: entities.iter().map(|e| e.aliases.len() as i32).sum(),
            relationships_found: entities.iter().map(|e| e.relationships.len() as i32).sum(),
        };

        // Store entities
        self.store_entities(case_id, &entities).await?;

        Ok(EntityResolutionResult {
            entities,
            summary,
            is_mock: false,
        })
    }

    async fn store_entities(&self, case_id: &str, entities: &[ResolvedEntity]) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for e in entities {
            let id = Uuid::new_v4().to_string();
            let aliases_json = serde_json::to_string(&e.aliases).unwrap_or_else(|_| "[]".to_string());
            let relationships_json = serde_json::to_string(&e.relationships).unwrap_or_else(|_| "[]".to_string());

            sqlx::query(
                r#"INSERT INTO entities (id, case_id, name, entity_type, roles, aliases, first_seen, last_seen, metadata, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&e.canonical_name)
            .bind(e.entity_type.as_str())
            .bind(e.role.as_str())
            .bind(&aliases_json)
            .bind(&e.first_appearance)
            .bind(&e.first_appearance)
            .bind(&relationships_json)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store entity: {}", e))?;
        }

        log::info!("Stored {} entities for case {}", entities.len(), case_id);
        Ok(())
    }

    async fn mock_resolve_entities(
        &self,
        _documents: &[DocumentInfo],
        case_id: &str,
    ) -> Result<EntityResolutionResult, String> {
        log::warn!("Running entity resolution in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let entities = vec![
            ResolvedEntity {
                id: format!("entity-{}-0", &case_id[..8.min(case_id.len())]),
                canonical_name: "Paul Stephen".to_string(),
                entity_type: EntityType::Person,
                role: EntityRole::Respondent,
                aliases: vec![
                    EntityAlias {
                        name: "Mr Stephen".to_string(),
                        alias_type: "title".to_string(),
                        document_id: "mock-doc-1".to_string(),
                        confidence: Confidence::Definite,
                    },
                    EntityAlias {
                        name: "PS".to_string(),
                        alias_type: "abbreviation".to_string(),
                        document_id: "mock-doc-2".to_string(),
                        confidence: Confidence::High,
                    },
                ],
                first_appearance: Some("2023-03-01".to_string()),
                documents_mentioned: vec!["mock-doc-1".to_string(), "mock-doc-2".to_string()],
                mention_count: 45,
                professional_registration: None,
                description: Some("Father of Ryan, subject of SGO proceedings".to_string()),
                relationships: vec![
                    EntityRelationship {
                        id: "rel-0".to_string(),
                        target_entity_id: format!("entity-{}-2", &case_id[..8.min(case_id.len())]),
                        target_entity_name: "Ryan Dunmore".to_string(),
                        relationship_type: "parent_of".to_string(),
                        confidence: Confidence::Definite,
                        evidence: "Court order states biological father".to_string(),
                    },
                ],
            },
            ResolvedEntity {
                id: format!("entity-{}-1", &case_id[..8.min(case_id.len())]),
                canonical_name: "Samantha Stephen".to_string(),
                entity_type: EntityType::Person,
                role: EntityRole::Respondent,
                aliases: vec![
                    EntityAlias {
                        name: "Mrs Stephen".to_string(),
                        alias_type: "title".to_string(),
                        document_id: "mock-doc-1".to_string(),
                        confidence: Confidence::Definite,
                    },
                ],
                first_appearance: Some("2023-03-01".to_string()),
                documents_mentioned: vec!["mock-doc-1".to_string()],
                mention_count: 38,
                professional_registration: None,
                description: Some("Mother of Ryan".to_string()),
                relationships: vec![
                    EntityRelationship {
                        id: "rel-1".to_string(),
                        target_entity_id: format!("entity-{}-2", &case_id[..8.min(case_id.len())]),
                        target_entity_name: "Ryan Dunmore".to_string(),
                        relationship_type: "parent_of".to_string(),
                        confidence: Confidence::Definite,
                        evidence: "Court order states biological mother".to_string(),
                    },
                ],
            },
            ResolvedEntity {
                id: format!("entity-{}-2", &case_id[..8.min(case_id.len())]),
                canonical_name: "Ryan Dunmore".to_string(),
                entity_type: EntityType::Person,
                role: EntityRole::Subject,
                aliases: vec![
                    EntityAlias {
                        name: "R".to_string(),
                        alias_type: "anonymization".to_string(),
                        document_id: "mock-doc-1".to_string(),
                        confidence: Confidence::High,
                    },
                    EntityAlias {
                        name: "the child".to_string(),
                        alias_type: "description".to_string(),
                        document_id: "mock-doc-2".to_string(),
                        confidence: Confidence::High,
                    },
                ],
                first_appearance: Some("2015-01-01".to_string()),
                documents_mentioned: vec!["mock-doc-1".to_string(), "mock-doc-2".to_string()],
                mention_count: 89,
                professional_registration: None,
                description: Some("Child subject of SGO, born 2015, autism diagnosis".to_string()),
                relationships: vec![],
            },
            ResolvedEntity {
                id: format!("entity-{}-3", &case_id[..8.min(case_id.len())]),
                canonical_name: "Emma Hunnisett".to_string(),
                entity_type: EntityType::Professional,
                role: EntityRole::AssessmentAuthor,
                aliases: vec![
                    EntityAlias {
                        name: "Ms Hunnisett".to_string(),
                        alias_type: "title".to_string(),
                        document_id: "mock-doc-1".to_string(),
                        confidence: Confidence::Definite,
                    },
                ],
                first_appearance: Some("2023-06-01".to_string()),
                documents_mentioned: vec!["mock-doc-1".to_string()],
                mention_count: 12,
                professional_registration: Some(ProfessionalRegistration {
                    body: "HCPC".to_string(),
                    registration_number: None,
                    status: Some("registered".to_string()),
                }),
                description: Some("Social worker, assessment author".to_string()),
                relationships: vec![],
            },
        ];

        let summary = EntitySummary {
            total_entities: 4,
            persons: 3,
            organizations: 0,
            professionals: 1,
            key_parties: vec!["Paul Stephen".to_string(), "Samantha Stephen".to_string(), "Ryan Dunmore".to_string()],
            aliases_resolved: 5,
            relationships_found: 2,
        };

        Ok(EntityResolutionResult {
            entities,
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_entity_type(s: &str) -> EntityType {
    match s.to_lowercase().as_str() {
        "person" => EntityType::Person,
        "organization" => EntityType::Organization,
        "professional" => EntityType::Professional,
        "court" => EntityType::Court,
        "police" => EntityType::Police,
        "agency" => EntityType::Agency,
        "expert" => EntityType::Expert,
        "media" => EntityType::Media,
        "location" => EntityType::Location,
        "document_ref" => EntityType::DocumentRef,
        _ => EntityType::Other,
    }
}

fn parse_entity_role(s: &str) -> EntityRole {
    match s.to_lowercase().as_str() {
        "applicant" => EntityRole::Applicant,
        "respondent" => EntityRole::Respondent,
        "subject" => EntityRole::Subject,
        "adjudicator" => EntityRole::Adjudicator,
        "expert_witness" => EntityRole::ExpertWitness,
        "fact_witness" => EntityRole::FactWitness,
        "assessment_author" => EntityRole::AssessmentAuthor,
        "legal_representative" => EntityRole::LegalRepresentative,
        "litigation_friend" => EntityRole::LitigationFriend,
        "media_entity" => EntityRole::MediaEntity,
        "investigator" => EntityRole::Investigator,
        _ => EntityRole::Unknown,
    }
}

fn parse_confidence(s: &str) -> Confidence {
    match s.to_lowercase().as_str() {
        "definite" => Confidence::Definite,
        "high" => Confidence::High,
        "medium" => Confidence::Medium,
        "low" => Confidence::Low,
        "speculative" => Confidence::Speculative,
        _ => Confidence::Medium,
    }
}

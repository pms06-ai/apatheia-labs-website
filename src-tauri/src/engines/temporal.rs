//! TEMPORAL PARSER ENGINE (Τ)
//!
//! "Timeline Construction and Gap Analysis"
//!
//! Extracts dates and events from documents to construct chronological
//! timelines, identify gaps, and detect temporal anomalies.
//!
//! Core Question: What happened when, and what's missing from the timeline?

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use uuid::Uuid;

use crate::ai::AIClient;

/// Precision level of a date/time
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum DatePrecision {
    Exact,      // Full date and time
    Day,        // Specific day
    Week,       // Week of year
    Month,      // Month and year
    Quarter,    // Quarter of year
    Year,       // Year only
    Approximate // Vague ("early 2023", "around March")
}

impl DatePrecision {
    pub fn as_str(&self) -> &'static str {
        match self {
            DatePrecision::Exact => "exact",
            DatePrecision::Day => "day",
            DatePrecision::Week => "week",
            DatePrecision::Month => "month",
            DatePrecision::Quarter => "quarter",
            DatePrecision::Year => "year",
            DatePrecision::Approximate => "approximate",
        }
    }
}

/// Type of timeline event
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum EventType {
    /// Document created/dated
    Document,
    /// Meeting, hearing, or proceeding
    Meeting,
    /// Decision or ruling made
    Decision,
    /// Communication sent/received
    Communication,
    /// Investigation activity
    Investigation,
    /// Assessment or evaluation
    Assessment,
    /// Complaint or referral
    Complaint,
    /// Contact or visit
    Contact,
    /// Deadline or due date
    Deadline,
    /// Status change
    StatusChange,
    /// Other significant event
    Other,
}

impl EventType {
    pub fn as_str(&self) -> &'static str {
        match self {
            EventType::Document => "document",
            EventType::Meeting => "meeting",
            EventType::Decision => "decision",
            EventType::Communication => "communication",
            EventType::Investigation => "investigation",
            EventType::Assessment => "assessment",
            EventType::Complaint => "complaint",
            EventType::Contact => "contact",
            EventType::Deadline => "deadline",
            EventType::StatusChange => "status_change",
            EventType::Other => "other",
        }
    }
}

/// Type of temporal anomaly detected
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AnomalyType {
    /// Significant unexplained gap in timeline
    UnexplainedGap,
    /// Events out of logical sequence
    OutOfSequence,
    /// Inconsistent dates across documents
    InconsistentDates,
    /// Backdated document (created after events it describes)
    BackdatedDocument,
    /// Impossible timeline (simultaneous conflicting events)
    ImpossibleTimeline,
    /// Missing expected event
    MissingExpected,
    /// Unusual clustering of events
    ClusteringAnomaly,
}

impl AnomalyType {
    pub fn as_str(&self) -> &'static str {
        match self {
            AnomalyType::UnexplainedGap => "unexplained_gap",
            AnomalyType::OutOfSequence => "out_of_sequence",
            AnomalyType::InconsistentDates => "inconsistent_dates",
            AnomalyType::BackdatedDocument => "backdated_document",
            AnomalyType::ImpossibleTimeline => "impossible_timeline",
            AnomalyType::MissingExpected => "missing_expected",
            AnomalyType::ClusteringAnomaly => "clustering_anomaly",
        }
    }
}

/// Severity of an anomaly
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

/// A timeline event extracted from documents
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimelineEvent {
    pub id: String,
    pub date: String,               // ISO 8601 format
    pub date_precision: DatePrecision,
    pub time: Option<String>,       // HH:MM format if known
    pub event_type: EventType,
    pub description: String,
    pub document_id: String,
    pub document_name: String,
    pub page_ref: Option<i32>,
    pub entities_involved: Vec<String>,
    pub significance: String,
}

/// A gap in the timeline
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimelineGap {
    pub id: String,
    pub start_date: String,
    pub end_date: String,
    pub duration_days: i32,
    pub preceding_event: Option<String>,
    pub following_event: Option<String>,
    pub expected_events: Vec<String>,
    pub significance: String,
}

/// A temporal anomaly detected
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemporalAnomaly {
    pub id: String,
    pub anomaly_type: AnomalyType,
    pub severity: Severity,
    pub date_range: String,
    pub description: String,
    pub affected_events: Vec<String>,
    pub evidence: String,
    pub implication: String,
}

/// Summary of temporal analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemporalSummary {
    pub total_events: i32,
    pub date_range_start: String,
    pub date_range_end: String,
    pub total_duration_days: i32,
    pub gaps_found: i32,
    pub anomalies_found: i32,
    pub critical_anomalies: i32,
    pub most_active_periods: Vec<String>,
    pub quietest_periods: Vec<String>,
}

/// Complete result of temporal analysis
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemporalAnalysisResult {
    pub events: Vec<TimelineEvent>,
    pub gaps: Vec<TimelineGap>,
    pub anomalies: Vec<TemporalAnomaly>,
    pub summary: TemporalSummary,
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

/// AI response format for temporal analysis
#[derive(Debug, Deserialize)]
struct AITemporalResponse {
    events: Vec<AIEvent>,
    gaps: Vec<AIGap>,
    anomalies: Vec<AIAnomaly>,
    summary: AISummary,
}

#[derive(Debug, Deserialize)]
struct AIEvent {
    date: String,
    #[serde(rename = "datePrecision")]
    date_precision: String,
    time: Option<String>,
    #[serde(rename = "eventType")]
    event_type: String,
    description: String,
    #[serde(rename = "documentId")]
    document_id: String,
    #[serde(rename = "pageRef")]
    page_ref: Option<i32>,
    #[serde(rename = "entitiesInvolved", default)]
    entities_involved: Vec<String>,
    significance: String,
}

#[derive(Debug, Deserialize)]
struct AIGap {
    #[serde(rename = "startDate")]
    start_date: String,
    #[serde(rename = "endDate")]
    end_date: String,
    #[serde(rename = "durationDays")]
    duration_days: i32,
    #[serde(rename = "precedingEvent")]
    preceding_event: Option<String>,
    #[serde(rename = "followingEvent")]
    following_event: Option<String>,
    #[serde(rename = "expectedEvents", default)]
    expected_events: Vec<String>,
    significance: String,
}

#[derive(Debug, Deserialize)]
struct AIAnomaly {
    #[serde(rename = "anomalyType")]
    anomaly_type: String,
    severity: String,
    #[serde(rename = "dateRange")]
    date_range: String,
    description: String,
    #[serde(rename = "affectedEvents", default)]
    affected_events: Vec<String>,
    evidence: String,
    implication: String,
}

#[derive(Debug, Deserialize)]
struct AISummary {
    #[serde(rename = "totalEvents")]
    total_events: i32,
    #[serde(rename = "dateRangeStart")]
    date_range_start: String,
    #[serde(rename = "dateRangeEnd")]
    date_range_end: String,
    #[serde(rename = "totalDurationDays")]
    total_duration_days: i32,
    #[serde(rename = "gapsFound")]
    gaps_found: i32,
    #[serde(rename = "anomaliesFound")]
    anomalies_found: i32,
    #[serde(rename = "criticalAnomalies")]
    critical_anomalies: i32,
    #[serde(rename = "mostActivePeriods", default)]
    most_active_periods: Vec<String>,
    #[serde(rename = "quietestPeriods", default)]
    quietest_periods: Vec<String>,
}

/// The Temporal Parser Engine
pub struct TemporalEngine {
    pool: SqlitePool,
    ai_client: Option<AIClient>,
    mock_mode: bool,
}

impl TemporalEngine {
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

    /// Analyze documents to construct timeline and detect anomalies
    pub async fn analyze_timeline(
        &self,
        documents: Vec<DocumentInfo>,
        case_id: &str,
    ) -> Result<TemporalAnalysisResult, String> {
        if documents.is_empty() {
            return Err("No documents provided for analysis".to_string());
        }

        if self.mock_mode || self.ai_client.is_none() {
            return self.mock_analyze_timeline(&documents, case_id).await;
        }

        let ai_client = self.ai_client.as_ref().unwrap();

        // Format documents for prompt
        let formatted_docs = documents
            .iter()
            .map(|d| {
                format!(
                    "=== DOCUMENT: {} (ID: {}, Type: {}, Date: {}) ===\n{}",
                    d.name,
                    d.id,
                    d.doc_type,
                    d.date.as_deref().unwrap_or("unknown"),
                    &d.content[..d.content.len().min(50000)]
                )
            })
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let prompt = format!(
            r#"Analyze these documents to construct a comprehensive timeline of events.

TASKS:
1. EXTRACT all dates and events mentioned in the documents
2. IDENTIFY gaps where expected events are missing
3. DETECT anomalies (inconsistent dates, impossible sequences, backdated documents)

For each EVENT found:
- Extract the date (use ISO 8601: YYYY-MM-DD)
- Note the precision level (exact, day, week, month, quarter, year, approximate)
- Classify the event type
- Note which document and page it came from
- List entities involved

EVENT TYPES:
- document: Document created/dated
- meeting: Meeting, hearing, proceeding
- decision: Decision or ruling
- communication: Letter, email, phone call
- investigation: Police/regulatory investigation activity
- assessment: Professional assessment
- complaint: Complaint or referral filed
- contact: Visit or contact
- deadline: Due date or deadline
- status_change: Change in case/investigation status
- other: Other significant event

For each GAP:
- Identify the date range
- Note what events preceded and followed
- List what events you'd expect but are missing

ANOMALY TYPES:
- unexplained_gap: Significant gap with no explanation
- out_of_sequence: Events in illogical order
- inconsistent_dates: Same event dated differently
- backdated_document: Document created after events described
- impossible_timeline: Conflicting simultaneous events
- missing_expected: Expected milestone not found
- clustering_anomaly: Unusual concentration of events

DOCUMENTS TO ANALYZE:
{}

Respond in JSON:
{{
  "events": [
    {{
      "date": "YYYY-MM-DD",
      "datePrecision": "exact|day|week|month|quarter|year|approximate",
      "time": "HH:MM or null",
      "eventType": "document|meeting|decision|communication|investigation|assessment|complaint|contact|deadline|status_change|other",
      "description": "what happened",
      "documentId": "doc-id",
      "pageRef": number or null,
      "entitiesInvolved": ["entity1", "entity2"],
      "significance": "why this matters"
    }}
  ],
  "gaps": [
    {{
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "durationDays": number,
      "precedingEvent": "description or null",
      "followingEvent": "description or null",
      "expectedEvents": ["what should have happened"],
      "significance": "why this gap matters"
    }}
  ],
  "anomalies": [
    {{
      "anomalyType": "unexplained_gap|out_of_sequence|inconsistent_dates|backdated_document|impossible_timeline|missing_expected|clustering_anomaly",
      "severity": "critical|high|medium|low",
      "dateRange": "YYYY-MM-DD to YYYY-MM-DD",
      "description": "what the anomaly is",
      "affectedEvents": ["event descriptions"],
      "evidence": "specific text showing the anomaly",
      "implication": "what this suggests"
    }}
  ],
  "summary": {{
    "totalEvents": number,
    "dateRangeStart": "YYYY-MM-DD",
    "dateRangeEnd": "YYYY-MM-DD",
    "totalDurationDays": number,
    "gapsFound": number,
    "anomaliesFound": number,
    "criticalAnomalies": number,
    "mostActivePeriods": ["period descriptions"],
    "quietestPeriods": ["period descriptions"]
  }}
}}"#,
            formatted_docs
        );

        let system = "You are a forensic document analyst specializing in timeline reconstruction. \
            You meticulously extract dates from documents, construct accurate chronologies, \
            and identify gaps and anomalies that could indicate procedural failures or deliberate manipulation.";

        let response: AITemporalResponse = ai_client
            .prompt_json_with_system(system, &prompt)
            .await?;

        // Convert AI response to our types
        let events = response
            .events
            .into_iter()
            .enumerate()
            .map(|(idx, e)| {
                let doc_name = documents
                    .iter()
                    .find(|d| d.id == e.document_id)
                    .map(|d| d.name.clone())
                    .unwrap_or_else(|| "Unknown".to_string());

                TimelineEvent {
                    id: format!("event-{}-{}", &case_id[..8.min(case_id.len())], idx),
                    date: e.date,
                    date_precision: parse_precision(&e.date_precision),
                    time: e.time,
                    event_type: parse_event_type(&e.event_type),
                    description: e.description,
                    document_id: e.document_id,
                    document_name: doc_name,
                    page_ref: e.page_ref,
                    entities_involved: e.entities_involved,
                    significance: e.significance,
                }
            })
            .collect::<Vec<_>>();

        let gaps = response
            .gaps
            .into_iter()
            .enumerate()
            .map(|(idx, g)| TimelineGap {
                id: format!("gap-{}-{}", &case_id[..8.min(case_id.len())], idx),
                start_date: g.start_date,
                end_date: g.end_date,
                duration_days: g.duration_days,
                preceding_event: g.preceding_event,
                following_event: g.following_event,
                expected_events: g.expected_events,
                significance: g.significance,
            })
            .collect::<Vec<_>>();

        let anomalies = response
            .anomalies
            .into_iter()
            .enumerate()
            .map(|(idx, a)| TemporalAnomaly {
                id: format!("anomaly-{}-{}", &case_id[..8.min(case_id.len())], idx),
                anomaly_type: parse_anomaly_type(&a.anomaly_type),
                severity: parse_severity(&a.severity),
                date_range: a.date_range,
                description: a.description,
                affected_events: a.affected_events,
                evidence: a.evidence,
                implication: a.implication,
            })
            .collect::<Vec<_>>();

        let summary = TemporalSummary {
            total_events: response.summary.total_events,
            date_range_start: response.summary.date_range_start,
            date_range_end: response.summary.date_range_end,
            total_duration_days: response.summary.total_duration_days,
            gaps_found: response.summary.gaps_found,
            anomalies_found: response.summary.anomalies_found,
            critical_anomalies: response.summary.critical_anomalies,
            most_active_periods: response.summary.most_active_periods,
            quietest_periods: response.summary.quietest_periods,
        };

        // Store in database
        self.store_events(case_id, &events).await?;
        self.store_anomalies(case_id, &anomalies).await?;

        Ok(TemporalAnalysisResult {
            events,
            gaps,
            anomalies,
            summary,
            is_mock: false,
        })
    }

    async fn store_events(&self, case_id: &str, events: &[TimelineEvent]) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for e in events {
            let id = Uuid::new_v4().to_string();
            let entity_ids = serde_json::to_string(&e.entities_involved).unwrap_or_default();

            sqlx::query(
                r#"INSERT INTO timeline_events
                   (id, case_id, event_date, event_time, date_precision, description, event_type,
                    source_document_id, source_page, entity_ids, is_anomaly, metadata, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '{}', ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&e.date)
            .bind(&e.time)
            .bind(e.date_precision.as_str())
            .bind(&e.description)
            .bind(e.event_type.as_str())
            .bind(&e.document_id)
            .bind(&e.page_ref)
            .bind(&entity_ids)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store event: {}", e))?;
        }

        log::info!("Stored {} timeline events for case {}", events.len(), case_id);
        Ok(())
    }

    async fn store_anomalies(&self, case_id: &str, anomalies: &[TemporalAnomaly]) -> Result<(), String> {
        let now = chrono::Utc::now().to_rfc3339();

        for a in anomalies {
            let id = Uuid::new_v4().to_string();
            let title = format!("{} anomaly: {}...", a.anomaly_type.as_str(), &a.description[..a.description.len().min(50)]);
            let evidence = serde_json::json!({
                "anomaly_type": a.anomaly_type.as_str(),
                "date_range": a.date_range,
                "affected_events": a.affected_events,
                "evidence_text": a.evidence,
            })
            .to_string();

            sqlx::query(
                r#"INSERT INTO findings (id, case_id, engine, title, description, severity, document_ids, evidence, created_at)
                   VALUES (?, ?, 'temporal_parser', ?, ?, ?, '[]', ?, ?)"#,
            )
            .bind(&id)
            .bind(case_id)
            .bind(&title)
            .bind(&a.implication)
            .bind(a.severity.as_str())
            .bind(&evidence)
            .bind(&now)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to store anomaly finding: {}", e))?;
        }

        log::info!("Stored {} temporal anomalies for case {}", anomalies.len(), case_id);
        Ok(())
    }

    async fn mock_analyze_timeline(
        &self,
        _documents: &[DocumentInfo],
        case_id: &str,
    ) -> Result<TemporalAnalysisResult, String> {
        log::warn!("Running temporal analysis in mock mode");
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

        let events = vec![
            TimelineEvent {
                id: format!("event-{}-0", &case_id[..8.min(case_id.len())]),
                date: "2023-03-15".to_string(),
                date_precision: DatePrecision::Day,
                time: None,
                event_type: EventType::Investigation,
                description: "Operation Scan initiated".to_string(),
                document_id: "mock-doc-1".to_string(),
                document_name: "Investigation Log".to_string(),
                page_ref: Some(1),
                entities_involved: vec!["DI Butler".to_string()],
                significance: "Start of investigation period".to_string(),
            },
            TimelineEvent {
                id: format!("event-{}-1", &case_id[..8.min(case_id.len())]),
                date: "2023-04-03".to_string(),
                date_precision: DatePrecision::Day,
                time: None,
                event_type: EventType::Decision,
                description: "NFA decision communicated".to_string(),
                document_id: "mock-doc-2".to_string(),
                document_name: "DI Butler Letter".to_string(),
                page_ref: Some(1),
                entities_involved: vec!["DI Butler".to_string(), "Paul Stephen".to_string()],
                significance: "Formal clearance - 'effectively innocent'".to_string(),
            },
        ];

        let gaps = vec![
            TimelineGap {
                id: format!("gap-{}-0", &case_id[..8.min(case_id.len())]),
                start_date: "2024-06-01".to_string(),
                end_date: "2025-01-14".to_string(),
                duration_days: 227,
                preceding_event: Some("Last contact with child".to_string()),
                following_event: None,
                expected_events: vec!["Fortnightly contact as per SGO".to_string()],
                significance: "No contact for 6+ months despite court order".to_string(),
            },
        ];

        let anomalies = vec![
            TemporalAnomaly {
                id: format!("anomaly-{}-0", &case_id[..8.min(case_id.len())]),
                anomaly_type: AnomalyType::MissingExpected,
                severity: Severity::Critical,
                date_range: "2024-06-01 to 2025-01-14".to_string(),
                description: "Court-ordered fortnightly contact not occurring".to_string(),
                affected_events: vec!["Contact schedule".to_string()],
                evidence: "SGO recitals specify fortnightly contact".to_string(),
                implication: "Breach of court order / enforcement needed".to_string(),
            },
        ];

        let summary = TemporalSummary {
            total_events: 2,
            date_range_start: "2023-03-15".to_string(),
            date_range_end: "2025-01-14".to_string(),
            total_duration_days: 670,
            gaps_found: 1,
            anomalies_found: 1,
            critical_anomalies: 1,
            most_active_periods: vec!["March-April 2023".to_string()],
            quietest_periods: vec!["June 2024 - Present".to_string()],
        };

        Ok(TemporalAnalysisResult {
            events,
            gaps,
            anomalies,
            summary,
            is_mock: true,
        })
    }
}

// Helper functions

fn parse_precision(s: &str) -> DatePrecision {
    match s.to_lowercase().as_str() {
        "exact" => DatePrecision::Exact,
        "day" => DatePrecision::Day,
        "week" => DatePrecision::Week,
        "month" => DatePrecision::Month,
        "quarter" => DatePrecision::Quarter,
        "year" => DatePrecision::Year,
        "approximate" => DatePrecision::Approximate,
        _ => DatePrecision::Day,
    }
}

fn parse_event_type(s: &str) -> EventType {
    match s.to_lowercase().as_str() {
        "document" => EventType::Document,
        "meeting" => EventType::Meeting,
        "decision" => EventType::Decision,
        "communication" => EventType::Communication,
        "investigation" => EventType::Investigation,
        "assessment" => EventType::Assessment,
        "complaint" => EventType::Complaint,
        "contact" => EventType::Contact,
        "deadline" => EventType::Deadline,
        "status_change" => EventType::StatusChange,
        _ => EventType::Other,
    }
}

fn parse_anomaly_type(s: &str) -> AnomalyType {
    match s.to_lowercase().as_str() {
        "unexplained_gap" => AnomalyType::UnexplainedGap,
        "out_of_sequence" => AnomalyType::OutOfSequence,
        "inconsistent_dates" => AnomalyType::InconsistentDates,
        "backdated_document" => AnomalyType::BackdatedDocument,
        "impossible_timeline" => AnomalyType::ImpossibleTimeline,
        "missing_expected" => AnomalyType::MissingExpected,
        "clustering_anomaly" => AnomalyType::ClusteringAnomaly,
        _ => AnomalyType::UnexplainedGap,
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

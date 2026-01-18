//! Schema Generation Module
//!
//! Provides JSON Schema generation for engine result types.
//! Used for type contract validation between Rust and TypeScript.
//!
//! Enable with: `cargo build --features schema-gen`

#[cfg(feature = "schema-gen")]
pub mod engine_schemas {
    use schemars::{schema_for, JsonSchema};
    use serde::{Deserialize, Serialize};
    use std::collections::HashMap;

    /// Container for all generated schemas
    #[derive(Debug)]
    pub struct SchemaCollection {
        pub schemas: HashMap<String, serde_json::Value>,
    }

    impl SchemaCollection {
        pub fn new() -> Self {
            Self {
                schemas: HashMap::new(),
            }
        }

        pub fn add<T: JsonSchema>(&mut self, name: &str) {
            let schema = schema_for!(T);
            self.schemas.insert(
                name.to_string(),
                serde_json::to_value(schema).expect("Failed to serialize schema"),
            );
        }

        pub fn to_json(&self) -> String {
            serde_json::to_string_pretty(&self.schemas).expect("Failed to serialize schemas")
        }
    }

    // ==========================================
    // SCHEMA WRAPPER TYPES
    // ==========================================
    // These mirror the engine types but with JsonSchema derived.
    // They are validated against the original types via serialization tests.

    // --- Contradiction Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "lowercase")]
    pub enum ContradictionType {
        Direct,
        Implicit,
        Temporal,
        Quantitative,
        Attributional,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "lowercase")]
    pub enum Severity {
        Critical,
        High,
        Medium,
        Low,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "lowercase")]
    pub enum CredibilityImpact {
        Severe,
        Moderate,
        Minor,
        None,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ClaimReference {
        pub document_id: String,
        pub document_name: String,
        pub text: String,
        pub date: Option<String>,
        pub author: Option<String>,
        pub page_ref: Option<i32>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ContradictionFinding {
        pub id: String,
        #[serde(rename = "type")]
        pub contradiction_type: ContradictionType,
        pub severity: Severity,
        pub claim1: ClaimReference,
        pub claim2: ClaimReference,
        pub explanation: String,
        pub implication: String,
        pub suggested_resolution: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ClusterClaim {
        pub doc_id: String,
        pub text: String,
        pub stance: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ClaimCluster {
        pub topic: String,
        pub claims: Vec<ClusterClaim>,
        pub consensus: bool,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ContradictionSummary {
        pub total_contradictions: usize,
        pub critical_count: usize,
        pub most_contradicted_topics: Vec<String>,
        pub credibility_impact: CredibilityImpact,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ContradictionAnalysisResult {
        pub contradictions: Vec<ContradictionFinding>,
        pub claim_clusters: Vec<ClaimCluster>,
        pub summary: ContradictionSummary,
        pub is_mock: bool,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ClaimComparisonResult {
        pub contradicts: bool,
        pub contradiction_type: Option<ContradictionType>,
        pub explanation: String,
        pub severity: Option<Severity>,
    }

    // --- Omission Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum OmissionType {
        SelectiveQuoting,
        CompleteExclusion,
        ContextStripping,
        CherryPicking,
        ExculpatoryOmission,
        ProceduralOmission,
        ContradictoryOmission,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum BiasDirection {
        ProsecutionFavoring,
        DefenseFavoring,
        InstitutionFavoring,
        IndividualFavoring,
        Neutral,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct SourceReference {
        pub document_id: String,
        pub document_name: String,
        pub text: String,
        pub page_ref: Option<i32>,
        pub date: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ReportReference {
        pub document_id: String,
        pub document_name: String,
        pub author: Option<String>,
        pub date: Option<String>,
        pub substitute_text: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct OmissionFinding {
        pub id: String,
        #[serde(rename = "type")]
        pub omission_type: OmissionType,
        pub severity: Severity,
        pub bias_direction: BiasDirection,
        pub source: SourceReference,
        pub report: ReportReference,
        pub omitted_content: String,
        pub significance: String,
        pub impact: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct BiasAnalysis {
        pub prosecution_favoring: i32,
        pub defense_favoring: i32,
        pub bias_score: f64,
        pub is_significant: bool,
        pub assessment: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct OmissionTypeCount {
        pub omission_type: String,
        pub count: i32,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct OmissionSummary {
        pub total_omissions: i32,
        pub critical_count: i32,
        pub by_type: Vec<OmissionTypeCount>,
        pub bias_analysis: BiasAnalysis,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct OmissionAnalysisResult {
        pub omissions: Vec<OmissionFinding>,
        pub summary: OmissionSummary,
        pub is_mock: bool,
    }

    // --- Temporal Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "lowercase")]
    pub enum DatePrecision {
        Exact,
        Day,
        Week,
        Month,
        Quarter,
        Year,
        Approximate,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum TemporalEventType {
        Document,
        Meeting,
        Decision,
        Communication,
        Investigation,
        Assessment,
        Complaint,
        Contact,
        Deadline,
        StatusChange,
        Other,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum TemporalAnomalyType {
        UnexplainedGap,
        OutOfSequence,
        InconsistentDates,
        BackdatedDocument,
        ImpossibleTimeline,
        MissingExpected,
        ClusteringAnomaly,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct TimelineEvent {
        pub id: String,
        pub date: String,
        pub date_precision: DatePrecision,
        pub time: Option<String>,
        pub event_type: TemporalEventType,
        pub description: String,
        pub document_id: String,
        pub document_name: String,
        pub page_ref: Option<i32>,
        pub entities_involved: Vec<String>,
        pub significance: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct TemporalAnomaly {
        pub id: String,
        pub anomaly_type: TemporalAnomalyType,
        pub severity: Severity,
        pub date_range: String,
        pub description: String,
        pub affected_events: Vec<String>,
        pub evidence: String,
        pub implication: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct TemporalAnalysisResult {
        pub events: Vec<TimelineEvent>,
        pub gaps: Vec<TimelineGap>,
        pub anomalies: Vec<TemporalAnomaly>,
        pub summary: TemporalSummary,
        pub is_mock: bool,
    }

    // --- Entity Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum EntityType {
        Person,
        Organization,
        Professional,
        Court,
        Police,
        Agency,
        Expert,
        Media,
        Location,
        DocumentRef,
        Other,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum EntityRole {
        Applicant,
        Respondent,
        Subject,
        Adjudicator,
        ExpertWitness,
        FactWitness,
        AssessmentAuthor,
        LegalRepresentative,
        LitigationFriend,
        MediaEntity,
        Investigator,
        Unknown,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "lowercase")]
    pub enum EntityConfidence {
        Definite,
        High,
        Medium,
        Low,
        Speculative,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct EntityAlias {
        pub name: String,
        pub alias_type: String,
        pub document_id: String,
        pub confidence: EntityConfidence,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ProfessionalRegistration {
        pub body: String,
        pub registration_number: Option<String>,
        pub status: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct EntityRelationship {
        pub id: String,
        pub target_entity_id: String,
        pub target_entity_name: String,
        pub relationship_type: String,
        pub confidence: EntityConfidence,
        pub evidence: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct EntityResolutionSummary {
        pub total_entities: i32,
        pub persons: i32,
        pub organizations: i32,
        pub professionals: i32,
        pub key_parties: Vec<String>,
        pub aliases_resolved: i32,
        pub relationships_found: i32,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct EntityResolutionResult {
        pub entities: Vec<ResolvedEntity>,
        pub summary: EntityResolutionSummary,
        pub is_mock: bool,
    }

    // --- Bias Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum BiasType {
        FramingImbalance,
        ToneAsymmetry,
        SelectivePresentation,
        InterrogationAsymmetry,
        NarrativePrivilege,
        ExpertImbalance,
        EmotiveAsymmetry,
        HeadlineBias,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum BiasDetectionDirection {
        ProsecutionFavoring,
        DefenseFavoring,
        InstitutionFavoring,
        IndividualFavoring,
        Unclear,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct FramingRatio {
        pub metric: String,
        pub party_a_label: String,
        pub party_a_count: i32,
        pub party_b_label: String,
        pub party_b_count: i32,
        pub ratio: f64,
        pub ratio_display: String,
        pub z_score: Option<f64>,
        pub p_value: Option<f64>,
        pub is_significant: bool,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct BiasFinding {
        pub id: String,
        pub bias_type: BiasType,
        pub severity: Severity,
        pub direction: BiasDetectionDirection,
        pub description: String,
        pub evidence: String,
        pub framing_ratio: Option<FramingRatio>,
        pub document_id: String,
        pub document_name: String,
        pub page_ref: Option<i32>,
        pub regulatory_relevance: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct BiasStatistics {
        pub total_items_analyzed: i32,
        pub items_favoring_prosecution: i32,
        pub items_favoring_defense: i32,
        pub items_neutral: i32,
        pub overall_bias_score: f64,
        pub is_statistically_significant: bool,
        pub dominant_bias_types: Vec<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct BiasSummary {
        pub total_findings: i32,
        pub critical_findings: i32,
        pub primary_framing_ratio: Option<FramingRatio>,
        pub statistics: BiasStatistics,
        pub regulatory_assessment: String,
        pub ofcom_relevance: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct BiasAnalysisResult {
        pub findings: Vec<BiasFinding>,
        pub framing_ratios: Vec<FramingRatio>,
        pub summary: BiasSummary,
        pub is_mock: bool,
    }

    // --- Accountability Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum DutyType {
        VerificationDuty,
        ReportingDuty,
        AssessmentDuty,
        CourtOrderCompliance,
        ConfidentialityDuty,
        WelfareDuty,
        FairnessDuty,
        DocumentationDuty,
        DisclosureDuty,
        SupervisionDuty,
        TimescaleDuty,
        RegulatoryDuty,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum DutySource {
        Statute,
        CourtOrder,
        ProfessionalCode,
        Policy,
        CaseLaw,
        Guidance,
        Contract,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct Duty {
        pub id: String,
        pub duty_type: DutyType,
        pub source: DutySource,
        pub source_reference: String,
        pub description: String,
        pub duty_holder: String,
        pub duty_holder_role: String,
        pub beneficiary: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct VerificationFailure {
        pub id: String,
        pub claim_accepted: String,
        pub accepted_by: String,
        pub accepted_from: String,
        pub available_verification: String,
        pub verification_performed: bool,
        pub evidence: String,
        pub impact: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct AccountabilitySummary {
        pub total_duties_identified: i32,
        pub duties_breached: i32,
        pub verification_failures: i32,
        pub actors_with_breaches: Vec<String>,
        pub most_common_breach_type: Option<String>,
        pub regulatory_bodies_relevant: Vec<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct AccountabilityResult {
        pub duties: Vec<Duty>,
        pub breaches: Vec<DutyBreach>,
        pub verification_failures: Vec<VerificationFailure>,
        pub summary: AccountabilitySummary,
        pub is_mock: bool,
    }

    // --- Professional Tracker Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum ProfessionalType {
        SocialWorker,
        Psychologist,
        Psychiatrist,
        #[serde(rename = "cafcass")]
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

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "lowercase")]
    pub enum RegulatoryBody {
        #[serde(rename = "hcpc")]
        HCPC,
        #[serde(rename = "gmc")]
        GMC,
        #[serde(rename = "nmc")]
        NMC,
        #[serde(rename = "sra")]
        SRA,
        #[serde(rename = "bsb")]
        BSB,
        #[serde(rename = "bps")]
        BPS,
        #[serde(rename = "swe")]
        SWE,
        #[serde(rename = "ofsted")]
        OFSTED,
        Other,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum ConcernType {
        VerificationFailure,
        Inconsistency,
        Bias,
        Timeliness,
        ScopeExceeded,
        Methodology,
        Documentation,
        CodeBreach,
        ConflictOfInterest,
        Communication,
        Other,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ConductConcern {
        pub id: String,
        pub concern_type: ConcernType,
        pub severity: Severity,
        pub description: String,
        pub evidence: String,
        pub document_id: String,
        pub document_name: String,
        pub page_ref: Option<i32>,
        pub relevant_code: Option<String>,
        pub regulatory_relevance: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct BehavioralPattern {
        pub id: String,
        pub pattern_type: String,
        pub description: String,
        pub frequency: i32,
        pub examples: Vec<String>,
        pub significance: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ProfessionalSummary {
        pub professionals_tracked: i32,
        pub total_concerns: i32,
        pub critical_concerns: i32,
        pub professionals_with_concerns: Vec<String>,
        pub most_common_concern: Option<String>,
        pub regulatory_bodies_involved: Vec<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ProfessionalTrackerResult {
        pub professionals: Vec<TrackedProfessional>,
        pub summary: ProfessionalSummary,
        pub is_mock: bool,
    }

    // --- Argumentation Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "lowercase")]
    pub enum ArgumentStrength {
        Definitive,
        Strong,
        Moderate,
        Weak,
        Asserted,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum FallacyType {
        CircularReasoning,
        AppealToAuthority,
        AdHominem,
        StrawMan,
        FalseDichotomy,
        SlipperySlope,
        HastyGeneralization,
        PostHoc,
        NonSequitur,
        BeggingTheQuestion,
        RedHerring,
        Other,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ToulminArgument {
        pub id: String,
        pub claim: String,
        pub grounds: Vec<String>,
        pub warrant: Option<String>,
        pub backing: Vec<String>,
        pub qualifier: Option<String>,
        pub rebuttals: Vec<String>,
        pub strength: ArgumentStrength,
        pub document_id: String,
        pub document_name: String,
        pub page_ref: Option<i32>,
        pub arguer: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ArgumentChain {
        pub id: String,
        pub root_argument_id: String,
        pub chain: Vec<String>,
        pub description: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ArgumentationSummary {
        pub total_arguments: i32,
        pub strong_arguments: i32,
        pub weak_arguments: i32,
        pub fallacies_found: i32,
        pub argument_chains: i32,
        pub most_common_fallacy: Option<String>,
        pub weakest_arguments: Vec<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ArgumentationResult {
        pub arguments: Vec<ToulminArgument>,
        pub fallacies: Vec<LogicalFallacy>,
        pub chains: Vec<ArgumentChain>,
        pub summary: ArgumentationSummary,
        pub is_mock: bool,
    }

    // --- Documentary (Media Reporting) Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum EditorialChoiceType {
        Omission,
        Truncation,
        Decontextualization,
        Resequencing,
        Commentary,
        EmphasisAdded,
        Juxtaposition,
        SelectiveEditing,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum EditorialDirection {
        ProsecutionFavoring,
        DefenseFavoring,
        SensationFavoring,
        NarrativeFavoring,
        Neutral,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct EditorialChoice {
        pub id: String,
        pub choice_type: EditorialChoiceType,
        pub severity: Severity,
        pub direction: EditorialDirection,
        pub source_content: String,
        pub source_document_id: String,
        pub source_document_name: String,
        pub source_page_ref: Option<i32>,
        pub broadcast_content: Option<String>,
        pub broadcast_timestamp: Option<String>,
        pub description: String,
        pub impact: String,
        pub ofcom_section: Option<String>,
        pub regulatory_relevance: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct SourceMapping {
        pub id: String,
        pub source_document_id: String,
        pub source_document_name: String,
        pub source_content: String,
        pub source_page_ref: Option<i32>,
        pub used_in_broadcast: bool,
        pub broadcast_timestamp: Option<String>,
        pub broadcast_content: Option<String>,
        pub accuracy_assessment: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct PartyCoverage {
        pub party: String,
        pub screen_time_seconds: Option<i32>,
        pub word_count: i32,
        pub positive_mentions: i32,
        pub negative_mentions: i32,
        pub neutral_mentions: i32,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct BalanceAnalysis {
        pub party_coverage: Vec<PartyCoverage>,
        pub balance_score: f64,
        pub is_significant: bool,
        pub assessment: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct DocumentarySummary {
        pub total_editorial_choices: i32,
        pub critical_choices: i32,
        pub omissions_found: i32,
        pub decontextualizations_found: i32,
        pub sources_mapped: i32,
        pub sources_used: i32,
        pub sources_omitted: i32,
        pub balance_assessment: String,
        pub ofcom_sections_implicated: Vec<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct DocumentaryResult {
        pub editorial_choices: Vec<EditorialChoice>,
        pub source_mappings: Vec<SourceMapping>,
        pub balance_analysis: BalanceAnalysis,
        pub summary: DocumentarySummary,
        pub is_mock: bool,
    }

    // --- Narrative Evolution Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum NarrativeMutationType {
        Amplification,
        Attenuation,
        CertaintyDrift,
        AttributionShift,
        ScopeExpansion,
        ScopeContraction,
        ContextStripping,
        Addition,
        Deletion,
        Inversion,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum CoordinationType {
        SharedLanguage,
        SynchronizedTiming,
        CircularCitation,
        PreDisclosureKnowledge,
        UnexplainedConsistency,
        CoordinatedOmissions,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum MutationDirection {
        ProsecutionFavoring,
        DefenseFavoring,
        InstitutionFavoring,
        IndividualFavoring,
        Neutral,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ClaimVersion {
        pub document_id: String,
        pub document_name: String,
        pub date: Option<String>,
        pub author: Option<String>,
        pub text: String,
        pub mutation_from_previous: Option<NarrativeMutationType>,
        pub mutation_description: Option<String>,
        pub page_ref: Option<i32>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ClaimEvolution {
        pub id: String,
        pub original_claim: String,
        pub original_document_id: String,
        pub original_document_name: String,
        pub original_date: Option<String>,
        pub original_author: Option<String>,
        pub versions: Vec<ClaimVersion>,
        pub net_direction: MutationDirection,
        pub mutation_count: i32,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ClaimMutation {
        pub id: String,
        pub claim_evolution_id: String,
        pub mutation_type: NarrativeMutationType,
        pub severity: Severity,
        pub direction: MutationDirection,
        pub source_text: String,
        pub source_document_id: String,
        pub source_document_name: String,
        pub source_date: Option<String>,
        pub target_text: String,
        pub target_document_id: String,
        pub target_document_name: String,
        pub target_date: Option<String>,
        pub description: String,
        pub impact: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct CoordinationPattern {
        pub id: String,
        pub coordination_type: CoordinationType,
        pub severity: Severity,
        pub document_ids: Vec<String>,
        pub document_names: Vec<String>,
        pub shared_content: Option<String>,
        pub timing_analysis: Option<String>,
        pub description: String,
        pub significance: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct NarrativeSummary {
        pub claims_tracked: i32,
        pub total_mutations: i32,
        pub amplifications: i32,
        pub attenuations: i32,
        pub certainty_drifts: i32,
        pub coordination_patterns: i32,
        pub prosecution_favoring_mutations: i32,
        pub defense_favoring_mutations: i32,
        pub most_mutated_claim: Option<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct NarrativeResult {
        pub claim_evolutions: Vec<ClaimEvolution>,
        pub mutations: Vec<ClaimMutation>,
        pub coordination_patterns: Vec<CoordinationPattern>,
        pub summary: NarrativeSummary,
        pub is_mock: bool,
    }

    // --- Expert Witness Engine ---

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum ExpertIssueType {
        ScopeExceed,
        UnsupportedConclusion,
        MethodologyDeficiency,
        AlternativeNotConsidered,
        ImproperlyCaveated,
        ApparentBias,
        UnverifiedReliance,
        UndisclosedLimitation,
        CompetenceExceed,
        ImbalancedAnalysis,
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsonSchema)]
    #[serde(rename_all = "snake_case")]
    pub enum FJCCategory {
        Scope,
        Methodology,
        Evidence,
        Opinion,
        Balance,
        Disclosure,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ExpertInfo {
        pub name: String,
        pub expert_type: ExpertType,
        pub qualifications: Vec<String>,
        pub instructing_party: Option<String>,
        pub instruction_date: Option<String>,
        pub report_date: Option<String>,
        pub declared_scope: Vec<String>,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ExpertIssue {
        pub id: String,
        pub issue_type: ExpertIssueType,
        pub severity: Severity,
        pub fjc_category: FJCCategory,
        pub content: String,
        pub page_ref: Option<i32>,
        pub description: String,
        pub fjc_standard: String,
        pub impact: String,
        pub document_id: String,
        pub document_name: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ScopeAnalysis {
        pub declared_scope: Vec<String>,
        pub addressed_topics: Vec<String>,
        pub exceeded_topics: Vec<String>,
        pub unaddressed_topics: Vec<String>,
        pub assessment: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct MethodologyAssessment {
        pub methods_used: Vec<String>,
        pub methods_missing: Vec<String>,
        pub interviews: Vec<String>,
        pub documents_reviewed: Vec<String>,
        pub assessment_tools: Vec<String>,
        pub assessment: String,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
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

    #[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
    pub struct ExpertResult {
        pub experts: Vec<ExpertInfo>,
        pub issues: Vec<ExpertIssue>,
        pub scope_analyses: Vec<ScopeAnalysis>,
        pub methodology_assessments: Vec<MethodologyAssessment>,
        pub summary: ExpertSummary,
        pub is_mock: bool,
    }

    /// Generate schemas for all engine result types
    pub fn generate_all_schemas() -> SchemaCollection {
        let mut collection = SchemaCollection::new();

        // Contradiction Engine
        collection.add::<ContradictionAnalysisResult>("NativeContradictionAnalysisResult");
        collection.add::<ContradictionFinding>("NativeContradictionFinding");
        collection.add::<ContradictionType>("NativeContradictionType");
        collection.add::<Severity>("NativeSeverity");
        collection.add::<ClaimReference>("ClaimReference");
        collection.add::<ClaimComparisonResult>("ClaimComparisonResult");

        // Omission Engine
        collection.add::<OmissionAnalysisResult>("NativeOmissionAnalysisResult");
        collection.add::<OmissionFinding>("NativeOmissionFinding");
        collection.add::<OmissionType>("NativeOmissionType");
        collection.add::<BiasDirection>("BiasDirection");
        collection.add::<SourceReference>("SourceReference");
        collection.add::<ReportReference>("ReportReference");

        // Temporal Engine
        collection.add::<TemporalAnalysisResult>("NativeTemporalAnalysisResult");
        collection.add::<TimelineEvent>("NativeTimelineEvent");
        collection.add::<TimelineGap>("TimelineGap");
        collection.add::<TemporalAnomaly>("NativeTemporalAnomaly");
        collection.add::<DatePrecision>("DatePrecision");
        collection.add::<TemporalEventType>("TemporalEventType");
        collection.add::<TemporalAnomalyType>("TemporalAnomalyType");

        // Entity Engine
        collection.add::<EntityResolutionResult>("NativeEntityResolutionResult");
        collection.add::<ResolvedEntity>("NativeResolvedEntity");
        collection.add::<EntityAlias>("EntityAlias");
        collection.add::<EntityRelationship>("NativeEntityRelationship");
        collection.add::<EntityType>("NativeEntityType");
        collection.add::<EntityRole>("NativeEntityRole");
        collection.add::<EntityConfidence>("EntityConfidence");

        // Bias Engine
        collection.add::<BiasAnalysisResult>("NativeBiasAnalysisResult");
        collection.add::<BiasFinding>("NativeBiasFinding");
        collection.add::<BiasType>("BiasType");
        collection.add::<BiasDetectionDirection>("BiasDetectionDirection");
        collection.add::<FramingRatio>("FramingRatio");
        collection.add::<BiasStatistics>("BiasStatistics");
        collection.add::<BiasSummary>("BiasSummary");

        // Accountability Engine
        collection.add::<AccountabilityResult>("NativeAccountabilityResult");
        collection.add::<Duty>("Duty");
        collection.add::<DutyBreach>("DutyBreach");
        collection.add::<VerificationFailure>("VerificationFailure");
        collection.add::<AccountabilitySummary>("AccountabilitySummary");
        collection.add::<DutyType>("DutyType");
        collection.add::<DutySource>("DutySource");

        // Professional Tracker Engine
        collection.add::<ProfessionalTrackerResult>("NativeProfessionalTrackerResult");
        collection.add::<TrackedProfessional>("TrackedProfessional");
        collection.add::<ConductConcern>("ConductConcern");
        collection.add::<BehavioralPattern>("BehavioralPattern");
        collection.add::<ProfessionalSummary>("ProfessionalSummary");
        collection.add::<ProfessionalType>("ProfessionalType");
        collection.add::<RegulatoryBody>("RegulatoryBody");
        collection.add::<ConcernType>("ConcernType");

        // Argumentation Engine
        collection.add::<ArgumentationResult>("NativeArgumentationResult");
        collection.add::<ToulminArgument>("ToulminArgument");
        collection.add::<LogicalFallacy>("LogicalFallacy");
        collection.add::<ArgumentChain>("ArgumentChain");
        collection.add::<ArgumentationSummary>("ArgumentationSummary");
        collection.add::<ArgumentStrength>("ArgumentStrength");
        collection.add::<FallacyType>("FallacyType");

        // Documentary (Media Reporting) Engine
        collection.add::<DocumentaryResult>("NativeDocumentaryResult");
        collection.add::<EditorialChoice>("EditorialChoice");
        collection.add::<SourceMapping>("SourceMapping");
        collection.add::<PartyCoverage>("PartyCoverage");
        collection.add::<BalanceAnalysis>("BalanceAnalysis");
        collection.add::<DocumentarySummary>("DocumentarySummary");
        collection.add::<EditorialChoiceType>("EditorialChoiceType");
        collection.add::<EditorialDirection>("EditorialDirection");

        // Narrative Evolution Engine
        collection.add::<NarrativeResult>("NativeNarrativeResult");
        collection.add::<ClaimEvolution>("ClaimEvolution");
        collection.add::<ClaimVersion>("ClaimVersion");
        collection.add::<ClaimMutation>("ClaimMutation");
        collection.add::<CoordinationPattern>("CoordinationPattern");
        collection.add::<NarrativeSummary>("NarrativeSummary");
        collection.add::<NarrativeMutationType>("NativeMutationType");
        collection.add::<CoordinationType>("CoordinationType");
        collection.add::<MutationDirection>("NativeMutationDirection");

        // Expert Witness Engine
        collection.add::<ExpertResult>("NativeExpertResult");
        collection.add::<ExpertInfo>("ExpertInfo");
        collection.add::<ExpertIssue>("ExpertIssue");
        collection.add::<ScopeAnalysis>("ScopeAnalysis");
        collection.add::<MethodologyAssessment>("MethodologyAssessment");
        collection.add::<ExpertSummary>("ExpertSummary");
        collection.add::<ExpertIssueType>("ExpertIssueType");
        collection.add::<ExpertType>("NativeExpertType");
        collection.add::<FJCCategory>("FJCCategory");

        collection
    }
}

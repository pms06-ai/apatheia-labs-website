//! Analysis Engines Module
//!
//! Native Rust implementations of the FCIP analysis engines.
//! These engines can run entirely within the Tauri backend, using the
//! native AI client for LLM calls.

pub mod accountability;
pub mod argumentation;
pub mod bias;
pub mod contradiction;
pub mod documentary;
pub mod entity;
pub mod expert;
pub mod narrative;
pub mod omission;
pub mod professional;
pub mod temporal;

pub use contradiction::{
    ContradictionEngine, ContradictionFinding, ContradictionType, Severity,
    ContradictionAnalysisResult, ClaimReference, ClaimComparisonResult, DocumentInfo,
};

pub use omission::{
    OmissionEngine, OmissionFinding, OmissionType, OmissionAnalysisResult,
    BiasDirection, BiasAnalysis, OmissionSummary, SourceReference, ReportReference,
};

pub use temporal::{
    TemporalEngine, TemporalAnalysisResult, TimelineEvent, TimelineGap,
    TemporalAnomaly, TemporalSummary, DatePrecision, EventType, AnomalyType,
};

pub use bias::{
    BiasEngine, BiasFinding, BiasType, BiasAnalysisResult,
    BiasDirection as BiasDetectionDirection, FramingRatio, BiasStatistics, BiasSummary,
    Severity as BiasSeverity,
};

pub use entity::{
    EntityEngine, EntityResolutionResult, ResolvedEntity, EntityAlias, EntityRelationship,
    EntitySummary, EntityType, EntityRole, Confidence, ProfessionalRegistration,
};

pub use accountability::{
    AccountabilityEngine, AccountabilityResult, Duty, DutyBreach, VerificationFailure,
    AccountabilitySummary, DutyType, DutySource, Severity as AccountabilitySeverity,
};

pub use professional::{
    ProfessionalEngine, ProfessionalTrackerResult, TrackedProfessional, ConductConcern,
    BehavioralPattern, ProfessionalSummary, ProfessionalType, RegulatoryBody, ConcernType,
    Severity as ProfessionalSeverity,
};

pub use argumentation::{
    ArgumentationEngine, ArgumentationResult, ToulminArgument, LogicalFallacy,
    ArgumentChain, ArgumentationSummary, ArgumentStrength, FallacyType,
};

pub use documentary::{
    DocumentaryEngine, DocumentaryResult, EditorialChoice, SourceMapping,
    BalanceAnalysis, PartyCoverage, DocumentarySummary, EditorialChoiceType,
    EditorialDirection, Severity as DocumentarySeverity,
};

pub use narrative::{
    NarrativeEngine, NarrativeResult, ClaimEvolution, ClaimVersion, ClaimMutation,
    CoordinationPattern, NarrativeSummary, MutationType, CoordinationType,
    MutationDirection, Severity as NarrativeSeverity,
};

pub use expert::{
    ExpertEngine, ExpertResult, ExpertInfo, ExpertIssue, ScopeAnalysis,
    MethodologyAssessment, ExpertSummary, ExpertIssueType, ExpertType,
    FJCCategory, Severity as ExpertSeverity,
};

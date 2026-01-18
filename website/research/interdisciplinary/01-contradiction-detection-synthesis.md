# Interdisciplinary Contradiction Detection Synthesis

**Document Classification:** Cross-Domain Methodological Integration
**Version:** 1.0
**Date:** 2026-01-17
**Purpose:** Synthesize contradiction detection methods across six investigative domains for Phronesis FCIP implementation

---

## Executive Summary

Contradiction detection is the universal cornerstone of professional investigation across six distinct domains: police investigations, investigative journalism, legal eDiscovery, regulatory compliance, intelligence analysis, and academic research. While each domain has evolved specialized techniques adapted to its operational constraints and legal frameworks, **all converge on systematic comparison, evidence hierarchies, temporal analysis, and quality control through multiple reviewers**.

**Core Finding**: The eight S.A.M. contradiction types (SELF, INTER_DOC, TEMPORAL, EVIDENTIARY, MODALITY_SHIFT, SELECTIVE_CITATION, SCOPE_SHIFT, UNEXPLAINED_CHANGE) manifest consistently across all domains, but detection methods vary based on:
- **Adversarial pressure** (criminal vs. civil vs. internal investigation)
- **Evidentiary standards** (beyond reasonable doubt vs. balance of probabilities vs. preponderance of evidence)
- **Time constraints** (hours for operational intelligence vs. months for legal discovery)
- **Resource availability** (technology-enabled at scale vs. manual expert review)

**Key Convergence Points**:
1. **Evidence Hierarchies**: All domains prioritize authenticated primary documents over testimonial evidence
2. **Timeline Construction**: Systematic chronologies with evidence linking are universal (8-step legal, 5WH police, intelligence chronologies)
3. **Multi-Source Fusion**: Contradictions emerge when comparing sources with independent provenance (CPIA "reasonable lines," journalism "triangulation," intelligence multi-INT)
4. **Quality Control**: Minimum 3 independent reviewers required for reliable contradiction detection (regulatory panels, journalism fact-checking, intelligence peer review, academic inter-rater reliability with Cohen's Kappa ≥0.70)
5. **Bias Mitigation**: Structured techniques prevent confirmation bias (Intelligence SATs, Legal TAR validation, Academic reflexivity, Journalism hypothesis testing)

**Implementation Impact**: By synthesizing these methods, Phronesis FCIP can provide a **unified contradiction detection framework** that meets the quality standards of the most rigorous domain while remaining accessible across investigative contexts.

---

## 1. Cross-Domain Patterns in Contradiction Detection

### 1.1 Universal Process Architecture

All six domains follow a four-stage contradiction detection process:

**Stage 1: Evidence Collection**
- Systematic identification of relevant materials
- Authentication and provenance verification
- Metadata preservation and chain of custody
- **Variation**: Legal discovery (litigation hold), Journalism (source verification), Intelligence (Admiralty Code rating)

**Stage 2: Normalization and Structuring**
- Convert heterogeneous sources into comparable format
- Extract entities, dates, claims, assertions
- Build evidence repositories with standardized tagging
- **Variation**: Legal (Bates numbering), Police (HOLMES2 indexing), Academic (QDAS coding)

**Stage 3: Systematic Comparison**
- Compare statements within documents (SELF)
- Compare across documents (INTER_DOC)
- Compare against timelines (TEMPORAL)
- Compare against external evidence (EVIDENTIARY)
- **Variation**: Legal (email threading, version tracking), Intelligence (ACH matrix), Journalism (ChronoFact verification)

**Stage 4: Validation and Quality Control**
- Independent review by minimum 3 reviewers
- Statistical reliability testing (where applicable)
- Documentation of analytic reasoning
- Appeals/challenge mechanism
- **Variation**: Legal (TAR validation testing), Academic (inter-rater reliability), Intelligence (Red Cell review), Regulatory (dual decision-maker panels)

### 1.2 Shared Failure Modes

**Confirmation Bias**
- **Manifestation**: Seeking contradictions that support initial hypothesis while ignoring exculpatory inconsistencies
- **Police**: CPIA mandate to pursue reasonable lines "towards AND away from" suspect
- **Legal**: TAR 2.0 continuous learning vs. fixed seed set
- **Intelligence**: ACH methodology (disprove hypotheses, don't confirm)
- **Journalism**: Hypothesis-based framework (explicitly separate facts from assumptions)
- **Academic**: Reflexivity and member checking
- **Regulatory**: Three-stage analysis requiring contextual factors review

**Temporal Anchoring**
- **Manifestation**: Over-relying on first-received evidence; failing to update when timeline shifts
- **Police**: PEACE interview model (obtain free narrative before challenging)
- **Legal**: 8-step timeline process (continuous updating)
- **Intelligence**: Bayesian updating (revise probabilities with new evidence)
- **Journalism**: Iterative verification protocols
- **Academic**: Grounded Theory (constant comparison, theoretical saturation)
- **Regulatory**: Real Prospect Test (re-evaluation at each stage)

**Source Corruption (Circular Reporting)**
- **Manifestation**: Two sources appear independent but share common origin
- **Police**: Chain of custody tracking, witness isolation
- **Legal**: Email threading (detect forwarded vs. original)
- **Intelligence**: Source network mapping (detect circular reporting)
- **Journalism**: Independent corroboration requirement (three-source rule)
- **Academic**: Citation network analysis
- **Regulatory**: Independent expert requirement

### 1.3 Technology Integration Spectrum

| Domain | Technology Maturity | Primary Tools | Contradiction Detection Automation |
|--------|---------------------|---------------|-----------------------------------|
| **Legal eDiscovery** | Highest | TAR 2.0/CAL, near-duplicate detection, email threading | 60-80% automated (human review for validation) |
| **Intelligence** | High | ACH matrices, multi-INT fusion, network analysis | 40-60% automated (SATs provide structure, human judgment required) |
| **Journalism** | Medium | ChronoFact, OCCRP Aleph (4B+ documents), Datashare | 30-50% automated (pattern detection, human verification essential) |
| **Police** | Medium | HOLMES2 dynamic reasoning engine, digital forensics | 20-40% automated (anomaly detection, expert review required) |
| **Academic** | Medium | NVivo, ATLAS.ti, MAXQDA (QDAS) | 10-30% automated (coding support, human interpretation required) |
| **Regulatory** | Low | Document review platforms, case management | 5-20% automated (primarily manual expert panels) |

**Trend**: All domains converging on AI-assisted human review rather than full automation. Legal sector's TAR 2.0 court validation demonstrates that **AI prioritization + human verification** exceeds pure manual review in both cost and accuracy.

---

## 2. The Eight S.A.M. Contradiction Types Across Domains

### 2.1 SELF (Internal Contradictions Within Single Document)

**Definition**: Document contradicts itself, undermining internal coherence and reliability.

#### Police Detection Methods (CPIA "Reasonable Lines of Enquiry")
- **PEACE Interview**: Obtain free narrative first, then challenge inconsistencies during "Account, Clarify, Challenge" phase
- **Cognitive Interview**: Report everything → recall from different perspectives → detect narrative inconsistencies
- **Statement Analysis**: Forensic linguistics to detect deception indicators (pronoun shifts, verb tense changes, minimization language)
- **Example**: Suspect states "I never went to the warehouse" but later describes layout of warehouse interior

#### Journalism Detection (Hypothesis Testing)
- **Internal Consistency Check**: Flag contradictory assertions within single document or interview
- **Chronological Analysis**: Map document's internal timeline for logical impossibilities
- **Direct Quote Audit**: Compare different statements from same source over time
- **Example**: Panama Papers - Director claims "never acted for Russian clients" but company registry shows 15 Russian entities

#### Legal Detection (Document Version Tracking)
- **Near-Duplicate Detection**: Fuzzy hashing (ssdeep, SimHash) identifies document versions
- **Diff Analysis**: Highlight additions/deletions/modifications between versions (green/red/yellow)
- **Metadata Comparison**: Track author changes, edit timestamps, revision history
- **Example**: Contract v1 states "party shall deliver within 30 days" but v3 states "party may deliver within 90 days" without redline/explanation

#### Regulatory Detection (Three-Stage Analysis)
- **Factual Inconsistency Review**: Professional panel identifies contradictory assertions in single submission
- **Standards Application**: Test whether contradictions breach professional standards
- **Contextual Factors**: Assess whether contradiction due to mistake vs. deliberate deception
- **Example**: Psychologist's report states "no safeguarding concerns" in summary but detailed notes describe multiple red flags

#### Intelligence Detection (ACH Matrix)
- **Evidence Consistency Coding**: Test whether evidence item is consistent (C) or inconsistent (I) with hypothesis
- **Self-Contradiction Flags**: Automated detection when source rates as "A" (reliable) but information rates as "5" (improbable)
- **Source Deception Analysis**: Identify patterns suggesting source was deceived or deliberately misleading
- **Example**: Trusted HUMINT asset reports troop movements contradicted by their own subsequent reporting

#### Academic Detection (Grounded Theory Constant Comparison)
- **Within-Document Coding**: Identify passages that contradict earlier passages
- **Memo-Writing**: Document emerging contradictions for theoretical sampling
- **Negative Case Analysis**: Actively seek disconfirming evidence within single source
- **Example**: Interview transcript where participant says "I always followed protocol" but later describes multiple protocol violations

**Implementation for Phronesis**:
```rust
struct SelfContradiction {
    document_id: String,
    passage_1: TextSpan,  // First contradictory statement
    passage_2: TextSpan,  // Second contradictory statement
    contradiction_type: SelfContradictionType,
    confidence_score: f32,
    detection_method: DetectionMethod,
}

enum SelfContradictionType {
    FactualInconsistency,      // "Event A happened" vs. "Event A didn't happen"
    TemporalIncoherence,       // Timeline logically impossible
    ModalityShift,             // "Definitely occurred" vs. "Possibly occurred" (same claim)
    OmissionAfterAssertion,    // Claims knowledge then denies it
}

enum DetectionMethod {
    NLPContradictionDetection,  // Semantic analysis
    TemporalLogicValidator,     // Timeline consistency checker
    EntityResolution,           // Detect pronoun/reference ambiguity
    HumanReview,                // Expert identification
}
```

---

### 2.2 INTER_DOC (Cross-Document Contradictions)

**Definition**: Statements in one document contradict statements in another, revealing inconsistencies across record corpus.

#### Police Detection (HOLMES2 Cross-Referencing)
- **Witness Statement Comparison**: HOLMES2 flags contradictions between witness accounts
- **Timeline Overlay**: Multi-source chronology highlights conflicting date/time claims
- **Intelligence Cross-Check**: Test witness statements against CCTV, phone records, forensic evidence
- **Example**: Witness A says "I saw Smith at 3pm" but CCTV shows Smith elsewhere; Witness B says "Smith arrived at 5pm"

#### Journalism Detection (Multi-Source Triangulation)
- **Three-Source Rule**: Independent confirmation from minimum three sources before publication
- **Document vs. Document**: Cross-reference leaked documents against official records
- **Interview vs. Interview**: Compare statements from multiple interviewees
- **ChronoFact Database**: Systematic timeline verification across 1000+ sources
- **Example**: Pandora Papers - Offshore entity registration dates contradict political declarations of divestment

#### Legal Detection (Email Threading and Timeline Construction)
- **Email Threading**: Group related communications to detect contradictory statements across thread
- **Timeline Overlays**: 8-step process creates central repository with Bates-numbered evidence
- **Communication Network Analysis**: Detect when different custodians provide contradictory accounts
- **Example**: CEO email to CFO: "We were aware of defect by March 1" contradicts CEO deposition: "First learned of defect May 15"

#### Regulatory Detection (Expert Panel Review)
- **Multi-Document Analysis**: Panel compares practitioner's records against third-party evidence
- **Corroboration Requirements**: Single allegation insufficient; require pattern across multiple incidents
- **Independent Expert Reports**: Commission external review when internal contradictions unresolvable
- **Example**: Practitioner's contemporaneous notes contradict subsequent formal report; patient records provide third data point

#### Intelligence Detection (Multi-INT Fusion)
- **Eight INT Types**: HUMINT, SIGINT, IMINT, OSINT, GEOINT, FININT, TECHINT, MASINT
- **Three Fusion Levels**: Data-level, feature-level, decision-level
- **Contradiction Handling Strategies**: Discounting (reduce weight of less reliable source), temporal explanation, deception hypothesis
- **Admiralty Code**: Rate source reliability separately from information credibility
- **Example**: HUMINT reports "missile site at Location X" but IMINT shows no construction; contradiction triggers collection of additional SIGINT

#### Academic Detection (Thematic Analysis Across Cases)
- **Cross-Case Synthesis**: Compare themes across multiple interview transcripts or documents
- **Constant Comparison**: Grounded Theory technique comparing data slices across corpus
- **Divergent Case Analysis**: Identify outliers that contradict emerging patterns
- **Example**: 18 participants report positive experience; 2 report severe negative outcomes; analyze for systematic differences

**Implementation for Phronesis**:
```rust
struct InterDocContradiction {
    doc_pair: (String, String),    // IDs of contradicting documents
    claim_1: Claim,
    claim_2: Claim,
    contradiction_evidence: ContradictionEvidence,
    source_reliability: (AdmiraltyCode, AdmiraltyCode),  // Rate each source
    resolution_hypothesis: Vec<ResolutionHypothesis>,
}

struct Claim {
    document_id: String,
    text_span: TextSpan,
    claim_type: ClaimType,
    entities: Vec<Entity>,
    temporal_reference: Option<DateTime<Utc>>,
}

enum ClaimType {
    FactualAssertion,
    Opinion,
    Hearsay,
    ExpertJudgment,
}

struct ResolutionHypothesis {
    hypothesis: String,  // e.g., "Source A was deceived", "Temporal: situation changed between observations"
    supporting_evidence: Vec<String>,
    confidence: f32,
}
```

---

### 2.3 TEMPORAL (Timeline and Date Inconsistencies)

**Definition**: Events, statements, or evidence conflict on sequencing, timing, or chronological plausibility.

#### Police Detection (5WH Framework - "When")
- **Chronology Construction**: Timeline from first report through investigation completion
- **Cell Site Analysis**: Phone location data creates precise temporal record
- **CCTV Timeline**: Frame-by-frame analysis for exact event sequencing
- **Forensic Timeline**: Digital forensics (file creation/modification), physical evidence (entomology for time of death)
- **Gap Analysis**: Identify suspicious periods with no documentation (potential evidence destruction)
- **Example**: Suspect claims "home all evening" but cell site data places phone at crime scene 8:47pm-9:13pm

#### Journalism Detection (ChronoFact Verification)
- **ChronoFact Database**: 1000+ sources, systematically verified chronology
- **5WH Questions**: When did event occur? (precise timestamp)
- **Event Sequence Verification**: Confirm A happened before B (causal claims require temporal sequence)
- **Metadata Examination**: Document creation dates, email timestamps, photo EXIF data
- **Example**: Politician claims "divested from company before vote" but corporate filings show ownership through vote date + 3 months

#### Legal Detection (8-Step Timeline Construction)
- **Step 1**: Start early (case inception, not trial preparation)
- **Step 2**: Central repository (chronological database with Bates linking)
- **Step 3**: Party and issue tagging
- **Step 4**: Collect documentation (emails, calendar entries, public records)
- **Step 5**: Extract date-specific events
- **Step 6**: Objective language (facts only, no conclusions)
- **Step 7**: Link evidence (every event cites supporting documents)
- **Step 8**: Update continuously
- **Temporal Analysis Techniques**:
  - **Gap Analysis**: Suspicious periods with no documentation
  - **Density Analysis**: Spikes in activity (e.g., 200 emails in 48 hours before product recall)
  - **Contradiction Detection**: Event sequence contradicts witness testimony
- **Example**: Witness deposition: "First learned of issue May 1" contradicts email received April 15

#### Regulatory Detection (Contemporaneous Records Requirement)
- **Primacy of Contemporaneous Evidence**: Notes made at time of event > retrospective reports
- **Temporal Coherence Review**: Panel assesses whether practitioner's timeline logically consistent
- **Corroboration with Third-Party Timestamps**: Medical records, appointment systems, phone logs
- **Example**: Practitioner claims "supervision session occurred February 10" but supervisor's calendar shows no meeting; no contemporaneous notes exist

#### Intelligence Detection (Temporal Explanation for Contradictions)
- **Multi-INT Fusion Contradiction Handling**: "Situation changed between observations" as resolution hypothesis
- **Intelligence Cycle Timing**: Collection → Processing → Analysis (time lag creates temporal gaps)
- **Operational Intelligence (F3EAD)**: Cycle time measured in hours; temporal precision critical for "Fix" phase
- **Example**: HUMINT reports "no troops at border" (January 15) but IMINT shows buildup (January 20); temporal gap explains discrepancy

#### Academic Detection (Longitudinal Analysis)
- **Within-Case Temporal Sequencing**: Track participant statements across multiple interview waves
- **Process Tracing**: Identify turning points and causal sequences
- **Retrospective Accounts vs. Contemporaneous Records**: Compare memory-based narratives to documents created in real-time
- **Example**: Participant's retrospective account describes "gradual decline" but contemporaneous notes show sudden event

**Implementation for Phronesis**:
```rust
struct TemporalContradiction {
    events: Vec<TemporalEvent>,
    contradiction_type: TemporalContradictionType,
    temporal_gap: Option<Duration>,
    confidence: f32,
}

struct TemporalEvent {
    event_id: String,
    description: String,
    timestamp: TimeReference,
    source_docs: Vec<DocumentRef>,
    entities_involved: Vec<Entity>,
}

enum TimeReference {
    Precise(DateTime<Utc>),
    Range(DateTime<Utc>, DateTime<Utc>),
    Relative(String),  // "three days after incident X"
    Vague(String),     // "sometime in early March"
}

enum TemporalContradictionType {
    ImpossibleSequence,     // Event A requires B to happen first, but B happened after A
    ConflictingTimestamps,  // Two sources give different times for same event
    TemporalGap,            // Expected evidence missing for time period
    DensityAnomaly,         // Unusual spike/drop in activity
}
```

---

### 2.4 EVIDENTIARY (Evidence vs. Claims Mismatch)

**Definition**: Factual claims lack evidentiary support or directly contradict available evidence.

#### Police Detection (CPIA Disclosure and Forensic Evidence)
- **Material Evidence Standard**: All evidence "reasonably capable of undermining prosecution or assisting defence"
- **Forensic Evidence Priority**: Physical evidence (DNA, fingerprints, digital forensics) > testimonial
- **Unused Material Schedule**: Document all material that doesn't support prosecution (exculpatory evidence)
- **Example**: Defendant claims self-defense; forensic evidence shows victim shot in back while fleeing (contradicts claim)

#### Journalism Detection (Evidence Hierarchy)
- **Primary Documents > Secondary Sources > Testimonial**
- **Authentication Requirements**:
  - Financial documents: Verified through corporate registries, banking records
  - Official documents: Cross-referenced with government databases
  - Leaked documents: Cryptographic verification, metadata analysis, expert authentication
- **Verification Before Publication**: Minimum three independent sources confirming key facts
- **Example**: Panama Papers - Politician denies offshore holdings; authenticated corporate registry documents prove beneficial ownership

#### Legal Detection (Evidence Linking in Timelines)
- **Bates Number Citation**: Every timeline event cites supporting documents (ABC00001-ABC00010)
- **Deposition Citations**: Smith Dep. 45:12-18 (transcript page:line)
- **Admissibility Standard**: FRE 902(13)/(14) self-authenticating digital records with hash certification
- **Privilege Review**: Four-part test for attorney-client privilege; document every claim
- **Example**: Plaintiff claims "defendant knew of defect" but no emails, memos, or meeting notes mention defect

#### Regulatory Detection (Professional Standards Application)
- **Three-Stage Test**:
  1. Facts proven (balance of probabilities)
  2. Standards breached (map facts to professional code)
  3. Current impairment (fitness to practice)
- **Evidence Hierarchy**: Contemporaneous clinical notes > retrospective reports > witness testimony
- **Example**: Practitioner claims "followed supervision protocol" but no documented supervision sessions in 18-month period

#### Intelligence Detection (Admiralty Code and Multi-INT Corroboration)
- **Admiralty Code**: [Source Reliability][Information Credibility]
  - A1 = Completely reliable source + Confirmed information (highest)
  - F6 = Unknown source + Cannot judge information (lowest)
- **Multi-INT Corroboration**: Claim must be supported by minimum two independent INTs
- **Evidence vs. Assumption**: ACH methodology requires explicit labeling of assumptions vs. facts
- **Example**: HUMINT claims "missile site at Location X" (B3 rating: usually reliable source, possibly true) but IMINT shows no construction (A1 rating: completely reliable, confirmed) → Contradiction favors higher-rated evidence

#### Academic Detection (Triangulation and Member Checking)
- **Data Triangulation**: Multiple data sources (interviews, documents, observations)
- **Investigator Triangulation**: Multiple researchers independently code same data
- **Theory Triangulation**: Apply multiple theoretical frameworks
- **Member Checking**: Return findings to participants for validation
- **Negative Case Analysis**: Actively seek evidence contradicting emerging themes
- **Example**: Researcher claims "all participants reported positive outcomes" but document review reveals 2/20 filed formal complaints

**Implementation for Phronesis**:
```rust
struct EvidentaryContradiction {
    claim: Claim,
    contradicting_evidence: Vec<Evidence>,
    evidence_quality: EvidenceQuality,
    contradiction_severity: ContradictionSeverity,
}

struct Evidence {
    evidence_id: String,
    evidence_type: EvidenceType,
    source_reliability: AdmiraltyCode,
    authentication_status: AuthenticationStatus,
    provenance: Provenance,
}

enum EvidenceType {
    PrimaryDocument,
    ForensicAnalysis,
    DigitalForensics,
    ExpertOpinion,
    TestimonialAccount,
    PhysicalEvidence,
}

enum AuthenticationStatus {
    Authenticated { method: String, date: DateTime<Utc> },
    Pending,
    Unverified,
    Disputed { reason: String },
}

enum ContradictionSeverity {
    Direct,        // Evidence directly contradicts claim
    Indirect,      // Evidence undermines plausibility of claim
    Absence,       // Expected evidence missing (negative evidence)
}
```

---

### 2.5 MODALITY_SHIFT (Certainty and Tone Changes)

**Definition**: Unexplained shifts in certainty, epistemic stance, or tone regarding same claim without new evidence or justification.

#### Police Detection (Interview Analysis and Statement Comparison)
- **PEACE Model - "Account, Clarify, Challenge"**: Probe for explanations when account certainty shifts
- **Cognitive Interview - Recall from Different Orders**: Disrupts script-based recall; reveals confidence variations
- **Statement Analysis**: Forensic linguistics detect:
  - Pronoun shifts ("I did X" → "one would do X")
  - Verb tense changes (past → present when describing lie)
  - Minimization language ("just," "only," "merely")
  - Qualifiers appearing mid-narrative ("to be honest," "truthfully")
- **Example**: Suspect initial statement: "I was definitely home all evening"; re-interview: "I think I was home, or maybe I went out briefly, I can't recall"

#### Journalism Detection (Quote Comparison and Modality Tracking)
- **Direct Quote Audit**: Track exact phrasing across interviews
- **Hedging Analysis**: Detect increased use of qualifiers ("possibly," "might," "perhaps") in later statements
- **On-Record vs. Off-Record Shifts**: Note when source more definitive off-record
- **Example**: Executive public statement: "No knowledge of misconduct"; private interview: "May have been aware of some irregularities"

#### Legal Detection (Document Version Tracking and Diff Analysis)
- **Near-Duplicate Detection**: Identify document versions
- **Linguistic Diff Analysis**: Highlight changes beyond factual updates:
  - v1: "We are confident the product is safe"
  - v2: "We believe the product is generally safe"
  - v3: "The product may be safe under certain conditions"
- **Email Thread Analysis**: Track certainty shifts across conversation
- **Expert Report Comparison**: Detect opinion changes between draft and final reports
- **Example**: Internal memo v1: "Defect requires immediate recall"; v2 (post-legal review): "Alleged defect warrants further investigation"

#### Regulatory Detection (Contemporaneous vs. Retrospective Accounts)
- **Primacy of Contemporaneous Records**: Notes made at time > later formal reports
- **Modality Shift as Red Flag**: Panel examines why practitioner more confident in retrospective account than contemporaneous notes suggested
- **Example**: Contemporaneous clinical note: "Patient presented with possible indicators of abuse (uncertain)"; formal report submitted six months later: "Clear evidence of abuse was present"

#### Intelligence Detection (Confidence Level Tracking)
- **Words of Estimative Probability (WEP)**: Standardized probability language
  - "Almost certainly" (95-99%) → "Likely" (60-80%) = significant downgrade
- **Confidence Levels**: High, Moderate, Low (separate from probability)
- **Sensitivity Analysis (ACH Step 7)**: What would have to change for confidence to shift?
- **Example**: Initial assessment: "Very likely (80-95%) that Event X will occur, high confidence"; revised assessment (no new evidence): "Possibly (40-60%), moderate confidence" → Flag unexplained modality shift

#### Academic Detection (Reflexivity and Researcher Positioning)
- **Reflexivity Journals**: Document researcher's evolving interpretations
- **Theoretical Sensitivity**: Note when researcher's confidence in emerging theory shifts
- **Audit Trail**: Track coding decisions over time to detect interpretation drift
- **Example**: Researcher memo week 4: "Preliminary theme: participants universally positive"; week 8: "Emerging complexity: subset report significant concerns" (shift justified by additional data collection)

**Implementation for Phronesis**:
```rust
struct ModalityShift {
    claim_id: String,
    statement_versions: Vec<StatementVersion>,
    modality_trajectory: ModalityTrajectory,
    justification_present: bool,
    new_evidence: Option<Vec<String>>,  // Document IDs of new evidence (if any)
}

struct StatementVersion {
    version_id: String,
    timestamp: DateTime<Utc>,
    text: String,
    modality_markers: Vec<ModalityMarker>,
    certainty_score: f32,  // 0.0 (no certainty) to 1.0 (absolute certainty)
}

struct ModalityMarker {
    marker_type: ModalityType,
    phrase: String,
    position: TextSpan,
}

enum ModalityType {
    Epistemic(EpistemicModality),  // Knowledge claims
    Deontic(DeonticModality),      // Obligation/permission
    Dynamic(DynamicModality),      // Ability/possibility
}

enum EpistemicModality {
    Certain,        // "definitely," "certainly," "absolutely"
    Probable,       // "likely," "probably," "presumably"
    Possible,       // "possibly," "might," "could"
    Uncertain,      // "uncertain," "unclear," "unknown"
}

enum ModalityTrajectory {
    IncreasingCertainty,  // Shift toward more definitive
    DecreasingCertainty,  // Shift toward less definitive (hedging)
    Stable,
}
```

---

### 2.6 SELECTIVE_CITATION (Cherry-Picking Evidence)

**Definition**: Citing only evidence that supports conclusion while omitting contradictory or qualifying evidence.

#### Police Detection (CPIA "Unused Material" Disclosure)
- **Duty to Disclose**: All material "reasonably capable of undermining prosecution or assisting defence"
- **Disclosure Schedule**: Prosecution must list ALL material (used and unused)
- **Unused Material Review**: Defence can request access to non-disclosed material
- **Sanctions for Non-Disclosure**: Case dismissal, conviction overturn (appeals)
- **Example**: Prosecution presents 5 witnesses identifying defendant; withholds 3 witnesses who could not make identification

#### Journalism Detection (Systematic Review and Dissenting Views)
- **Document Full Population**: Report total documents reviewed (e.g., "10,000 documents analyzed")
- **Dissenting Voices**: Ethical obligation to include perspectives contradicting investigation's thesis
- **Right of Reply**: Subject of investigation given opportunity to respond before publication
- **Example**: Investigation cites 15 critical leaked emails; fails to mention 150 emails showing standard business practices

#### Legal Detection (Discovery Process and Privilege Logs)
- **Complete Production**: Responding party must produce ALL responsive documents (not just favorable ones)
- **Privilege Logs**: Documents withheld must be described (Bates, date, author, recipients, privilege basis)
- **Sampling and Validation**: TAR 2.0 includes validation testing to detect under-production
- **Sanctions**: Adverse inference instruction, monetary fines, case dismissal
- **Example**: Company produces 1,000 documents supporting its position; TAR validation reveals 5,000 additional responsive documents withheld

#### Regulatory Detection (Comprehensive Record Review)
- **Standard of Proof**: Balance of probabilities requires weighing ALL evidence
- **Panel Review**: Professional and lay members independently review full case file
- **Defence Submissions**: Practitioner can submit contradictory evidence
- **Example**: Regulator cites 5 complaints against practitioner; omits 500 positive client testimonials and clean inspection record

#### Intelligence Detection (Alternative Analysis and Red Cell Review)
- **Structured Analytic Techniques**: ACH requires testing ALL evidence against ALL hypotheses
- **Devil's Advocacy**: Institutionalized role to challenge selective use of evidence
- **Red Cell Review**: Independent team reviews for cherry-picking
- **CIA Red Cell Example**: Challenge consensus view by highlighting contradictory intelligence
- **Example**: Analyst cites 3 HUMINT reports suggesting imminent attack; Red Cell highlights 10 SIGINT intercepts suggesting no mobilization

#### Academic Detection (Systematic Review Protocols and Negative Case Analysis)
- **PRISMA 2020**: Transparent reporting of search strategy, inclusion/exclusion criteria
- **Publication Bias**: Systematic reviews must address (file-drawer problem)
- **Negative Case Analysis**: Grounded Theory requires active search for disconfirming evidence
- **Reflexivity**: Document researcher decisions on what to include/exclude
- **Example**: Researcher claims "all participants reported X" but excluded 3 outliers without justification

**Implementation for Phronesis**:
```rust
struct SelectiveCitation {
    cited_evidence: Vec<EvidenceRef>,
    uncited_evidence: Vec<EvidenceRef>,
    selection_pattern: SelectionPattern,
    justification_quality: JustificationQuality,
}

struct EvidenceRef {
    evidence_id: String,
    relevance_score: f32,
    valence: Valence,  // Supports or contradicts conclusion
}

enum Valence {
    Supports(f32),      // 0.0 to 1.0 (strength of support)
    Contradicts(f32),   // 0.0 to 1.0 (strength of contradiction)
    Neutral,
    Mixed,
}

enum SelectionPattern {
    ConfirmatoryBias,    // Cited = 90% supportive, Uncited = 90% contradictory
    RepresentativeSample, // Cited reflects population distribution
    Systematic,          // Clear, justified criteria for selection
}

enum JustificationQuality {
    Explicit { criteria: String, applied_consistently: bool },
    Implicit { inferred_criteria: String },
    Absent,
}

// Detection algorithm
fn detect_selective_citation(
    all_evidence: Vec<EvidenceRef>,
    cited_evidence: Vec<String>,  // Evidence IDs cited in report
) -> Option<SelectiveCitation> {
    let cited: Vec<_> = all_evidence.iter().filter(|e| cited_evidence.contains(&e.evidence_id)).collect();
    let uncited: Vec<_> = all_evidence.iter().filter(|e| !cited_evidence.contains(&e.evidence_id)).collect();

    let cited_support_ratio = cited.iter().filter(|e| matches!(e.valence, Valence::Supports(_))).count() as f32 / cited.len() as f32;
    let uncited_contradict_ratio = uncited.iter().filter(|e| matches!(e.valence, Valence::Contradicts(_))).count() as f32 / uncited.len() as f32;

    if cited_support_ratio > 0.8 && uncited_contradict_ratio > 0.8 {
        Some(SelectiveCitation {
            cited_evidence: cited.into_iter().cloned().collect(),
            uncited_evidence: uncited.into_iter().cloned().collect(),
            selection_pattern: SelectionPattern::ConfirmatoryBias,
            justification_quality: JustificationQuality::Absent,
        })
    } else {
        None
    }
}
```

---

### 2.7 SCOPE_SHIFT (Unexplained Scope Changes)

**Definition**: Investigation or analysis scope changes without justification, often to exclude problematic evidence or expand to dilute findings.

#### Police Detection (Policy File Documentation)
- **SIO Policy File**: Senior Investigating Officer must document rationale for all major decisions
- **Investigation Strategy Changes**: Scope narrowing/broadening requires documented justification
- **Resource Allocation**: Changes to allocated investigative resources must be justified
- **Example**: Investigation initially focuses on single suspect; suddenly expands to "organized crime network" after original suspect's alibi verified (scope expansion without evidence)

#### Journalism Detection (Editorial Scope Control)
- **Initial Hypothesis Documentation**: Record original investigation scope and research questions
- **Scope Expansion/Narrowing**: Justified by evidence, not convenience
- **Editor Review**: Independent editor checks whether scope changes are evidence-driven
- **Example**: Investigation into CEO's financial fraud expands to include unrelated allegations against industry competitors (scope creep dilutes focus)

#### Legal Detection (Discovery Disputes and Scope Negotiations)
- **FRCP Rule 26(f) Meet and Confer**: Parties agree on discovery scope
- **Scope Changes Require Court Approval**: Unilateral scope changes contested
- **Proportionality Review (2015 Amendment)**: Discovery must be proportional to case needs
- **Example**: Plaintiff requests documents "relating to product defect"; Defendant produces documents about unrelated products (scope expansion to dilute relevant evidence)

#### Regulatory Detection (Terms of Reference and Allegation Specificity)
- **Allegation Framing**: Initial complaint defines scope
- **Expansion Triggers**: New evidence must justify expanding scope; cannot be exploratory fishing
- **Real Prospect Test**: Each stage re-evaluates whether allegations have real prospect of being proven
- **Example**: Complaint alleges breach of confidentiality in single instance; regulator expands to review practitioner's entire 10-year caseload without justification

#### Intelligence Detection (Priority Intelligence Requirements - PIRs)
- **PIR Definition**: Clear, specific questions intelligence must answer
- **Collection Management**: Scope changes require PIR revision with leadership approval
- **Mission Creep Prevention**: Structured oversight prevents unfocused intelligence gathering
- **Example**: PIR: "Assess threat from Organization X"; analyst includes unrelated analysis of Organizations Y, Z, W (scope expansion)

#### Academic Detection (Research Question Evolution)
- **Bracketing**: Phenomenological technique to define study boundaries
- **Theoretical Saturation**: Grounded Theory stops data collection when no new themes emerge (prevents scope expansion)
- **Audit Trail**: Document decisions to include/exclude data
- **Example**: Study initially focused on healthcare workers' burnout; expands to include workplace culture, leadership, organizational structure without justification (scope creep)

**Implementation for Phronesis**:
```rust
struct ScopeShift {
    original_scope: InvestigationScope,
    revised_scope: InvestigationScope,
    shift_type: ScopeShiftType,
    justification: Option<String>,
    triggering_evidence: Option<Vec<String>>,  // Document IDs
    approval_documented: bool,
}

struct InvestigationScope {
    scope_id: String,
    timestamp: DateTime<Utc>,
    entities_in_scope: Vec<Entity>,
    time_period: (DateTime<Utc>, DateTime<Utc>),
    document_types: Vec<String>,
    geographic_scope: Option<String>,
    thematic_focus: Vec<String>,
}

enum ScopeShiftType {
    Expansion { justification_type: JustificationType },
    Narrowing { justification_type: JustificationType },
    Lateral { from_focus: String, to_focus: String },  // Change focus without expanding/narrowing
}

enum JustificationType {
    NewEvidence,           // New evidence justifies scope change
    Operational,           // Resource constraints require narrowing
    Strategic,             // Leadership decision
    Unjustified,          // No documented rationale
}

// Detection algorithm
fn detect_scope_shift(
    investigation: &Investigation,
) -> Option<ScopeShift> {
    let scope_history = investigation.scope_history.as_slice();

    for window in scope_history.windows(2) {
        let (prev, curr) = (&window[0], &window[1]);

        // Check entity scope change
        let entity_expansion = curr.entities_in_scope.len() as f32 / prev.entities_in_scope.len() as f32;
        let time_expansion = (curr.time_period.1 - curr.time_period.0).num_days() as f32
            / (prev.time_period.1 - prev.time_period.0).num_days() as f32;

        if entity_expansion > 2.0 || time_expansion > 2.0 {
            return Some(ScopeShift {
                original_scope: prev.clone(),
                revised_scope: curr.clone(),
                shift_type: ScopeShiftType::Expansion {
                    justification_type: if curr.justification.is_some() {
                        JustificationType::NewEvidence
                    } else {
                        JustificationType::Unjustified
                    }
                },
                justification: curr.justification.clone(),
                triggering_evidence: curr.triggering_evidence.clone(),
                approval_documented: curr.approval_documented,
            });
        }
    }
    None
}
```

---

### 2.8 UNEXPLAINED_CHANGE (Position Changes Without Justification)

**Definition**: Individual or organization changes position, conclusion, or recommendation without new evidence or stated rationale.

#### Police Detection (Witness Statement Comparison and Interview Re-Engagement)
- **Statement Versioning**: Compare initial statement to subsequent statements
- **Re-Interview Protocols**: PEACE model used to explore changes ("I noted you said X before, but now you're saying Y. Can you help me understand?")
- **Motive Assessment**: Consider witness motivation (intimidation, coercion, memory decay, truthfulness)
- **Example**: Witness initial statement identifies defendant as perpetrator; second statement recants; investigation reveals defendant's associates visited witness

#### Journalism Detection (Source Consistency Tracking)
- **Quote Database**: Systematic tracking of source statements over time
- **On-Record vs. Off-Record Shifts**: Document when source changes position publicly vs. privately
- **Follow-Up Interviews**: Explicitly ask source about changed position
- **Example**: Corporate spokesperson initial statement: "We stand by our product's safety"; two weeks later: "We are reviewing certain concerns" (unexplained position change)

#### Legal Detection (Deposition Comparison and Impeachment)
- **Deposition vs. Trial Testimony**: Compare earlier sworn testimony to trial testimony
- **Document Production Changes**: Identify when party changes position on relevance, privilege, or responsiveness
- **Impeachment**: Cross-examination technique using prior inconsistent statements
- **Example**: Expert witness deposition: "Defect was obvious and foreseeable"; trial testimony: "Defect was subtle and unforeseeable" (impeachment-worthy change)

#### Regulatory Detection (Submission Comparison and Panel Questioning)
- **Initial vs. Final Submissions**: Compare practitioner's early response to final defence
- **Panel Questions**: Directly question practitioner about changed position
- **Credibility Assessment**: Panel assesses whether change justified or evasive
- **Example**: Practitioner initial response: "No concerns with my practice"; after evidence disclosure: "I acknowledge some shortcomings" (explained change acceptable; unexplained change harmful to credibility)

#### Intelligence Detection (Assessment Revision Tracking)
- **Confidence Level Changes**: Track when probability estimates shift
- **Words of Estimative Probability**: "Likely" → "Unlikely" without new evidence is red flag
- **Sensitivity Analysis (ACH Step 7)**: Document what evidence would have to change for conclusion to flip
- **Post-Mortem Analysis**: When assessments wrong, conduct systematic review to identify failure points
- **Example**: Initial assessment: "Very likely (85%) that regime will survive"; one week later: "Unlikely (30%)" without intervening events (suggests poor initial assessment or new intelligence not documented)

#### Academic Detection (Researcher Reflexivity and Audit Trails)
- **Reflexivity Journals**: Document researcher's evolving interpretations and changes
- **Audit Trail Requirements**: Track coding decisions; justify changes to coding scheme
- **Peer Debriefing**: Discuss interpretation changes with colleagues
- **Example**: Researcher initially codes theme as "participant empowerment"; later recodes as "participant disempowerment"; audit trail should explain evidence that triggered reinterpretation

**Implementation for Phronesis**:
```rust
struct UnexplainedChange {
    entity: Entity,
    position_history: Vec<Position>,
    change_type: ChangeType,
    explanation: Option<Explanation>,
    new_evidence: Option<Vec<String>>,  // Document IDs
    credibility_impact: CredibilityImpact,
}

struct Position {
    position_id: String,
    timestamp: DateTime<Utc>,
    statement: String,
    document_source: String,
    context: String,
}

enum ChangeType {
    Reversal,         // Complete 180-degree change
    Softening,        // Retreat from strong position
    Hardening,        // Strengthen previously weak position
    Clarification,    // Add nuance without fundamental change
}

struct Explanation {
    explanation_text: String,
    explanation_type: ExplanationType,
    adequacy: ExplanationAdequacy,
}

enum ExplanationType {
    NewEvidence { evidence_ids: Vec<String> },
    MemoryCorrection,
    Misunderstanding,
    ExternalPressure { source: String },
    LegalAdvice,
}

enum ExplanationAdequacy {
    Adequate,       // Explanation consistent with evidence
    Inadequate,     // Explanation weak or inconsistent
    Absent,         // No explanation provided
}

enum CredibilityImpact {
    Severe,         // Undermines reliability of all entity's statements
    Moderate,       // Raises doubts about specific claims
    Minimal,        // Explained change does not harm credibility
}

// Detection algorithm
fn detect_unexplained_change(
    entity: &Entity,
    positions: Vec<Position>,
) -> Option<UnexplainedChange> {
    for window in positions.windows(2) {
        let (prev, curr) = (&window[0], &window[1]);

        // Use semantic similarity to detect position changes
        let similarity = semantic_similarity(&prev.statement, &curr.statement);

        if similarity < 0.3 {  // Significant semantic shift
            return Some(UnexplainedChange {
                entity: entity.clone(),
                position_history: vec![prev.clone(), curr.clone()],
                change_type: classify_change_type(prev, curr),
                explanation: extract_explanation(curr),
                new_evidence: None,  // Check for intervening evidence
                credibility_impact: assess_credibility_impact(prev, curr),
            });
        }
    }
    None
}
```

---

## 3. Evidence Hierarchy Across Domains

### 3.1 Comparative Evidence Hierarchies

| Rank | Police (CPIA) | Journalism (ICIJ/ProPublica) | Legal (FRE) | Regulatory (HCPC/GMC) | Intelligence (Admiralty) | Academic (PRISMA/Cochrane) |
|------|--------------|------------------------------|-------------|------------------------|--------------------------|---------------------------|
| **1** | Physical/Forensic (DNA, fingerprints, digital forensics) | Primary authenticated documents (corporate registries, financial records) | FRE 902(13)/(14) certified digital records with hash | Contemporaneous clinical notes/records | Multi-INT corroborated (A1 rating: reliable source, confirmed info) | Randomized controlled trials (RCTs) with low risk of bias |
| **2** | Digital evidence (CCTV, phone records, computer forensics) | Official government documents | Native format documents with metadata | Independent expert reports | Single-INT reliable source (A2/B1 rating) | Systematic reviews and meta-analyses |
| **3** | Contemporaneous documents (emails, texts, diary entries) | Authenticated leaked documents (cryptographic verification) | TIFF/PDF with load file metadata | Third-party contemporaneous records | HUMINT from vetted source (B2/C1 rating) | Cohort studies, case-control studies |
| **4** | Witness statements (written, video recorded) | Corporate records, meeting minutes | Deposition testimony (sworn, recorded) | Witness statements (colleagues, patients) | OSINT from credible media (C2/D1 rating) | Qualitative studies with high rigor |
| **5** | Suspect interviews (PACE compliant, recorded) | Expert analysis and opinions | Live witness testimony (subject to cross-exam) | Practitioner's retrospective account | Single-source HUMINT (unverified) | Expert opinion, case reports |
| **6** | Hearsay (when admissible under exceptions) | Anonymous sources (corroborated) | Hearsay (when admissible) | Hearsay, third-party accounts | Rumor, uncorroborated reports | Anecdotes, editorials |

### 3.2 Key Convergence Principles

**Principle 1: Contemporaneity Beats Retrospection**
- Evidence created at time of event > evidence created later
- All domains prioritize real-time documentation over memory-based accounts
- **Police**: Contemporaneous notes vs. later statements
- **Journalism**: Original documents vs. reconstructed narratives
- **Legal**: Email sent May 1 > deposition June 1 recalling May 1 events
- **Regulatory**: Clinical notes during session > formal report six months later
- **Intelligence**: SIGINT intercept during event > HUMINT debrief days later
- **Academic**: Contemporaneous field notes > retrospective interviews

**Principle 2: Physical/Digital Beats Testimonial**
- Objective evidence > subjective accounts
- Harder to manipulate forensic/digital evidence than witness statements
- **Police**: DNA match > witness identification
- **Journalism**: Bank transaction record > source claiming financial transfer
- **Legal**: Metadata timestamp > witness memory of date
- **Regulatory**: Medical imaging > practitioner's description
- **Intelligence**: Satellite imagery > agent report
- **Academic**: Quantitative outcome measure > self-reported survey

**Principle 3: Primary Beats Secondary**
- Original source > derivative source
- Eliminates distortion through intermediaries
- **Police**: Original exhibit > photograph of exhibit
- **Journalism**: Corporate registry > news article citing registry
- **Legal**: Native email file > printed PDF of email
- **Regulatory**: Direct patient interview > family member account
- **Intelligence**: Intercepted communication > translation/summary
- **Academic**: Primary research article > textbook summary

**Principle 4: Authenticated Beats Unverified**
- Chain of custody, hash certification, provenance verification essential
- **Police**: Forensic image with write-blocking > unverified USB drive copy
- **Journalism**: Cryptographically verified leak > anonymous document
- **Legal**: SHA-256 certified production > uncertified file
- **Regulatory**: Medical record from official system > photocopied page
- **Intelligence**: Source with verified access > unknown source
- **Academic**: Peer-reviewed publication > preprint

**Principle 5: Corroborated Beats Single-Source**
- Multiple independent sources > single source (even if reliable)
- Reduces impact of individual source errors, biases, or deception
- **Police**: Three independent witnesses > single eyewitness
- **Journalism**: Three-source rule for publication
- **Legal**: Consistent email thread > single email
- **Regulatory**: Multiple complainants reporting same issue > single complaint
- **Intelligence**: Multi-INT fusion (HUMINT + SIGINT + IMINT)
- **Academic**: Triangulation (multiple methods/investigators/data sources)

---

## 4. Timeline Construction Methods

### 4.1 Eight-Step Legal Timeline Process (Detailed)

**Source**: Legal eDiscovery best practices; used in litigation, internal investigations, regulatory submissions

**Step 1: Start Early (Case Inception)**
- Begin timeline during initial case assessment, not trial preparation
- Early timelines drive discovery strategy, identify gaps, guide witness interviews
- **Phronesis Implementation**: Create timeline view from Day 1 of document ingest

**Step 2: Create Central Repository**
- Chronological database or spreadsheet
- **Required Fields**:
  - Date/Time (precise or range)
  - Event Description (objective facts only, no conclusions)
  - Source Document(s) with Bates numbers
  - Parties Involved (entities, witnesses)
  - Issue Tags (case themes)
  - Significance (high/medium/low)
  - Notes (attorney work product, not shared)
- **Phronesis Implementation**:
```rust
struct TimelineEvent {
    event_id: String,
    timestamp: TimeReference,
    description: String,
    source_docs: Vec<DocumentRef>,
    entities: Vec<Entity>,
    issue_tags: Vec<String>,
    significance: Significance,
    notes: Option<String>,  // Work product
}
```

**Step 3: Identify Parties and Issues**
- Tag entities: Plaintiff, Defendant, Witness, Decision-maker, Neutral third party
- Tag issues: Discrimination, Retaliation, Contract breach, Knowledge, Notice, Damages
- Enable filtering: Show only events involving Defendant X and Issue Y
- **Phronesis Implementation**: Entity and issue tagging integrated with S.A.M. engines

**Step 4: Collect Documentation**
- Cast wide net initially (all potentially relevant documents)
- **Sources**:
  - Emails, memos, reports, meeting minutes, calendar entries
  - Financial records, invoices, contracts
  - Text messages, instant messages, social media
  - Public records (news articles, regulatory filings, court records)
  - Witness interview summaries, deposition transcripts
- **Phronesis Implementation**: Documentary engine processes all document types

**Step 5: Extract Events (Date-Specific Facts)**
- **Event Definition**: Fact tied to specific date/time
- **Good Examples**:
  - "2024-03-15: Smith sent email to Jones re: 'quarterly projections' (ABC00123)"
  - "2024-04-01: Board meeting approved merger (Board Minutes, ABC00456, p. 12)"
  - "2024-05-10: Plaintiff filed EEOC charge (Charge No. 123-456)"
- **NOT Events**: Generalized conclusions without date ("Smith was aware of defect")
- **Phronesis Implementation**: Temporal engine extracts date-stamped assertions

**Step 6: Use Objective Language (Facts Only)**
- **Good**: "Jones emailed Smith: 'The brake defect was known to engineering team since January' (ABC00145)"
- **Bad**: "Jones admitted knowledge of defect" (argumentative, conclusory)
- **Rationale**: Timelines shared with opposing counsel, judges, juries—must be neutral
- **Phronesis Implementation**: Automated flagging of subjective language; suggest neutral alternatives

**Step 7: Link Evidence (Every Event Cites Supporting Documents)**
- **Bates Numbers**: ABC00001-ABC00010 (production reference)
- **Deposition Cites**: Smith Dep. 45:12-18 (transcript page:line)
- **Public Records**: SEC Form 10-K (2024) at p. 23
- **Purpose**: Instant verification, admissibility support, cross-examination facilitation
- **Phronesis Implementation**:
```rust
struct DocumentRef {
    doc_id: String,
    bates_number: Option<String>,
    page: Option<u32>,
    paragraph: Option<u32>,
    line_range: Option<(u32, u32)>,
}
```

**Step 8: Update Continuously**
- Timeline is living document throughout case lifecycle
- Add events as new discovery received
- Revise entries as deposition testimony clarifies facts
- Tag events with relevance to motions, trial
- **Phronesis Implementation**: Real-time timeline updates as documents added; version control

**Legal Timeline Analysis Techniques**:

**Temporal Gap Analysis**:
- Identify suspicious time periods with no documentation
- Potential document destruction (spoliation)
- **Example**: Email trail stops abruptly after litigation hold issued

**Temporal Density Analysis**:
- Spikes in activity indicate critical periods
- **Example**: 200 emails in 48 hours before product recall

**Temporal Contradiction Detection**:
- Compare event sequence to witness testimony
- **Example**: Witness: "First learned May 1" but timeline shows email April 15

**Critical Path Analysis**:
- Identify sequence leading to harm
- **Example**: Design → Manufacturing → Distribution → First Complaint → Recall

**Parallel Track Analysis**:
- Compare simultaneous events in different domains
- **Example**: Acquisition timeline vs. insider trading timeline (prove knowledge)

---

### 4.2 Police 5WH Framework for Timeline Construction

**Source**: College of Policing Core Investigative Doctrine; HOLMES2 case management

**Six Dimensions**:
- **What** happened? (Event reconstruction, offence classification)
- **Who** was involved? (Victims, suspects, witnesses, accomplices)
- **When** did it occur? (Timeline establishment, sequence reconstruction)
- **Where** did it take place? (Crime scene, secondary locations, digital spaces)
- **Why** did it happen? (Motivation, context, contributory factors)
- **How** was it committed? (Methods, tools, techniques, modus operandi)

**Timeline Construction Process**:

1. **Initial Report Chronology** (CAD - Computer Aided Dispatch)
   - Time of call, first officer arrival, scene preservation

2. **Victim/Witness Account Extraction**
   - PEACE interview: Free narrative → extract date/time references
   - Cognitive Interview: Context reinstatement (physical environment, emotional state)

3. **Forensic Timeline Integration**
   - Digital forensics: File creation/modification timestamps (write-blocked imaging)
   - Physical forensics: Entomology (time of death), blood spatter analysis (sequence of events)
   - Communications: Cell site analysis (phone location at specific times)

4. **CCTV Timeline Mapping**
   - Frame-by-frame analysis for exact event sequencing
   - Geographic tracking: Suspect/victim movements

5. **HOLMES2 Dynamic Reasoning**
   - Automated timeline construction from actions, statements, exhibits
   - Anomaly detection: Timeline gaps, contradictions
   - Relationship mapping over time

6. **Policy File Documentation**
   - SIO rationale for timeline interpretation
   - Alternative explanations considered
   - Evidence gaps and mitigation strategies

**Phronesis Integration**:
- Import HOLMES2-style action logs
- 5WH tagging system for filtering timeline
- Anomaly detection engine (gaps, density spikes)

---

### 4.3 Intelligence Chronologies and F3EAD Cycle

**Source**: US Joint Chiefs of Staff JP 2-0; JSOC operational intelligence

**Intelligence Chronology Components**:

**Collection Timeline**:
- Track when intelligence was collected (not when event occurred)
- Critical for assessing freshness and gaps
- **Example**: HUMINT report dated May 10 describes events of April 15 (25-day lag)

**Event Timeline**:
- Reconstruct adversary actions using multi-INT fusion
- **Levels**:
  - **Strategic**: Long-term developments (months to years)
  - **Operational**: Campaign phases (weeks to months)
  - **Tactical**: Specific actions (hours to days)

**Decision Timeline**:
- Track leadership decisions and intelligence that informed them
- Post-mortem analysis: What did we know, when did we know it?

**F3EAD Operational Cycle (Rapid Timeline)**:
- **Find**: Develop target intelligence (days to weeks)
- **Fix**: Confirm target location (hours to days)
- **Finish**: Execute operation (minutes to hours)
- **Exploit**: Immediate exploitation of captured materials (minutes to hours)
- **Analyze**: Deep analysis (hours to days)
- **Disseminate**: Share intelligence (minutes to hours)
- **Cycle Time**: Hours to days (vs. weeks/months for strategic intelligence)

**Critical Temporal Analysis**:
- **Time-Distance Analysis**: Can entity be at Location A at Time 1 and Location B at Time 2?
- **Communication Sequencing**: SIGINT intercepts before/after specific events
- **Pattern-of-Life Analysis**: Baseline behavior vs. anomalous behavior

**Phronesis Integration**:
- F3EAD-style rapid timeline for urgent safeguarding cases
- Collection timestamp vs. event timestamp tracking
- Multi-INT fusion timeline (combine document types)

---

### 4.4 Journalism ChronoFact Verification

**Source**: ICIJ, ProPublica, OCCRP methodologies

**ChronoFact Framework**:

**Stage 1: Initial Chronology Construction**
- Extract all date references from primary documents
- Build preliminary timeline (may contain contradictions)

**Stage 2: Verification Protocol**
- **5WH Questions for Every Event**:
  - What: Specific event description
  - Who: Entities involved
  - When: Precise timestamp (or best approximation)
  - Where: Geographic location
  - Why: Contextual explanation (where available)
  - How: Mechanism (where relevant)

**Stage 3: Cross-Reference with External Sources**
- Government databases (corporate registries, court records)
- News archives (dated articles)
- Financial records (timestamped transactions)

**Stage 4: Contradiction Resolution**
- When sources disagree on dates:
  1. Prioritize contemporaneous documents over retrospective accounts
  2. Prioritize official records over unofficial sources
  3. Seek third independent source to break tie
  4. If unresolvable, note contradiction in published report

**Stage 5: Publication Standard**
- Minimum three independent sources confirming key dates
- Uncertainty explicitly acknowledged ("records show transaction occurred between March 15-20")
- Timeline visualization with confidence indicators

**Phronesis Integration**:
- ChronoFact-style verification workflow
- Confidence scoring for temporal assertions
- Multi-source temporal contradiction detection

---

### 4.5 Academic Longitudinal Timeline Analysis

**Source**: Grounded Theory, Case Study Research, Process Tracing

**Academic Timeline Methods**:

**Within-Case Temporal Sequencing**:
- Track participant experiences across multiple interview waves
- Identify turning points, critical incidents, process stages

**Process Tracing (Qualitative)**:
- Establish causal sequence: Event A → Event B → Outcome C
- Test alternative causal pathways
- Distinguish correlation from causation through temporal precedence

**Retrospective vs. Contemporaneous Comparison**:
- Compare participant's retrospective narrative to documents created in real-time
- Detect memory reconstruction, hindsight bias
- **Example**: Participant describes "gradual decline" but contemporaneous notes show sudden event

**Longitudinal Coding**:
- Code same data at multiple time points
- Detect theme evolution, stability, emergence

**Phronesis Integration**:
- Support retrospective account vs. contemporaneous record comparison
- Process tracing visualization (Event A → B → C with evidence linking)
- Longitudinal coding support (track coding decisions over time)

---

### 4.6 Regulatory Investigation Timelines

**Source**: HCPC, GMC, NMC fitness-to-practice procedures

**Regulatory Timeline Requirements**:

**Incident Timeline**:
- Precise chronology of alleged misconduct
- Contemporaneous records prioritized (clinical notes, appointment systems)

**Practitioner Response Timeline**:
- Track when practitioner made aware of concerns
- Opportunity to respond at each stage (procedural fairness)

**Investigation Timeline**:
- Stage 1 (Screening): Days to weeks
- Stage 2 (Investigation): Weeks to months
- Stage 3 (Hearing): Months to years

**Contemporaneous Records Analysis**:
- Compare practitioner's clinical notes (created during incident) to formal submissions (created months later)
- Temporal gaps in documentation as red flag

**Phronesis Integration**:
- Three-stage timeline tracking (allegation → investigation → hearing)
- Contemporaneous vs. retrospective account comparison
- Procedural fairness timeline (notifications, responses, decisions)

---

## 5. Quality Control Convergence

### 5.1 Minimum Three Reviewers Standard

**Universal Finding**: All rigorous investigation methodologies require **minimum three independent reviewers** for reliable quality control.

**Police (IOPC, Major Incidents)**:
- SIO (Senior Investigating Officer)
- Deputy SIO
- Independent review by external investigator (for critical incidents)
- IOPC oversight (sensitive cases)

**Journalism (ICIJ, ProPublica, OCCRP)**:
- Primary journalist/investigator
- Editorial team (minimum 2-3 editors)
- Fact-checker (independent verification)
- Legal review (before publication)
- **Guardian Example**: 3-tier review (reporter → editor → legal → publication)

**Legal (TAR Validation, Privilege Review)**:
- First-pass review (trained reviewers)
- Senior attorney review (QC sample 5-10%)
- Partner/senior counsel review (QC sample of QC)
- **Validation Testing**: Statistical sampling for TAR (precision/recall calculation)

**Regulatory (Dual Decision-Maker Panels)**:
- Professional member (subject-matter expert)
- Lay member (public protection perspective)
- Legal assessor (procedural fairness)
- **Typical Panel**: 2-3 panel members + legal assessor

**Intelligence (Peer Review and Red Cell)**:
- Primary analyst
- Peer review (tradecraft check)
- Management review (policy implications)
- Red Cell review (alternative analysis)
- **ICD 203**: Minimum 3 reviewers for high-confidence assessments

**Academic (Inter-Rater Reliability)**:
- Minimum 2 independent coders (often 3+)
- Statistical reliability: Cohen's Kappa ≥ 0.70 (substantial agreement)
- Disagreement resolution: Consensus discussion or third coder
- **PRISMA**: Two reviewers independently screen articles; disagreements resolved by third reviewer

**Phronesis Implementation**:
```rust
struct QualityControlWorkflow {
    investigation_id: String,
    reviewers: Vec<Reviewer>,
    review_stages: Vec<ReviewStage>,
    inter_rater_reliability: Option<InterRaterReliability>,
    final_consensus: Option<Consensus>,
}

struct Reviewer {
    reviewer_id: String,
    reviewer_type: ReviewerType,
    expertise: Vec<String>,
}

enum ReviewerType {
    Primary,           // Primary investigator
    PeerReview,        // Same-level colleague
    SeniorReview,      // Supervisor/expert
    RedCell,           // Adversarial perspective
    LegalAssessor,     // Procedural compliance
    LayReviewer,       // Public protection perspective
}

struct ReviewStage {
    stage_id: String,
    reviewer_id: String,
    timestamp: DateTime<Utc>,
    findings: Vec<Finding>,
    recommendations: Vec<String>,
    flags: Vec<QCFlag>,
}

enum QCFlag {
    ContradictionUnresolved,
    EvidenceGap,
    MethodologyDeviation,
    BiasDetected(BiasType),
    ConfidenceLevelConcern,
}

struct InterRaterReliability {
    coders: Vec<String>,
    method: IRRMethod,
    score: f32,
    acceptable: bool,  // ≥ 0.70 for Cohen's Kappa
}

enum IRRMethod {
    CohenKappa,
    FleissKappa,        // 3+ raters
    PercentAgreement,
    IntraclassCorrelation,
}
```

### 5.2 Statistical Quality Control (Where Applicable)

**Legal TAR Validation Testing**:
- **Precision**: Proportion of produced documents actually relevant (50-70% typical target)
- **Recall**: Proportion of relevant documents successfully identified (75%+ typical target)
- **Validation Methods**:
  - Random sampling (statistical confidence intervals)
  - Stratified sampling (test across relevance score ranges)
  - Elusion testing (prove little relevant material missed in low-scoring documents)
- **Acceptable Performance**: Varies by jurisdiction; typically recall ≥75%, precision ≥50%

**Academic Inter-Rater Reliability**:
- **Cohen's Kappa**: Two raters
  - < 0.40: Poor agreement
  - 0.40-0.59: Fair agreement
  - 0.60-0.79: Substantial agreement
  - ≥ 0.80: Almost perfect agreement
  - **Standard**: ≥ 0.70 acceptable for most research
- **Fleiss' Kappa**: Three or more raters
- **Intraclass Correlation Coefficient (ICC)**: Continuous variables
- **Percent Agreement**: Simple but doesn't account for chance

**Intelligence Confidence Calibration**:
- **Track Record Analysis**: Compare analyst's confidence levels to actual outcomes
- **Well-Calibrated Analyst**: When they say "70% confident," they're right ~70% of the time
- **Overconfident Analyst**: Says "90% confident" but only right 60% of the time
- **Performance Management**: Provide feedback to analysts on calibration

**Phronesis Implementation**:
```rust
struct ValidationMetrics {
    validation_id: String,
    validation_type: ValidationType,
    sample_size: u32,
    metrics: ValidationResults,
}

enum ValidationType {
    TAR { method: TARMethod },
    InterRaterReliability { method: IRRMethod },
    ConfidenceCalibration,
}

struct ValidationResults {
    precision: Option<f32>,
    recall: Option<f32>,
    f1_score: Option<f32>,
    cohen_kappa: Option<f32>,
    percent_agreement: Option<f32>,
    confidence_intervals: Option<(f32, f32)>,
    acceptable: bool,
}
```

---

## 6. Bias Mitigation Strategies

### 6.1 Intelligence SATs (Structured Analytic Techniques)

**Source**: Heuer & Pherson, *Structured Analytic Techniques for Intelligence Analysis* (2021); 66 techniques across 8 categories

**Key Anti-Bias Techniques**:

**Analysis of Competing Hypotheses (ACH)**:
- Force consideration of alternative explanations
- Disprove hypotheses rather than confirm
- **Mitigation**: Confirmation bias

**Devil's Advocacy**:
- Deliberately argue against consensus view
- Institutionalized role (CIA Red Cell)
- **Mitigation**: Groupthink

**Key Assumptions Check**:
- Identify and challenge foundational assumptions
- Test: "What would have to be true for this assumption to fail?"
- **Mitigation**: Anchoring, hidden assumptions

**Red Cell Analysis**:
- Adversarial perspective (How would enemy exploit our vulnerabilities?)
- Separate team with protected dissent
- **Mitigation**: Mirror imaging, overconfidence

**Pre-Mortem Analysis**:
- Assume failure occurred; work backwards to explain why
- Identify vulnerabilities before they manifest
- **Mitigation**: Sunk cost fallacy, overconfidence

**Quality of Information Check**:
- Rate source reliability and information credibility independently (Admiralty Code)
- Identify gaps, contradictions, deception indicators
- **Mitigation**: Availability heuristic, source bias

**Phronesis Implementation**:
- ACH matrix builder (Section 2)
- Devil's Advocacy assignment in QC workflow
- Assumptions documentation requirement
- Pre-mortem template for high-stakes investigations

---

### 6.2 Legal TAR Validation and Sampling

**Source**: Legal eDiscovery TAR 1.0/2.0 methodologies; court-validated protocols

**Validation Methods**:

**Seed Set Diversity (TAR 1.0)**:
- Random sample (1,000-2,000 documents) for training
- Ensures representative coverage of document population
- **Mitigation**: Sample bias, underrepresentation of rare but critical documents

**Continuous Active Learning (TAR 2.0)**:
- No fixed seed set; model learns continuously from reviewer coding
- Adapts to complex, evolving issues
- **Mitigation**: Confirmation bias (model prioritizes diverse documents, not just confirming examples)

**Elusion Testing**:
- Sample low-scoring documents to prove minimal relevant material missed
- Statistical confidence: "95% confident that <5% relevant documents remain in low-scoring set"
- **Mitigation**: False negatives (relevant documents incorrectly classified as non-responsive)

**QC Sampling (Privilege Review)**:
- 5-10% random sample of privilege designations reviewed by senior attorney
- Error rate >5% triggers retraining and re-review
- **Mitigation**: Reviewer inconsistency, privilege over-designation

**Phronesis Implementation**:
```rust
struct BiasDetection {
    detection_id: String,
    bias_type: BiasType,
    evidence: Vec<String>,
    severity: BiasSeverity,
    mitigation_applied: Option<MitigationStrategy>,
}

enum BiasType {
    ConfirmationBias,      // Seeking evidence that confirms hypothesis
    SelectionBias,         // Cherry-picking evidence
    AnchoringBias,         // Over-reliance on first information
    Groupthink,            // Pressure to conform
    MirrorImaging,         // Assuming others think like you
    AvailabilityHeuristic, // Overweighting easily recalled info
    SunkCostFallacy,       // Continuing failed course due to prior investment
}

enum BiasSeverity {
    Critical,   // Undermines investigation integrity
    Significant, // Substantial impact on findings
    Moderate,   // Detectable but contained
    Minimal,    // Identified and mitigated
}

struct MitigationStrategy {
    strategy: String,
    applied_by: String,
    timestamp: DateTime<Utc>,
    effectiveness: Option<EffectivenessRating>,
}
```

---

### 6.3 Academic Reflexivity and Member Checking

**Source**: Qualitative research traditions (Lincoln & Guba, *Naturalistic Inquiry*; Creswell, *Qualitative Inquiry*)

**Reflexivity Practices**:

**Researcher Positioning Statement**:
- Explicit statement of researcher's background, assumptions, potential biases
- Published with research to enable reader assessment
- **Example**: "As a former healthcare administrator, I bring both insider knowledge and potential bias toward institutional perspectives."

**Reflexivity Journal**:
- Ongoing documentation of researcher's reactions, interpretations, decisions
- Track evolution of thinking
- Identify moments when personal bias may influence interpretation

**Peer Debriefing**:
- Regular discussions with colleagues uninvolved in project
- Challenge interpretations, identify blind spots
- **Mitigation**: Lone researcher bias, interpretation drift

**Member Checking**:
- Return findings to participants for validation
- **Two Forms**:
  1. **Transcript Review**: Participants verify accuracy of interview transcript
  2. **Interpretation Review**: Participants comment on researcher's interpretations
- **Critical Debate**: Some argue member checking problematic (participants may disagree with accurate but unflattering interpretations)

**Negative Case Analysis**:
- Actively seek evidence contradicting emerging themes
- Test rival explanations
- **Grounded Theory**: Constant comparison until theoretical saturation (no new disconfirming evidence)

**Audit Trail**:
- Document all coding decisions, changes, rationale
- Enable external auditor to assess dependability
- **Components**: Raw data, coding decisions, analysis products, process notes

**Phronesis Implementation**:
- Reflexivity journal integrated into investigation workspace
- Member checking workflow (share findings with involved parties for comment)
- Negative case analysis prompts (system suggests contradictory evidence)
- Audit trail export for appeals/external review

---

### 6.4 Journalism Hypothesis-Based Framework and Editorial Review

**Source**: ICIJ, ProPublica, OCCRP methodologies

**Hypothesis-Based Investigation**:

**Separate Facts from Assumptions**:
```
Investigation Hypothesis: Company X evaded taxes through offshore shell companies
├── Known Facts (documented, verified)
│   ├── Corporate registry shows Company X owns Entity Y
│   ├── Entity Y registered in tax haven jurisdiction
│   └── Financial records show payments to Entity Y
└── Assumptions (requires verification)
    ├── Payments to Entity Y constitute tax evasion (ASSUMPTION: requires legal analysis)
    ├── Company X executives were aware of Entity Y's purpose (ASSUMPTION: requires evidence)
    └── Entity Y has no legitimate business purpose (ASSUMPTION: requires investigation)
```

**Iterative Verification**:
- Test each assumption systematically
- Convert assumptions to facts or disprove
- Adjust hypothesis as evidence accumulates

**Editorial Review Process**:

**Stage 1: Reporter Self-Review**:
- Checklist: Have I verified key facts? Do I have three sources? Have I contacted subjects for comment?

**Stage 2: Editor Review**:
- Challenge methodology, sources, interpretations
- Identify gaps, alternative explanations, potential biases

**Stage 3: Fact-Checker Review**:
- Independent verification of all factual claims
- Check dates, numbers, quotes, document citations
- Re-contact sources to confirm quotes

**Stage 4: Legal Review**:
- Assess defamation risk
- Verify right-of-reply compliance
- Check for contempt of court, privacy violations

**Stage 5: Ethics Review (High-Sensitivity Stories)**:
- Independent ethics panel reviews impact on vulnerable sources
- Public interest justification for potentially harmful disclosures

**Phronesis Implementation**:
- Hypothesis tree visualization (facts vs. assumptions)
- Multi-stage review workflow (reporter → editor → fact-check → legal → ethics)
- Right-of-reply tracking (ensure subjects given opportunity to respond)

---

## 7. Unified Framework for Phronesis FCIP

### 7.1 Core Architecture Principles

**Principle 1: Domain-Agnostic Core with Domain-Specific Adapters**

**Core Components** (universal across domains):
- Evidence ingestion and authentication
- Entity extraction and resolution
- Timeline construction and visualization
- Eight S.A.M. contradiction types detection
- Quality control workflows (minimum 3 reviewers)
- Audit trail and provenance tracking

**Domain Adapters**:
- **Police Adapter**: HOLMES2 import/export, PACE compliance, CPIA disclosure
- **Journalism Adapter**: ICIJ Aleph integration, ChronoFact verification, right-of-reply
- **Legal Adapter**: TAR workflow, Bates numbering, privilege review, FRE compliance
- **Regulatory Adapter**: Three-stage gatekeeping, dual panels, contemporaneous records priority
- **Intelligence Adapter**: Admiralty Code rating, ACH matrix, Words of Estimative Probability
- **Academic Adapter**: PRISMA workflow, inter-rater reliability, reflexivity journal

**Principle 2: Multi-Level Evidence Hierarchy**

All evidence items receive three independent ratings:

1. **Provenance Score** (0.0-1.0)
   - 1.0 = Authenticated with hash certification, clear chain of custody
   - 0.5 = Verified source but no cryptographic authentication
   - 0.0 = Unknown provenance

2. **Temporal Score** (0.0-1.0)
   - 1.0 = Contemporaneous (created at time of event)
   - 0.5 = Retrospective but verifiable timestamp
   - 0.0 = Undated or date disputed

3. **Corroboration Score** (0.0-1.0)
   - 1.0 = Corroborated by 3+ independent sources
   - 0.5 = Corroborated by 1-2 sources
   - 0.0 = Single source, uncorroborated

**Composite Evidence Quality** = (Provenance × 0.4) + (Temporal × 0.3) + (Corroboration × 0.3)

**Principle 3: Contradiction Detection as Central Engine**

All eight S.A.M. contradiction types implemented as Rust modules:

```rust
pub mod contradiction {
    pub mod self_contradiction;
    pub mod inter_doc;
    pub mod temporal;
    pub mod evidentiary;
    pub mod modality_shift;
    pub mod selective_citation;
    pub mod scope_shift;
    pub mod unexplained_change;

    pub struct ContradictionEngine {
        detectors: Vec<Box<dyn ContradictionDetector>>,
        confidence_threshold: f32,
    }

    pub trait ContradictionDetector: Send + Sync {
        fn detect(&self, context: &InvestigationContext) -> Vec<Contradiction>;
        fn contradiction_type(&self) -> ContradictionType;
        fn confidence_score(&self, contradiction: &Contradiction) -> f32;
    }
}
```

**Principle 4: Quality Control Gates**

Investigations cannot progress to next stage without QC approval:

**Stage 1: Evidence Collection**
- QC Gate: Chain of custody documented, authentication completed
- Reviewers: Primary investigator + QC auditor

**Stage 2: Initial Analysis**
- QC Gate: All eight contradiction types checked, evidence hierarchy applied
- Reviewers: Primary investigator + peer reviewer

**Stage 3: Findings**
- QC Gate: Minimum 3 reviewers approval, inter-rater reliability ≥0.70 (where applicable)
- Reviewers: Primary + peer + senior + Red Cell (for high-stakes)

**Stage 4: Report**
- QC Gate: Audit trail complete, procedural fairness verified
- Reviewers: Primary + legal assessor + domain expert

**Principle 5: Transparent Audit Trail**

Every action logged with:
- User ID
- Timestamp
- Action type (document added, contradiction detected, finding coded, etc.)
- Rationale (free text)
- Evidence links (document IDs)
- Confidence level

Audit trail exportable for:
- Appeals
- Judicial review
- Regulatory oversight
- Academic publication

---

### 7.2 Implementation Architecture

**Technology Stack**:
- **Backend**: Rust (Tauri 2.9, SQLite via sqlx)
- **Frontend**: React 18, React Router 7, Tailwind CSS
- **AI**: Vercel AI SDK (multi-provider: Claude, Groq, Gemini)
- **State**: Zustand, TanStack Query
- **Document Processing**: pdf-extract (Rust), Docker Python tools for OCR
- **Analytics**: S.A.M. engines (11 engines in Rust)

**Core Modules**:

```rust
// src-tauri/src/engines/contradiction/mod.rs

use crate::db::Database;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};

pub struct ContradictionEngine {
    db: Arc<RwLock<Database>>,
    detectors: Vec<Box<dyn ContradictionDetector>>,
    config: ContradictionConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Contradiction {
    pub contradiction_id: String,
    pub contradiction_type: ContradictionType,
    pub evidence: Vec<EvidenceRef>,
    pub description: String,
    pub confidence: f32,
    pub severity: ContradictionSeverity,
    pub detected_at: DateTime<Utc>,
    pub detected_by: DetectionMethod,
    pub resolution_status: ResolutionStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ContradictionType {
    Self { doc_id: String },
    InterDoc { doc_ids: Vec<String> },
    Temporal { timeline_conflict: TemporalConflict },
    Evidentiary { claim: String, evidence: Vec<String> },
    ModalityShift { statement_versions: Vec<String> },
    SelectiveCitation { cited: Vec<String>, uncited: Vec<String> },
    ScopeShift { original: String, revised: String },
    UnexplainedChange { position_history: Vec<String> },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DetectionMethod {
    NLP { model: String, confidence: f32 },
    Timeline { algorithm: String },
    HumanReview { reviewer_id: String },
    Hybrid { methods: Vec<DetectionMethod> },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResolutionStatus {
    Unresolved,
    UnderReview { reviewer_id: String, since: DateTime<Utc> },
    Resolved { resolution: ResolutionType, by: String, at: DateTime<Utc> },
    Disputed { dispute_reason: String, by: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ResolutionType {
    Confirmed { explanation: String },
    Reconciled { explanation: String },
    Dismissed { reason: String },
    Unresolvable { acknowledged: bool },
}

impl ContradictionEngine {
    pub async fn detect_all(&self, case_id: &str) -> Result<Vec<Contradiction>, Error> {
        let mut all_contradictions = Vec::new();

        for detector in &self.detectors {
            let context = self.build_context(case_id).await?;
            let contradictions = detector.detect(&context);
            all_contradictions.extend(contradictions);
        }

        // Deduplicate and rank by confidence
        self.deduplicate_and_rank(all_contradictions)
    }

    pub async fn validate_findings(
        &self,
        contradictions: Vec<Contradiction>,
        reviewers: Vec<String>,
    ) -> Result<ValidationReport, Error> {
        // Assign to minimum 3 reviewers
        if reviewers.len() < 3 {
            return Err(Error::InsufficientReviewers);
        }

        // Calculate inter-rater reliability
        let irr = self.calculate_inter_rater_reliability(&contradictions, &reviewers).await?;

        // Require Cohen's Kappa ≥ 0.70
        if irr.kappa < 0.70 {
            return Err(Error::InsufficientAgreement { kappa: irr.kappa });
        }

        Ok(ValidationReport {
            contradictions,
            reviewers,
            inter_rater_reliability: irr,
            validation_timestamp: Utc::now(),
            approved: true,
        })
    }
}
```

---

## 8. Implementation Architecture

### 8.1 Database Schema Extensions

**Contradictions Table**:
```sql
CREATE TABLE contradictions (
    contradiction_id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    contradiction_type TEXT NOT NULL,  -- SELF, INTER_DOC, TEMPORAL, etc.
    description TEXT NOT NULL,
    confidence REAL NOT NULL CHECK(confidence >= 0.0 AND confidence <= 1.0),
    severity TEXT NOT NULL CHECK(severity IN ('CRITICAL', 'SIGNIFICANT', 'MODERATE', 'MINIMAL')),
    detected_at TEXT NOT NULL,
    detected_by TEXT NOT NULL,  -- JSON: {method: "NLP", user_id: "...", model: "..."}
    resolution_status TEXT NOT NULL CHECK(resolution_status IN ('UNRESOLVED', 'UNDER_REVIEW', 'RESOLVED', 'DISPUTED')),
    resolution_details TEXT,  -- JSON
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE INDEX idx_contradictions_case ON contradictions(case_id);
CREATE INDEX idx_contradictions_type ON contradictions(contradiction_type);
CREATE INDEX idx_contradictions_status ON contradictions(resolution_status);
```

**Contradiction Evidence Linking**:
```sql
CREATE TABLE contradiction_evidence (
    contradiction_id TEXT NOT NULL,
    evidence_id TEXT NOT NULL,
    evidence_type TEXT NOT NULL CHECK(evidence_type IN ('DOCUMENT', 'TIMELINE_EVENT', 'ENTITY', 'CLAIM')),
    role TEXT NOT NULL CHECK(role IN ('PRIMARY', 'SUPPORTING', 'CONTRADICTING')),
    page_number INTEGER,
    paragraph_number INTEGER,
    text_span TEXT,  -- JSON: {start: 123, end: 456}
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (contradiction_id, evidence_id, evidence_type),
    FOREIGN KEY (contradiction_id) REFERENCES contradictions(contradiction_id)
);
```

**Quality Control Reviews**:
```sql
CREATE TABLE qc_reviews (
    review_id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    stage TEXT NOT NULL CHECK(stage IN ('EVIDENCE_COLLECTION', 'INITIAL_ANALYSIS', 'FINDINGS', 'REPORT')),
    reviewer_id TEXT NOT NULL,
    reviewer_type TEXT NOT NULL CHECK(reviewer_type IN ('PRIMARY', 'PEER', 'SENIOR', 'RED_CELL', 'LEGAL', 'LAY')),
    findings TEXT NOT NULL,  -- JSON array
    recommendations TEXT,
    flags TEXT,  -- JSON array of QCFlag
    approval_status TEXT NOT NULL CHECK(approval_status IN ('APPROVED', 'REJECTED', 'REQUIRES_REVISION')),
    reviewed_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (case_id) REFERENCES cases(case_id)
);

CREATE INDEX idx_qc_case_stage ON qc_reviews(case_id, stage);
```

**Inter-Rater Reliability Tracking**:
```sql
CREATE TABLE irr_sessions (
    session_id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    coders TEXT NOT NULL,  -- JSON array of reviewer IDs
    method TEXT NOT NULL CHECK(method IN ('COHEN_KAPPA', 'FLEISS_KAPPA', 'PERCENT_AGREEMENT', 'ICC')),
    score REAL NOT NULL,
    acceptable BOOLEAN NOT NULL,  -- TRUE if score ≥ threshold
    threshold REAL NOT NULL DEFAULT 0.70,
    conducted_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (case_id) REFERENCES cases(case_id)
);
```

---

### 8.2 TypeScript Integration (CONTRACT.ts)

```typescript
// src/CONTRACT.ts

export interface Contradiction {
  contradiction_id: string;
  case_id: string;
  contradiction_type: ContradictionType;
  description: string;
  confidence: number;  // 0.0-1.0
  severity: ContradictionSeverity;
  detected_at: string;  // ISO 8601
  detected_by: DetectionMethod;
  resolution_status: ResolutionStatus;
  resolution_details?: ResolutionDetails;
}

export type ContradictionType =
  | { type: 'SELF'; doc_id: string }
  | { type: 'INTER_DOC'; doc_ids: string[] }
  | { type: 'TEMPORAL'; timeline_conflict: TemporalConflict }
  | { type: 'EVIDENTIARY'; claim: string; evidence: string[] }
  | { type: 'MODALITY_SHIFT'; statement_versions: string[] }
  | { type: 'SELECTIVE_CITATION'; cited: string[]; uncited: string[] }
  | { type: 'SCOPE_SHIFT'; original: string; revised: string }
  | { type: 'UNEXPLAINED_CHANGE'; position_history: string[] };

export type ContradictionSeverity = 'CRITICAL' | 'SIGNIFICANT' | 'MODERATE' | 'MINIMAL';

export interface DetectionMethod {
  method: 'NLP' | 'TIMELINE' | 'HUMAN_REVIEW' | 'HYBRID';
  details: {
    model?: string;
    confidence?: number;
    reviewer_id?: string;
    algorithm?: string;
    methods?: DetectionMethod[];
  };
}

export type ResolutionStatus =
  | { status: 'UNRESOLVED' }
  | { status: 'UNDER_REVIEW'; reviewer_id: string; since: string }
  | { status: 'RESOLVED'; resolution: ResolutionType; by: string; at: string }
  | { status: 'DISPUTED'; dispute_reason: string; by: string };

export interface QCReview {
  review_id: string;
  case_id: string;
  stage: QCStage;
  reviewer_id: string;
  reviewer_type: ReviewerType;
  findings: Finding[];
  recommendations?: string[];
  flags?: QCFlag[];
  approval_status: 'APPROVED' | 'REJECTED' | 'REQUIRES_REVISION';
  reviewed_at: string;
}

export type QCStage = 'EVIDENCE_COLLECTION' | 'INITIAL_ANALYSIS' | 'FINDINGS' | 'REPORT';

export type ReviewerType = 'PRIMARY' | 'PEER' | 'SENIOR' | 'RED_CELL' | 'LEGAL' | 'LAY';

export interface IRRSession {
  session_id: string;
  case_id: string;
  coders: string[];  // Reviewer IDs
  method: 'COHEN_KAPPA' | 'FLEISS_KAPPA' | 'PERCENT_AGREEMENT' | 'ICC';
  score: number;
  acceptable: boolean;  // true if score ≥ threshold
  threshold: number;  // Default 0.70
  conducted_at: string;
}
```

---

### 8.3 React Components (UI Implementation)

**Contradiction Dashboard**:
```typescript
// src/components/analysis/contradiction-dashboard.tsx

import React from 'react';
import { useContradictions } from '@/hooks/use-contradictions';
import { ContradictionCard } from './contradiction-card';
import { ContradictionFilter } from './contradiction-filter';

export function ContradictionDashboard({ caseId }: { caseId: string }) {
  const { data: contradictions, isLoading } = useContradictions(caseId);
  const [filter, setFilter] = React.useState<ContradictionFilter>({
    types: [],
    severity: [],
    status: [],
  });

  const filteredContradictions = React.useMemo(() => {
    return contradictions?.filter(c => {
      if (filter.types.length > 0 && !filter.types.includes(c.contradiction_type.type)) {
        return false;
      }
      if (filter.severity.length > 0 && !filter.severity.includes(c.severity)) {
        return false;
      }
      if (filter.status.length > 0 && !filter.status.includes(c.resolution_status.status)) {
        return false;
      }
      return true;
    });
  }, [contradictions, filter]);

  return (
    <div className="contradiction-dashboard">
      <ContradictionFilter filter={filter} onChange={setFilter} />

      <div className="contradiction-grid">
        {filteredContradictions?.map(contradiction => (
          <ContradictionCard key={contradiction.contradiction_id} contradiction={contradiction} />
        ))}
      </div>
    </div>
  );
}
```

**Timeline View with Contradiction Highlighting**:
```typescript
// src/components/analysis/timeline-view.tsx

import React from 'react';
import { useTimeline } from '@/hooks/use-timeline';
import { useContradictions } from '@/hooks/use-contradictions';

export function TimelineView({ caseId }: { caseId: string }) {
  const { data: events } = useTimeline(caseId);
  const { data: contradictions } = useContradictions(caseId);

  const temporalContradictions = React.useMemo(() => {
    return contradictions?.filter(c => c.contradiction_type.type === 'TEMPORAL') || [];
  }, [contradictions]);

  return (
    <div className="timeline-view">
      {events?.map(event => (
        <TimelineEvent
          key={event.event_id}
          event={event}
          contradictions={temporalContradictions.filter(c =>
            c.contradiction_type.timeline_conflict.event_ids.includes(event.event_id)
          )}
        />
      ))}
    </div>
  );
}
```

---

## 9. Sources

### Police Investigations
- College of Policing. (2023). *Core Investigative Doctrine.* https://www.college.police.uk/app/investigation/core-investigative-doctrine
- Home Office. (1996). *Criminal Procedure and Investigations Act 1996 (CPIA).* https://www.legislation.gov.uk/ukpga/1996/25/contents
- Fisher, R. P. & Geiselman, R. E. (1992). *Memory-Enhancing Techniques for Investigative Interviewing: The Cognitive Interview.* Charles C. Thomas.

### Journalism Investigations
- International Consortium of Investigative Journalists (ICIJ). *Panama Papers Methodology.* https://www.icij.org/investigations/panama-papers/
- ProPublica. *Reporting Standards and Practices.* https://www.propublica.org/about/reporting-standards
- Organized Crime and Corruption Reporting Project (OCCRP). *Aleph Investigation Platform.* https://aleph.occrp.org/

### Legal eDiscovery
- EDRM Project. *Electronic Discovery Reference Model.* https://edrm.net/
- *Da Silva Moore v. Publicis Groupe*, 287 F.R.D. 182 (S.D.N.Y. 2012) [TAR 1.0 court approval]
- *Rio Tinto PLC v. Vale S.A.*, 306 F.R.D. 125 (D. Del. 2015) [TAR 2.0/CAL endorsement]
- *Hyles v. New York City*, 2016 WL 4077114 (S.D.N.Y. 2016) [Court mandated TAR over linear review]

### Regulatory Investigations
- Health and Care Professions Council (HCPC). *Fitness to Practise Process.* https://www.hcpc-uk.org/concerns/
- General Medical Council (GMC). *Investigation and Case Examiners.* https://www.gmc-uk.org/
- British Psychological Society (BPS). *Professional Conduct Procedures.* https://www.bps.org.uk/

### Intelligence Analysis
- Heuer, Richards J., Jr., and Randolph H. Pherson. *Structured Analytic Techniques for Intelligence Analysis.* 3rd ed., CQ Press, 2021.
- US Office of the Director of National Intelligence. *Intelligence Community Directive 203: Analytic Standards.* January 2, 2015.
- NATO. *AJP-2: Allied Joint Doctrine for Intelligence.* November 2016.
- Kent, Sherman. "Words of Estimative Probability." *Studies in Intelligence* 8, no. 4 (1964): 49-65.

### Academic Research
- Page, Matthew J., et al. "The PRISMA 2020 statement: an updated guideline for reporting systematic reviews." *BMJ* 372 (2021): n71.
- Higgins, Julian PT, et al. *Cochrane Handbook for Systematic Reviews of Interventions.* Version 6.5, 2024.
- Braun, Virginia, and Victoria Clarke. "Using thematic analysis in psychology." *Qualitative Research in Psychology* 3.2 (2006): 77-101.
- Charmaz, Kathy. *Constructing Grounded Theory.* 2nd ed., Sage, 2014.
- Lincoln, Yvonna S., and Egon G. Guba. *Naturalistic Inquiry.* Sage, 1985.

---

## Document Control

**Version**: 1.0
**Date**: 2026-01-17
**Author**: Interdisciplinary synthesis for Phronesis FCIP
**Classification**: Reference Standard - Cross-Domain Integration
**Review Cycle**: Semi-annual update recommended to reflect evolving methodologies
**License**: Internal reference for Phronesis FCIP development

---

**End of Document**

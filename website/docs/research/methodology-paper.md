# Systematic Adversarial Methodology (S.A.M.): A Framework for Forensic Analysis of Institutional Document Chains

## Abstract

This paper presents the Systematic Adversarial Methodology (S.A.M.), a novel framework for forensic analysis of institutional document chains. S.A.M. addresses the epistemological problem of false premise propagation through institutional systems, where unverified claims gain authority through repetition and institutional endorsement rather than evidential foundation. The methodology employs a four-phase cascade model (ANCHOR → INHERIT → COMPOUND → ARRIVE) combined with a formal taxonomy of eight contradiction types to trace how false premises originate, propagate across institutional boundaries, accumulate spurious authority, and contribute to harmful outcomes. Unlike traditional document analysis approaches that privilege official institutional narratives, S.A.M. applies systematic skepticism to identify gaps between evidentiary foundation and institutional certainty. We present the theoretical foundations, formal methodology, validation framework, and discuss applications to cases involving institutional failure, wrongful convictions, child protection errors, and medical malpractice. This framework provides a systematic approach to institutional accountability analysis applicable across legal, medical, social services, and investigative domains.

**Keywords**: document analysis, institutional epistemology, false premises, authority laundering, forensic methodology, institutional accountability, evidence quality, claim propagation

---

## 1. Introduction

### 1.1 The Problem: Institutional Truth Decay

Modern institutions generate vast document chains where claims are made, repeated, and treated as established facts without continuous evidential grounding. A social worker's speculation in a case note can become a "known fact" in a court report; a police officer's assumption can propagate through multiple agencies; an expert witness's unsupported opinion can be cited as authoritative by subsequent decision-makers. This phenomenon - where institutional repetition substitutes for evidential verification - represents a fundamental epistemological failure with profound consequences for individuals subject to institutional power.

Hannah Arendt identified this pattern in *The Human Condition* (1958), observing that modern bureaucracies create self-referential truth systems where documents cite other documents in circular chains divorced from observable reality. More recently, institutional scholars have documented how organizational structures incentivize the reproduction of existing narratives rather than critical examination of foundational claims (Vaughan, 1996; Reason, 1990).

The problem is not merely that institutions make errors, but that institutional structures systematically privilege continuity over accuracy, authority over evidence, and narrative coherence over truth-testing. When a claim enters the institutional record, especially if authored by someone with institutional authority, subsequent actors face strong incentives to adopt rather than challenge it. The claim accumulates authority with each repetition, even - especially - when the repetition adds no new evidence.

### 1.2 Existing Approaches and Their Limitations

Traditional document analysis in legal, medical, and investigative contexts suffers from several systematic biases:

**1. Chronological privileging**: Most analysis follows document creation order, giving disproportionate weight to early claims simply because they appeared first, regardless of evidential quality.

**2. Authority bias**: Formal institutional position (judge, doctor, expert witness) is often treated as evidence quality rather than as a source that itself requires evidential support.

**3. Narrative coherence bias**: Document analysis often seeks to construct coherent narratives, unconsciously filtering out contradictions and inconsistencies that would disrupt the story.

**4. Verification amnesia**: Later documents cite earlier documents without tracking whether the original claim was ever verified, creating citation chains with no evidential foundation.

Existing computational approaches to document analysis (e.g., topic modeling, sentiment analysis, named entity recognition) can identify patterns but lack the adversarial skepticism necessary to distinguish between *claimed* and *established* facts. Natural language processing models trained on institutional documents may simply reproduce institutional biases at scale.

### 1.3 Theoretical Positioning

S.A.M. synthesizes insights from several theoretical traditions:

**Social epistemology** (Goldman, 1999; Kitcher, 2001): How do social institutions produce and certify knowledge? What are the epistemic risks when institutional structure incentivizes conformity over accuracy?

**Institutional theory** (DiMaggio & Powell, 1983): Why do organizations adopt practices and claims from other organizations even in the absence of evidence? How does institutional isomorphism affect truth claims?

**Cognitive science of reasoning** (Kahneman, 2011; Mercier & Sperber, 2011): Human reasoning exhibits systematic biases toward confirmation and authority. How do these individual biases compound in institutional settings?

**Dialectical argumentation** (Toulmin, 1958; Walton, 1996): What distinguishes strong arguments from weak ones? How can we formalize the analysis of argumentative structure in institutional documents?

**Critical discourse analysis** (Fairclough, 1995; van Dijk, 2008): How do power structures manifest in language? What linguistic patterns signal unwarranted certainty or authority claims?

S.A.M.'s innovation is to operationalize these theoretical insights into a systematic methodology that can be applied reproducibly across diverse institutional contexts.

### 1.4 Contributions

This paper makes the following contributions:

1. **Formal cascade model**: A four-phase model (ANCHOR → INHERIT → COMPOUND → ARRIVE) describing how false premises propagate through institutional systems

2. **Contradiction taxonomy**: A systematic classification of eight contradiction types with formal definitions and detection criteria

3. **Authority laundering framework**: A conceptual model explaining how claims gain spurious credibility through institutional repetition

4. **Computational implementation**: Translation of the methodology into algorithmic form suitable for AI-assisted analysis at scale

5. **Validation framework**: Criteria for empirical testing and validation of S.A.M. findings

---

## 2. Theoretical Foundations

### 2.1 Epistemology of Institutional Knowledge

Institutional knowledge production differs from scientific knowledge production in critical ways:

**Authority vs. Evidence**: Scientific claims gain acceptance through replication and empirical testing. Institutional claims often gain acceptance through positional authority. A claim in a judge's order has legal force regardless of its evidential foundation.

**Irreversibility**: Scientific findings can be revised when new evidence emerges. Institutional findings - especially in legal contexts - often have finality that prevents correction even when errors are discovered.

**Path Dependency**: Institutional decisions create precedents that constrain future decisions. Early errors can lock in trajectories that resist correction.

**Accountability Asymmetry**: Scientists face reputational consequences for unsupported claims. Institutional actors often face no consequences for uncritical adoption of claims from other institutional sources.

### 2.2 The Cascade Model: From Premise to Outcome

S.A.M. models institutional document chains as cascades with four distinct phases:

#### Phase 1: ANCHOR - Premise Origin

Every claim has an origin point: the first document where it appears in the institutional record. The critical question: What is the evidential basis at origin?

**Origin types** (in descending evidential quality):
- **Primary source**: Direct observation, contemporaneous recording, physical evidence
- **Professional opinion**: Expert judgment grounded in relevant expertise and evidence
- **Hearsay**: Report of what someone else said or observed
- **Speculation**: Inference not grounded in direct evidence
- **Misattribution**: Claim attributed to wrong source
- **Fabrication**: No identifiable evidentiary basis

The ANCHOR phase identifies the origin of every significant claim and assesses its initial evidential quality. Crucially, this assessment is retrospective - we examine the claim as it appeared at origin, not how it was later characterized.

#### Phase 2: INHERIT - Propagation Without Verification

Once a claim enters the institutional record, it can propagate to other documents and institutions. The INHERIT phase tracks:

**Propagation patterns**:
- Verbatim copying (exact reproduction)
- Paraphrase (semantic preservation with lexical change)
- Citation (explicit reference to source document)
- Implicit adoption (treating claim as fact without citation)
- Circular reference (mutual citation loops)

**Institutional boundaries**: Claims crossing from one institution to another (e.g., police to social services to court) are particularly susceptible to authority laundering because the receiving institution may assume the sending institution verified the claim.

**Mutation during propagation**: Claims often change subtly during propagation:
- **Amplification**: Uncertainty becomes certainty ("may have occurred" → "occurred")
- **Attenuation**: Specificity becomes vagueness ("said X on date Y" → "said X")
- **Certainty drift**: Hedging language disappears ("possibly" → removed)
- **Attribution shift**: Source changes ("witness reported" → "investigation found")
- **Scope expansion**: Limited claim becomes general ("on one occasion" → "repeatedly")

The critical pattern detected in INHERIT is **propagation without verification**: a claim is adopted by a new document without the new author conducting independent verification.

#### Phase 3: COMPOUND - Authority Accumulation

As claims propagate, they accumulate markers of authority. The COMPOUND phase tracks how claims gain credibility through repetition and endorsement rather than evidence.

**Authority markers**:
- **Court findings**: Judicial determination (highest institutional weight)
- **Expert opinions**: Credentials create presumption of reliability
- **Official reports**: Institutional imprimatur (e.g., investigation report)
- **Professional assessments**: Clinical or forensic determinations
- **Agency determinations**: Administrative decisions
- **Multiple corroboration**: "Multiple sources confirm" (even if all derive from same origin)

**Authority laundering**: The key phenomenon is when a weakly-founded claim gains authority through institutional processing:

1. Speculation enters record (low authority)
2. Adopted by professional assessment (medium authority)
3. Cited in official report (high authority)
4. Becomes basis for court finding (highest authority)

At each step, the institutional actor may reasonably assume prior steps involved verification, but if no verification occurred at any step, the final high-authority determination rests on the original speculation.

#### Phase 4: ARRIVE - Outcome Linkage

The ARRIVE phase maps how false premises contributed to harmful outcomes. This involves:

**Outcome types**:
- Court orders (removal of children, incarceration, injunctions)
- Findings of fact (official determinations)
- Agency decisions (denial of services, termination of rights)
- Professional actions (diagnosis, treatment, reporting)
- Regulatory actions (license revocation, sanctions)

**Causation analysis**:
- **But-for causation**: Would the outcome have occurred without the false premise?
- **Chain of causation**: Tracing the path from premise to outcome through institutional decisions
- **Multiple sufficient causes**: Cases where multiple false premises independently support the outcome
- **Contribution vs. necessity**: Even non-essential premises can contribute to outcome severity

**Harm assessment**:
- **Catastrophic**: Irreversible, life-altering consequences
- **Severe**: Substantial, long-term harm
- **Moderate**: Material harm with potential for mitigation
- **Minor**: Limited impact, readily remedied

### 2.3 The Eight Contradiction Types

S.A.M. employs a formal taxonomy of eight contradiction types, extending traditional logical contradiction to capture the subtler forms of inconsistency common in institutional documents:

#### 1. SELF - Internal Contradiction
Mutually incompatible statements within a single document. Example: A report states "X was present during the incident" in one paragraph and "X was not at the scene" in another paragraph.

**Detection criteria**: Logical incompatibility or mutual exclusivity of propositions within document boundaries.

#### 2. INTER_DOC - Cross-Document Contradiction
Incompatible claims across different documents. Example: Document A states event occurred on June 1; Document B states same event occurred on June 15.

**Detection criteria**: Propositional incompatibility across document boundaries, accounting for possibility that both documents could be wrong.

#### 3. TEMPORAL - Timeline Inconsistency
Logically impossible time sequences or date contradictions. Example: Report written on May 1 describes events that occurred on May 15; witness claims to observe X before it existed.

**Detection criteria**: Temporal impossibility or inconsistency with established chronology.

#### 4. EVIDENTIARY - Claim-Evidence Mismatch
Stated conclusions not supported by cited evidence. Example: Report concludes "no evidence of X" but quoted source material describes X.

**Detection criteria**: Gap between cited evidence and inference drawn; conclusion contradicts or exceeds source material.

#### 5. MODALITY_SHIFT - Unjustified Certainty Change
Unexplained change in hedging, certainty, or modal language. Example: Initial report states "possibly occurred"; later report states definitively "occurred" without citing new evidence.

**Detection criteria**: Certainty increase without corresponding evidence increase; modal operators added or removed across document chain.

#### 6. SELECTIVE_CITATION - Cherry-Picked References
Citing sources in ways that distort their meaning or omit contradicting portions. Example: Report cites sentence from source supporting claim X while omitting adjacent sentence refuting X.

**Detection criteria**: Quotation or citation that misrepresents source through selective extraction or contextual omission.

#### 7. SCOPE_SHIFT - Unexplained Generalization
Unjustified expansion or contraction of claim scope. Example: Source describes single incident; report characterizes as pattern ("repeatedly," "consistently").

**Detection criteria**: Quantifier change (singular → plural), temporal scope expansion (once → always), or qualifier removal without justification.

#### 8. UNEXPLAINED_CHANGE - Position Reversal
Change in institutional position or factual assertion without explanation. Example: Agency initially approves X; later denies X without explaining change or citing new evidence.

**Detection criteria**: Reversal of previous determination without explicit justification or new evidence.

---

## 3. Methodology

### 3.1 Data Requirements

S.A.M. analysis requires:

**Document corpus**: Complete set of relevant institutional documents, ideally including:
- Primary source documents (incident reports, contemporaneous notes, recordings)
- Professional assessments (clinical evaluations, forensic reports)
- Investigation reports (agency investigations, internal reviews)
- Administrative determinations (case plans, service decisions)
- Legal documents (pleadings, orders, findings)
- Correspondence between institutions

**Temporal metadata**: Creation dates, revision dates, author information

**Provenance metadata**: Document source, authoring institution, cited sources

**Extracted text**: Machine-readable text from all documents (OCR where necessary)

### 3.2 Phase-by-Phase Procedure

#### ANCHOR Phase Procedure

**Input**: Complete document corpus with extracted text and metadata

**Process**:
1. Identify all significant factual claims across all documents
2. For each claim, locate its first appearance (origin document)
3. Assess evidential basis at origin:
   - What evidence is cited?
   - Is evidence primary source, expert opinion, hearsay, or speculation?
   - Does evidence actually support the claim?
4. Flag **false premises**: claims that entered record without adequate foundation or that contradict available evidence
5. Generate **origin map**: claim ID → origin document, origin date, origin type, evidential quality score

**Output**:
- Origin records for all significant claims
- False premise inventory with supporting evidence
- Evidential quality scores (0.0-1.0) for each claim at origin

#### INHERIT Phase Procedure

**Input**: Origin map from ANCHOR phase, complete document corpus

**Process**:
1. For each claim identified in ANCHOR, search subsequent documents for reappearance
2. Track propagation pattern:
   - Verbatim, paraphrase, citation, implicit adoption, or circular
3. Note institutional boundaries crossed (if any)
4. Detect mutations:
   - Compare claim formulation at origin vs. in each subsequent document
   - Identify amplification, attenuation, certainty drift, attribution shift, scope changes
5. Assess verification status:
   - Did adopting document cite new evidence?
   - Did adopting document conduct independent verification?
6. Generate **propagation graph**: claim → [document chain with mutation annotations]

**Output**:
- Propagation records: source claim, source doc, target doc, propagation type
- Mutation detections: original text, mutated text, mutation type
- Institutional boundary crossings
- Unverified adoption inventory

#### COMPOUND Phase Procedure

**Input**: Propagation graph from INHERIT phase

**Process**:
1. Identify authority markers in document chain:
   - Court findings referencing claim
   - Expert endorsements
   - Official report conclusions
   - Professional assessments
2. Assign authority weights (1-5 scale):
   - Court finding: 5
   - Official report: 4
   - Expert opinion: 4
   - Professional assessment: 3
   - Agency determination: 3
3. Calculate cumulative authority scores for each claim
4. Detect **authority laundering**:
   - High cumulative authority score
   - Low initial evidential quality (from ANCHOR)
   - No new evidence added during propagation (from INHERIT)
5. Generate **authority accumulation graph**: claim → authority markers → cumulative score

**Output**:
- Authority marker records: claim, authority document, authority type, weight
- Cumulative authority scores for all claims
- Authority laundering detections (false premise + high authority)
- Laundering paths (speculation → professional → official → court)

#### ARRIVE Phase Procedure

**Input**: Authority accumulation graph from COMPOUND phase, outcome documents

**Process**:
1. Identify harmful outcomes in document corpus:
   - Court orders
   - Agency decisions
   - Professional actions
   - Regulatory actions
2. For each outcome, identify supporting claims cited in outcome document
3. Trace each supporting claim back through phases:
   - COMPOUND: What authority did it accumulate?
   - INHERIT: How did it propagate?
   - ANCHOR: What was its initial evidential basis?
4. Conduct **but-for analysis**:
   - Would outcome have occurred without this claim?
   - If claim is false premise, would evidence-based determination differ?
5. Assess harm level:
   - Catastrophic, severe, moderate, or minor
6. Identify potential remediation:
   - Can outcome be reversed?
   - What corrective actions are possible?

**Output**:
- Outcome records: type, description, date, document, harm level
- Causation chains: outcome → supporting claims → propagation path → origin
- But-for analyses for false premise contributions
- Remediation recommendations

### 3.3 Analytical Techniques

#### Claim Extraction and Normalization

Identifying and extracting claims from institutional documents requires distinguishing:
- **Factual claims** (can be true or false): "X occurred on date Y"
- **Opinions** (subjective assessments): "X was inappropriate"
- **Hedged claims** (explicitly uncertain): "X may have occurred"
- **Procedural statements** (process descriptions): "We conducted interview Z"

Normalization involves:
- Resolving entity references (pronouns, titles, names)
- Standardizing dates and times
- Identifying claim scope (singular/plural, specific/general)
- Preserving modal operators (may, might, possibly, allegedly)

#### Claim Matching Across Documents

Determining when a claim in Document B is a repetition of a claim in Document A requires semantic similarity assessment:
- Exact match (verbatim copying)
- High lexical overlap with semantic equivalence
- Paraphrase with preserved meaning
- Partial match (subset or superset of original claim)

False negatives (missing true matches) and false positives (spurious matches) both pose challenges. Conservative matching (high threshold, fewer matches) reduces false positives at cost of missing some propagations. Permissive matching (low threshold, more matches) increases recall but risks spurious connections.

#### Evidential Quality Assessment

Assessing evidential quality at claim origin involves:

**Source credibility**:
- First-hand observation > hearsay
- Contemporaneous recording > retrospective recall
- Neutral party > interested party
- Multiple independent sources > single source

**Evidence type**:
- Physical evidence > testimonial evidence
- Documentary evidence > oral evidence
- Expert evidence (in domain) > lay evidence

**Corroboration**:
- Independent corroboration increases quality
- Circular corroboration (sources citing each other) does not
- Derivative corroboration (all from same root) does not

Evidential quality scores (0.0-1.0):
- 0.9-1.0: Direct physical evidence, contemporaneous recording by neutral observer
- 0.7-0.9: Professional assessment with examination, credible first-hand testimony
- 0.5-0.7: Hearsay from credible source, indirect evidence
- 0.3-0.5: Speculation marked as such, uncertain inferences
- 0.1-0.3: Uncorroborated hearsay, speculation presented as fact
- 0.0-0.1: No identifiable evidentiary basis, contradicted by available evidence

#### Authority Weight Assignment

Authority weights reflect institutional force, not evidential quality:

**Weight 5** (Highest):
- Judicial findings of fact
- Appellate court determinations
- Final administrative determinations with legal effect

**Weight 4**:
- Expert witness testimony
- Official investigation reports
- Regulatory agency determinations

**Weight 3**:
- Professional assessments (clinical, forensic)
- Agency caseworker determinations
- Institutional policy interpretations

**Weight 2**:
- Supervisor endorsements
- Peer professional concurrence
- Cross-agency adoption

**Weight 1**:
- Line staff observations
- Initial reports
- Preliminary assessments

Cumulative authority score = sum of weights from all documents endorsing the claim.

### 3.4 Quality Control and Validation

S.A.M. analysis requires validation at multiple stages:

**Claim extraction validation**:
- Inter-rater reliability: Do independent coders identify same claims?
- Completeness: Spot-check to ensure significant claims not missed
- Accuracy: Verify claims correctly extracted and represented

**Claim matching validation**:
- Sample validation: Manual review of matched claims
- Precision/recall metrics: False positive and false negative rates
- Boundary cases: Careful examination of ambiguous matches

**Evidential quality validation**:
- Expert review: Domain experts assess quality scores
- Consensus calibration: Multiple raters converge on standards
- Anchoring: Use clear prototypical examples for each quality band

**Causation validation**:
- Counterfactual testing: Would alternative documents support different outcome?
- Expert review: Legal/medical experts assess but-for analyses
- Sensitivity analysis: How much would changing individual elements affect overall conclusion?

---

## 4. Implementation: Computational S.A.M.

### 4.1 Algorithmic Translation

S.A.M. can be implemented computationally using combination of natural language processing, knowledge representation, and machine learning:

**Phase 1 - ANCHOR**:
- NLP for claim extraction (dependency parsing, semantic role labeling)
- Citation analysis for source tracing
- Evidence-claim alignment scoring
- Origin type classification (supervised ML on labeled examples)

**Phase 2 - INHERIT**:
- Semantic similarity matching (embeddings, paraphrase detection)
- Mutation detection (text comparison, certainty classification)
- Citation network analysis
- Institutional boundary detection (metadata analysis)

**Phase 3 - COMPOUND**:
- Authority marker extraction (NER, document classification)
- Citation network traversal
- Authority weight assignment (rule-based + ML)
- Authority score calculation (graph algorithms)

**Phase 4 - ARRIVE**:
- Outcome extraction (document classification, NER)
- Claim-outcome linking (citation analysis, semantic matching)
- Causal chain construction (graph traversal)
- But-for analysis (counterfactual reasoning)

### 4.2 AI-Assisted Analysis

Large language models (LLMs) can augment S.A.M. analysis:

**Strengths of LLMs for S.A.M.**:
- Semantic understanding for claim matching across paraphrase
- Context-aware contradiction detection
- Nuanced assessment of evidential quality
- Natural language generation for explanations

**Limitations and Risks**:
- LLMs may reproduce institutional biases present in training data
- Hallucination risk: generating plausible but unsupported claims
- Inconsistency: same analysis may produce different results on different runs
- Lack of transparency: difficult to audit reasoning

**Mitigation strategies**:
- Structured output formats (JSON schemas) to constrain outputs
- Adversarial prompting: explicitly instruct model to apply skepticism
- Multi-pass analysis: cross-check findings across multiple runs
- Human review: AI-assisted, not AI-automated
- Explicit uncertainty quantification: require confidence scores
- Source grounding: require citations to specific document locations

### 4.3 Software Architecture

The reference implementation (Phronesis platform) employs:

**Document processing layer**:
- PDF extraction (pdf-extract, Tesseract OCR)
- Text chunking (semantic segmentation)
- Metadata extraction
- Entity resolution (canonical identity mapping)

**Analysis engine layer**:
- 11 specialized engines (entity, temporal, argumentation, bias, contradiction, accountability, professional, omission, expert, documentary, narrative)
- S.A.M. orchestrator (phase sequencing, checkpoint/resume)
- AI client abstraction (multi-provider: Claude, Groq, Gemini)

**Storage layer**:
- SQLite for local-first operation
- Structured storage: claims, origins, propagations, authority markers, outcomes
- Graph representation for propagation and causation chains

**Export layer**:
- PDF reports with citation links
- DOCX reports with tracked citations
- Audit trail with complete evidence chain
- JSON for programmatic access

---

## 5. Validation Framework

### 5.1 Construct Validity

Does S.A.M. measure what it claims to measure? Validation requires demonstrating that:

**Origin type classification** correlates with independent evidential quality assessments:
- Expert raters classify random sample of origin claims
- Compare S.A.M. classifications to expert consensus
- Cohen's kappa > 0.7 indicates substantial agreement

**Authority laundering detection** identifies cases where legal/institutional scholars agree improper authority accumulation occurred:
- Curate dataset of documented authority laundering cases (wrongful convictions, institutional failures)
- Apply S.A.M. to document sets
- Measure detection rate (sensitivity) and false positive rate (1 - specificity)

**Propagation detection** matches human-identified claim repetitions:
- Expert coders manually trace claim propagations in document set
- Compare S.A.M. propagation graph to expert-generated graph
- Calculate edge precision and recall

### 5.2 Criterion Validity

Does S.A.M. predict external criteria?

**Predictive validity**: Do S.A.M. findings predict subsequent institutional corrections?
- Apply S.A.M. to historical cases where later review revealed errors
- Measure whether high-severity S.A.M. findings correlate with later reversals
- Test: Do authority laundering detections predict wrongful conviction exonerations?

**Concurrent validity**: Do S.A.M. findings align with other indicators of institutional failure?
- Compare S.A.M. scores to oversight body findings
- Correlate with external audit conclusions
- Test: Do high false premise counts correlate with adverse inspection reports?

### 5.3 Inter-Rater Reliability

Do different analysts applying S.A.M. reach similar conclusions?

**Protocol**:
1. Train multiple analysts on S.A.M. methodology
2. Provide same document set to all analysts
3. Analysts independently conduct S.A.M. analysis
4. Calculate inter-rater agreement:
   - Claim extraction: % overlap in identified claims
   - Origin classification: Cohen's kappa for origin types
   - Propagation detection: Edge agreement in propagation graphs
   - Authority laundering: Agreement on laundering flags
   - Causation: Agreement on outcome-claim links

**Acceptable thresholds**:
- Claim extraction: > 80% overlap
- Origin classification: κ > 0.7 (substantial agreement)
- Propagation detection: > 70% edge agreement
- Authority laundering flags: κ > 0.6 (moderate-to-substantial)
- Causation links: κ > 0.6 (moderate-to-substantial)

### 5.4 Sensitivity and Specificity

For binary classifications (e.g., "Is this authority laundering?"):

**Sensitivity** (true positive rate): Of all actual cases of authority laundering in ground truth, what proportion does S.A.M. detect?

**Specificity** (true negative rate): Of all non-laundering authority markers, what proportion does S.A.M. correctly exclude?

Ground truth can be established through:
- Expert consensus on curated test cases
- Known cases with post-hoc institutional acknowledgment
- Adversarial testing (attempting to fool S.A.M. with edge cases)

**Receiver Operating Characteristic (ROC) analysis**:
- Plot sensitivity vs. (1 - specificity) at various threshold settings
- Area under curve (AUC) > 0.8 indicates good discrimination
- Select threshold that balances false positives vs. false negatives based on application context

### 5.5 Robustness Testing

**Adversarial testing**: Attempt to break S.A.M. with deliberately challenging cases:
- Documents designed to obscure origins
- Complex propagation networks with circular references
- Edge cases for each contradiction type
- Documents with sophisticated rhetorical masking

**Noise testing**: How does S.A.M. perform with imperfect inputs?
- OCR errors
- Incomplete document sets
- Metadata gaps
- Ambiguous entity references

**Cross-domain validation**: Apply S.A.M. to diverse institutional contexts:
- Legal (wrongful convictions, family court, civil litigation)
- Medical (malpractice, institutional failures)
- Social services (child protection, foster care)
- Investigative (journalism, internal affairs)

---

## 6. Applications

### 6.1 Wrongful Conviction Analysis

**Case study**: Documentation chain in wrongful conviction case

**ANCHOR findings**:
- Initial police report contains speculation about motive, marked as speculation
- Eyewitness identification conducted under suggestive conditions (low quality)
- Forensic testimony later discredited (no scientific basis at time)

**INHERIT findings**:
- Prosecutor's charging document repeats speculation as fact (modality shift)
- Defense expert opinion excluded; only state expert opinion reaches jury
- Appellate documents cite trial court findings without independent review

**COMPOUND findings**:
- Trial court finding based on discredited forensics gains high authority weight
- Multiple appellate affirmances increase cumulative authority score
- Post-conviction courts defer to prior findings ("law of the case")

**ARRIVE findings**:
- Conviction and lengthy sentence directly caused by false premises
- But-for analysis: Without discredited forensic evidence and speculation-as-fact, insufficient evidence for conviction
- Harm: Catastrophic (decades of wrongful imprisonment)
- Remediation: Exoneration, compensation, policy changes for forensic standards

### 6.2 Child Protection Institutional Failure

**Case study**: Erroneous child removal and placement disruption

**ANCHOR findings**:
- Mandated reporter makes report based on "concerns" (speculation)
- Initial assessment contains hypothesis presented as fact
- No contemporaneous physical evidence; entire case built on interpretations

**INHERIT findings**:
- Social worker's hypothesis propagates to multiple reports without verification
- Crosses institutional boundaries: child protection → family court → service providers
- Each repetition adds certainty (hedging language progressively removed)

**COMPOUND findings**:
- Court order based on social worker testimony (authority weight 3)
- Guardian ad litem adopts social worker's claims without independent investigation (weight 2)
- Expert witness testifies but admits evaluation based on document review, not direct assessment (weight 4, but evidence quality low)
- Cumulative authority score high despite absent foundational evidence

**ARRIVE findings**:
- Child removed from home; placed in foster care where actual abuse occurs
- Original removal based on false premise
- But-for analysis: Without unverified speculation, removal criteria not met
- Harm: Severe (trauma from removal, subsequent actual abuse in placement)
- Remediation: Reunification, trauma-informed services, systemic reforms

### 6.3 Medical Malpractice and Diagnostic Cascade

**Case study**: Misdiagnosis propagating through medical records

**ANCHOR findings**:
- Initial clinician notes "rule out X" (differential diagnosis)
- No confirmatory testing performed
- Working diagnosis entered into problem list

**INHERIT findings**:
- Subsequent clinicians see diagnosis in problem list, assume confirmed
- Treatment proceeds based on unconfirmed diagnosis
- Complications attributed to "underlying condition X" rather than treatment
- Patient's reported symptoms contradicting diagnosis discounted

**COMPOUND findings**:
- Consulting specialists defer to admitting diagnosis
- Medical records establish "documented history of X"
- Insurance and disability determinations cite medical record consensus

**ARRIVE findings**:
- Incorrect treatment causes iatrogenic harm
- Actual condition undiagnosed and untreated
- But-for analysis: With correct diagnosis, different treatment, better outcome
- Harm: Severe (permanent disability from incorrect treatment)
- Remediation: Correct diagnosis, appropriate treatment, systemic reforms for diagnostic verification

### 6.4 Investigative Journalism

**Application**: Journalists investigating institutional failures can use S.A.M. to:

**Document contradictions systematically**:
- Identify where official narratives conflict with source documents
- Trace how initial uncertainties became reported certainties
- Map institutional boundary crossings where verification should have occurred

**Expose authority laundering**:
- Show how weakly-founded claims gained credibility through institutional repetition
- Identify circular citation loops
- Reveal absence of primary sources behind authoritative-sounding conclusions

**Construct timelines**:
- Place documents in precise chronological order
- Identify temporal impossibilities (effects preceding causes)
- Show when decision-makers had or should have had access to contradicting information

**Support investigative narratives**:
- Generate evidence maps with citations to specific document locations
- Produce visualizations of propagation networks
- Create audit trails for fact-checking and editing

---

## 7. Limitations and Boundary Conditions

### 7.1 Epistemological Limitations

**Incomplete document sets**: S.A.M. can only analyze documents available. Deliberate destruction, selective disclosure, or inaccessible records create blind spots.

**Oral communication**: Much institutional knowledge transfer occurs through conversations, phone calls, and informal channels not documented. S.A.M. cannot detect propagation through oral channels.

**Subjective judgments**: Some institutional claims involve legitimate professional judgment where evidence is inherently ambiguous. S.A.M. must distinguish between (1) judgments reasonably made despite uncertainty and (2) unjustified certainty.

**Context collapse**: Extracting claims from documents can lose crucial context. A claim that is appropriate in one context (e.g., speculative hypothesis in brainstorming) becomes problematic when propagated to different context (e.g., court finding) without maintaining hedging.

### 7.2 Methodological Limitations

**Claim boundary problems**: Determining where one claim ends and another begins can be ambiguous. Complex claims may be decomposable into sub-claims with different evidential bases.

**Semantic similarity thresholds**: No perfect threshold exists for claim matching. Too strict: miss genuine propagations. Too lenient: spurious matches.

**Authority weight subjectivity**: While weights reflect institutional hierarchy, reasonable people may disagree on specific assignments. Weight 3 vs. Weight 4 may be context-dependent.

**Causation complexity**: But-for causation is philosophically complex. Outcomes rarely have single causes. Multiple false premises may be individually insufficient but jointly sufficient.

### 7.3 Ethical Considerations

**Institutional legitimacy**: S.A.M. is designed to identify failures, not to delegitimize all institutional decision-making. Most institutional actors operate in good faith with imperfect information. The goal is systemic improvement, not individual blame.

**Adversarial vs. collaborative**: While S.A.M. applies adversarial skepticism to documents, its deployment should be collaborative with institutions willing to learn from failures.

**Power asymmetries**: S.A.M. is most useful when analyzing powerful institutions' treatment of less powerful individuals. Applying S.A.M. to individual claims against institutions requires careful attention to relative resources and procedural fairness.

**Transparency and due process**: When S.A.M. findings inform legal proceedings, the methodology must be transparent and subject to challenge. Proprietary or black-box S.A.M. implementations undermine due process.

### 7.4 Boundary Conditions

S.A.M. is appropriate when:

**Documentary record exists**: Sufficient documents to trace claim origins and propagation

**Claims are factual**: Method applies to factual claims that can be true or false, not to purely normative or subjective judgments

**Institutional chain is analyzable**: Documents from multiple institutions or decision points

**Failure is suspected**: S.A.M. is investigative methodology for failure analysis, not routine quality assurance

S.A.M. is inappropriate when:

**No documentary basis**: Purely oral traditions, institutional cultures without documentation

**Normative questions**: Policy disagreements, value conflicts, resource allocation priorities

**Real-time decision support**: S.A.M. is retrospective analysis, not prospective decision tool

**Good faith uncertainty**: Legitimate disagreement among experts based on ambiguous evidence; S.A.M. cannot resolve genuine epistemic uncertainty

---

## 8. Future Directions

### 8.1 Theoretical Extensions

**Probabilistic S.A.M.**: Incorporate Bayesian reasoning to model evidential uncertainty and propagation of uncertainty through document chains.

**Network science**: Apply social network analysis to propagation graphs - identify central nodes, structural holes, community detection.

**Game theory**: Model institutional actors' incentives to verify vs. adopt claims; analyze equilibria in citation networks.

**Temporal dynamics**: Model how evidential quality and authority weight change over time; decay functions for evidence aging.

### 8.2 Empirical Research Agenda

**Large-scale validation studies**:
- Compile ground-truth dataset of known institutional failures with complete document sets
- Systematic inter-rater reliability studies across diverse domains
- Cross-cultural validation (different legal systems, institutional structures)

**Longitudinal studies**:
- Track outcomes after S.A.M. analysis presented to institutions
- Measure impact on institutional practices
- Assess whether S.A.M. interventions reduce future failures

**Comparative studies**:
- Compare S.A.M. findings to traditional document analysis
- Benchmark against expert opinion
- Assess cost-effectiveness relative to intensive manual review

### 8.3 Methodological Refinements

**Automated claim extraction**: Develop specialized NLP models trained on institutional documents to improve claim identification and extraction accuracy.

**Uncertainty quantification**: Formal models for confidence intervals on S.A.M. findings; sensitivity analysis for key decisions.

**Explainability**: Enhanced visualization and narrative generation to make S.A.M. findings accessible to non-technical audiences.

**Real-time monitoring**: Adapt S.A.M. for prospective use - flag potential failures as documents are created rather than post-hoc analysis.

### 8.4 Interdisciplinary Integration

**Legal informatics**: Integration with e-discovery tools, litigation support software, legal knowledge graphs.

**Clinical informatics**: Medical record analysis, diagnostic safety, clinical decision support.

**Public health**: Institutional response analysis during epidemics, policy evaluation.

**Organizational science**: Institutional learning, quality improvement, root cause analysis.

---

## 9. Conclusion

The Systematic Adversarial Methodology represents a principled approach to forensic analysis of institutional document chains. By combining formal models of claim propagation, contradiction detection, and authority assessment with computational implementation, S.A.M. provides a systematic tool for institutional accountability analysis.

The methodology's core insight - that institutional repetition substitutes for evidential verification, and that this substitution has identifiable patterns - offers a framework for understanding how institutional failures occur and propagate. The four-phase cascade model (ANCHOR → INHERIT → COMPOUND → ARRIVE) traces the lifecycle of false premises from origin through propagation, authority accumulation, and harmful outcomes.

While S.A.M. has limitations - it requires adequate documentary records, cannot resolve genuine epistemic uncertainty, and must be applied with attention to context - its systematic approach offers advantages over purely intuitive document analysis. By making implicit skepticism explicit and systematic, S.A.M. reduces the risk that institutional authority will be mistaken for evidential quality.

The validation framework presented here provides criteria for empirical testing of S.A.M.'s reliability and validity. Ongoing research will refine the methodology, extend its theoretical foundations, and assess its practical impact on institutional accountability.

Ultimately, S.A.M. is not merely a technical methodology but a commitment to epistemic humility in institutional settings. It operationalizes the principle that claims require continuous evidentiary grounding, that authority does not substitute for evidence, and that institutions have duties to verify rather than merely propagate. In contexts where institutional power shapes individual lives, this commitment is both methodological and ethical.

---

## References

Arendt, H. (1958). *The Human Condition*. University of Chicago Press.

DiMaggio, P. J., & Powell, W. W. (1983). The iron cage revisited: Institutional isomorphism and collective rationality in organizational fields. *American Sociological Review*, 48(2), 147-160.

Fairclough, N. (1995). *Critical Discourse Analysis: The Critical Study of Language*. Longman.

Goldman, A. I. (1999). *Knowledge in a Social World*. Oxford University Press.

Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.

Kitcher, P. (2001). *Science, Truth, and Democracy*. Oxford University Press.

Mercier, H., & Sperber, D. (2011). Why do humans reason? Arguments for an argumentative theory. *Behavioral and Brain Sciences*, 34(2), 57-74.

Reason, J. (1990). *Human Error*. Cambridge University Press.

Toulmin, S. E. (1958). *The Uses of Argument*. Cambridge University Press.

van Dijk, T. A. (2008). *Discourse and Power*. Palgrave Macmillan.

Vaughan, D. (1996). *The Challenger Launch Decision: Risky Technology, Culture, and Deviance at NASA*. University of Chicago Press.

Walton, D. (1996). *Argumentation Schemes for Presumptive Reasoning*. Lawrence Erlbaum Associates.

---

## Appendix A: Formal Definitions

### A.1 Claim

A **claim** *c* is a proposition asserted in document *d* at time *t*:
- *c* = ⟨proposition, document, timestamp, author, modality⟩

**Proposition**: The semantic content (can be represented in first-order logic)
**Document**: The document identifier where claim appears
**Timestamp**: When the document was created
**Author**: The institutional actor making the claim
**Modality**: Hedging/certainty indicators (certain, probable, possible, speculative)

### A.2 Claim Origin

The **origin** of claim *c*, denoted *origin(c)*, is the earliest document *d₀* in which *c* or a semantically equivalent claim appears:
- *origin(c)* = *d₀* where *timestamp(d₀)* < *timestamp(d)* for all other documents *d* containing *c*

### A.3 Evidential Quality

**Evidential quality** *E(c, d)* is a function mapping claim *c* in document *d* to [0, 1]:
- *E(c, d)* = 0: No evidential basis or contradicted by evidence
- *E(c, d)* = 1: Maximal evidential support (primary source, contemporaneous, corroborated)

For claim *c* at origin *d₀*:
- If *E(c, d₀)* < τ (threshold, typically 0.3), *c* is a **false premise**

### A.4 Propagation

A **propagation** is a tuple ⟨c, d_source, d_target, t, m⟩ where:
- *c*: the claim being propagated
- *d_source*: source document
- *d_target*: target document containing *c* or equivalent
- *t*: propagation type (verbatim, paraphrase, citation, implicit, circular)
- *m*: mutation (if any): original formulation vs. mutated formulation

### A.5 Authority Weight

**Authority weight** *W(d, c)* is institutional force of document *d* endorsing claim *c*:
- *W* ∈ {1, 2, 3, 4, 5}
- Higher weights correspond to higher institutional force

**Cumulative authority score**: *A(c)* = Σ *W(d, c)* for all documents *d* endorsing *c*

### A.6 Authority Laundering

Claim *c* exhibits **authority laundering** if:
1. *E(c, origin(c))* < τ₁ (low initial evidential quality)
2. *A(c)* > τ₂ (high cumulative authority)
3. No document in propagation chain added new evidence significantly increasing *E(c, d)*

### A.7 But-For Causation

Outcome *o* is **but-for caused** by claim *c* if:
1. *c* is cited in support of *o* (or cited in document cited in support of *o*, transitively)
2. Counterfactual: In nearest possible world where *c* is false or absent, *o* does not occur (or occurs with materially different characteristics)

---

## Appendix B: Computational Schemas

### B.1 Claim Schema (JSON)

```json
{
  "claim_id": "uuid",
  "claim_text": "string",
  "claim_type": "factual | opinion | hedged | procedural",
  "origin_document_id": "uuid",
  "origin_date": "ISO 8601 timestamp",
  "origin_page": "integer | null",
  "origin_context": "string (surrounding text)",
  "origin_type": "primary_source | professional_opinion | hearsay | speculation | misattribution | fabrication",
  "evidential_quality": "float [0.0, 1.0]",
  "is_false_premise": "boolean",
  "confidence": "float [0.0, 1.0]"
}
```

### B.2 Propagation Schema (JSON)

```json
{
  "propagation_id": "uuid",
  "source_claim_id": "uuid",
  "source_document_id": "uuid",
  "source_date": "ISO 8601 timestamp",
  "target_document_id": "uuid",
  "target_date": "ISO 8601 timestamp",
  "propagation_type": "verbatim | paraphrase | citation | implicit_adoption | circular_reference",
  "verification_performed": "boolean",
  "crossed_institutional_boundary": "boolean",
  "source_institution": "string | null",
  "target_institution": "string | null",
  "mutation_detected": "boolean",
  "mutation_type": "amplification | attenuation | certainty_drift | attribution_shift | scope_expansion | scope_contraction | null",
  "original_text": "string",
  "mutated_text": "string | null"
}
```

### B.3 Authority Marker Schema (JSON)

```json
{
  "marker_id": "uuid",
  "claim_id": "uuid",
  "authority_document_id": "uuid",
  "authority_date": "ISO 8601 timestamp",
  "authority_type": "court_finding | expert_opinion | official_report | professional_assessment | agency_determination | police_conclusion",
  "authority_weight": "integer [1, 5]",
  "endorsement_type": "explicit_adoption | implicit_reliance | qualified_acceptance | referenced_without_verification",
  "is_authority_laundering": "boolean",
  "laundering_path": "string (human-readable description) | null",
  "cumulative_authority_score": "integer"
}
```

### B.4 Outcome Schema (JSON)

```json
{
  "outcome_id": "uuid",
  "outcome_type": "court_order | finding_of_fact | recommendation | agency_decision | regulatory_action | media_publication",
  "outcome_description": "string",
  "outcome_date": "ISO 8601 timestamp | null",
  "outcome_document_id": "uuid",
  "harm_level": "catastrophic | severe | moderate | minor",
  "harm_description": "string",
  "root_claim_ids": ["uuid", "uuid", ...],
  "but_for_analysis": "string",
  "causation_confidence": "float [0.0, 1.0]",
  "remediation_possible": "boolean",
  "remediation_actions": ["string", "string", ...]
}
```

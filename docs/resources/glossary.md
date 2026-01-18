# Glossary: S.A.M. Terminology and Key Concepts

This glossary defines key terms used in the Systematic Adversarial Methodology (S.A.M.) and Phronesis platform.

---

## Core S.A.M. Concepts

### Systematic Adversarial Methodology (S.A.M.)
A principled framework for forensic analysis of institutional document chains. S.A.M. addresses the epistemological problem of false premise propagation through institutional systems, where unverified claims gain authority through repetition and institutional endorsement rather than evidential foundation.

### Four-Phase Cascade Model
The core analytical framework of S.A.M., consisting of ANCHOR → INHERIT → COMPOUND → ARRIVE phases that trace how false premises originate, propagate, accumulate authority, and contribute to harmful outcomes.

### ANCHOR Phase
The first phase of S.A.M. analysis, focused on identifying where claims first enter the institutional record and assessing their initial evidential basis. Distinguishes primary sources from speculation, professional opinion from hearsay.

### INHERIT Phase
The second phase of S.A.M. analysis, tracking how claims propagate across documents and institutional boundaries without verification. Detects mutations such as amplification, scope expansion, and attribution shifts.

### COMPOUND Phase
The third phase of S.A.M. analysis, mapping how claims accumulate institutional authority through repetition and endorsement. Identifies authority laundering patterns where low-evidence claims gain high institutional credibility.

### ARRIVE Phase
The fourth phase of S.A.M. analysis, tracing connections from false premises to harmful outcomes. Conducts but-for causation analysis to determine whether outcomes would have occurred without the false premises.

---

## Claim Analysis

### Claim
A proposition asserted in a document. Claims can be factual (can be true or false), opinions (subjective assessments), hedged (explicitly uncertain), or procedural (process descriptions).

### Claim Origin
The earliest document in which a claim or semantically equivalent statement appears. Identifying origins is critical to assessing initial evidential quality.

### Origin Type
Classification of how a claim entered the institutional record:
- **Primary source**: Direct observation, contemporaneous recording, physical evidence
- **Professional opinion**: Expert judgment grounded in relevant expertise and evidence
- **Hearsay**: Report of what someone else said or observed
- **Speculation**: Inference not grounded in direct evidence
- **Misattribution**: Claim attributed to wrong source
- **Fabrication**: No identifiable evidentiary basis

### Evidential Quality Score
Quantitative assessment (0.0-1.0) of the evidential basis for a claim at its origin:
- 0.9-1.0: Direct physical evidence, contemporaneous recording by neutral observer
- 0.7-0.9: Professional assessment with examination, credible first-hand testimony
- 0.5-0.7: Hearsay from credible source, indirect evidence
- 0.3-0.5: Speculation marked as such, uncertain inferences
- 0.1-0.3: Uncorroborated hearsay, speculation presented as fact
- 0.0-0.1: No identifiable evidentiary basis, contradicted by available evidence

### False Premise
A claim that entered the institutional record without adequate evidential foundation or that contradicts available evidence. Formally defined as a claim with evidential quality score below threshold (typically 0.3).

---

## Propagation Concepts

### Propagation
The process by which a claim from one document appears in subsequent documents. Can occur through verbatim copying, paraphrase, explicit citation, implicit adoption, or circular reference.

### Propagation Type
Classification of how claims move between documents:
- **Verbatim**: Exact reproduction of original text
- **Paraphrase**: Semantic preservation with lexical changes
- **Citation**: Explicit reference to source document
- **Implicit adoption**: Treating claim as fact without citation
- **Circular reference**: Mutual citation loops between documents

### Institutional Boundary Crossing
When a claim propagates from one institution to another (e.g., police report → social services assessment → court finding). Particularly susceptible to authority laundering because receiving institutions may assume sending institutions verified the claim.

### Propagation Without Verification
The critical pattern where a claim is adopted by a new document without the new author conducting independent verification. Core focus of INHERIT phase analysis.

### Claim Mutation
Changes that occur to claims during propagation:
- **Amplification**: Uncertainty becomes certainty ("may have occurred" → "occurred")
- **Attenuation**: Specificity becomes vagueness ("said X on date Y" → "said X")
- **Certainty drift**: Hedging language disappears ("possibly" → removed)
- **Attribution shift**: Source changes ("witness reported" → "investigation found")
- **Scope expansion**: Limited claim becomes general ("on one occasion" → "repeatedly")
- **Scope contraction**: General claim becomes specific (rare but possible)

---

## Authority Concepts

### Authority Weight
Institutional force of a document endorsing a claim, assigned on 1-5 scale:
- **Weight 5**: Judicial findings, appellate determinations, final administrative orders
- **Weight 4**: Expert testimony, official investigation reports, regulatory determinations
- **Weight 3**: Professional assessments, agency caseworker determinations, institutional policies
- **Weight 2**: Supervisor endorsements, peer concurrence, cross-agency adoption
- **Weight 1**: Line staff observations, initial reports, preliminary assessments

### Cumulative Authority Score
Sum of authority weights from all documents endorsing a claim. High scores indicate claims with substantial institutional backing.

### Authority Marker
An endorsement, citation, or adoption of a claim by a document with institutional authority. Authority markers are the building blocks of cumulative authority scores.

### Authority Laundering
The phenomenon where weakly-founded claims gain credibility through institutional processing. Formally defined as: (1) low initial evidential quality, (2) high cumulative authority score, (3) no new evidence added during propagation.

### Authority Laundering Path
The sequence of documents through which a false premise accumulates authority. Example: speculation → professional assessment → official report → court finding.

### Institutional Authority
The power of an institution or institutional actor to make claims that are presumed credible due to position rather than evidential quality. Distinguished from evidential quality, which is based on actual evidence.

---

## Contradiction Types

### SELF (Internal Contradiction)
Mutually incompatible statements within a single document. Example: A report states "X was present during the incident" in one paragraph and "X was not at the scene" in another.

### INTER_DOC (Cross-Document Contradiction)
Incompatible claims across different documents. Example: Document A states event occurred on June 1; Document B states same event occurred on June 15.

### TEMPORAL (Timeline Inconsistency)
Logically impossible time sequences or date contradictions. Example: Report written May 1 describes events occurring May 15; witness claims to observe X before it existed.

### EVIDENTIARY (Claim-Evidence Mismatch)
Stated conclusions not supported by cited evidence. Example: Report concludes "no evidence of X" but quoted source material describes X.

### MODALITY_SHIFT (Unjustified Certainty Change)
Unexplained change in hedging, certainty, or modal language. Example: Initial report states "possibly occurred"; later report states definitively "occurred" without citing new evidence.

### SELECTIVE_CITATION (Cherry-Picked References)
Citing sources in ways that distort their meaning or omit contradicting portions. Example: Report cites sentence supporting claim X while omitting adjacent sentence refuting X.

### SCOPE_SHIFT (Unexplained Generalization)
Unjustified expansion or contraction of claim scope. Example: Source describes single incident; report characterizes as pattern ("repeatedly," "consistently").

### UNEXPLAINED_CHANGE (Position Reversal)
Change in institutional position or factual assertion without explanation. Example: Agency initially approves X; later denies X without explaining change or citing new evidence.

---

## Causation Concepts

### Outcome
A decision, determination, or action with consequences for individuals subject to institutional power. Types include court orders, findings of fact, agency decisions, professional actions, and regulatory actions.

### But-For Causation
Counterfactual test for causation: Would the outcome have occurred but for the false premise? If no, the false premise is but-for cause of the outcome.

### Causation Chain
The path from false premise through institutional decisions to harmful outcome. Traced by identifying which claims supported which decisions, recursively through document network.

### Multiple Sufficient Causes
Cases where multiple false premises each independently support the outcome. Even if one premise is removed, outcome would still occur due to others.

### Contributory Cause
A false premise that contributed to outcome severity or likelihood but was not strictly necessary. Important for harm assessment even when not but-for cause.

### Harm Level
Assessment of outcome severity:
- **Catastrophic**: Irreversible, life-altering consequences (wrongful execution, decades of imprisonment)
- **Severe**: Substantial, long-term harm (child removal, medical injury)
- **Moderate**: Material harm with potential for mitigation (financial loss, temporary restriction)
- **Minor**: Limited impact, readily remedied (procedural delay, minimal inconvenience)

---

## Epistemological Concepts

### Institutional Epistemology
The study of how institutions produce, validate, and transmit knowledge. Focuses on epistemic risks when institutional structure incentivizes conformity over accuracy.

### Social Epistemology
The branch of philosophy examining how social processes affect knowledge production, validation, and distribution. Foundational to understanding S.A.M.

### Epistemic Authority
The credibility attributed to a source based on position, expertise, or institutional role. Distinguished from epistemic justification, which is based on evidence.

### Epistemic Justification
The evidential warrant for believing a claim. Central question in S.A.M.: Is institutional certainty matched by epistemic justification?

### Truth Decay
The process by which institutional systems become divorced from evidential grounding. Claims gain acceptance through repetition rather than verification.

### Verification Amnesia
Pattern where later documents cite earlier documents without tracking whether the original claim was ever verified. Creates citation chains with no evidential foundation.

### Circular Citation
Mutual reference loops where Document A cites Document B, which cites Document C, which cites Document A. Creates appearance of multiple corroboration while all sources derive from same origin.

### Derivative Corroboration
When multiple sources all derive from the same root source, creating appearance of independent corroboration without actually providing it.

---

## Institutional Concepts

### Institutional Isomorphism
Tendency of organizations to adopt practices and claims from other organizations even without evidence of effectiveness. Creates propagation networks.

### Normalization of Deviance
Process (identified by Diane Vaughan) where incremental departures from standards become normalized within institutions. Relevant to understanding how false premises persist.

### Path Dependency
Situation where early decisions constrain future decisions, making course correction difficult. Relevant to understanding why false premises lock in trajectories.

### Accountability Gap
Discrepancy between institutional power to make claims and accountability for accuracy of those claims. Core problem S.A.M. addresses.

### Institutional Failure
Breakdown in institutional processes leading to harmful outcomes. S.A.M. is designed to analyze document chains in cases of institutional failure.

---

## Analysis Techniques

### Entity Extraction
Identifying and normalizing references to people, places, organizations, dates, and events across documents. Foundation for tracking claim propagation.

### Entity Resolution
Determining when two entity mentions refer to the same real-world entity despite differences in naming (e.g., "John Smith," "J. Smith," "Smith" all referring to same person).

### Citation Analysis
Systematic identification of explicit and implicit references between documents. Builds propagation network.

### Timeline Construction
Chronological ordering of events based on document evidence. Essential for detecting TEMPORAL contradictions.

### Claim Extraction
Identifying factual propositions asserted in documents. Distinguishes claims from background, procedures, and meta-text.

### Claim Normalization
Standardizing claim representations to enable comparison across documents. Resolves entity references, standardizes dates, preserves modal operators.

### Semantic Similarity Matching
Determining when a claim in Document B is semantically equivalent to a claim in Document A despite lexical differences. Uses embedding models and paraphrase detection.

### Propagation Graph
Network representation of how claims propagate through document set. Nodes are documents, edges are propagation events.

### Citation Network
Graph of explicit and implicit citations between documents. Subset of propagation graph focusing on documented references.

---

## Validation Concepts

### Construct Validity
Does S.A.M. measure what it claims to measure? Validated by showing S.A.M. classifications correlate with independent expert assessments.

### Criterion Validity
Do S.A.M. findings predict external criteria? Includes predictive validity (predicting future institutional corrections) and concurrent validity (alignment with other failure indicators).

### Inter-Rater Reliability
Agreement between independent analysts applying S.A.M. to same document set. Measured using Cohen's kappa and percentage overlap metrics.

### Sensitivity
True positive rate: Of all actual instances of a pattern (e.g., authority laundering), what proportion does S.A.M. detect?

### Specificity
True negative rate: Of all non-instances, what proportion does S.A.M. correctly exclude?

### Ground Truth
Established correct answers against which S.A.M. outputs are validated. Created through expert consensus, known cases, or adversarial testing.

### Cohen's Kappa
Statistical measure of inter-rater agreement correcting for chance agreement. κ > 0.7 indicates substantial agreement; κ > 0.6 moderate-to-substantial.

---

## Technical Concepts

### Document Corpus
Complete set of documents subject to S.A.M. analysis. Should include all relevant institutional documents in a case.

### Document Metadata
Information about documents beyond text content: creation date, author, authoring institution, document type, page count, etc.

### Document Provenance
History of a document: origin, custody chain, revisions. Important for assessing reliability.

### OCR (Optical Character Recognition)
Technology for extracting text from image-based PDFs and scanned documents. Essential for processing non-machine-readable documents.

### PDF Extraction
Process of obtaining machine-readable text from PDF documents. May require OCR for image-based PDFs.

### Text Chunking
Dividing documents into semantic segments (paragraphs, sections) for analysis. Provides granularity for claim extraction and context windows for language models.

### Embedding
Dense vector representation of text that captures semantic meaning. Used for semantic similarity matching in claim propagation detection.

### Natural Language Processing (NLP)
Computational techniques for analyzing human language. S.A.M. uses NLP for claim extraction, entity recognition, sentiment analysis, and semantic matching.

### Named Entity Recognition (NER)
NLP task of identifying and classifying named entities (people, organizations, locations, dates) in text.

### Semantic Role Labeling (SRL)
NLP task of identifying predicate-argument structure in sentences. Useful for claim extraction.

### Large Language Model (LLM)
AI model trained on vast text corpora, capable of natural language understanding and generation. S.A.M. uses LLMs for claim analysis, contradiction detection, and report generation.

### Structured Output
Constraining LLM outputs to conform to specific schemas (e.g., JSON). Reduces hallucination risk and enables programmatic processing.

### Prompt Engineering
Designing prompts (instructions) for LLMs to elicit desired behavior. S.A.M. uses adversarial prompting to apply systematic skepticism.

### Hallucination
LLM generation of plausible-sounding but unsupported or false content. Major risk in AI-assisted analysis; mitigated through structured outputs and source grounding.

---

## Platform Concepts (Phronesis-Specific)

### Phronesis
The Phronesis platform: desktop application implementing S.A.M. methodology. Name from Greek term for practical wisdom and good judgment.

### Analysis Engine
Specialized component of Phronesis focusing on specific analytical task. Phronesis includes 11 engines: entity, temporal, argumentation, bias, contradiction, accountability, professional, omission, expert, documentary, narrative.

### Tauri
Desktop application framework combining Rust backend with web frontend. Provides security and performance for Phronesis.

### Local-First
Architectural principle where data is stored and processed locally on user's device rather than cloud servers. Critical for confidentiality in forensic work.

### Audit Trail
Complete record of analysis process including all claims, evidence, propagations, authority markers, and outcomes detected. Enables replication and review.

### Export Compliance
Phronesis reports designed to meet standards for court admissibility, expert witness testimony, and professional review. Includes complete citation chains.

### MCP Server
Model Context Protocol server enabling Phronesis integration with Claude AI assistant for enhanced workflows.

### Obsidian Plugin
Plugin integrating Phronesis with Obsidian knowledge management software, enabling bidirectional sync with research vaults.

---

## Legal and Professional Terms

### Expert Witness
Professional offering specialized knowledge in legal proceedings. S.A.M. analysis may be presented by expert witnesses; must meet Daubert or Frye standards.

### Daubert Standard
U.S. federal standard for expert testimony admissibility, requiring scientific validity and reliability. S.A.M. designed to meet Daubert criteria.

### Frye Standard
Alternative admissibility standard (some U.S. states) requiring general acceptance in relevant scientific community.

### Discovery
Legal process where parties exchange relevant documents and evidence. S.A.M. analysis often conducted on documents obtained through discovery.

### Work Product
Materials prepared in anticipation of litigation, may be privileged. S.A.M. analyses conducted by attorneys may be work product.

### Chain of Custody
Documentation of evidence handling. Important for maintaining integrity of document corpus used in S.A.M. analysis.

### Redaction
Removal of confidential, private, or privileged information from documents. Required when publishing S.A.M. analyses or case studies.

### GDPR (General Data Protection Regulation)
European Union data protection law. Phronesis designed for GDPR compliance (local storage, user control, data minimization).

### HIPAA (Health Insurance Portability and Accountability Act)
U.S. law protecting medical information. Relevant when S.A.M. analyzes medical records.

---

## Research Methods Terms

### Qualitative Analysis
Research approach focusing on non-numeric data (text, images). S.A.M. includes extensive qualitative analysis of document content.

### Quantitative Analysis
Research approach using numeric data and statistical methods. S.A.M. includes quantitative elements (authority scores, evidential quality metrics).

### Mixed Methods
Research combining qualitative and quantitative approaches. S.A.M. is fundamentally mixed-methods.

### Grounded Theory
Qualitative methodology for developing theory from data through iterative coding. Relevant to identifying patterns in document analysis.

### Case Study
In-depth analysis of specific instance. S.A.M. analyses are often structured as case studies.

### Triangulation
Using multiple methods, sources, or perspectives to validate findings. S.A.M. triangulates through multiple engines and contradiction types.

### Saturation
Point in qualitative analysis where additional data yields no new insights. Relevant to determining adequate document corpus.

---

## Logical and Argumentative Terms

### Proposition
A statement that can be true or false. Core unit of analysis in S.A.M.

### Inference
Reasoning from premises to conclusion. S.A.M. examines whether inferences in documents are warranted.

### Deduction
Inference where conclusion necessarily follows from premises. Rare in institutional documents.

### Induction
Inference from specific cases to general principles. Common in institutional documents; risk of overgeneralization.

### Abduction
Inference to best explanation. Common reasoning pattern; risk of premature closure on explanation.

### Fallacy
Error in reasoning. S.A.M. identifies common fallacies in institutional documents.

### Warrant
The justification connecting evidence to claim (Toulmin model). S.A.M. examines whether warrants are adequate.

### Qualifier
Statement of confidence or certainty (Toulmin model). Modal operators like "possibly," "probably," "certainly."

### Rebuttal
Circumstances under which claim would not hold (Toulmin model). Often omitted in institutional documents.

---

## Domain-Specific Terms

### Wrongful Conviction
Conviction of person not guilty of charged crime. Major application area for S.A.M.

### Exoneration
Official reversal of wrongful conviction. S.A.M. analyses can support exoneration efforts.

### Brady Material
Exculpatory evidence prosecution must disclose to defense (Brady v. Maryland). S.A.M. can identify omitted Brady material.

### Tunnel Vision
Cognitive bias in investigations where early hypothesis resists contradicting evidence. S.A.M. designed to identify tunnel vision patterns.

### Child Protection
Institutional system for child welfare and safety. Application area for S.A.M. given high stakes and extensive documentation.

### Mandated Reporter
Professional required by law to report suspected child abuse. Reports often serve as origin points for false premises.

### Medical Malpractice
Professional negligence by healthcare provider. S.A.M. applicable to analyzing medical record chains.

### Diagnostic Cascade
Process where initial misdiagnosis propagates through medical records, affecting subsequent treatment. Medical parallel to false premise propagation.

---

Last updated: 2025-01-16

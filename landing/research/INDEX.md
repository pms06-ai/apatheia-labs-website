# Research Hub Index

Searchable catalog of all research in the Apatheia Labs Research Hub. Use Ctrl+F / Cmd+F to search by keyword, tag, or topic.

## Quick Search by Tag

**#investigation** | **#evidence** | **#bias** | **#cognitive-science** | **#legal** | **#temporal-analysis** | **#quality-control** | **#contradiction** | **#institutional-failure** | **#methodology**

---

## Methodologies (Professional Investigation Frameworks)

### Police Investigation Workflows

**File:** [methodologies/01-police-investigations.md](./methodologies/01-police-investigations.md)
**Quick Start:** [methodologies/quickstart/01-police-quickstart.md](./methodologies/quickstart/01-police-quickstart.md) (5-min read)
**Status:** ✅ Complete (January 2026)
**Tags:** #investigation #evidence #police #interview #chain-of-custody #temporal-analysis #quality-control

**Summary:** UK College of Policing Core Investigative Doctrine, PEACE interview model (46% recall increase), PIP 4-level structure, HOLMES2 case management, FBI 5-step chain of custody, CPIA disclosure obligations, MG forms prosecution files.

**Key Findings:**

- Investigation is fundamentally human—systems support thinking, not replace it
- PEACE model: Planning → Engage → Account → Closure → Evaluation
- Cognitive Interview technique: 46% recall increase, 90% accuracy maintained
- 5WH framework (What, Who, When, Where, Why, How) structures investigations
- HOLMES2 Dynamic Reasoning Engine for pattern detection

**Platform Integration:** `investigate.rs` orchestration, evidence chain tracking, timeline construction

---

### Investigative Journalism Methods

**File:** [methodologies/02-journalism-investigations.md](./methodologies/02-journalism-investigations.md)
**Quick Start:** [methodologies/quickstart/02-journalism-quickstart.md](./methodologies/quickstart/02-journalism-quickstart.md) (5-min read)
**Status:** ✅ Complete (January 2026)
**Tags:** #investigation #journalism #verification #documents #collaboration #evidence-hierarchy #hypothesis-testing

**Summary:** ICIJ "radical sharing" workflows, Panama Papers 7-stage document pipeline (11.5M docs, 2.6TB), Datashare/Aleph platforms, three-step verification, four attribution levels, magazine model fact-checking.

**Key Findings:**

- Documentary evidence systematically prioritized over testimonial
- Evidence hierarchy: Official docs (authentic) > primary sources > multiple testimonies
- Hypothesis-based framework: facts + assumptions, testable/falsifiable
- Apache Tika/Solr → Neo4j graph database workflow
- OCCRP Aleph: 4B+ documents, 180+ countries, cross-reference capability

**Platform Integration:** Document pipeline, entity extraction, network analysis, verification protocols

---

### Legal eDiscovery Workflows

**File:** [methodologies/03-legal-ediscovery.md](./methodologies/03-legal-ediscovery.md)
**Quick Start:** [methodologies/quickstart/03-legal-quickstart.md](./methodologies/quickstart/03-legal-quickstart.md) (5-min read)
**Status:** ✅ Complete (January 2026)
**Tags:** #legal #ediscovery #timeline #evidence #machine-learning #quality-control #privilege

**Summary:** EDRM 9-stage framework, TAR 2.0/CAL (40-60% review reduction), 8-step timeline construction, SHA-256 hash certification, 5-phase privilege review (AI-powered: 60-80% time reduction).

**Key Findings:**

- Evolution from manual to AI demonstrates defensible systematic methodologies
- Continuous Active Learning: no seed set, real-time prioritization
- Timeline construction with evidence linking (Bates numbers to every event)
- Balance of probabilities standard, proportionality analysis
- FRE 502(b): Inadvertent disclosure protection with reasonable steps

**Platform Integration:** Timeline engine, evidence linking, hash integrity, privilege detection

---

### Regulatory Investigations (Professional Standards)

**File:** [methodologies/04-regulatory-investigations.md](./methodologies/04-regulatory-investigations.md)
**Quick Start:** [methodologies/quickstart/04-regulatory-quickstart.md](./methodologies/quickstart/04-regulatory-quickstart.md) (5-min read)
**Status:** ✅ Complete (January 2026)
**Tags:** #regulatory #professional-standards #standards-mapping #root-cause #institutional-failure #quality-control

**Summary:** GMC/HCPC/NMC/BPS investigation protocols, multi-stage gates (Triage → Investigation → Assessment → Decision → Monitoring), balance of probabilities, NPSA Root Cause Analysis (9 contributory factors), current impairment focus.

**Key Findings:**

- Three-stage analysis: Facts proven? → Standards breached? → Current impairment?
- Real prospect/realistic prospect test (genuine possibility of proof at hearing)
- Distinguish systemic failures from individual failings via contributory factors
- Dual decision-makers (professional + lay member) ensure perspective balance
- Public protection priority over individual sanctions

**Platform Integration:** `professional.rs` engine (HCPC/GMC/NMC/BPS/SWE), standards mapping, RCA framework

---

### Intelligence Analysis Methods

**File:** [methodologies/05-intelligence-analysis.md](./methodologies/05-intelligence-analysis.md)
**Quick Start:** [methodologies/quickstart/05-intelligence-quickstart.md](./methodologies/quickstart/05-intelligence-quickstart.md) (5-min read)
**Status:** ✅ Complete (January 2026)
**Tags:** #intelligence #bias #hypothesis-testing #fusion #source-reliability #quality-control #cognitive-science

**Summary:** 66 Structured Analytic Techniques (Heuer & Pherson), Analysis of Competing Hypotheses (ACH 7-step), Admiralty Code (Source A-F, Information 1-6), Words of Estimative Probability (Sherman Kent), multi-source fusion algorithms.

**Key Findings:**

- "Biases cannot be eliminated by training—only mitigated through structure and tools"
- ACH: Seek to disprove hypotheses, not confirm. Most likely = least inconsistent
- Minimum 3 independent reviewers required for reliable quality control
- Bayesian/Dempster-Shafer fusion for multi-source intelligence
- ICD 203: Nine analytic tradecraft standards mandated across US IC

**Platform Integration:** Bias detection, ACH matrix implementation, source reliability rating, confidence levels

---

### Academic Research Methods

**File:** [methodologies/06-academic-research.md](./methodologies/06-academic-research.md)
**Quick Start:** [methodologies/quickstart/06-academic-quickstart.md](./methodologies/quickstart/06-academic-quickstart.md) (5-min read)
**Status:** ✅ Complete (January 2026)
**Tags:** #academic #systematic-review #qualitative #quality-control #reliability #transparency #audit-trail

**Summary:** PRISMA 2020 (27-item checklist), Cochrane Handbook v6.5, grounded theory, Braun & Clarke thematic analysis, Mayring QCA, NVivo/Atlas.ti/MAXQDA workflows, Cohen's Kappa (≥0.60 acceptable), Lincoln & Guba trustworthiness framework.

**Key Findings:**

- Systematic reviews: comprehensive search, dual independent screening, risk of bias assessment
- Cohen's Kappa ≥0.60 acceptable, ≥0.70 preferred for IRR
- Grounded theory: constant comparative method, theoretical saturation
- Lincoln & Guba: credibility, transferability, dependability, confirmability
- Audit trail and reflexivity enable transparency and reproducibility

**Platform Integration:** Quality control protocols, inter-rater reliability, audit trail documentation

---

## Cross-Methodology Comparisons

### Methodology Comparison Matrix

**File:** [METHODOLOGY-COMPARISON.md](./METHODOLOGY-COMPARISON.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #methodology #comparison #evidence #timeline #bias #quality-control #legal #integration

**Summary:** Comprehensive 13-section comparison of all six professional investigation methodologies. Decision tree for methodology selection, cost-benefit analysis by scale, integration recommendations for Phronesis FCIP. Includes evidence standards, timeline construction, quality control, bias mitigation, scale capabilities, and legal defensibility matrices.

**Key Findings:**

- Legal eDiscovery has most mature digital authentication standards (hash certification, metadata preservation)
- 10,000 documents is inflection point where AI-assisted review (TAR 2.0) becomes cost-effective
- Intelligence's minimum 3 independent reviewers is research-backed quality standard
- No single methodology handles all requirements—hybrid approach essential

**Platform Integration:** Informs all engine design, feature prioritization, workflow architecture

---

### Quality Control Comparison

**File:** [QUALITY-CONTROL-COMPARISON.md](./QUALITY-CONTROL-COMPARISON.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #quality-control #comparison #reliability #peer-review #statistical-validation

**Summary:** Visual comparison table comparing quality control approaches across all six methodologies. Review structures, minimum reviewers, statistical validation, inter-rater reliability standards.

**Key Findings:**

- Academic: Cohen's Kappa ≥0.70 is gold standard for qualitative IRR
- Legal: ≥95% agreement for privilege coding, TAR statistical validation
- Intelligence: Minimum 3 independent reviewers, Red Cell institutional protection
- All methodologies converge on peer review necessity; quantitative thresholds vary

**Platform Integration:** `qc.rs` module design, reviewer requirements, statistical validation features

---

## Cognitive Science & Neuroscience

### [Placeholder] Cognitive Biases in Analysis

**File:** cognitive-science/cognitive-biases.md
**Status:** 🔴 Planned
**Tags:** #bias #cognitive-science #decision-making #quality-control

**Planned Topics:** Confirmation bias, anchoring, availability heuristic, groupthink, motivated reasoning, defensive processing

---

### [Placeholder] Memory Reliability and Eyewitness Testimony

**File:** cognitive-science/memory-reliability.md
**Status:** 🔴 Planned
**Tags:** #cognitive-science #evidence #memory #neuroscience

**Planned Topics:** Reconstructive memory, false memories, flashbulb memories, source monitoring errors

---

## Philosophy

### [Placeholder] Epistemology and Knowledge Justification

**File:** philosophy/epistemology.md
**Status:** 🔴 Planned
**Tags:** #philosophy #epistemology #knowledge #justification

**Planned Topics:** Foundationalism vs coherentism, skepticism, Gettier problems, reliabilism

---

### [Placeholder] Formal Logic and Argumentation Theory

**File:** philosophy/logic-argumentation.md
**Status:** 🔴 Planned
**Tags:** #philosophy #logic #argumentation #fallacies

**Planned Topics:** Deductive/inductive/abductive reasoning, formal fallacies, informal fallacies, argumentation schemes

---

### [Placeholder] Philosophy of Science

**File:** philosophy/philosophy-of-science.md
**Status:** 🔴 Planned
**Tags:** #philosophy #science #methodology #falsification

**Planned Topics:** Popper's falsificationism, Kuhn's paradigm shifts, Lakatos research programs, demarcation problem

---

## Legal Studies

### [Placeholder] Evidence Law and Admissibility

**File:** legal/evidence-law.md
**Status:** 🔴 Planned
**Tags:** #legal #evidence #admissibility #hearsay

**Planned Topics:** FRE rules, hearsay exceptions, authentication requirements, expert witness standards, privilege

---

### [Placeholder] Administrative Law and Agency Action

**File:** legal/administrative-law.md
**Status:** 🔴 Planned
**Tags:** #legal #administrative-law #regulation #due-process

**Planned Topics:** Judicial review standards, procedural fairness, rule-making, adjudication, Chevron deference

---

## Political Science

### [Placeholder] Institutional Failure and Regulatory Capture

**File:** political-science/institutional-failure.md
**Status:** 🔴 Planned
**Tags:** #political-science #institutional-failure #capture #accountability

**Planned Topics:** Capture theory, principal-agent problems, regulatory failure modes, concentrated benefits/diffuse costs

---

### [Placeholder] Accountability Mechanisms

**File:** political-science/accountability-mechanisms.md
**Status:** 🔴 Planned
**Tags:** #political-science #accountability #oversight #transparency

**Planned Topics:** Oversight bodies, transparency requirements, whistleblower protection, accountability sinks

---

## Communication & Rhetoric

### [Placeholder] Propaganda Techniques

**File:** communication/propaganda-techniques.md
**Status:** 🔴 Planned
**Tags:** #communication #propaganda #rhetoric #manipulation

**Planned Topics:** Bandwagon, loaded language, ad hominem, false dilemma, fear appeals

---

### [Placeholder] Framing Effects

**File:** communication/framing-effects.md
**Status:** 🔴 Planned
**Tags:** #communication #framing #bias #cognitive-science

**Planned Topics:** Gain/loss framing, metaphorical framing, equivalency framing, emphasis framing

---

## Data Science & Statistics

### [Placeholder] Causal Inference Methods

**File:** data-science/causal-inference.md
**Status:** 🔴 Planned
**Tags:** #data-science #causation #statistics #methodology

**Planned Topics:** DAGs, confounding, instrumental variables, difference-in-differences, RCTs

---

### [Placeholder] Statistical Fallacies

**File:** data-science/statistical-fallacies.md
**Status:** 🔴 Planned
**Tags:** #data-science #statistics #fallacies #bias

**Planned Topics:** P-hacking, base rate neglect, Simpson's paradox, regression to mean, file drawer effect

---

## Sociology

### [Placeholder] Organizational Pathologies

**File:** sociology/organizational-pathologies.md
**Status:** 🔴 Planned
**Tags:** #sociology #organizations #groupthink #institutional-failure

**Planned Topics:** Groupthink, diffusion of responsibility, normalization of deviance, bureaucratic inertia

---

### [Placeholder] Power Structures and Authority

**File:** sociology/power-structures.md
**Status:** 🔴 Planned
**Tags:** #sociology #power #authority #institutions

**Planned Topics:** Weber's authority types, social capital, hierarchies, institutional isomorphism

---

## Ethics & Professional Conduct

### [Placeholder] Medical Ethics and Four Principles

**File:** ethics/medical-ethics.md
**Status:** 🔴 Planned
**Tags:** #ethics #medical #professional-standards #conduct

**Planned Topics:** Beneficence, non-maleficence, autonomy, justice

---

### [Placeholder] Research Ethics

**File:** ethics/research-ethics.md
**Status:** 🔴 Planned
**Tags:** #ethics #research #methodology #integrity

**Planned Topics:** Informed consent, privacy, dual use, conflicts of interest, research misconduct

---

## History (Case Studies)

### [Placeholder] Institutional Failure Case Studies

**File:** history/institutional-failures.md
**Status:** 🔴 Planned
**Tags:** #history #case-study #institutional-failure #accountability

**Planned Topics:** Challenger disaster, 2008 financial crisis, COVID response failures, Boeing 737 MAX

---

### [Placeholder] Cover-up and Accountability

**File:** history/coverups-accountability.md
**Status:** 🔴 Planned
**Tags:** #history #case-study #accountability #investigation

**Planned Topics:** Watergate, Hillsborough, Post Office Horizon scandal, Infected Blood Inquiry

---

## Interdisciplinary Syntheses

### Contradiction Detection Across Domains

**File:** [interdisciplinary/01-contradiction-detection-synthesis.md](./interdisciplinary/01-contradiction-detection-synthesis.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #interdisciplinary #contradiction #methodology #integration #sam #evidence

**Summary:** Comprehensive synthesis of contradiction detection methods across all six investigative domains. Maps S.A.M. 8 contradiction types (SELF, INTER_DOC, TEMPORAL, EVIDENTIARY, MODALITY_SHIFT, SELECTIVE_CITATION, SCOPE_SHIFT, UNEXPLAINED_CHANGE) to domain-specific detection approaches, tools, and standards.

**Key Findings:**

- All domains converge on systematic comparison, evidence hierarchies, temporal analysis, and multiple reviewers
- Detection methods vary by adversarial pressure, evidentiary standards, time constraints, and resource availability
- Evidence hierarchies universal: authenticated primary documents prioritized over testimonial evidence
- Intelligence treats contradictions as diagnostic (hypothesis elimination); Police/Legal as investigative leads; Academic as analytical richness

**Platform Integration:** Directly informs S.A.M. contradiction engine implementation across all 8 types

---

## Search Index

### By Concept

**Bias & Cognitive Errors:**

- Intelligence Analysis (66 SATs, bias mitigation)
- [Planned] Cognitive Biases in Analysis
- [Planned] Framing Effects
- [Planned] Statistical Fallacies

**Evidence Management:**

- Police Investigation (chain of custody)
- Journalism (documentary > testimonial)
- Legal eDiscovery (hash certification)
- Intelligence (Admiralty Code source reliability)

**Timeline & Temporal Analysis:**

- Police (chronologies, 5WH)
- Legal (8-step timeline construction)
- Intelligence (chronologies as diagnostic technique)

**Quality Control:**

- Academic Research (Cohen's Kappa, IRR)
- Intelligence (minimum 3 reviewers)
- Regulatory (dual decision-makers)
- Legal (TAR validation, statistical sampling)

**Institutional Failure:**

- Regulatory (RCA contributory factors)
- [Planned] Political Science institutional failure
- [Planned] Sociology organizational pathologies
- [Planned] History case studies

### By Platform Component

**investigate.rs:**

- All 6 methodology studies inform orchestration

**professional.rs:**

- Regulatory Investigations (standards mapping)
- [Planned] Ethics & Professional Conduct

**S.A.M. Framework:**

- All investigation methodologies
- [Planned] Logic & Argumentation
- Contradiction Detection synthesis (01-contradiction-detection-synthesis.md)

**Analysis Engines:**

- Entity: Journalism network analysis, Legal entity extraction
- Temporal: Police/Legal timelines, Intelligence chronologies
- Contradiction: All domains, Logic
- Omission: Police reasonable lines, Legal disclosure
- Bias: Intelligence SATs, Cognitive Science
- Professional: Regulatory standards, Ethics
- Accountability: Political Science, Sociology
- Expert: Legal expert witness, Regulatory peer review
- Narrative: Communication, Sociology

---

**Last Updated:** January 2026
**Total Research Documents:** 15 complete (6 methodologies + 6 quick starts + 2 comparison matrices + 1 interdisciplinary synthesis), 20+ planned
**Research Domains:** 10+ (Methodologies, Cognitive Science, Philosophy, Legal, Political Science, Communication, Data Science, Sociology, Ethics, History, Interdisciplinary)

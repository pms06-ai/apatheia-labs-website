---
title: Research Hub Index
description: Searchable catalog of all research in the Apatheia Labs Research Hub, including methodologies, comparisons, and domain studies.
category: Overview
status: active
date: 2026-01-18
---

# Research Hub Index

Searchable catalog of all research in the Apatheia Labs Research Hub. Use Ctrl+F / Cmd+F to search by keyword, tag, or topic.

## Quick Search by Tag

**#investigation** | **#evidence** | **#bias** | **#cognitive-science** | **#legal** | **#temporal-analysis** | **#quality-control** | **#contradiction** | **#institutional-failure** | **#methodology**

---

## Methodologies (Professional Investigation Frameworks)

### Police Investigation Workflows

**File:** [../methodologies/01-police-investigations.md](../methodologies/01-police-investigations.md)
**Quick Start:** [../methodologies/quickstart/01-police-quickstart.md](../methodologies/quickstart/01-police-quickstart.md) (5-min read)
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

**File:** [../methodologies/02-journalism-investigations.md](../methodologies/02-journalism-investigations.md)
**Quick Start:** [../methodologies/quickstart/02-journalism-quickstart.md](../methodologies/quickstart/02-journalism-quickstart.md) (5-min read)
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

**File:** [../methodologies/03-legal-ediscovery.md](../methodologies/03-legal-ediscovery.md)
**Quick Start:** [../methodologies/quickstart/03-legal-quickstart.md](../methodologies/quickstart/03-legal-quickstart.md) (5-min read)
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

**File:** [../methodologies/04-regulatory-investigations.md](../methodologies/04-regulatory-investigations.md)
**Quick Start:** [../methodologies/quickstart/04-regulatory-quickstart.md](../methodologies/quickstart/04-regulatory-quickstart.md) (5-min read)
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

**File:** [../methodologies/05-intelligence-analysis.md](../methodologies/05-intelligence-analysis.md)
**Quick Start:** [../methodologies/quickstart/05-intelligence-quickstart.md](../methodologies/quickstart/05-intelligence-quickstart.md) (5-min read)
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

**File:** [../methodologies/06-academic-research.md](../methodologies/06-academic-research.md)
**Quick Start:** [../methodologies/quickstart/06-academic-quickstart.md](../methodologies/quickstart/06-academic-quickstart.md) (5-min read)
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

**File:** [METHODOLOGY-COMPARISON.md](../METHODOLOGY-COMPARISON.md)
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

**File:** [QUALITY-CONTROL-COMPARISON.md](../QUALITY-CONTROL-COMPARISON.md)
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

### Cognitive Biases in Analysis

**File:** [../cognitive-science/01-cognitive-biases.md](../cognitive-science/01-cognitive-biases.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #bias #cognitive-science #decision-making #quality-control

**Summary:** Comprehensive analysis of cognitive biases affecting professional judgment—confirmation bias, anchoring, availability heuristic, groupthink, motivated reasoning, and defensive processing.

**Platform Integration:** Bias detection engine, quality control protocols

---

### Decision Fatigue and Cognitive Load

**File:** [../cognitive-science/02-cognitive-load.md](../cognitive-science/02-cognitive-load.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #cognitive-load #decision-fatigue #working-memory #mental-resources

**Summary:** Working memory limits, Cognitive Load Theory (Sweller), ego depletion research, decision fatigue in professional contexts, and strategies for managing cognitive load in high-stakes decision-making.

**Platform Integration:** Workflow design, decision support features

---

### Memory Reliability and Eyewitness Testimony

**File:** [../neuroscience/01-memory-reliability.md](../neuroscience/01-memory-reliability.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #neuroscience #memory #evidence #reliability

**Summary:** Reconstructive memory, false memory formation, flashbulb memory limitations, source monitoring errors, and implications for eyewitness evidence evaluation.

**Platform Integration:** Evidence reliability assessment, witness testimony analysis

---

### Attention and Perception

**File:** [../neuroscience/02-attention-perception.md](../neuroscience/02-attention-perception.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #attention #perception #inattentional-blindness #change-blindness

**Summary:** Selective attention mechanisms, inattentional blindness (invisible gorilla paradigm), change blindness, and implications for observational failures in professional and institutional contexts.

**Platform Integration:** Quality control protocols, observation reliability assessment

---

## Philosophy

### Epistemology of Evidence

**File:** [../philosophy/01-epistemology-of-evidence.md](../philosophy/01-epistemology-of-evidence.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #philosophy #epistemology #knowledge #justification #evidence

**Summary:** Justified true belief, Gettier problems, testimonial knowledge, source reliability assessment, and adversarial epistemology for forensic document analysis.

**Platform Integration:** Evidence evaluation framework, justification chain tracking

---

### Formal Logic and Argumentation Theory

**File:** [../philosophy/02-formal-logic.md](../philosophy/02-formal-logic.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #logic #argumentation #fallacies #toulmin

**Summary:** Deductive, inductive, and abductive reasoning; formal and informal fallacies; Toulmin model of argumentation; Walton's argumentation schemes; application to institutional document analysis.

**Platform Integration:** Argumentation engine, fallacy detection, claim-evidence mapping

---

### Philosophy of Science

**File:** [../philosophy/03-philosophy-of-science.md](../philosophy/03-philosophy-of-science.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #philosophy-of-science #falsification #paradigms #methodology

**Summary:** Popper's falsificationism, Kuhn's paradigm shifts, Lakatos' research programmes, demarcation problem, theory-laden observation, and implications for evaluating scientific expert evidence.

**Platform Integration:** Expert evidence evaluation, methodology assessment

---

## Legal Studies

### Evidence Standards and Proof

**File:** [../legal/01-evidence-standards.md](../legal/01-evidence-standards.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #legal #evidence #admissibility #hearsay #standards

**Summary:** UK evidence law, admissibility requirements, hearsay rules and exceptions, authentication standards, expert witness requirements, and legal privilege frameworks.

**Platform Integration:** Evidence classification, admissibility assessment

---

### Administrative Law and Agency Action

**File:** [../legal/02-administrative-law.md](../legal/02-administrative-law.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #administrative-law #judicial-review #procedural-fairness #public-law

**Summary:** UK judicial review principles (illegality, irrationality, procedural impropriety), natural justice requirements, GCHQ and legitimate expectations, proportionality, and discretionary power limits.

**Platform Integration:** Accountability audit engine, decision review analysis

---

## Political Science

### Institutional Accountability and Regulatory Capture

**File:** [../political-science/01-institutional-accountability.md](../political-science/01-institutional-accountability.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #political-science #institutional-failure #capture #accountability

**Summary:** Regulatory capture theory, principal-agent problems, failure modes, concentrated benefits and diffuse costs, and institutional design for accountability.

**Platform Integration:** Institutional failure pattern detection

---

### Accountability Mechanisms

**File:** [../political-science/02-accountability-mechanisms.md](../political-science/02-accountability-mechanisms.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #accountability #oversight #transparency #whistleblower

**Summary:** Bovens' forum accountability, horizontal and vertical accountability, UK oversight bodies (NAO, IOPC, ombudsmen), FOI regimes, PIDA whistleblower protection, and public inquiries as accountability mechanisms.

**Platform Integration:** Accountability audit engine, oversight mapping

---

## Communication & Rhetoric

### Framing Analysis

**File:** [../communication/01-framing-analysis.md](../communication/01-framing-analysis.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #communication #framing #bias #cognitive-science

**Summary:** Gain/loss framing, metaphorical framing, equivalency framing, emphasis framing, and detection methods for framing bias in institutional documents and media.

**Platform Integration:** Bias detection engine, documentary analysis

---

### Propaganda Techniques

**File:** [../communication/02-propaganda-techniques.md](../communication/02-propaganda-techniques.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #propaganda #manipulation #rhetoric #media-analysis

**Summary:** IPA's seven propaganda devices, emotional appeals, loaded language, cherry-picking, false balance, illusory truth effect, and detection methods for propaganda in institutional and media contexts.

**Platform Integration:** Bias detection engine, documentary analysis, Ofcom compliance

---

## Data Science & Statistics

### Statistical Detection Methods

**File:** [../data-science/01-statistical-detection.md](../data-science/01-statistical-detection.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #data-science #statistics #methodology #detection

**Summary:** Statistical validation techniques, clustering methods, anomaly detection, and data quality practices for evidence review and pattern identification.

**Platform Integration:** Statistical analysis engine, pattern detection

---

### Causal Inference Methods

**File:** [../data-science/02-causal-inference.md](../data-science/02-causal-inference.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #causation #statistics #methodology #dag

**Summary:** Correlation vs causation, directed acyclic graphs (Pearl), confounding control strategies, RCTs, observational methods (DiD, IV, RDD), counterfactual reasoning, and causal inference errors in institutional decision-making.

**Platform Integration:** Causal analysis, accountability chain mapping

---

### Statistical Fallacies

**File:** [../data-science/03-statistical-fallacies.md](../data-science/03-statistical-fallacies.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #statistics #fallacies #bias #methodology

**Summary:** Base rate neglect, prosecutor's fallacy, p-hacking, Simpson's paradox, regression to mean, survivorship bias, publication bias, and detection methods for statistical errors in institutional reports.

**Platform Integration:** Evidence evaluation, claim verification

---

## Sociology

### Institutional Behaviour

**File:** [../sociology/01-institutional-behavior.md](../sociology/01-institutional-behavior.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #sociology #organizations #groupthink #institutional-failure

**Summary:** Groupthink, diffusion of responsibility, normalization of deviance, bureaucratic inertia, and organizational pathologies affecting institutional decision-making.

**Platform Integration:** Institutional failure pattern detection

---

### Power Structures and Authority

**File:** [../sociology/02-power-structures.md](../sociology/02-power-structures.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #power #authority #institutions #hierarchy

**Summary:** Weber's three authority types, power vs authority distinction, Foucault on disciplinary power, Bourdieu's social capital, institutional isomorphism, and street-level bureaucracy.

**Platform Integration:** Accountability audit engine, power mapping

---

## Ethics & Professional Conduct

### Professional Standards

**File:** [../ethics/01-professional-standards.md](../ethics/01-professional-standards.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #professional-ethics #HCPC #GMC #standards

**Summary:** Comparative analysis of HCPC, GMC, SRA, NMC ethics codes, duty of candor, fitness to practise thresholds, and professional conduct tracking methodology.

**Platform Integration:** Professional tracker engine, regulatory complaint generation

---

### Research Ethics

**File:** [../ethics/02-research-ethics.md](../ethics/02-research-ethics.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #research-ethics #informed-consent #integrity #misconduct

**Summary:** Nuremberg Code, Declaration of Helsinki, Belmont Report, informed consent, vulnerable populations, research misconduct (FFP), publication ethics, COPE guidelines, and UK Research Integrity Office standards.

**Platform Integration:** Evidence integrity assessment, methodology evaluation

---

### Medical Ethics and the Four Principles

**File:** [../ethics/03-medical-ethics.md](../ethics/03-medical-ethics.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #medical-ethics #bioethics #autonomy #beneficence

**Summary:** Beauchamp & Childress four principles (autonomy, beneficence, non-maleficence, justice), Mental Capacity Act 2005, confidentiality limits, and application to expert medical evidence evaluation.

**Platform Integration:** Expert evidence evaluation, professional standards mapping

---

## History (Case Studies)

### Institutional Failure Case Studies

**File:** [../history/01-institutional-failures.md](../history/01-institutional-failures.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #history #case-study #institutional-failure #accountability

**Summary:** Analysis of major institutional failures—Challenger disaster, 2008 financial crisis, COVID response failures—identifying common patterns and systemic causes.

**Platform Integration:** Pattern recognition, failure mode analysis

---

### Cover-ups and Accountability

**File:** [../history/02-cover-ups.md](../history/02-cover-ups.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #cover-up #accountability #case-study #institutional-failure

**Summary:** Analysis of major cover-ups (Watergate, Hillsborough, Post Office Horizon, Infected Blood, Boeing 737 MAX), common cover-up mechanisms, role of whistleblowers, and what eventually breaks institutional concealment.

**Platform Integration:** S.A.M. methodology, cover-up pattern detection

---

## Interdisciplinary Syntheses

### Contradiction Detection Across Domains

**File:** [../interdisciplinary/01-contradiction-detection-synthesis.md](../interdisciplinary/01-contradiction-detection-synthesis.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #interdisciplinary #contradiction #methodology #integration #sam #evidence

**Summary:** Comprehensive synthesis of contradiction detection methods across all six investigative domains. Maps S.A.M. 8 contradiction types to domain-specific detection approaches, tools, and standards.

**Key Findings:**

- All domains converge on systematic comparison, evidence hierarchies, temporal analysis, and multiple reviewers
- Detection methods vary by adversarial pressure, evidentiary standards, time constraints, and resource availability
- Evidence hierarchies universal: authenticated primary documents prioritized over testimonial evidence
- Intelligence treats contradictions as diagnostic (hypothesis elimination); Police/Legal as investigative leads; Academic as analytical richness

**Platform Integration:** Directly informs S.A.M. contradiction engine implementation across all 8 types

---

### Narrative Evolution Across Domains

**File:** [../interdisciplinary/02-narrative-evolution.md](../interdisciplinary/02-narrative-evolution.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #narrative #evolution #institutional-transmission #claim-mutation

**Summary:** How claims mutate across institutional boundaries—summarization loss, emphasis shifts, qualifier erosion, authority accumulation through repetition, false corroboration via circular citation, and detection methods for narrative transformation.

**Platform Integration:** S.A.M. INHERIT and COMPOUND phases, mutation tracking

---

### Institutional Coordination Patterns

**File:** [../interdisciplinary/03-coordination-patterns.md](../interdisciplinary/03-coordination-patterns.md)
**Status:** ✅ Complete (January 2026)
**Tags:** #coordination #independence #institutional-failure #hidden-patterns

**Summary:** Independence as quality guarantee, formal vs informal coordination mechanisms, pre-disclosure information flow detection, shared language patterns, circular citation networks, and methods for detecting hidden inter-agency coordination.

**Platform Integration:** Coordination analyst, independence failure detection

---

## Search Index

### By Concept

**Bias & Cognitive Errors:**

- Intelligence Analysis (66 SATs, bias mitigation)
- Cognitive Biases in Analysis
- Decision Fatigue and Cognitive Load
- Framing Analysis
- Propaganda Techniques
- Statistical Fallacies

**Evidence Management:**

- Police Investigation (chain of custody)
- Journalism (documentary > testimonial)
- Legal eDiscovery (hash certification)
- Intelligence (Admiralty Code source reliability)
- Evidence Standards and Proof
- Epistemology of Evidence

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
- Institutional Accountability and Regulatory Capture
- Accountability Mechanisms
- Institutional Behaviour
- Power Structures and Authority
- Institutional Failure Case Studies
- Cover-ups and Accountability

**Argumentation & Logic:**

- Formal Logic and Argumentation Theory
- Philosophy of Science
- Contradiction Detection Across Domains

**Professional Standards:**

- Professional Standards (HCPC, GMC, SRA, NMC)
- Research Ethics
- Medical Ethics and Four Principles

### By Platform Component

**investigate.rs:**

- All 6 methodology studies inform orchestration

**professional.rs:**

- Regulatory Investigations (standards mapping)
- Professional Standards
- Medical Ethics

**S.A.M. Framework:**

- All investigation methodologies
- Formal Logic and Argumentation
- Contradiction Detection synthesis
- Narrative Evolution
- Coordination Patterns
- Cover-ups and Accountability

**Analysis Engines:**

- Entity: Journalism network analysis, Legal entity extraction
- Temporal: Police/Legal timelines, Intelligence chronologies
- Contradiction: All domains, Formal Logic
- Omission: Police reasonable lines, Legal disclosure
- Bias: Intelligence SATs, Cognitive Science, Propaganda Techniques
- Professional: Regulatory standards, Professional Standards, Medical Ethics
- Accountability: Political Science, Sociology, Power Structures
- Expert: Legal expert witness, Philosophy of Science
- Narrative: Communication, Narrative Evolution

---

**Last Updated:** January 2026
**Total Research Documents:** 46 complete (6 methodologies + 6 quick starts + 2 comparison matrices + 10 domain articles + 15 new domain articles + 3 interdisciplinary + 4 foundations)
**Research Domains:** 11 (Methodologies, Cognitive Science, Neuroscience, Philosophy, Legal, Political Science, Communication, Data Science, Sociology, Ethics, History, Interdisciplinary)

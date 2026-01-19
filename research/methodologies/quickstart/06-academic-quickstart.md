---
title: Academic Research Methods Quick Start Guide
description: 5-minute reference for PRISMA systematic review, thematic analysis, grounded theory, and inter-rater reliability protocols.
category: Quick Start
status: complete
date: 2026-01-16
tags:
  - quickstart
  - academic
  - PRISMA
---

# Academic Research Methods Quick Start Guide

**Purpose**: Rapid reference for systematic review, qualitative analysis, and evidence synthesis
**Time to read**: 5 minutes
**Full document**: [06-academic-research.md](../06-academic-research.md)

---

## 60-Second Overview

- **PRISMA 2020**: Reporting standard (27-item checklist, 7 sections) - NOT a methodology itself
- **Cochrane Handbook v6.5**: Methodological guidance for systematic reviews (gold standard)
- **Thematic Analysis**: 6-phase process (Braun & Clarke) for identifying patterns in qualitative data
- **Grounded Theory**: Theory emerges from data (not imposed), constant comparison method
- **Inter-rater Reliability**: Cohen's Kappa ≥0.60 minimum (0.80+ strong agreement)

---

## Key Framework: Systematic Review Process (Cochrane)

```
┌──────────────────────────────────────────────────────────────┐
│                SYSTEMATIC REVIEW WORKFLOW                    │
├──────────────────────────────────────────────────────────────┤
│  1. Formulate Research Question (PICO/PEO framework)         │
│                      ↓                                        │
│  2. Develop Protocol (pre-registration, prevent bias)        │
│                      ↓                                        │
│  3. Systematic Search (multiple databases, gray literature)  │
│                      ↓                                        │
│  4. Study Selection (title/abstract → full-text, dual review)│
│                      ↓                                        │
│  5. Data Extraction (standardized forms, dual extraction)    │
│                      ↓                                        │
│  6. Risk of Bias Assessment (RoB 2, ROBINS-I tools)         │
│                      ↓                                        │
│  7. Data Synthesis (meta-analysis or narrative)              │
│                      ↓                                        │
│  8. GRADE Assessment (certainty of evidence)                 │
│                      ↓                                        │
│  9. Report (PRISMA 2020 checklist, flow diagram)             │
└──────────────────────────────────────────────────────────────┘
```

**Critical**: Protocol pre-registration prevents outcome-driven methodology changes

---

## Essential Tools

| Tool                        | Purpose                              | Type       | Access              |
| --------------------------- | ------------------------------------ | ---------- | ------------------- |
| **Covidence**               | Systematic review management         | Commercial | Subscription        |
| **RevMan (Review Manager)** | Cochrane meta-analysis software      | Free       | Cochrane            |
| **NVivo**                   | Qualitative data analysis (QDAS)     | Commercial | QSR International   |
| **MAXQDA**                  | Mixed methods analysis               | Commercial | VERBI Software      |
| **ATLAS.ti**                | Qualitative coding                   | Commercial | ATLAS.ti Scientific |
| **Rayyan**                  | Screening acceleration (AI-assisted) | Free       | https://rayyan.ai   |

**QDAS Market Leaders**: NVivo, MAXQDA, ATLAS.ti (all support multiple qualitative methods)

---

## PICO/PEO Framework (Research Question)

**PICO** (Quantitative/Intervention Studies):

- **P**opulation: Who is being studied?
- **I**ntervention: What is being tested?
- **C**omparator: What is it compared to?
- **O**utcome: What are you measuring?

**Example**: In adults with depression (P), does cognitive behavioral therapy (I) compared to medication (C) reduce symptom severity (O)?

**PEO** (Qualitative/Observational Studies):

- **P**opulation: Who is being studied?
- **E**xposure: What phenomenon, experience, or context?
- **O**utcome: What are you exploring/understanding?

**Example**: Among healthcare professionals (P), what are the experiences of burnout (E) and its impact on patient care (O)?

**Why it matters**: Well-formulated question drives:

- Inclusion/exclusion criteria
- Search term selection
- Data extraction fields
- Synthesis approach

---

## PRISMA 2020 Checklist (27 Items, 7 Sections)

**Critical distinction**: PRISMA is REPORTING standard, not methodology

### Title (Item 1)

- [ ] Identify as systematic review (with or without meta-analysis)

### Abstract (Item 2)

- [ ] Structured summary (background, methods, results, conclusions)

### Introduction (Items 3-4)

- [ ] Rationale (why is review needed?)
- [ ] Objectives (explicit research question, PICO/PEO)

### Methods (Items 5-16)

- [ ] Eligibility criteria (clear, reproducible)
- [ ] Information sources (databases, dates, gray literature)
- [ ] Search strategy (full strategy for ≥1 database)
- [ ] Selection process (dual screening, conflict resolution)
- [ ] Data collection (extraction forms, pilot testing)
- [ ] Risk of bias assessment (tool used, dual assessment)
- [ ] Synthesis methods (meta-analysis approach or narrative)
- [ ] Certainty assessment (GRADE or similar)

### Results (Items 17-24)

- [ ] Study selection (PRISMA flow diagram)
- [ ] Study characteristics (summary table)
- [ ] Risk of bias (graphical or tabular summary)
- [ ] Synthesis results (forest plots, effect estimates)
- [ ] Certainty of evidence (GRADE summary table)

### Discussion (Items 25-26)

- [ ] Interpretation (limitations, implications)
- [ ] Other information (funding, conflicts of interest)

### Registration (Item 27)

- [ ] Protocol registration (PROSPERO, OSF, etc.)

**Compliance**: Use checklist during manuscript preparation, submit with journal submission

---

## Study Selection Workflow (Dual Review)

### Phase 1: Title/Abstract Screening

- [ ] Dual independent review (two reviewers, no communication)
- [ ] Liberal inclusion (when in doubt, include for full-text review)
- [ ] Conflict resolution (third reviewer or consensus discussion)
- [ ] Inter-rater reliability calculated (Cohen's Kappa)

**Target Kappa**: ≥0.60 (moderate agreement), aim for ≥0.80 (strong)

### Phase 2: Full-Text Review

- [ ] Dual independent review
- [ ] Explicit inclusion/exclusion criteria applied
- [ ] Reasons for exclusion documented (for each excluded study)
- [ ] Conflict resolution protocol

### Phase 3: PRISMA Flow Diagram

**Required elements**:

- Records identified (from databases, registers, other sources)
- Records removed before screening (duplicates, ineligible)
- Records screened (title/abstract)
- Records excluded (with reasons)
- Reports sought for retrieval
- Reports not retrieved
- Reports assessed for eligibility (full-text)
- Reports excluded (with reasons by category)
- Studies included in review

**Purpose**: Transparent audit trail from search → final included studies

---

## Risk of Bias Assessment

### RoB 2 Tool (Randomized Controlled Trials)

**Five domains**:

1. Randomization process (allocation concealment, baseline differences)
2. Deviations from intended interventions (blinding, protocol adherence)
3. Missing outcome data (attrition, exclusions)
4. Measurement of outcome (assessor blinding, validated instruments)
5. Selection of reported result (pre-specified outcomes, selective reporting)

**Judgments**: Low risk / Some concerns / High risk (for each domain + overall)

### ROBINS-I Tool (Non-Randomized Studies)

**Seven domains**:

1. Confounding
2. Selection of participants
3. Classification of interventions
4. Deviations from intended interventions
5. Missing data
6. Measurement of outcomes
7. Selection of reported result

**Judgments**: Low / Moderate / Serious / Critical risk (+ No information)

### Application Protocol

- [ ] Dual independent assessment
- [ ] Domain-specific judgments (not just overall)
- [ ] Support for judgments (quote from paper or specific data)
- [ ] Graphical summary (traffic light plot: green/yellow/red)
- [ ] Sensitivity analysis (exclude high-risk studies, compare results)

**GRADE integration**: Risk of bias is one factor in certainty assessment

---

## GRADE Assessment (Certainty of Evidence)

**Purpose**: Rate certainty of evidence body (not individual studies)

**Starting point**:

- Randomized trials: **High** certainty
- Observational studies: **Low** certainty

### Factors that DECREASE certainty (maximum -2 levels each)

- **Risk of bias**: Serious limitations in study design/conduct
- **Inconsistency**: Unexplained heterogeneity across studies
- **Indirectness**: Evidence from different population/intervention/outcome
- **Imprecision**: Wide confidence intervals, small sample sizes
- **Publication bias**: Selective reporting, funnel plot asymmetry

### Factors that INCREASE certainty (observational only, +1 or +2 levels)

- **Large effect**: RR >2 or <0.5 (when no plausible confounders)
- **Dose-response gradient**: Clear relationship
- **All plausible confounding would reduce effect**: Yet effect still observed

### Four Certainty Levels

- **High**: Very confident true effect close to estimate
- **Moderate**: Moderately confident; true effect likely close but possibly substantially different
- **Low**: Limited confidence; true effect may be substantially different
- **Very low**: Very little confidence; true effect likely substantially different

**Output**: GRADE Summary of Findings table (intervention, outcomes, certainty rating, effect estimates)

---

## Thematic Analysis (6 Phases)

**Source**: Braun & Clarke (2006) - Most widely used qualitative method

### Phase 1: Familiarize with Data

- [ ] Transcribe data (if audio/video)
- [ ] Read and re-read entire dataset
- [ ] Note initial ideas (memos, reflections)
- [ ] Immersion goal: Know data intimately

### Phase 2: Generate Initial Codes

- [ ] Systematic coding across entire dataset
- [ ] Code for as many patterns as possible
- [ ] Inclusive approach (code all relevant extracts)
- [ ] Keep coded extracts with context
- [ ] Collate all codes with relevant data

**Code types**: Semantic (explicit meaning) vs. Latent (underlying meaning)

### Phase 3: Search for Themes

- [ ] Sort codes into potential themes
- [ ] Collate relevant coded extracts for each theme
- [ ] Visual mapping (mind maps, tables)
- [ ] Some codes become themes, others subthemes, others discarded

**Theme definition**: Captures something important about the data in relation to research question

### Phase 4: Review Themes

- [ ] Level 1: Review coded extracts for each theme (internal homogeneity)
- [ ] Level 2: Review themes against entire dataset (external heterogeneity)
- [ ] Refine themes (split, combine, discard as needed)
- [ ] Generate thematic map (hierarchical structure)

**Quality check**: Does this theme tell coherent story? Does it fit data?

### Phase 5: Define and Name Themes

- [ ] Define "essence" of each theme (one or two sentences)
- [ ] Identify subthemes (if appropriate)
- [ ] Name themes (concise, punchy, informative)
- [ ] Write detailed analysis for each theme

**Good theme name**: "Balancing professional duty with personal wellbeing" NOT "Theme 1: Work-life balance"

### Phase 6: Produce Report

- [ ] Select compelling extract examples
- [ ] Relate analysis back to research question
- [ ] Relate to existing literature
- [ ] Argument: What story does this data tell?

**Report structure**: Introduction → Methods → Analysis (theme by theme) → Discussion

---

## Grounded Theory (Constant Comparison Method)

**Founders**: Glaser & Strauss (1967) - Theory emerges FROM data (not imposed)

**Key principle**: Iterative data collection + analysis (not linear)

### Three Coding Levels

#### Level 1: Open Coding

- Line-by-line analysis
- Generate initial concepts
- Ask: What is going on here? What is this data about?

**Example**:

- Data: "I felt overwhelmed by the workload and couldn't sleep."
- Open code: "Stress manifestation," "Work-life imbalance"

#### Level 2: Axial Coding

- Relate categories to subcategories
- Identify relationships (causal, contextual, intervening)
- Ask: How do these concepts relate?

**Example**:

- Category: "Burnout"
- Subcategories: "Workload pressure," "Lack of support," "Sleep disturbance"
- Relationship: "Workload pressure → Lack of support → Sleep disturbance → Burnout"

#### Level 3: Selective Coding

- Identify core category (central phenomenon)
- Integrate and refine theory
- Ask: What is the main story here?

**Output**: Theoretical model explaining phenomenon

### Constant Comparison

- Compare new data to previous data
- Compare codes to codes
- Compare categories to categories
- Refine and adjust as new patterns emerge

### Theoretical Sampling

- Sample driven by emerging theory (not predetermined)
- Collect data to fill gaps in theory
- Continue until theoretical saturation (no new insights)

### Theoretical Saturation

**Definition**: Point where new data no longer generates new insights

**Indicators**:

- No new codes emerging
- Categories well-defined and stable
- Relationships between categories clear
- Theory explains data comprehensively

**Typical sample size**: 10-30 participants (varies by complexity)

---

## Inter-Rater Reliability (Cohen's Kappa)

**Purpose**: Measure agreement between two coders (beyond chance agreement)

**Formula**: κ = (Po - Pe) / (1 - Pe)

- Po = Observed agreement proportion
- Pe = Expected agreement by chance

**Interpretation** (Landis & Koch 1977):

- <0.00: Poor
- 0.00-0.20: Slight
- 0.21-0.40: Fair
- 0.41-0.60: Moderate
- **0.61-0.80: Substantial** (minimum acceptable)
- **0.81-1.00: Almost perfect** (target for rigorous research)

### Calculation Example

- 100 abstracts screened by two reviewers
- Both included: 30
- Both excluded: 60
- Disagreement: 10
- Po = (30 + 60) / 100 = 0.90
- Pe = [(30+5)/100 × (30+5)/100] + [(60+5)/100 × (60+5)/100] = 0.55
- κ = (0.90 - 0.55) / (1 - 0.55) = 0.78 (Substantial)

**Threshold for proceeding**: κ ≥0.60 for pilot, ≥0.80 for main review

**Action if low Kappa**:

- Clarify inclusion/exclusion criteria
- Retrain reviewers
- Discuss discrepancies
- Pilot additional sample

---

## Common Pitfalls (Top 5)

| Mistake                          | Impact                             | Mitigation                                              |
| -------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| **No protocol pre-registration** | Outcome-driven methodology changes | PROSPERO registration before search                     |
| **Single reviewer screening**    | Bias, errors                       | Dual independent review, calculate Kappa                |
| **Inadequate search**            | Missed studies, publication bias   | Multiple databases, gray literature, no language limits |
| **Cherry-picking themes**        | Confirmation bias                  | Systematic coding, peer debriefing, reflexivity         |
| **No risk of bias assessment**   | Overconfidence in weak studies     | RoB 2/ROBINS-I, GRADE assessment                        |

### Specific Warning: PRISMA Misuse

**Problem**: PRISMA is reporting standard (how to communicate), NOT methodology (how to conduct)

**Consequence**: Following PRISMA checklist ≠ rigorous systematic review (need Cochrane Handbook methodology)

**Solution**: Use Cochrane Handbook for methods, PRISMA for reporting

---

## Quality Gates (When to Pause)

### Before Protocol Finalization

- [ ] Research question answerable (not too broad/narrow)?
- [ ] PICO/PEO elements clear?
- [ ] Inclusion/exclusion criteria unambiguous?
- [ ] Search strategy validated (librarian review)?
- [ ] Protocol registered (PROSPERO, OSF)?

### After Pilot Screening

- [ ] Inter-rater reliability ≥0.60 (aim ≥0.80)?
- [ ] Inclusion/exclusion criteria need revision?
- [ ] Reviewers calibrated (consistent interpretations)?
- [ ] Sample size adequate for saturation (qualitative)?

### Before Data Synthesis

- [ ] All data extracted and checked?
- [ ] Risk of bias assessed for all studies?
- [ ] Heterogeneity examined (statistical and clinical)?
- [ ] Publication bias assessed (if meta-analysis)?

### Before Submission

- [ ] PRISMA checklist completed (all 27 items)?
- [ ] PRISMA flow diagram included?
- [ ] GRADE Summary of Findings table (if quantitative)?
- [ ] Reflexivity statement (if qualitative)?
- [ ] Data availability statement?

---

## Integration with Phronesis FCIP

### Systematic Document Review

- **PRISMA flow adaptation**: Search → Screen → Include → Analyze (for complaints, reports, investigations)
- **Dual review**: Two investigators independently assess evidence
- **Inter-rater reliability**: Cohen's Kappa calculated, conflicts resolved

### Qualitative Analysis

- **Thematic analysis**: 6-phase process for identifying patterns in complaints/testimonies
- **Grounded theory**: Theory of institutional dysfunction emerges from data
- **Constant comparison**: Compare new cases to existing codes/themes

### Evidence Quality

- **Risk of bias assessment**: Adapt RoB tools for document authenticity, source reliability
- **GRADE-style framework**: Certainty of findings (high/moderate/low/very low)
- **Evidence hierarchy**: Primary documents > corroborated testimony > single-source claims

### QDAS Integration

- **NVivo-style coding**: Hierarchical code structure, code memos, query tools
- **Matrix coding**: Cross-tabulate themes × cases (identify patterns)
- **Network visualization**: Relationships between codes/themes

### Inter-Rater Reliability

- **Automated Kappa**: Calculate agreement between investigators
- **Conflict resolution workflow**: Flag disagreements for consensus discussion
- **Calibration mode**: Pilot cases for training before full review

---

## Qualitative Data Analysis Software (QDAS)

### NVivo (QSR International)

**Strengths**:

- Comprehensive coding (text, audio, video, images, social media)
- Matrix coding (cross-tabulate codes × cases)
- Visualization (network graphs, cluster analysis)
- Query tools (text search, coding queries, matrix queries)

**Limitations**: Steep learning curve, expensive subscription

### MAXQDA (VERBI Software)

**Strengths**:

- Mixed methods integration (QUAN + QUAL)
- Visual tools (code maps, code relations browser)
- MAXDictio (word frequency, keyword-in-context)
- Summary grids (compact data overview)

**Limitations**: Complex interface, memory-intensive for large datasets

### ATLAS.ti (ATLAS.ti Scientific)

**Strengths**:

- Network views (conceptual mapping)
- Hermeneutic unit (self-contained project)
- Quotation-level coding (precise segments)
- Cloud collaboration

**Limitations**: Windows-primary (Mac version lags), expensive

**Market consensus**: All three (NVivo, MAXQDA, ATLAS.ti) are robust; choice based on preference, budget, institutional license

---

## Reflexivity in Qualitative Research

**Definition**: Researcher's critical self-awareness of how their background, assumptions, and position influence research

### Types of Reflexivity

#### Personal Reflexivity

- How do my values/beliefs shape this research?
- What assumptions am I bringing?
- How does my identity (gender, race, class, profession) influence interpretation?

#### Epistemological Reflexivity

- How do my beliefs about knowledge affect methods chosen?
- What alternative interpretations am I missing?
- How is my theoretical framework shaping findings?

### Reflexivity Strategies

- **Reflexive journal**: Ongoing diary of thoughts, reactions, decisions
- **Peer debriefing**: Discuss interpretations with colleagues
- **Member checking**: Participants review findings (validate/challenge)
- **Audit trail**: Document all decisions (transparent to reviewers)

**Reporting**: Reflexivity statement in methods section (positionality, potential biases, how addressed)

---

## Framework Method (Ritchie & Spencer)

**Purpose**: Matrix-based qualitative analysis (particularly for applied research, policy contexts)

### Five Stages

#### Stage 1: Familiarization

- Immerse in data (read transcripts, notes, reports)
- Identify key ideas and recurrent themes

#### Stage 2: Identify Thematic Framework

- Develop coding framework (a priori + emergent)
- Organize into main themes and subthemes

#### Stage 3: Indexing

- Apply framework systematically to all data
- Code all relevant passages

#### Stage 4: Charting

- Rearrange data into matrix (rows = cases, columns = themes)
- Summaries in cells (referenced to original data)

**Example matrix**:
| Case | Theme 1: Workload | Theme 2: Support | Theme 3: Outcomes |
|------|-------------------|------------------|-------------------|
| P01 | "Overwhelming" (p.3) | "No supervision" (p.5) | "Burnout" (p.7) |
| P02 | "Manageable" (p.2) | "Good team" (p.4) | "Coping" (p.6) |

#### Stage 5: Mapping and Interpretation

- Compare across cases (rows)
- Compare within themes (columns)
- Identify patterns, associations, explanations

**Strengths**: Systematic, transparent, facilitates team analysis, visual overview

**Limitation**: Risk of fragmenting narrative (losing context)

---

## Resources and Standards

### Systematic Review

- **Cochrane Handbook v6.5**: https://training.cochrane.org/handbook (methodological gold standard)
- **PRISMA 2020**: https://www.prisma-statement.org (reporting checklist)
- **PROSPERO**: https://www.crd.york.ac.uk/prospero/ (protocol registration)
- **Covidence**: https://www.covidence.org (review management software)

### Risk of Bias Tools

- **RoB 2**: Cochrane tool for RCTs
- **ROBINS-I**: Tool for non-randomized studies
- **GRADE**: https://www.gradeworkinggroup.org (certainty assessment)

### Qualitative Methods

- Braun & Clarke (2006): "Using thematic analysis in psychology" (foundational TA paper)
- Glaser & Strauss (1967): _The Discovery of Grounded Theory_ (original GT text)
- Ritchie & Spencer (1994): Framework Method (in Bryman & Burgess, _Analyzing Qualitative Data_)

### QDAS Software

- **NVivo**: https://www.qsrinternational.com
- **MAXQDA**: https://www.maxqda.com
- **ATLAS.ti**: https://atlasti.com

### Inter-Rater Reliability

- Cohen (1960): "A coefficient of agreement for nominal scales" (Kappa calculation)
- Landis & Koch (1977): "Measurement of observer agreement" (Kappa interpretation)

---

## Document Control

**Version**: Quick Start 1.0
**Date**: 2026-01-17
**Source**: 06-academic-research.md (88,547 bytes)
**Lines**: ~499
**Format**: Reference card (printable)

**Next steps**: Read full methodology for:

- Detailed meta-analysis procedures (fixed vs random effects, heterogeneity assessment)
- Advanced qualitative methods (IPA, narrative analysis, discourse analysis)
- Mixed methods integration (convergent, explanatory, exploratory designs)
- Research ethics frameworks (informed consent, confidentiality, vulnerable participants)
- Publication strategies (journal selection, open access, preprints)
- QDAS advanced techniques (autocoding, sentiment analysis, machine learning integration)

---

_"Systematic rigor, methodological pluralism, and quality assurance distinguish academic research. PRISMA reports what was done; Cochrane Handbook guides how to do it right."_

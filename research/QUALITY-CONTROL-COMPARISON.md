---
title: Quality Control Comparison Matrix
description: Comprehensive comparison of quality control, peer review, and validation techniques used across six professional investigation domains.
category: Quality Control
status: complete
date: 2026-01-18
---

# Quality Control Approaches Across Investigation Methodologies

Comprehensive comparison of quality control, peer review, and validation techniques used across six professional investigation domains.

## Purpose

This reference document enables:

- Selection of appropriate QC methods for different investigation types
- Cross-validation using multiple quality control frameworks
- Implementation of multi-layered quality assurance
- Understanding trade-offs between rigor, speed, and cost

## Visual Comparison Matrix

### Quality Control Dimensions

| Domain           | Primary QC Method       | Validation Standard          | Min. Reviewers                            | Statistical Measure      | Time to QC   | Cost Impact           | Defensibility            |
| ---------------- | ----------------------- | ---------------------------- | ----------------------------------------- | ------------------------ | ------------ | --------------------- | ------------------------ |
| **Police**       | Supervisory oversight   | IOPC standards               | 1-2 (supervisor + peer)                   | N/A                      | Days-weeks   | 🟢 Low                | 🟢 High (court-tested)   |
| **Journalism**   | Multi-layered editorial | Magazine model fact-checking | 3-5 (writer, editor, fact-checker, legal) | N/A                      | Weeks-months | 🔴 High               | 🟡 Medium (reputation)   |
| **Legal**        | Statistical sampling    | TAR validation (75%+ recall) | 2+ (QC reviewer + senior attorney)        | Precision/Recall metrics | Days-weeks   | 🟡 Medium (automated) | 🟢 High (court-approved) |
| **Regulatory**   | Dual decision-makers    | Real prospect test           | 2 (professional + lay)                    | N/A                      | Months       | 🟢 Low                | 🟢 High (statutory)      |
| **Intelligence** | Structured review       | ICD 203 tradecraft standards | 3+ (analyst + reviewer + Red Cell)        | N/A                      | Days-weeks   | 🟡 Medium             | 🟡 Medium (classified)   |
| **Academic**     | Inter-rater reliability | Cohen's Kappa ≥0.60          | 2-3 (dual independent coding)             | Kappa, ICC               | Weeks-months | 🟡 Medium             | 🟢 High (peer-reviewed)  |

**Legend:**

- 🟢 Low/High (favorable) | 🟡 Medium | 🔴 High/Low (challenging)

---

## Detailed Comparison

### 1. Police Investigation Quality Control

**Framework:** Three-tier supervisory oversight

- **First-line supervisor** (Sergeant): Reviews all investigations, checks procedure compliance
- **Peer review**: Fellow investigators review complex cases
- **Professional Standards Department**: Monitors for misconduct/negligence

**IOPC Standards:**

- Independent oversight for serious incidents
- Mandatory referrals for deaths/serious injuries
- Transparency requirements
- Public reporting

**Strengths:**

- ✅ Clear chain of accountability
- ✅ Legally mandated oversight
- ✅ Court-tested defensibility
- ✅ Low cost (built into hierarchy)

**Weaknesses:**

- ❌ Potential for hierarchical bias
- ❌ Limited statistical validation
- ❌ Variability across forces
- ❌ Reactive rather than predictive

**Best for:** Volume investigations, criminal cases requiring court presentation, regulatory compliance

---

### 2. Journalism Quality Control

**Framework:** Multi-layered editorial process

1. Planning (editor approval)
2. Research (source verification)
3. Writing (first draft)
4. Editing (line-by-line review)
5. Fact-checking (independent verification of every fact)
6. Legal review (libel, source protection)
7. Publication

**Magazine Model:**

- Separate fact-checker (not writer or editor)
- Verifies every factual claim
- Re-interviews sources
- Checks arithmetic and logic
- Documents source for each assertion

**Strengths:**

- ✅ Extremely thorough verification
- ✅ Independent fact-checking
- ✅ Multiple expert reviews (editorial, legal, subject matter)
- ✅ Strong reputation protection

**Weaknesses:**

- ❌ Very time-intensive (weeks to months)
- ❌ High cost (multiple full-time roles)
- ❌ Not scalable to large document sets
- ❌ Subjective standards (no statistical validation)

**Best for:** High-impact investigations, legal risk stories, reputation-critical reporting, limited document volume

---

### 3. Legal eDiscovery Quality Control

**Framework:** Statistical validation with sampling

**TAR 1.0 Validation:**

- Random sample of unreviewed documents
- Senior attorney review of sample
- Calculate precision (% relevant in high-scoring docs)
- Calculate recall (% of relevant docs captured)
- Target: 75%+ recall, high precision

**TAR 2.0/CAL Quality Control:**

- Continuous validation throughout review
- Real-time accuracy metrics
- Elusion testing (sample documents system ranked as non-relevant)
- Statistical confidence intervals

**Batching QC:**

- Senior attorney reviews 5-10% of junior attorney work
- Measure consistency across reviewers
- Targeted feedback and re-training
- Document QC results for defensibility

**Strengths:**

- ✅ Statistically rigorous
- ✅ Court-validated methodology
- ✅ Scalable to millions of documents
- ✅ Automated measurement
- ✅ Clear metrics (precision/recall)

**Weaknesses:**

- ❌ Requires statistical expertise
- ❌ Upfront seed set quality critical (TAR 1.0)
- ❌ Expensive platforms (Relativity, Everlaw)
- ❌ Can miss subtle context

**Best for:** Large-scale document review, litigation, regulatory investigations, compliance

---

### 4. Regulatory Investigation Quality Control

**Framework:** Dual decision-maker model

**Composition:**

- One professional member (same discipline as registrant)
- One lay member (not from regulated profession)
- Often: legal assessor for procedure

**Real Prospect Test:**

- "Is there a real prospect that a tribunal/panel would find facts proved?"
- Low threshold (not "balance of probabilities")
- Two independent assessors must agree

**Case Examiner Review (GMC/HCPC):**

- Both examiners review same evidence
- Independent conclusions
- If disagree → Investigation Committee Panel
- Rationale documented for transparency

**Strengths:**

- ✅ Balances technical expertise and public perspective
- ✅ Prevents professional bias/closing ranks
- ✅ Legally mandated composition
- ✅ Transparent decision-making

**Weaknesses:**

- ❌ Slower (coordination of two busy professionals)
- ❌ Potential for lay/professional tension
- ❌ Limited to professional standards contexts
- ❌ No statistical validation

**Best for:** Professional misconduct, fitness-to-practise, standards breaches, public protection cases

---

### 5. Intelligence Analysis Quality Control

**Framework:** Structured analytic review + Red Team

**ICD 203 Requirements:**

- Describes quality/credibility of sources
- Expresses uncertainties (WEP + confidence levels)
- Distinguishes intelligence from assumptions
- Incorporates analysis of alternatives
- Uses clear argumentation
- Explains changes in judgments

**Red Cell Review:**

- Separate unit constructs alternative interpretations
- Adversarial analysis of draft assessments
- Devil's Advocacy institutionalized
- Not consensus-seeking

**Minimum 3 Reviewers:**

- Intelligence Community research: 3+ independent raters required for reliable quality control
- Mitigates individual analyst biases
- Collective analysis more accurate than individuals

**Strengths:**

- ✅ Institutionalized contrarian analysis
- ✅ Multiple independent perspectives
- ✅ Structured techniques combat bias
- ✅ Clear confidence/uncertainty expression

**Weaknesses:**

- ❌ Time-intensive (multiple reviews)
- ❌ Can delay urgent intelligence
- ❌ Classified processes (less peer scrutiny)
- ❌ Research shows limited bias reduction from some SATs

**Best for:** High-stakes decisions, incomplete information, adversarial contexts, national security

---

### 6. Academic Research Quality Control

**Framework:** Inter-rater reliability + peer review

**Dual Independent Coding:**

- Two researchers code same data independently
- Calculate Cohen's Kappa (agreement measure)
- ≥0.60 acceptable, ≥0.70 preferred
- Discuss discrepancies, refine codebook
- Re-code until agreement acceptable

**Cohen's Kappa Calculation:**

- Accounts for chance agreement (unlike simple % agreement)
- Formula: κ = (Observed Agreement - Expected Agreement) / (1 - Expected Agreement)
- Interpretation: <0.20 slight, 0.21-0.40 fair, 0.41-0.60 moderate, 0.61-0.80 substantial, 0.81-1.00 almost perfect

**Consensus Coding Process:**

1. Independent coding of subset (10-20%)
2. Calculate IRR (Cohen's Kappa)
3. Meet to discuss disagreements
4. Refine codebook definitions
5. Re-code problematic segments
6. Iterate until ≥0.60 achieved
7. Apply finalized codebook to full dataset

**Peer Review (Publication):**

- Minimum 2 external reviewers
- Expert in methodology and topic
- Blind review (double or single)
- Editor adjudicates disagreements
- Revision rounds before acceptance

**Strengths:**

- ✅ Statistically validated reliability
- ✅ Transparent methodology (replicable)
- ✅ External peer review pre-publication
- ✅ Audit trail (codebook, memos, IRR calculations)

**Weaknesses:**

- ❌ Time-intensive (months to years)
- ❌ Limited to academic research contexts
- ❌ IRR may not capture quality of disagreements
- ❌ Kappa sensitive to prevalence (low when one code dominates)

**Best for:** Research studies, systematic reviews, qualitative analysis, academic publications

---

## Cross-Domain Quality Control Patterns

### Universal Principles

1. **Independence**: QC reviewer should not be original analyst (except self-review with documented process)
2. **Documentation**: All QC activities logged with timestamp, reviewer, findings
3. **Feedback Loops**: Results inform training, process improvement, recalibration
4. **Proportionality**: QC rigor matched to stakes (higher scrutiny for higher-impact conclusions)
5. **Transparency**: QC methodology disclosed to consumers of analysis

### Convergent Practices

| Practice                   | Police      | Journalism | Legal                       | Regulatory      | Intelligence  | Academic         |
| -------------------------- | ----------- | ---------- | --------------------------- | --------------- | ------------- | ---------------- |
| **Multiple reviewers**     | ✅          | ✅         | ✅                          | ✅              | ✅            | ✅               |
| **Documented rationale**   | ✅          | ✅         | ✅                          | ✅              | ✅            | ✅               |
| **Independent oversight**  | ✅ (IOPC)   | ✅ (Legal) | ✅ (Judge/Opposing counsel) | ✅ (Lay member) | ✅ (Red Cell) | ✅ (Peer review) |
| **Statistical validation** | ❌          | ❌         | ✅                          | ❌              | ❌            | ✅               |
| **Sampling strategy**      | 🟡 (Ad hoc) | ✅         | ✅                          | ❌              | 🟡            | ✅               |
| **Calibration exercises**  | 🟡          | ❌         | ✅                          | 🟡              | ✅            | ✅               |
| **Blind review**           | ❌          | ❌         | 🟡 (Redacted)               | ❌              | 🟡            | ✅               |

---

## Implementation for Phronesis FCIP

### Recommended Multi-Layered QC Architecture

**Layer 1: Automated Quality Checks**

- Completeness validation (all required fields populated)
- Consistency checks (contradictory findings flagged)
- Timeline coherence (events in logical sequence)
- Citation verification (every finding linked to evidence)
- Source reliability scoring (Admiralty Code)

**Layer 2: Peer Review**

- Minimum 2 independent reviewers
- Calibration on initial cases (calculate IRR)
- Targeted review (high-impact findings get more scrutiny)
- Documented disagreements and resolutions

**Layer 3: Red Team Analysis**

- Devil's Advocacy mode (argue against findings)
- Alternative hypothesis testing (ACH matrix)
- Assumption challenge (Key Assumptions Check)
- Bias detection (motivated reasoning patterns)

**Layer 4: Statistical Validation (Large-Scale)**

- Random sample of AI-flagged findings
- Expert validation of sample
- Calculate precision/recall
- Confidence intervals on estimates
- Elusion testing (check false negatives)

**Layer 5: External Review**

- Subject matter experts for complex cases
- Legal review for high-risk conclusions
- Methodology review for novel analysis
- Stakeholder review (when appropriate)

### QC Metrics Dashboard

Display for each investigation:

- **Completeness**: % of required evidence types collected
- **Consistency**: # of unresolved contradictions
- **Coverage**: % of documents analyzed by engines
- **Confidence**: Aggregate confidence score (weighted by finding severity)
- **Review Status**: Reviewers assigned, completion %
- **IRR**: Cohen's Kappa for dual-coded findings
- **Validation**: Precision/recall if sampled
- **Red Team**: Alternative hypotheses considered, disposition

### Decision Rules

**Proceed to Report:**

- All automated checks pass
- Minimum 2 reviewers completed (Kappa ≥0.60)
- Red Team review completed
- No unresolved high-severity contradictions

**Require Additional Review:**

- IRR <0.60 (recalibrate, recode)
- Red Team identifies plausible alternative not considered
- Legal risk flagged
- Novel methodology applied

**Escalate to Expert:**

- Contradictory expert opinions
- Complex technical/scientific questions
- Unprecedented factual scenarios
- Potential systemic institutional failure

---

## Cost-Benefit Analysis

### Time Investment (Typical)

| Domain       | QC Time (% of total investigation) | Bottleneck                     | Mitigation                                              |
| ------------ | ---------------------------------- | ------------------------------ | ------------------------------------------------------- |
| Police       | 10-15%                             | Supervisor availability        | Stagger review, automate routine checks                 |
| Journalism   | 40-60%                             | Fact-checking bandwidth        | Prioritize high-risk claims, tool-assisted verification |
| Legal        | 20-30%                             | Senior attorney time           | Statistical sampling, TAR elusion testing               |
| Regulatory   | 25-35%                             | Dual examiner coordination     | Async review with structured decision points            |
| Intelligence | 30-50%                             | Red Cell/reviewer availability | Lightweight SATs first, deep review for key judgments   |
| Academic     | 50-70%                             | Dual coding, peer review       | Reliability sampling (not 100% dual-coding)             |

### Error Cost vs. QC Cost Trade-off

**High-Stakes (Serious Misconduct, Criminal Charges):**

- Accept 50-70% QC overhead
- Use academic-level rigor (dual coding, peer review)
- Statistical validation where applicable
- External expert review

**Medium-Stakes (Professional Standards, Civil Matters):**

- 20-40% QC overhead
- Regulatory dual-examiner model
- Sampling approach for large volumes
- Internal peer review

**Low-Stakes (Preliminary Assessment, Triage):**

- 10-20% QC overhead
- Single senior reviewer
- Automated checks + spot sampling
- Fast feedback for recalibration

---

## Selecting QC Methodology

### Decision Tree

**1. What is the volume of evidence?**

- **Small (<100 docs)**: Manual review, journalism/academic methods
- **Medium (100-10,000 docs)**: Legal sampling, regulatory dual-review
- **Large (10,000+ docs)**: Legal TAR/CAL with statistical validation

**2. What are the stakes?**

- **High (criminal, professional license, major institutional change)**: Academic IRR + journalism fact-checking + legal validation
- **Medium (civil liability, reputation risk)**: Regulatory dual-examiner + legal sampling
- **Low (internal assessment, preliminary)**: Police supervisory model

**3. What is the time constraint?**

- **Urgent (<1 week)**: Police supervisory + automated checks
- **Normal (1-4 weeks)**: Legal sampling or regulatory dual-review
- **Extended (months)**: Academic IRR + journalism fact-checking

**4. What is adversarial intensity?**

- **High (litigation, public scrutiny)**: Legal statistical validation + Red Team
- **Medium (regulatory proceeding)**: Dual-examiner + peer review
- **Low (internal)**: Supervisory review + automated checks

**5. What is the evidence type?**

- **Documentary**: Legal TAR/CAL methods
- **Testimonial**: Police PEACE/Cognitive Interview + journalism verification
- **Mixed**: Regulatory + intelligence SATs

---

## Quality Control Integration with S.A.M. Framework

### QC for Each Contradiction Type

| S.A.M. Type            | Primary QC Method                 | Validation Technique                | Threshold                            |
| ---------------------- | --------------------------------- | ----------------------------------- | ------------------------------------ |
| **SELF**               | Automated logic check             | Independent reviewer confirmation   | 100% reviewed if high-severity       |
| **INTER_DOC**          | Timeline overlay + peer review    | Statistical sampling if >100 docs   | Kappa ≥0.60 on contradictions        |
| **TEMPORAL**           | Chronology verification           | External timeline validation        | All dates source-verified            |
| **EVIDENTIARY**        | Evidence hierarchy check          | Expert review if complex            | Dual-review for key gaps             |
| **MODALITY_SHIFT**     | Linguistic analysis + peer review | Red Team challenge                  | Document all certainty shifts        |
| **SELECTIVE_CITATION** | Citation network analysis         | Random sampling of uncited material | Sample ≥30 or 10% (whichever larger) |
| **SCOPE_SHIFT**        | Scope boundary documentation      | Legal review                        | All shifts explicitly justified      |
| **UNEXPLAINED_CHANGE** | Version comparison + timeline     | Journalism verification protocol    | Every position change sourced        |

---

## Continuous Improvement

### QC Metrics to Track

1. **False Positive Rate**: % of flagged issues that were not actual problems (calibration metric)
2. **False Negative Rate**: % of issues missed in initial review (elusion testing)
3. **Reviewer Agreement**: Cohen's Kappa trend over time (should increase as calibration improves)
4. **Time to QC**: Duration from analysis complete to QC sign-off (efficiency metric)
5. **Rework Rate**: % of investigations requiring significant revision after QC (quality metric)
6. **Challenge Success**: % of Red Team challenges that changed conclusions (rigor metric)

### Calibration Protocol

**Monthly:**

- Calculate IRR on random sample of dual-reviewed cases
- Targeted training if Kappa drops below 0.60
- Update QC guidelines based on common disagreements

**Quarterly:**

- External expert review of 3-5 completed investigations
- Blind review (expert doesn't know original conclusions)
- Compare expert vs. system findings
- Identify systematic biases

**Annually:**

- Full methodology audit
- Benchmark against industry standards
- Update QC procedures based on lessons learned
- Publish methodology transparency report

---

## Further Reading

**Police:**

- [Police Investigation Workflows](./methodologies/01-police-investigations.md) - Section 8: Quality Assurance

**Journalism:**

- [Investigative Journalism Methods](./methodologies/02-journalism-investigations.md) - Section 12: Quality Control

**Legal:**

- [Legal eDiscovery Workflows](./methodologies/03-legal-ediscovery.md) - Section 3: TAR Validation

**Regulatory:**

- [Regulatory Investigations](./methodologies/04-regulatory-investigations.md) - Section 6: Expert Review

**Intelligence:**

- [Intelligence Analysis Methods](./methodologies/05-intelligence-analysis.md) - Section 5: Bias Mitigation

**Academic:**

- [Academic Research Methods](./methodologies/06-academic-research.md) - Section 6: Inter-Rater Reliability

---

**Last Updated:** January 2026
**Purpose:** Quality control methodology selection and implementation guidance
**Target Audience:** Platform developers, investigators, quality assurance teams
**Integration:** Phronesis FCIP quality control architecture

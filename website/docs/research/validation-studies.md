# Validation Studies Framework for S.A.M. Methodology

## Introduction: The Need for Empirical Validation

The Systematic Adversarial Methodology (S.A.M.) makes empirical claims about how institutional documents function, how false premises propagate, and how these patterns contribute to institutional failures. These claims require empirical validation through systematic research.

This document presents:
1. **Validation criteria**: What would constitute evidence that S.A.M. is valid and reliable?
2. **Research designs**: How can S.A.M.'s claims be tested empirically?
3. **Measurement protocols**: How can key constructs be operationalized and measured?
4. **Proposed studies**: Specific research projects to validate S.A.M.
5. **Quality standards**: Criteria for assessing validation research

---

## 1. Types of Validity

### 1.1 Construct Validity

**Question**: Does S.A.M. measure what it claims to measure?

#### Key constructs requiring validation:

**1. Origin type classification**
- Does S.A.M.'s classification (primary source, professional opinion, hearsay, speculation, etc.) meaningfully distinguish evidential quality?
- Do independent raters agree on classifications?
- Does classification correlate with independent measures of evidence quality?

**2. Authority weight assignment**
- Do S.A.M.'s authority weights (1-5 scale) reflect actual institutional influence?
- Do different raters assign similar weights?
- Do weights predict institutional deference in practice?

**3. Contradiction detection**
- Does S.A.M. identify genuine contradictions?
- What is the rate of false positives (flagging non-contradictions)?
- What is the rate of false negatives (missing real contradictions)?

**4. Authority laundering**
- Is "authority laundering" a real phenomenon distinct from normal institutional processes?
- Can it be reliably identified?
- Does it predict poor outcomes?

**Validation approach**:
- Expert consensus: Do domain experts (judges, investigators, clinicians) agree that S.A.M. identifies real problems?
- Convergent validity: Does S.A.M. correlate with other indicators of institutional quality?
- Discriminant validity: Does S.A.M. distinguish between good and poor institutional practice?

### 1.2 Criterion Validity

**Question**: Do S.A.M. findings correlate with external criteria of interest?

#### Concurrent validity

**Hypothesis**: S.A.M. scores correlate with contemporaneous institutional quality indicators.

**Tests**:
- Do cases with high false premise counts also have high rates of oversight findings?
- Do cases with detected authority laundering correlate with independent audit problems?
- Do high contradiction counts predict adverse review outcomes?

**Design**: Identify sample of cases with:
- Known oversight findings (e.g., appellate reversals, ombudsman investigations)
- Apply S.A.M. to document sets
- Calculate correlation between S.A.M. scores and oversight findings

**Expected result**: Positive correlation between S.A.M. problem detection and external quality indicators.

#### Predictive validity

**Hypothesis**: S.A.M. findings predict future corrections/reversals.

**Tests**:
- Do historical cases with high S.A.M. scores have higher rates of later exoneration?
- Do cases with authority laundering detection predict future institutional correction?
- Do high false premise counts predict later discovery of errors?

**Design**: Retrospective analysis:
1. Identify closed cases with known outcomes
2. Some later reversed/corrected, some not
3. Apply S.A.M. to original document sets (before outcome known)
4. Test whether S.A.M. scores predict which cases were later corrected

**Expected result**: S.A.M. scores predict later corrections (sensitivity analysis).

### 1.3 Reliability

**Question**: Do different analysts applying S.A.M. reach similar conclusions?

#### Inter-rater reliability

**Protocol**:
1. Train multiple analysts on S.A.M. methodology
2. Provide same document set to all analysts
3. Analysts independently conduct S.A.M. analysis
4. Calculate agreement statistics

**Measures**:
- **Claim extraction**: % overlap in identified claims (Jaccard index)
- **Origin classification**: Cohen's kappa for agreement on origin types
- **Contradiction detection**: Agreement on contradiction presence/absence (kappa)
- **Authority weights**: Intraclass correlation coefficient (ICC)
- **Causation links**: Agreement on outcome-claim linkages (kappa)

**Acceptability thresholds**:
- Claim extraction: Jaccard > 0.75
- Origin classification: κ > 0.7 (substantial agreement)
- Contradiction detection: κ > 0.6 (moderate-to-substantial)
- Authority weights: ICC > 0.7
- Causation links: κ > 0.6

**Challenge**: High agreement easy to achieve if everything is marked same way (e.g., "no contradictions found" in all cases). Must include diverse cases with known contradictions.

#### Test-retest reliability

**Protocol**:
1. Analyst conducts S.A.M. analysis on document set
2. Wait sufficient time for memory fade (e.g., 3 months)
3. Same analyst conducts S.A.M. analysis again
4. Compare results

**Measure**: Correlation between Time 1 and Time 2 findings.

**Expected result**: High correlation (r > 0.8) indicates stable methodology.

### 1.4 Content Validity

**Question**: Does S.A.M. cover the relevant domain?

**Expert evaluation**:
- Panel of institutional scholars, legal experts, clinicians review S.A.M.
- Assess: Does taxonomy cover important failure modes?
- Assess: Are critical aspects missing?
- Assess: Are categories appropriate for intended contexts?

**Qualitative research**:
- Interviews with institutional actors about failure modes they've observed
- Compare reported failures to S.A.M. taxonomy
- Identify gaps, refine taxonomy

### 1.5 Ecological Validity

**Question**: Does S.A.M. work in real-world institutional contexts?

**Field testing**:
- Apply S.A.M. in operational settings (not just research contexts)
- Legal practice, oversight bodies, journalism, internal audits
- Assess: Is it practical? Does it produce actionable findings?
- Compare to existing methods: Better? Worse? Different?

**Feasibility assessment**:
- Time required for S.A.M. analysis
- Expertise required
- Document access requirements
- Cost vs. benefit analysis

---

## 2. Proposed Validation Studies

### Study 1: Wrongful Conviction Validation

**Objective**: Validate S.A.M. in context of known wrongful convictions.

**Design**:
- **Sample**: 100 exoneration cases (from Innocence Project, National Registry of Exonerations)
- **Control**: 100 matched non-exoneration cases
- **Procedure**: Apply S.A.M. to pre-exoneration documents (as they existed at conviction)
- **Analysis**: Compare S.A.M. scores between exoneration and control cases

**Hypotheses**:
1. Exoneration cases have higher false premise counts than controls
2. Exoneration cases show more authority laundering
3. Exoneration cases have more contradictions in evidence
4. S.A.M. scores predict exoneration (ROC analysis, AUC > 0.70)

**Measures**:
- False premise count per case
- Authority laundering instances
- Contradiction density (contradictions per document)
- Evidential quality scores at key decision points

**Analysis**:
- t-tests comparing exoneration vs. control on each measure
- Logistic regression: S.A.M. scores predicting exoneration
- ROC curve: Sensitivity/specificity tradeoffs

**Expected result**: Exoneration cases show significantly higher S.A.M. problem indicators.

**Significance**: If S.A.M. can distinguish wrongful from valid convictions using only original documents, strong evidence for validity.

### Study 2: Child Welfare Outcomes

**Objective**: Validate S.A.M. in child protection context.

**Design**:
- **Sample**: Child protection cases with known outcomes
  - Group A: Children returned home successfully
  - Group B: Children placed permanently (adoption/guardianship)
  - Group C: Reunification attempts that failed
- **Procedure**: Apply S.A.M. to initial investigation and assessment documents
- **Analysis**: Do S.A.M. scores predict outcomes? Do they predict adverse outcomes?

**Hypotheses**:
1. Cases with poor outcomes show higher false premise counts in initial documents
2. Cases with authority laundering more likely to have adverse outcomes
3. Cases with high contradiction counts more likely to require course corrections

**Outcome measures**:
- Reunification success/failure
- Re-entry to foster care
- Adverse events in placement
- Later reversal of initial determinations

**Analysis**:
- Survival analysis: Time to reunification predicted by S.A.M. scores
- Logistic regression: Adverse outcomes predicted by S.A.M. indicators
- Mediation analysis: Do false premises lead to poor outcomes through misguided interventions?

**Expected result**: High false premise counts in initial documents predict worse outcomes.

**Significance**: Shows S.A.M. has predictive validity in child welfare context.

### Study 3: Inter-Rater Reliability Study

**Objective**: Establish reliability of S.A.M. coding.

**Design**:
- **Coders**: 6 trained analysts (2 legal background, 2 social science, 2 investigative journalism)
- **Materials**: 30 document sets from diverse contexts (10 legal, 10 medical, 10 child welfare)
- **Procedure**:
  - All coders receive same training on S.A.M.
  - Each coder independently analyzes all 30 cases
  - Compare results across coders

**Analysis**:
- Calculate Cohen's kappa for categorical judgments
- ICC for continuous measures
- Krippendorff's alpha for ordinal measures
- Examine patterns: Do certain contradiction types have lower reliability? Do certain contexts?

**Reporting**:
- Overall reliability statistics
- By-category reliability (which aspects most/least reliable?)
- Coder characteristics predicting agreement (does background matter?)
- Difficult cases: Which cases had lowest agreement? Why?

**Expected result**: Acceptable reliability (κ > 0.6, ICC > 0.7) for most measures.

**Significance**: Demonstrates S.A.M. can be applied consistently by different analysts.

### Study 4: Comparative Validation

**Objective**: Compare S.A.M. to existing document analysis approaches.

**Design**:
- **Methods**: S.A.M. vs. traditional legal review vs. standard audit procedures
- **Sample**: 50 cases with known problems (retrospectively identified)
- **Procedure**:
  - Apply all three methods to same document sets
  - Methods applied by different teams (blinded to other methods' findings)
- **Analysis**: Which method detects more problems? Which has better sensitivity/specificity?

**Comparison metrics**:
- **Sensitivity**: Of known problems, what % detected?
- **Specificity**: Of flagged issues, what % are real problems (vs. false alarms)?
- **Efficiency**: Time and resources required
- **Actionability**: Do findings lead to clear corrective actions?

**Expected result**: S.A.M. has higher sensitivity (detects more problems) with acceptable specificity.

**Significance**: Shows S.A.M. adds value beyond existing methods.

### Study 5: Longitudinal Implementation Study

**Objective**: Assess impact of S.A.M. implementation on institutional quality over time.

**Design**:
- **Setting**: Partner with oversight body or legal organization
- **Intervention**: Implement S.A.M.-based document review
- **Comparison**: Pre/post implementation outcomes
- **Duration**: 3-5 years

**Procedure**:
- **Baseline** (Year 0): Document quality and outcomes before S.A.M.
- **Implementation** (Year 1): Train staff, implement S.A.M. review processes
- **Follow-up** (Years 2-5): Track outcomes

**Outcome measures**:
- Document quality metrics (evidential quality scores, contradiction rates)
- Case outcomes (error rates, reversals, complaints)
- Institutional learning (types of errors decrease over time?)

**Analysis**:
- Interrupted time series: Change in trends after implementation?
- Before/after comparison with statistical controls
- Cost-benefit analysis: Does improved quality justify costs?

**Expected result**: Document quality improves, error rates decrease post-implementation.

**Significance**: Demonstrates real-world impact of S.A.M. implementation.

---

## 3. Measurement Protocols

### 3.1 Evidential Quality Scoring

**Challenge**: Operationalizing "evidential quality" for reliable measurement.

**Proposed scale** (0-100):

**90-100: Highest quality**
- Contemporaneous documentation by neutral observer
- Physical evidence with chain of custody
- Multiple independent corroborating sources
- Video/audio recordings
- *Example*: Dashboard camera footage of traffic stop

**70-89: High quality**
- First-hand observation by credible witness
- Professional examination/assessment within expertise
- Documented with reasonable contemporaneity
- Single reliable source or partial corroboration
- *Example*: Physician's examination findings documented in medical record

**50-69: Medium quality**
- Hearsay from credible source
- Delayed documentation of observation
- Professional opinion at edge of expertise
- Conflicting information present
- *Example*: Police report of what witness said

**30-49: Low quality**
- Hearsay from less reliable source
- Speculation or inference not clearly grounded
- Substantial time lag between event and documentation
- Limited context
- *Example*: Neighbor's report of "concerns" without specific observations

**10-29: Very low quality**
- Multiple-level hearsay
- Speculation presented without marking as such
- No identifiable evidentiary basis
- Contradicted by available evidence
- *Example*: "It is believed that..." without source attribution

**0-9: No quality**
- Fabricated
- Definitively contradicted by evidence
- Logically impossible
- *Example*: Claim in document dated before event could have occurred

**Scoring procedure**:
1. Identify claim
2. Identify evidence cited (if any)
3. Assess evidence type (primary, secondary, etc.)
4. Assess source credibility
5. Assess temporal factors
6. Assess corroboration
7. Assign score based on rubric
8. Document reasoning

**Reliability**: Train raters, establish anchor examples for each level, calculate ICC.

### 3.2 Contradiction Severity Scoring

**Challenge**: Not all contradictions are equally important.

**Proposed scale** (1-4):

**4 = Critical**
- Contradictions affecting core legal/factual determinations
- Contradictions affecting safety decisions
- Contradictions where resolution would change outcome
- *Example*: "Child abuse substantiated" vs. "No evidence of abuse"

**3 = High**
- Contradictions affecting important context
- Contradictions undermining credibility assessments
- Contradictions about key timeline/sequence
- *Example*: Witness said one thing, report characterizes differently

**2 = Medium**
- Contradictions about secondary facts
- Contradictions not directly affecting conclusions
- Inconsistencies in peripheral details
- *Example*: Minor date discrepancies that don't affect core chronology

**1 = Low**
- Trivial contradictions
- Apparent contradictions due to different contexts
- Formatting/transcription errors
- *Example*: Different spellings of name

**Scoring procedure**:
1. Identify contradiction type (using taxonomy)
2. Assess whether contradiction affects conclusions
3. Assess potential impact if contradiction resolved
4. Assign severity score
5. Document reasoning

**Reliability**: Multiple raters score same contradictions, calculate agreement (weighted kappa).

### 3.3 Authority Laundering Detection

**Challenge**: Distinguishing legitimate authority accumulation from laundering.

**Criteria for authority laundering**:

Must meet ALL criteria:
1. **Low initial evidential quality**: Origin score < 40
2. **High cumulative authority**: Authority score > 10 (e.g., court finding + multiple professional endorsements)
3. **No evidence quality improvement**: No new primary evidence added during propagation
4. **Outcome dependency**: High-authority determination directly influenced consequential outcome

**Scoring procedure**:
1. Trace claim to origin
2. Score evidential quality at origin (using protocol above)
3. Track propagation through documents
4. Identify authority markers at each stage
5. Calculate cumulative authority score
6. Check for new evidence at each stage
7. Assess outcome impact
8. Apply criteria: Laundering if (1) AND (2) AND (3) AND (4)

**Validation**: Expert review of flagged cases. Do experts agree laundering occurred?

---

## 4. Data Collection and Management

### 4.1 Document Corpus Requirements

**Completeness**:
- All documents in case file
- Including documents not typically reviewed (internal memos, correspondence)
- Metadata (creation dates, authors, recipients)

**Accessibility**:
- Machine-readable text (OCR if necessary)
- Proper document structure (pages, sections identified)
- Cross-references intact

**Privacy protection**:
- De-identification protocols
- IRB approval for human subjects research
- Secure storage (HIPAA/legal standards)

### 4.2 Data Extraction

**Claim extraction**:
- Semi-automated: NLP identifies candidate claims
- Human review: Analyst confirms and categorizes
- Database: Each claim stored with metadata (document, page, date, author)

**Relationship mapping**:
- Propagation links: Claim X in Doc A → Claim Y in Doc B (same/equivalent)
- Citation links: Doc A cites Doc B
- Authority links: Doc A endorses claim from Doc B

**Coding**:
- Each claim coded for: evidential quality, modality, scope
- Each propagation coded for: verification status, mutation type
- Each document coded for: authority weight, purpose

### 4.3 Quality Control

**Training**:
- Coders complete training module
- Practice on training cases with known answers
- Must achieve reliability threshold before coding actual data

**Ongoing monitoring**:
- Random sample of coded cases reviewed by senior coder
- Regular meetings to discuss difficult cases
- Periodic re-coding of subset to check reliability drift

**Audit trail**:
- All coding decisions documented
- Reasoning for difficult cases recorded
- Changes tracked with justification

---

## 5. Analysis Plans

### 5.1 Descriptive Statistics

**Univariate**:
- Distribution of evidential quality scores
- Frequency of contradiction types
- Authority weight distributions
- False premise prevalence

**Bivariate**:
- Correlation between origin quality and outcome
- Relationship between contradiction count and case complexity
- Authority weight vs. evidence quality (laundering detection)

**Reporting**:
- Tables with descriptive statistics
- Visualizations (histograms, scatter plots, network graphs)
- Narrative summary of key patterns

### 5.2 Inferential Statistics

**Group comparisons**:
- t-tests: Exoneration vs. non-exoneration cases
- ANOVA: Across multiple outcome types
- Chi-square: Categorical outcomes

**Predictive models**:
- Logistic regression: Binary outcomes (exoneration yes/no)
- Survival analysis: Time to event (time to reunification)
- Multilevel models: Cases nested within institutions

**Effect sizes**:
- Cohen's d for group differences
- Odds ratios for predictive models
- R² for variance explained

**Significance testing**:
- α = .05 (two-tailed)
- Corrections for multiple comparisons (Bonferroni)
- Confidence intervals reported

### 5.3 Qualitative Analysis

**Case studies**:
- In-depth analysis of exemplar cases
- Trace cascade process in detail
- Identify mechanisms

**Thematic analysis**:
- Identify common patterns across cases
- Develop grounded theory of cascade dynamics
- Refine taxonomy based on empirical patterns

**Mixed methods integration**:
- Quantitative findings identify patterns
- Qualitative analysis explains mechanisms
- Synthesis produces comprehensive understanding

---

## 6. Validation Standards and Benchmarks

### 6.1 Minimum Acceptability Criteria

For S.A.M. to be considered validated, must meet:

**Reliability**:
- Inter-rater reliability κ > 0.60 for core constructs
- Test-retest reliability r > 0.80

**Construct validity**:
- Expert consensus that S.A.M. identifies real problems
- Convergent validity with other quality indicators (r > 0.50)

**Criterion validity**:
- Concurrent: Correlation with oversight findings (r > 0.40)
- Predictive: Predicts later corrections (AUC > 0.65)

**Sensitivity/Specificity**:
- Sensitivity > 0.70 (detects 70% of real problems)
- Specificity > 0.60 (60% of flags are real problems)

### 6.2 Gold Standard Aspirations

**Strong validation** would show:

**Reliability**:
- Inter-rater κ > 0.75
- Test-retest r > 0.90

**Construct validity**:
- Strong expert endorsement
- Convergent validity r > 0.70

**Criterion validity**:
- Concurrent r > 0.60
- Predictive AUC > 0.80

**Sensitivity/Specificity**:
- Both > 0.80

### 6.3 Comparison Benchmarks

**Existing methods** to compare against:

**Traditional legal review**:
- How does S.A.M. compare to standard attorney case review?
- Hypothesis: S.A.M. more systematic, catches more subtle problems

**Audit procedures**:
- How does S.A.M. compare to standard institutional audits?
- Hypothesis: S.A.M. better at detecting propagation/cascade problems

**Expert opinion**:
- How does S.A.M. compare to unaided expert judgment?
- Hypothesis: S.A.M. provides structure, improves consistency

---

## 7. Limitations and Challenges

### 7.1 Methodological Challenges

**Selection bias**:
- Cases with known problems overrepresented in samples
- May inflate apparent S.A.M. performance

**Hindsight bias**:
- Knowing outcome makes contradictions more salient
- May affect coding decisions

**Document availability**:
- Incomplete document sets in real-world cases
- Cannot code what's not available

**Context specificity**:
- S.A.M. may work differently across domains
- Validation in one context may not generalize

### 7.2 Practical Challenges

**Resource intensity**:
- S.A.M. analysis time-consuming
- Limits sample sizes for validation

**Access barriers**:
- Legal, privacy, institutional barriers to accessing documents
- Particularly challenging for medical, child welfare cases

**Cooperation requirements**:
- Need institutional partnerships for some studies
- Institutions may be reluctant to participate (fear of bad findings)

### 7.3 Conceptual Challenges

**No perfect gold standard**:
- How do we know when false premises truly caused outcomes?
- Counterfactuals are inherently uncertain

**Normative questions**:
- What is "acceptable" error rate?
- How to weight harms of false positives vs. false negatives?

**Complexity**:
- Real cases messy, don't fit clean categories
- Judgment calls unavoidable

---

## 8. Publication and Dissemination Plan

### 8.1 Peer-Reviewed Publications

**Paper 1: Methodology**
- Full description of S.A.M.
- Theoretical foundations
- Target: *Social Epistemology* or *Synthese*

**Paper 2: Validation - Legal Context**
- Wrongful conviction validation study
- Target: *Law & Human Behavior* or *Psychology, Public Policy, and Law*

**Paper 3: Validation - Child Welfare**
- Child protection outcomes study
- Target: *Child Abuse & Neglect* or *Children and Youth Services Review*

**Paper 4: Reliability and Generalizability**
- Inter-rater reliability across contexts
- Target: *Evaluation Review* or *Journal of Mixed Methods Research*

**Paper 5: Implementation and Impact**
- Longitudinal implementation study
- Target: *Journal of Policy Analysis and Management*

### 8.2 Practice-Oriented Publications

**Legal journals**: Application to appellate practice, post-conviction review

**Social work journals**: Application to case review, quality improvement

**Medical journals**: Application to root cause analysis, diagnostic error detection

**Evaluation/audit**: Application to oversight, accountability mechanisms

### 8.3 Open Science Practices

**Pre-registration**:
- Register study designs and hypotheses before data collection
- Prevents p-hacking, increases credibility

**Open data**:
- Share de-identified datasets (where legally/ethically permissible)
- Enable replication, secondary analysis

**Open materials**:
- Share coding manuals, training materials
- Enable others to apply S.A.M.

**Replication**:
- Encourage independent replications
- Publish replications (even if results differ)

---

## 9. Timeline and Resources

### 9.1 Proposed Timeline

**Year 1**:
- Finalize protocols
- Obtain IRB approvals
- Train coders
- Begin data collection (Studies 1-3)

**Year 2**:
- Complete data collection (Studies 1-3)
- Analysis and write-up
- Submit Papers 1-3
- Begin Studies 4-5

**Year 3**:
- Continue Studies 4-5 (longitudinal)
- Analysis of comparative study
- Submit Papers 4-5
- Conference presentations

**Years 4-5**:
- Complete longitudinal follow-up
- Secondary analyses
- Synthesis paper
- Implementation guide

### 9.2 Resource Requirements

**Personnel**:
- Principal Investigator (1 FTE)
- Project Coordinator (1 FTE)
- Coders (4 FTE across projects)
- Statistical consultant (0.2 FTE)

**Funding needs**:
- Personnel: $600K/year
- Document acquisition/access: $50K
- Technology (NLP tools, databases): $30K
- Travel (conferences, site visits): $20K
- Publication costs: $10K
- Total: ~$700K/year × 5 years = $3.5M

**Potential funders**:
- NSF (Law & Science, Social Psychology)
- NIJ (National Institute of Justice)
- NICHD (Child welfare research)
- AHRQ (Healthcare quality)
- Private foundations (Innocence projects, child advocacy)

---

## 10. Conclusion: Building an Evidence Base

S.A.M. is a theoretically-grounded methodology, but theory alone is insufficient. Empirical validation is essential to establish:
- **Reliability**: Can it be applied consistently?
- **Validity**: Does it measure what it claims?
- **Utility**: Does it improve institutional practice?

The validation framework presented here provides a roadmap for building this evidence base through:
- Rigorous psychometric studies (reliability, construct validity)
- Criterion validation in real-world contexts
- Comparative studies against existing methods
- Implementation research demonstrating real-world impact

This program of research would take 5+ years and substantial resources. But given the stakes - wrongful convictions, child welfare failures, medical errors, and countless other institutional harms - investment in systematic validation is justified.

The goal is not merely academic validation but practical impact: demonstrating that S.A.M. can improve institutional accountability, reduce errors, and prevent harm. This requires showing not just that S.A.M. works in research contexts but that it can be implemented in operational settings by practitioners (attorneys, oversight bodies, journalists, auditors).

Success would mean: S.A.M. becomes a standard tool in institutional accountability toolkit, with empirical evidence supporting its use, trained practitioners available to apply it, and demonstrated impact on institutional quality. The validation framework presented here is the foundation for achieving that goal.

---

## References

American Educational Research Association, American Psychological Association, & National Council on Measurement in Education. (2014). *Standards for Educational and Psychological Testing*. American Educational Research Association.

Cicchetti, D. V. (1994). Guidelines, criteria, and rules of thumb for evaluating normed and standardized assessment instruments in psychology. *Psychological Assessment*, 6(4), 284-290.

Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement*, 20(1), 37-46.

Cronbach, L. J., & Meehl, P. E. (1955). Construct validity in psychological tests. *Psychological Bulletin*, 52(4), 281-302.

Krippendorff, K. (2004). *Content Analysis: An Introduction to Its Methodology* (2nd ed.). Sage.

Messick, S. (1995). Validity of psychological assessment: Validation of inferences from persons' responses and performances as scientific inquiry into score meaning. *American Psychologist*, 50(9), 741-749.

Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and Quasi-Experimental Designs for Generalized Causal Inference*. Houghton Mifflin.

Shrout, P. E., & Fleiss, J. L. (1979). Intraclass correlations: Uses in assessing rater reliability. *Psychological Bulletin*, 86(2), 420-428.

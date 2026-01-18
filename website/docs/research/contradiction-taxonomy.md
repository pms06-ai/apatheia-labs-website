# Contradiction Taxonomy: Formal Classification of Inconsistencies in Institutional Documents

## Introduction

This document presents a formal taxonomy of eight contradiction types used in the Systematic Adversarial Methodology (S.A.M.). The taxonomy extends classical logical contradiction to capture the subtler forms of inconsistency, mutation, and distortion common in institutional document chains.

Classical logical contradiction is narrow: Proposition *p* and its negation ¬*p* cannot both be true. But institutional documents exhibit a much wider range of problematic patterns:
- Claims that are not logically contradictory but pragmatically incompatible
- Modality shifts that change meaning without changing core proposition
- Scope changes that alter generality without explicit contradiction
- Evidence-conclusion gaps that don't contradict but fail to support

The S.A.M. taxonomy recognizes eight distinct patterns, each with formal definition, detection criteria, illustrative examples, and severity assessment framework.

---

## Taxonomy Overview

| Code | Type | Core Problem | Detection Focus |
|------|------|--------------|-----------------|
| **SELF** | Internal Contradiction | Mutually incompatible claims within single document | Logical inconsistency, intra-document |
| **INTER_DOC** | Cross-Document Contradiction | Incompatible claims across documents | Propositional conflict, inter-document |
| **TEMPORAL** | Timeline Inconsistency | Logically impossible time sequences | Chronological impossibility |
| **EVIDENTIARY** | Claim-Evidence Mismatch | Stated conclusions unsupported by cited evidence | Inference-evidence gap |
| **MODALITY_SHIFT** | Unjustified Certainty Change | Unexplained changes in hedging/certainty | Modal operator mutation |
| **SELECTIVE_CITATION** | Cherry-Picked References | Quotations/citations distorting source meaning | Representational distortion |
| **SCOPE_SHIFT** | Unexplained Generalization | Unjustified expansion/contraction of claim scope | Quantifier/scope mutation |
| **UNEXPLAINED_CHANGE** | Position Reversal | Institutional position change without justification | Policy/factual reversal |

---

## 1. SELF - Internal Contradiction

### 1.1 Formal Definition

**SELF contradiction** occurs when document *D* contains propositions *p* and *q* such that:
- *p* and *q* are both asserted (not hypothetical or quoted)
- *p* and *q* are mutually incompatible (cannot both be true)
- No resolution or explanation is provided within *D*

### 1.2 Logical Types

#### Type 1A: Direct Negation
Document states *p* and also states ¬*p*.

**Example**:
- Page 3: "The incident occurred on June 5, 2023"
- Page 7: "The incident did not occur on June 5, 2023"

#### Type 1B: Mutual Exclusivity
Document states *p* and *q* where *p* and *q* cannot both be true.

**Example**:
- Paragraph 2: "John was present at the meeting"
- Paragraph 5: "Only Mary and Susan attended the meeting"

#### Type 1C: Logical Incompatibility
Document states *p* and *q* where *p* logically entails ¬*q*.

**Example**:
- Section 2: "All assessments were completed before the hearing"
- Section 4: "The psychological assessment was conducted two weeks after the hearing"

### 1.3 Detection Criteria

**Minimum requirements**:
1. Both propositions appear in same document
2. Both are asserted (not conditional, not quoted)
3. No hedging that would resolve (e.g., "may have" vs. "definitely")
4. No explanation provided (e.g., "Initially we thought X, but further investigation revealed Y")

**Edge cases**:
- **Quotations vs. assertions**: If document quotes Person A saying *p* and Person B saying ¬*p*, this is not SELF (it's reporting disagreement). But if document *asserts* both *p* and ¬*p*, it's SELF.
- **Temporal progression**: If document describes belief changing over time ("we initially thought X, later learned Y"), not SELF. But if document presents both as simultaneous truth, it is SELF.
- **Different contexts**: If *p* applies to one situation and *q* to different situation, may not be incompatible.

### 1.4 Severity Assessment

**Critical**: Contradiction directly affects core conclusions or recommendations
- Report recommends removing child AND recommends leaving child in home
- Finding states person was present AND absent at critical moment

**High**: Contradiction undermines important supporting claims
- Key timeline contradicted elsewhere in same document
- Witness credibility assessment contradicted

**Medium**: Contradiction in secondary details
- Minor date discrepancies
- Inconsistent peripheral facts

**Low**: Trivial contradictions not affecting conclusions
- Typos creating apparent contradiction
- Formatting errors

### 1.5 Illustrative Examples

**Example 1: Child Protection Report (Critical Severity)**

*Page 2, Paragraph 3*:
> "The home visit on March 15 revealed clean and appropriate living conditions. The children appeared well-cared for and adequately supervised."

*Page 4, Paragraph 8*:
> "Due to the unsafe and unsanitary conditions observed during the March 15 visit, removal is recommended."

**Analysis**: Direct contradiction about conditions observed during same visit. Critical severity because contradiction directly affects removal recommendation.

**Example 2: Medical Record (High Severity)**

*Progress Note, 10:30 AM*:
> "Patient reports no previous cardiac history. No prior hospitalizations for chest pain."

*Same Note, 11:15 AM*:
> "Given patient's extensive cardiac history and multiple prior MIs, aggressive treatment warranted."

**Analysis**: Mutually exclusive characterizations of patient history affecting treatment decisions. High severity.

**Example 3: Police Report (Medium Severity)**

*Paragraph 2*:
> "Officer Smith arrived at 14:30 hours and was first on scene."

*Paragraph 5*:
> "Officer Jones had already secured the perimeter when Officer Smith arrived."

**Analysis**: Logical incompatibility (cannot be both first on scene and arrive after another officer). Medium severity if timing is relevant to events but not critical to core findings.

---

## 2. INTER_DOC - Cross-Document Contradiction

### 2.1 Formal Definition

**INTER_DOC contradiction** occurs when:
- Document *D₁* asserts proposition *p*
- Document *D₂* asserts proposition *q*
- *p* and *q* are mutually incompatible
- Both documents are part of same institutional case file/chain

### 2.2 Key Distinctions

**vs. SELF**: INTER_DOC crosses document boundaries; SELF is intra-document

**vs. evolution of understanding**: If later documents explicitly note new information contradicting earlier documents, this is not problematic (it's correction). INTER_DOC is problematic when:
- Later documents don't acknowledge contradiction, or
- Both documents claim definitive truth without noting uncertainty, or
- No explanation for change is provided

### 2.3 Detection Criteria

**Minimum requirements**:
1. Propositions from different documents
2. Both asserted as fact (not hypothetical)
3. Logical or pragmatic incompatibility
4. No acknowledgment of contradiction in either document

**Temporal consideration**:
- Document date matters: Later document may correct earlier without acknowledgment
- Both could be wrong (contradiction doesn't establish which is right)

### 2.4 Common Patterns

#### Pattern A: Divergent Event Descriptions

*Document 1 (Police Report)*: "Incident occurred at approximately 3:00 PM"
*Document 2 (Witness Statement)*: "I called 911 at 2:45 PM, immediately after incident occurred"

**Analysis**: Cannot both be accurate if witness account is contemporaneous.

#### Pattern B: Incompatible Characterizations

*Document 1 (Social Worker Report)*: "Parent was cooperative and engaged throughout assessment"
*Document 2 (Court Report)*: "Parent refused to cooperate with assessment process"

**Analysis**: Cannot both accurately describe same parent interaction (unless describing different occasions, which should be specified).

#### Pattern C: Mutually Exclusive Findings

*Document 1 (Initial Evaluation)*: "No evidence of impairment found"
*Document 2 (Treatment Plan)*: "Based on documented impairment, treatment is recommended"

**Analysis**: Cannot have both no evidence and documented evidence.

### 2.5 Severity Assessment

**Critical**:
- Contradictions about core factual predicates for legal/medical decisions
- Contradictions affecting safety determinations
- Contradictions about events with legal consequences (who was present at alleged incident, whether abuse occurred)

**High**:
- Contradictions about important context (relationships, prior history)
- Contradictions about professional recommendations
- Contradictions affecting credibility assessments

**Medium**:
- Contradictions about secondary facts
- Contradictions about timeline details not central to core issues

**Low**:
- Trivial contradictions about peripheral details
- Obvious transcription errors carried across documents

### 2.6 Illustrative Examples

**Example 1: Family Court Case (Critical Severity)**

*Document A (Investigation Report, May 10)*:
> "Investigation found no evidence supporting allegations of abuse. Children presented as healthy and well-adjusted."

*Document B (Court Petition, May 15)*:
> "Based on substantiated findings of abuse documented in May 10 investigation, emergency removal is requested."

**Analysis**: Critical INTER_DOC - Document B claims Document A substantiated abuse; Document A found no evidence. Core factual predicate contradicted.

**Example 2: Criminal Investigation (High Severity)**

*Document A (Witness Statement, March 5)*:
> "I did not see anyone else at the location. Only the defendant was present."

*Document B (Police Report, March 12)*:
> "Multiple witnesses corroborate the presence of several individuals at the scene."

**Analysis**: High severity - contradiction about witness evidence, affects reliability assessment.

---

## 3. TEMPORAL - Timeline Inconsistency

### 3.1 Formal Definition

**TEMPORAL contradiction** occurs when:
- Claims about timing or sequence are logically impossible, or
- Event *E₁* stated to occur before *E₂*, but *E₂* stated to occur before *E₁*, or
- Document dated time *t₁* describes events at time *t₂* where *t₂* > *t₁* (future events)

### 3.2 Types of Temporal Contradiction

#### Type 3A: Impossible Sequence
Event A must precede Event B (logical necessity), but documents state B preceded A.

**Example**: Report written March 1 claims to describe events on March 15.

#### Type 3B: Contradicting Sequences
Document 1 states *A* → *B* → *C*; Document 2 states *B* → *C* → *A*.

#### Type 3C: Date Contradictions
Same event dated differently in different documents (or same document).

**Example**:
- Document 1: "Incident occurred June 5, 2023"
- Document 2: "Incident occurred August 5, 2023"

#### Type 3D: Duration Contradictions
Incompatible statements about how long something lasted.

**Example**:
- "Two-hour interview"
- "Interview concluded after 15 minutes"

### 3.3 Detection Criteria

**Strong indicators**:
- Document creation date precedes described event date
- Logically impossible sequences (effects before causes)
- Mutually exclusive date claims for same event

**Contextual analysis needed**:
- Different events on different dates (not contradiction)
- Legitimate uncertainty about exact dates (not contradiction if hedged)
- Corrections explicitly noted (not problematic contradiction)

### 3.4 Severity Assessment

**Critical**:
- Timeline impossibilities affecting legal elements (alibis, statute of limitations)
- Impossible sequences affecting causal claims (outcome dated before cause)

**High**:
- Contradictions affecting key event sequence
- Date contradictions for legally significant events

**Medium**:
- Secondary timeline contradictions
- Uncertain dates with conflicting estimates

**Low**:
- Minor timing discrepancies
- Approximation differences ("around 3 PM" vs. "approximately 3:15 PM")

### 3.5 Illustrative Examples

**Example 1: Medical Malpractice (Critical Severity)**

*Document A (Surgery Report, dated March 15, 2023)*:
> "Patient informed of risks during pre-operative consultation on March 20, 2023."

**Analysis**: Critical temporal impossibility - cannot inform patient five days after surgery. Affects informed consent determination.

**Example 2: Investigation Report (High Severity)**

*Document A (Initial Report)*:
> "Officer Johnson responded to call at 14:30. Upon arrival, witness Smith provided statement describing incident occurring at 15:00."

**Analysis**: Witness describes future event. High severity - undermines witness credibility or report accuracy.

**Example 3: Timeline Reconstruction (Medium Severity)**

*Document A*: "Events occurred in sequence: A (10:00), B (10:30), C (11:00)"
*Document B*: "Timeline shows: B (10:15), A (10:45), C (11:00)"

**Analysis**: Contradicting sequences for events A and B. Medium severity if sequence matters for causation analysis.

---

## 4. EVIDENTIARY - Claim-Evidence Mismatch

### 4.1 Formal Definition

**EVIDENTIARY contradiction** occurs when:
- Document asserts conclusion *C*
- Document cites evidence *E* in support of *C*
- *E* does not actually support *C* (insufficient, irrelevant, or contradicting)

### 4.2 Types of Evidence Mismatch

#### Type 4A: Contradicting Evidence
Cited evidence actually contradicts conclusion.

**Example**:
*Conclusion*: "No concerns identified during home visit"
*Cited evidence*: "Home visit revealed inadequate food, broken heating, and children expressing fear"

#### Type 4B: Insufficient Evidence
Evidence cited but insufficient to support conclusion's strength.

**Example**:
*Conclusion*: "Extensive history of violence documented"
*Cited evidence*: Single incident from five years ago

#### Type 4C: Irrelevant Evidence
Evidence cited but not logically relevant to conclusion.

**Example**:
*Conclusion*: "Parent lacks capacity to care for children"
*Cited evidence*: "Parent has tattoos and unconventional lifestyle"

#### Type 4D: Absent Evidence
Conclusion claims evidence that doesn't exist in cited source.

**Example**:
*Conclusion*: "As documented in Dr. Smith's report, patient has history of substance abuse"
*Dr. Smith's report*: Makes no mention of substance use

### 4.3 Detection Criteria

**Requirements**:
1. Explicit or implicit claim that evidence supports conclusion
2. Access to cited evidence
3. Evidence does not support (is insufficient, irrelevant, or contradicting)

**Challenges**:
- Expert conclusions may rest on professional judgment beyond explicit evidence
- Must distinguish between: (a) evidence insufficient vs. (b) conclusion requiring expert interpretation
- Context matters: What counts as "sufficient" varies by domain and stakes

### 4.4 Inferential Gaps

Not all gaps are problematic:
- **Reasonable inferences**: Conclusions that follow logically from evidence with modest assumptions
- **Expert opinions**: Professionals drawing on expertise to interpret evidence
- **Probabilistic conclusions**: Evidence supports "likely" or "consistent with" rather than certainty

**Problematic gaps**:
- **Logical leaps**: Conclusion doesn't follow even with generous assumptions
- **Unsupported certainty**: Definitive conclusion from ambiguous evidence without acknowledging uncertainty
- **Speculation as fact**: Hypothesis presented as established finding

### 4.5 Severity Assessment

**Critical**:
- Core factual findings contradicted by cited evidence
- Legal conclusions (guilt, liability, parental fitness) unsupported by cited evidence
- Safety determinations based on non-existent evidence

**High**:
- Important findings resting on insufficient evidence
- Characterizations contradicted by cited sources
- Expert opinions contradicted by expert's own data

**Medium**:
- Modest inferential overreach (evidence supports "possible," claim states "probable")
- Selective emphasis (evidence mixed, conclusion emphasizes one side)

**Low**:
- Minor inferential gaps
- Conclusions that would be supported by reasonable unstated assumptions

### 4.6 Illustrative Examples

**Example 1: Expert Testimony (Critical Severity)**

*Conclusion in Testimony*:
> "Child exhibits clear indicators of sexual abuse, including sexualized behavior, fear of men, and sleep disturbances."

*Cited Evidence in Expert's Report*:
> "Child played appropriately with dolls. Normal interaction with male evaluator. Parent reports child sleeps well but occasionally has nightmares about monsters."

**Analysis**: Critical EVIDENTIARY - conclusion contradicted by expert's own observations.

**Example 2: Investigation Finding (High Severity)**

*Conclusion*:
> "Investigation confirms pattern of neglect spanning multiple years, as documented by numerous reports."

*Cited Evidence*:
> Two reports over five-year period, both resulting in "services provided, no ongoing concern" determinations.

**Analysis**: High severity - "numerous reports" and "pattern" unsupported by cited evidence.

**Example 3: Character Assessment (Medium Severity)**

*Conclusion*:
> "Witness lacks credibility due to documented history of dishonesty."

*Cited Evidence*:
> Witness was convicted of theft offense seven years ago.

**Analysis**: Medium severity - inferential gap between single old offense and general "history of dishonesty." May or may not be reasonable depending on context.

---

## 5. MODALITY_SHIFT - Unjustified Certainty Change

### 5.1 Formal Definition

**MODALITY_SHIFT** occurs when:
- Document D₁ presents claim with modal qualifier *M₁* (e.g., "possibly," "may have")
- Document D₂ presents same claim with different modal qualifier *M₂* (e.g., "definitely," "did")
- Change represents increased certainty
- No new evidence cited to justify increased certainty

### 5.2 Modal Operators and Epistemic Strength

**Epistemic certainty hierarchy** (strongest to weakest):

1. **Definite**: "X occurred," "X is the case," "X was present"
2. **High confidence**: "X very likely occurred," "strong evidence suggests X"
3. **Probable**: "X probably occurred," "more likely than not"
4. **Possible**: "X may have occurred," "X is possible"
5. **Speculative**: "X might possibly have occurred," "we hypothesize X"
6. **Unknown**: "Unclear whether X," "insufficient information to determine"

**Problematic shifts**: Moving up hierarchy without justification (especially skipping multiple levels).

### 5.3 Types of Modality Shift

#### Type 5A: Speculation to Fact
Hypothesis or possibility becomes definite assertion.

**Example**:
- Document 1: "Neighbor speculated that parents may be using substances"
- Document 2: "Parents' substance abuse documented in prior report"

#### Type 5B: Hedged to Unhedged
Qualified claim becomes unqualified.

**Example**:
- Document 1: "Some indicators suggest possible concern"
- Document 2: "Concern confirmed"

#### Type 5C: Conditional to Categorical
If-then becomes unconditional.

**Example**:
- Document 1: "If additional evidence emerges, X would be indicated"
- Document 2: "X is indicated"

#### Type 5D: Negation Addition/Removal
Adding or removing "not" without justification.

**Example**:
- Document 1: "Unable to rule out X"
- Document 2: "X ruled out"

### 5.4 Detection Criteria

**Requirements**:
1. Same claim (or semantically equivalent) in multiple documents
2. Different modal operators indicating different certainty levels
3. Direction of shift increases certainty
4. No new evidence cited or apparent

**Not problematic**:
- Shift accompanied by explicit new evidence
- Later document explicitly corrects earlier ("initially uncertain, but subsequent investigation confirmed...")
- Shift decreases certainty (increased humility/caution)

### 5.5 Severity Assessment

**Critical**:
- Speculation to definite fact where fact forms basis for major decision
- Removal of "not" changing meaning entirely (abuse uncertain → abuse confirmed)

**High**:
- Substantial certainty increase (possible → definite) affecting important conclusions
- Multiple modality shifts compounding

**Medium**:
- Modest certainty increase (possible → probable)
- Hedging removed from secondary claims

**Low**:
- Minor shifts in epistemic language
- Shifts that don't affect conclusions

### 5.6 Illustrative Examples

**Example 1: Criminal Investigation (Critical Severity)**

*Document A (Initial Report)*:
> "Neighbor thought she might have heard raised voices, but wasn't certain."

*Document B (Affidavit)*:
> "Witness confirmed hearing violent altercation."

**Analysis**: Critical MODALITY_SHIFT - uncertain observation becomes confirmed fact. No new evidence cited. Affects probable cause determination.

**Example 2: Child Protection (High Severity)**

*Document A (Screening Report)*:
> "Reporter speculates that bruising could potentially be from non-accidental injury."

*Document B (Investigation Conclusion)*:
> "Investigation substantiated physical abuse as cause of bruising."

**Analysis**: High severity - speculation became substantiated finding. If investigation conducted physical examination, this may be justified, but if merely repeating speculation with increased certainty, problematic.

**Example 3: Medical Assessment (Medium Severity)**

*Document A (Initial Evaluation)*:
> "Patient may have underlying anxiety disorder."

*Document B (Treatment Plan)*:
> "Patient diagnosed with anxiety disorder."

**Analysis**: Medium severity - if Document B based on formal diagnostic assessment, justified. If merely repeating speculation as diagnosis, problematic MODALITY_SHIFT.

---

## 6. SELECTIVE_CITATION - Cherry-Picked References

### 6.1 Formal Definition

**SELECTIVE_CITATION** occurs when:
- Document cites or quotes source *S*
- Citation/quotation is accurate in isolation but misrepresents *S* through:
  - Omitting contradicting portions
  - Removing crucial context
  - Selecting atypical excerpt
  - Quoting out of temporal sequence

### 6.2 Forms of Selective Citation

#### Type 6A: Contradicting Context Omitted
Quote excerpt supporting position *P* while omitting surrounding text contradicting *P*.

**Example**:
*Cited portion*: "...supports the conclusion of negligence..."
*Full original text*: "While some evidence supports the conclusion of negligence, the preponderance of evidence suggests alternative explanations are more likely."

#### Type 6B: Qualifying Language Removed
Quote removes hedging or qualifying language.

**Example**:
*Cited*: "The child is at risk."
*Original*: "The child may be at risk if current concerning patterns continue without intervention."

#### Type 6C: Question Presented as Statement
Quote excerpts question or hypothesis as if it were assertion.

**Example**:
*Cited*: "Dr. Smith noted the presence of concerning behaviors."
*Original*: "Dr. Smith asked: 'Are there concerning behaviors? Further assessment is needed.'"

#### Type 6D: Minority Position as Consensus
Cites dissenting opinion or minority view without noting its status.

**Example**:
*Cited*: "Research shows X causes Y."
*Original source*: Outlier study contradicted by subsequent research

### 6.3 Detection Criteria

**Requirements**:
1. Ability to access source being cited
2. Comparison of citation to full source
3. Demonstration that selection materially misrepresents source

**Challenges**:
- All citation is selective (cannot quote everything)
- Must distinguish: appropriate summarization vs. misleading selection
- Context-dependent: What constitutes "material" misrepresentation?

**Not problematic**:
- Selective quotation that fairly represents source's overall position
- Omission of irrelevant material
- Summary that captures main points even if details omitted

### 6.4 Severity Assessment

**Critical**:
- Citation reverses source's actual position
- Omission of directly contradicting language
- Misrepresentation of scientific consensus

**High**:
- Significant context omitted changing meaning
- Uncertainty presented as certainty
- Minority view presented as majority

**Medium**:
- Partial representation tilting toward one side
- Selective emphasis within balanced source

**Low**:
- Minor omissions not affecting overall accuracy
- Stylistic simplification

### 6.5 Illustrative Examples

**Example 1: Expert Report Citation (Critical Severity)**

*Citation in Court Brief*:
> "Dr. Brown's evaluation confirms the presence of significant psychiatric impairment requiring immediate intervention."

*Actual Text from Dr. Brown's Report*:
> "While patient presents with some symptoms that could indicate psychiatric concerns, I found no evidence of significant psychiatric impairment. Routine follow-up is recommended, but immediate intervention is not indicated."

**Analysis**: Critical SELECTIVE_CITATION - citation reverses source's actual conclusion.

**Example 2: Research Literature (High Severity)**

*Citation in Policy Document*:
> "Studies demonstrate that X intervention is highly effective (Jones et al., 2020)."

*Jones et al. (2020) Actual Conclusion*:
> "Our pilot study found modest positive effects for X intervention in this small sample. However, methodological limitations and small sample size prevent definitive conclusions. Further research with larger, more diverse samples is needed."

**Analysis**: High severity - presents preliminary, uncertain findings as definitive effectiveness evidence.

**Example 3: Witness Statement (Medium Severity)**

*Citation in Police Report*:
> "Witness stated she saw defendant at the scene."

*Full Witness Statement*:
> "I think I saw someone who might have been the defendant, but I'm not entirely sure. It was dark and I only saw the person briefly from a distance."

**Analysis**: Medium severity - citation omits substantial uncertainty, making identification seem more confident than it was.

---

## 7. SCOPE_SHIFT - Unexplained Generalization

### 7.1 Formal Definition

**SCOPE_SHIFT** occurs when:
- Document D₁ makes claim *C₁* with scope *S₁* (temporal, quantitative, or qualificational)
- Document D₂ makes claim *C₂* with scope *S₂*
- *C₁* and *C₂* are about same subject
- *S₂* > *S₁* (broader scope) or *S₂* < *S₁* (narrower scope)
- No justification or new evidence for scope change

### 7.2 Types of Scope Change

#### Type 7A: Singular to Plural
Single incident becomes pattern or multiple incidents.

**Example**:
- Document 1: "On March 5, parent missed appointment."
- Document 2: "Parent repeatedly failed to attend appointments."

#### Type 7B: Specific to General
Specific instance becomes general characterization.

**Example**:
- Document 1: "Child did not complete homework assignment on Tuesday."
- Document 2: "Child consistently fails to complete academic responsibilities."

#### Type 7C: Temporal Expansion
Limited time frame becomes extended or ongoing.

**Example**:
- Document 1: "During the two-week observation period, X was noted."
- Document 2: "X has been an ongoing concern."

#### Type 7D: Qualifier Removal
Contextual qualifiers removed, broadening applicability.

**Example**:
- Document 1: "In high-stress situations, parent sometimes responds with frustration."
- Document 2: "Parent responds with frustration."

#### Type 7E: Scope Contraction
Broader claim becomes narrower (can also be problematic if erases evidence).

**Example**:
- Document 1: "Multiple witnesses reported concerns."
- Document 2: "One witness expressed concern."

### 7.3 Detection Criteria

**Requirements**:
1. Same subject matter across documents
2. Identifiable scope change (temporal, quantitative, qualificational)
3. Direction matters: Expansion without justification more problematic than contraction
4. No new evidence cited to support broader scope

**Justified scope changes**:
- Later document cites additional instances justifying "pattern" characterization
- Explicit explanation: "Initial report described one incident; subsequent investigation revealed multiple"
- Correction explicitly noted

### 7.4 Severity Assessment

**Critical**:
- Scope expansion dramatically changing legal/factual implications
- Single allegation becomes "pattern" affecting guilt/liability determination
- Contextual qualifiers removed changing meaning (defensive response → aggressive behavior)

**High**:
- Significant scope expansion affecting characterizations
- Temporal expansion creating false impression of ongoing behavior
- Multiple scope shifts compounding

**Medium**:
- Modest scope broadening (one → two instances)
- Scope changes affecting secondary matters

**Low**:
- Minor linguistic variations
- Scope changes not materially affecting conclusions

### 7.5 Illustrative Examples

**Example 1: Termination of Parental Rights (Critical Severity)**

*Document A (Initial Report, March 2023)*:
> "Parent arrived 15 minutes late to scheduled visit on March 10."

*Document B (TPR Petition, August 2023)*:
> "Parent demonstrates chronic pattern of failing to attend visits, showing lack of commitment to reunification."

**Analysis**: Critical SCOPE_SHIFT - single late arrival becomes "chronic pattern of failing to attend." If other missed visits occurred, should be documented. If not, this is severe scope expansion affecting termination decision.

**Example 2: Employment Dispute (High Severity)**

*Document A (Incident Report)*:
> "On June 15, employee sent email to supervisor disagreeing with proposed policy change."

*Document B (Termination Letter)*:
> "Employee has repeatedly demonstrated insubordination and inability to work within organizational structure."

**Analysis**: High severity - single policy disagreement becomes pattern of insubordination.

**Example 3: Medical Assessment (Medium Severity)**

*Document A (Initial Visit)*:
> "Patient reported experiencing headache symptoms over the past week."

*Document B (Specialist Referral)*:
> "Patient presents with chronic headache disorder."

**Analysis**: Medium severity - one-week symptom becomes "chronic." May be justified if "chronic" has specific clinical definition, but if medical error (conflating acute with chronic), problematic.

---

## 8. UNEXPLAINED_CHANGE - Position Reversal

### 8.1 Formal Definition

**UNEXPLAINED_CHANGE** occurs when:
- Institution or document author takes position *P₁* at time *t₁*
- Same institution/author takes position *P₂* at time *t₂*
- *P₂* contradicts or substantially diverges from *P₁*
- No explanation, justification, or acknowledgment of change

### 8.2 Types of Position Change

#### Type 8A: Factual Reversal
Claim about fact changes without new evidence.

**Example**:
- Document 1: "Investigation found no evidence of wrongdoing."
- Document 2: "Investigation confirmed wrongdoing."
- No mention of what changed or why.

#### Type 8B: Recommendation Reversal
Recommendation or plan changes without explanation.

**Example**:
- Document 1: "Recommend family preservation services."
- Document 2: "Recommend immediate removal and termination of rights."
- No explanation for dramatic change in recommendation.

#### Type 8C: Assessment Reversal
Professional assessment or characterization reverses.

**Example**:
- Document 1: "Patient shows good prognosis for recovery."
- Document 2: "Patient's prognosis is poor."
- No new assessment or explanation.

#### Type 8D: Policy Reversal
Institutional policy or position reverses.

**Example**:
- Document 1: "This action complies with all applicable regulations."
- Document 2: "This action violated regulations."
- No explanation of why compliance determination changed.

### 8.3 Detection Criteria

**Requirements**:
1. Clear position/conclusion in earlier document
2. Contradicting or substantially different position in later document
3. Same institution/actor responsible for both
4. No explanation or acknowledgment of change

**Not problematic when**:
- Change explicitly acknowledged and explained
- New evidence cited justifying change
- Correction noted ("Previous report incorrectly stated...")
- Different actors with different information/perspectives

### 8.4 Severity Assessment

**Critical**:
- Reversal affecting legal rights or safety determinations
- Flip-flop on core factual determinations without explanation
- Reversals creating legal jeopardy or loss of rights

**High**:
- Significant assessment changes without justification
- Recommendation reversals with major consequences
- Multiple unexplained changes suggesting unreliability

**Medium**:
- Modest position changes without explanation
- Changes to secondary determinations

**Low**:
- Minor refinements in language
- Changes that could be explained by implicit new information

### 8.5 Illustrative Examples

**Example 1: Custody Determination (Critical Severity)**

*Document A (Initial Custody Evaluation, March 2023)*:
> "Both parents demonstrate adequate parenting capacity. Recommend joint custody with equal parenting time."

*Document B (Updated Custody Report, June 2023)*:
> "Father poses significant risk to children. Recommend no unsupervised contact."

*No intervening documents, no explanation in Document B for changed assessment.*

**Analysis**: Critical UNEXPLAINED_CHANGE - dramatic safety assessment reversal without explanation. Either new evidence exists (should be cited) or initial assessment was wrong (should be acknowledged).

**Example 2: Disability Determination (High Severity)**

*Document A (Initial Evaluation)*:
> "Claimant does not meet disability criteria. Benefits denied."

*Document B (Reconsideration, same medical evidence)*:
> "Claimant meets disability criteria. Benefits approved."

*No new evidence, no explanation of what changed.*

**Analysis**: High severity - factual determination reversed without explanation or new evidence.

**Example 3: Investigation Conclusion (Medium Severity)**

*Document A (Preliminary Report)*:
> "Initial investigation found no policy violations."

*Document B (Final Report)*:
> "Investigation substantiated multiple policy violations."

*Document B does not reference or explain divergence from preliminary conclusion.*

**Analysis**: Medium severity if final report cites specific findings justifying change. High severity if no additional investigation occurred and change is unexplained.

---

## Cross-Cutting Analysis

### Interactions Between Contradiction Types

Contradictions often cluster and interact:

**MODALITY_SHIFT + SCOPE_SHIFT**:
- Possibility becomes certainty (modality shift)
- Single instance becomes pattern (scope shift)
- Combined effect: Weak claim becomes strong through two mutations

**EVIDENTIARY + SELECTIVE_CITATION**:
- Evidence doesn't support conclusion (evidentiary)
- Achieved by cherry-picking from source (selective citation)
- Combined effect: False appearance of evidentiary support

**INTER_DOC + UNEXPLAINED_CHANGE**:
- Documents contradict each other (inter-doc)
- Later document doesn't acknowledge divergence (unexplained change)
- Combined effect: Contradiction masked by silence

### Severity Modifiers

Base severity can be increased by:

**Legal consequences**: Contradictions affecting liberty, parental rights, property

**Safety implications**: Contradictions affecting safety determinations

**Irreversibility**: Contradictions in contexts where harm cannot be undone

**Pattern**: Multiple contradictions of same type suggesting systematic problem

**Concealment**: Active efforts to hide or minimize contradictions

Base severity can be decreased by:

**Good faith correction**: Contradictions caught and corrected promptly

**Explicit uncertainty**: Documents acknowledging limitations and uncertainty

**Minor consequences**: Contradictions not affecting significant outcomes

---

## Conclusion: Taxonomy as Analytical Framework

This taxonomy provides structured vocabulary for identifying and classifying inconsistencies in institutional documents. The eight types are not exhaustive - institutional documents can fail in other ways - but they capture the most common and consequential patterns.

Key principles:

1. **Contradiction is spectrum**: From obvious logical impossibility to subtle scope shift
2. **Context determines severity**: Same contradiction can be critical or trivial depending on consequences
3. **Multiple contradictions compound**: Pattern of contradictions indicates systematic problem
4. **Detection requires access**: Must have complete documents to identify contradictions
5. **Human judgment essential**: Algorithmic detection can flag potential contradictions, but human judgment required to assess significance

The taxonomy serves both descriptive and normative functions:
- **Descriptive**: Categorizes what contradictions exist
- **Normative**: Implies what institutional documents should avoid

High-quality institutional documents would exhibit:
- Internal consistency (no SELF)
- Cross-document consistency or explicit explanation of divergence (no INTER_DOC)
- Temporal coherence (no TEMPORAL)
- Evidence-conclusion alignment (no EVIDENTIARY)
- Stable certainty levels or justified changes (no MODALITY_SHIFT)
- Fair citation practices (no SELECTIVE_CITATION)
- Consistent scope or justified expansions (no SCOPE_SHIFT)
- Position stability or explained revisions (no UNEXPLAINED_CHANGE)

The taxonomy thus provides both diagnostic tool for analyzing existing documents and aspirational standard for document quality.

---

## References

Aristotle. *Organon* (Prior Analytics, Posterior Analytics). [Classical logic foundation]

Toulmin, S. E. (1958). *The Uses of Argument*. Cambridge University Press. [Argumentation theory]

Walton, D. (1996). *Argumentation Schemes for Presumptive Reasoning*. Lawrence Erlbaum Associates. [Informal fallacies]

van Eemeren, F. H., & Grootendorst, R. (2004). *A Systematic Theory of Argumentation: The pragma-dialectical approach*. Cambridge University Press. [Discourse analysis]

Perelman, C., & Olbrechts-Tyteca, L. (1969). *The New Rhetoric: A Treatise on Argumentation*. University of Notre Dame Press. [Rhetorical analysis]

Fisher, A. (2004). *The Logic of Real Arguments* (2nd ed.). Cambridge University Press. [Applied logic]

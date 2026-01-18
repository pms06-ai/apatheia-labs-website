# Cascade Theory: How False Premises Propagate Through Institutional Systems

## Introduction: The Cascade Metaphor

The term "cascade" evokes a waterfall - water flowing over multiple tiers, each feeding the next, gaining momentum and volume as it descends. In institutional systems, false premises exhibit similar dynamics:

1. **Origin point**: A claim enters the record (the source)
2. **Propagation**: The claim flows to other documents and institutions (the descent)
3. **Accumulation**: The claim gains authority through repetition (growing volume)
4. **Outcome**: The now-authoritative claim produces consequences (the impact)

Unlike a waterfall, where water's nature remains constant, institutional cascades exhibit **mutations**: The claim changes subtly at each stage, typically becoming more certain, more general, and more consequential.

This document presents the formal theory of institutional cascades, the mechanisms driving propagation, the conditions enabling versus preventing cascades, and the implications for institutional design and accountability.

---

## 1. The Four-Phase Cascade Model

### 1.1 Phase Definitions

#### ANCHOR: The Origin Point

**Definition**: The phase where a claim first enters the institutional record.

**Key questions**:
- What evidential basis existed at origin?
- What certainty level was appropriate given evidence?
- How was the claim originally framed (fact, opinion, speculation)?
- Who originated the claim, and what was their access to evidence?

**Origin types** (epistemic quality spectrum):
- **Primary source** (highest quality): Direct observation, contemporaneous documentation, physical evidence
- **Professional opinion** (high quality): Expert assessment based on examination/evidence
- **Hearsay** (medium quality): Report of what another observed/said
- **Speculation** (low quality): Inference without direct evidential grounding
- **Misattribution** (very low quality): Claim attributed to wrong source
- **Fabrication** (no quality): No traceable evidential basis

**ANCHOR phase hypothesis**: Most institutional failures stem from poor-quality origins that are not acknowledged as such. A claim entered as speculation but not marked as speculative becomes indistinguishable from established fact in subsequent documents.

#### INHERIT: Propagation Without Verification

**Definition**: The phase where claims propagate from origin to subsequent documents, typically without independent verification.

**Key mechanisms**:
- **Verbatim copying**: Exact reproduction (preserves original but may propagate errors)
- **Paraphrase**: Semantic preservation with lexical changes (risk of mutation)
- **Citation**: Reference to source document (transfers authority of source)
- **Implicit adoption**: Treating claim as fact without attribution (obscures origin)
- **Circular reference**: Mutual citation loops (creates false appearance of multiple sources)

**Verification status**:
- **Verified**: Recipient independently examines evidence, confirms claim
- **Partially verified**: Recipient checks some aspects but not all
- **Unverified assumed**: Recipient assumes sender verified (deference)
- **Unverified intentional**: Recipient knows claim unverified but repeats anyway

**INHERIT phase hypothesis**: Institutional structures incentivize *assuming* verification occurred elsewhere rather than conducting independent verification. Reasons:
- Time/resource constraints
- Authority deference (trust in sending institution's competence)
- Liability aversion (challenging claims creates friction)
- Organizational culture (questioning seen as uncooperative)

#### COMPOUND: Authority Accumulation

**Definition**: The phase where repeated institutional endorsements cause claims to accumulate authority independent of evidential quality.

**Authority sources**:
- **Positional authority**: Judge, doctor, licensed professional (credentials)
- **Institutional authority**: Court, regulatory agency, professional body (organization)
- **Repetition-based authority**: Multiple documents assert claim (frequency)
- **Consensus authority**: Multiple professionals agree (corroboration)

**Authority laundering** (core phenomenon):

A weakly-founded claim gains spurious authority through institutional processing:

```
Low authority origin (speculation)
  → Medium authority adoption (professional assessment)
  → High authority endorsement (official report)
  → Highest authority determination (court finding)
```

At each step:
- Institutional actor may reasonably assume prior actors verified
- Each repetition adds authority weight
- Origin's poor evidential quality is forgotten
- Final determination has high authority despite weak foundation

**COMPOUND phase hypothesis**: Authority accumulates **multiplicatively** (each endorsement amplifies prior authority) rather than additively, creating non-linear authority growth. A claim endorsed by court carries vastly more weight than same claim in initial report, even if court merely deferred to report without independent assessment.

#### ARRIVE: Outcome Causation

**Definition**: The phase where authority-laden false premises contribute to harmful outcomes.

**Outcome types**:
- **Legal**: Court orders (removal, incarceration, termination of rights)
- **Administrative**: Agency decisions (benefit denial, license revocation)
- **Clinical**: Medical decisions (diagnosis, treatment, commitment)
- **Reputational**: Media characterizations, professional sanctions

**Causation analysis**:
- **But-for causation**: Would outcome have occurred without false premise?
- **Substantial factor**: Did false premise materially contribute even if not necessary?
- **Chain analysis**: Tracing premise → propagation → authority → outcome
- **Multiple causation**: When multiple false premises jointly support outcome

**Harm assessment**:
- **Catastrophic**: Irreversible, life-destroying (wrongful execution, permanent separation)
- **Severe**: Major, long-lasting (wrongful incarceration, chronic medical harm)
- **Moderate**: Substantial but potentially remedied (temporary custody loss, incorrect treatment)
- **Minor**: Limited duration and scope (procedural delays, minor errors)

**ARRIVE phase hypothesis**: Institutional systems lack effective feedback from outcomes to origins. When harmful outcomes occur, attention focuses on proximate causes (final decision) rather than ultimate causes (poor-quality origin). This breaks the learning loop that would improve origin quality.

### 1.2 Phase Interactions and Feedbacks

**Forward cascades** (origin → outcome):
- Poor origin quality → unverified propagation → spurious authority → harmful outcome

**Backward loops** (that should exist but often don't):
- Harmful outcome → investigation → origin quality assessment → procedural reforms
- Authority laundering detection → institutional learning → verification requirements

**Amplifying factors** (accelerate cascades):
- Time pressure (faster propagation, less verification)
- Institutional complexity (more handoffs, more opportunities for unverified adoption)
- Authority gradients (steep hierarchies increase deference)
- Liability cultures (defensive documentation, avoiding challenges)

**Dampening factors** (slow or prevent cascades):
- Verification requirements at institutional boundaries
- Adversarial challenge (defense attorneys, patient advocates, appeals)
- Transparency (accessible records enable external review)
- Accountability (consequences for propagating unverified claims)

---

## 2. Mechanisms of Propagation

### 2.1 Structural Mechanisms

#### Organizational Silos

Modern institutions operate in specialized silos with limited communication:
- Police → Social Services → Court → Foster Care
- Primary Care → Specialist → Hospital → Rehabilitation
- Investigation → Prosecution → Trial → Sentencing

**Cascade acceleration at boundaries**:
- Each silo has specialized expertise in its domain but limited expertise in others
- Receiving silo assumes sending silo competent in its domain
- Verification would require crossing expertise boundaries (costly, difficult)
- Result: Claims propagate across boundaries with minimal verification

**Example**: Police report contains speculation about mental health. Social worker reads police report, assumes police assessment is reliable, adopts claim. Psychologist reads social worker's report, assumes social worker verified, adopts claim. Court reads psychologist's report, assumes clinical assessment, relies on claim. At no point did anyone with mental health expertise directly assess the individual - claim propagated through deference chain.

#### Information Asymmetry

**Structural asymmetry**: Institutional actors have access to documents but not to original evidence.

When social worker reads police report, social worker sees:
- What police wrote
- NOT: What police observed
- NOT: What evidence exists
- NOT: What police omitted

This asymmetry enables cascades because:
- Recipient cannot independently verify claims
- Recipient must trust sender's characterization
- Sender's framing shapes recipient's understanding
- Original evidence becomes inaccessible over time

**Temporal dimension**: As time passes, access to original evidence degrades:
- Witnesses' memories fade
- Physical evidence degrades or is lost
- Participants become unavailable
- Documents become canonical - what's written replaces what happened

#### Procedural Entrenchment

Institutional procedures create path dependencies:

1. **Initial determination**: First formal determination has special status
2. **Burden of proof**: Challenging initial determination requires showing error
3. **Finality**: Decisions reach points where further review is unavailable
4. **Res judicata**: Legal doctrines prevent re-litigating settled matters

These doctrines serve legitimate purposes (efficiency, stability, preventing endless re-litigation) but also entrench errors. Once claim is formally determined, overturning requires meeting high burden even if determination rested on poor-quality origin.

### 2.2 Cognitive Mechanisms

#### Confirmation Bias in Documentation

**Initial framing effect**: First document that frames an issue shapes subsequent documents.

If initial report characterizes situation as "child abuse," subsequent documents:
- Seek and record information consistent with abuse frame
- Discount or omit information inconsistent with abuse frame
- Interpret ambiguous information as supporting abuse frame

**Selective attention**: Once narrative is established, actors notice and document information fitting narrative while overlooking contradicting information.

**Narrative coherence**: Human minds seek coherent stories. Contradictions create cognitive dissonance. Institutional actors unconsciously smooth contradictions to maintain narrative coherence.

#### Authority Heuristic

**Mental shortcut**: When lacking expertise or time, defer to authority.

This is often reasonable:
- Non-expert *should* defer to genuine expert
- Efficiency requires trusting some sources

But institutional cascades exploit this heuristic:
- Authority (credentials, position) substitutes for evidence quality
- "Expert said X" treated as evidence for X rather than claim requiring scrutiny
- Chain of authority: A trusts B trusts C trusts D, but no one verified

**Credibility transfer**: Source credibility in one domain transfers to other domains.
- Dr. X is respected physician → Dr. X's opinion about non-medical matters treated as authoritative
- Agency A is competent in Domain 1 → Agency A's claims about Domain 2 trusted

#### Anchoring Bias

**First number becomes anchor**: Initial assessments disproportionately influence subsequent assessments.

In institutional cascades:
- First document's characterization becomes anchor
- Later documents adjust from anchor rather than independent assessment
- Even if later documents "correct," they don't fully escape anchor's influence

**Example**: Initial report estimates harm severity as 7/10. Subsequent reports assess as 6/10 or 8/10 (adjusting from anchor) rather than independently determining could be 2/10 or 9/10.

### 2.3 Social Mechanisms

#### Conformity Pressure

**Asch experiments**: People conform to group judgments even when obviously wrong.

Institutional conformity:
- When multiple documents assert claim, challenging requires going against consensus
- Lone dissenter faces social costs (reputation as difficult, uncooperative, overly cautious)
- Conforming is safer - if everyone agrees and outcome is bad, no individual blamed; if you dissent and outcome is bad, you're blamed

**Professional socialization**: Training emphasizes trusting institutional processes and colleagues. Questioning institutional determinations goes against professional norms.

#### Groupthink

**Irving Janis**: Groups seeking consensus suppress dissent and fail to consider alternatives.

Institutional groupthink:
- Case conferences seek consensus on case plan
- Dissenting opinions seen as unhelpful, slowing process
- Shared assumptions not questioned
- Illusion of unanimity (silence taken as agreement)

**Cascade acceleration**: When teams rather than individuals review claims, conformity pressure prevents verification. No single person responsible for independent check.

#### Reputation and Face-Saving

**Organizational self-interest**: Admitting error damages institutional reputation.

Once institution has publicly taken position:
- Reversing position suggests initial incompetence
- Maintaining position preserves face
- New evidence is minimized or reframed to fit established position
- "Doubling down" - defending position more strongly when challenged

This creates **error persistence**: Once false premise is officially adopted, organizational incentives favor maintaining it despite contradicting evidence.

---

## 3. Mutation Dynamics

### 3.1 Types of Mutation

Claims don't propagate unchanged. They mutate during propagation. Common mutation types:

#### Amplification

**Definition**: Strength of claim increases without corresponding evidence increase.

**Mechanisms**:
- Hedging language removed: "possibly" → "probably" → omitted entirely
- Qualifiers dropped: "on one occasion" → "sometimes" → "regularly"
- Uncertainty becomes certainty: "may have occurred" → "occurred"

**Example cascade**:
- Document 1: "Neighbor reported hearing what might have been shouting"
- Document 2: "Neighbor reported hearing shouting"
- Document 3: "Witness confirmed verbal altercation"
- Document 4: "Verbal altercation documented by witness statement"

Each step: small mutation, cumulatively major amplification.

#### Attenuation

**Definition**: Specificity decreases, precision lost.

**Mechanisms**:
- Specific details become vague: "stated X on March 5" → "stated X"
- Qualifications removed: "according to one source" → unmarked assertion
- Context stripped: "in high-stress situation" → context omitted

**Effects**:
- Original context forgotten
- Claim becomes decontextualized "fact"
- Scope expands beyond original bounds

#### Certainty Drift

**Definition**: Epistemic confidence increases over time without new evidence.

**Mechanism**: Repetition creates familiarity; familiarity is mistaken for truth.

**Psychological basis**:
- Mere exposure effect: Repeated exposure increases positive evaluation
- Availability heuristic: Easily recalled information judged as more likely true
- Social proof: Multiple repetitions suggest multiple sources (even if same origin)

**Institutional manifestation**:
- First document: "Possible X"
- After several repetitions: "As previously documented, X"
- No new evidence, but claim now treated as established fact

#### Attribution Shift

**Definition**: Source or responsibility attribution changes during propagation.

**Examples**:
- Active → passive voice: "Officer assumed X" → "X was believed"
- Direct → indirect: "Witness said she saw Y" → "Y was observed"
- Personal → institutional: "Dr. Smith speculated Z" → "Evaluation found Z"

**Effect**: Makes claims seem more objective, less tied to potentially fallible individuals.

#### Scope Expansion

**Definition**: Claim's applicability broadens.

**Examples**:
- Temporal: "During one visit" → "During visits" → "Consistently"
- Quantitative: "One instance" → "Several instances" → "Pattern"
- Generality: "In this specific context" → "Generally"

**Cascade effect**: Each document slightly broadens scope. Cumulative effect: narrow observation becomes sweeping characterization.

### 3.2 Mutation Mechanisms

**Linguistic compression**: Documents summarize prior documents, losing nuance.

**Template effects**: Standard forms with checkboxes force continuous phenomena into discrete categories.

**Audience adaptation**: Documents written for different audiences (technical vs. legal vs. lay) translate claims across registers, introducing mutations.

**Memory effects**: When writers recall prior documents rather than directly quoting, memory distortions introduce mutations.

**Intentional shaping**: Some mutations are deliberate - strengthening claims to support desired conclusions.

### 3.3 Compound Mutations

**Synergy**: Multiple mutation types interact:
- Amplification + Scope Expansion: "Possibly happened once" → "Pattern of behavior"
- Certainty Drift + Attribution Shift: "I think X" → "X has been documented"
- Attenuation + Scope Expansion: Specific context stripped, claim generalized

**Non-linear effects**: Small mutations at each stage produce large cumulative distortion.

---

## 4. Institutional Boundary Effects

### 4.1 Why Boundaries Accelerate Cascades

**Institutional boundaries** (transfer from one agency/actor to another) are critical cascade points:

#### Expertise Gaps

Each institution has domain expertise. At boundaries:
- Receiving institution lacks expertise to evaluate sending institution's claims
- Must rely on trust rather than verification
- Cannot meaningfully challenge without crossing expertise boundaries

**Example**: Court receives social worker's assessment. Judge lacks social work expertise, cannot evaluate quality of assessment, defers to professional's judgment.

#### Information Loss

Documents crossing boundaries:
- Summarize rather than fully represent evidence
- Omit process details (how assessment conducted)
- Strip uncertainty (hedging doesn't translate well across contexts)

**Example**: Multi-page clinical evaluation → one-page summary for court → single sentence in court order → citation in subsequent case

#### Liability Shielding

Institutional boundaries create liability buffers:
- Each institution responsible only for its own work
- Can claim "relied on other institution's expertise"
- Diffused responsibility: No single actor has end-to-end accountability

**Example**: No one verifies false premise because:
- Police: "We reported what we observed"
- Social worker: "We relied on police report"
- Court: "We deferred to social worker's professional judgment"
- Each technically defensible, but system-level failure.

### 4.2 Cross-Institutional Dynamics

#### Institutional Isomorphism

Organizations mimic each other. If Institution A characterizes situation as X, Institution B is likely to adopt X characterization because:
- **Mimetic isomorphism**: Copying perceived successful practices
- **Normative isomorphism**: Professional training creates shared frameworks
- **Coercive isomorphism**: Legal/regulatory pressure to align

**Cascade effect**: Uniform characterization across institutions creates false appearance of independent corroboration.

#### Mutual Reinforcement

Institutions in same case influence each other:
- Agency A's characterization influences Agency B
- Agency B's adoption influences Agency C
- Agency C's endorsement feeds back to Agency A, reinforcing original

**Positive feedback loop**: Each institution's adoption strengthens others' confidence. System-wide consensus emerges from mutual reinforcement, not from independent evidence.

#### Authority Gradients

Some institutions have higher authority than others:
- Court > Agency > Individual
- Licensed professional > Line staff > Lay person
- Official report > Informal documentation

Claims flowing "uphill" (low to high authority):
- Gain authority through institutional endorsement
- Lose nuance/uncertainty (higher authority contexts less tolerant of ambiguity)
- Become harder to challenge (challenging high-authority claim is costly)

---

## 5. Enabling vs. Preventing Conditions

### 5.1 Conditions Enabling Cascades

**Systemic factors** that facilitate false premise propagation:

#### Opacity

**Definition**: Lack of transparency about evidence basis, reasoning process, and uncertainties.

When documents:
- Don't cite specific evidence
- Don't explain reasoning from evidence to conclusion
- Don't acknowledge limitations/uncertainties
- Don't flag speculations as such

Result: Recipients cannot assess quality, must accept or reject wholesale.

#### Asymmetric Resources

**Definition**: Unequal resources between institutional actors and individuals subject to decisions.

Institutions have:
- Time to prepare documents
- Legal expertise
- Access to experts
- Procedural knowledge

Individuals have:
- Limited time/resources
- No legal expertise
- No access to contrary experts
- Procedural barriers to participation

Result: Institutional claims go unchallenged not because they're strong but because challenging is prohibitively costly.

#### Time Pressure

**Definition**: Institutional timelines requiring fast decisions.

When decisions must be made quickly:
- No time for thorough verification
- Deference to prior determinations (efficiency)
- Errors get locked in before correction possible

Result: Speed favors propagation over verification.

#### Defensive Practice

**Definition**: Liability-driven documentation focuses on justifying decisions rather than accurately representing uncertainties.

When institutions fear legal liability:
- Documents written for legal defense, not truth
- Hedging avoided (appears weak)
- Uncertainties minimized (creates vulnerability)
- Consensus emphasized (safety in numbers)

Result: Documents systematically overstate certainty and minimize weaknesses.

#### Weak Accountability

**Definition**: Lack of consequences for propagating unverified claims.

When institutional actors face:
- No consequences for accepting false claims
- Consequences for challenging (friction, delay, appearing uncooperative)
- Rewards for efficiency (processing cases quickly)

Result: Rational actors propagate claims without verification.

### 5.2 Conditions Preventing Cascades

**Systemic factors** that block or slow false premise propagation:

#### Transparency Requirements

**Mechanism**: Require documents to show their work.

Effective transparency:
- Cite specific evidence for each claim
- Explain reasoning from evidence to conclusion
- Acknowledge uncertainties and limitations
- Distinguish observation from inference

Result: Recipients can evaluate quality, weak claims are identified.

#### Adversarial Challenge

**Mechanism**: Institutionalize systematic skepticism.

Effective adversarial processes:
- Well-resourced opposing parties
- Access to independent experts
- Meaningful discovery (access to underlying evidence)
- Procedural rights to challenge

Result: Weak claims are tested and fail; strong claims survive and gain credibility through surviving challenge.

#### Verification Requirements

**Mechanism**: Mandate independent verification at key points.

Effective verification:
- Receiving institution cannot merely defer to sending institution
- Must conduct independent assessment of evidence
- Must document verification process
- Accountability for verification failures

Result: Propagation slowed, errors caught before accumulating authority.

#### Error Detection Systems

**Mechanism**: Systematic review for inconsistencies and quality problems.

Effective detection:
- Regular audits of document chains
- Automated contradiction detection
- Peer review processes
- External oversight bodies

Result: Errors identified and corrected before causing harm.

#### Strong Accountability

**Mechanism**: Consequences for quality failures.

Effective accountability:
- Track outcomes back to origins
- Identify individual/institutional contributions to failures
- Meaningful consequences (not just "more training")
- Protections for whistleblowers who identify problems

Result: Institutional actors have incentives to verify before propagating.

---

## 6. Cascade Dynamics: Mathematical Models

### 6.1 Authority Accumulation Model

**Simple additive model**:
```
A(c) = Σᵢ wᵢ
```
Where:
- A(c) = cumulative authority of claim c
- wᵢ = authority weight of institution i endorsing c
- Σᵢ = sum over all endorsing institutions

**Problem**: Doesn't capture non-linear effects of high-authority endorsements.

**Multiplicative model**:
```
A(c) = ∏ᵢ (1 + αwᵢ)
```
Where:
- α = amplification factor
- Product captures non-linear growth

**Observations**:
- Authority grows faster than linearly with endorsements
- High-authority endorsements (large wᵢ) disproportionately increase A(c)
- Early high-authority endorsements create path dependency

### 6.2 Mutation Rate Model

**Mutation accumulation**:
```
m(c, n) = m₀ + δn
```
Where:
- m(c, n) = distortion of claim c after n propagations
- m₀ = initial distortion (origin quality)
- δ = per-propagation mutation rate
- n = number of propagations

**Non-linear alternative**:
```
m(c, n) = m₀eᵟⁿ
```
Exponential growth captures compounding distortions.

**Factors affecting δ**:
- Document quality (high quality = lower δ)
- Institutional boundary crossings (boundaries increase δ)
- Time pressure (faster = higher δ)
- Transparency (low transparency = higher δ)

### 6.3 Cascade Probability Model

**Probability claim propagates**:
```
P(prop) = f(A(c), E(c), R)
```
Where:
- P(prop) = probability claim is adopted by next institution
- A(c) = authority of claim
- E(c) = evidential quality
- R = resources for verification

**Hypothesis**: P(prop) increases with A(c), decreases with resources R for verification.

When R is low (time pressure, limited resources):
- P(prop) ≈ 1 for high A(c), regardless of E(c)
- Authority substitutes for evidence

When R is high (adequate verification resources):
- P(prop) depends more on E(c) than A(c)
- Evidence quality matters

---

## 7. Case Studies: Cascade Analysis

### 7.1 Wrongful Conviction Cascade

**Origin** (ANCHOR):
- Witness makes uncertain identification: "I think it might have been him"
- Police report: "Witness identified suspect"
- **Mutation**: Uncertainty → certainty

**Propagation** (INHERIT):
- Prosecutor's charging document: "Eyewitness identified defendant"
- Defense lacks resources for expert on identification reliability
- No independent verification of identification procedures
- **Unverified adoption** across criminal justice system

**Authority Accumulation** (COMPOUND):
- Trial: Jury convicts based on eyewitness testimony
- Conviction = highest authority determination
- Appeals defer to jury's factual findings
- **Authority laundering**: Uncertain identification → jury verdict

**Outcome** (ARRIVE):
- Decades of wrongful imprisonment
- Later DNA evidence proves innocence
- **But-for causation**: Without false identification, no conviction

**Cascade analysis**:
- Poor origin quality (uncertain identification not marked as such)
- No verification at any stage
- Authority accumulated despite weak foundation
- System-level failure despite no individual malfeasance

### 7.2 Child Welfare Cascade

**Origin** (ANCHOR):
- Mandated reporter: "I'm concerned about possible neglect"
- Initial report: "Report of neglect"
- **Mutation**: "Concerned about possible" → "report of"

**Propagation** (INHERIT):
- Social worker assessment based on report, not independent observation
- Assessment: "Neglect concerns substantiated"
- Family court petition: "Substantiated neglect"
- **Unverified adoption**: Each stage assumes prior stage verified

**Authority Accumulation** (COMPOUND):
- Court order for removal based on "substantiated neglect"
- Guardian ad litem report cites court order as basis for continuing removal
- **Authority laundering**: Speculation → legal finding

**Outcome** (ARRIVE):
- Child removed, placed in foster care where actual abuse occurs
- Original concern unverified
- **Harm**: Child suffered actual harm that wouldn't have occurred but for removal

**Cascade analysis**:
- Origin: legitimate concern, but marked as "possible" not fact
- Propagation: "possible" became "substantiated" without verification
- Authority: judicial endorsement despite weak foundation
- Outcome: intervention caused harm it was meant to prevent

### 7.3 Medical Diagnosis Cascade

**Origin** (ANCHOR):
- Primary care: "Rule out condition X" (differential diagnosis)
- Medical record: "Working diagnosis: X"
- **Mutation**: Hypothesis → diagnosis

**Propagation** (INHERIT):
- Specialist sees "diagnosis: X" in record, assumes confirmed
- Treatment plan based on X
- Complications attributed to X rather than to treatment
- **Unverified adoption**: Specialists defer to prior diagnosis

**Authority Accumulation** (COMPOUND):
- Multiple specialists document X in problem list
- Disability determination cites "documented condition X"
- **Authority laundering**: Hypothesis → medical consensus

**Outcome** (ARRIVE):
- Incorrect treatment causes iatrogenic harm
- Actual condition undiagnosed and untreated
- **Harm**: Permanent disability from unnecessary treatment

**Cascade analysis**:
- Origin: Appropriate hypothesis entered improperly as diagnosis
- Propagation: Each provider assumed prior provider confirmed
- Authority: Medical consensus emerged without any confirmatory testing
- Outcome: Treatment based on false diagnosis caused preventable harm

---

## 8. Implications for Institutional Design

### 8.1 Design Principles to Prevent Cascades

#### Principle 1: Explicit Uncertainty

**Rule**: Claims must carry uncertainty markers commensurate with evidence quality.

**Implementation**:
- Required fields for evidence quality (0-100% scale)
- Explicit tagging: [Verified], [Hearsay], [Speculation], [Hypothesis]
- Uncertainty propagates with claims (don't strip hedging)

**Effect**: Makes evidential weakness visible, preventing false certainty.

#### Principle 2: Mandatory Verification Points

**Rule**: Independent verification required at critical decision points.

**Implementation**:
- Before crossing institutional boundaries
- Before major decisions (removal, incarceration, major treatment)
- Verification must be documented (what evidence reviewed, what confirmed)
- Cannot merely cite prior determination

**Effect**: Breaks propagation chains, catches errors before accumulating authority.

#### Principle 3: Provenance Tracking

**Rule**: Every claim must be traceable to evidential origin.

**Implementation**:
- Citation to specific evidence (page, document, observation)
- Chain of custody: Track claim through all documents
- Automated tools to maintain provenance links
- When claim mutates, flag divergence from origin

**Effect**: Enables checking claims against original evidence, detecting mutations.

#### Principle 4: Adversarial Safeguards

**Rule**: Meaningful challenge must be possible and resourced.

**Implementation**:
- Right to independent expert
- Access to underlying evidence (not just summaries)
- Resources for opposition (counsel, investigation)
- Burden on institution to prove, not on individual to disprove

**Effect**: Weak claims are challenged and fail; system produces more accurate determinations.

#### Principle 5: Error Detection and Correction

**Rule**: Systematic review for errors, with mechanisms for correction.

**Implementation**:
- Regular audits of document chains
- External oversight bodies
- Innocence projects, ombudsmen
- When errors found, trace back to origin, identify system failures

**Effect**: Learning loops improve system over time.

### 8.2 Resistance to Reform

Why are these principles not already implemented?

**Efficiency costs**: Verification takes time and resources. Organizations optimized for throughput resist slowdowns.

**Liability concerns**: Making uncertainty explicit feels risky (appears weak, creates litigation vulnerability).

**Professional autonomy**: Requirements feel like questioning professional judgment, generate resistance.

**Institutional inertia**: Existing processes are entrenched, changing requires overcoming bureaucratic momentum.

**Lack of political will**: Reforms come after crises, but crises are (individually) rare enough that urgency fades.

**Resource constraints**: Verification and adversarial safeguards cost money; institutions are resource-constrained.

### 8.3 Reform Strategies

**Pilot programs**: Implement principles in limited contexts, demonstrate effectiveness.

**Technology**: Automate provenance tracking, contradiction detection (reduce manual burden).

**Professional education**: Train institutional actors in epistemic responsibility, cascade dynamics.

**Transparency**: Public reporting of error rates, cascade detections (create pressure for improvement).

**Legal reform**: Mandate verification requirements, admissibility standards.

**Liability reallocation**: Create consequences for cascade failures, not just for visible errors.

---

## 9. Conclusion: Toward Cascade-Resistant Institutions

Institutional cascades are not aberrations but predictable consequences of how institutions are designed. When:
- Documents are opaque about evidence and uncertainty
- Verification is costly and challenging is risky
- Authority substitutes for evidence
- Boundaries enable unverified propagation
- Accountability is weak or absent

False premises will propagate, accumulate spurious authority, and cause preventable harm.

The cascade model provides both:
- **Diagnostic tool**: Trace existing failures back through cascade phases
- **Design framework**: Build institutions resistant to cascades

Cascade-resistant institutions would:
- **Anchor carefully**: Ensure high origin quality, mark uncertainty
- **Verify during propagation**: Require independent checks, don't just defer
- **Grant authority based on evidence**: Distinguish institutional position from evidential quality
- **Link outcomes to origins**: When harm occurs, trace back to source failures and learn

Such institutions would be slower, more costly in immediate resource terms, but faster and cheaper in avoiding costly errors. The efficiency of cascade-prone institutions is false efficiency - speed bought by deferring verification creates downstream costs of correcting failures, compensating victims, and maintaining systems that systematically err.

True institutional efficiency would optimize for accuracy, not just throughput. The cascade model shows why accuracy requires structural features that prevent propagation of poor-quality claims. These features are not luxury add-ons but essential components of responsible institutional design.

---

## References

Bikhchandani, S., Hirshleifer, D., & Welch, I. (1992). A theory of fads, fashion, custom, and cultural change as informational cascades. *Journal of Political Economy*, 100(5), 992-1026.

Perrow, C. (1984). *Normal Accidents: Living with High-Risk Technologies*. Basic Books.

Reason, J. (1990). *Human Error*. Cambridge University Press.

Sunstein, C. R. (2009). *Going to Extremes: How Like Minds Unite and Divide*. Oxford University Press.

Vaughan, D. (1996). *The Challenger Launch Decision: Risky Technology, Culture, and Deviance at NASA*. University of Chicago Press.

Weick, K. E., & Sutcliffe, K. M. (2007). *Managing the Unexpected: Resilient Performance in an Age of Uncertainty* (2nd ed.). Jossey-Bass.

Woods, D. D., Dekker, S., Cook, R., Johannesen, L., & Sarter, N. (2010). *Behind Human Error* (2nd ed.). Ashgate.

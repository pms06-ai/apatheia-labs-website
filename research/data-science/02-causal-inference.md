---
title: Causal Inference Methods
description: From correlation to causation - rigorous methods for establishing causal relationships in forensic analysis, including DAGs, counterfactuals, and observational study designs.
category: Data Science
status: complete
date: 2026-01-18
tags:
  - causation
  - statistics
  - methodology
  - dag
---

# Causal Inference Methods

When an institutional document concludes that a parent's behaviour "caused" a child's distress, or that a professional's decision "resulted in" harm, it makes a causal claim. These claims carry immense weight: they justify interventions, determine liability, and shape futures. Yet the methods by which institutions arrive at causal conclusions often fail to distinguish genuine causation from mere correlation.

This article introduces the formal methods of causal inference---the statistical and philosophical tools that distinguish "X happened before Y" from "X caused Y." Understanding these methods is essential for forensic document analysis, where institutional claims of causation must be evaluated against rigorous evidential standards rather than accepted at face value.

---

## Related Research

- **[Statistical Methods for Bias Detection](01-statistical-detection.md)** - Quantitative approaches to detecting systematic bias, including significance testing and effect sizes
- **[Cascade Theory](../foundations/cascade-theory.md)** - How false premises propagate through institutional systems, often misattributed as causal chains
- **[Epistemology of Evidence](../philosophy/01-epistemology-of-evidence.md)** - Philosophical foundations of evidential reasoning and justified belief
- **[Cognitive Biases in Document Analysis](../cognitive-science/01-cognitive-biases.md)** - How confirmation bias and other cognitive errors distort causal reasoning

---

## 1. The Correlation-Causation Distinction

The maxim "correlation does not imply causation" is familiar to the point of cliche. Yet institutional documents routinely violate this principle, treating statistical associations as causal relationships without adequate justification.

### 1.1 What Correlation Measures

Correlation quantifies the degree to which two variables move together. When variable X increases, does variable Y tend to increase (positive correlation), decrease (negative correlation), or show no systematic pattern (zero correlation)?

Mathematically, the Pearson correlation coefficient r ranges from -1 to +1:

```
r = Cov(X,Y) / (SD(X) * SD(Y))
```

A correlation of r = 0.7 indicates a strong positive association. But it says nothing about why X and Y move together.

**Three possible explanations for correlation**:

1. **X causes Y**: Increased contact time causes improved child wellbeing
2. **Y causes X**: Improved child wellbeing causes more contact time (child is more willing to engage)
3. **Z causes both X and Y**: A third variable (parental resources, court-ordered therapy, passage of time) causes both increased contact and improved wellbeing

Institutional documents frequently assume explanation 1 without ruling out explanations 2 and 3. This is the fundamental causal inference problem.

### 1.2 Why Institutions Make This Error

Several factors drive premature causal inference in institutional contexts:

**Narrative pressure**: Institutions must explain decisions. "We intervened because X caused Y" is more compelling than "X and Y are correlated for unknown reasons." Causal language satisfies the demand for justification.

**Temporal ordering fallacy**: When X precedes Y temporally, institutions assume X caused Y. But temporal priority is necessary, not sufficient, for causation. The sun rises before rush hour traffic; it does not cause the traffic.

**Confirmation bias**: Once a causal theory forms, evidence is interpreted to support it. Correlations consistent with the theory are highlighted; correlations inconsistent with it are dismissed as anomalies.

**Counterfactual invisibility**: Causal inference fundamentally requires comparing what happened to what would have happened otherwise. But the counterfactual is never observed. Institutions cannot see the child who was not removed, the professional who was not disciplined, the treatment that was not provided. Without observable counterfactuals, causal claims become untestable assertions.

---

## 2. Directed Acyclic Graphs: The Language of Causation

Judea Pearl's work on causal inference, particularly his development of Directed Acyclic Graphs (DAGs), provides a rigorous framework for representing and analysing causal relationships (Pearl, 2009).

### 2.1 DAG Fundamentals

A DAG is a visual representation of causal assumptions. Nodes represent variables. Directed edges (arrows) represent direct causal effects. "Acyclic" means no variable can cause itself through any chain of effects.

**Simple causal chain**:

```
Professional Decision --> Intervention --> Child Outcome
```

This DAG asserts that professional decisions directly affect interventions, and interventions directly affect child outcomes. The professional decision affects child outcomes only through the intervention---there is no direct arrow from decision to outcome.

**Common cause structure (confounding)**:

```
            Parental Resources
           /                  \
          v                    v
    Contact Time           Child Wellbeing
```

This DAG shows that parental resources cause both contact time and child wellbeing. Any observed correlation between contact time and wellbeing may be entirely explained by this common cause. Removing contact would not necessarily harm wellbeing if resources are the true driver.

### 2.2 Confounders, Mediators, and Colliders

Understanding DAG structures is essential for valid causal inference.

**Confounders**: Variables that cause both the treatment and the outcome. If socioeconomic status affects both likelihood of child removal and child outcomes, SES confounds the relationship between removal and outcomes. Failing to control for SES leads to biased causal estimates.

**Mediators**: Variables through which the treatment affects the outcome. If professional training affects documentation quality, and documentation quality affects case outcomes, documentation quality mediates the training-outcome relationship. Controlling for the mediator blocks part of the causal effect we want to measure.

**Colliders**: Variables caused by both the treatment and the outcome (or variables on causal paths from both). Controlling for colliders introduces bias rather than removing it---the "collider bias" or "selection bias" problem.

**Collider example**:

```
    Contact Quality         Child's Verbal Ability
           \                     /
            v                   v
           Case Selected for Review
```

If cases are selected for review based on both contact quality concerns and children's ability to articulate experiences, conditioning on "selected for review" induces a spurious negative correlation between contact quality and verbal ability among reviewed cases. In unselected cases, no such correlation exists.

This is why regulatory complaint samples may show patterns that do not exist in the general population---the selection process itself creates associations.

### 2.3 The d-Separation Criterion

Pearl's d-separation criterion provides formal rules for determining when two variables are conditionally independent given a set of conditioning variables. Without formal training in causal graph theory, the key intuition is:

1. Conditioning on confounders blocks spurious paths---good for causal inference
2. Conditioning on colliders opens spurious paths---bad for causal inference
3. Conditioning on mediators blocks causal paths---eliminates the effect we're trying to measure

Institutional analyses frequently condition on the wrong variables. Social services reports may control for factors like "engagement with services"---itself partly caused by the intervention being evaluated, and partly a collider selected by the assessment process. Such controls distort rather than clarify causal relationships.

---

## 3. Confounding and Control Strategies

The fundamental problem of causal inference is confounding: observed associations may reflect common causes rather than direct causal effects. Several strategies attempt to address this problem.

### 3.1 Randomisation

Randomised Controlled Trials (RCTs) are considered the gold standard for causal inference because randomisation breaks the link between treatment and confounders. If subjects are randomly assigned to treatment or control conditions, any confounders should be equally distributed across groups (in expectation).

**Why RCTs work**:

```
                 Confounder
                     |
                     v
  Random Assignment --> Treatment --> Outcome
```

Random assignment is (by construction) independent of any confounder. Therefore, any observed difference in outcomes between treatment and control groups can be attributed to the treatment itself.

**Limitations in institutional contexts**:

RCTs are often ethically impractical in institutional settings. We cannot randomly assign children to removal or non-removal. We cannot randomly assign professionals to disciplinary action or no action. The ethical constraints that prevent randomisation are the same constraints that make observational causal inference so difficult.

When institutional documents cite RCT evidence, analysts should verify:

- Was the RCT population similar to the case at hand?
- Was randomisation actually successful (check baseline balance)?
- What was the attrition rate, and was it differential by group?
- Was the treatment in the RCT similar to the intervention being evaluated?

### 3.2 Statistical Control (Regression Adjustment)

The most common approach in observational studies is statistical control: include potential confounders as covariates in a regression model, then estimate the treatment effect "controlling for" those variables.

**Example**: Estimating the effect of contact frequency on child wellbeing, controlling for parental income, child age, and case worker experience.

**Critical limitation**: Regression adjustment only controls for observed confounders. If important confounders are unmeasured or unmeasurable, the estimate remains biased. This is the "omitted variable bias" problem.

Institutional analyses routinely claim to have "controlled for relevant factors" without acknowledging that:

1. They cannot know all relevant confounders
2. Many relevant confounders are unmeasured (parental motivation, family support networks, historical trauma)
3. Measurement error in confounders leads to incomplete adjustment even when they are included

A finding that "controlling for X, Y, and Z, the intervention had a significant positive effect" does not establish causation. It establishes that among observed confounders, X, Y, and Z were adjusted for. Unobserved confounders may entirely explain the association.

### 3.3 Matching Methods

Matching attempts to create comparable treatment and control groups by pairing treated units with untreated units that have similar covariate values.

**Propensity score matching**: Estimate the probability of treatment given observed covariates (the propensity score), then match treated and untreated units with similar propensity scores.

Matching has intuitive appeal---compare like with like---but shares the fundamental limitation of regression adjustment. Matching on observed covariates does not address unmeasured confounding. If unobserved factors affect both treatment selection and outcomes, matched comparisons remain biased.

---

## 4. Observational Causal Inference Methods

When randomisation is impossible, several quasi-experimental methods attempt to approximate experimental conditions using observational data. These methods, pioneered by economists and epidemiologists, require specific structural conditions that may or may not hold in any given application (Angrist & Pischke, 2009; Imbens & Rubin, 2015).

### 4.1 Difference-in-Differences

Difference-in-differences (DiD) compares changes over time between a treatment group and a control group.

**Logic**: If the treatment group and control group would have evolved similarly in the absence of treatment (the "parallel trends assumption"), any difference in their post-treatment trajectories can be attributed to the treatment.

**Example**: Comparing outcomes for children in a local authority that implemented a new intervention (treatment) versus a similar authority that did not (control), before and after implementation.

```
Effect = (Treatment_After - Treatment_Before) - (Control_After - Control_Before)
```

**Critical assumption**: Parallel trends. The treatment and control groups must have had similar outcome trajectories prior to treatment. If they were already diverging before treatment, DiD will attribute that divergence to the treatment.

**Forensic application**: When institutional documents claim that an intervention improved outcomes, DiD logic asks: compared to what? What happened to similar cases that did not receive the intervention? Were pre-intervention trends actually parallel?

### 4.2 Instrumental Variables

Instrumental variables (IV) estimation uses a third variable (the "instrument") that affects the treatment but has no direct effect on the outcome except through the treatment.

**Example**: Distance to a specialist facility might affect whether a family receives specialist services (people farther away are less likely to access services) but plausibly does not directly affect child outcomes except through service receipt.

**Conditions for valid instrument**:

1. **Relevance**: The instrument must affect the treatment (distance affects service uptake)
2. **Exclusion**: The instrument must not affect the outcome except through the treatment (distance has no direct effect on child wellbeing)
3. **Independence**: The instrument must be unrelated to unmeasured confounders

**Critical limitation**: The exclusion restriction is often implausible and cannot be directly tested. If distance to facilities is correlated with rural versus urban residence, and urbanicity affects child outcomes through multiple pathways, the instrument is invalid.

IV estimation is technically sophisticated but rests on untestable assumptions. Forensic analysts encountering IV claims should interrogate the exclusion restriction: is it truly plausible that the instrument affects outcomes only through the treatment?

### 4.3 Regression Discontinuity

Regression discontinuity (RD) designs exploit situations where treatment assignment is determined by whether a continuous variable crosses a threshold.

**Example**: If children are removed from families scoring above 15 on a risk assessment tool but not below, the threshold creates a natural experiment. Children scoring 15.1 are similar to those scoring 14.9, but only the former receive intervention.

**Logic**: Comparing outcomes for units just above versus just below the threshold. Any jump in outcomes at the threshold can be attributed to the treatment, since units near the threshold are otherwise similar.

**Conditions for validity**:

1. No manipulation of the running variable around the threshold
2. Continuous relationship between the running variable and outcomes away from the threshold
3. Units cannot precisely control whether they are above or below the threshold

**Forensic application**: RD designs rarely appear in institutional documents because thresholds are not always sharp and data near thresholds is limited. But the logic is useful: if an institution claims a threshold-based decision caused certain outcomes, RD reasoning asks whether units just above and below the threshold were truly comparable.

---

## 5. The Potential Outcomes Framework

Donald Rubin's potential outcomes framework (the "Rubin Causal Model") provides the foundational conceptual apparatus for modern causal inference (Rubin, 1974, 2005).

### 5.1 Counterfactual Reasoning

For each unit (person, case, family), define two potential outcomes:

- Y(1) = outcome if treated
- Y(0) = outcome if not treated

The **individual treatment effect** is:

```
ITE = Y(1) - Y(0)
```

The **fundamental problem of causal inference**: We can only observe one potential outcome per unit. If a child is removed (treated), we observe Y(1) but not Y(0). If a child is not removed (control), we observe Y(0) but not Y(1). The counterfactual is never observed.

**Average treatment effect** (ATE):

```
ATE = E[Y(1)] - E[Y(0)]
```

RCTs estimate the ATE by ensuring that treated and control groups are comparable, so the average outcome in each group estimates the corresponding potential outcome.

### 5.2 The SUTVA Assumption

The Stable Unit Treatment Value Assumption (SUTVA) requires that:

1. One unit's treatment does not affect another unit's outcome (no interference)
2. There is only one version of each treatment level (no hidden variations in treatment)

SUTVA is routinely violated in institutional contexts. Removing one child from a family affects siblings. Disciplining one professional affects colleagues' behaviour. An intervention in one local authority may lead families to relocate to another. When SUTVA fails, treatment effects become undefined without specifying the interference structure.

### 5.3 Identification Assumptions

Causal effects are "identified" when they can be estimated from observed data under specified assumptions. Common identification assumptions:

**Ignorability (Unconfoundedness)**: Treatment assignment is independent of potential outcomes conditional on observed covariates. This is the assumption behind regression adjustment and matching---once we control for X, treatment is "as good as random."

**Overlap (Positivity)**: Every unit has positive probability of receiving each treatment level. If some units could never receive treatment (or could never avoid it), we cannot learn about their potential outcomes under the alternative.

Identification assumptions cannot be directly tested. They are maintained assumptions that may or may not hold. Forensic analysts should identify what assumptions would need to hold for an institutional causal claim to be valid, then assess whether those assumptions are plausible.

---

## 6. Common Causal Inference Errors in Institutional Decision-Making

Institutional documents exhibit systematic patterns of causal reasoning error. Recognising these patterns is essential for forensic analysis.

### 6.1 Post Hoc Ergo Propter Hoc

"After this, therefore because of this." The fallacy of assuming that temporal sequence implies causation.

**Example**: "Following the safeguarding intervention, the child's school attendance improved." This temporal relationship does not establish that the intervention caused the improvement. The child was also growing older, the school year was progressing, the family may have resolved underlying issues independently.

### 6.2 Omitted Variable Bias

Attributing an effect to an observed variable when an unobserved confounder is the true cause.

**Example**: A study finds that children with longer contact time with non-resident parents have better outcomes. The institution concludes that contact causes better outcomes. But families with longer contact may differ systematically---less acrimonious relationships, more resources, more cooperative ex-partners. These unmeasured confounders may explain the association.

### 6.3 Selection on the Dependent Variable

Studying only cases with a particular outcome, then inferring causes from their common characteristics.

**Example**: Reviewing serious case reviews of child deaths to identify "risk factors." The sample includes only deaths. Without a comparison group of similar cases that did not result in death, we cannot know whether identified factors are actually predictive. Many non-fatal cases may share the same characteristics.

### 6.4 Survivorship Bias

Focusing on cases that "survived" a selection process while ignoring those that did not.

**Example**: Evaluating the effectiveness of a parenting programme by surveying participants who completed the programme. Those who dropped out (potentially the most struggling families) are excluded. The apparent success rate is inflated by selection.

### 6.5 Reverse Causation

Mistaking the effect for the cause.

**Example**: An institution notes that families who engage poorly with social services have worse outcomes. It concludes that engagement causes good outcomes. But poor engagement may be a consequence of more severe underlying problems---the causation runs in the opposite direction.

### 6.6 Ecological Fallacy

Inferring individual-level causation from aggregate-level correlation.

**Example**: Local authorities with higher intervention rates have better aggregate child outcomes. This does not imply that intervention improves outcomes for individual children---it may be that local authorities with better resources both intervene more and achieve better outcomes through other mechanisms.

---

## 7. Application to Forensic Analysis and Accountability Work

Causal inference methods have direct application to the core activities of institutional accountability analysis.

### 7.1 Evaluating Institutional Causal Claims

When an institutional document claims that action X caused outcome Y, the forensic analyst should ask:

1. **What is the claimed causal mechanism?** Draw the implied DAG. What variables are claimed to affect what?

2. **What confounders might exist?** What common causes could explain the X-Y association without X causing Y?

3. **What counterfactual is implied?** If X had not occurred, what does the institution claim would have happened instead? Is this counterfactual plausible?

4. **What identification strategy is used?** Is the causal claim based on randomisation, quasi-experimental design, or mere association?

5. **What assumptions are required?** For the causal claim to be valid, what must be true? Are those assumptions stated or implicit?

### 7.2 Tracing Causal Chains in Cascade Analysis

The S.A.M. methodology's four phases map onto causal inference concepts:

**ANCHOR (Origin)**: Identify the initial causal claim. What was the first assertion that X caused Y? What evidence supported that assertion at origin?

**INHERIT (Propagation)**: How did the causal claim propagate? Did subsequent documents verify the causal mechanism or merely repeat the claim? Did propagation introduce additional unsupported causal links?

**COMPOUND (Authority accumulation)**: How did repetition substitute for causal verification? Did multiple institutions' endorsement create the appearance of causal evidence where none existed?

**ARRIVE (Outcome)**: What actual causal relationships connected the initial claim to eventual harms? The cascade itself is a causal chain---initial error causing propagation causing authority accumulation causing harmful decision.

### 7.3 Constructing Counterfactual Arguments

Effective accountability arguments require counterfactual reasoning:

- "If the initial assessment had correctly identified the lack of evidence, subsequent documents would not have treated the claim as established."
- "If the documentary had included exculpatory evidence, viewers' conclusions would have differed."
- "If the court had required independent verification rather than deferring to the expert's assertion, the order would not have been made."

These counterfactuals are claims about what would have happened under alternative conditions. Establishing their plausibility requires evidence about the causal mechanisms---not just temporal sequences.

### 7.4 Directional Bias as Causal Evidence

When analysis reveals that 100% of omissions favour one party (directional bias score of +1.0), this pattern itself requires causal explanation. Random omission would not produce such an extreme pattern. The observed pattern is evidence that some systematic cause drove the selection---whether conscious bias, institutional incentive, or confirmation-driven information processing.

A z-score of 4.67 for a 13.2:1 framing ratio means the observed imbalance is extraordinarily unlikely under the null hypothesis of balanced coverage. Something caused the imbalance. Causal inference methods help identify what.

---

## 8. Connection to Phronesis Platform

The Phronesis platform operationalises causal inference principles through several engines:

### 8.1 Accountability Audit Engine (Lambda)

The Accountability Audit Engine traces causal chains from origin points through institutional processes to outcomes. It identifies:

- Where causal claims first entered the record
- What verification (if any) occurred at each propagation step
- How causal assertions accumulated authority
- What decision points depended on those causal claims

This implements the counterfactual question: would this outcome have occurred but for this claim?

### 8.2 Contradiction Detection Engine (Kappa)

Contradictions often reveal failed causal reasoning. If Document A claims X caused Y, and Document B claims Z caused Y, at least one causal claim is wrong. The Contradiction Engine surfaces these conflicts, flagging causal claims that cannot be simultaneously true.

Cross-temporal contradictions are particularly relevant: if the same outcome Y was attributed to different causes at different times, the causal reasoning is unreliable.

### 8.3 Temporal Parser Engine (Tau)

Causal relationships are constrained by temporal ordering---causes must precede effects. The Temporal Parser reconstructs chronology from documentary evidence, identifying:

- Whether claimed causes preceded claimed effects
- Gaps in temporal chains where evidence of causal mechanisms is missing
- Retroactive attribution where causal claims were constructed after outcomes were known

### 8.4 Bias Detection Engine (Beta)

Directional bias quantification provides statistical evidence of systematic causation. An 8-for-8 omission pattern (all favouring one side) has less than 0.4% probability under random selection. This statistical improbability demands causal explanation---what process caused this pattern?

The Bias Detection Engine computes framing ratios, omission direction scores, and statistical significance, transforming subjective impressions of bias into testable causal claims about selection processes.

---

## 9. Methodological Standards for Causal Claims

Based on the methods surveyed above, forensic analysts should apply the following standards when evaluating or making causal claims:

### 9.1 Minimum Requirements for Causal Assertion

1. **Clear counterfactual specification**: What would have happened absent the claimed cause?
2. **Temporal precedence established**: Did the cause precede the effect in every instance?
3. **Mechanism identified**: Through what process did the cause produce the effect?
4. **Confounders addressed**: What alternative explanations were ruled out, and how?
5. **Quantification where possible**: What is the magnitude of the claimed effect, with uncertainty bounds?

### 9.2 Red Flags for Invalid Causal Claims

- Causal language ("caused," "led to," "resulted in") without counterfactual analysis
- Treatment of temporal sequence as sufficient for causation
- Failure to consider alternative explanations
- Selection on the dependent variable (studying only cases with the outcome)
- Ecological inference from aggregate data to individual cases
- Appeals to plausibility without empirical verification

### 9.3 Strengthening Causal Arguments

- **Multiple identification strategies**: If different methods converge on the same causal estimate, confidence increases
- **Mechanism evidence**: Direct evidence of the causal mechanism (not just outcome data)
- **Sensitivity analysis**: How much unmeasured confounding would be required to explain away the result?
- **Falsification tests**: Testing implications of the causal hypothesis that could in principle be false

---

## 10. Conclusion

Causal inference is the bridge between observed patterns and actionable conclusions. Institutions constantly make causal claims---this intervention helped, that professional failed, this factor increased risk. But the gap between correlation and causation is vast, and institutional processes routinely leap across it without adequate justification.

The methods surveyed here---DAGs, potential outcomes, quasi-experimental designs---provide rigorous tools for evaluating causal claims. They do not make causal inference easy. They make explicit what assumptions are required and whether those assumptions are plausible.

For forensic analysts, causal inference literacy is essential. Every accountability analysis ultimately involves causal claims: the cascade caused harm, the bias affected coverage, the omission changed understanding. Making these claims defensible requires understanding what causation means, what evidence supports it, and what errors undermine it.

The goal is not to reject all causal reasoning. Causation is real, and some institutional claims are genuinely causal. The goal is to distinguish valid causal inference from mere assertion dressed in causal language. This distinction is the difference between accountability based on evidence and blame based on narrative.

---

## References

Angrist, J. D., & Pischke, J.-S. (2009). *Mostly Harmless Econometrics: An Empiricist's Companion*. Princeton University Press.

Angrist, J. D., & Pischke, J.-S. (2015). *Mastering 'Metrics: The Path from Cause to Effect*. Princeton University Press.

Hernán, M. A., & Robins, J. M. (2020). *Causal Inference: What If*. Chapman & Hall/CRC. Available at: https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/

Imbens, G. W., & Rubin, D. B. (2015). *Causal Inference for Statistics, Social, and Biomedical Sciences: An Introduction*. Cambridge University Press.

Morgan, S. L., & Winship, C. (2015). *Counterfactuals and Causal Inference: Methods and Principles for Social Research* (2nd ed.). Cambridge University Press.

Pearl, J. (2009). *Causality: Models, Reasoning, and Inference* (2nd ed.). Cambridge University Press.

Pearl, J., & Mackenzie, D. (2018). *The Book of Why: The New Science of Cause and Effect*. Basic Books.

Pearl, J., Glymour, M., & Jewell, N. P. (2016). *Causal Inference in Statistics: A Primer*. Wiley.

Rosenbaum, P. R. (2002). *Observational Studies* (2nd ed.). Springer.

Rubin, D. B. (1974). Estimating causal effects of treatments in randomized and nonrandomized studies. *Journal of Educational Psychology*, 66(5), 688-701.

Rubin, D. B. (2005). Causal inference using potential outcomes: Design, modeling, decisions. *Journal of the American Statistical Association*, 100(469), 322-331.

---

## Document Control

**Version**: 1.0
**Date**: 2026-01-18
**Author**: Apatheia Labs Research
**Classification**: Research Article - Data Science
**Review Cycle**: Annual update recommended

---

*"Correlation does not imply causation---but causation does not exist without mechanism, evidence, and counterfactual reasoning."*

---

**End of Document**

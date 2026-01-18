# Engine Guide

Detailed guide to each of the 11 analysis engines.

---

## Overview

Phronesis includes 11 specialized analysis engines:

1. **Entity Analysis** - People, organizations, relationships
2. **Temporal Analysis** - Timeline construction and validation
3. **Argumentation Analysis** - Claim-evidence relationships
4. **Bias Detection** - Rhetorical patterns and bias
5. **Contradiction Detection** - Eight formal contradiction types
6. **Accountability Analysis** - Responsibility gaps
7. **Professional Standards** - Professional conduct assessment
8. **Omission Detection** - Missing information and selective citation
9. **Expert Opinion Analysis** - Expert testimony evaluation
10. **Documentary Evidence** - Evidence quality assessment
11. **Narrative Analysis** - Story coherence and consistency

---

## 1. Entity Analysis Engine

### Purpose
Identify and track people, organizations, locations, dates, and events across documents.

### What It Extracts
- **People**: Names, roles, relationships
- **Organizations**: Institutions, agencies, departments
- **Locations**: Addresses, facilities, geographic references
- **Dates**: Event dates, document dates, deadlines
- **Events**: Incidents, decisions, actions

### Outputs
- Entity list with frequency and document references
- Relationship network graph
- Timeline of entity involvement
- Alias resolution (same entity, different names)

### Use Cases
- Understanding who did what when
- Mapping institutional relationships
- Identifying key actors
- Tracking entity involvement over time

---

## 2. Temporal Analysis Engine

### Purpose
Construct chronological timelines and detect temporal inconsistencies.

### What It Analyzes
- Event dates and sequences
- Document creation dates
- Relative temporal references ("three weeks later")
- Causal temporal relationships ("X led to Y")

### Outputs
- Chronological event timeline
- Document creation timeline
- Temporal inconsistencies flagged
- Timeline visualizations

### Detects
- **TEMPORAL contradictions**: Logically impossible sequences
- Events described before they occurred
- Documents citing future events
- Inconsistent date references

---

## 3. Argumentation Analysis Engine

### Purpose
Analyze claim-evidence relationships and argument structure.

### Based On
Toulmin model: Claim, Evidence, Warrant, Qualifier, Rebuttal

### What It Analyzes
- Claims made in documents
- Evidence cited for claims
- Warrants connecting evidence to claims
- Hedging and qualifiers
- Rebuttals or counterclaims

### Outputs
- Argument maps
- Claim-evidence alignment scores
- Warrant assessment
- Fallacy detection

### Identifies
- **EVIDENTIARY contradictions**: Claims unsupported by cited evidence
- Logical fallacies
- Weak warrants
- Missing evidence

---

## 4. Bias Detection Engine

### Purpose
Identify rhetorical patterns suggesting bias or prejudgment.

### What It Detects
- Loaded language and emotional appeals
- Selective emphasis
- Framing effects
- Presumption of guilt/innocence
- Stereotyping or generalizations

### Outputs
- Bias markers with severity scores
- Pattern identification
- Language analysis
- Comparative analysis across documents

### Use Cases
- Assessing impartiality
- Identifying confirmation bias
- Detecting prejudgment
- Evaluating fairness

---

## 5. Contradiction Detection Engine

### Purpose
Systematic detection of eight formal contradiction types.

### Eight Types
1. **SELF**: Internal contradictions
2. **INTER_DOC**: Cross-document contradictions
3. **TEMPORAL**: Timeline inconsistencies
4. **EVIDENTIARY**: Claim-evidence mismatch
5. **MODALITY_SHIFT**: Unjustified certainty changes
6. **SELECTIVE_CITATION**: Cherry-picked references
7. **SCOPE_SHIFT**: Unexplained generalizations
8. **UNEXPLAINED_CHANGE**: Position reversals

### Outputs
- Contradiction list by type
- Severity assessments
- Source citations for each side
- Explanation of incompatibility

### See Also
[Contradiction Taxonomy](../research/contradiction-taxonomy.md) for formal definitions.

---

## 6. Accountability Analysis Engine

### Purpose
Identify accountability gaps and responsibility ambiguities.

### What It Analyzes
- Decision attribution (who decided?)
- Verification responsibility (who checked?)
- Authority without basis (claims by position)
- Institutional boundary crossings

### Outputs
- Responsibility maps
- Accountability gap identifications
- Decision flow diagrams
- Verification status tracking

### Identifies
- Decisions without clear attribution
- Claims without identifiable author
- Verification gaps
- Diffused responsibility

---

## 7. Professional Standards Engine

### Purpose
Assess compliance with professional standards and best practices.

### Domain-Specific Standards
- **Legal**: Professional conduct rules, discovery obligations
- **Medical**: Standard of care, informed consent
- **Social Work**: Assessment protocols, documentation standards
- **Law Enforcement**: Investigation procedures, evidence handling

### Outputs
- Standards compliance assessment
- Violations or departures flagged
- Best practices comparison
- Recommendations for improvement

---

## 8. Omission Detection Engine

### Purpose
Identify missing information and selective citation.

### What It Detects
- **SELECTIVE_CITATION**: Quoted sources with contradicting portions omitted
- Missing Brady material (exculpatory evidence)
- Gaps in investigation
- Unasked questions
- Ignored contradicting evidence

### Outputs
- Omission flags with context
- Selective citation examples
- Investigation gap analysis
- Missing document inference

### Challenges
Proving omission is difficult. Engine flags suspicious patterns requiring human judgment.

---

## 9. Expert Opinion Analysis Engine

### Purpose
Evaluate reliability and basis of expert opinions.

### What It Analyzes
- Expert qualifications
- Opinion basis (examined vs. document review)
- Evidence cited
- Methodology disclosed
- Consistency with standards
- Acknowledged limitations

### Outputs
- Expert opinion reliability scores
- Basis assessment
- Methodology evaluation
- Daubert factor analysis

### Identifies
- Opinions exceeding evidence
- Inadequate methodology disclosure
- Expert bias or advocacy
- Credentials-evidence mismatch

---

## 10. Documentary Evidence Engine

### Purpose
Assess quality and reliability of documentary evidence.

### What It Analyzes
- Document authenticity indicators
- Chain of custody
- Contemporaneous vs. retrospective
- Primary vs. derivative
- Corroboration status

### Outputs
- Evidence quality scores
- Reliability assessments
- Chain of custody gaps
- Authentication issues

### Scoring Factors
- Contemporaneous > retrospective
- Primary > derivative
- Authenticated > unverified
- Corroborated > uncorroborated

---

## 11. Narrative Analysis Engine

### Purpose
Assess narrative coherence and consistency.

### What It Analyzes
- Story structure and coherence
- Consistency across tellings
- Evolution of narrative over time
- Competing narratives
- Narrative gaps

### Outputs
- Narrative maps
- Consistency scores
- Evolution tracking
- Competing narrative comparison

### Identifies
- Narrative inconsistencies
- Evolution without explanation
- Competing accounts
- Forced coherence (filtering contradictions)

---

## Engine Selection

### Quick Analysis (Recommended First Time)
- Entity Analysis
- Temporal Analysis
- Contradiction Detection

### Full S.A.M. Analysis
All engines plus:
- ANCHOR phase analysis
- INHERIT phase analysis
- COMPOUND phase analysis
- ARRIVE phase analysis

### Custom Selection
Choose engines relevant to case type and questions.

---

## Configuration

### Adjustable Parameters
- Sensitivity thresholds
- Authority weights
- Evidential quality scoring
- Contradiction severity levels

### Advanced
- Custom prompts for AI analysis
- Domain-specific adaptations
- Integration with custom engines

---

Last updated: 2025-01-16

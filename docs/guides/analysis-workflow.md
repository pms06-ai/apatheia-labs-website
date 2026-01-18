# Analysis Workflow

Step-by-step process from document upload to report generation.

---

## Overview

Complete S.A.M. analysis workflow:

1. Case Setup
2. Document Import and Organization
3. Initial Review
4. Entity and Timeline Analysis
5. S.A.M. Four-Phase Analysis
6. Contradiction Detection
7. Findings Review and Verification
8. Report Generation

---

## Phase 1: Case Setup

### Create Case
- Choose descriptive case name
- Select case type (wrongful conviction, child protection, medical, other)
- Enter case description and background
- Set case metadata (jurisdiction, date range)

### Define Scope
- What questions are you investigating?
- What outcomes need explanation?
- What time period is relevant?
- Which institutions are involved?

---

## Phase 2: Document Import

### Gather Documents
**Comprehensive collection**:
- Primary source documents (incident reports, original records)
- Professional assessments (evaluations, forensic reports)
- Investigation reports (agency investigations)
- Administrative documents (case plans, determinations)
- Legal documents (pleadings, orders, findings)
- Correspondence between institutions

### Import Process
1. Organize files (chronological naming helpful)
2. Import into Phronesis
3. Wait for OCR/extraction
4. Verify quality

### Add Metadata
- Document type
- Author/institution
- Creation date
- Tags and notes

---

## Phase 3: Initial Review

### Document Review
- Read through documents
- Get familiar with case facts
- Identify key actors and institutions
- Note major events and decisions

### Identify Key Questions
- What are the harmful outcomes?
- What claims supported those outcomes?
- Where did those claims originate?
- How did they propagate?

---

## Phase 4: Entity and Timeline Analysis

### Run Entity Analysis
- Extract people, organizations, locations, dates
- Review and verify entities
- Resolve ambiguous references
- Map relationships

### Build Timeline
- Chronological event sequence
- Document creation timeline
- Decision points
- Verify temporal consistency

---

## Phase 5: S.A.M. Four-Phase Analysis

### ANCHOR: Trace Origins
For each significant claim:
1. Find first appearance (origin document)
2. Assess evidential basis at origin
3. Classify origin type
4. Assign evidential quality score
5. Flag false premises (quality < threshold)

### INHERIT: Track Propagation
For each claim:
1. Search for reappearance in later documents
2. Document propagation path
3. Note institutional boundaries crossed
4. Detect mutations (amplification, certainty drift, etc.)
5. Assess whether verification occurred

### COMPOUND: Map Authority
For each claim:
1. Identify authority markers (court findings, expert opinions, etc.)
2. Assign authority weights
3. Calculate cumulative authority scores
4. Detect authority laundering (high authority + low evidence)
5. Trace laundering paths

### ARRIVE: Link to Outcomes
For each harmful outcome:
1. Identify supporting claims in outcome document
2. Trace each claim back through phases
3. Conduct but-for analysis
4. Assess harm level
5. Recommend remediation

---

## Phase 6: Contradiction Detection

### Run Contradiction Analysis
- Automated detection of 8 types
- Review each flagged contradiction
- Verify accuracy
- Assess severity

### Review by Type
- **SELF**: Internal contradictions
- **INTER_DOC**: Cross-document contradictions
- **TEMPORAL**: Timeline impossibilities
- **EVIDENTIARY**: Claim-evidence mismatches
- **MODALITY_SHIFT**: Certainty changes
- **SELECTIVE_CITATION**: Cherry-picking
- **SCOPE_SHIFT**: Generalizations
- **UNEXPLAINED_CHANGE**: Position reversals

---

## Phase 7: Findings Review

### Verify Each Finding
- Check source citations
- Read original context
- Consider alternative explanations
- Override AI if necessary

### Synthesize Patterns
- What systemic patterns emerge?
- What institutional failure modes are visible?
- What structural factors enabled false premise propagation?

### Document Limitations
- Missing documents
- Ambiguities
- Uncertainties
- Scope constraints

---

## Phase 8: Report Generation

### Select Report Type
- **PDF**: Court-ready with citation links
- **DOCX**: Editable with tracked citations
- **JSON**: Programmatic access
- **Audit trail**: Complete evidence chain

### Configure Report
- Sections to include
- Detail level
- Redaction level
- Visualizations

### Review and Finalize
- Proofread
- Verify citations
- Check for proper redactions
- Ensure completeness

---

## Quality Control Checklist

- [ ] All relevant documents imported
- [ ] OCR quality verified
- [ ] Entities accurately extracted
- [ ] Timeline is coherent
- [ ] All significant claims traced to origin
- [ ] Propagation paths documented
- [ ] Authority markers identified
- [ ] Contradictions verified
- [ ] But-for analyses conducted
- [ ] Alternative explanations considered
- [ ] Source citations checked
- [ ] Findings independently reviewed
- [ ] Report properly redacted
- [ ] Limitations documented

---

See also:
- [Getting Started](getting-started.md)
- [Engine Guide](engine-guide.md)
- [Best Practices](best-practices.md)

---

Last updated: 2025-01-16

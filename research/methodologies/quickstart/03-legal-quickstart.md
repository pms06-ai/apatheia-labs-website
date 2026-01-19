---
title: Legal eDiscovery Quick Start Guide
description: 5-minute reference for EDRM workflow, TAR/CAL review, chain of custody, and evidence authentication standards.
category: Quick Start
status: complete
date: 2026-01-16
tags:
  - quickstart
  - legal
  - eDiscovery
---

# Legal eDiscovery Quick Start Guide

**Purpose**: Rapid reference for professional legal document review and multi-document analysis
**Time to read**: 5 minutes
**Full document**: [03-legal-ediscovery.md](../03-legal-ediscovery.md)

---

## 60-Second Overview

- **EDRM Framework**: 9-stage non-linear model (Information Governance → Presentation)
- **TAR 2.0/CAL**: Continuous Active Learning reduces review by 40-60% (court-approved since 2015)
- **SHA-256 Hash**: Digital fingerprint proves file authenticity (collection → production)
- **FRE 502(b)**: Safe harbor for inadvertent privilege disclosure (if reasonable precautions + prompt action)
- **Court-Mandated AI**: _Hyles v. NYC_ (2016) - judge ordered TAR over linear review for efficiency

---

## Key Framework: EDRM 9-Stage Model

```
┌─────────────────────────────────────────────────────────────┐
│  VOLUME          ↓ REDUCE ↓        FOCUS ↓       PRESENT   │
├─────────────────────────────────────────────────────────────┤
│ Information Governance  →  Identification  →  Preservation  │
│         ↓                                           ↓        │
│    Collection  →  Processing  →  Review  →  Analysis        │
│         ↓                           ↓          ↓             │
│               Production  ←  ←  ←  ←  ←  Presentation       │
└─────────────────────────────────────────────────────────────┘
```

**Non-linear**: Move back and forth between stages as new information emerges
**Cost concentration**: Review = 50-70% of total eDiscovery spend

---

## Essential Tools

| Tool           | Purpose                  | TAR Support         | Pricing Model            |
| -------------- | ------------------------ | ------------------- | ------------------------ |
| **Relativity** | Large complex litigation | TAR 1.0 & 2.0       | Per-GB + per-user        |
| **Everlaw**    | Collaborative teams      | CAL (built-in)      | Per-GB (unlimited users) |
| **DISCO**      | Corporate legal          | TAR 2.0 (AI Review) | Fixed monthly fee        |
| **Logikcull**  | Small firms (<50K docs)  | None (linear)       | Per-GB                   |
| **Nuix**       | Processing & forensics   | Analytics           | Enterprise               |

**Market leader**: Relativity (220,000+ users globally)
**Rising star**: Everlaw (cloud-native, generative AI integration)

---

## TAR 2.0 / Continuous Active Learning Workflow

**Advantage over TAR 1.0**: No seed set required, continuous adaptation, 40-60% review reduction

### Phase 1: Start Review (No Seed Set)

- [ ] Begin with highest-ranked documents (keyword hits or random)
- [ ] No upfront training required
- [ ] Algorithm learns from first coded document

### Phase 2: Continuous Feedback Loop

- [ ] Reviewer codes document → AI immediately re-ranks population
- [ ] Next highest-ranked document served to reviewer
- [ ] Real-time model updates (every doc or every 10-50 docs)
- [ ] Prioritizes most relevant documents first

### Phase 3: Stabilization

- [ ] Algorithm identifies "stable" documents (unlikely to change ranking)
- [ ] Focus shifts to "unstable" borderline documents
- [ ] Efficiency gain: avoid reviewing clearly non-responsive

### Phase 4: Stopping Criteria

- [ ] Continue until no responsive documents found for sustained period
- [ ] Example threshold: 500 consecutive non-responsive docs
- [ ] Or: 95% precision on last 1,000 reviewed

### Phase 5: Validation (Post-Hoc)

- [ ] Random sample of unreviewed docs tested
- [ ] Target: <5% recall loss (95%+ relevant docs found)
- [ ] Statistical elusion testing confirms minimal missed material

**Court approval**: _Rio Tinto v. Vale_ (2015) - "more efficient and defensible" than TAR 1.0

---

## Timeline Construction (8-Step Process)

**Critical for**: Temporal contradiction detection, witness credibility, causation proof

### Step 1: Start Early

- [ ] Begin timeline at case inception (not trial prep)
- [ ] Early timelines drive discovery strategy

### Step 2: Create Central Repository

**Required fields**:

- Date/Time (precise to hour if possible)
- Event Description (objective facts only)
- Source Document(s) (Bates numbers, citations)
- Parties Involved (entities, witnesses)
- Issue Tags (case themes)
- Significance (high/medium/low)

### Step 3: Identify Parties and Issues

- [ ] Party tags: Plaintiff, defendant, witness, decision-maker
- [ ] Issue tags: Contract breach, knowledge, notice, damages
- [ ] Enable filtering (show only events involving Party X + Issue Y)

### Step 4: Collect Documentation

- [ ] Emails, memos, reports
- [ ] Meeting minutes, calendar entries
- [ ] Financial records, invoices
- [ ] Text messages, instant messages
- [ ] Public records (news, regulatory filings)

### Step 5: Extract Events (Date-Specific Facts)

**Good**: "2024-03-15: Smith sent email to Jones re: 'quarterly projections' (ABC00145)"
**Bad**: "Smith was aware of the defect" (no date tie)

### Step 6: Use Objective Language

- [ ] Facts only, no conclusions
- [ ] Neutral language (shared with opposing counsel, court)
- [ ] Example: "Jones emailed: 'The brake defect was known...'" NOT "Jones admitted knowledge"

### Step 7: Link Evidence

- [ ] Every event cites supporting documents
- [ ] Bates numbers (ABC00001-ABC00010)
- [ ] Deposition cites (Smith Dep. 45:12-18)
- [ ] Purpose: Instant verification, admissibility support

### Step 8: Update Continuously

- [ ] Living document throughout case lifecycle
- [ ] Add events as discovery received
- [ ] Revise as depositions clarify facts

**Tools**: CaseFleet, TimeMap, SmartDraw, Excel (custom)

---

## SHA-256 Hash Certification Protocol

**Purpose**: Digital fingerprint proves file unchanged from collection → production

### Dual Hash System

**Collection Hash**:

- [ ] Generated at time of forensic collection
- [ ] Recorded in collection log
- [ ] Proves file unchanged since collection

**Production Hash**:

- [ ] Generated at production to opposing party
- [ ] Recorded in production log
- [ ] Receiving party regenerates hash to verify

### Hash Comparison

- **Match**: File authenticated (identical to original)
- **Mismatch**: File corrupted/altered (inadmissible without explanation)

**Legal Foundation**:

- FRE 901(a): Authentication requirement
- FRE 902(14): Self-authenticating digital records with hash certification

**Industry Standard**: SHA-256 (256-bit, 64 hex characters)
**Example**: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

**Critical**: Store hash in tamper-proof database/audit log

---

## Privilege Review 5-Phase Process

### Phase 1: Initial Identification (Automated)

- [ ] Keyword searches: attorney names, law firms, "privileged", "legal advice"
- [ ] Email domain filtering: @lawfirm.com, legal@company.com
- [ ] Machine learning privilege detection (80-90% precision)
- [ ] Output: 10-30% of docs flagged for human privilege review

### Phase 2: First-Pass Review (Trained Reviewers)

- [ ] 2-4 hour training by senior attorney
- [ ] Target speed: 75-100 docs/hour
- [ ] Code as: Privileged / Not Privileged / Needs Review
- [ ] 5-10% QC sample by senior attorney

### Phase 3: Senior Attorney Review (4-Part Test)

**Attorney-Client Privilege requires ALL four**:

1. Communication (written or oral)
2. Between attorney and client (or representative)
3. Seeking/providing legal advice (not business advice)
4. Confidential (not shared with third parties)

**Work Product Doctrine**:

- Materials prepared "in anticipation of litigation"
- Ordinary work product (fact work) vs. Opinion work product (attorney mental impressions)

### Phase 4: QC (Partner/Senior Counsel)

- [ ] 5-10% sample of Phase 3 privileged designations
- [ ] 2-5% sample of non-privileged (false negative check)
- [ ] Error rate >5%: Retrain and re-review

### Phase 5: Log Creation (FRCP 26(b)(5))

**Required fields**:

- Bates Number
- Date
- Author
- Recipients (to/cc/bcc)
- Document Type (email, memo, letter)
- Privilege Basis (attorney-client or work product)
- Description (general subject without revealing privileged content)

**Example entry**:
| Bates | Date | Author | Recipients | Type | Basis | Description |
|-------|------|--------|------------|------|-------|-------------|
| ABC00123 | 2024-03-15 | John Smith (Associate GC) | Jane Doe (CEO) | Email | Attorney-Client | Legal advice re: contract interpretation |

---

## FRE 502(b) Safe Harbor (Inadvertent Disclosure Protection)

**Rule**: Privilege NOT waived if:

1. **Reasonable Precautions Taken**: Multi-phase review, QC sampling, AI-assisted detection
2. **Prompt Action After Discovery**: Notice to opposing party within days (not weeks)
3. **Context Considered**: Volume and complexity of case

### Reasonable Precautions Checklist

- [ ] Multi-phase privilege review (Phase 1-5 above)
- [ ] QC sampling (5-10% minimum)
- [ ] AI-assisted detection (if reasonable for case)
- [ ] Adequate time/resources (not rushed/understaffed)
- [ ] Claw-back agreement with opposing party (pre-production)

### Prompt Action Protocol

- [ ] Discover inadvertent production within days
- [ ] Formal written request to opposing party
- [ ] "We inadvertently produced ABC01234, which is privileged. Please return all copies and confirm destruction."
- [ ] Follow up if no timely response

**FRE 502(d) Court Order**: Request order that inadvertent production does NOT waive privilege (protects in all jurisdictions, including state courts)

**Best practice**: Include claw-back provision in ESI protocol + request 502(d) order at case outset

---

## Common Pitfalls (Top 5)

| Mistake                     | Impact                            | Mitigation                                                                                         |
| --------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Broken chain of custody** | Evidence inadmissible             | SHA-256 hash at collection/production, write-blocking during imaging                               |
| **Metadata loss**           | Spoliation sanctions              | Forensically sound collection, native format production (or load file with metadata)               |
| **Privilege waiver**        | Loss of protection, malpractice   | 5-phase review, FRE 502(b) safe harbor, claw-back agreements                                       |
| **TAR validation failure**  | Opposing party challenge          | Precision/recall testing, elusion testing, transparent methodology                                 |
| **Litigation hold failure** | Adverse inference, case dismissal | Written hold notices, technical holds, regular re-notification, exit holds for departing employees |

### Specific Warning: Metadata Spoliation

**Risk**: Saving document as PDF strips author/edit history before production

**Consequences**:

- Sanctions (monetary penalties)
- Adverse inference instruction
- Case dismissal (for intentional spoliation)

**Mitigation**: Forensically sound collection tools (Nuix, Exterro, Relativity Collect), write-blocking, quality control spot checks

---

## Quality Gates (When to Pause)

### Before Collection

- [ ] Litigation hold issued to all custodians?
- [ ] Technical holds implemented (email, file shares, cloud)?
- [ ] Chain of custody logs prepared?
- [ ] Forensic collection tools ready (write-blockers, hash generation)?

### Before Review

- [ ] Processing complete (de-duplication, metadata extraction)?
- [ ] Search terms validated (sample testing, false positive/negative rate)?
- [ ] TAR protocol agreed with opposing party (if using AI)?
- [ ] Reviewers trained (responsiveness criteria, privilege 4-part test)?

### Before Production

- [ ] QC completed (sample review, error rate <5%)?
- [ ] Privilege log finalized (all privileged docs logged)?
- [ ] Hash values generated for native productions?
- [ ] Load file prepared (metadata fields for images)?
- [ ] Opposing counsel format requirements met?

### Before Trial

- [ ] Key documents converted to trial exhibits?
- [ ] Exhibit list finalized?
- [ ] Authentication foundation established (business records, hash certification)?
- [ ] Backup copies available (original + production copy)?

---

## Integration with Phronesis FCIP

### Chain of Custody

- **Automated hash generation**: SHA-256 on document upload
- **Transfer logs**: Every access/download logged with timestamp + user
- **Tamper detection**: Re-hash on export, compare to original
- **Audit trail**: Complete provenance for legal admissibility

### Timeline Construction

- **Event extraction**: AI identifies date-specific facts from documents
- **Bates-style linking**: Every timeline event cites source document (page/paragraph)
- **Temporal contradiction detection**: Flag inconsistent dates across documents
- **Visualization**: Interactive timeline with document drill-down

### Multi-Document Analysis

- **Near-duplicate detection**: Fuzzy hashing (80-95% similarity threshold)
- **Version tracking**: Identify document evolution (v1 → v2 → v3), diff analysis
- **Email threading**: Group related emails, display most inclusive only
- **Network analysis**: Communication networks (betweenness centrality, community detection)

### Privilege Review Analogue

- **PII redaction**: AI-powered detection (SSN, credit cards, medical records)
- **Human QC**: Flagged items routed for review
- **Redaction log**: Track what redacted, why, by whom
- **Export**: Redacted documents with audit trail

### TAR 2.0 Integration

- **Document ranking**: Continuous active learning for prioritization
- **Human feedback**: Investigator codes docs as critical/relevant/non-relevant
- **Re-ranking**: Algorithm updates based on feedback
- **Focus**: Highest-ranked documents surfaced first (triage large datasets)

---

## Litigation Hold 6-Step Process

### Step 1: Identify Triggering Event

- [ ] Demand letter received
- [ ] Complaint filed
- [ ] Regulatory investigation notice
- [ ] Internal discovery of potential violation
- [ ] Timing: Act immediately upon reasonable anticipation

### Step 2: Issue Hold Notices

- [ ] Written notice to custodians (email or formal letter)
- [ ] Scope: Time periods, subject matter, document types
- [ ] Custodian acknowledgment required (signature or email confirmation)
- [ ] Clear instructions: Suspend deletion, do not alter docs

**Content must include**: Case name, custodian responsibilities, document categories, consequences of non-compliance, contact for questions

### Step 3: Technical Holds

- [ ] IT coordination
- [ ] Email archival (suspend auto-deletion)
- [ ] File share preservation
- [ ] Database snapshots
- [ ] Mobile device backup
- [ ] Cloud storage preservation (API-based holds for SaaS)

### Step 4: Chain of Custody Documentation

- [ ] Custodian interview forms (document locations, systems)
- [ ] Data source inventory
- [ ] Collection logs (who, what, when, where, how)
- [ ] Hash certification
- [ ] Transfer logs

### Step 5: Monitor Compliance

- [ ] Periodic re-notification (quarterly or semi-annually)
- [ ] Audit custodian systems
- [ ] Track departing employees (exit holds)
- [ ] Update scope as case evolves

### Step 6: Release Holds (After Case Resolution)

- [ ] Final judgment or settlement
- [ ] Appeals exhausted
- [ ] Formal release notice to custodians
- [ ] IT system hold removal
- [ ] Document retention policy resumes

**Consequences of failure**: Adverse inference, monetary sanctions, case dismissal, attorney discipline

---

## Write-Blocking Technology (Forensic Imaging)

**Problem**: Connecting device to computer can trigger:

- File system timestamp updates (last accessed date)
- Thumbnail generation
- Antivirus scans (modify metadata)
- Operating system indexing

**Solution**: Write-blocker prevents write commands while allowing read-only access

### Hardware Write-Blockers

- Physical device between evidence drive and workstation
- Examples: Tableau, WiebeTech, CRU
- Cost: $150-500
- Gold standard (court-recognized, OS-independent)

### Software Write-Blockers

- Prevents write commands at driver level
- Examples: FTK Imager (read-only mode), Linux dd with read-only mount
- Advantages: Free, flexible
- Disadvantages: Less court recognition

### Forensic Imaging Process

1. [ ] Attach source device to write-blocker
2. [ ] Attach destination device (forensic workstation/target drive)
3. [ ] Use forensic software (FTK Imager, EnCase, dd) for bit-for-bit copy
4. [ ] Generate hash of source device (SHA-256)
5. [ ] Generate hash of destination image
6. [ ] Compare hashes (must match)
7. [ ] Document in collection log

**Legal acceptance**: _US v. Almeida_ (2014) - write-blocking "best practice"

---

## Key Cases (Court Precedent)

| Case                           | Year | Holding                   | Impact                                                                        |
| ------------------------------ | ---- | ------------------------- | ----------------------------------------------------------------------------- |
| **Da Silva Moore v. Publicis** | 2012 | First approval of TAR 1.0 | "Computer-assisted review can yield more accurate results than manual review" |
| **Rio Tinto v. Vale**          | 2015 | Approved TAR 2.0/CAL      | "More efficient and defensible" than TAR 1.0                                  |
| **Hyles v. New York City**     | 2016 | Court mandated TAR        | Judge ordered TAR over linear review for cost/efficiency                      |
| **Zubulake v. UBS Warburg**    | 2004 | Duty to preserve          | Litigation hold required when litigation "reasonably anticipated"             |
| **Lorraine v. Markel**         | 2007 | eDiscovery standards      | Write-blocking, metadata preservation, authentication                         |

**Trend**: Courts increasingly expect AI use for efficiency; linear review for large datasets may be indefensible

---

## Resources and Standards

### Legal Framework

- **FRCP Rule 26**: Scope of discovery, proportionality, initial disclosure, meet and confer
- **FRCP Rule 34**: Document production, ESI production
- **FRE 502**: Attorney-client privilege waiver limitations
- **FRE 901/902**: Authentication, self-authenticating digital records

### Industry Standards

- **EDRM Framework**: 9-stage model (https://edrm.net)
- **Sedona Conference**: Cooperation principles, best practices
- **ABA Model Rules**: Competence (1.1), confidentiality (1.6), candor (3.3)

### Professional Organizations

- **ACEDS**: Association of Certified E-Discovery Specialists (certification program)
- **ILTA**: International Legal Technology Association (surveys, benchmarking)
- **Sedona Conference**: Working groups on eDiscovery, TAR, data privacy

### Academic Research

- **Grossman & Cormack**: TAR effectiveness research (Richmond Journal of Law & Technology)
- **TREC Legal Track**: Information retrieval evaluation for eDiscovery

---

## ABA Model Rule 1.1 (Technology Competence)

**Rule**: Lawyer must provide competent representation (legal knowledge, skill, thoroughness, preparation)

**Comment 8 (2012)**: "Competence includes keeping abreast of changes in law and its practice, including **benefits and risks of relevant technology**"

**eDiscovery implications**:

- Must understand TAR, privilege review processes, metadata preservation
- Or hire experts (but cannot outsource understanding without supervision)
- Cannot misrepresent methodology to court

**State opinions**:

- NY Opinion 842 (2010): Must understand eDiscovery basics or associate with expert
- FL Opinion 22-1 (2022): May use AI tools if understand generally, verify output, supervise recommendations

---

## Document Control

**Version**: Quick Start 1.0
**Date**: 2026-01-17
**Source**: 03-legal-ediscovery.md (70,856 bytes)
**Lines**: ~499
**Format**: Reference card (printable)

**Next steps**: Read full methodology for:

- TAR 1.0 vs 2.0 detailed comparison
- Bayesian updating and machine learning algorithms
- Communication network analysis (social network metrics)
- Concept clustering for theme identification
- Vendor management ethics and due diligence
- Platform detailed comparisons (Relativity, Everlaw, DISCO, Logikcull)

---

_"Legal eDiscovery provides validated, court-tested methodologies for multi-document analysis, contradiction detection through timeline and version tracking, and defensible quality control processes."_

# Investigative Journalism Quick Start Guide

**Purpose**: Rapid reference for professional investigative journalism methods
**Time to read**: 5 minutes
**Full document**: [02-journalism-investigations.md](../02-journalism-investigations.md)

---

## 60-Second Overview

- **Documentary First**: Documents > testimonial evidence (documents don't have agendas)
- **Hypothesis Framework**: Separate verified facts from working assumptions to prevent confirmation bias
- **Evidence Hierarchy**: Authenticated official documents rank highest, anonymous tips lowest
- **Multi-Layered Verification**: Minimum 3 independent sources for critical facts
- **Scale Proven**: Panama Papers (11.5M docs), Pandora Papers (11.9M docs, 600+ journalists)

---

## Key Framework: Hypothesis-Based Investigation

```
┌──────────────────────────────────────────────────────────────┐
│                  INVESTIGATION HYPOTHESIS                    │
├──────────────────────────────────────────────────────────────┤
│  Known Facts (Verified)           │  Working Assumptions     │
│  ├─ Primary source documents      │  ├─ Requires testing     │
│  ├─ Corroborated testimonies      │  ├─ Explicitly labeled   │
│  └─ Official records               │  └─ Seeks disproof       │
├──────────────────────────────────────────────────────────────┤
│  Evidence Gaps                     │  Alternative Hypotheses  │
│  ├─ Missing documentation          │  ├─ H1: Innocence       │
│  ├─ Unavailable witnesses          │  ├─ H2: Negligence      │
│  └─ Contradictory accounts         │  └─ H3: Deliberate act  │
└──────────────────────────────────────────────────────────────┘
```

**Critical**: Update hypothesis as new evidence emerges. Discard when contradicted.

---

## Essential Tools

| Tool | Purpose | Organization | Access |
|------|---------|--------------|--------|
| **Aleph** | 4+ billion document search | OCCRP | https://aleph.occrp.org |
| **Datashare** | Local document analysis | ICIJ | Open-source (GitHub) |
| **DocumentCloud** | Collaborative document annotation | MuckRock/DocumentCloud | https://documentcloud.org |
| **OpenRefine** | Data cleaning and reconciliation | Community | https://openrefine.org |
| **Linkurious** | Network graph visualization | Linkurious | Commercial |

---

## Evidence Hierarchy (ProPublica/ICIJ Standard)

**Rank documents by reliability, not convenience:**

### Tier 1: Highest Reliability
- Official government records (authenticated)
- Court documents (verified)
- Authenticated financial records (bank statements, tax returns)
- Original contracts with verifiable signatures

### Tier 2: High Reliability
- Corporate filings (registry authenticated)
- Regulatory submissions (verified)
- Internal company documents (metadata-verified provenance)
- Authenticated emails with verifiable headers

### Tier 3: Moderate Reliability
- Published reports (from credible organizations)
- Academic studies (peer-reviewed)
- Corroborated journalistic reports
- Industry databases (cross-referenced)

### Tier 4: Lower Reliability
- Single-source testimonial claims
- Social media posts (unverified)
- Anonymous tips (uncorroborated)
- Undated/unsigned documents

**Use rule**: Higher-tier evidence required for central claims. Lower-tier can provide leads but requires verification.

---

## Verification Workflow Checklist

### Source Authentication
- [ ] Document origin verified (not fabricated)
- [ ] Metadata examined (creation date, author, modifications)
- [ ] Digital signature/hash checked (if applicable)
- [ ] Cross-referenced with official registries
- [ ] Photoanalysis if images involved (EXIF data, reverse image search)

### Multi-Source Verification (Minimum 3 Independent Sources)
- [ ] Source 1 identified and vetted
- [ ] Source 2 identified and vetted (independent from Source 1)
- [ ] Source 3 identified and vetted (independent from both)
- [ ] Sources compared for consistency
- [ ] Contradictions documented and investigated

### Chain of Custody
- [ ] Document acquisition logged (date, time, method)
- [ ] Original preserved (read-only copy for analysis)
- [ ] Hash generated (SHA-256 for authenticity)
- [ ] Transfer logs maintained (who handled, when, why)
- [ ] Secure storage (encrypted, access-controlled)

### Expert Validation (For Technical Claims)
- [ ] Domain expert consulted (credentials verified)
- [ ] Expert independent (no conflict of interest)
- [ ] Expert methodology documented
- [ ] Second expert consulted if high-stakes claim
- [ ] Expert willing to be quoted (or explain anonymity need)

---

## ICIJ Collaborative Investigation Protocol

### Phase 1: Secure Infrastructure
- [ ] End-to-end encrypted communication (Signal, Wire)
- [ ] Secure document sharing (Datashare on isolated server)
- [ ] Two-factor authentication mandatory
- [ ] No cloud services without encryption
- [ ] Air-gapped analysis machines for sensitive leaks

### Phase 2: Team Assembly
- [ ] Data journalists (SQL, Python, data analysis)
- [ ] Domain experts (finance, law, regional specialists)
- [ ] Local journalists (language, cultural context, ground truth)
- [ ] Legal counsel (libel, source protection, GDPR)
- [ ] Security specialists (digital forensics, OpSec)

### Phase 3: Data Processing
- [ ] OCR for scanned documents (Tesseract, ABBYY)
- [ ] Entity extraction (people, companies, locations)
- [ ] Deduplication (hash-based, near-duplicate detection)
- [ ] Structured database creation (PostgreSQL, Neo4j for graphs)
- [ ] Full-text search indexing (Elasticsearch)

### Phase 4: Collaborative Analysis
- [ ] Shared annotation (DocumentCloud)
- [ ] Hypothesis tracking (shared spreadsheet/database)
- [ ] Findings repository (evidence linked to claims)
- [ ] Regular sync meetings (weekly minimum for active investigations)
- [ ] Conflict resolution protocol (editorial hierarchy established)

### Phase 5: Pre-Publication
- [ ] Right of reply sent to subjects (reasonable deadline: 7-14 days)
- [ ] Legal review conducted (libel, privacy, national security)
- [ ] Fact-checking independent of reporters
- [ ] Source protection confirmed (anonymization, secure disclosure)
- [ ] Coordinated publication date (for multi-outlet releases)

---

## ProPublica Investigative Checklist (20-Point Standard)

### Documentary Foundation
1. [ ] Central claim supported by primary documents (not just testimony)
2. [ ] Documents authenticated by expert or official registry
3. [ ] Competing explanations considered and tested
4. [ ] Timeline constructed from documentary evidence

### Source Verification
5. [ ] On-the-record sources identified (full name, title, organization)
6. [ ] Anonymous sources: minimum 2 editors know identity
7. [ ] Anonymous sources: direct knowledge verified (not hearsay)
8. [ ] Source motivations understood and disclosed where relevant

### Data Journalism
9. [ ] Data provenance documented (origin, acquisition method, date)
10. [ ] Methodology transparent (analysis scripts preserved, reproducible)
11. [ ] Statistical claims peer-reviewed (by data editor or external expert)
12. [ ] Visualizations accurate (not misleading scales/axes)

### Fairness
13. [ ] Right of reply given to all subjects (documented attempts)
14. [ ] Responses incorporated (or explain why excluded)
15. [ ] Context provided (not cherry-picked facts)
16. [ ] Proportionality maintained (severity of allegations vs. evidence strength)

### Editorial Standards
17. [ ] Independent fact-checker reviewed all verifiable claims
18. [ ] Legal counsel reviewed (libel, privacy, court restrictions)
19. [ ] Senior editor approved (for high-impact/sensitive stories)
20. [ ] Corrections protocol established (how errors will be addressed post-publication)

**Gold Standard**: All 20 items checked before publication for major investigations

---

## Common Pitfalls (Top 5)

| Mistake | Impact | Mitigation |
|---------|--------|------------|
| **Confirmation bias** | Miss exonerating evidence | Hypothesis framework, actively seek disconfirming evidence |
| **Single-source reliance** | Fabrication/manipulation risk | 3-source rule for critical facts |
| **Testimonial over documentary** | Bias, unreliability | Documents first, testimony corroborates |
| **Inadequate anonymization** | Source exposure, legal liability | Legal review, metadata scrubbing, secure channels |
| **Rushing publication** | Errors, retractions, credibility damage | Editorial checklist, peer review, right of reply |

### Specific Warning: Social Media Verification
**Risk**: Fake accounts, manipulated images, out-of-context videos

**Mitigation**:
- Reverse image search (TinEye, Google Images)
- EXIF data analysis (verify date/location if claimed)
- Account verification (history, followers, activity patterns)
- Platform verification badges (but insufficient alone)
- Direct contact with poster (verify identity)

---

## Quality Gates (When to Pause)

### Before Pitch
- [ ] Central hypothesis clearly stated?
- [ ] Preliminary evidence suggests hypothesis viable?
- [ ] Public interest justification clear?
- [ ] Resources available (time, expertise, budget)?

### Before Deep Investigation
- [ ] Editor approval secured?
- [ ] Legal consultation completed (libel, source protection)?
- [ ] Safety risk assessment (hostile subjects, dangerous locations)?
- [ ] Ethical considerations addressed (vulnerable subjects, privacy)?

### Before Publication
- [ ] All facts independently verified?
- [ ] Right of reply sent and incorporated/addressed?
- [ ] Legal review completed?
- [ ] Source protection measures confirmed?
- [ ] Senior editorial approval obtained?

### Post-Publication
- [ ] Corrections protocol ready?
- [ ] Source safety monitoring (for whistleblowers)?
- [ ] Archive preservation (documents, notes, correspondence)?
- [ ] Impact assessment planned (policy changes, legal outcomes)?

---

## Integration with Phronesis FCIP

### Document Management
- **Evidence hierarchy tagging**: Classify documents by reliability tier
- **Chain of custody**: Automated hash generation, access logs
- **Version tracking**: Detect document evolution (modality shifts, scope changes)
- **Deduplication**: Hash-based and near-duplicate detection

### Hypothesis Framework
- **Structured tracking**: Known facts vs. assumptions vs. gaps
- **Contradiction detection**: Flag inconsistencies across documents
- **Alternative hypotheses**: ACH-style matrix for testing

### Collaborative Features
- **Shared annotations**: Team members highlight and comment
- **Findings repository**: Evidence linked to specific claims
- **Audit trail**: Complete provenance for every finding
- **Export templates**: Investigation briefs, publication-ready reports

### Security
- **End-to-end encryption**: Document upload and storage
- **Access controls**: Role-based permissions
- **Anonymization tools**: Redaction, metadata scrubbing
- **Secure sharing**: Encrypted exports for collaboration

---

## Multi-Layered Verification Protocol

**Standard**: Minimum 3 independent sources for critical facts

### Layer 1: Primary Documents
- Original records (contracts, emails, financial statements)
- Government filings (authenticated via official registries)
- Court documents (verified via case numbers)

**Verification**: Check provenance, authenticate signatures/seals, verify metadata

### Layer 2: On-the-Record Sources
- Direct witnesses (firsthand knowledge)
- Official spokespersons (on-the-record statements)
- Expert analysts (credentials verified)

**Verification**: Identity confirmed, credentials checked, motivations understood

### Layer 3: Data Analysis
- Statistical analysis (datasets from reliable sources)
- Network analysis (relationships mapped from documents)
- Timeline analysis (chronology from dated evidence)

**Verification**: Methodology transparent, reproducible, peer-reviewed

### Layer 4: Fact-Checking
- Independent fact-checker (not involved in reporting)
- Cross-reference claims against known facts
- Challenge reporter assumptions

**Verification**: Every verifiable claim checked, discrepancies resolved

**Example (Panama Papers)**:
- Layer 1: Mossack Fonseca leaked documents (11.5M files)
- Layer 2: Interviews with implicated individuals, lawyers, whistleblowers
- Layer 3: Entity extraction, network analysis (140,000+ offshore entities)
- Layer 4: ICIJ fact-checking team + 80 partner organization reviews

---

## Network Analysis Workflow

### Entity Extraction
- [ ] Identify people (full names, aliases, roles)
- [ ] Identify organizations (companies, governments, NGOs)
- [ ] Identify locations (addresses, jurisdictions, tax havens)
- [ ] Identify relationships (ownership, control, transactions)
- [ ] Extract dates (incorporation, transactions, correspondence)

### Relationship Mapping
- [ ] Direct connections (ownership stakes, board seats)
- [ ] Indirect connections (shared addresses, common intermediaries)
- [ ] Financial flows (payments, transfers, loans)
- [ ] Communication patterns (email frequency, sender/recipient networks)
- [ ] Temporal relationships (sequence of events)

### Graph Analysis Metrics
- **Degree centrality**: Number of connections (identifies key players)
- **Betweenness centrality**: Bridge between clusters (identifies gatekeepers)
- **Community detection**: Identify subgroups (corporate structures, conspiracies)
- **Path analysis**: Trace flows (money laundering, information leaks)

### Visualization
- [ ] Force-directed layout (automatic clustering)
- [ ] Hierarchical tree (corporate ownership structures)
- [ ] Sankey diagram (financial flows)
- [ ] Timeline integration (animate network evolution)
- [ ] Interactive exploration (click entity → related documents)

**Tools**: Linkurious, Gephi, Neo4j Browser, Palantir (for large scale)

---

## BBC Verification Checklist

### Image/Video Verification
- [ ] Reverse image search (TinEye, Google, Yandex)
- [ ] EXIF data analysis (date, location, camera model)
- [ ] Geolocation verified (landmarks, street signs, shadows)
- [ ] Weather cross-check (claimed date/location vs. historical weather)
- [ ] Language/accents analyzed (if audio)
- [ ] Shadows/lighting consistent with claimed time/location
- [ ] Original source contacted (if possible)

### Social Media Verification
- [ ] Account age and history reviewed
- [ ] Follower/following patterns examined (bot indicators)
- [ ] Previous posts consistent with current claim
- [ ] Geolocation tags verified
- [ ] Direct message contact attempted (verify poster identity)
- [ ] Cross-platform presence checked (consistency)

### Breaking News Protocol
- [ ] Two independent sources minimum (for fast-moving stories)
- [ ] Official confirmation sought (police, government, hospitals)
- [ ] On-scene verification (reporter physically present or trusted local)
- [ ] Corrective protocol ready (prepared to update/retract if new info emerges)

**Speed vs. Accuracy**: "First to report is worth nothing if you're wrong."

---

## Resources and Standards

### Primary Organizations
- **ICIJ** (International Consortium of Investigative Journalists): Global collaboration model
- **ProPublica**: US investigative journalism standards
- **OCCRP** (Organized Crime and Corruption Reporting Project): Cross-border corruption investigations
- **GIJN** (Global Investigative Journalism Network): Training and resources
- **IRE** (Investigative Reporters and Editors): US-based professional association

### Key Tools
- **Aleph**: OCCRP's 4+ billion document search engine
- **Datashare**: ICIJ's local document analysis platform (open-source)
- **DocumentCloud**: Collaborative document annotation
- **OpenRefine**: Data cleaning and entity reconciliation
- **Neo4j/Linkurious**: Graph database and network visualization

### Training Resources
- ICIJ Journalism Academy (free courses)
- Knight Center for Journalism (online courses)
- GIJN Resource Center (methodologies, tools, case studies)

### Legal Resources
- Media Law Resource Center (MLRC): Libel defense
- Reporters Committee for Freedom of the Press: Legal hotline
- CPJ (Committee to Protect Journalists): Safety protocols

---

## Right of Reply Template

**Subject**: Request for Response - [Publication] Investigation

Dear [Subject Name/Organization],

I am a reporter with [Publication] investigating [brief description of topic]. Our investigation has uncovered information related to [your organization/yourself], and we are writing to give you an opportunity to respond before publication.

**Allegations/Findings:**
1. [Specific claim with evidence basis]
2. [Specific claim with evidence basis]
3. [Specific claim with evidence basis]

**Questions:**
1. [Direct question seeking clarification or rebuttal]
2. [Direct question seeking clarification or rebuttal]
3. [Direct question seeking clarification or rebuttal]

We aim to publish this story on [date]. To ensure accuracy and fairness, we request your response by [deadline: typically 7-14 days].

You may respond by:
- Written statement (email acceptable)
- Phone interview (can be recorded for accuracy)
- In-person interview
- Legal counsel may be present

Please confirm receipt of this request.

Sincerely,
[Reporter Name]
[Contact Information]

**Legal Note**: Document all attempts to contact. If no response, note in publication: "We contacted [Subject] on [date] via [method]. As of publication, we have not received a response."

---

## Timeline of Major Collaborative Investigations

| Investigation | Year | Documents | Journalists | Organizations | Impact |
|---------------|------|-----------|-------------|---------------|--------|
| **Panama Papers** | 2016 | 11.5M (2.6TB) | 370+ | 80 countries | Resignations (Iceland PM), prosecutions, $1.2B recovered |
| **Paradise Papers** | 2017 | 13.4M | 380+ | 67 countries | Tax evasion revelations, policy changes |
| **Pandora Papers** | 2021 | 11.9M (2.9TB) | 600+ | 150 orgs | Offshore wealth exposure, asset freezes |
| **FinCEN Files** | 2020 | 2,500 SARs | 400+ | 110 orgs | Banking compliance reforms |
| **Implant Files** | 2018 | 5.4M records | 250+ | 59 orgs | Medical device regulation reforms |

**Lesson**: Scale is achievable through secure collaboration + structured methodology

---

## Document Control

**Version**: Quick Start 1.0
**Date**: 2026-01-17
**Source**: 02-journalism-investigations.md (106,301 bytes)
**Lines**: ~498
**Format**: Reference card (printable)

**Next steps**: Read full methodology for:
- ICIJ technical architecture (Datashare, Blacklight, Aleph internals)
- OCCRP cross-border investigation protocols
- BBC Verify methodology (social media, satellite imagery, crowdsourcing)
- Advanced network analysis techniques
- Data journalism statistical methods

---

*"Documents don't have agendas. Documents don't forget. Documents don't exaggerate. Start with documents, corroborate with testimony."*

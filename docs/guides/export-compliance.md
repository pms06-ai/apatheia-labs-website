# Export Compliance

Standards for court-ready exports and expert witness use.

---

## Overview

Phronesis generates exports suitable for legal proceedings, expert testimony, and professional publication. This guide covers standards and best practices.

---

## Report Types

### PDF Reports

**Court-Ready Format**:
- Professional appearance
- Citation links to source documents
- Page numbers and headers
- Table of contents
- Exhibits section

**Use Cases**:
- Court filings
- Expert reports
- Professional presentations
- Publication

### DOCX Reports

**Editable Format**:
- Track changes capability
- Comment integration
- Easy modification
- Citation management

**Use Cases**:
- Draft reports
- Collaborative editing
- Attorney-reviewed versions
- Custom formatting

### JSON Export

**Machine-Readable**:
- Complete data structure
- Programmatic access
- Custom analysis
- Integration with other tools

**Use Cases**:
- Custom visualizations
- Statistical analysis
- Database integration
- API development

### Audit Trail

**Complete Evidence Chain**:
- Every analytical step
- All source citations
- Reasoning transparency
- Replication support

**Use Cases**:
- Methodology review
- Daubert challenges
- Independent verification
- Peer review

---

## Court Admissibility Standards

### Authentication

**Federal Rule of Evidence 901** (USA): Evidence must be authenticated.

**For S.A.M. Reports**:
- Analyst affidavit or testimony
- Document chain of custody
- Methodology documentation
- Software version and configuration

### Hearsay

**FRE 802**: Hearsay generally inadmissible.

**Exceptions**:
- **FRE 803(6)**: Business records
- **FRE 803(8)**: Public records
- **FRE 807**: Residual exception

**S.A.M. Reports**:
- Not offered for truth of underlying statements
- Analysis of documents, not adoption of claims
- Expert opinion based on evidence review

### Expert Testimony

**FRE 702**: Expert qualified by knowledge, skill, experience, training, education.

**S.A.M. as Basis**:
- Methodology must be reliable (Daubert)
- Expert must be qualified
- Analysis must assist trier of fact

See [Expert Witness Standards](../legal/expert-witness-standards.md).

---

## Report Structure

### Title Page

- Case name and number
- Report title
- Date
- Analyst name and credentials
- Prepared for (attorney/organization)

### Executive Summary

- Brief case overview
- Key findings (2-3 paragraphs)
- Summary of methodology

### Table of Contents

- Section headings
- Page numbers
- List of exhibits

### Qualifications

- Education and training
- Experience with S.A.M.
- Relevant domain expertise
- Publications
- Previous testimony

### Assignment

- What you were asked to analyze
- Scope of review
- Time period covered

### Materials Reviewed

- Complete document list with identifiers
- Additional materials (case law, literature)
- Note any missing documents

### Methodology

- S.A.M. framework explanation
- Four-phase cascade model
- Eight contradiction types
- Analytical process
- Software and version
- AI provider used (if applicable)
- Validation approach

### Analysis

**ANCHOR Phase**:
- Claim origins identified
- Evidential quality assessments
- False premises flagged

**INHERIT Phase**:
- Propagation patterns documented
- Mutations detected
- Institutional boundaries crossed

**COMPOUND Phase**:
- Authority markers identified
- Authority laundering detected
- Authority accumulation traced

**ARRIVE Phase**:
- Outcomes analyzed
- But-for causation assessed
- Harm evaluated

**Contradictions**:
- By type
- With source citations
- Severity assessments

**Timeline**:
- Chronological reconstruction
- Temporal inconsistencies

### Findings

- Primary findings with supporting evidence
- Secondary observations
- Statistical summary

### Limitations

- Document gaps
- Analytical constraints
- Uncertainties
- Qualifications

### Opinions

- Clear statement of opinions
- Basis for each
- Confidence levels

### Exhibits

- Propagation graphs
- Timeline visualizations
- Authority accumulation charts
- Citation chains
- Key document excerpts

### References

- Source documents
- Legal citations
- Academic literature

### Certification

"I certify that the opinions expressed herein are based on sufficient facts and data and are the product of reliable principles and methods that I have applied reliably to the facts of this case."

### Appendices

- Complete document list
- Entity glossary
- Acronym list
- Detailed methodological notes

---

## Citation Standards

### Source Citation Format

**Within Text**:
> "X occurred on date Y" (Doc 15, p. 23, ¶ 4)

**In Footnotes**:
1. Document ID, Title, Date, Page, Paragraph

### Verification Requirement

Every factual claim must be:
- Cited to specific source
- Quote accurate
- Context preserved
- Checkable by reader

---

## Redaction for Export

### Privacy Protection

**Always Redact**:
- Names of non-public figures
- Children's information
- Medical details
- Financial information
- Addresses and contact info

See [Redaction Guidelines](../case-studies/redaction-guidelines.md).

### Balancing Credibility and Privacy

**Provide Sufficient Detail**:
- Understand institutional failures
- Verify analytical reasoning
- Assess methodology quality

**Without Compromising**:
- Individual privacy
- Safety or security
- Legal compliance

---

## Metadata and Document Properties

### Clean Metadata

**Remove** before export:
- Author name (unless intended)
- Revision history
- Comments and tracked changes (unless intended)
- Hidden text
- File path information

**Phronesis** includes metadata cleaning option in export settings.

---

## Version Control

### Report Versioning

**Version Numbers**: v1.0, v1.1, v2.0

**Change Log**: Document significant changes between versions

**Dated Versions**: Include date in filename: `Report_v1.0_2025-01-16.pdf`

### Track Changes

**DOCX Format**: Use track changes for revisions after review

**Document Changes**: Note what changed and why in cover letter or memo

---

## Electronic Discovery Standards

### ESI (Electronically Stored Information)

**Native Format vs. PDF**:
- Native: Preserves metadata, searchability
- PDF: Universal accessibility, appearance control

**Phronesis**: Generates PDF by default; JSON available for native format equivalent

### Production Format

**Consult Discovery Order**:
- Specified format
- Metadata requirements
- Bates numbering
- Privilege log

---

## Daubert Binder

**For Expert Testimony**, prepare:

1. **Expert CV**: Current curriculum vitae
2. **Expert Report**: Complete S.A.M. analysis report
3. **Methodology Paper**: S.A.M. methodology documentation
4. **Validation Studies**: Any validation research
5. **Source Documents**: Key documents analyzed
6. **Exhibits**: All visualizations and charts
7. **Prior Testimony**: List of previous testimony
8. **Fee Information**: Compensation disclosure
9. **Literature**: Supporting academic literature
10. **Software Documentation**: Phronesis technical documentation

---

## Quality Checklist

Before finalizing export:

- [ ] All citations verified and accurate
- [ ] Quotes in context
- [ ] No typos or errors
- [ ] Proper redactions
- [ ] Exhibits numbered and referenced
- [ ] Page numbers correct
- [ ] Table of contents accurate
- [ ] Metadata cleaned
- [ ] Version number and date
- [ ] Certifications and affirmations included
- [ ] Independent review completed

---

## Delivery

### File Format

**PDF**: Universally accessible, preserves formatting

**Encryption**: For sensitive reports, use encrypted PDF with password

**File Size**: Large reports may need compression or multiple files

### Transmission

**Secure Methods**:
- Secure file transfer services
- Encrypted email
- Hand delivery (for highly sensitive)

**Avoid**:
- Unencrypted email for sensitive content
- Public file sharing services

---

## Retention

### Work Product

**Maintain**:
- All versions of report
- Source documents
- Notes and work papers
- Correspondence about analysis

**For**:
- Daubert challenge defense
- Cross-examination preparation
- Ethical compliance
- Replication by others

### Destruction

**When Appropriate**: Follow attorney guidance on retention schedule

**Secure Deletion**: Use secure deletion tools for sensitive materials

---

Last updated: 2025-01-16

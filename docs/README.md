# Phronesis Documentation

**Forensic intelligence platform exposing institutional dysfunction through systematic, evidence-based analysis.**

"Clarity Without Distortion."

---

## Quick Navigation

### Getting Started
- [Getting Started Guide](guides/getting-started.md) - Installation, setup, and first analysis
- [Analysis Workflow](guides/analysis-workflow.md) - Step-by-step analysis process
- [Best Practices](guides/best-practices.md) - Tips for effective use

### Core Documentation
- [Research Papers](research/) - Academic foundations and methodology
- [Technical Documentation](technical/) - Architecture, API, and security
- [User Guides](guides/) - Practical how-to guides
- [Legal Resources](legal/) - Compliance, ethics, and standards

### Reference Materials
- [Reading List](resources/reading-list.md) - Curated bibliography (153 books)
- [Glossary](resources/glossary.md) - Key terms and definitions
- [FAQ](resources/faq.md) - Frequently asked questions
- [Video Tutorials](resources/video-tutorials/) - Visual learning resources

### Case Studies
- [Case Studies](case-studies/) - Real-world applications and examples
- [Template](case-studies/template.md) - Case study documentation template
- [Redaction Guidelines](case-studies/redaction-guidelines.md) - Privacy protection

---

## What is Phronesis?

Phronesis is a desktop forensic intelligence platform for systematic analysis of institutional document chains. It implements the Systematic Adversarial Methodology (S.A.M.) to expose how false premises propagate through institutions, accumulate spurious authority, and contribute to harmful outcomes.

### Core Capabilities

**Document Analysis**
- PDF extraction with OCR support
- Entity extraction and timeline construction
- Contradiction detection (8 formal types)
- Citation network analysis

**S.A.M. Framework**
- ANCHOR: Trace claim origins and evidential basis
- INHERIT: Track propagation without verification
- COMPOUND: Identify authority laundering
- ARRIVE: Link false premises to outcomes

**11 Analysis Engines**
- Entity tracking and relationship mapping
- Temporal analysis and timeline validation
- Argumentation structure analysis
- Bias and rhetorical pattern detection
- Contradiction and inconsistency detection
- Accountability gap identification
- Professional standards violation checking
- Omission and selective citation detection
- Expert opinion validation
- Documentary evidence quality assessment
- Narrative coherence analysis

**Export and Reporting**
- PDF reports with citation links
- DOCX reports with tracked changes
- Audit trails with complete evidence chains
- JSON for programmatic access

### Use Cases

**Legal Analysis**
- Wrongful conviction investigation
- Civil litigation support
- Family court case analysis
- Expert witness preparation

**Investigative Journalism**
- Institutional failure investigation
- Public accountability reporting
- Source document verification
- Timeline reconstruction

**Institutional Oversight**
- Internal affairs investigation
- Regulatory compliance review
- Quality assurance analysis
- Root cause investigation

**Academic Research**
- Institutional epistemology studies
- Document analysis methodology
- False premise propagation research
- Authority laundering studies

---

## Documentation Structure

### Research Papers (website/docs/research/)

Academic foundations for the S.A.M. methodology:

- **[Methodology Paper](../website/docs/research/methodology-paper.md)** - Formal presentation of S.A.M. framework with theoretical foundations, cascade model, contradiction taxonomy, and validation framework
- **[Epistemology](../website/docs/research/epistemology.md)** - How institutions produce and certify knowledge, epistemic risks of institutional structure
- **[Contradiction Taxonomy](../website/docs/research/contradiction-taxonomy.md)** - Formal classification of 8 contradiction types with detection criteria
- **[Cascade Theory](../website/docs/research/cascade-theory.md)** - ANCHOR → INHERIT → COMPOUND → ARRIVE model of false premise propagation
- **[Validation Studies](../website/docs/research/validation-studies.md)** - Empirical validation framework, reliability testing, sensitivity/specificity analysis
- **[Bibliography](../website/docs/research/bibliography.md)** - Complete academic references and citations

### Technical Documentation (docs/technical/)

Implementation details and system architecture:

- **[Architecture](technical/architecture.md)** - System design, component interaction, data flow
- **[Security Whitepaper](technical/security-whitepaper.md)** - Threat model, security controls, encryption, audit logging
- **[API Reference](technical/api-reference.md)** - Tauri command interface, data schemas, integration points

### User Guides (docs/guides/)

Practical how-to documentation:

- **[Getting Started](guides/getting-started.md)** - Installation, initial setup, configuration
- **[Analysis Workflow](guides/analysis-workflow.md)** - Step-by-step analysis process from document upload to report generation
- **[Engine Guide](guides/engine-guide.md)** - Detailed guide to each of the 11 analysis engines
- **[Export Compliance](guides/export-compliance.md)** - Standards for court-ready exports and expert witness use
- **[Best Practices](guides/best-practices.md)** - Tips for effective analysis, common pitfalls, optimization strategies

### Legal Resources (docs/legal/)

Compliance, ethics, and professional standards:

- **[Overview](legal/README.md)** - Legal framework and compliance summary
- **[Privacy Policy](legal/privacy-policy.md)** - Data handling and user privacy
- **[Terms of Service](legal/terms-of-service.md)** - Usage terms and conditions
- **[Data Handling](legal/data-handling.md)** - Data retention, deletion, and security practices
- **[Ethical Guidelines](legal/ethical-guidelines.md)** - Responsible use principles and ethical constraints
- **[Regulatory Compliance](legal/regulatory-compliance.md)** - GDPR, HIPAA, legal discovery standards
- **[Expert Witness Standards](legal/expert-witness-standards.md)** - Admissibility, methodology disclosure, Daubert/Frye standards

### Resources (docs/resources/)

Reference materials and learning resources:

- **[Reading List](resources/reading-list.md)** - 153 books organized by domain (philosophy, social epistemology, cognitive science, institutional theory, legal analysis, methodology)
- **[Glossary](resources/glossary.md)** - Key terms, technical vocabulary, S.A.M. concepts
- **[FAQ](resources/faq.md)** - Common questions about methodology, usage, limitations
- **[Video Tutorials](resources/video-tutorials/)** - Screencasts and demonstrations

### Case Studies (docs/case-studies/)

Real-world applications and validation:

- **[Template](case-studies/template.md)** - Structured template for documenting case studies
- **[Redaction Guidelines](case-studies/redaction-guidelines.md)** - Privacy protection and anonymization standards
- **[Effectiveness Metrics](case-studies/effectiveness-metrics.md)** - Measuring S.A.M. impact and validation
- **[Validation Reports](case-studies/validation-reports/)** - Formal validation study results

---

## Key Concepts

### Systematic Adversarial Methodology (S.A.M.)

A principled framework for forensic analysis of institutional document chains. S.A.M. addresses the epistemological problem of false premise propagation through institutional systems, where unverified claims gain authority through repetition and institutional endorsement rather than evidential foundation.

### The Four-Phase Cascade Model

**ANCHOR** - Premise Origin
Identify where claims first enter the institutional record and assess their initial evidential basis. Distinguish primary sources from speculation, professional opinion from hearsay.

**INHERIT** - Propagation Without Verification
Track how claims propagate across documents and institutional boundaries. Detect mutations: amplification (uncertainty → certainty), scope expansion (once → repeatedly), attribution shifts.

**COMPOUND** - Authority Accumulation
Map how claims accumulate institutional authority through repetition and endorsement. Identify authority laundering: low-evidence claims gaining high institutional credibility.

**ARRIVE** - Outcome Linkage
Trace connections from false premises to harmful outcomes. Conduct but-for causation analysis: would the outcome have occurred without the false premise?

### Eight Contradiction Types

1. **SELF** - Internal contradictions within single document
2. **INTER_DOC** - Contradictions between documents
3. **TEMPORAL** - Timeline impossibilities and date inconsistencies
4. **EVIDENTIARY** - Conclusions not supported by cited evidence
5. **MODALITY_SHIFT** - Unjustified certainty changes (possibly → definitely)
6. **SELECTIVE_CITATION** - Cherry-picked references that distort source meaning
7. **SCOPE_SHIFT** - Unexplained generalizations (once → repeatedly)
8. **UNEXPLAINED_CHANGE** - Position reversals without justification

### Authority Laundering

The phenomenon where weakly-founded claims gain credibility through institutional processing:

1. Speculation enters record (low authority)
2. Adopted by professional assessment (medium authority)
3. Cited in official report (high authority)
4. Becomes basis for court finding (highest authority)

At each step, actors may reasonably assume prior verification occurred. If no verification happened at any step, the final high-authority determination rests on the original speculation.

---

## Technical Stack

**Desktop Application**: Tauri 2.9 (Rust) + Vite 6 + React 18 + React Router 7

**Frontend**: TypeScript, Tailwind CSS, Radix UI, Zustand, TanStack Query

**Backend**: Rust 2021, SQLite (sqlx), Tokio async runtime

**Document Processing**: pdf-extract, Tesseract OCR, Docker-based tools

**AI Analysis**: Multi-provider support (Claude, Groq, Gemini) via Vercel AI SDK

**Workspaces**:
- MCP server (@apatheia/mcp-server) - Claude integration
- Obsidian plugin (obsidian-phronesis) - Knowledge vault sync

---

## Contributing to Documentation

Documentation contributions are welcome. Please follow these guidelines:

**Style**
- Clear, concise, technical language
- Active voice preferred
- Code examples should be complete and runnable
- Screenshots should be annotated for clarity

**Organization**
- Place files in appropriate directory
- Update this README when adding new sections
- Link liberally to related content
- Maintain consistent heading structure

**Technical Accuracy**
- Reference source code where applicable
- Test code examples before submitting
- Keep API documentation synchronized with implementation
- Note version-specific behavior

**Legal and Ethical Review**
- All case studies must be properly redacted
- Ensure compliance with privacy policies
- Respect professional standards and ethical guidelines
- When in doubt, err on the side of privacy protection

---

## Support and Contact

**Issues**: Report bugs and request features via GitHub Issues

**Discussions**: Ask questions and share insights in GitHub Discussions

**Security**: Report security vulnerabilities to security@apatheia.dev (when established)

**Professional Inquiries**: Contact via project website (when established)

---

## License

Copyright 2025 Apatheia Labs. All rights reserved.

This documentation is provided for informational purposes. The software and methodology described herein are subject to the project license terms.

---

## Citation

If you use Phronesis or S.A.M. methodology in academic work, please cite:

```
Phronesis: A Systematic Adversarial Methodology for Institutional Accountability Analysis
Apatheia Labs (2025)
https://github.com/apatheia-labs/phronesis
```

For the formal methodology paper:

```
Systematic Adversarial Methodology (S.A.M.): A Framework for Forensic Analysis of Institutional Document Chains
[Author list when published]
[Journal/Conference when published]
```

---

Last updated: 2025-01-16

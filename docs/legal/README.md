# Legal and Compliance Documentation

Legal framework, compliance standards, and ethical guidelines for Phronesis platform and S.A.M. methodology.

---

## Overview

This section provides essential legal and ethical information for users, developers, and organizations working with Phronesis and S.A.M. methodology. It covers data protection, professional standards, regulatory compliance, and ethical use guidelines.

---

## Key Documents

### Privacy and Data Protection

**[Privacy Policy](privacy-policy.md)**
- What data Phronesis collects (minimal)
- How data is stored (local-first)
- User rights and controls
- Third-party data processing (AI providers)
- GDPR and CCPA compliance

**[Data Handling](data-handling.md)**
- Data retention and deletion
- Security measures and encryption
- Backup and recovery
- Data breach response
- Audit logging

### Terms and Conditions

**[Terms of Service](terms-of-service.md)**
- License terms
- Acceptable use policy
- Disclaimers and limitations of liability
- Intellectual property rights
- Termination and disputes

### Professional and Ethical Standards

**[Ethical Guidelines](ethical-guidelines.md)**
- Responsible use principles
- Power dynamics and vulnerable populations
- Institutional accountability vs. individual blame
- Transparency and due process
- Conflicts of interest

**[Expert Witness Standards](expert-witness-standards.md)**
- Admissibility requirements (Daubert/Frye)
- Methodology disclosure obligations
- Report structure and content
- Testimony preparation
- Professional conduct

### Regulatory Compliance

**[Regulatory Compliance](regulatory-compliance.md)**
- GDPR (European Union)
- CCPA (California)
- HIPAA (health information)
- Legal discovery standards
- International considerations

---

## Key Principles

### Local-First Architecture

Phronesis is designed with privacy as a core principle:

**Local storage**: All case data stored on user's device, not cloud servers

**User control**: Complete control over data access and deletion

**No mandatory telemetry**: No tracking or analytics without explicit consent

**Offline capability**: Core functionality works without internet (AI-assisted features require API calls)

### Minimal Data Collection

Phronesis collects minimal data:

**No account required**: Use without registration

**No usage tracking**: No analytics by default (opt-in only for improvement)

**No document uploads**: Documents processed locally

**API calls**: Only when using AI-assisted features, subject to provider terms

### Transparency

**Open methodology**: S.A.M. is fully documented and transparent

**Open source**: Community edition is open source (when released)

**Audit trails**: Complete record of analytical processes

**Citation chains**: All findings linked to source documents

---

## Professional Responsibility Considerations

### For Attorneys

**Confidentiality**: Ensure use of Phronesis complies with attorney-client privilege and confidentiality rules

**Competence**: Maintain competence in tools used for client representation (ABA Model Rule 1.1 Comment 8)

**Work product**: Consider whether S.A.M. analyses constitute work product subject to disclosure

**Expert disclosure**: If using S.A.M. analysis for expert testimony, ensure compliance with disclosure rules

**Conflicts**: Identify and manage potential conflicts of interest

### For Journalists

**Source protection**: Ensure confidential sources protected in document handling

**Verification**: S.A.M. supplements but doesn't replace journalistic verification

**Fairness**: Provide opportunity for response to findings

**Privacy**: Redact unnecessary personal information from published analyses

**Accuracy**: Verify all claims and citations before publication

### For Researchers

**IRB approval**: Obtain institutional review board approval for human subjects research

**Informed consent**: Ensure appropriate consent for use of case materials

**Anonymization**: Properly anonymize case studies and examples

**Data management**: Secure storage and handling of research data

**Publication ethics**: Follow academic integrity standards

### For Institutional Oversight

**Independence**: Maintain independence from institutions under review

**Procedural fairness**: Ensure reviewed parties have opportunity to respond

**Proportionality**: Apply S.A.M. appropriately (serious cases, not routine matters)

**Confidentiality**: Respect confidentiality of internal documents where appropriate

**Remedial focus**: Emphasize systemic improvement over individual blame

---

## Data Subject Rights

Under GDPR and similar regulations, individuals have rights regarding their personal data:

**Right of access**: Individuals can request information about data processing

**Right to rectification**: Correct inaccurate personal data

**Right to erasure**: "Right to be forgotten" in certain circumstances

**Right to restriction**: Limit processing under certain conditions

**Right to data portability**: Receive data in structured, machine-readable format

**Right to object**: Object to processing for certain purposes

For Phronesis users: Since data is stored locally, you control all data subject rights for your cases. If you receive data subject requests regarding cases you've analyzed, consult legal counsel about obligations.

---

## Third-Party Data Processing

### AI Providers

When using AI-assisted analysis, document chunks are sent to selected AI provider:

**Claude (Anthropic)**:
- Terms: https://www.anthropic.com/legal/commercial-terms
- Privacy: https://www.anthropic.com/legal/privacy
- Data use: Committed to not training on user data (enterprise plans)

**Groq**:
- Terms: https://groq.com/terms/
- Privacy: https://groq.com/privacy-policy/

**Gemini (Google)**:
- Terms: https://ai.google.dev/terms
- Privacy: https://policies.google.com/privacy

**Important**: Review each provider's terms before use. For sensitive cases, consider:
- Enterprise agreements with data processing addendums
- Local model alternatives (future feature)
- Manual analysis without AI assistance

### Data Processing Agreements

Organizations using Phronesis should:
1. Review AI provider terms
2. Execute data processing agreements where needed
3. Document legal basis for processing
4. Inform data subjects of AI processing (where required)
5. Maintain records of processing activities

---

## Liability and Disclaimers

### No Warranty

Phronesis is provided "as is" without warranties of any kind. See [Terms of Service](terms-of-service.md) for complete terms.

### Professional Judgment Required

S.A.M. is a tool to assist, not replace, professional judgment:
- Findings require human review and verification
- AI outputs may contain errors or hallucinations
- Methodology is emerging and subject to refinement
- Users responsible for appropriate application

### Limitation of Liability

See [Terms of Service](terms-of-service.md) for limitation of liability provisions.

Users are responsible for:
- Appropriate use of tool
- Verification of findings
- Compliance with professional obligations
- Data protection and confidentiality

---

## Intellectual Property

### Phronesis Platform

**Copyright**: Apatheia Labs holds copyright in Phronesis software

**License**: Software licensed under [license TBD - likely dual license: open source for community, commercial for professional]

**Trademarks**: "Phronesis" and "S.A.M." are trademarks of Apatheia Labs

### S.A.M. Methodology

**Methodology**: Freely usable with appropriate citation

**Publications**: Academic papers describing S.A.M. subject to journal copyright

**Attribution**: Please cite methodology paper when using S.A.M.

### User Content

**Your data**: You retain all rights to documents and analyses you create

**Reports**: Generated reports are your intellectual property

**Sharing**: You control whether and how to share your analyses

---

## Export Controls

Phronesis is designed for legitimate investigative, legal, and oversight purposes.

**Prohibited uses**:
- Surveillance of individuals for illegitimate purposes
- Violation of privacy rights
- Harassment or intimidation
- Circumventing legal protections

**Export compliance**:
- Software may be subject to export control regulations
- Users responsible for compliance with applicable laws
- Report suspected misuse to project maintainers

---

## Security and Data Breach Response

### Security Measures

See [Security Whitepaper](../technical/security-whitepaper.md) and [Data Handling](data-handling.md) for complete security documentation.

**Summary**:
- Local data storage with encryption at rest
- Secure credential management (OS keyring)
- Audit logging of sensitive operations
- Regular security updates

### Breach Response

If you suspect a security vulnerability or data breach:

1. **Do not disclose publicly** (responsible disclosure)
2. **Contact**: security@apatheia.dev (when established) or GitHub security advisories
3. **Provide**: Description of vulnerability, steps to reproduce, potential impact
4. **Cooperate**: Work with maintainers on patch and disclosure timeline

Users experiencing data breaches involving case materials should consult legal counsel about notification obligations.

---

## Regulatory Guidance by Jurisdiction

### United States

**Federal**:
- HIPAA (health information)
- Gramm-Leach-Bliley (financial information)
- Federal Rules of Civil Procedure (discovery)
- Federal Rules of Evidence (expert testimony)

**State**:
- State privacy laws (California CCPA, etc.)
- State rules of professional conduct (attorneys)
- State licensing requirements (experts)

### European Union

**GDPR**: General Data Protection Regulation applies to processing of EU residents' data

**Key considerations**:
- Legal basis for processing (consent, legitimate interest, legal obligation)
- Data protection impact assessment (DPIA) for high-risk processing
- Data protection officer (DPO) requirements for certain organizations
- Cross-border transfer restrictions

### United Kingdom

**UK GDPR**: Post-Brexit data protection framework, largely similar to EU GDPR

**Additional**: ICO guidance on data processing

### Other Jurisdictions

Consult local legal counsel regarding:
- Data protection laws
- Professional conduct rules
- Expert witness standards
- Discovery rules

---

## Compliance Checklist for Organizations

Before deploying Phronesis in your organization:

- [ ] Review data protection obligations (GDPR, CCPA, etc.)
- [ ] Assess legal basis for processing personal data
- [ ] Execute data processing agreements with AI providers
- [ ] Document security measures and controls
- [ ] Train staff on privacy and security protocols
- [ ] Establish data retention and deletion policies
- [ ] Create incident response procedures
- [ ] Review professional responsibility obligations
- [ ] Ensure compliance with licensing terms
- [ ] Designate responsible person for compliance

---

## Questions and Support

### Legal Questions

For legal questions about using Phronesis:
- Consult your legal counsel
- Review documentation in this legal section
- Contact project maintainers for clarification (not legal advice)

### Compliance Support

Organizations needing compliance support should:
- Consult privacy counsel
- Conduct data protection impact assessments
- Document processing activities
- Implement appropriate security measures

### Reporting Concerns

To report:
- **Security issues**: security@apatheia.dev (when established) or GitHub security advisories
- **Misuse**: Report via GitHub or contact maintainers
- **Legal concerns**: Consult legal counsel; notify maintainers if project-related

---

## Updates

This legal documentation is subject to updates. Users will be notified of material changes through:
- Application notifications (for installed software)
- GitHub release notes
- Email notifications (if subscribed)

Continued use after changes constitutes acceptance of updated terms.

---

## Governing Law

See [Terms of Service](terms-of-service.md) for governing law and dispute resolution provisions.

---

Last updated: 2025-01-16

**Note**: This documentation provides general information and should not be construed as legal advice. Consult qualified legal counsel for advice specific to your situation and jurisdiction.

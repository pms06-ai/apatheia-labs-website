# Privacy Policy

**Last Updated: 2025-01-16**

This Privacy Policy describes how Phronesis ("we," "our," or "the application") collects, uses, and protects information.

---

## Core Privacy Principles

### Local-First Architecture

Phronesis is designed with privacy as a foundational principle:

**Local Storage**: All case data is stored locally on your device, not on remote servers

**No Cloud Sync**: Data does not automatically sync to cloud services

**User Control**: You have complete control over your data

**Offline Operation**: Core functionality works without internet connectivity

### Minimal Data Collection

We collect minimal data necessary for application functionality:

**No Account Required**: Use Phronesis without registration or account creation

**No Tracking**: No analytics or usage tracking by default

**No Document Uploads**: Documents are processed entirely on your device

**Optional Telemetry**: Crash reports and usage analytics are strictly opt-in

---

## Information We Collect

### Information You Provide

**Case Documents**: Documents you import into Phronesis are stored locally on your device

**Analysis Data**: Claims, annotations, and findings you create are stored locally

**Configuration**: Application settings and preferences stored locally

**AI Provider API Keys**: Encrypted and stored in OS-secure keyring

### Information Collected Automatically

**None by Default**: Phronesis does not collect usage data, analytics, or telemetry unless you explicitly opt in

**Optional Telemetry** (if you opt in):
- Application crashes and errors
- Feature usage statistics (anonymized)
- Performance metrics (anonymized)
- No personally identifiable information
- No case content or document data

### Third-Party Data Processing

When using AI-assisted analysis features:

**Document Chunks Sent to AI Providers**: Text segments from your documents are sent to selected AI provider (Claude, Groq, or Gemini) for analysis

**Subject to Provider Terms**: Processing governed by AI provider's terms of service and privacy policy

**Your Choice**: You control which provider to use and can opt out of AI features entirely

**No Training**: Enterprise AI providers typically commit to not training models on your data (verify provider terms)

---

## How We Use Information

### Local Processing

All data processing occurs on your device:
- Document text extraction
- Entity recognition
- Timeline construction
- Contradiction detection
- Report generation

### AI-Assisted Features (Optional)

If you choose to use AI features:
- Text chunks sent to AI provider for analysis
- Providers process data according to their terms
- Results returned to your device and stored locally
- We do not receive or store your analysis data on our servers

### Telemetry (Opt-In Only)

If you opt in to telemetry:
- Anonymized crash reports help us fix bugs
- Anonymized usage statistics help us improve features
- No personally identifiable information collected
- No case content collected
- You can opt out at any time

---

## Data Storage and Security

### Local Storage

**Where**: All data stored in application data directory on your device

**Encryption**: Database encrypted at rest using OS-provided encryption

**Backups**: You control backups through OS-level backup systems

**Deletion**: Deleting a case permanently removes all associated data

### Credentials

**API Keys**: Stored in OS-secure keyring (Keychain on macOS, Credential Manager on Windows, Secret Service on Linux)

**Encryption**: Credentials encrypted using OS security mechanisms

**Access**: Only Phronesis application can access stored credentials

### Security Measures

- Encryption at rest for database
- Secure credential storage
- Audit logging for sensitive operations
- Regular security updates
- See [Security Whitepaper](../technical/security-whitepaper.md) for details

---

## Data Sharing and Disclosure

### We Do Not Share Your Data

Phronesis does not:
- Sell or rent your data
- Share data with third parties (except AI providers when you use AI features)
- Upload case materials to our servers
- Track your usage for advertising or marketing

### AI Provider Processing

When using AI features:
- You are choosing to send data to AI provider
- Processing governed by provider's privacy policy
- Review provider terms before using AI features:
  - Claude (Anthropic): https://www.anthropic.com/legal/privacy
  - Groq: https://groq.com/privacy-policy/
  - Gemini (Google): https://policies.google.com/privacy

### Legal Obligations

We may disclose information if required by law:
- Valid subpoena or court order
- Legal process
- Protection of legal rights

However, given local-first architecture, we typically do not possess user data to disclose.

### Export by User

You control export and sharing of your analyses:
- Generate reports for sharing (PDF, DOCX, JSON)
- Share case files with collaborators
- Publish findings (with appropriate redactions)

You are responsible for:
- Ensuring appropriate redactions
- Complying with confidentiality obligations
- Protecting privacy of individuals in documents

---

## Your Rights and Choices

### Access and Control

**Full Control**: You have complete control over all data as it's stored on your device

**Access**: Access all data through application interface or directly in file system

**Export**: Export all data in multiple formats

**Deletion**: Delete cases and all associated data at any time

### Data Portability

**Open Formats**: Data stored in open, documented formats

**Export Options**: JSON export for programmatic access

**Case Files**: Export complete case for transfer to another device or user

### Opt-Out of AI Features

**Disable AI**: Use Phronesis without AI features entirely

**Choose Provider**: Select which AI provider to use

**Manual Analysis**: All features available through manual analysis without AI

### Opt-Out of Telemetry

**Disabled by Default**: Telemetry off unless you opt in

**Easy Opt-Out**: Disable in settings at any time

**Granular Control**: Choose which telemetry categories to enable

---

## Children's Privacy

Phronesis is not intended for use by children under 13. We do not knowingly collect information from children. If you believe a child has provided information through Phronesis, please contact us.

---

## International Users

### Data Protection Laws

Phronesis is designed to comply with major data protection regulations:

**GDPR (European Union)**: General Data Protection Regulation

**CCPA (California)**: California Consumer Privacy Act

**UK GDPR**: UK data protection framework

### Data Transfers

**No Cross-Border Transfers by Us**: Data stays on your device

**AI Provider Transfers**: When using AI features, data may be transferred to AI provider's servers (may be in different jurisdiction)

**Your Responsibility**: Review AI provider terms regarding data transfers and adequacy

### EU/UK Users

Local-first architecture means:
- Data processed on your device (your jurisdiction)
- No automated decision-making by us
- Full data subject rights (you control all data)
- When using AI: Review provider GDPR compliance

---

## Data Retention

### User-Controlled Retention

**You Decide**: You control how long to retain cases

**No Automatic Deletion**: Cases persist until you delete them

**Complete Deletion**: Deleting case removes all associated data

### Backups

**Your Responsibility**: Manage backups through OS-level systems

**Encrypted Backups**: Use encrypted backup solutions for sensitive data

**Deletion**: Remove from backups when deleting sensitive cases

---

## Changes to Privacy Policy

### Notification

We will notify users of material changes through:
- Application notifications
- GitHub release notes
- Email (if you've subscribed to updates)

### Review

Periodically review this privacy policy for updates

### Acceptance

Continued use after changes constitutes acceptance of updated policy

---

## Contact and Data Subject Requests

### General Inquiries

For privacy questions:
- GitHub Discussions: [repository link when established]
- Email: privacy@apatheia.dev (when established)

### Data Subject Requests

Given local-first architecture:
- You control all data subject rights directly
- Access, modify, export, or delete data through application
- No need to contact us for standard data subject requests

If you receive requests regarding data you've processed using Phronesis:
- You are the data controller for your case data
- Consult legal counsel about your obligations
- Use export/redaction features to respond to requests

---

## Specific Jurisdictions

### California (CCPA)

California residents have rights under CCPA:

**Right to Know**: You have direct access to all data (stored on your device)

**Right to Delete**: Delete data at any time through application

**Right to Opt-Out of Sale**: We do not sell personal information

**Right to Non-Discrimination**: All features available regardless of privacy choices

### European Union (GDPR)

EU residents have rights under GDPR:

**Right of Access**: Access all data through application

**Right to Rectification**: Modify data at any time

**Right to Erasure**: Delete data permanently

**Right to Restriction**: Control what data is processed (disable features)

**Right to Portability**: Export in machine-readable format

**Right to Object**: Opt out of any processing

**Legal Basis**: Processing based on your consent and legitimate interests

**DPO**: Contact details when appointed: dpo@apatheia.dev

---

## Security Incidents

### Our Commitment

We take security seriously and implement industry-standard measures.

### In Case of Breach

If we discover a security vulnerability affecting Phronesis:
- Promptly develop and release patch
- Notify users through application and GitHub
- Provide guidance on mitigation

### Your Responsibility

If you experience data breach involving your case materials:
- Consult legal counsel about notification obligations
- You are responsible for notifying affected individuals (you control data)
- We can provide assistance understanding technical aspects

---

## Disclaimer

This privacy policy describes Phronesis application practices. When using Phronesis:

**You Are Responsible For**:
- Compliance with applicable privacy laws
- Protecting confidentiality of documents you process
- Appropriate use of AI providers
- Data security on your devices

**We Are Not Responsible For**:
- How you use the application
- Documents you choose to process
- Third-party AI provider practices
- Data security of your devices

---

## Governing Law

Privacy practices governed by laws of [jurisdiction TBD]. See [Terms of Service](terms-of-service.md) for complete governing law provisions.

---

## Summary

**What We Collect**: Minimal; only what you provide and store locally

**How We Use It**: Local processing on your device; optional AI features

**Who We Share With**: No one, except AI providers when you use AI features

**Your Control**: Complete control over all data

**Your Rights**: Full access, modification, export, and deletion

**Contact**: privacy@apatheia.dev (when established)

---

Last updated: 2025-01-16

For questions about this privacy policy, please contact privacy@apatheia.dev (when established) or open an issue on GitHub.

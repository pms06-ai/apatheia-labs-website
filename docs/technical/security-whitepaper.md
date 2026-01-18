# Security Whitepaper

Threat model, security controls, and privacy protections.

---

## Executive Summary

Phronesis is designed with security and privacy as core principles. Local-first architecture ensures sensitive case materials never leave user's device (except for optional AI features). This document details security measures, threat model, and recommendations for secure use.

---

## Threat Model

### Assets to Protect

**Primary Assets**:
- Case documents (often highly sensitive)
- Analysis findings
- User credentials (API keys)

**Secondary Assets**:
- Application integrity
- Configuration settings
- Audit logs

### Threat Actors

**External Attackers**:
- Malware on user's device
- Network eavesdroppers
- Unauthorized physical access

**Insider Threats**:
- Unauthorized users on shared device
- Malicious software on device

**Institutional Threats**:
- Compelled disclosure
- Surveillance
- Evidence tampering

### Attack Vectors

**Local**:
- File system access
- Memory dumping
- Keylogging
- Screen capture

**Network**:
- Man-in-the-middle attacks on AI API calls
- DNS spoofing
- Certificate attacks

**Supply Chain**:
- Compromised dependencies
- Malicious updates
- Backdoored software

---

## Security Controls

### Encryption

#### At Rest

**Database**:
- SQLite database encrypted using OS-provided encryption
- **Windows**: EFS (Encrypting File System) or BitLocker
- **macOS**: FileVault
- **Linux**: LUKS or equivalent

**Files**:
- Original documents and extracted text
- User responsible for full-disk encryption
- **Recommendation**: Enable OS-level encryption

**Credentials**:
- API keys stored in OS-secure keyring
- **Windows**: Windows Credential Manager
- **macOS**: Keychain
- **Linux**: Secret Service (libsecret)
- Encrypted using OS encryption

#### In Transit

**AI API Calls**:
- HTTPS/TLS 1.3 for all AI provider communications
- Certificate pinning for critical providers (future)
- No AI calls unless user explicitly enables

**Local Only**:
- No network communication except AI APIs
- No telemetry without opt-in
- No analytics by default

### Access Control

**OS-Level**:
- Rely on OS user account security
- Standard file permissions
- No additional authentication layer (local-first)

**Recommendations**:
- Strong OS password
- Screen lock when away
- No shared user accounts

### Audit Logging

**Logged Operations**:
- Case creation/deletion
- Document import
- Analysis runs
- Report generation
- Configuration changes
- Credential access

**Log Properties**:
- Stored in application data directory
- No case content in logs (only operation metadata)
- Timestamped
- User-readable format

**Log Retention**:
- User-controlled
- No automatic deletion
- Included in case export

### Input Validation

**Document Import**:
- File type validation
- Size limits
- Malicious PDF detection (future)

**User Input**:
- SQL injection prevention (parameterized queries)
- Path traversal prevention
- Command injection prevention

**AI Responses**:
- JSON schema validation
- Hallucination detection
- Source grounding requirements

---

## Privacy Protections

### Data Minimization

**Collected Data**:
- None by default
- Optional telemetry (crash reports, usage stats) if user opts in
- No personally identifiable information even in telemetry

**Not Collected**:
- User identity
- Case content
- Document data
- Analysis findings
- Usage patterns (unless opted in)

### Local-First Architecture

**Storage**:
- All data on user's device
- No cloud storage
- No server-side processing (except AI APIs)

**Control**:
- User has complete control
- No remote access by us
- No data sharing without user action

### AI Provider Data Processing

**When Used**:
- User explicitly enables AI features
- User selects provider
- User provides API key

**What's Sent**:
- Document text chunks
- Prompts for analysis
- No metadata beyond text content

**User Responsibility**:
- Review AI provider terms
- Understand data processing
- Execute DPAs if needed (for organizations)

---

## Secure Development Practices

### Code Review

**Requirements**:
- All code reviewed before merge
- Security-sensitive code reviewed by multiple developers
- Automated code analysis (Clippy, ESLint)

### Dependency Management

**Vetting**:
- Dependencies reviewed before adoption
- Prefer well-maintained, popular libraries
- Regular dependency updates
- Automated vulnerability scanning (Dependabot, cargo-audit)

**Minimal Dependencies**:
- Avoid unnecessary dependencies
- Audit transitive dependencies
- Prefer standard library where possible

### Vulnerability Response

**Process**:
1. Report received (security@apatheia.dev or GitHub Security Advisories)
2. Triage and severity assessment
3. Patch development
4. Testing
5. Coordinated disclosure
6. Release and user notification

**Timeline**:
- Critical vulnerabilities: 7 days
- High severity: 30 days
- Medium/low: Next release cycle

---

## Secure Configuration

### Defaults

**Secure by Default**:
- Telemetry disabled
- No AI providers configured
- Strong encryption settings
- Conservative thresholds

**User Opt-In**:
- AI features
- Telemetry
- Auto-updates (recommended)

### Hardening Options

**Advanced Users**:
- Disable AI features entirely
- Increase encryption settings
- Enhanced audit logging
- Air-gapped operation (manual analysis)

---

## Operational Security

### Secure Use Recommendations

**Device Security**:
- Full-disk encryption
- Strong OS password
- Screen lock timeout
- Firewall enabled
- Antivirus/antimalware
- Keep OS updated

**Network Security**:
- Use trusted networks
- VPN for AI API calls (if needed)
- Avoid public Wi-Fi for sensitive cases

**Physical Security**:
- Secure device when away
- Encrypted backups
- Secure device disposal (wipe before disposal)

**Data Handling**:
- Redact before sharing
- Encrypt sensitive reports
- Secure transmission methods
- Delete when no longer needed

### Organizational Deployment

**Enterprise Use**:
- Deploy on managed devices
- Enforce full-disk encryption
- Monitor for policy compliance
- Execute DPAs with AI providers
- Train users on security practices

**Compliance**:
- GDPR compliance (local storage)
- HIPAA safeguards (if processing PHI)
- Attorney-client privilege (secure handling)

---

## Incident Response

### User-Side Incidents

**If Device Compromised**:
1. Disconnect from network
2. Run antimalware scan
3. Change all passwords (including API keys)
4. Review audit logs for suspicious activity
5. Consult IT security professional
6. Assess breach notification obligations

**If Data Breach**:
1. Contain breach
2. Assess what was compromised
3. Consult legal counsel
4. Notify affected parties (if required)
5. Document incident
6. Implement corrective measures

### Application Vulnerabilities

**If Vulnerability Discovered**:
1. Report to project maintainers (responsible disclosure)
2. Do not publicly disclose until patched
3. Apply patch when available
4. Review audit logs for exploitation
5. Assess impact on cases

**Project Response**:
- Rapid patch development
- Security advisory publication
- User notification
- Coordinated disclosure

---

## Compliance

### Data Protection Regulations

**GDPR** (EU): Local-first architecture ensures compliance; user is data controller

**CCPA** (California): No sale of data; user control over all data

**HIPAA** (USA): If processing PHI, user responsible for appropriate safeguards

### Professional Standards

**Attorney-Client Privilege**: Secure handling to preserve privilege

**Confidentiality Obligations**: Appropriate measures to protect confidential information

**Expert Witness**: Secure handling of case materials

---

## Limitations and Residual Risks

### Cannot Protect Against

**Compromise of User's Device**:
- Malware with local access
- Keyloggers
- Screen capture
- Full-disk encryption required for protection

**Physical Access**:
- Unlocked device
- Unencrypted device
- User must implement physical security

**AI Provider Data Handling**:
- Data sent to AI providers subject to their security
- Review provider security practices
- Consider DPAs for sensitive cases

### User Responsibility

**Security is Shared**:
- We provide secure application
- User must secure device and environment
- Follow operational security best practices
- Implement appropriate safeguards for use case

---

## Future Enhancements

**Planned**:
- Local LLM support (no AI provider required)
- Enhanced encryption options
- Certificate pinning for AI providers
- Malicious document detection
- Secure collaboration features

**Under Consideration**:
- Hardware security key support
- Multi-factor authentication (if authentication layer added)
- End-to-end encryption for collaboration
- Blockchain-based audit trails

---

## Contact

**Security Issues**: security@apatheia.dev (when established) or GitHub Security Advisories

**Responsible Disclosure**: We appreciate responsible disclosure of security vulnerabilities. We commit to:
- Timely response and acknowledgment
- Coordinated disclosure timeline
- Credit to researchers (if desired)
- No legal action against good-faith security research

---

Last updated: 2025-01-16

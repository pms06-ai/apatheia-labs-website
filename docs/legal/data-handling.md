# Data Handling Standards

Secure data management practices for Phronesis platform.

---

## Data Storage

### Local Storage Architecture

**Location**: All case data stored in application data directory on user's device.

**Default Paths**:
- **Windows**: `%APPDATA%/Phronesis/`
- **macOS**: `~/Library/Application Support/Phronesis/`
- **Linux**: `~/.local/share/phronesis/`

**Database**: SQLite database with structured data (claims, entities, propagations).

**Files**: Original documents and extracted text in case directories.

---

## Encryption

### At Rest

**Database Encryption**: Database encrypted using OS-provided encryption (when available).

**File Encryption**: Sensitive files can be encrypted at filesystem level (user responsibility).

**Credential Storage**: API keys stored in OS secure keyring with encryption.

### In Transit

**AI API Calls**: HTTPS/TLS for all AI provider communications.

**Local Only**: No network communication except AI API calls (when enabled).

---

## Data Retention

### User-Controlled

**Retention Period**: User determines how long to keep cases.

**Manual Deletion**: User deletes cases when no longer needed.

**Permanent Deletion**: Deletion removes all associated data (database records, files).

---

## Backup and Recovery

### User Responsibility

**Backups**: User responsible for backing up case data.

**Backup Methods**:
- OS-level backup (Time Machine, Windows Backup, rsync)
- Manual copy of case directories
- Export to external storage

**Encryption**: Use encrypted backups for sensitive cases.

### Case Export

**Complete Export**: Export entire case with all data.

**Import**: Import exported cases on same or different device.

---

## Data Deletion

### Case Deletion

**Delete Case**: Removes all data associated with case:
- Database records
- Imported documents
- Analysis results
- Generated reports

**Permanent**: Deletion is permanent; recover only from backups.

### Application Uninstall

**Data Remains**: Uninstalling application does not delete case data.

**Manual Deletion**: Manually delete application data directory to remove all data.

---

## Security Measures

### Access Control

**OS-Level**: Rely on OS user account security.

**File Permissions**: Standard file permissions restrict access.

**No Authentication**: Application does not require login (local-first).

### Audit Logging

**Activity Logs**: Sensitive operations logged for audit purposes:
- Case creation/deletion
- Document import
- Analysis runs
- Report generation

**Log Location**: Stored in application data directory.

**Privacy**: Logs do not contain case content, only operations.

---

## Data Minimization

### Minimal Collection

**No Account Data**: No registration or user accounts.

**No Usage Tracking**: No analytics unless opted in.

**No Cloud Upload**: Documents never uploaded to our servers.

### Optional Telemetry

**Opt-In Only**: Crash reports and usage statistics opt-in.

**Anonymized**: No personally identifiable information.

**No Case Content**: Telemetry never includes case documents or findings.

---

## Third-Party Data Processing

### AI Providers

**When Used**: Only when running AI-assisted analysis.

**What's Sent**: Document text chunks for analysis.

**Provider Terms**: Subject to AI provider's privacy policy and terms.

**Your Choice**: Select which provider or disable AI features entirely.

---

## Data Breach Response

### User Responsibility

Cases stored on your device: You are responsible for data security.

**Best Practices**:
- Use full-disk encryption
- Strong OS password
- Encrypted backups
- Screen lock when away
- Secure device disposal

### Application Vulnerabilities

If security vulnerability discovered in Phronesis:
- Prompt patch development
- User notification
- Security advisory published

**Report Vulnerabilities**: security@apatheia.dev (when established)

---

## Compliance

### GDPR (EU)

**Local Processing**: Data processed on your device (your jurisdiction).

**Data Subject Rights**: You control all rights (access, rectification, erasure, etc.).

**No Data Controller**: We are not data controller for your case data; you are.

### HIPAA (US Health Information)

**Not a Covered Entity**: Phronesis not a HIPAA covered entity.

**User Responsibility**: If processing PHI, you are responsible for HIPAA compliance.

**Safeguards**: Use encryption, access controls, audit logs.

### CCPA (California)

**No Sale of Data**: We do not sell personal information.

**User Control**: Complete control over data (local storage).

---

## Data Processing Agreements

### Organizations

Organizations using Phronesis should:
- Execute DPAs with AI providers (if using AI features)
- Document legal basis for processing
- Maintain processing records
- Implement appropriate security

### AI Providers

Review AI provider data processing terms:
- **Claude**: Anthropic data processing addendum
- **Groq**: Groq data processing terms
- **Gemini**: Google Cloud data processing terms

---

## International Data Transfers

### No Transfers by Us

**Local Processing**: Data stays on your device.

**No Cross-Border Transfer**: We do not transfer data across borders.

### AI Provider Transfers

**User's Choice**: When using AI features, data sent to AI provider.

**Provider Location**: May be in different jurisdiction.

**Adequacy**: Review AI provider's compliance with adequacy requirements.

---

## Data Export and Portability

### Export Formats

**JSON**: Complete case data in machine-readable format.

**PDF/DOCX**: Human-readable reports.

**Case Files**: Packaged case for transfer.

### Portability

**Open Formats**: Data stored in open, documented formats.

**No Lock-In**: Export and use data with other tools.

---

Last updated: 2025-01-16

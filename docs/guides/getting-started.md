# Getting Started with Phronesis

Installation, initial setup, and your first S.A.M. analysis.

---

## Prerequisites

### System Requirements

**Operating System**:

- Windows 10 or later
- macOS 11 (Big Sur) or later
- Linux (Ubuntu 20.04+ or equivalent)

**Hardware**:

- **Minimum**: 8GB RAM, 5GB storage
- **Recommended**: 16GB+ RAM, SSD storage, multi-core CPU

**Internet**: Required for AI-assisted analysis (optional for manual analysis)

### AI Provider Account

To use AI-assisted features, you'll need an API key from Anthropic:

**Claude (Anthropic)**

- Sign up: https://console.anthropic.com/
- Pricing: Pay-as-you-go
- Best for: Deep reasoning, complex forensic analysis

---

## Installation

### Download

Visit [releases page] to download the latest version for your platform:

- **Windows**: `Phronesis-Setup-x.x.x.exe`
- **macOS**: `Phronesis-x.x.x.dmg`
- **Linux**: `phronesis-x.x.x.AppImage` or `.deb`

### Install

**Windows**:

1. Run installer
2. Follow prompts
3. Launch from Start Menu

**macOS**:

1. Open DMG file
2. Drag Phronesis to Applications
3. First launch: Right-click → Open (to bypass Gatekeeper)

**Linux**:

```bash
# AppImage
chmod +x phronesis-x.x.x.AppImage
./phronesis-x.x.x.AppImage

# Or .deb
sudo dpkg -i phronesis-x.x.x.deb
```

---

## First Launch

### Welcome Screen

On first launch, you'll see the welcome screen with setup wizard.

### Configure AI Provider

1. Click "Settings" or complete setup wizard
2. Navigate to "AI Providers"
3. Select provider (Claude recommended)
4. Enter API key
5. Test connection

**Security Note**: API keys stored securely in OS keyring (Keychain/Credential Manager/Secret Service).

### Optional: Configure Additional Settings

**Storage Location**: Choose where to store case data (default: user documents)

**Telemetry**: Opt in or out of anonymous usage statistics

**Updates**: Configure automatic update checks

---

## Your First Case

### Step 1: Create Case

1. Click "New Case" on home screen
2. Enter case details:
   - **Case Name**: Descriptive name
   - **Type**: Select case type (wrongful conviction, child protection, etc.)
   - **Description**: Brief case summary
3. Click "Create"

### Step 2: Import Documents

1. Click "Import Documents" in case view
2. Select files:
   - PDF files (native or scanned)
   - Text files (.txt, .md)
   - Multiple files can be selected at once
3. Wait for processing:
   - Text extraction (OCR for scanned PDFs)
   - Metadata extraction
   - Initial indexing

**Tips**:

- Organize files by naming convention (e.g., `001_police_report.pdf`)
- Include creation dates in metadata if available
- Large files may take several minutes

### Step 3: Review Documents

1. Browse imported documents in document list
2. Verify text extraction quality
3. Add metadata:
   - Document type
   - Author/institution
   - Creation date
   - Notes

### Step 4: Run Analysis

#### Quick Analysis (Recommended for First Time)

1. Click "Run Analysis" button
2. Select "Quick Analysis" preset
3. Review engine selection:
   - Entity Analysis
   - Temporal Analysis
   - Contradiction Detection
   - (Other engines available in full analysis)
4. Click "Start Analysis"

#### What Happens During Analysis:

- **Entity Extraction**: Identifies people, organizations, dates, events
- **Timeline Construction**: Orders events chronologically
- **Claim Extraction**: Identifies factual claims in documents
- **Contradiction Detection**: Finds inconsistencies
- **AI Processing**: Sends text chunks to AI provider for analysis

Progress bar shows current status.

**Time Estimate**:

- Small case (10-20 docs): 5-15 minutes
- Medium case (50-100 docs): 20-45 minutes
- Large case (200+ docs): 1-3 hours

### Step 5: Review Results

Once analysis completes, explore results:

#### Entities Tab

- People, organizations, locations mentioned
- Relationship networks
- Timeline of entity involvement

#### Contradictions Tab

- Detected contradictions by type
- Severity assessment
- Source citations

#### Timeline Tab

- Chronological event sequence
- Document creation timeline
- Temporal inconsistencies flagged

#### S.A.M. Analysis Tab

- **ANCHOR**: Claim origins and evidential quality
- **INHERIT**: Propagation patterns
- **COMPOUND**: Authority accumulation
- **ARRIVE**: Outcome connections

### Step 6: Generate Report

1. Click "Generate Report"
2. Select report type:
   - **PDF**: Court-ready with citation links
   - **DOCX**: Editable with tracked citations
   - **JSON**: Programmatic access
3. Configure report options:
   - Include/exclude sections
   - Redaction level
   - Detail level
4. Click "Generate"

Report saved to case directory.

---

## Understanding the Interface

### Main Navigation

**Home**: Case list and recent cases

**Active Case**: Currently open case with tabs:

- Overview
- Documents
- Entities
- Timeline
- Contradictions
- S.A.M. Analysis
- Reports

**Settings**: Application configuration

**Help**: Documentation and support

### Document View

**List View**: All documents with metadata

**Detail View**: Individual document with:

- Extracted text
- Annotations
- References (where document is cited)
- Metadata

**PDF Viewer**: View original PDF with highlighting

### Analysis View

**Filters**: Filter by type, severity, date range

**Search**: Find specific claims, entities, or text

**Export**: Export subsets of analysis

**Visualizations**: Interactive graphs and charts

---

## Tips for Effective First Analysis

### Document Preparation

**Organize before import**:

- Chronological naming helps
- Group by institution or document type
- Include metadata files if available

**Quality check**:

- Verify OCR quality for scanned documents
- Re-scan illegible pages with higher quality
- Note missing documents in case overview

### Analysis Configuration

**Start simple**:

- Use quick analysis first
- Add more engines as you understand the case
- Full S.A.M. analysis can be run after initial review

**Review incrementally**:

- Don't wait for full analysis to complete
- Review entity extraction results
- Verify timeline makes sense
- Check contradiction detections

### Interpretation

**Verify AI findings**:

- Always check source citations
- Read original context
- Consider alternative explanations
- Manual override when necessary

**Focus on patterns**:

- Look for systemic issues
- Note recurring problems
- Identify institutional failure points

---

## Common First-Time Issues

### Problem: OCR Quality Poor

**Solution**:

- Re-scan at higher DPI (300+)
- Use better lighting/contrast
- Try different OCR engine (settings)
- Manual correction for critical passages

### Problem: Too Many Contradictions Detected

**Solution**:

- Some may be false positives
- Adjust sensitivity threshold
- Filter by severity
- Focus on EVIDENTIARY and TEMPORAL types first

### Problem: Analysis Taking Too Long

**Solution**:

- Check internet connection (AI API calls)
- Reduce document set for initial test
- Use Groq for faster processing
- Run overnight for large cases

### Problem: API Rate Limits

**Solution**:

- Most providers have generous limits
- Upgrade to paid tier if needed
- Pause and resume analysis
- Distribute across multiple providers

### Problem: Can't Find Specific Information

**Solution**:

- Use search function (Ctrl/Cmd+F)
- Check entity extraction results
- Use filters to narrow results
- Export to JSON for custom analysis

---

## Next Steps

After your first analysis:

1. **Read detailed guides**:
   - [Analysis Workflow](analysis-workflow.md) - Complete process
   - [Engine Guide](engine-guide.md) - Deep dive on each engine
   - [Best Practices](best-practices.md) - Tips and techniques

2. **Explore methodology**:
   - [Methodology Paper](../research/methodology-paper.md) - Full S.A.M. framework
   - [Contradiction Taxonomy](../research/contradiction-taxonomy.md) - Eight types explained
   - [Cascade Theory](../research/cascade-theory.md) - ANCHOR → INHERIT → COMPOUND → ARRIVE

3. **Join community**:
   - GitHub Discussions for questions
   - Share experiences (redacted)
   - Contribute feedback

4. **Advanced features**:
   - Custom engine parameters
   - Integration with other tools
   - Collaborative analysis (future)

---

## Support

### Documentation

Complete documentation available at `/docs`:

- Research papers
- Technical documentation
- User guides
- FAQ

### Community

- **GitHub Discussions**: Questions and community support
- **GitHub Issues**: Bug reports and feature requests

### Professional Support

Contact for:

- Training and workshops
- Expert witness preparation
- Custom analysis consultation

---

## Quick Reference Card

```
Create Case:        New Case button → Enter details → Create
Import Docs:        Import Documents → Select files → Process
Run Analysis:       Run Analysis → Select preset → Start
View Results:       Navigate tabs: Entities, Timeline, Contradictions, S.A.M.
Generate Report:    Generate Report → Select format → Generate
Export Data:        File → Export → Select format

Keyboard Shortcuts:
Ctrl/Cmd+N:         New case
Ctrl/Cmd+O:         Open case
Ctrl/Cmd+I:         Import documents
Ctrl/Cmd+R:         Run analysis
Ctrl/Cmd+G:         Generate report
Ctrl/Cmd+F:         Search
Ctrl/Cmd+,:         Settings
```

---

Last updated: 2025-01-16

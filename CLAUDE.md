# Apatheia Labs - Master Project Configuration

## Mission
Build forensic intelligence platforms that expose institutional dysfunction through systematic, evidence-based analysis. "Clarity Without Distortion."

## Vision
Democratize access to the analytical tools and methodologies that expose contradictions, bias, and procedural failures in institutional documentation - specifically targeting family courts, regulatory bodies, and media organizations.

## Product Architecture

### Core Platforms
| Product | Purpose | Status |
|---------|---------|--------|
| **Phronesis** | Case intelligence - forensic document analysis | Active |
| **Aletheia** | Truth extraction - contradiction detection | Active |
| **Elenchus** | Adversarial testing framework | Development |
| **CASCADE** | Detection engine for systematic analysis | Core methodology |

### This Repository (apatheia-scaffold)
Next.js 14 + Tauri desktop application - unified interface for all Apatheia Labs tools.

**Stack:**
- Frontend: Next.js 14, React, Tailwind, Radix UI
- Desktop: Tauri (Rust)
- Backend: Supabase (Postgres, Auth, Storage)
- AI: Claude API (primary), multi-model routing planned
- PDF Processing: Modal (serverless Python)

## S.A.M. Framework (Systematic Adversarial Methodology)

Core analytical methodology. Eight contradiction types:

1. **SELF** - Internal contradictions within single document
2. **INTER_DOC** - Contradictions between documents
3. **TEMPORAL** - Timeline/date inconsistencies
4. **EVIDENTIARY** - Evidence vs claims mismatch
5. **MODALITY_SHIFT** - Tone/certainty changes without justification
6. **SELECTIVE_CITATION** - Cherry-picked references
7. **SCOPE_SHIFT** - Unexplained scope changes
8. **UNEXPLAINED_CHANGE** - Position changes without justification

## Active Priorities

### 1. Channel 4 GDPR Complaint
- Broadcast: "24 Hours in Police Custody: A Family Vendetta" (Dec 8-9, 2024)
- Issue: Named 75+ times, 10 months post-NFA, without consent
- Targets: GDPR violations, Ofcom Broadcasting Code (Sections 7 & 8)
- Evidence: `/mnt/c/Users/pstep/OneDrive/Desktop/Channel 4/`

### 2. Family Court Case PE23C50095
- Bundle: 1,469 pages, 156 documents, Sections A-J
- Key entities: Dr. Emma Hunnisett, Lucy Walton, Mandy Seamark, Simon Ford
- Complaints: BPS, HCPC, ICO

### 3. Platform Development
- Consolidate phronesis-lex Django backend
- Unify frontend across products
- Implement multi-model AI routing

## Repository Map

```
C:\Users\pstep\
├── OneDrive\Desktop\apatheia-scaffold\  # THIS REPO - unified interface
├── phronesis-lex\                       # Primary codebase (Django + React)
│   └── Phronesis\                       # Active Django backend
├── Aletheia_Forensics\                  # Electron app + analysis scripts
├── Phronesis\                           # Legacy/reference
└── Channel 4\                           # Evidence corpus for GDPR case
```

## Development Commands

```bash
# Start development
npm run dev

# Build for web
npm run build

# Build Tauri desktop app
npm run tauri build

# Run tests
npm test
```

## Key Files

- `src/CONTRACT.ts` - Type definitions and contracts
- `supabase/schema.sql` - Database schema
- `modal/process_pdf.py` - PDF processing serverless function

## Working Preferences

When working in this codebase:
- Terse communication preferred
- Default to adversarial challenge mode
- Infer context, minimize questions
- Align with existing Notion structure
- No parallel systems - integrate with what exists
- Avoid blue in design elements

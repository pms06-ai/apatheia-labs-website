# System Architecture

Technical design, components, and data flow for Phronesis platform.

---

## Quick Reference

**Phronesis FCIP** is a forensic intelligence desktop application built with:

- **Frontend**: Vite 6 + React 18 + React Router 7 + Tailwind CSS + Radix UI
- **Desktop**: Tauri 2.9 (Rust 2021 backend)
- **Database**: SQLite via sqlx (local-first)
- **AI**: Claude (Anthropic)
- **Analysis**: S.A.M. (Systematic Adversarial Methodology) with 11 specialized engines

### Directory Structure

```
├── src/                           # React frontend
│   ├── CONTRACT.ts                # SINGLE SOURCE OF TRUTH for IPC types
│   ├── pages/                     # React Router pages (4 routes)
│   ├── components/                # UI components (analysis, documents, sam, ui)
│   ├── hooks/                     # TanStack Query hooks (15 hooks)
│   └── lib/tauri/                 # IPC bridge (commands.ts, events.ts)
│
├── src-tauri/                     # Rust backend
│   ├── src/
│   │   ├── lib.rs                 # Tauri init, AppState, command registration
│   │   ├── commands/              # IPC handlers (8 modules, 40+ commands)
│   │   ├── db/                    # SQLite layer (sqlx)
│   │   ├── engines/               # 11 analysis engines (Rust native)
│   │   ├── orchestrator/          # Engine job queue + parallel execution
│   │   ├── sam/                   # S.A.M. executor (4-phase cascade)
│   │   └── processing/            # PDF extraction, chunking
│   ├── sidecars/                  # Node.js engine-runner for AI calls
│   └── tauri.conf.json            # Tauri configuration
│
└── packages/                      # Monorepo workspaces
    ├── mcp-server/                # MCP integration for Claude
    └── obsidian-plugin/           # Obsidian vault sync
```

### Key Entry Points

| Entry Point                        | Purpose                                  |
| ---------------------------------- | ---------------------------------------- |
| `src/main.tsx` → `App.tsx`         | React app bootstrap, Router setup        |
| `src-tauri/src/main.rs` → `lib.rs` | Tauri binary, AppState, command handlers |
| `src/CONTRACT.ts`                  | Type definitions crossing IPC boundary   |
| `src/lib/tauri/commands.ts`        | Typed invoke() wrappers                  |

### Routes

| Path           | Component       | Purpose                |
| -------------- | --------------- | ---------------------- |
| `/`            | Dashboard       | Home page              |
| `/documents`   | DocumentsPage   | Document management    |
| `/investigate` | InvestigatePage | Forensic analytics hub |
| `/settings`    | SettingsPage    | Application settings   |

### Data Flow

```
Frontend (React)
    ↓ invoke('command_name', params)
IPC Bridge (lib/tauri/commands.ts)
    ↓ Tauri invoke()
Rust Commands (src-tauri/src/commands/*.rs)
    ↓
Database (SQLite) + Storage (files) + Engines (analysis)
    ↓
Response (typed per CONTRACT.ts)
    ↓
TanStack Query cache invalidation
    ↓
UI re-render
```

### Analysis Engines (11 total)

| Engine         | Purpose                            |
| -------------- | ---------------------------------- |
| entity         | Canonical identity mapping         |
| temporal       | Timeline construction              |
| contradiction  | Cross-document inconsistencies     |
| bias           | Statistical framing imbalance      |
| accountability | Duty violation detection           |
| professional   | Per-professional behavior patterns |
| omission       | Source-to-report gaps              |
| expert         | FJC compliance, scope analysis     |
| documentary    | Media portrayal analysis           |
| narrative      | Claim mutation tracking            |
| argumentation  | Toulmin structure building         |

### S.A.M. Methodology (4 phases)

1. **ANCHOR** - Identify false premise origin points
2. **INHERIT** - Track propagation without verification
3. **COMPOUND** - Document authority accumulation
4. **ARRIVE** - Map catastrophic outcomes

### Critical Integration Rules

**Type Contract Chain (MUST maintain):**

```
Rust type (src-tauri/src/*)
  → CONTRACT.ts
  → commands.ts wrapper
  → hooks/*.ts
```

**Build Order (CRITICAL):**

```bash
npm run build          # Vite → dist/ (MUST run first)
cargo check            # Rust compile check
npm run tauri build    # Full build
```

**Verification (before commits):**

```bash
cargo check --manifest-path src-tauri/Cargo.toml  # Rust compiles
npx tsc --noEmit                                   # TypeScript compiles
npm run tauri build -- --no-bundle                 # Tauri builds
```

---

## Overview

Phronesis is a desktop application built using Tauri 2, combining a Rust backend with a modern web frontend. Local-first architecture ensures data privacy and offline capability.

---

## Technology Stack

### Frontend

- **Vite 6**: Build tool and dev server
- **React 18**: UI framework
- **React Router 7**: Routing and navigation
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Zustand**: State management
- **TanStack Query**: Async state and caching

### Backend

- **Tauri 2.9**: Desktop application framework
- **Rust 2021 Edition**: Systems programming language
- **Tokio**: Async runtime
- **SQLx**: Type-safe SQL database access
- **SQLite**: Embedded database
- **pdf-extract**: PDF text extraction
- **Serde**: Serialization/deserialization

### AI Integration

- **Claude (Anthropic)**: Primary AI provider for reasoning and analysis

### Workspaces

- **MCP Server**: Claude integration (@apatheia/mcp-server)
- **Obsidian Plugin**: Knowledge vault sync (obsidian-phronesis)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Vite + React)              │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌─────────┐ │
│  │   Pages  │─▶│Components│─▶│  Hooks  │◀─│ Zustand │ │
│  └──────────┘  └──────────┘  └─────────┘  └─────────┘ │
│                       │                                  │
│                       ▼                                  │
│              ┌────────────────┐                         │
│              │ lib/tauri/     │                         │
│              │   commands.ts  │                         │
│              └────────────────┘                         │
└──────────────────────┬──────────────────────────────────┘
                       │ IPC
                       ▼
┌─────────────────────────────────────────────────────────┐
│                Rust Backend (Tauri)                      │
│  ┌────────────────────────────────────────────────┐    │
│  │                  lib.rs                         │    │
│  │  (Tauri entry point, command registration)     │    │
│  └────────────────────┬───────────────────────────┘    │
│                       │                                  │
│  ┌────────────────────▼───────────────────────────┐    │
│  │               commands/                         │    │
│  │  (IPC handlers: analysis, documents, settings)  │    │
│  └────────────────────┬───────────────────────────┘    │
│                       │                                  │
│  ┌─────────┬──────────▼─────┬────────┬───────────┐    │
│  │   db/   │  processing/   │  sam/  │ engines/  │    │
│  │(SQLite) │ (PDF, chunking)│(S.A.M.)│(11 engines)│    │
│  └─────────┴────────────────┴────────┴───────────┘    │
│                                                          │
│  ┌──────────┬─────────┬──────────┬─────────────┐      │
│  │storage/  │   ai/   │ credentials│ orchestrator│      │
│  │ (files)  │(AI SDK) │ (keyring)  │ (job queue) │      │
│  └──────────┴─────────┴──────────┴─────────────┘      │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │   External Services   │
           │  - Claude API         │
           └───────────────────────┘
```

---

## Core Components

### Frontend Layer

#### Pages

- Case list and management
- Document viewer and editor
- Analysis dashboard
- Settings and configuration

#### Components

- Reusable UI components (layout, forms, visualizations)
- Analysis result displays
- Entity and timeline views
- Report generators

#### Hooks

- `use-api.ts`: TanStack Query hooks for API calls
- `use-tauri-sync.ts`: State synchronization with backend
- `use-complaints.ts`: Case management hooks
- Domain-specific hooks

#### State Management

- **Zustand**: Global application state
- **TanStack Query**: Server state caching and synchronization
- **React Context**: Feature-specific state

### Backend Layer

#### lib.rs

- **Tauri entry point**: Application initialization
- **Command registration**: `generate_handler![]` macro
- **AppState**: Shared application state (database, configuration)

#### commands/

- **analysis.rs**: S.A.M. analysis orchestration
- **documents.rs**: Document import, extraction, management
- **cases.rs**: Case CRUD operations
- **export.rs**: Report generation
- **settings.rs**: Configuration management
- **investigate.rs**: Investigation workflows

#### db/

- **SQLite schema**: Cases, documents, entities, claims, propagations
- **Query builders**: Type-safe database operations
- **Migrations**: Schema versioning

#### processing/

- **PDF extraction**: Text extraction from PDFs (native and OCR)
- **Chunking**: Semantic segmentation for AI processing
- **Entity extraction**: NER and entity resolution
- **Metadata**: Document metadata extraction

#### engines/

11 specialized analysis engines:

- entity.rs, temporal.rs, argumentation.rs, bias.rs, contradiction.rs
- accountability.rs, professional.rs, omission.rs, expert.rs
- documentary.rs, narrative.rs

#### sam/

- **executor.rs**: S.A.M. phase orchestration
- **anchor.rs**: Origin tracing
- **inherit.rs**: Propagation tracking
- **compound.rs**: Authority assessment
- **arrive.rs**: Outcome linkage

#### orchestrator/

- **Job queue**: Async job scheduling
- **Progress tracking**: Analysis status updates
- **Error handling**: Graceful failure recovery
- **Checkpointing**: Resume interrupted analyses

#### storage/

- **File storage**: Document files, extracted text
- **Backup**: Export/import case files
- **Cleanup**: Orphaned file management

#### ai/

- **Anthropic client**: Claude API integration
- **Prompt templates**: Structured prompts for analysis
- **Response parsing**: JSON schema validation
- **Error handling**: Retry logic, rate limiting

#### credentials.rs

- **Keyring integration**: OS-secure credential storage
- **Encryption**: API key encryption
- **Access control**: Secure credential retrieval

---

## Data Flow

### Document Import Flow

```
User selects files
  ↓
Frontend: File upload
  ↓
IPC: import_documents command
  ↓
Backend: processing/
  ├─ PDF extraction (pdf-extract)
  ├─ OCR if needed (Tesseract via Docker)
  ├─ Text chunking
  ├─ Metadata extraction
  ↓
Backend: db/
  ├─ Store document record
  ├─ Store chunks
  ↓
Backend: storage/
  ├─ Save original file
  ├─ Save extracted text
  ↓
IPC: Progress updates
  ↓
Frontend: UI update
```

### Analysis Flow

```
User initiates analysis
  ↓
Frontend: run_analysis command
  ↓
Backend: orchestrator/
  ├─ Create analysis job
  ├─ Queue engine tasks
  ↓
Backend: sam/executor.rs
  ├─ ANCHOR phase
  │   ├─ Trace claim origins
  │   ├─ Assess evidential quality
  │   └─ Store origin records
  ├─ INHERIT phase
  │   ├─ Detect propagation
  │   ├─ Track mutations
  │   └─ Store propagation records
  ├─ COMPOUND phase
  │   ├─ Identify authority markers
  │   ├─ Calculate authority scores
  │   └─ Detect authority laundering
  └─ ARRIVE phase
      ├─ Link to outcomes
      ├─ But-for analysis
      └─ Harm assessment
  ↓
Backend: engines/ (parallel execution)
  ├─ Entity extraction
  ├─ Timeline construction
  ├─ Contradiction detection
  ├─ [Other engines]
  ↓
Backend: ai/ (when AI-assisted)
  ├─ Chunk documents
  ├─ Send to AI provider
  ├─ Parse responses
  ├─ Store results
  ↓
Backend: db/
  ├─ Store all findings
  ├─ Update analysis status
  ↓
IPC: Progress updates + Results
  ↓
Frontend: Display results
```

---

## Database Schema

### Core Tables

**cases**

- id, name, type, description, created_at, updated_at

**documents**

- id, case_id, title, file_path, document_type, author, created_date, imported_at

**entities**

- id, case_id, entity_type, name, normalized_name, frequency

**claims**

- id, document_id, claim_text, claim_type, origin_type, evidential_quality, is_false_premise

**propagations**

- id, source_claim_id, target_document_id, propagation_type, mutation_detected, verification_performed

**authority_markers**

- id, claim_id, document_id, authority_type, authority_weight, is_authority_laundering

**contradictions**

- id, case_id, contradiction_type, severity, description, source_citations

**outcomes**

- id, case_id, outcome_type, outcome_date, harm_level, description

**analysis_runs**

- id, case_id, status, config, started_at, completed_at, results

---

## Security Architecture

### Encryption

- **At Rest**: SQLite database encryption (OS-provided)
- **In Transit**: HTTPS for AI API calls
- **Credentials**: OS keyring with encryption

### Access Control

- **OS-level**: Rely on user account security
- **File permissions**: Standard OS file permissions
- **No authentication**: Local-first, no login required

### Audit Logging

- Sensitive operations logged
- Logs stored in application data directory
- No case content in logs

See [Security Whitepaper](security-whitepaper.md) for complete details.

---

## Build Process

### Frontend Build

```bash
npm run build
# Vite builds React app to dist/
```

### Rust Build

```bash
cargo build --release --manifest-path src-tauri/Cargo.toml
# Requires dist/ from frontend build (frontendDist config)
```

### Tauri Build

```bash
npm run tauri build
# Creates platform-specific installers
```

### Critical Build Order

**MUST** build frontend before Rust/Tauri (Tauri expects `dist/` as `frontendDist`).

---

## Configuration

### Tauri Config

**src-tauri/tauri.conf.json**:

- App metadata
- Window configuration
- Security settings (CSP)
- Build options

### Cargo Features

**src-tauri/Cargo.toml**:

- `custom-protocol` (default): Production protocol
- `cloud-storage` (default): Google Drive/OneDrive integration
- `vendored-tls`: Static OpenSSL for portable builds
- `dev`: Development-only features

See [FEATURES.md](../../FEATURES.md) for details.

---

## Deployment

### Platform-Specific

**Windows**: .exe installer, MSI  
**macOS**: .dmg disk image, .app bundle  
**Linux**: .AppImage, .deb package

### Auto-Updates

Tauri supports auto-updates using:

- Signature verification
- Incremental updates
- User-controlled update triggers

---

## Extensibility

### Custom Engines

**Rust**: Implement engine trait, register in orchestrator

**TypeScript**: Add engine interface, update UI

### Plugins

**Tauri plugins**: Extend platform capabilities

**Workspace packages**: MCP server, Obsidian plugin

### API Integration

**JSON export**: Programmatic access to analysis data

**MCP server**: Claude integration for extended workflows

---

## Performance Optimization

### Frontend

- Code splitting (React Router)
- Lazy loading for heavy components
- TanStack Query caching
- Virtualized lists for large datasets

### Backend

- Parallel engine execution (Tokio async)
- Chunked document processing
- Incremental analysis (checkpoint/resume)
- Database indexing

### AI Calls

- Batch processing
- Caching repeated analyses
- Rate limit handling

---

## Error Handling

### Frontend

- Error boundaries for React components
- Toast notifications for user errors
- Graceful degradation

### Backend

- Unified error type (error.rs)
- Map internal errors to user-friendly messages
- Logging and diagnostics
- Recovery strategies (retry, resume)

---

## Testing

### Frontend

- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests (future)

### Backend

- Cargo test for unit tests
- Integration tests for database
- End-to-end tests via Tauri test harness

---

Last updated: 2026-01-18

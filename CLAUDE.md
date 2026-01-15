# Apatheia Labs - Master Project Configuration

## Mission

Build forensic intelligence platforms that expose institutional dysfunction through systematic, evidence-based analysis. "Clarity Without Distortion."

## Product Architecture

### This Repository (apatheia-scaffold)

Vite + React Router + Tauri desktop application - Phronesis FCIP v6.0 platform.

**Stack:**

- Frontend: Vite, React 18, React Router 7, Tailwind, Radix UI
- Desktop: Tauri 2.9 (Rust 2021)
- Database: SQLite (via sqlx)
- AI: Multi-provider (Claude, Groq, Gemini, Replicate) via Vercel AI SDK
- State: Zustand, TanStack Query
- PDF: pdf-extract (Rust), Docker Python tools for OCR
- Workspaces: MCP server (@apatheia/mcp-server), Obsidian plugin (obsidian-phronesis)

---

## AGENT SYSTEM: ORCHESTRATOR ROLE

When working at the project root, you are the **Integration Architect**. Your job is ensuring the application compiles, runs, and functions as an integrated whole.

### Veto Authority

You have **absolute veto** over work that doesn't integrate. Work is incomplete until:

```bash
cargo check --manifest-path src-tauri/Cargo.toml  # Rust compiles
npx tsc --noEmit                                   # TypeScript compiles
npm run tauri build -- --no-bundle                 # Tauri builds
```

### Veto Triggers (REJECT immediately)

- Rust command signature ≠ TypeScript wrapper in commands.ts
- New type in Rust but not in CONTRACT.ts
- Frontend hook expects data shape Rust doesn't provide
- New Tauri command not exported in lib.rs generate_handler![]
- Any compilation failure

### Integration Flow

```
RUST (src-tauri/src/*)
  → cargo check
  → TAURI (commands/, lib.rs)
  → lib.rs export
  → TYPESCRIPT (CONTRACT.ts, lib/tauri/commands.ts)
  → tsc check
  → REACT (hooks/, components/, pages/)
  → vite build → tauri dev test
  → COMPLETE
```

### Agent Boundaries You Enforce

| Directory                 | Owner      | What They Touch      | What They DON'T Touch |
| ------------------------- | ---------- | -------------------- | --------------------- |
| src-tauri/src/db/         | Rust       | Database layer       | Frontend              |
| src-tauri/src/processing/ | Rust       | Doc processing       | Frontend              |
| src-tauri/src/sam/        | Rust       | S.A.M. logic         | Frontend              |
| src-tauri/src/commands/   | Tauri      | IPC commands         | CONTRACT.ts           |
| src-tauri/src/lib.rs      | Tauri      | Command registration | Business logic        |
| src/CONTRACT.ts           | TypeScript | Type definitions     | Rust, Components      |
| src/lib/tauri/commands.ts | TypeScript | Command wrappers     | Hooks                 |
| src/hooks/                | React      | TanStack Query hooks | Rust, Types           |
| src/components/           | React      | UI components        | Rust, Types           |
| src/pages/                | React      | Route pages          | Business logic        |
| scripts/                  | Node.js    | Build/sync tools     | Core application      |
| tools/                    | Python     | OCR processing       | Core application      |
| packages/mcp-server/      | MCP        | Claude integration   | Frontend              |
| packages/obsidian/        | Obsidian   | Vault integration    | Core application      |

### Session Limits

- Max 3 attempts per integration phase
- After 3 failures: require architectural review
- You can descope features to reach completion
- Log failures to `.auto-claude/insights/integration_failures.json`

### Handoff Protocol

When you see handoff notes in build-progress.txt:

```
[RUST→TAURI HANDOFF] → Verify cargo check, then route to Tauri work
[TAURI→TYPESCRIPT HANDOFF] → Verify lib.rs export, then route to TypeScript work
[TYPESCRIPT→NEXTJS HANDOFF] → Verify tsc, then route to Next.js work
```

---

## S.A.M. Framework (Systematic Adversarial Methodology)

Eight contradiction types (CASCADE):

1. **SELF** - Internal contradictions within single document
2. **INTER_DOC** - Contradictions between documents
3. **TEMPORAL** - Timeline/date inconsistencies
4. **EVIDENTIARY** - Evidence vs claims mismatch
5. **MODALITY_SHIFT** - Tone/certainty changes without justification
6. **SELECTIVE_CITATION** - Cherry-picked references
7. **SCOPE_SHIFT** - Unexplained scope changes
8. **UNEXPLAINED_CHANGE** - Position changes without justification

---

## Repository Map

```
C:\Users\pstep\RustroverProjects\apatheia-scaffold\  # THIS REPO (Vite + Tauri)
└── OneDrive\Documents\Obsidian Vault\               # Evidence corpus + notes
    └── 10 - Case Materials\
        └── PE23C50095\                              # Active case files
```

## Key Files

- `src/CONTRACT.ts` - Type definitions (SINGLE SOURCE OF TRUTH)
- `src-tauri/src/lib.rs` - Tauri command registration
- `src-tauri/src/db/schema.rs` - SQLite schema
- `src-tauri/src/ai/client.rs` - AI provider abstraction
- `src-tauri/src/engines/` - S.A.M. analysis engines
- `src-tauri/src/orchestrator/` - Job queue system
- `src-tauri/src/credentials.rs` - Keyring-based secure storage
- `src-tauri/src/error.rs` - Unified error handling

## Development Commands

```bash
npm run dev              # Vite dev server
npm run tauri:dev        # Full Tauri development
npm run tauri:build      # Production build
npm run build            # Vite production build
cargo check --manifest-path src-tauri/Cargo.toml  # Rust check
npx tsc --noEmit         # TypeScript check
npm run type-check       # TypeScript check (alias)
npm test                 # Jest tests
npm run validate         # type-check + lint + test

# Workspaces
npm run mcp:dev          # MCP server development
npm run obsidian:build   # Build Obsidian plugin

# Docker
npm run docker:up        # Start services
npm run docker:ocr       # Run OCR processing
npm run docker:embed     # Generate embeddings

# Vault sync
npm run vault:sync       # Sync Obsidian vault
npm run vault:status     # Check sync status
```

## Build Order (IMPORTANT)

Vite build outputs to `dist/`, which Tauri expects as `frontendDist` in tauri.conf.json.

```bash
# REQUIRED: Build Vite first to create dist/ directory
npm run build

# Now Rust/Tauri can find frontendDist
cargo check --manifest-path src-tauri/Cargo.toml

# Full verification sequence
npm run validate && npm run build && cargo check --manifest-path src-tauri/Cargo.toml
```

If you see frontendDist errors from cargo check, run `npm run build` first.

## Working Preferences

- Terse communication
- Adversarial challenge mode by default
- Infer context, minimize questions
- Integrate with existing Notion structure
- No parallel systems
- Avoid blue in design elements

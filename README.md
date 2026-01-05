# Apatheia Labs - Phronesis Platform

> *"Clarity Without Distortion"*

Forensic intelligence platform for institutional accountability analysis. Desktop + web application built with Next.js 14 and Tauri.

## Overview

Phronesis (FCIP v6.0) employs the **Systematic Adversarial Methodology (S.A.M.)** for reading institutional documents "against the grain" - tracing how false premises propagate through agencies, accumulate authority through repetition, and cause harmful outcomes.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind, Radix UI |
| Desktop | Tauri (Rust) |
| Backend | Supabase (Postgres, Auth, Storage) |
| AI | Claude API |
| PDF Processing | Modal (serverless Python) |

## S.A.M. Methodology

Four-phase cascade analysis:

1. **ANCHOR** - Identify false premise origin points
2. **INHERIT** - Track institutional propagation without verification
3. **COMPOUND** - Document authority accumulation through repetition
4. **ARRIVE** - Map catastrophic outcomes

### Eight Contradiction Types

| Code | Type |
|------|------|
| SELF | Internal contradiction |
| INTER_DOC | Cross-document conflict |
| TEMPORAL | Timeline mismatch |
| EVIDENTIARY | Claim vs evidence gap |
| MODALITY_SHIFT | Certainty/tone change |
| SELECTIVE_CITATION | Cherry-picking |
| SCOPE_SHIFT | Unexplained scope change |
| UNEXPLAINED_CHANGE | Position flip |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build Tauri desktop app
npm run tauri build
```

## Project Structure

```
apatheia-scaffold/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   └── (app)/
│   │       ├── analysis/       # V6.0 engine analysis
│   │       ├── documents/      # Document management
│   │       ├── sam/            # S.A.M. analysis pipeline
│   │       └── settings/       # Configuration
│   ├── components/
│   │   ├── sam/                # S.A.M. visualization components
│   │   ├── analysis/           # Analysis views
│   │   └── ui/                 # Radix-based UI primitives
│   ├── hooks/                  # React Query hooks
│   ├── lib/
│   │   ├── engines/            # V6.0 analysis engines
│   │   ├── sam/                # S.A.M. orchestration
│   │   └── data/               # Data layer abstraction
│   └── CONTRACT.ts             # Type definitions
├── src-tauri/                  # Rust desktop backend
├── supabase/                   # Database schema
├── docs/                       # Documentation
└── scripts/                    # Development utilities
```

## Analysis Engines (FCIP v6.0)

| Symbol | Engine | Function |
|--------|--------|----------|
| E | Entity Resolution | Canonical identity mapping |
| T | Temporal Parser | Timeline construction |
| A | Argumentation | Toulmin structure building |
| B | Bias Detection | Statistical imbalance analysis |
| K | Contradiction | Cross-document inconsistencies |
| L | Accountability | Statutory duty violations |
| P | Professional | Per-professional behavior patterns |
| O | Omission | Source-to-report gap analysis |
| X | Expert Witness | FJC compliance, scope analysis |
| D | Documentary | Broadcast vs source comparison |
| M | Narrative | Claim mutation tracking |
| S | Coordination | Hidden inter-agency patterns |

## Architecture

**Local-first with optional cloud sync:**

- Tauri provides local document storage and processing
- Supabase enables cross-device sync when connected
- Documents never leave user control without explicit consent

## Development

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test
npm test

# Rust check
cargo check --manifest-path src-tauri/Cargo.toml
```

## License

Proprietary - Apatheia Labs

# Codex Agent Instructions

> Quick-reference for OpenAI Codex working on apatheia-scaffold

## TL;DR

You're working on a **Tauri + Next.js** forensic intelligence app. The human (Paul) is terse, adversarial, and wants minimal hand-holding.

**This project uses a 6-agent system. Check which role applies to your current task.**

---

## AGENT SYSTEM INTEGRATION

This project uses specialized agents with strict boundaries. Before working, identify your role:

| If Working On | You Are | Read |
|---------------|---------|------|
| Project root, integration, verification | **Orchestrator** | CLAUDE.md |
| src-tauri/src/db/, processing/, sam/ | **Rust Agent** | src-tauri/CLAUDE.md |
| src-tauri/src/commands/, lib.rs | **Tauri Agent** | src-tauri/CLAUDE.md |
| src/CONTRACT.ts, lib/tauri/ | **TypeScript Agent** | src/CLAUDE.md |
| src/app/, components/, hooks/ | **Next.js Agent** | src/CLAUDE.md |
| scripts/, modal/, tools/ | **Python Agent** | scripts/CLAUDE.md |

### Key Boundaries
- **Rust Agent** does NOT touch commands/ or frontend
- **Tauri Agent** does NOT touch CONTRACT.ts
- **TypeScript Agent** does NOT touch components or hooks
- **Next.js Agent** does NOT make direct invoke() calls

### Handoff Protocol
When finishing work that another agent must continue:
```
[SOURCE→TARGET HANDOFF]
Location: file path
Signature: function/type signature
Required: what the next agent must do
```

---

## Critical Files

```
src/CONTRACT.ts              ← Type definitions (SSOT)
src-tauri/src/lib.rs         ← Command registration
src-tauri/src/commands/      ← Tauri command handlers
AGENT-SPECIFICATIONS.md      ← Full agent system docs
```

## Integration Verification

Before any work is complete:
```bash
cargo check --manifest-path src-tauri/Cargo.toml  # Rust compiles
npx tsc --noEmit                                   # TypeScript compiles
npm run tauri build -- --no-bundle                 # Tauri builds
```

## Architecture

```
Next.js 14 (frontend) ← NEXT.JS AGENT + TYPESCRIPT AGENT
    ↓ IPC
Tauri commands ← TAURI AGENT
    ↓
Rust backend ← RUST AGENT
    ↓ sqlx
SQLite (local DB)
    ↓ spawns
Python sidecars ← PYTHON AGENT
```

## Style Guide

- TypeScript strict mode
- Rust: follow existing patterns
- No blue in UI
- Minimal dependencies
- No over-engineering

## What Claude Code Does

- Runs AI analysis engines
- Generates findings from document corpus
- Makes architecture decisions
- Handles CASCADE contradiction detection
- Acts as Orchestrator when verifying integration

## What You Do

- Implement features within your agent role
- Respect agent boundaries
- Create handoff notes when crossing boundaries
- Keep types in sync (CONTRACT.ts ↔ Rust)
- Verify integration before marking complete

## Commands

```bash
npm run dev          # Next.js dev
npm run tauri dev    # Full Tauri dev (integration test)
npm run tauri build  # Production build
cargo check          # Rust type check
npx tsc --noEmit     # TypeScript type check
```

---

*Don't ask permission. Infer intent. Respect boundaries. Ship code.*

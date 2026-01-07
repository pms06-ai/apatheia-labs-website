# AGENT SYSTEM QUICK REFERENCE

## Agent Roster

| Agent | Tool | Role | Files |
|-------|------|------|-------|
| **Orchestrator** | Claude Code | Integration verification | CLAUDE.md |
| **Rust** | Claude Code | Backend logic | src-tauri/CLAUDE.md |
| **Tauri** | Claude Code | IPC bridge | src-tauri/CLAUDE.md |
| **TypeScript** | Claude Code | Type contracts | src/CLAUDE.md |
| **Next.js** | Claude Code | UI/hooks | src/CLAUDE.md |
| **Python** | Claude Code | Auxiliary scripts | scripts/CLAUDE.md |
| **Implementer** | Codex 5.2 | Code changes | docs/CODEX.md |
| **Reviewer** | Gemini 3 Pro | Pre-merge review | docs/GEMINI.md |

---

## Integration Flow
```
RUST → cargo check → TAURI → lib.rs → TYPESCRIPT → tsc → NEXT.JS → tauri dev → DONE
```

## Workflow
```
Codex implements → Claude verifies → Gemini reviews → Merge
```

---

## Ownership Matrix

| Directory | Owner | Coordinates With |
|-----------|-------|------------------|
| src-tauri/src/db/ | Rust | — |
| src-tauri/src/processing/ | Rust | — |
| src-tauri/src/sam/ | Rust | — |
| src-tauri/src/commands/ | **Tauri** | Rust → TypeScript |
| src-tauri/src/lib.rs | **Tauri** | — |
| src/CONTRACT.ts | **TypeScript** | Rust (must match) |
| src/lib/tauri/commands.ts | **TypeScript** | Tauri (signatures) |
| src/app/ | Next.js | — |
| src/components/ | Next.js | — |
| src/hooks/ | Next.js | TypeScript (types) |
| scripts/ | Python | — |

---

## Handoff Notes Format

```
[SOURCE→TARGET HANDOFF]
Location: file path
Signature: function signature
Required: what target must do
```

---

## Verification Commands

```bash
# Rust
cargo check --manifest-path src-tauri/Cargo.toml

# TypeScript
npx tsc --noEmit

# Tauri
npm run tauri build -- --no-bundle

# Full Integration
npm run tauri dev
```

---

## Review Checklist (Gemini)

| Check | Verify |
|-------|--------|
| Types | CONTRACT.ts ↔ Rust structs |
| IPC | invoke() args ↔ #[tauri::command] params |
| Errors | Result<T, String>, no unwrap() |
| Events | emit_all() ↔ events.ts listeners |
| Security | No allowlist bypasses |

---

## Current Priority Fixes (From Codex)

1. **IPC + file picker** — Wrong arg names, allowlist bypass
2. **AppState init** — Race condition in lib.rs
3. **SAM alignment** — CONTRACT.ts ↔ analysis.rs mismatch
4. **Search wiring** — use-search.ts not using Tauri

---

## File Locations

| What | Where |
|------|-------|
| Full spec | `AGENT-SPECIFICATIONS.md` |
| Agent prompts | `agent-prompts/*.md` |
| Codex instructions | `docs/CODEX.md` |
| Gemini instructions | `docs/GEMINI.md` |
| Integration failures | `.auto-claude/insights/integration_failures.json` |

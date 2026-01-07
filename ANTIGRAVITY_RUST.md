# Antigravity Setup Guide: Rust/Next.js/Tauri Stack

**For: Apatheia Labs Forensic Analysis Platform**

---

## Quick Start

1. Copy this file to your project root
2. Create the AGENTS.md files in your project using the templates below
3. Configure Antigravity settings as described
4. Use the prompt templates when working with Gemini 3 Pro

---

## Part 1: AGENTS.md (Project Root)

Create `/AGENTS.md`:

```markdown
# Tauri + Next.js + Rust Application

## Tech Stack
- **Rust Backend**: Tauri 2.x, tokio async runtime, serde for serialization
- **Frontend**: Next.js 14+, React 18+, TypeScript, TailwindCSS
- **IPC**: Tauri command system (Rust → Frontend invocation)
- **Build**: Cargo (Rust), pnpm (Node), Tauri CLI

## Project Structure
```
project/
├── src-tauri/                    # Rust backend (cargo project)
│   ├── src/
│   │   ├── lib.rs               # Tauri command exports
│   │   ├── main.rs              # App initialization & window setup
│   │   ├── commands/            # Tauri command modules
│   │   │   ├── mod.rs
│   │   │   ├── filesystem.rs
│   │   │   ├── processing.rs
│   │   │   └── ai_integration.rs
│   │   └── services/            # Core business logic
│   │       ├── mod.rs
│   │       ├── document_parser.rs
│   │       ├── forensics.rs
│   │       └── rag_engine.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                          # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/                 # Optional: Next.js API routes
│   ├── components/
│   ├── hooks/
│   │   └── useTauriCommand.ts   # Wrapper for Tauri IPC
│   ├── lib/
│   │   └── tauri-client.ts      # Tauri command definitions
│   ├── styles/
│   └── types/
│       └── commands.ts           # TypeScript definitions for Rust commands
├── package.json
├── tsconfig.json
└── next.config.js
```

## Command Execution

### Build & Run
```bash
# Development
npm run tauri dev

# Production build
npm run tauri build

# Rebuild Rust without full rebuild
cargo build --release --manifest-path src-tauri/Cargo.toml

# Run tests
cargo test --manifest-path src-tauri/Cargo.toml
npm test
```

## Code Style & Patterns

### Rust Backend
- Use `#[tauri::command]` macro for frontend-facing functions
- All public commands must be `async fn` for responsiveness
- Return types: `Result<T, String>` (serializes to JSON)
- Use `serde::Serialize` + `serde::Deserialize` for all data structures
- Leverage Rust's type system: prefer custom types over string-based checks
- Use `tokio::spawn` for background tasks
- Handle errors explicitly—never unwrap in command handlers

### Next.js Frontend
- Use `@tauri-apps/api` for all Rust interactions
- Functional components, TypeScript strict mode
- Custom hook `useTauriCommand<T>` for invoking Rust
- Keep async logic in hooks, not components
- Memoize expensive Rust command definitions

### IPC Architecture
- Commands are the **only** way to call Rust from frontend
- Frontend cannot directly access Rust modules
- Use typed wrappers to prevent string-based errors
- Batch command calls to minimize IPC overhead (50ms latency per call)
- Serialize/deserialize only what you need

## Tauri Command Pattern

**Good example**: Structured command with error handling
```rust
#[tauri::command]
async fn process_document(
    path: String,
    options: ProcessOptions,
) -> Result<DocumentResult, String> {
    // Type-safe, returns Result<T, String>
    // Frontend receives JSON with either success or error
}
```

**Bad example**: String-based operations
```rust
#[tauri::command]
fn process(input: String) -> String {
    // Hard to type-check from frontend
    // Errors hidden in JSON strings
}
```

## Dependencies to Avoid
- Large Python sidecar (see "Agent Architecture" below)
- Direct filesystem access from frontend without commands
- HTTP servers competing with Tauri's HTTP scope
- Browser APIs not available in native context (localStorage, IndexedDB)

## Frontend-Backend Communication

All data flows through Tauri commands:
```
Next.js Component
    ↓
useTauriCommand hook
    ↓
invoke("command_name", { args })
    ↓
Tauri IPC layer
    ↓
#[tauri::command] Rust function
    ↓
Response serialized to JSON
    ↓
Result<T> in React state
```

Never bypass this through filesystem, environment variables, or sockets.

## Workflow & Agents

### When Working on Rust Code
- Compile frequently: `cargo check` after every change
- Type system is your friend—use custom types, not strings
- Read compiler errors carefully; they guide the implementation
- Write command signatures first, implementation second

### When Working on Next.js Code
- Keep UI and Tauri integration separate
- Test components without Rust (mock useTauriCommand)
- Understand Next.js build process strips SSR code for Tauri

### When Working on IPC
- Minimize round-trips: batch operations when possible
- Test commands individually with Tauri DevTools
- Version commands if you plan to update app logic

## Agent Boundaries

### Always Do
- Run `cargo check` before major Rust changes
- Test Tauri commands in isolation
- Keep Rust and Next.js tests separate
- Document command signatures (input types, return types, errors)

### Ask Before
- Changing Tauri command return types (breaks frontend)
- Adding new IPC-heavy features
- Modifying build pipeline
- Updating Rust dependencies

### Never Do
- Modify `tauri.conf.json` without reviewing implications
- Use runtime string-based dispatch (use Rust enums instead)
- Commit compiled artifacts (Cargo.lock for src-tauri OK, dist/ NO)
- Bypass Tauri's security model (don't use `allow: "*"`)
```

---

## Part 2: Rust Backend CLAUDE.md

Create `/src-tauri/CLAUDE.md`:

```markdown
# Rust Backend - Tauri Core

## File Organization

**Commands Module** (`src/commands/mod.rs`):
Exports all `#[tauri::command]` functions. This is the frontend's interface.

**Services Module** (`src/services/`):
Core business logic, independent of Tauri. Services don't know about the IPC layer.

**Main Entry** (`src/main.rs`):
Initializes Tauri, sets up window, configures security policy.

## Patterns

### Tauri Command Template
```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct MyInput {
    pub field: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MyOutput {
    pub result: String,
}

#[tauri::command]
pub async fn my_command(input: MyInput) -> Result<MyOutput, String> {
    // Validate
    if input.field.is_empty() {
        return Err("Field cannot be empty".to_string());
    }
    
    // Process
    let result = format!("Processed: {}", input.field);
    
    // Return
    Ok(MyOutput { result })
}
```

### Error Handling (Critical)
Always return `Result<T, String>`. Rust's `.map_err(|e| e.to_string())` converts errors to strings for JSON serialization.

```rust
// Good: Convert errors to String
let data = std::fs::read_to_string(path)
    .map_err(|e| format!("Failed to read file: {}", e))?;

// Bad: Panics crash the app
let data = std::fs::read_to_string(path).unwrap();
```

### Async Pattern
All Tauri commands should be async. Use `tokio` for I/O:

```rust
#[tauri::command]
async fn fetch_from_api(url: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client.get(&url)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    response.text().await.map_err(|e| e.to_string())
}
```

## Dependencies
Core dependencies in `Cargo.toml`:
- `tauri` - Framework
- `serde` + `serde_json` - Serialization
- `tokio` - Async runtime
- `reqwest` - HTTP client
- `log` + `env_logger` - Logging
- Custom crates for domain logic

## Build & Testing
```bash
# Type-check without building
cargo check

# Run tests
cargo test

# Build for dev
cargo build

# Build for release
cargo build --release
```

## Compiler Errors
Rust's compiler is helpful. Read errors top-to-bottom. Example:
```
error[E0382]: value used after move
  --> src/main.rs:42:10
   |
42 |     println!("{}", value);
   |                    ^^^^^ value borrowed after move
```
This tells you exactly what's wrong and where. Fix it by understanding ownership.

## No Dynamic Dispatch Here
Unlike Python/JS, you can't change Rust function behavior at runtime without rebuilding. Type system enforces contracts at compile time. This is good for stability, bad for rapid iteration. Use generics and traits for flexibility.
```

---

## Part 3: Frontend CLAUDE.md

Create `/src/CLAUDE.md`:

```markdown
# Next.js Frontend

## Key Files

**App Router** (`app/page.tsx`):
Main application page. This file runs ONLY in browser (SSR code stripped).

**Tauri Integration** (`lib/tauri-client.ts`):
Wrapper types around `@tauri-apps/api`. Keep command invocations here.

**Hooks** (`hooks/useTauriCommand.ts`):
Custom hook that abstracts loading/error/success states for Rust calls.

## Important: SSR is Stripped for Tauri

Tauri builds Next.js with `output: 'export'` (static export), not SSR. This means:
- ❌ `getServerSideProps` won't work
- ❌ Next.js API routes (/app/api) won't run
- ✅ Only client-side code executes
- ✅ Use `'use client'` directive consciously but know it's all client-side

## Tauri Integration Pattern

### useTauriCommand Hook
```typescript
// hooks/useTauriCommand.ts
import { invoke } from '@tauri-apps/api/tauri';
import { useState, useEffect } from 'react';

interface UseCommandState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useTauriCommand<T>(
  commandName: string,
  args?: Record<string, any>
): UseCommandState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseCommandState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const result = await invoke<T>(commandName, args || {});
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ 
        data: null, 
        loading: false, 
        error: err instanceof Error ? err.message : String(err)
      });
    }
  };

  useEffect(() => {
    execute();
  }, [commandName, JSON.stringify(args)]);

  return { ...state, refetch: execute };
}
```

## Component Pattern
```typescript
'use client';

import { useTauriCommand } from '@/hooks/useTauriCommand';

interface Document {
  id: string;
  title: string;
}

export function DocumentList() {
  const { data, loading, error } = useTauriCommand<Document[]>(
    'list_documents'
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {data?.map(doc => (
        <li key={doc.id}>{doc.title}</li>
      ))}
    </ul>
  );
}
```

## TypeScript Definitions

Create `/types/commands.ts` to match Rust command signatures:

```typescript
// Matches Rust: struct ProcessOptions { ... }
export interface ProcessOptions {
  maxSize: number;
  enableOcr: boolean;
}

// Matches Rust: Result<DocumentResult, String>
export interface DocumentResult {
  id: string;
  text: string;
  metadata: Record<string, any>;
}
```

This prevents runtime errors from mismatched arguments.

## Testing (No Tauri in Tests)
Mock Tauri calls for component tests:

```typescript
// __tests__/DocumentList.test.tsx
import { render, screen } from '@testing-library/react';
import { DocumentList } from '@/components/DocumentList';

// Mock useTauriCommand
jest.mock('@/hooks/useTauriCommand', () => ({
  useTauriCommand: () => ({
    data: [{ id: '1', title: 'Doc 1' }],
    loading: false,
    error: null,
  }),
}));

test('displays documents', () => {
  render(<DocumentList />);
  expect(screen.getByText('Doc 1')).toBeInTheDocument();
});
```

## Build Gotchas
- Next.js output must be static for Tauri (`output: 'export'` in next.config.js)
- Environment variables with prefix `NEXT_PUBLIC_` are embedded at build time
- Imports from Rust (src-tauri/) don't work—use Tauri commands only
```

---

## Part 4: Tauri Architecture Documentation

Create `/TAURI_ARCHITECTURE.md`:

```markdown
# Tauri Configuration & IPC Architecture

## tauri.conf.json Key Sections

**Build**:
```json
"build": {
  "beforeBuildCommand": "npm run build",  // Build Next.js first
  "beforeDevCommand": "npm run dev",      // Dev server
  "devPath": "http://localhost:3000",     // Dev server URL
  "frontendDist": "../out"                // Production output (Next.js static export)
}
```

**Security - Allowlist**:
Control what Rust can access from the native OS:
```json
"security": {
  "csp": "default-src 'self'",
  "capabilities": [
    {
      "allowlist": {
        "fs": {
          "scope": ["$APPDATA/myapp/*"],    // Restrict file access
          "readDir": true,
          "readFile": true,
          "writeFile": true
        },
        "http": {
          "scope": ["https://api.example.com/*"]  // Restrict API calls
        }
      }
    }
  ]
}
```

## Command Registration

In `src/main.rs`:
```rust
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // Import all commands
            commands::filesystem::read_file,
            commands::processing::process_document,
            commands::ai_integration::summarize,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Frontend Invocation
```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Invoke a Rust command
const result = await invoke('process_document', {
  path: '/path/to/doc.pdf',
  options: { enableOcr: true }
});
```

## Background Tasks
Don't block commands. Offload long operations:

```rust
#[tauri::command]
pub fn start_background_processing(app_handle: tauri::AppHandle) -> Result<String, String> {
    let task_id = uuid::Uuid::new_v4().to_string();
    let task_id_clone = task_id.clone();
    
    tokio::spawn(async move {
        // Long-running operation
        let result = expensive_computation().await;
        
        // Emit event to frontend when done
        app_handle.emit_all("processing_complete", &result).ok();
    });
    
    Ok(task_id)  // Return immediately
}
```

Then listen in React:
```typescript
import { listen } from '@tauri-apps/api/event';

useEffect(() => {
  const unlisten = listen('processing_complete', (event) => {
    console.log('Processing done:', event.payload);
  });
  
  return () => { unlisten.then(f => f()); };
}, []);
```

## IPC Performance
- Each Tauri command call has ~50ms overhead (JSON serialization)
- Batch related operations: pass multiple items in one command
- Don't call Tauri commands in render loops
- Cache Rust responses in React state, not querying repeatedly
```

---

## Part 5: Gemini 3 Pro Prompt Templates

### Template A: Rust Architecture Planning

```markdown
You are a senior Rust engineer building a Tauri desktop application.

CRITICAL CONSTRAINTS:
- Rust's compiler enforces correctness at compile time
- All public Tauri commands must return Result<T, String> for JSON serialization
- Never use .unwrap() in command handlers—always handle errors with ?
- All data structures used in IPC must implement Serialize/Deserialize
- Async/await is required for all I/O operations (use tokio)

CONTEXT:
We're building a forensic document analysis tool. The Rust backend handles:
1. File I/O (reading PDFs, documents)
2. Long-running document processing (OCR, parsing)
3. RAG-based search across document corpus
4. Real-time event emission to React frontend

ARCHITECTURE TO FOLLOW:
- Commands live in src/commands/ (IPC layer)
- Services live in src/services/ (business logic)
- Separate concerns: commands don't contain domain logic

TASK:
[INSERT YOUR SPECIFIC REQUIREMENT HERE]

OUTPUT FORMAT:
1. Full implementation with proper error handling
2. Custom error types where needed (implement From trait)
3. Tauri command wrapper that calls the service
4. Unit tests using #[tokio::test]

VALIDATION:
- Code must pass `cargo check` without warnings
- No unwrap() calls
- All error paths tested
```

### Template B: IPC Contract Definition

```markdown
ROLE: Rust/Frontend Integration Engineer

CONTEXT:
We're exposing functionality to the Next.js frontend via Tauri IPC.

TASK:
Design the complete IPC contract for [FEATURE NAME]:

Frontend needs to:
- [ACTION 1]
- [ACTION 2]
- [ACTION 3]

Rust service capabilities:
- [CAPABILITY 1]
- [CAPABILITY 2]

DELIVERABLE:
1. Serde data structures for all messages (Rust)
2. Tauri command definitions
3. Event emission strategy for async operations
4. Error handling & retry logic
5. TypeScript definitions matching Rust types
6. React hook wrapping the commands

VALIDATION:
- Type safety: Compiler prevents mismatched args
- Backward compatibility: How do we add new fields?
- Error cases: What if operation fails mid-stream?
```

### Template C: Compiler-Driven Development

```markdown
The Rust compiler has reported these errors:

[PASTE COMPILER OUTPUT HERE]

CONTEXT:
[DESCRIBE WHAT YOU'RE TRYING TO ACCOMPLISH]

TASK:
Fix the compiler errors. For each error, explain:
1. What went wrong
2. Why Rust reports it
3. The correct approach
4. How to prevent similar errors

Consider ownership, lifetimes, and the borrowing rules.
```

### Template D: Next.js Component with Rust Integration

```markdown
You are a React/TypeScript specialist building Next.js components for a Tauri desktop app.

CONTEXT:
Our app needs [FEATURE DESCRIPTION]. The Rust backend provides these commands:
- [RUST COMMAND 1] - returns [TYPE]
- [RUST COMMAND 2] - returns [TYPE]

PATTERNS TO FOLLOW:
- Use useTauriCommand<T> hook from @/hooks/useTauriCommand.ts
- Functional components with TypeScript strict mode
- Mock Tauri in component tests
- Keep loading/error/success states explicit
- Never call Tauri commands during render

TASK:
Build a React component that [SPECIFIC REQUIREMENT]

DELIVERABLE:
1. React component with types
2. Tests mocking Tauri commands
3. Error boundaries/fallback UI
4. TypeScript definitions if needed
```

---

## Part 6: Antigravity Configuration

### In Antigravity Settings

**Agent Manager - Terminal Policy**:
- Set to "Turbo Mode" for auto-execution
- Add to Deny list: `rm`, `rmdir`, `sudo`, `curl` (untrusted URLs), `wget`
- Allow: `cargo build`, `cargo check`, `npm run`, `tauri`, `git`

**Review Policy**:
- Start with "Agent Decides"
- Move to "Always Proceed" after you trust the agent's patterns

**Custom Instructions** (Cmd+Shift+P → "Preferences"):

```markdown
# Apatheia Labs Tauri/Rust Development Guidelines

You are a pragmatic senior engineer building forensic analysis tools in Rust/Next.js/Tauri.

## Approach
1. Explore architecture strategically before coding
2. Trust Rust's compiler as your guide
3. Separate concerns: commands, services, tests
4. Type safety prevents runtime errors
5. Batch Tauri IPC calls for performance

## Critical Constraints
- No unwrap() in production code
- All Tauri commands return Result<T, String>
- Frontend accesses Rust only via typed commands
- Tests use #[tokio::test] for async code
- cargo check passes before any command runs

## When You're Unsure
- Ask about ownership/borrowing patterns
- Share compiler errors for guidance
- Validate IPC contracts with TypeScript types
- Test Rust in isolation from frontend
```

### Keyboard Shortcuts

Add to VS Code settings.json (Cmd+Shift+P → "Preferences: Open Keyboard Shortcuts JSON"):

```json
{
  "key": "cmd+shift+t",
  "command": "runCommands",
  "args": {
    "commands": [
      { "command": "workbench.action.terminal.toggleTerminal" },
      { "command": "shellCommand.execute", "args": "cargo check --manifest-path src-tauri/Cargo.toml" }
    ]
  }
},
{
  "key": "cmd+shift+b",
  "command": "runCommands",
  "args": {
    "commands": [
      { "command": "workbench.action.terminal.toggleTerminal" },
      { "command": "shellCommand.execute", "args": "npm run tauri build" }
    ]
  }
}
```

---

## Part 7: Development Workflows

### Multi-Agent Parallel Development

```bash
# Terminal 1: Main development
cd /path/to/project
npm run tauri dev

# Terminal 2: Rust backend (git worktree)
git worktree add ../project-rust-feature feature/document-processing
cd ../project-rust-feature
# Open Antigravity here, work on Rust with Gemini 3 Pro

# Terminal 3: Frontend feature (git worktree)
git worktree add ../project-frontend-feature feature/document-ui
cd ../project-frontend-feature
# Open another Antigravity, work on React with Claude Code

# When complete, merge back
cd /path/to/project
git merge --no-ff ../project-rust-feature
git merge --no-ff ../project-frontend-feature

# Cleanup
git worktree remove ../project-rust-feature
git worktree remove ../project-frontend-feature
```

### Compile-Driven Development Cycle

```
1. Describe what you want to build
   ↓
2. Gemini 3 Pro generates skeleton code
   ↓
3. Run: cargo check --manifest-path src-tauri/Cargo.toml
   ↓
4. Share compiler errors with Gemini
   ↓
5. Gemini explains + fixes
   ↓
6. Repeat until clean
   ↓
7. Build: cargo build --release --manifest-path src-tauri/Cargo.toml
```

### Testing Strategy

```bash
# Rust unit tests
cargo test --manifest-path src-tauri/Cargo.toml

# Frontend component tests (mocked Tauri)
npm test

# Integration: Build and test Tauri dev server
npm run tauri dev
# Test in UI manually

# Production build
npm run tauri build
```

---

## Part 8: Troubleshooting

### `cargo check` Fails After Code Changes

**Problem**: Modify Rust code but compiler still complains about old code.

**Solution**:
```bash
# Clean build
cargo clean --manifest-path src-tauri/Cargo.toml
cargo build --manifest-path src-tauri/Cargo.toml

# Or restart Antigravity
```

### Tauri Command Not Found in Frontend

**Problem**: `invoke('my_command')` throws "command not found".

**Solution**:
1. Verify command is defined with `#[tauri::command]` macro
2. Verify it's added to `generate_handler![]` in main.rs
3. Rebuild with `npm run tauri dev`

### IPC Serialization Error

**Problem**: "Unsupported type in Tauri command"

**Solution**: Ensure your Rust struct derives `Serialize` + `Deserialize`:
```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]  // Add this line
pub struct MyData {
    pub field: String,
}
```

### Next.js Build Strips Tauri Code

**Problem**: Trying to import Next.js/React code in Rust.

**Solution**: This is impossible by design. Data flows one direction: Rust → Tauri IPC → Frontend. Never import frontend code into Rust.

### 50ms Latency Between Rust & Frontend

**Problem**: Each Tauri command call feels slow.

**Solution**: 
- Batch operations: send multiple items in one command instead of many calls
- Cache results in React state
- Use event emission for fire-and-forget operations

---

## Part 9: Quick Reference

### Essential Commands

```bash
# Development
npm run tauri dev              # Start dev server (Rust + Next.js)
cargo check                    # Type-check Rust (fast)
cargo test                     # Run Rust unit tests
npm test                       # Run Next.js component tests

# Production
npm run tauri build            # Build full app
cargo build --release          # Rust only

# Cleanup
cargo clean                    # Remove build artifacts
git worktree list             # List git worktrees
git worktree remove <path>    # Remove completed worktree
```

### File Locations to Remember

| File | Purpose |
|------|---------|
| `/src-tauri/src/main.rs` | Tauri app initialization |
| `/src-tauri/src/commands/mod.rs` | Tauri command exports |
| `/src-tauri/src/services/` | Rust business logic |
| `/src/lib/tauri-client.ts` | TypeScript command wrappers |
| `/src/hooks/useTauriCommand.ts` | React hook for Rust calls |
| `/src/types/commands.ts` | TypeScript definitions matching Rust |
| `/tauri.conf.json` | Tauri configuration & security |
| `/AGENTS.md` | Agent instructions |

### Prompt Templates to Use

**For Rust work**: Use Template A (Architecture) or Template C (Compiler-Driven)
**For Frontend work**: Use Template D (React with Rust)
**For IPC Design**: Use Template B (IPC Contract)
**For Planning**: Use Template A with context from your domain

---

## Part 10: Integration with Apatheia Labs

### Your Use Case: Forensic Document Analysis

**Rust side** (PDF processing, OCR, embeddings):
```rust
#[tauri::command]
async fn process_evidence_document(
    path: String,
    chain_of_custody_id: String,
) -> Result<DocumentAnalysis, String> {
    // Heavy lifting: file I/O, OCR, embedding generation
}
```

**Frontend side** (display results, manage chain of custody):
```typescript
const { data: analysis, loading } = useTauriCommand<DocumentAnalysis>(
  'process_evidence_document',
  { path, chain_of_custody_id }
);
```

### Recommended Architecture

1. **Rust handles**:
   - PDF parsing & OCR (heavy computation)
   - Embedding generation for RAG
   - Database queries (PostgreSQL via SQLx)
   - File operations with security scoping

2. **Next.js handles**:
   - UI/UX (chain of custody visualization, timeline)
   - Form handling (document upload, filtering)
   - Real-time updates (listen for processing events)

3. **Python sidecar** (optional):
   - If using LangChain or LlamaIndex agents
   - Launch as subprocess from Rust
   - Communicate via stdin/stdout or HTTP

---

## Setup Checklist

- [ ] Copy `AGENTS.md` to project root
- [ ] Create `/src-tauri/CLAUDE.md`
- [ ] Create `/src/CLAUDE.md`
- [ ] Create `/TAURI_ARCHITECTURE.md`
- [ ] Add custom instructions to Antigravity settings
- [ ] Set Agent Manager terminal policy to "Turbo"
- [ ] Test with: `cargo check --manifest-path src-tauri/Cargo.toml`
- [ ] Run: `npm run tauri dev` to verify setup
- [ ] Create git worktrees for parallel feature development

---

**You're ready to build!** Use Gemini 3 Pro for Rust/architecture planning, Claude Code for intricate React components, and let the Rust compiler guide development through compile-driven iteration.

# Phronesis FCIP - Tauri + Next.js + Rust Application

## Tech Stack

- **Rust Backend**: Tauri 2.x, tokio async runtime, serde for serialization
- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **IPC**: Tauri command system (Rust → Frontend invocation)
- **Build**: Cargo (Rust), npm (Node), Tauri CLI
- **Database**: SQLite (local), Supabase (cloud sync planned)

## Project Structure

```
apatheia-scaffold/
├── src-tauri/                    # Rust backend (cargo project)
│   ├── src/
│   │   ├── lib.rs               # Tauri setup, AppState, command exports
│   │   ├── main.rs              # Entry point
│   │   ├── commands/            # Tauri command modules
│   │   │   ├── mod.rs           # Re-exports all commands
│   │   │   ├── analysis.rs      # S.A.M. analysis, findings, engines
│   │   │   ├── cases.rs         # Case CRUD operations
│   │   │   ├── documents.rs     # Document management, processing
│   │   │   ├── export.rs        # File export with dialog
│   │   │   └── settings.rs      # App settings, API validation
│   │   ├── db/                  # SQLite database layer
│   │   ├── orchestrator/        # Engine orchestration, job management
│   │   ├── processing/          # Document chunking, text extraction
│   │   ├── sam/                 # S.A.M. methodology implementation
│   │   └── storage/             # File storage abstraction
│   ├── sidecars/               # Node.js sidecar (engine-runner.js)
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                          # Next.js frontend
│   ├── app/                     # Next.js App Router pages
│   ├── components/              # React components
│   ├── hooks/                   # React Query hooks
│   │   ├── use-cases.ts         # Case operations
│   │   ├── use-documents.ts     # Document operations
│   │   ├── use-analysis.ts      # Analysis/findings
│   │   ├── use-sam-analysis.ts  # S.A.M. workflow
│   │   └── use-search.ts        # Document search
│   ├── lib/
│   │   ├── tauri/              # Tauri IPC layer
│   │   │   ├── client.ts        # Environment detection, invoke wrapper
│   │   │   ├── commands.ts      # Type-safe command wrappers
│   │   │   └── events.ts        # Event listeners
│   │   ├── engines/            # Frontend engine integrations
│   │   └── sam/                # S.A.M. frontend logic
│   ├── CONTRACT.ts              # Shared type definitions
│   └── types/                   # Additional TypeScript types
├── package.json
├── tsconfig.json
└── next.config.js
```

## Command Execution

### Build & Run

```bash
# Development (starts both Next.js dev server and Tauri)
npm run tauri dev

# Production build
npm run tauri build

# Type-check Rust without building
cargo check --manifest-path src-tauri/Cargo.toml

# Run Rust tests
cargo test --manifest-path src-tauri/Cargo.toml

# Run frontend tests
npm test
```

## Code Patterns

### Rust Backend

- All commands use `#[tauri::command]` macro
- Commands are async (`async fn`) for responsiveness
- Return types: `Result<T, String>` for JSON serialization
- Use `serde::Serialize` + `serde::Deserialize` for all IPC structs
- AppState uses `Arc<Mutex<T>>` for thread-safe shared state
- Errors converted via `.map_err(|e| e.to_string())?`

### Next.js Frontend

- Environment-aware: `isDesktop()` routes to Tauri, else Supabase
- Custom hooks wrap Tauri commands with React Query
- Type definitions in `CONTRACT.ts` match Rust structs
- All Tauri calls go through `src/lib/tauri/commands.ts`
- Components use `'use client'` directive for Tauri compatibility

### IPC Architecture

```
React Component
    ↓
Custom Hook (use-cases.ts, use-documents.ts, etc.)
    ↓
src/lib/tauri/commands.ts
    ↓
isDesktop() check
    ↓ (desktop)
invoke("command_name", { args })
    ↓
Tauri IPC layer
    ↓
#[tauri::command] Rust function
    ↓
Result<T, String> → JSON
    ↓
React state
```

## Agent Boundaries

### Always Do

- Run `cargo check` before committing Rust changes
- Ensure TypeScript types match Rust struct definitions
- Use existing hooks; don't bypass `src/lib/tauri/`
- Handle both desktop and web modes in commands.ts

### Ask Before

- Changing Tauri command signatures (breaks frontend)
- Adding new modules to src-tauri/src/
- Modifying AppState structure
- Changing tauri.conf.json security settings

### Never Do

- Use `.unwrap()` in Tauri command handlers
- Bypass IPC with direct filesystem access from frontend
- Commit with `cargo check` failures
- Use `allow: "*"` in security configuration

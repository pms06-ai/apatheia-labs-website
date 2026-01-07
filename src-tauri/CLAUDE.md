# Rust Backend - Tauri Core

## AGENT ROLES IN THIS DIRECTORY

When working in src-tauri/, you operate as **two distinct agents** depending on the files:

### RUST AGENT (db/, processing/, sam/, storage/, orchestrator/)
- Owns: Core business logic, database layer, S.A.M. methodology
- Does NOT touch: commands/, lib.rs (that's Tauri Agent)
- Handoff: When done, create `[RUST→TAURI HANDOFF]` note

### TAURI AGENT (commands/, lib.rs, tauri.conf.json, capabilities/)
- Owns: IPC bridge between Rust and TypeScript
- Does NOT touch: CONTRACT.ts (that's TypeScript Agent)
- Handoff: When done, create `[TAURI→TYPESCRIPT HANDOFF]` note

---

## Module Organization

**lib.rs** - Application entry point (TAURI AGENT)
- `AppState` struct with `Arc<Mutex<T>>` for shared state
- Tauri plugin setup (log, shell, fs, dialog)
- Command registration via `generate_handler![]`

**commands/** - All Tauri IPC handlers (TAURI AGENT)
- `mod.rs` - Re-exports all command modules
- `analysis.rs` - S.A.M. analysis, findings, engine execution
- `cases.rs` - Case CRUD operations
- `documents.rs` - Document upload, processing, search
- `export.rs` - File export with native dialog
- `settings.rs` - App settings, API key validation

**db/** - SQLite database layer (RUST AGENT)
**orchestrator/** - Engine job management (RUST AGENT)
**processing/** - Document processing (RUST AGENT)
**sam/** - S.A.M. methodology (RUST AGENT)
**storage/** - File storage (RUST AGENT)

---

## RUST AGENT: Code Standards

```rust
// REQUIRED: All structs crossing IPC must be serializable
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YourStruct { ... }

// REQUIRED: Document IPC-crossing types
/// TypeScript type: YourStruct in CONTRACT.ts
pub struct YourStruct { ... }

// FORBIDDEN: .unwrap() in any code path
// FORBIDDEN: panic!() in library code

// REQUIRED: Error handling with conversion
pub fn your_function() -> Result<T, YourError> {
    something().map_err(|e| YourError::from(e))?
}
```

### Rust Agent Handoff Protocol

When creating functionality that needs IPC exposure:
```
[RUST→TAURI HANDOFF]
Function: process_document(doc_id: &str) -> Result<ProcessedDoc, Error>
Location: src-tauri/src/processing/mod.rs
IPC Signature: process_document { doc_id: string } → ProcessedDoc
TypeScript Type Required: ProcessedDoc in CONTRACT.ts
```

### Rust Agent Verification
```bash
cargo check --manifest-path src-tauri/Cargo.toml
cargo test --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
```

---

## TAURI AGENT: Command Pattern

```rust
use crate::AppState;
use serde::{Deserialize, Serialize};
use tauri::State;

/// Tauri command for [functionality].
/// TypeScript binding: commands.ts::yourCommand()
/// CONTRACT.ts type: YourResponse
#[tauri::command]
pub async fn your_command(
    state: State<'_, AppState>,
    input: YourInput,
) -> Result<YourResponse, String> {
    let db = state.db.lock().await;
    
    // Call Rust Agent's implementation (NOT inline logic)
    crate::processing::do_thing(&db, &input)
        .await
        .map_err(|e| e.to_string())
}
```

### lib.rs Registration (CRITICAL)

Every command MUST be registered:
```rust
.invoke_handler(tauri::generate_handler![
    // existing commands...
    commands::your_module::your_command,  // ← ADD NEW COMMANDS
])
```

### Tauri Agent Handoff Protocol

After wiring a command:
```
[TAURI→TYPESCRIPT HANDOFF]
Command: your_command
Signature: invoke("your_command", { arg: string }) → YourResponse
Required in CONTRACT.ts: interface YourResponse { ... }
Required in commands.ts: export async function yourCommand(...)
```

### Tauri Agent Verification
```bash
cargo check --manifest-path src-tauri/Cargo.toml
grep -r "your_command" src-tauri/src/lib.rs  # Verify registration
npm run tauri build -- --no-bundle
```

---

## Error Handling (Both Agents)

Always return `Result<T, String>` for IPC. Convert errors with `.map_err()`:

```rust
// Good: Convert errors to String
let data = std::fs::read_to_string(path)
    .map_err(|e| format!("Failed to read: {}", e))?;

// Bad: Never panic in command handlers
let data = std::fs::read_to_string(path).unwrap(); // NO!
```

## AppState Access

```rust
#[tauri::command]
pub async fn example(state: State<'_, AppState>) -> Result<String, String> {
    let db = state.db.lock().await;
    let storage = state.storage.lock().await;
    let tokens = state.sam_tokens.lock().await;
    Ok("done".to_string())
}
```

## Type Mapping (Rust → TypeScript)

| Rust | TypeScript |
|------|------------|
| `String` | `string` |
| `i32/i64/f32/f64` | `number` |
| `bool` | `boolean` |
| `Option<T>` | `T \| null` |
| `Vec<T>` | `T[]` |
| `HashMap<K, V>` | `Record<K, V>` |
| `DateTime<Utc>` | `string` (ISO format) |

## Build Commands

```bash
cargo check              # Type-check (fast)
cargo test               # Run tests
cargo build              # Dev build
cargo build --release    # Release build
cargo clean              # Clean artifacts
```

## Adding a New Feature (Full Flow)

1. **RUST AGENT**: Create implementation in db/, processing/, or sam/
2. **RUST AGENT**: Document struct with `/// TypeScript: SomeType`
3. **RUST AGENT**: Create `[RUST→TAURI HANDOFF]` note
4. **TAURI AGENT**: Create command in commands/*.rs
5. **TAURI AGENT**: Register in lib.rs generate_handler![]
6. **TAURI AGENT**: Create `[TAURI→TYPESCRIPT HANDOFF]` note
7. **ORCHESTRATOR**: Verify cargo check + tsc --noEmit

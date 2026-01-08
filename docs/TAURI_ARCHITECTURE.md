# Tauri Configuration & IPC Architecture

## tauri.conf.json Key Sections

### Build

```json
"build": {
  "frontendDist": "../out",           // Next.js static export
  "devUrl": "http://localhost:3000",  // Dev server
  "beforeDevCommand": "npm run dev",
  "beforeBuildCommand": "npm run build && npm run build:sidecar"
}
```

### Security - CSP

```json
"security": {
  "csp": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.anthropic.com https://*.supabase.co ipc: tauri:"
}
```

Allowed external connections:

- `api.anthropic.com` - Claude API
- `*.supabase.co` - Supabase backend (cloud sync)

### Bundled Resources

```json
"resources": [
  "sidecars/engine-runner.js",
  "sidecars/package.json"
]
```

The sidecar is bundled and found via `find_sidecar_path()` in lib.rs.

## Command Registration

In `src-tauri/src/lib.rs`:

```rust
.invoke_handler(tauri::generate_handler![
    // Case commands
    commands::get_cases,
    commands::get_case,
    commands::create_case,
    commands::delete_case,
    // Document commands
    commands::get_documents,
    commands::upload_document,
    commands::process_document,
    // ... 30+ commands
])
```

All commands must be registered here to be callable from frontend.

## Frontend Invocation

```typescript
// src/lib/tauri/client.ts
import { invoke } from '@tauri-apps/api/core'

// Type-safe wrapper
const result = await invoke<CaseResult>('get_cases')
```

## Event System

### Rust → Frontend Events

Rust emits events via `app_handle`:

```rust
// In orchestrator or command
app_handle.emit_all("engine:progress", &progress_data).ok();
```

### Frontend Listeners

```typescript
// src/lib/tauri/events.ts
import { listen } from '@tauri-apps/api/event'

const unlisten = await listen<EngineProgress>('engine:progress', e => {
  console.log('Progress:', e.payload)
})

// Cleanup
unlisten()
```

### Event Types

| Event                          | Payload                      | Purpose                     |
| ------------------------------ | ---------------------------- | --------------------------- |
| `document:processing_start`    | `string` (doc_id)            | Document processing started |
| `document:processing_progress` | `DocumentProcessingProgress` | Progress update             |
| `document:processing_complete` | `DocumentProcessingComplete` | Processing finished         |
| `document:processing_error`    | `DocumentProcessingError`    | Processing failed           |
| `engine:job_started`           | `JobStarted`                 | Analysis job started        |
| `engine:progress`              | `EngineProgress`             | Engine progress update      |
| `engine:finding`               | `EngineFinding`              | New finding discovered      |
| `engine:complete`              | `EngineComplete`             | Job finished                |
| `engine:cancelled`             | `{ job_id: string }`         | Job cancelled               |

## Sidecar Architecture

The engine runner is a Node.js sidecar:

```
src-tauri/sidecars/
├── engine-runner.js   # Compiled sidecar
├── engine-runner.ts   # Source
└── package.json
```

### Sidecar Path Resolution

```rust
fn find_sidecar_path(app: &tauri::App) -> Option<PathBuf> {
    // 1. Try bundled (production)
    if let Ok(resource_dir) = app.path().resource_dir() {
        let bundled = resource_dir.join("sidecars").join("engine-runner.js");
        if bundled.exists() { return Some(bundled); }
    }

    // 2. Try development paths
    let dev_paths = vec![
        PathBuf::from("sidecars/engine-runner.js"),
        PathBuf::from("src-tauri/sidecars/engine-runner.js"),
    ];
    // ...
}
```

## Orchestrator Pattern

The `EngineOrchestrator` manages analysis jobs:

```rust
pub struct EngineOrchestrator {
    app_handle: Option<AppHandle>,
    sidecar_path: Option<PathBuf>,
    mock_mode: bool,
    jobs: HashMap<String, Job>,
}
```

### Job Flow

1. Frontend calls `submit_analysis` command
2. Orchestrator creates job, emits `engine:job_started`
3. Orchestrator spawns sidecar process
4. Sidecar streams progress, orchestrator emits `engine:progress`
5. On completion, emits `engine:complete`
6. Frontend listens via `setupEventListeners()`

## IPC Performance

- Each command call has ~50ms overhead (JSON serialization)
- Batch operations when possible
- Use events for streaming updates instead of polling
- Cache results in React Query

## Plugins

Tauri plugins enabled:

```rust
.plugin(tauri_plugin_log::Builder::new().build())
.plugin(tauri_plugin_shell::init())
.plugin(tauri_plugin_fs::init())
.plugin(tauri_plugin_dialog::init())
```

- **log** - Structured logging
- **shell** - Open URLs, run external commands
- **fs** - File system access (scoped)
- **dialog** - Native file dialogs

## AppState

Shared state across all commands:

```rust
pub struct AppState {
    pub db: Arc<Mutex<Database>>,
    pub storage: Arc<Mutex<Storage>>,
    pub sam_tokens: Arc<Mutex<HashMap<String, CancellationToken>>>,
    pub allowed_uploads: Arc<Mutex<HashSet<String>>>,
}
```

Managed separately:

```rust
app.manage(Arc::new(RwLock::new(orchestrator)));
app.manage(state);
```

## Development vs Production

| Aspect     | Development              | Production             |
| ---------- | ------------------------ | ---------------------- |
| Frontend   | `devUrl: localhost:3000` | `frontendDist: ../out` |
| Sidecar    | `src-tauri/sidecars/`    | Bundled in resources   |
| Hot reload | Yes (Next.js)            | No                     |
| Logging    | Verbose                  | Filtered               |

## Troubleshooting

### Command Not Found

- Verify `#[tauri::command]` macro on function
- Check `generate_handler![]` in lib.rs

### Serialization Error

- Ensure struct derives `Serialize, Deserialize`
- Check field names match between Rust and TypeScript

### Event Not Received

- Verify event name matches exactly
- Check `isDesktop()` returns true
- Ensure listener is set up before event fires

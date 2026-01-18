# API Reference

Tauri command interface and data schemas.

---

## Overview

Phronesis exposes functionality through Tauri IPC commands. This document provides technical reference for developers and integrators.

**Important**: Always use typed wrappers in `lib/tauri/commands.ts`. Never call `invoke()` directly from components.

---

## Type System

### Source of Truth

**CONTRACT.ts** is the single source of truth for all IPC types.

**Type Chain**:

```
Rust types (src-tauri/src/*)
  → TypeScript (CONTRACT.ts)
  → Command wrappers (lib/tauri/commands.ts)
  → React hooks (hooks/*.ts)
```

---

## Case Management Commands

### create_case

Create new case.

**Command**: `create_case`

**Input**:

```typescript
{
  name: string;
  case_type: CaseType;
  description?: string;
}

enum CaseType {
  WrongfulConviction = "wrongful_conviction",
  ChildProtection = "child_protection",
  MedicalMalpractice = "medical_malpractice",
  Other = "other"
}
```

**Output**:

```typescript
{
  id: string
  name: string
  case_type: CaseType
  description: string | null
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}
```

**Usage**:

```typescript
import { createCase } from '@/lib/tauri/commands'

const case = await createCase({
  name: "Case Name",
  case_type: CaseType.WrongfulConviction,
  description: "Case description"
})
```

### get_cases

List all cases.

**Command**: `get_cases`

**Input**: None

**Output**: `Case[]`

### get_case

Get single case by ID.

**Command**: `get_case`

**Input**: `{ case_id: string }`

**Output**: `Case`

### delete_case

Delete case and all associated data.

**Command**: `delete_case`

**Input**: `{ case_id: string }`

**Output**: `{ success: boolean }`

---

## Document Commands

### import_documents

Import documents into case.

**Command**: `import_documents`

**Input**:

```typescript
{
  case_id: string;
  file_paths: string[];
}
```

**Output**:

```typescript
{
  documents: Document[];
  errors: string[];
}

interface Document {
  id: string;
  case_id: string;
  title: string;
  file_path: string;
  document_type: string | null;
  author: string | null;
  created_date: string | null; // ISO 8601
  imported_at: string; // ISO 8601
  page_count: number | null;
  word_count: number | null;
}
```

### get_documents

Get all documents for case.

**Command**: `get_documents`

**Input**: `{ case_id: string }`

**Output**: `Document[]`

### get_document_text

Get extracted text for document.

**Command**: `get_document_text`

**Input**: `{ document_id: string }`

**Output**:

```typescript
{
  document_id: string;
  text: string;
  chunks: TextChunk[];
}

interface TextChunk {
  chunk_id: string;
  text: string;
  page: number | null;
  start_char: number;
  end_char: number;
}
```

---

## Analysis Commands

### run_analysis

Execute S.A.M. analysis.

**Command**: `run_analysis`

**Input**:

```typescript
{
  case_id: string
  config: AnalysisConfig
}

interface AnalysisConfig {
  engines: EngineType[]
  ai_provider?: AIProvider
  phases?: SAMPhase[]
  thresholds?: Thresholds
}

enum EngineType {
  Entity = 'entity',
  Temporal = 'temporal',
  Argumentation = 'argumentation',
  Bias = 'bias',
  Contradiction = 'contradiction',
  Accountability = 'accountability',
  Professional = 'professional',
  Omission = 'omission',
  Expert = 'expert',
  Documentary = 'documentary',
  Narrative = 'narrative',
}

enum AIProvider {
  Claude = 'claude',
}

enum SAMPhase {
  Anchor = 'anchor',
  Inherit = 'inherit',
  Compound = 'compound',
  Arrive = 'arrive',
}
```

**Output**:

```typescript
{
  analysis_id: string
  status: AnalysisStatus
}

enum AnalysisStatus {
  Queued = 'queued',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}
```

**Events**: Emits progress events (see Events section).

### get_analysis_status

Get status of running/completed analysis.

**Command**: `get_analysis_status`

**Input**: `{ analysis_id: string }`

**Output**:

```typescript
{
  analysis_id: string
  case_id: string
  status: AnalysisStatus
  progress: number // 0-100
  started_at: string | null // ISO 8601
  completed_at: string | null // ISO 8601
  error: string | null
}
```

### get_analysis_results

Get results of completed analysis.

**Command**: `get_analysis_results`

**Input**: `{ analysis_id: string }`

**Output**: `AnalysisResults` (see schemas below)

---

## Report Commands

### generate_report

Generate report from analysis.

**Command**: `generate_report`

**Input**:

```typescript
{
  analysis_id: string
  format: ReportFormat
  options: ReportOptions
}

enum ReportFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  JSON = 'json',
  AuditTrail = 'audit_trail',
}

interface ReportOptions {
  include_sections?: string[]
  detail_level?: 'summary' | 'detailed' | 'complete'
  redaction_level?: 'none' | 'minimal' | 'standard' | 'maximal'
  include_visualizations?: boolean
}
```

**Output**:

```typescript
{
  report_path: string
  format: ReportFormat
  generated_at: string // ISO 8601
}
```

---

## Settings Commands

### get_settings

Get application settings.

**Command**: `get_settings`

**Input**: None

**Output**: `Settings`

### update_settings

Update application settings.

**Command**: `update_settings`

**Input**: `Partial<Settings>`

**Output**: `Settings`

### set_api_key

Store API key securely.

**Command**: `set_api_key`

**Input**:

```typescript
{
  provider: AIProvider
  api_key: string
}
```

**Output**: `{ success: boolean }`

**Note**: API key stored in OS keyring, not returned.

---

## Data Schemas

### Analysis Results

```typescript
interface AnalysisResults {
  anchor: AnchorResults
  inherit: InheritResults
  compound: CompoundResults
  arrive: ArriveResults
  entities: Entity[]
  timeline: TimelineEvent[]
  contradictions: Contradiction[]
}

interface AnchorResults {
  claims: Claim[]
  false_premises: Claim[]
}

interface Claim {
  claim_id: string
  claim_text: string
  origin_document_id: string
  origin_date: string
  origin_type: OriginType
  evidential_quality: number // 0.0-1.0
  is_false_premise: boolean
}

interface InheritResults {
  propagations: Propagation[]
  mutations: Mutation[]
}

interface Propagation {
  propagation_id: string
  source_claim_id: string
  source_document_id: string
  target_document_id: string
  propagation_type: PropagationType
  verification_performed: boolean
  crossed_institutional_boundary: boolean
}

interface CompoundResults {
  authority_markers: AuthorityMarker[]
  authority_laundering: AuthorityLaundering[]
}

interface AuthorityMarker {
  marker_id: string
  claim_id: string
  authority_document_id: string
  authority_type: AuthorityType
  authority_weight: number // 1-5
  cumulative_authority_score: number
}

interface ArriveResults {
  outcomes: Outcome[]
  causation_chains: CausationChain[]
}

interface Outcome {
  outcome_id: string
  outcome_type: OutcomeType
  outcome_description: string
  harm_level: HarmLevel
  root_claim_ids: string[]
}
```

---

## Events

Phronesis emits events for long-running operations.

### analysis-progress

**Payload**:

```typescript
{
  analysis_id: string
  progress: number // 0-100
  phase: string // Current phase
  message: string // Status message
}
```

**Listen**:

```typescript
import { listen } from '@tauri-apps/api/event'

await listen<AnalysisProgress>('analysis-progress', event => {
  console.log(`Progress: ${event.payload.progress}%`)
})
```

### analysis-complete

**Payload**:

```typescript
{
  analysis_id: string;
  success: boolean;
  error?: string;
}
```

### document-import-progress

**Payload**:

```typescript
{
  case_id: string
  total: number
  completed: number
  current_file: string
}
```

---

## Error Handling

All commands return `Result<T, String>` on Rust side.

**Success**: Command returns expected type.

**Failure**: Command throws error with message string.

**Handle Errors**:

```typescript
try {
  const result = await someCommand(params)
  // Handle success
} catch (error) {
  // error is string message
  console.error(error)
}
```

---

## Best Practices

### Type Safety

**Always** use TypeScript wrappers from `lib/tauri/commands.ts`.

**Never** call `invoke()` directly from components:

```typescript
// Good
import { createCase } from '@/lib/tauri/commands'
const case = await createCase(params)

// Bad
import { invoke } from '@tauri-apps/api/core'
const case = await invoke('create_case', params) // No type safety!
```

### Error Handling

Wrap commands in try-catch or use React Query error handling:

```typescript
const { data, error } = useQuery({
  queryKey: ['case', caseId],
  queryFn: () => getCase(caseId),
})

if (error) {
  // Handle error
}
```

### Events

Use `useEffect` cleanup for event listeners:

```typescript
useEffect(() => {
  const unlisten = listen('analysis-progress', handler)
  return () => {
    unlisten.then(fn => fn())
  }
}, [])
```

---

## Development

### Adding New Command

1. **Rust**: Implement in `src-tauri/src/commands/*.rs`
2. **Rust**: Register in `lib.rs` → `generate_handler![]`
3. **TypeScript**: Add types to `CONTRACT.ts`
4. **TypeScript**: Add wrapper to `lib/tauri/commands.ts`
5. **React**: Create hook in `hooks/`
6. **Documentation**: Update this API reference

### Verification

```bash
# Rust compile check
cargo check --manifest-path src-tauri/Cargo.toml

# TypeScript compile check
npx tsc --noEmit

# Integration test
npm run tauri dev
```

---

Last updated: 2025-01-16

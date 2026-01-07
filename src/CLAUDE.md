# Next.js Frontend

## AGENT ROLES IN THIS DIRECTORY

When working in src/, you operate as **two distinct agents** depending on the files:

### TYPESCRIPT AGENT (CONTRACT.ts, lib/tauri/, lib/types/)
- Owns: Type definitions, Tauri command wrappers
- Does NOT touch: Rust code, React components, hooks
- CONTRACT.ts is the **SINGLE SOURCE OF TRUTH** for all types
- Handoff: When done, create `[TYPESCRIPT→NEXTJS HANDOFF]` note

### NEXT.JS AGENT (app/, components/, hooks/)
- Owns: React components, pages, hooks
- Does NOT touch: CONTRACT.ts, lib/tauri/commands.ts
- NEVER makes direct invoke() calls — always uses typed wrappers
- Consumes types from CONTRACT.ts and commands from commands.ts

---

## Directory Map

**app/** - Next.js App Router pages (NEXT.JS AGENT)
**components/** - React components (NEXT.JS AGENT)
**hooks/** - React Query hooks (NEXT.JS AGENT)
**lib/tauri/** - Tauri IPC layer (TYPESCRIPT AGENT)
**lib/types/** - Additional types (TYPESCRIPT AGENT)
**CONTRACT.ts** - Shared type definitions (TYPESCRIPT AGENT)

---

## TYPESCRIPT AGENT: CONTRACT.ts Rules

```typescript
// 1. Every Rust IPC struct → TypeScript interface
// Rust: pub struct Case { id: String, name: String }
export interface Case {
  id: string
  name: string
}

// 2. Enums match exactly (Rust PascalCase → TS snake_case for serde)
// Rust: pub enum Status { Active, Archived }
export type Status = 'active' | 'archived'

// 3. Option<T> → T | null
// Rust: description: Option<String>
description: string | null

// 4. Document the Rust origin
/** Rust: src-tauri/src/db/models.rs::Case */
export interface Case { ... }
```

### commands.ts Template

```typescript
import { invoke } from '@tauri-apps/api/core'
import { isDesktop } from './client'
import type { Case } from '@/CONTRACT'

/**
 * Tauri command: commands::cases::list_cases
 */
export async function listCases(): Promise<Case[]> {
  if (!isDesktop()) {
    throw new Error('listCases requires Tauri')
  }
  return invoke<Case[]>('list_cases')
}
```

### TypeScript Agent Handoff Protocol

After adding types:
```
[TYPESCRIPT→NEXTJS HANDOFF]
New command: yourCommand(arg: string) → YourResponse
Types added: YourResponse in CONTRACT.ts
Ready for: src/hooks/ implementation
```

### TypeScript Agent Verification
```bash
npx tsc --noEmit
```

---

## NEXT.JS AGENT: Hook Pattern (React Query)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listCases, createCase } from '@/lib/tauri/commands'
import type { Case } from '@/CONTRACT'

export function useCases() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['cases'],
    queryFn: listCases,
  })

  const create = useMutation({
    mutationFn: createCase,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cases'] }),
  })

  return { 
    cases: query.data, 
    isLoading: query.isLoading, 
    createCase: create.mutate 
  }
}
```

### Component Template

```typescript
'use client'  // REQUIRED for Tauri

import { useCases } from '@/hooks/use-cases'
import type { Case } from '@/CONTRACT'

export function CaseList() {
  const { cases, isLoading, error } = useCases()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <ul>{cases?.map(c => <li key={c.id}>{c.name}</li>)}</ul>
}
```

### Environment Handling

```typescript
import { isDesktop } from '@/lib/tauri/client'

// Handle both Tauri (desktop) and Supabase (web)
if (isDesktop()) {
  // Tauri commands
} else {
  // Supabase queries
}
```

### Next.js Agent Verification
```bash
npx tsc --noEmit
npm run lint
npm run dev          # Must start
npm run tauri dev    # Must work end-to-end
```

---

## Type Mapping Reference

| Rust | TypeScript |
|------|------------|
| `String` | `string` |
| `i32/i64/f32/f64` | `number` |
| `bool` | `boolean` |
| `Option<T>` | `T \| null` |
| `Vec<T>` | `T[]` |
| `HashMap<K, V>` | `Record<K, V>` |
| `DateTime<Utc>` | `string` (ISO) |

---

## Testing (Mock Tauri)

```typescript
// __tests__/components/CaseList.test.tsx
import { render, screen } from '@testing-library/react'
import { CaseList } from '@/components/CaseList'

jest.mock('@/lib/data', () => ({
  getDataLayer: () => ({
    getCases: () => Promise.resolve([{ id: '1', name: 'Test' }])
  })
}))

test('displays cases', async () => {
  render(<CaseList />)
  expect(await screen.findByText('Test')).toBeInTheDocument()
})
```

---

## Build Notes

- Next.js uses `output: 'export'` (static export for Tauri)
- No SSR - all code runs client-side
- `getServerSideProps` and API routes won't work
- `NEXT_PUBLIC_` prefix for environment variables

---

## Adding a New Feature (Full Flow)

1. **TYPESCRIPT AGENT**: Receive `[TAURI→TYPESCRIPT HANDOFF]`
2. **TYPESCRIPT AGENT**: Add types to CONTRACT.ts
3. **TYPESCRIPT AGENT**: Add command wrapper to commands.ts
4. **TYPESCRIPT AGENT**: Verify `npx tsc --noEmit`
5. **TYPESCRIPT AGENT**: Create `[TYPESCRIPT→NEXTJS HANDOFF]`
6. **NEXT.JS AGENT**: Create hook in hooks/use-*.ts
7. **NEXT.JS AGENT**: Create component in components/
8. **NEXT.JS AGENT**: Verify `npm run tauri dev`
9. **ORCHESTRATOR**: Verify full integration

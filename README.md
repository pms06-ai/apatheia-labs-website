# Apatheia Labs — Phronesis Platform

> Forensic Case Intelligence Platform for institutional accountability analysis.

## Stack Overview

| Layer | Technology | Free Tier |
|-------|------------|-----------|
| Frontend | Next.js 14 + shadcn/ui | Vercel (100GB) |
| Database | PostgreSQL + pgvector | Supabase (500MB) |
| Storage | S3-compatible | Cloudflare R2 (10GB) |
| Compute | Python serverless | Modal (30hrs/mo) |
| AI | Llama 3.1 70B | Groq (free) |
| Long Docs | Gemini 1.5 Flash | Google AI Studio (free) |
| Transcription | Whisper | Replicate ($10 credit) |

**Monthly Cost: $0**

---

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd apatheia-labs
npm install

# 2. Set up environment
cp .env.example .env.local
# Fill in your API keys (see Environment Setup below)

# 3. Set up Supabase
# - Create project at supabase.com
# - Run SQL from supabase/schema.sql
# - Enable pgvector extension

# 4. Run development server
npm run dev
```

---

## Environment Setup

Create accounts and get API keys:

1. **Supabase** (supabase.com)
   - Create project → Settings → API → Copy URL and anon key

2. **Cloudflare R2** (dash.cloudflare.com)
   - R2 → Create bucket "apatheia-documents"
   - Manage R2 API Tokens → Create token

3. **Groq** (console.groq.com)
   - API Keys → Create new key

4. **Google AI Studio** (aistudio.google.com)
   - Get API key

5. **Replicate** (replicate.com)
   - Account → API tokens

6. **Modal** (modal.com)
   - Settings → API tokens

---

## Project Structure

```
apatheia-labs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── documents/     # Document upload/processing
│   │   │   ├── analysis/      # AI analysis endpoints
│   │   │   ├── search/        # Full-text search
│   │   │   └── transcribe/    # Audio/video transcription
│   │   ├── cases/             # Case management pages
│   │   ├── documents/         # Document viewer
│   │   ├── analysis/          # Analysis dashboards
│   │   └── settings/          # User settings
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Header, sidebar, etc.
│   │   ├── analysis/          # Analysis-specific components
│   │   └── documents/         # Document viewers
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   ├── r2.ts              # Cloudflare R2 client
│   │   ├── groq.ts            # Groq AI client
│   │   ├── gemini.ts          # Google AI client
│   │   └── modal.ts           # Modal compute client
│   ├── hooks/                 # React hooks
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Utility functions
├── supabase/
│   ├── schema.sql             # Database schema
│   └── migrations/            # Schema migrations
├── modal/                     # Modal serverless functions
│   ├── process_pdf.py         # PDF extraction
│   ├── transcribe.py          # Whisper transcription
│   └── extract_entities.py    # NER extraction
└── public/                    # Static assets
```

---

## Core Features

### 1. Document Ingestion
- Upload PDF, DOCX, audio, video
- Automatic text extraction via Modal + PyMuPDF
- Vector embeddings for semantic search
- Evidence chain tracking with SHA-256 hashes

### 2. Analysis Engines
- **Entity Resolution** — Canonical ID mapping
- **Contradiction Detection** — Cross-document comparison
- **Omission Detection** — What was left out
- **Narrative Evolution** — Story drift tracking
- **Argumentation Analysis** — Toulmin structures

### 3. Search
- Full-text search via PostgreSQL
- Semantic search via pgvector
- Faceted filtering by entity, date, document type

### 4. Output Generation
- Regulatory complaint templates (Ofcom, IOPC, etc.)
- Toulmin argument structures
- Timeline exports
- Evidence chain reports

---

## Database Schema

See `supabase/schema.sql` for full schema. Key tables:

- `cases` — Case metadata
- `documents` — Document registry with hashes
- `document_chunks` — Chunked content for search
- `entities` — Extracted entities
- `claims` — Institutional claims
- `evidence_chains` — Claim-to-source links
- `contradictions` — Detected contradictions
- `findings` — Analysis findings

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/documents/upload` | POST | Upload document to R2 |
| `/api/documents/process` | POST | Trigger extraction pipeline |
| `/api/analysis/contradictions` | POST | Run contradiction detection |
| `/api/analysis/entities` | POST | Extract entities |
| `/api/search` | GET | Full-text + semantic search |
| `/api/transcribe` | POST | Audio/video transcription |

---

## Deployment

### Vercel (Frontend + API)
```bash
npm install -g vercel
vercel
```

### Modal (Python Compute)
```bash
pip install modal
modal deploy modal/
```

---

## Development

```bash
# Run dev server
npm run dev

# Run linting
npm run lint

# Run type checking
npm run type-check

# Build for production
npm run build
```

---

## License

Proprietary — Apatheia Labs

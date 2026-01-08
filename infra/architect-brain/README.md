# Architect's Brain

_MAOF v1.0 • Apatheia Labs_

A Docker container environment for systematic repository audits supporting FCIP v6.0 development.

---

## Quick Start

```bash
# 1. Set your repos path
export REPOS_PATH="/path/to/your/repos"

# 2. Build and start
docker-compose up -d --build

# 3. Run your first audit
docker exec architect-brain ./scripts/audit.sh phronesis-lex
```

---

## What's Inside

| Component          | Purpose                           |
| ------------------ | --------------------------------- |
| **Ubuntu 24.04**   | Base system                       |
| **Node.js 20 LTS** | React/TypeScript builds           |
| **Python 3.12**    | Django/FastAPI testing            |
| **Rust (latest)**  | Tauri/backend builds              |
| **SQLite**         | Knowledge base persistence        |
| **Analysis Tools** | tokei, ripgrep, cloc, cargo-audit |

---

## Directory Structure

```
/workspace/
├── repos/        # Your repositories (mounted read-only)
├── audits/       # Generated audit reports
├── knowledge/    # SQLite knowledge base
├── protocols/    # RAP v1.0, FCIP reference
└── scripts/      # Audit tooling
```

---

## Commands

### Run an Audit

```bash
docker exec architect-brain ./scripts/audit.sh <repo-name>
```

### Test Executability

```bash
docker exec architect-brain ./scripts/test-exec.sh <repo-name>
```

### Generate Report

```bash
# Individual repository report
docker exec architect-brain ./scripts/report.sh <repo-name>

# Generate reports for all audited repos
docker exec architect-brain ./scripts/report.sh dummy --all

# Cross-repository analysis report
docker exec architect-brain ./scripts/report.sh dummy --cross-repo
```

### Interactive Shell

```bash
docker exec -it architect-brain bash
```

### Query Knowledge Base

```bash
docker exec architect-brain sqlite3 /workspace/knowledge/architect.db \
  "SELECT name, verdict, fcip_disposition FROM repositories;"
```

---

## New Features (v1.1)

### Enhanced Audit Script

- **Security scanning**: Detects environment files, gitignore coverage
- **Framework detection**: Improved Node.js, Rust, Python framework identification
- **Dependency analysis**: Counts dependencies, checks for lock files
- **TypeScript support**: Verifies tsconfig.json presence and build scripts

### Advanced Reporting

- **Cross-repository analysis**: Identifies patterns across all audited repos
- **Quality indicators**: Technical debt, testing coverage, documentation metrics
- **Bulk reporting**: Generate reports for all repositories at once
- **JSON export**: Structured data for further processing

### Improved Docker Environment

- **Better caching**: Multi-stage builds with optimized layer caching
- **Security tools**: cargo-audit, bandit, safety pre-installed
- **Analysis tools**: Enhanced with jq, ripgrep, fd-find, cloc

---

## Configuration

### docker-compose.yml

Update `REPOS_PATH` to point to your local repositories directory:

```yaml
volumes:
  - ${REPOS_PATH:-~/repos}:/workspace/repos:ro
```

Or set the environment variable:

```bash
export REPOS_PATH="/Users/paul/code"
docker-compose up -d
```

### Resource Limits

Default: 8GB RAM limit, 2GB reservation. Adjust in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 8G
```

---

## Knowledge Base Schema

The SQLite database tracks:

- **repositories** - Registry of all audited repos
- **audits** - Audit history and verdicts
- **tech_stacks** - Languages, frameworks, runtimes
- **executability** - Build/run test results
- **contracts** - Type definitions found
- **contract_drift** - Frontend/backend mismatches
- **patterns** - Good practices to replicate
- **anti_patterns** - Mistakes to avoid
- **engine_alignment** - FCIP engine mapping
- **components** - Reusable component inventory
- **tech_debt** - TODOs, FIXMEs, security issues

---

## FCIP Engine Reference

| Symbol | Engine               | Status              |
| ------ | -------------------- | ------------------- |
| Ε      | Entity Resolution    | Operational         |
| Τ      | Temporal Parser      | Operational         |
| Α      | Argumentation        | Operational         |
| Β      | Bias Detection       | Operational         |
| Κ      | Contradiction        | Operational         |
| Λ      | Accountability Audit | Operational         |
| Π      | Professional Tracker | Operational         |
| Ο      | Omission Detection   | P1 - In Development |
| Ξ      | Expert Witness       | P2 - In Development |
| Δ      | Documentary Analysis | P3 - In Development |
| Μ      | Narrative Evolution  | P4 - In Development |
| Σ      | Cross-Institutional  | P5 - In Development |

---

## Claude Code Integration

Claude Code can interact with this container via Docker exec commands:

```bash
# Example workflow
docker exec architect-brain ./scripts/audit.sh cascade-core
docker exec architect-brain ./scripts/test-exec.sh cascade-core
docker exec architect-brain ./scripts/report.sh cascade-core --markdown
docker exec architect-brain cat /workspace/audits/cascade-core/audit-report-2024-12-25.md
```

---

## Maintenance

### Rebuild Container

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Reset Knowledge Base

```bash
docker exec architect-brain sqlite3 /workspace/knowledge/architect.db < /workspace/knowledge/init-db.sql
```

### View Logs

```bash
docker-compose logs -f architect
```

---

## Protocol Documents

- `protocols/RAP-v1.0.md` - Repository Audit Protocol
- `protocols/FCIP-engines.md` - Engine reference and data flows

---

_Apatheia Labs • Clarity Through Analysis_

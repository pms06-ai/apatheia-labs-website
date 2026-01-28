#!/usr/bin/env node
'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const readline = require('readline')
const { spawn } = require('child_process')
const Database = require('better-sqlite3')

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const raw = argv[i]
    if (!raw.startsWith('--')) continue
    const key = raw.slice(2)
    const next = argv[i + 1]
    if (next && !next.startsWith('--')) {
      args[key] = next
      i += 1
    } else {
      args[key] = true
    }
  }
  return args
}

function exitWith(message, code = 1) {
  console.error(message)
  process.exit(code)
}

function getClaimCount(dbPath, caseId) {
  const db = new Database(dbPath, { readonly: true })
  const row = db
    .prepare('SELECT COUNT(*) as count FROM claims WHERE case_id = ?')
    .get(caseId)
  db.close()
  return row?.count || 0
}

function getRecentClaims(dbPath, caseId, limit) {
  const db = new Database(dbPath, { readonly: true })
  const rows = db
    .prepare(
      'SELECT claim_text, source_document_id, created_at FROM claims WHERE case_id = ? ORDER BY created_at DESC LIMIT ?'
    )
    .all(caseId, limit)
  db.close()
  return rows || []
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const caseId = args.case || args.case_id
  const engineId = args.engine
  const dbPath = args.db || process.env.PHRONESIS_DB
  const docInput = args.documents || args.document_ids
  const timeoutMs = Number(args.timeout || 120000)
  const show = Number(args.show || 5)

  if (!caseId) exitWith('Missing --case <caseId>')
  if (!engineId) exitWith('Missing --engine <engineId>')
  if (!dbPath) exitWith('Missing --db <path> (or set PHRONESIS_DB)')
  if (!fs.existsSync(dbPath)) exitWith(`Database not found at ${dbPath}`)

  const db = new Database(dbPath, { readonly: true })
  let documentIds = []
  if (docInput) {
    documentIds = docInput
      .split(',')
      .map(value => value.trim())
      .filter(Boolean)
  } else {
    documentIds = db
      .prepare('SELECT id FROM documents WHERE case_id = ? ORDER BY created_at DESC')
      .all(caseId)
      .map(row => row.id)
  }
  db.close()

  if (documentIds.length === 0) {
    exitWith(`No documents found for case ${caseId}. Provide --documents to override.`)
  }

  const sidecarPath = path.join(__dirname, '..', 'src-tauri', 'sidecars', 'engine-runner.js')
  if (!fs.existsSync(sidecarPath)) {
    exitWith(`Sidecar not found at ${sidecarPath}. Run npm run build:sidecar first.`)
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'phronesis-sanity-'))
  const configDir = path.join(tempRoot, '.phronesis')
  fs.mkdirSync(configDir, { recursive: true })
  const configPath = path.join(configDir, 'config.json')

  const config = {
    database_path: dbPath,
  }

  if (args.mock || args['mock-mode']) config.mock_mode = true
  if (args['claude-code'] || args['use-claude-code']) config.use_claude_code = true
  if (args['anthropic-key']) config.anthropic_api_key = args['anthropic-key']
  if (!config.anthropic_api_key && process.env.ANTHROPIC_API_KEY) {
    config.anthropic_api_key = process.env.ANTHROPIC_API_KEY
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

  const beforeCount = getClaimCount(dbPath, caseId)

  const child = spawn('node', [sidecarPath], {
    stdio: ['pipe', 'pipe', 'inherit'],
    env: {
      ...process.env,
      HOME: tempRoot,
      APPDATA: tempRoot,
    },
  })

  const rl = readline.createInterface({ input: child.stdout })

  const request = {
    engine_id: engineId,
    case_id: caseId,
    document_ids: documentIds,
    options: {},
  }

  const timeout = setTimeout(() => {
    child.kill('SIGKILL')
    exitWith(`Timed out after ${timeoutMs}ms waiting for sidecar response`)
  }, timeoutMs)

  child.stdin.write(`${JSON.stringify(request)}\n`)

  const response = await new Promise((resolve, reject) => {
    rl.on('line', line => {
      try {
        const parsed = JSON.parse(line)
        resolve(parsed)
      } catch (error) {
        reject(error)
      }
    })
    child.on('error', reject)
    child.on('exit', code => {
      if (code && code !== 0) {
        reject(new Error(`Sidecar exited with code ${code}`))
      }
    })
  })

  clearTimeout(timeout)
  rl.close()
  child.stdin.end()

  if (!response?.success) {
    exitWith(`Engine failed: ${response?.error || 'Unknown error'}`)
  }

  const afterCount = getClaimCount(dbPath, caseId)
  const added = afterCount - beforeCount

  console.log(`Engine response: success (engine=${engineId})`)
  console.log(`Claims before: ${beforeCount}`)
  console.log(`Claims after: ${afterCount} (+${added})`)

  if (show > 0) {
    const recent = getRecentClaims(dbPath, caseId, show)
    if (recent.length > 0) {
      console.log('Recent claims:')
      for (const row of recent) {
        console.log(`- ${row.claim_text} (doc=${row.source_document_id || 'n/a'})`)
      }
    }
  }

  fs.rmSync(tempRoot, { recursive: true, force: true })
}

main().catch(error => {
  exitWith(error instanceof Error ? error.message : 'Unexpected error')
})

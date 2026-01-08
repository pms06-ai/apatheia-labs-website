#!/usr/bin/env node
/**
 * Obsidian Vault Sync Script
 * Bidirectional sync between Obsidian vault and Phronesis SQLite database
 *
 * Usage:
 *   node scripts/obsidian-sync.js sync     # Full bidirectional sync
 *   node scripts/obsidian-sync.js import   # Obsidian -> SQLite
 *   node scripts/obsidian-sync.js export   # SQLite -> Obsidian
 *   node scripts/obsidian-sync.js status   # Show sync status
 *
 * Options:
 *   --dry-run    Preview changes without executing
 *   --verbose    Show detailed output
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  // Obsidian vault paths
  vaultRoot: process.env.OBSIDIAN_VAULT || 'C:\\Users\\pstep\\OneDrive\\Documents\\Obsidian Vault',
  phronesisFolder: '60 - Phronesis',

  // Database path
  dbPath:
    process.env.PHRONESIS_DB ||
    path.join(
      process.env.APPDATA || '',
      'com.apatheia.phronesis',
      'phronesis.db'
    ),

  // Import folders (Obsidian -> SQLite)
  importFolders: ['documents', 'evidence', 'sources'],

  // Export folders (SQLite -> Obsidian)
  exportFolders: {
    findings: 'reports/findings',
    contradictions: 'reports/contradictions',
    omissions: 'reports/omissions',
    entities: 'reports/entities',
  },
};

// Lazy-load better-sqlite3
let Database;
function getDatabase() {
  if (!Database) {
    try {
      Database = require('better-sqlite3');
    } catch {
      console.error('Error: better-sqlite3 not installed.');
      console.error('Run: npm install better-sqlite3');
      process.exit(1);
    }
  }
  return Database;
}

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, body: content };
  }

  const metadata = {};
  const yamlLines = match[1].split('\n');

  for (const line of yamlLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Handle quoted strings
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((v) => v.trim().replace(/^["']|["']$/g, ''));
      }

      metadata[key] = value;
    }
  }

  return { metadata, body: match[2] };
}

/**
 * Generate YAML frontmatter from metadata object
 */
function generateFrontmatter(metadata) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(metadata)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((v) => `"${v}"`).join(', ')}]`);
    } else if (typeof value === 'string' && (value.includes(':') || value.includes('#'))) {
      lines.push(`${key}: "${value}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  lines.push('---', '');
  return lines.join('\n');
}

/**
 * Calculate content hash for change detection
 */
function contentHash(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex').slice(0, 16);
}

/**
 * Ensure sync tracking table exists
 */
function ensureSyncTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sync_tracking (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      source_path TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      last_synced TEXT NOT NULL,
      sync_direction TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sync_source ON sync_tracking(source);
    CREATE INDEX IF NOT EXISTS idx_sync_path ON sync_tracking(source_path);
  `);
}

/**
 * Get all markdown files from a folder recursively
 */
function getMarkdownFiles(folderPath, relativeTo = folderPath) {
  const files = [];

  if (!fs.existsSync(folderPath)) {
    return files;
  }

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath, relativeTo));
    } else if (entry.name.endsWith('.md')) {
      files.push({
        fullPath,
        relativePath: path.relative(relativeTo, fullPath),
        name: entry.name.replace('.md', ''),
      });
    }
  }

  return files;
}

/**
 * Import documents from Obsidian to SQLite
 */
function importFromObsidian(db, options = {}) {
  const { dryRun = false, verbose = false } = options;
  const stats = { scanned: 0, imported: 0, updated: 0, skipped: 0 };

  const phronesisPath = path.join(CONFIG.vaultRoot, CONFIG.phronesisFolder);

  for (const folder of CONFIG.importFolders) {
    const folderPath = path.join(phronesisPath, folder);
    const files = getMarkdownFiles(folderPath);

    for (const file of files) {
      stats.scanned++;

      const content = fs.readFileSync(file.fullPath, 'utf8');
      const hash = contentHash(content);
      const { metadata, body } = parseFrontmatter(content);

      // Check if already synced with same hash
      const existing = db
        .prepare('SELECT content_hash FROM sync_tracking WHERE source_path = ?')
        .get(file.fullPath);

      if (existing && existing.content_hash === hash) {
        stats.skipped++;
        if (verbose) console.log(`  Skip (unchanged): ${file.relativePath}`);
        continue;
      }

      if (verbose) {
        console.log(`  ${existing ? 'Update' : 'Import'}: ${file.relativePath}`);
      }

      if (!dryRun) {
        // Generate unique ID
        const docId = metadata.id || `obs_${hash}`;

        // Upsert into documents table
        db.prepare(
          `
          INSERT INTO documents (id, title, content, source_path, doc_type, metadata, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          ON CONFLICT(id) DO UPDATE SET
            content = excluded.content,
            metadata = excluded.metadata,
            updated_at = datetime('now')
        `
        ).run(
          docId,
          metadata.title || file.name,
          body,
          file.relativePath,
          metadata.type || folder,
          JSON.stringify(metadata)
        );

        // Update sync tracking
        db.prepare(
          `
          INSERT INTO sync_tracking (id, source, source_path, content_hash, last_synced, sync_direction)
          VALUES (?, 'obsidian', ?, ?, datetime('now'), 'import')
          ON CONFLICT(id) DO UPDATE SET
            content_hash = excluded.content_hash,
            last_synced = datetime('now')
        `
        ).run(docId, file.fullPath, hash);
      }

      if (existing) {
        stats.updated++;
      } else {
        stats.imported++;
      }
    }
  }

  return stats;
}

/**
 * Export findings/analysis from SQLite to Obsidian
 */
function exportToObsidian(db, options = {}) {
  const { dryRun = false, verbose = false } = options;
  const stats = { exported: 0, updated: 0, skipped: 0 };

  const phronesisPath = path.join(CONFIG.vaultRoot, CONFIG.phronesisFolder);

  // Export findings
  const findings = db
    .prepare(
      `
    SELECT f.*, d.title as doc_title
    FROM findings f
    LEFT JOIN documents d ON f.document_id = d.id
    ORDER BY f.created_at DESC
  `
    )
    .all();

  for (const finding of findings) {
    const fileName = `${finding.id}.md`;
    const folderPath = path.join(phronesisPath, CONFIG.exportFolders.findings);
    const filePath = path.join(folderPath, fileName);

    const metadata = {
      id: finding.id,
      type: 'finding',
      finding_type: finding.finding_type,
      severity: finding.severity,
      document: finding.doc_title || finding.document_id,
      created: finding.created_at,
      exported: new Date().toISOString(),
    };

    const content =
      generateFrontmatter(metadata) +
      `# ${finding.title || 'Finding'}\n\n` +
      `## Summary\n${finding.summary || ''}\n\n` +
      `## Details\n${finding.details || ''}\n\n` +
      `## Source\n[[${finding.doc_title || finding.document_id}]]\n`;

    const hash = contentHash(content);

    // Check existing
    const existing = db
      .prepare('SELECT content_hash FROM sync_tracking WHERE id = ? AND sync_direction = ?')
      .get(finding.id, 'export');

    if (existing && existing.content_hash === hash) {
      stats.skipped++;
      if (verbose) console.log(`  Skip (unchanged): ${fileName}`);
      continue;
    }

    if (verbose) {
      console.log(`  ${existing ? 'Update' : 'Export'}: ${fileName}`);
    }

    if (!dryRun) {
      // Ensure folder exists
      fs.mkdirSync(folderPath, { recursive: true });

      // Write file
      fs.writeFileSync(filePath, content);

      // Update sync tracking
      db.prepare(
        `
        INSERT INTO sync_tracking (id, source, source_path, content_hash, last_synced, sync_direction)
        VALUES (?, 'phronesis', ?, ?, datetime('now'), 'export')
        ON CONFLICT(id) DO UPDATE SET
          content_hash = excluded.content_hash,
          last_synced = datetime('now')
      `
      ).run(finding.id, filePath, hash);
    }

    if (existing) {
      stats.updated++;
    } else {
      stats.exported++;
    }
  }

  // Export contradictions
  const contradictions = db
    .prepare(
      `
    SELECT * FROM contradictions
    ORDER BY created_at DESC
  `
    )
    .all();

  for (const item of contradictions) {
    const fileName = `${item.id}.md`;
    const folderPath = path.join(phronesisPath, CONFIG.exportFolders.contradictions);
    const filePath = path.join(folderPath, fileName);

    const metadata = {
      id: item.id,
      type: 'contradiction',
      contradiction_type: item.contradiction_type,
      severity: item.severity,
      created: item.created_at,
      exported: new Date().toISOString(),
    };

    const content =
      generateFrontmatter(metadata) +
      `# Contradiction: ${item.contradiction_type}\n\n` +
      `## Statement A\n${item.statement_a || ''}\n\n` +
      `## Statement B\n${item.statement_b || ''}\n\n` +
      `## Analysis\n${item.analysis || ''}\n`;

    const hash = contentHash(content);

    const existing = db
      .prepare('SELECT content_hash FROM sync_tracking WHERE id = ? AND sync_direction = ?')
      .get(item.id, 'export');

    if (existing && existing.content_hash === hash) {
      stats.skipped++;
      continue;
    }

    if (!dryRun) {
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(filePath, content);

      db.prepare(
        `
        INSERT INTO sync_tracking (id, source, source_path, content_hash, last_synced, sync_direction)
        VALUES (?, 'phronesis', ?, ?, datetime('now'), 'export')
        ON CONFLICT(id) DO UPDATE SET
          content_hash = excluded.content_hash,
          last_synced = datetime('now')
      `
      ).run(item.id, filePath, hash);
    }

    if (existing) {
      stats.updated++;
    } else {
      stats.exported++;
    }
  }

  return stats;
}

/**
 * Show sync status
 */
function showStatus(db) {
  const importCount = db
    .prepare("SELECT COUNT(*) as count FROM sync_tracking WHERE sync_direction = 'import'")
    .get();

  const exportCount = db
    .prepare("SELECT COUNT(*) as count FROM sync_tracking WHERE sync_direction = 'export'")
    .get();

  const lastImport = db
    .prepare(
      "SELECT last_synced FROM sync_tracking WHERE sync_direction = 'import' ORDER BY last_synced DESC LIMIT 1"
    )
    .get();

  const lastExport = db
    .prepare(
      "SELECT last_synced FROM sync_tracking WHERE sync_direction = 'export' ORDER BY last_synced DESC LIMIT 1"
    )
    .get();

  const docCount = db.prepare('SELECT COUNT(*) as count FROM documents').get();
  const findingCount = db.prepare('SELECT COUNT(*) as count FROM findings').get();

  console.log('\n=== Obsidian Sync Status ===\n');
  console.log(`Vault: ${CONFIG.vaultRoot}`);
  console.log(`Database: ${CONFIG.dbPath}`);
  console.log('');
  console.log('Database Stats:');
  console.log(`  Documents: ${docCount?.count || 0}`);
  console.log(`  Findings: ${findingCount?.count || 0}`);
  console.log('');
  console.log('Sync Stats:');
  console.log(`  Imported from Obsidian: ${importCount?.count || 0}`);
  console.log(`  Exported to Obsidian: ${exportCount?.count || 0}`);
  console.log(`  Last import: ${lastImport?.last_synced || 'Never'}`);
  console.log(`  Last export: ${lastExport?.last_synced || 'Never'}`);
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');

  if (command === '--help' || command === '-h') {
    console.log(`
Obsidian Vault Sync Script

Usage:
  node scripts/obsidian-sync.js <command> [options]

Commands:
  sync      Full bidirectional sync
  import    Import from Obsidian to SQLite
  export    Export from SQLite to Obsidian
  status    Show sync status (default)

Options:
  --dry-run   Preview changes without executing
  --verbose   Show detailed output
  --help      Show this help message

Environment Variables:
  OBSIDIAN_VAULT   Path to Obsidian vault root
  PHRONESIS_DB     Path to Phronesis SQLite database
`);
    process.exit(0);
  }

  // Check database exists
  if (!fs.existsSync(CONFIG.dbPath)) {
    console.error(`Database not found: ${CONFIG.dbPath}`);
    console.error('Run the Phronesis app first to initialize the database.');
    process.exit(1);
  }

  // Check vault exists
  if (!fs.existsSync(CONFIG.vaultRoot)) {
    console.error(`Obsidian vault not found: ${CONFIG.vaultRoot}`);
    console.error('Set OBSIDIAN_VAULT environment variable to your vault path.');
    process.exit(1);
  }

  const Database = getDatabase();
  const db = new Database(CONFIG.dbPath);

  try {
    // Ensure sync table exists
    ensureSyncTable(db);

    if (dryRun) {
      console.log('=== DRY RUN MODE ===\n');
    }

    switch (command) {
      case 'sync': {
        console.log('Starting bidirectional sync...\n');

        console.log('Importing from Obsidian...');
        const importStats = importFromObsidian(db, { dryRun, verbose });
        console.log(
          `  Scanned: ${importStats.scanned}, Imported: ${importStats.imported}, Updated: ${importStats.updated}, Skipped: ${importStats.skipped}\n`
        );

        console.log('Exporting to Obsidian...');
        const exportStats = exportToObsidian(db, { dryRun, verbose });
        console.log(
          `  Exported: ${exportStats.exported}, Updated: ${exportStats.updated}, Skipped: ${exportStats.skipped}\n`
        );

        console.log('Sync complete!');
        break;
      }

      case 'import': {
        console.log('Importing from Obsidian...\n');
        const stats = importFromObsidian(db, { dryRun, verbose });
        console.log(
          `\nScanned: ${stats.scanned}, Imported: ${stats.imported}, Updated: ${stats.updated}, Skipped: ${stats.skipped}`
        );
        break;
      }

      case 'export': {
        console.log('Exporting to Obsidian...\n');
        const stats = exportToObsidian(db, { dryRun, verbose });
        console.log(`\nExported: ${stats.exported}, Updated: ${stats.updated}, Skipped: ${stats.skipped}`);
        break;
      }

      case 'status':
      default:
        showStatus(db);
        break;
    }
  } finally {
    db.close();
  }
}

main();

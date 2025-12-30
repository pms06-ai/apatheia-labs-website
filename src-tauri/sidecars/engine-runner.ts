#!/usr/bin/env npx ts-node
/**
 * Phronesis FCIP - TypeScript Engine Runner Sidecar
 * 
 * This script runs as a child process from the Rust backend,
 * receiving engine execution requests via stdin and returning
 * results via stdout.
 * 
 * Protocol:
 * - Input: JSON-encoded EngineRequest (one per line)
 * - Output: JSON-encoded EngineResponse (one per line)
 */

import * as readline from 'readline';
import * as path from 'path';

// Types matching Rust structures
interface EngineRequest {
  engine_id: string;
  case_id: string;
  document_ids: string[];
  options?: Record<string, unknown>;
}

interface EngineFinding {
  id: string;
  engine_id: string;
  finding_type: string;
  title: string;
  description: string;
  severity: string;
  confidence: number;
  document_ids: string[];
  evidence: unknown;
  metadata: unknown;
}

interface EngineResponse {
  success: boolean;
  engine_id: string;
  findings?: EngineFinding[];
  error?: string;
  duration_ms: number;
}

// Engine executor type
type EngineExecutor = (
  caseId: string,
  documentIds: string[],
  options?: Record<string, unknown>
) => Promise<EngineFinding[]>;

// Engine registry
const engines: Record<string, EngineExecutor> = {};

/**
 * Register available engines
 * Dynamic import to avoid loading all at startup
 */
async function loadEngines(): Promise<void> {
  // Note: In production, these would be compiled/bundled
  // For now, we use dynamic paths relative to the project root
  const projectRoot = path.resolve(__dirname, '../../');
  
  try {
    // Contradiction Engine
    engines['contradiction'] = async (caseId, documentIds, options) => {
      const module = await import(path.join(projectRoot, 'src/lib/engines/contradiction'));
      const result = await module.contradictionEngine.detectContradictions(
        await loadDocuments(caseId, documentIds),
        caseId
      );
      return mapToFindings('contradiction', result);
    };

    // Omission Engine
    engines['omission'] = async (caseId, documentIds, options) => {
      const module = await import(path.join(projectRoot, 'src/lib/engines/omission'));
      if (documentIds.length < 2) {
        throw new Error('Omission detection requires at least 2 documents');
      }
      const results = await module.omissionEngine.runFullOmissionAnalysis(
        caseId,
        documentIds.slice(1),
        [documentIds[0]]
      );
      return mapToFindings('omission', results[0] || {});
    };

    // Narrative Engine
    engines['narrative'] = async (caseId, documentIds, options) => {
      const module = await import(path.join(projectRoot, 'src/lib/engines/narrative'));
      const result = await module.narrativeEngine.analyzeNarrativeEvolution(
        await loadDocuments(caseId, documentIds),
        caseId
      );
      return mapToFindings('narrative', result);
    };

    // Coordination Engine
    engines['coordination'] = async (caseId, documentIds, options) => {
      const module = await import(path.join(projectRoot, 'src/lib/engines/coordination'));
      const result = await module.coordinationEngine.analyzeCoordination(
        await loadDocuments(caseId, documentIds),
        caseId
      );
      return mapToFindings('coordination', result);
    };

    // Temporal Engine
    engines['temporal'] = async (caseId, documentIds, options) => {
      const module = await import(path.join(projectRoot, 'src/lib/engines/temporal'));
      // Temporal engine has different API - adapt as needed
      return [];
    };

    // Documentary Engine
    engines['documentary'] = async (caseId, documentIds, options) => {
      const module = await import(path.join(projectRoot, 'src/lib/engines/documentary'));
      // Documentary engine has different API - adapt as needed
      return [];
    };

    // Entity Resolution Engine
    engines['entity_resolution'] = async (caseId, documentIds, options) => {
      const module = await import(path.join(projectRoot, 'src/lib/engines/entity-resolution'));
      // Entity resolution engine has different API - adapt as needed
      return [];
    };

    console.error('[Sidecar] Loaded engine registry');
  } catch (error) {
    console.error('[Sidecar] Failed to load some engines:', error);
  }
}

/**
 * Load documents from database/storage
 * For now, returns mock documents - in production, would read from SQLite
 */
async function loadDocuments(caseId: string, documentIds: string[]): Promise<any[]> {
  // TODO: Read from SQLite database
  // For now, return empty array - engines will need to handle this
  return documentIds.map(id => ({
    id,
    case_id: caseId,
    filename: `document-${id}.pdf`,
    file_type: 'application/pdf',
    extracted_text: '', // Would be loaded from DB
    status: 'completed',
  }));
}

/**
 * Map engine-specific results to standard Finding format
 */
function mapToFindings(engineId: string, result: any): EngineFinding[] {
  if (!result) return [];
  
  // Handle array results
  if (Array.isArray(result)) {
    return result.map((item, index) => ({
      id: `${engineId}-${Date.now()}-${index}`,
      engine_id: engineId,
      finding_type: item.type || item.finding_type || 'general',
      title: item.title || item.summary || `Finding ${index + 1}`,
      description: item.description || item.details || JSON.stringify(item),
      severity: item.severity || 'medium',
      confidence: item.confidence || item.score || 0.5,
      document_ids: item.document_ids || item.documentIds || [],
      evidence: item.evidence || {},
      metadata: item.metadata || {},
    }));
  }
  
  // Handle single result object with findings array
  if (result.findings && Array.isArray(result.findings)) {
    return mapToFindings(engineId, result.findings);
  }
  
  // Handle single result object
  return [{
    id: `${engineId}-${Date.now()}`,
    engine_id: engineId,
    finding_type: result.type || 'general',
    title: result.title || result.summary || 'Analysis Complete',
    description: result.description || JSON.stringify(result),
    severity: result.severity || 'info',
    confidence: result.confidence || 0.5,
    document_ids: result.document_ids || [],
    evidence: result.evidence || {},
    metadata: result.metadata || result,
  }];
}

/**
 * Execute an engine request
 */
async function executeRequest(request: EngineRequest): Promise<EngineResponse> {
  const startTime = Date.now();
  
  try {
    const executor = engines[request.engine_id];
    
    if (!executor) {
      return {
        success: false,
        engine_id: request.engine_id,
        error: `Unknown engine: ${request.engine_id}`,
        duration_ms: Date.now() - startTime,
      };
    }
    
    const findings = await executor(
      request.case_id,
      request.document_ids,
      request.options
    );
    
    return {
      success: true,
      engine_id: request.engine_id,
      findings,
      duration_ms: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      engine_id: request.engine_id,
      error: error instanceof Error ? error.message : String(error),
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Main entry point - read from stdin, process, write to stdout
 */
async function main(): Promise<void> {
  console.error('[Sidecar] Starting engine runner...');
  
  await loadEngines();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  
  rl.on('line', async (line) => {
    try {
      const request: EngineRequest = JSON.parse(line);
      console.error(`[Sidecar] Received request for engine: ${request.engine_id}`);
      
      const response = await executeRequest(request);
      
      // Write response to stdout
      console.log(JSON.stringify(response));
    } catch (error) {
      // Write error response
      console.log(JSON.stringify({
        success: false,
        engine_id: 'unknown',
        error: error instanceof Error ? error.message : String(error),
        duration_ms: 0,
      }));
    }
  });
  
  rl.on('close', () => {
    console.error('[Sidecar] Shutting down...');
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('[Sidecar] Fatal error:', error);
  process.exit(1);
});


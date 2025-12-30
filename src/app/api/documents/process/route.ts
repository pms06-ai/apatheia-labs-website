import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { downloadDocument } from '@/lib/r2'
import { analyze } from '@/lib/ai-client'
import Replicate from 'replicate'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for processing

const _replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

/**
 * Extract text from PDF using Replicate's marker model
 * This is a free alternative to Unstructured API
 */
async function extractTextFromPdf(_buffer: Buffer): Promise<string> {
  // For now, use a simple text extraction
  // In production, you'd call Modal or Replicate with marker/PyMuPDF

  // Placeholder - you'll want to set up Modal for this
  // See modal/process_pdf.py for the actual implementation

  // For demo, return placeholder
  return '[PDF text extraction requires Modal setup - see modal/process_pdf.py]'
}

/**
 * Process a document: extract text, entities, and create embeddings
 */
export async function POST(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    // Mock processing for local dev
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      console.log('[MOCK PROCESS] Skipping real processing for', documentId)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate work
      return NextResponse.json({
        status: 'completed',
        document_id: documentId,
        text_length: 100,
        chunks_created: 1,
        entities_found: 0,
        message: 'Mock processing completed'
      })
    }

    const supabase = createAdminClient()

    // Get document record
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update status to processing
    await supabase
      .from('documents')
      .update({ status: 'processing' })
      .eq('id', documentId)

    try {
      // Download document from R2
      const buffer = await downloadDocument(doc.storage_path)

      let extractedText = ''

      // Extract text based on file type
      if (doc.file_type === 'application/pdf') {
        extractedText = await extractTextFromPdf(buffer)
      } else if (doc.file_type.includes('word') || doc.file_type.includes('docx')) {
        // For DOCX, you'd use mammoth or python-docx via Modal
        extractedText = '[DOCX extraction requires Modal setup]'
      } else if (doc.file_type.startsWith('text/')) {
        extractedText = buffer.toString('utf-8')
      }

      // Extract entities using Groq
      const entityResult = await analyze({
        text: extractedText.slice(0, 8000), // Limit for API
        task: 'extract_entities',
        model: 'FAST',
      })

      // Store extracted text
      await supabase
        .from('documents')
        .update({
          extracted_text: extractedText,
          status: 'completed',
        })
        .eq('id', documentId)

      // Create chunks for search
      const chunks = chunkText(extractedText, 1000, 200)

      for (let i = 0; i < chunks.length; i++) {
        await supabase.from('document_chunks').insert({
          document_id: documentId,
          chunk_index: i,
          content: chunks[i],
          page_number: null, // Would be set by proper PDF extraction
        })
      }

      // Store entities
      const entities = (entityResult.result as { entities?: Array<{ text: string; type: string; context: string }> })?.entities || []

      for (const entity of entities) {
        // Check if entity already exists
        const { data: existing } = await supabase
          .from('entities')
          .select('id')
          .eq('case_id', doc.case_id)
          .eq('canonical_name', entity.text)
          .single()

        let entityId: string

        if (existing) {
          entityId = existing.id
        } else {
          const { data: newEntity } = await supabase
            .from('entities')
            .insert({
              case_id: doc.case_id,
              canonical_name: entity.text,
              entity_type: mapEntityType(entity.type),
            })
            .select('id')
            .single()

          entityId = newEntity?.id || ''
        }

        // Create mention
        if (entityId) {
          await supabase.from('entity_mentions').insert({
            entity_id: entityId,
            document_id: documentId,
            mention_text: entity.text,
            context: entity.context,
          })
        }
      }

      return NextResponse.json({
        status: 'completed',
        document_id: documentId,
        text_length: extractedText.length,
        chunks_created: chunks.length,
        entities_found: entities.length,
      })
    } catch (processError) {
      console.error('Processing error:', processError)

      await supabase
        .from('documents')
        .update({ status: 'failed' })
        .eq('id', documentId)

      throw processError
    }
  } catch (error) {
    console.error('Process error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}

/**
 * Chunk text with overlap
 */
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start = end - overlap
    if (start + overlap >= text.length) break
  }

  return chunks
}

/**
 * Map extracted entity types to database enum
 */
function mapEntityType(type: string): string {
  const mapping: Record<string, string> = {
    PERSON: 'person',
    ORGANIZATION: 'organization',
    PROFESSIONAL: 'professional',
    COURT: 'court',
    DATE: 'other',
    LOCATION: 'other',
    DOCUMENT: 'other',
  }
  return mapping[type] || 'other'
}

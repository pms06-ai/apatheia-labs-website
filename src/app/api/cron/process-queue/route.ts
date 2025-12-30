import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Cron job to process pending documents
 * Runs every 5 minutes via Vercel Cron
 * 
 * GET /api/cron/process-queue
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel adds this header)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    // Get pending documents (limit to 5 per run to stay within free tier)
    const { data: pendingDocs, error: fetchError } = await supabase
      .from('documents')
      .select('id, case_id, filename, storage_path, file_type')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5)

    if (fetchError) {
      console.error('Error fetching pending documents:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 })
    }

    if (!pendingDocs || pendingDocs.length === 0) {
      return NextResponse.json({ message: 'No pending documents', processed: 0 })
    }

    const results = []

    for (const doc of pendingDocs) {
      try {
        // Update status to processing
        await supabase
          .from('documents')
          .update({ status: 'processing' })
          .eq('id', doc.id)

        // Call Modal processing endpoint
        const modalUrl = process.env.MODAL_PROCESS_URL
        if (!modalUrl) {
          throw new Error('MODAL_PROCESS_URL not configured')
        }

        const response = await fetch(modalUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document_id: doc.id,
            storage_path: doc.storage_path,
            file_type: doc.file_type
          })
        })

        if (!response.ok) {
          throw new Error(`Modal processing failed: ${response.statusText}`)
        }

        const result = await response.json()

        // Update document with extracted content
        await supabase
          .from('documents')
          .update({
            status: 'completed',
            page_count: result.page_count,
            word_count: result.word_count,
            processed_at: new Date().toISOString()
          })
          .eq('id', doc.id)

        // Store document chunks
        if (result.chunks && result.chunks.length > 0) {
          const chunks = result.chunks.map((chunk: any, index: number) => ({
            document_id: doc.id,
            chunk_index: index,
            content: chunk.content,
            page_number: chunk.page_number,
            metadata: chunk.metadata
          }))

          await supabase.from('document_chunks').insert(chunks)
        }

        // Store extracted entities
        if (result.entities && result.entities.length > 0) {
          for (const entity of result.entities) {
            // Check if entity already exists
            const { data: existing } = await supabase
              .from('entities')
              .select('id')
              .eq('case_id', doc.case_id)
              .eq('canonical_name', entity.name)
              .eq('entity_type', entity.type)
              .single()

            let entityId = existing?.id

            if (!entityId) {
              // Create new entity
              const { data: newEntity } = await supabase
                .from('entities')
                .insert({
                  case_id: doc.case_id,
                  canonical_name: entity.name,
                  entity_type: entity.type,
                  metadata: entity.metadata
                })
                .select('id')
                .single()

              entityId = newEntity?.id
            }

            // Create mention
            if (entityId) {
              await supabase.from('entity_mentions').insert({
                entity_id: entityId,
                document_id: doc.id,
                mention_text: entity.mention,
                context: entity.context,
                location: entity.location
              })
            }
          }
        }

        results.push({ id: doc.id, status: 'completed' })

      } catch (error) {
        console.error(`Error processing document ${doc.id}:`, error)

        // Update status to failed
        await supabase
          .from('documents')
          .update({
            status: 'failed',
            metadata: {
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          })
          .eq('id', doc.id)

        results.push({
          id: doc.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: 'Queue processed',
      processed: results.length,
      results
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}

// Vercel cron config
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

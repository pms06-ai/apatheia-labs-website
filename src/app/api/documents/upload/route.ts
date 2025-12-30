import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { uploadDocument, generateStoragePath } from '@/lib/r2'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const caseId = formData.get('caseId') as string
    const docType = formData.get('docType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!caseId) {
      return NextResponse.json({ error: 'No case ID provided' }, { status: 400 })
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const storagePath = generateStoragePath(caseId, file.name)

    // Upload to R2
    const { hash, size } = await uploadDocument(buffer, storagePath, file.type)

    // Create document record in Supabase
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        filename: file.name,
        file_type: file.type,
        file_size: size,
        storage_path: storagePath,
        hash_sha256: hash,
        doc_type: docType || 'other',
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 })
    }

    return NextResponse.json({
      document_id: data.id,
      filename: file.name,
      storage_path: storagePath,
      hash: hash,
      status: 'pending',
      message: 'Document uploaded successfully. Processing will begin shortly.',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload document',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const caseId = searchParams.get('caseId')

  if (!caseId) {
    return NextResponse.json({ error: 'Case ID required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }

  return NextResponse.json({ documents: data })
}

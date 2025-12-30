import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const caseId = searchParams.get('caseId')
    const type = searchParams.get('type') || 'fulltext' // fulltext | semantic | hybrid

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    if (type === 'fulltext') {
      // Use PostgreSQL full-text search
      const { data, error } = await supabase.rpc('search_documents', {
        search_query: query,
        case_filter: caseId || null,
      })

      if (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
      }

      return NextResponse.json({
        type: 'fulltext',
        query,
        results: data || [],
        count: data?.length || 0,
      })
    }

    if (type === 'semantic') {
      // For semantic search, you'd need to:
      // 1. Get embedding for query (using OpenAI or local model)
      // 2. Call search_semantic RPC function

      // For now, fall back to full-text
      return NextResponse.json({
        error: 'Semantic search requires embedding setup',
        fallback: 'Use type=fulltext for now',
      }, { status: 501 })
    }

    // Hybrid search combines both
    if (type === 'hybrid') {
      const { data, error } = await supabase.rpc('search_documents', {
        search_query: query,
        case_filter: caseId || null,
      })

      if (error) {
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
      }

      return NextResponse.json({
        type: 'hybrid',
        query,
        results: data || [],
        count: data?.length || 0,
      })
    }

    return NextResponse.json({ error: 'Invalid search type' }, { status: 400 })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

// Search entities
export async function POST(request: NextRequest) {
  try {
    const { query, caseId, entityTypes } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    let entityQuery = supabase
      .from('entities')
      .select('*')
      .or(`canonical_name.ilike.%${query}%,aliases.cs.{${query}}`)

    if (caseId) {
      entityQuery = entityQuery.eq('case_id', caseId)
    }

    if (entityTypes?.length) {
      entityQuery = entityQuery.in('entity_type', entityTypes)
    }

    const { data: entities, error } = await entityQuery.limit(50)

    if (error) {
      return NextResponse.json({ error: 'Entity search failed' }, { status: 500 })
    }

    // Also search claims and contradictions
    const { data: claims } = await supabase
      .from('claims')
      .select('*')
      .ilike('claim_text', `%${query}%`)
      .eq('case_id', caseId || '')
      .limit(20)

    const { data: contradictions } = await supabase
      .from('contradictions')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('case_id', caseId || '')
      .limit(20)

    return NextResponse.json({
      query,
      entities: entities || [],
      claims: claims || [],
      contradictions: contradictions || [],
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

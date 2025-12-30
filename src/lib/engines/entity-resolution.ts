
import { generateJSON } from '@/lib/ai-client'
import type { Document } from '@/CONTRACT'

export interface ResolvedEntity {
    id: string
    canonicalName: string
    type: 'person' | 'organization' | 'professional' | 'court'
    role?: string
    mentions: {
        docId: string
        text: string
        context: string
    }[]
    aliases: string[]
}

export interface EntityResolutionResult {
    entities: ResolvedEntity[]
    summary: {
        totalEntities: number
        peopleCount: number
        professionalCount: number
    }
}

const ENTITY_RESOLUTION_PROMPT = `
Extract and resolve entities from these documents.
Combine references to the same person/org (e.g., "Dr. Smith", "Jane Smith", "The expert") into a single canonical identity.

Documents:
{documents}

Respond in JSON:
{
  "entities": [
    {
      "canonicalName": "Full Name",
      "type": "person|organization|professional|court",
      "role": "e.g. Social Worker, Mother, Judge",
      "aliases": ["Name 1", "Name 2"],
      "mentions": [
        { "docId": "...", "text": "exact text", "context": "..." }
      ]
    }
  ]
}`

export async function resolveEntities(
    documents: Document[],
    caseId: string
): Promise<EntityResolutionResult> {
    const docContents = documents.slice(0, 3).map(d =>
        `=== ID: ${d.id} | ${d.filename} ===\n${d.extracted_text?.slice(0, 5000) || ''}`
    ).join('\n\n')

    let result;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        console.log('[MOCK ENGINE] Using Mock Entity Resolution')
        await new Promise(resolve => setTimeout(resolve, 1500))
        result = {
            entities: [
                {
                    canonicalName: "Sarah Jones",
                    type: "professional",
                    role: "Social Worker",
                    aliases: ["Sarah Jones", "S. Jones", "SW Jones"],
                    mentions: [
                        { docId: documents[0]?.id || 'd1', text: "SW Jones", context: "SW Jones attended the meeting" }
                    ]
                },
                {
                    canonicalName: "Dr. Alan Grant",
                    type: "professional",
                    role: "Psychologist",
                    aliases: ["Dr. Grant"],
                    mentions: []
                }
            ]
        }
    } else {
        result = await generateJSON('Entity Resolver', ENTITY_RESOLUTION_PROMPT.replace('{documents}', docContents))
    }

    const entities: ResolvedEntity[] = (result.entities || []).map((e: any, i: number) => ({
        id: `ent-${i}`,
        canonicalName: e.canonicalName,
        type: e.type,
        role: e.role,
        aliases: e.aliases || [],
        mentions: e.mentions || []
    }))

    return {
        entities,
        summary: {
            totalEntities: entities.length,
            peopleCount: entities.filter(e => e.type === 'person').length,
            professionalCount: entities.filter(e => e.type === 'professional').length
        }
    }
}

export const entityResolutionEngine = {
    resolveEntities
}

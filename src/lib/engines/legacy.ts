
import { generateJSON } from '@/lib/ai-client'
import type { Document } from '@/CONTRACT'

// --- ARGUMENTATION ---
export async function analyzeArgumentation(documents: Document[], caseId: string) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise(r => setTimeout(r, 1000))
        return {
            arguments: [
                { claim: "Child is at risk", warrant: "Past history of neglect", backing: "Police reports 2020-2022", rebuttal: "Mother has completed parenting course", qualifier: "Potential" }
            ],
            falacies: [{ type: "Circular Reasoning", description: "Conclusion assumes premise" }]
        }
    }
    return await generateJSON('Argumentation Analyst', `Analyze arguments in documents: ${documents.map(d => d.filename).join(', ')}`)
}

// --- BIAS DETECTION ---
export async function detectBias(documents: Document[], caseId: string) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise(r => setTimeout(r, 1000))
        return {
            biasScore: 75,
            patterns: [
                { type: "Confirmation Bias", description: "Only negative evidence cited", severity: "high" },
                { type: "Anchoring", description: "Reliance on initial police referral", severity: "medium" }
            ]
        }
    }
    return await generateJSON('Bias Detector', `Detect bias patterns in: ${documents.map(d => d.filename).join(', ')}`)
}

// --- ACCOUNTABILITY AUDIT ---
export async function auditAccountability(documents: Document[], caseId: string) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise(r => setTimeout(r, 1000))
        return {
            violations: [
                { duty: "Children Act 1989 s.47", status: "breached", description: "Timescale for assessment exceeded" }
            ],
            complianceScore: 40
        }
    }
    return await generateJSON('Accountability Auditor', `Audit statutory compliance in: ${documents.map(d => d.filename).join(', ')}`)
}

// --- PROFESSIONAL TRACKER ---
export async function trackProfessional(documents: Document[], caseId: string) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise(r => setTimeout(r, 1000))
        return {
            professionals: [
                { name: "SW Jones", distinctPattern: "Uses high-conflict language", interactionCount: 5 },
                { name: "Officer Smith", distinctPattern: "Neutral reporting", interactionCount: 2 }
            ]
        }
    }
    return await generateJSON('Professional Tracker', `Track professional conduct in: ${documents.map(d => d.filename).join(', ')}`)
}

export const legacyEngines = {
    analyzeArgumentation,
    detectBias,
    auditAccountability,
    trackProfessional
}

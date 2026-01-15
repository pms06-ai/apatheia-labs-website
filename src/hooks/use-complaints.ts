/**
 * Phronesis FCIP - Complaint Generation Hooks
 *
 * React Query hooks for regulatory complaint operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTauriClient, isDesktop } from '@/lib/tauri/client'
import type {
  GenerateComplaintInput,
  GenerateComplaintResult,
  RegulatoryBodyInfo,
  ComplaintTemplateInfo,
  RegulatoryBodyId,
} from '@/CONTRACT'

// ============================================
// REGULATORY BODIES
// ============================================

/**
 * Fetch list of available regulatory bodies
 */
export function useRegulatoryBodies() {
  return useQuery({
    queryKey: ['regulatory-bodies'],
    queryFn: async (): Promise<RegulatoryBodyInfo[]> => {
      if (!isDesktop()) {
        // Mock data for development
        return [
          { id: 'ofcom', name: 'Ofcom', full_name: 'Office of Communications', description: 'Broadcasting standards regulator' },
          { id: 'ico', name: 'ICO', full_name: 'Information Commissioner\'s Office', description: 'Data protection and privacy regulator' },
          { id: 'hcpc', name: 'HCPC', full_name: 'Health and Care Professions Council', description: 'Healthcare professional standards' },
          { id: 'lgo', name: 'LGO', full_name: 'Local Government Ombudsman', description: 'Council maladministration complaints' },
          { id: 'bps', name: 'BPS', full_name: 'British Psychological Society', description: 'Psychology professional standards' },
          { id: 'gmc', name: 'GMC', full_name: 'General Medical Council', description: 'Medical professional standards' },
          { id: 'nmc', name: 'NMC', full_name: 'Nursing and Midwifery Council', description: 'Nursing professional standards' },
          { id: 'sra', name: 'SRA', full_name: 'Solicitors Regulation Authority', description: 'Legal professional standards' },
          { id: 'bsb', name: 'BSB', full_name: 'Bar Standards Board', description: 'Barrister professional standards' },
          { id: 'swe', name: 'SWE', full_name: 'Social Work England', description: 'Social work professional standards' },
        ]
      }
      return getTauriClient().listRegulatoryBodies()
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour (regulatory bodies don't change often)
  })
}

// ============================================
// COMPLAINT TEMPLATES
// ============================================

/**
 * Fetch complaint template for a specific regulatory body
 */
export function useComplaintTemplate(regulatoryBody: RegulatoryBodyId | null) {
  return useQuery({
    queryKey: ['complaint-template', regulatoryBody],
    queryFn: async (): Promise<ComplaintTemplateInfo | null> => {
      if (!regulatoryBody) return null
      if (!isDesktop()) {
        // Mock template data for development
        const mockTemplates: Record<RegulatoryBodyId, ComplaintTemplateInfo> = {
          ofcom: {
            regulatory_body: 'ofcom',
            name: 'Ofcom Broadcasting Complaint',
            required_sections: ['Summary', 'Programme Details', 'Fairness Concerns', 'Privacy Concerns', 'Evidence'],
            relevant_codes: ['Section 5 - Due Impartiality', 'Section 7 - Privacy', 'Section 8 - Fairness'],
          },
          ico: {
            regulatory_body: 'ico',
            name: 'ICO Data Protection Complaint',
            required_sections: ['Summary', 'Data Controller Details', 'Processing Activities', 'Rights Violated', 'Evidence'],
            relevant_codes: ['Article 6 - Lawful Basis', 'Article 7 - Consent', 'Article 9 - Special Category Data', 'Article 17 - Right to Erasure', 'Article 21 - Right to Object'],
          },
          hcpc: {
            regulatory_body: 'hcpc',
            name: 'HCPC Fitness to Practise Complaint',
            required_sections: ['Summary', 'Professional Details', 'Conduct Concerns', 'Impact', 'Evidence'],
            relevant_codes: ['Standard 1 - Act in best interests', 'Standard 3 - Work within competence', 'Standard 6 - Manage risk'],
          },
          lgo: {
            regulatory_body: 'lgo',
            name: 'Local Government Ombudsman Complaint',
            required_sections: ['Summary', 'Council Details', 'Maladministration', 'Injustice Suffered', 'Remedy Sought'],
            relevant_codes: ['Maladministration', 'Service Failure', 'Procedural Impropriety'],
          },
          bps: {
            regulatory_body: 'bps',
            name: 'BPS Ethics Complaint',
            required_sections: ['Summary', 'Psychologist Details', 'Ethical Concerns', 'Impact', 'Evidence'],
            relevant_codes: ['Code of Ethics and Conduct', 'Practice Guidelines'],
          },
          gmc: {
            regulatory_body: 'gmc',
            name: 'GMC Fitness to Practise Complaint',
            required_sections: ['Summary', 'Doctor Details', 'Concerns', 'Patient Impact', 'Evidence'],
            relevant_codes: ['Good Medical Practice', 'Duty of Candour'],
          },
          nmc: {
            regulatory_body: 'nmc',
            name: 'NMC Fitness to Practise Complaint',
            required_sections: ['Summary', 'Nurse/Midwife Details', 'Concerns', 'Patient Impact', 'Evidence'],
            relevant_codes: ['The Code', 'Standards for Medicines Management'],
          },
          sra: {
            regulatory_body: 'sra',
            name: 'SRA Professional Conduct Complaint',
            required_sections: ['Summary', 'Solicitor Details', 'Conduct Concerns', 'Client Impact', 'Evidence'],
            relevant_codes: ['SRA Principles', 'Code of Conduct'],
          },
          bsb: {
            regulatory_body: 'bsb',
            name: 'BSB Professional Conduct Complaint',
            required_sections: ['Summary', 'Barrister Details', 'Conduct Concerns', 'Impact', 'Evidence'],
            relevant_codes: ['BSB Handbook', 'Core Duties'],
          },
          swe: {
            regulatory_body: 'swe',
            name: 'Social Work England Complaint',
            required_sections: ['Summary', 'Social Worker Details', 'Conduct Concerns', 'Impact on Service Users', 'Evidence'],
            relevant_codes: ['Professional Standards', 'Standards of Conduct'],
          },
        }
        return mockTemplates[regulatoryBody] || null
      }
      return getTauriClient().getComplaintTemplate(regulatoryBody)
    },
    enabled: !!regulatoryBody,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  })
}

// ============================================
// COMPLAINT GENERATION
// ============================================

/**
 * Generate a regulatory complaint mutation
 */
export function useGenerateComplaint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: GenerateComplaintInput): Promise<GenerateComplaintResult> => {
      if (!isDesktop()) {
        // Mock generation for development
        return {
          success: true,
          complaint: {
            regulatory_body: input.regulatory_body,
            format: input.format,
            title: `Complaint to ${input.regulatory_body.toUpperCase()} regarding ${input.subject}`,
            content: `# Complaint to ${input.regulatory_body.toUpperCase()}\n\n## Subject: ${input.subject}\n\n### Summary\n${input.summary || 'No summary provided.'}\n\n### Complainant\n${input.complainant_name}\n${input.complainant_address || ''}\n${input.complainant_email || ''}\n\n### Respondent\n${input.respondent_name}\n${input.respondent_address || ''}\n\n### Findings Referenced\n${input.finding_ids.length} findings included\n\n### Additional Context\n${input.additional_context || 'None provided.'}`,
            sections: [
              { heading: 'Summary', content: input.summary || 'No summary provided.', evidence_refs: [] },
              { heading: 'Complainant Details', content: `${input.complainant_name}\n${input.complainant_address || ''}\n${input.complainant_email || ''}`, evidence_refs: [] },
              { heading: 'Respondent Details', content: `${input.respondent_name}\n${input.respondent_address || ''}`, evidence_refs: [] },
              { heading: 'Findings', content: `${input.finding_ids.length} findings referenced`, evidence_refs: input.finding_ids },
            ],
            evidence_schedule: input.finding_ids.map((id, index) => ({
              id,
              label: `E${index + 1}`,
              description: `Finding reference ${id}`,
              document_ref: null,
              page_ref: null,
              quote: null,
            })),
            word_count: 500,
            generated_at: new Date().toISOString(),
          },
        }
      }
      return getTauriClient().generateComplaint(input)
    },
    onSuccess: (_, variables) => {
      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['complaints', variables.case_id] })
    },
  })
}

// ============================================
// COMPLAINT EXPORT
// ============================================

export interface ExportComplaintOptions {
  content: string
  format: 'pdf' | 'docx' | 'markdown'
  filename: string
}

/**
 * Export complaint to file
 */
export function useExportComplaint() {
  return useMutation({
    mutationFn: async ({ content, format, filename }: ExportComplaintOptions) => {
      // For markdown, just use browser download
      if (format === 'markdown') {
        const blob = new Blob([content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename.endsWith('.md') ? filename : `${filename}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        return { success: true, path: null }
      }

      // For PDF/DOCX in desktop mode, use native file dialog
      if (isDesktop()) {
        const { saveExportFile } = await import('@/lib/tauri/commands')
        const encoder = new TextEncoder()
        const data = encoder.encode(content)

        const extension = format === 'pdf' ? '.pdf' : '.docx'
        const finalFilename = filename.endsWith(extension) ? filename : `${filename}${extension}`

        return saveExportFile(finalFilename, Array.from(data))
      }

      // Fallback to markdown download for web mode
      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return { success: true, path: null }
    },
  })
}

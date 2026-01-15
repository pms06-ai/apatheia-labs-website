'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateCase } from '@/hooks/use-cases'
import { useCaseStore } from '@/hooks/use-case-store'
import type { CaseType } from '@/CONTRACT'

interface CreateCaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CASE_TYPES: { value: CaseType; label: string }[] = [
  { value: 'family_court', label: 'Family Court' },
  { value: 'regulatory', label: 'Regulatory' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'civil', label: 'Civil' },
  { value: 'media', label: 'Media' },
]

export function CreateCaseModal({ open, onOpenChange }: CreateCaseModalProps) {
  const [reference, setReference] = useState('')
  const [name, setName] = useState('')
  const [caseType, setCaseType] = useState<CaseType>('family_court')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ reference?: string; name?: string }>({})

  const createCase = useCreateCase()
  const setActiveCase = useCaseStore((state) => state.setActiveCase)

  const resetForm = () => {
    setReference('')
    setName('')
    setCaseType('family_court')
    setDescription('')
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const validate = (): boolean => {
    const newErrors: { reference?: string; name?: string } = {}

    if (!reference.trim()) {
      newErrors.reference = 'Reference is required'
    }

    if (!name.trim()) {
      newErrors.name = 'Case name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      const newCase = await createCase.mutateAsync({
        reference: reference.trim(),
        name: name.trim(),
        case_type: caseType,
        description: description.trim() || undefined,
      })

      toast.success(`Case "${newCase.name}" created successfully`)
      setActiveCase(newCase)
      handleClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create case'
      toast.error(message)
      console.error('[CreateCaseModal] Error creating case:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Case</DialogTitle>
          <DialogDescription>
            Add a new case to track documents and run analysis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-2">
          <Input
            label="Reference"
            placeholder="e.g., PE23C50095"
            value={reference}
            onChange={(e) => {
              setReference(e.target.value)
              if (errors.reference) setErrors((prev) => ({ ...prev, reference: undefined }))
            }}
            error={errors.reference}
            autoFocus
          />

          <Input
            label="Case Name"
            placeholder="e.g., Family Court Proceedings"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            error={errors.name}
          />

          <div className="w-full">
            <label
              htmlFor="case-type-select"
              className="mb-1.5 block text-sm font-medium text-charcoal-200"
            >
              Case Type
            </label>
            <Select value={caseType} onValueChange={(value) => setCaseType(value as CaseType)}>
              <SelectTrigger id="case-type-select">
                <SelectValue placeholder="Select case type" />
              </SelectTrigger>
              <SelectContent>
                {CASE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <label
              htmlFor="case-description"
              className="mb-1.5 block text-sm font-medium text-charcoal-200"
            >
              Description{' '}
              <span className="text-charcoal-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="case-description"
              placeholder="Brief description of the case..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-charcoal-600 bg-charcoal-800 px-3 py-2 text-sm text-charcoal-100 placeholder:text-charcoal-500 transition-colors duration-200 focus:border-bronze-500 focus:outline-none focus:ring-2 focus:ring-bronze-500/30 resize-none"
            />
          </div>

          <DialogFooter className="p-0 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createCase.isPending}>
              {createCase.isPending ? 'Creating...' : 'Create Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

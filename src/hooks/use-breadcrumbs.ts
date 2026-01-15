import { useLocation } from 'react-router-dom'
import { useCaseStore } from './use-case-store'
import type { BreadcrumbItem } from '@/components/ui/breadcrumb'

/**
 * Hook to generate breadcrumb items based on current route and active case.
 *
 * Returns an array of breadcrumb items that can be passed to the Breadcrumb component.
 */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation()
  const { activeCase } = useCaseStore()

  const breadcrumbs: BreadcrumbItem[] = []

  // Determine current page based on pathname
  if (location.pathname.includes('/documents')) {
    breadcrumbs.push({ label: 'Documents', current: true })
  } else if (location.pathname.includes('/analysis')) {
    breadcrumbs.push({ label: 'Analysis', current: true })
  } else if (location.pathname.includes('/sam')) {
    breadcrumbs.push({ label: 'S.A.M. Analysis', current: true })
  } else if (location.pathname.includes('/settings')) {
    breadcrumbs.push({ label: 'Settings', current: true })
  }

  // Prepend case name if active and we have page breadcrumbs
  if (activeCase && breadcrumbs.length > 0) {
    // Case name links to dashboard
    breadcrumbs.unshift({ label: activeCase.name, href: '/' })
  }

  return breadcrumbs
}

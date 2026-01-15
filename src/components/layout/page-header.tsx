import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'

/**
 * PageHeader component that displays breadcrumb navigation.
 *
 * Automatically generates breadcrumbs based on current route and active case.
 * Only renders when there are breadcrumbs to display (not on dashboard).
 */
export function PageHeader() {
  const breadcrumbs = useBreadcrumbs()

  // Don't render on dashboard (no breadcrumbs)
  if (breadcrumbs.length === 0) return null

  return (
    <div className="mb-6">
      <Breadcrumb items={breadcrumbs} />
    </div>
  )
}

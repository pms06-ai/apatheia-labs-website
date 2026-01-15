import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Fragment } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
}

export function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  if (items.length === 0 && !showHome) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-charcoal-400">
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center justify-center rounded p-1 transition-colors hover:bg-charcoal-800 hover:text-charcoal-200"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          {items.length > 0 && <ChevronRight className="h-4 w-4 text-charcoal-600" />}
        </>
      )}
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <ChevronRight className="h-4 w-4 text-charcoal-600" />}
          {item.current ? (
            <span className="font-medium text-charcoal-100" aria-current="page">
              {item.label}
            </span>
          ) : item.href ? (
            <Link
              to={item.href}
              className="rounded px-1 transition-colors hover:bg-charcoal-800 hover:text-charcoal-200"
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

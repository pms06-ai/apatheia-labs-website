import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean
  /** Use 'region' for important content sections, 'article' for self-contained content */
  as?: 'div' | 'article' | 'section'
}

export function Card({ className, accent, children, as: Component = 'div', role, ...props }: CardProps) {
  // Default to region role if component is section, no default role for div/article
  const computedRole = role ?? (Component === 'section' ? 'region' : undefined)

  return (
    <Component
      className={cn(
        'rounded-lg border bg-bg-secondary',
        accent ? 'border-bronze-600/40' : 'border-charcoal-700',
        className
      )}
      role={computedRole}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-b border-charcoal-700 px-4 py-3', className)}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-medium text-charcoal-100', className)}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4', className)} {...props} />
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-t border-charcoal-700 px-4 py-3', className)}
      {...props}
    />
  )
}

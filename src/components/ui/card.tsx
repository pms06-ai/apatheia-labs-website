import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean
}

export function Card({ className, accent, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-bg-secondary',
        accent ? 'border-bronze-600/40' : 'border-charcoal-600/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-b border-charcoal-600/30 px-4 py-3', className)}
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
      className={cn('border-t border-charcoal-600/30 px-4 py-3', className)}
      {...props}
    />
  )
}

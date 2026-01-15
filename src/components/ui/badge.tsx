import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** Whether this badge represents a status that may change dynamically */
  isStatus?: boolean
  /** For dynamic status badges, controls aria-live behavior */
  liveRegion?: 'polite' | 'assertive' | 'off'
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-charcoal-700 text-charcoal-300',
  critical: 'bg-status-critical-bg text-status-critical',
  high: 'bg-status-high-bg text-status-high',
  medium: 'bg-status-medium-bg text-status-medium',
  low: 'bg-charcoal-700 text-charcoal-400',
  info: 'bg-status-info-bg text-status-info',
  success: 'bg-status-success-bg text-status-success',
  outline: 'border border-charcoal-600 text-charcoal-300 bg-transparent',
}

export function Badge({ className, variant = 'default', isStatus = false, liveRegion, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
        // Apply no-bg padding adjustment for outline
        variant === 'outline' ? 'py-[1px]' : '',
        variantStyles[variant],
        className
      )}
      role={isStatus ? 'status' : undefined}
      aria-live={liveRegion}
      {...props}
    />
  )
}

// Specialized badges for regulators
type RegulatorBadgeProps = {
  regulator: 'ofcom' | 'iopc' | 'lgo' | 'ico' | 'hcpc' | 'bps' | 'ofsted'
} & React.HTMLAttributes<HTMLSpanElement>

const regulatorStyles: Record<string, string> = {
  ofcom: 'bg-regulator-ofcom/20 text-regulator-ofcom border-regulator-ofcom/40',
  iopc: 'bg-regulator-iopc/20 text-regulator-iopc border-regulator-iopc/40',
  lgo: 'bg-regulator-lgo/20 text-regulator-lgo border-regulator-lgo/40',
  ico: 'bg-regulator-ico/20 text-regulator-ico border-regulator-ico/40',
  hcpc: 'bg-regulator-hcpc/20 text-regulator-hcpc border-regulator-hcpc/40',
  bps: 'bg-regulator-bps/20 text-regulator-bps border-regulator-bps/40',
  ofsted: 'bg-regulator-ofsted/20 text-regulator-ofsted border-regulator-ofsted/40',
}

export function RegulatorBadge({ regulator, className, ...props }: RegulatorBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
        regulatorStyles[regulator],
        className
      )}
      {...props}
    >
      {regulator}
    </span>
  )
}

// Engine badge
type EngineBadgeProps = {
  engine: string
  icon?: string
} & React.HTMLAttributes<HTMLSpanElement>

export function EngineBadge({ engine, icon, className, ...props }: EngineBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded bg-bronze-600/15 px-2 py-0.5 text-xs text-bronze-400 border border-bronze-600/30',
        className
      )}
      {...props}
    >
      {icon && <span className="font-serif">{icon}</span>}
      {engine}
    </span>
  )
}

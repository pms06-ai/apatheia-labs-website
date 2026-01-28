type BadgeVariant = 'default' | 'bronze' | 'critical' | 'high' | 'medium' | 'info' | 'success';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-charcoal-800 text-charcoal-300',
  bronze: 'bg-bronze-600/20 text-bronze-400',
  critical: 'bg-status-critical/15 text-status-critical',
  high: 'bg-status-high/15 text-status-high',
  medium: 'bg-status-medium/15 text-status-medium',
  info: 'bg-status-info/15 text-status-info',
  success: 'bg-status-success/15 text-status-success',
};

export function Badge({ variant = 'default', className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

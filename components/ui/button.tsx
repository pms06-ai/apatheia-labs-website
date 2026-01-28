import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-bronze-600 to-bronze-500 text-white hover:from-bronze-700 hover:to-bronze-600 shadow-lg shadow-bronze-900/20',
  secondary:
    'border border-bronze-600/40 text-bronze-400 hover:bg-bronze-600/10 hover:border-bronze-500/60',
  ghost:
    'text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800/50',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-500 disabled:opacity-50 disabled:pointer-events-none';

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}

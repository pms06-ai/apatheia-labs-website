interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-colors hover:border-bronze-600/40 ${className}`.trim()}
    >
      {children}
    </div>
  );
}

import Link from 'next/link'

const brand = {
  charcoal: '#1C1C1E',
  bronze: '#B8860B',
  offWhite: '#F5F5F1',
  warmGray: '#6B6B6B',
}

export default function NotFound() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0F0F10' }}
    >
      <div className="text-center px-6 max-w-md">
        {/* Logo */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: `linear-gradient(135deg, ${brand.bronze} 0%, #8B7355 100%)`,
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            color: brand.offWhite,
            boxShadow: `0 4px 16px rgba(184,134,11,0.3)`,
          }}
        >
          Α
        </div>

        {/* 404 */}
        <h1 
          className="text-6xl font-serif mb-4"
          style={{ color: brand.bronze }}
        >
          404
        </h1>

        {/* Title */}
        <h2 
          className="text-2xl font-serif mb-3"
          style={{ color: brand.offWhite }}
        >
          Page Not Found
        </h2>

        {/* Message */}
        <p 
          className="text-sm mb-8 leading-relaxed"
          style={{ color: brand.warmGray }}
        >
          The page you're looking for doesn't exist or has been moved.
          Check the URL or navigate back to the dashboard.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ 
              background: brand.bronze, 
              color: brand.charcoal 
            }}
          >
            Go to Dashboard
          </Link>
          <Link
            href="/documents"
            className="px-6 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ 
              background: 'transparent', 
              color: brand.offWhite,
              border: `1px solid ${brand.warmGray}40`,
            }}
          >
            View Documents
          </Link>
        </div>

        {/* Footer */}
        <p 
          className="mt-12 text-xs"
          style={{ color: brand.warmGray }}
        >
          Phronesis FCIP • Apatheia Labs
        </p>
      </div>
    </div>
  )
}

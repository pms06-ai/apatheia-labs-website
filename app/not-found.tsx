import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-serif text-6xl text-bronze-500">404</h1>
      <p className="text-xl text-charcoal-300">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-bronze-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-bronze-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

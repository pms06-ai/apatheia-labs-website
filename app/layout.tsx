import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Phronesis — Forensic Document Analysis',
    template: '%s | Phronesis',
  },
  description:
    'Free forensic document analysis tool for detecting contradictions, bias, and logical fallacies in complex documents.',
  openGraph: {
    type: 'website',
    siteName: 'Phronesis',
    title: 'Phronesis — Forensic Document Analysis',
    description:
      'Free forensic document analysis tool for detecting contradictions, bias, and logical fallacies in complex documents.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-bronze-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}

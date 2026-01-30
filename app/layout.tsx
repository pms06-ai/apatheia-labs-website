import type { Metadata } from 'next';
import { Roboto_Slab, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
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
  metadataBase: new URL('https://apatheialabs.com'),
  title: {
    default: 'Apatheia Labs — Clarity Without Distortion',
    template: '%s | Apatheia Labs',
  },
  description:
    'Forensic document analysis tool for detecting contradictions, bias, and logical fallacies in complex documents.',
  openGraph: {
    type: 'website',
    siteName: 'Apatheia Labs',
    title: 'Apatheia Labs — Clarity Without Distortion',
    description:
      'Forensic document analysis tool for detecting contradictions, bias, and logical fallacies in complex documents.',
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
      className={`${robotoSlab.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-bronze-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

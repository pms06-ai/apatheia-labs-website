import { Hero } from '@/components/landing/hero';
import { Problem } from '@/components/landing/problem';
import { Solution } from '@/components/landing/solution';
import { Credibility } from '@/components/landing/credibility';
import { EnginesGrid } from '@/components/landing/engines-grid';
import { Comparison } from '@/components/landing/comparison';
import { ResearchPreview } from '@/components/landing/research-preview';
import { Roadmap } from '@/components/landing/roadmap';
import { DownloadSection } from '@/components/landing/download';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Phronesis',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description:
    'Forensic document analysis tool for detecting contradictions, bias, and logical fallacies in complex documents.',
  url: 'https://apatheialabs.com',
  author: {
    '@type': 'Organization',
    name: 'Apatheia Labs',
    url: 'https://apatheialabs.com',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Problem />
      <Solution />
      <Credibility />
      <EnginesGrid />
      <Comparison />
      <ResearchPreview />
      <Roadmap />
      <DownloadSection />
    </>
  );
}

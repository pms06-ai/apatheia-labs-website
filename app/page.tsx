import { Hero } from '@/components/landing/hero';
import { Problem } from '@/components/landing/problem';
import { Solution } from '@/components/landing/solution';
import { EnginesGrid } from '@/components/landing/engines-grid';
import { Comparison } from '@/components/landing/comparison';
import { ResearchPreview } from '@/components/landing/research-preview';
import { Roadmap } from '@/components/landing/roadmap';
import { DownloadSection } from '@/components/landing/download';

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <EnginesGrid />
      <Comparison />
      <ResearchPreview />
      <Roadmap />
      <DownloadSection />
    </>
  );
}

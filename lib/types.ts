export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: string;
  status: 'complete' | 'draft' | 'in-progress' | 'planned';
  date?: string;
  tags?: string[];
}

export interface Article {
  slug: string;
  category: string;
  categoryLabel: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  readingTime: number;
  filePath: string;
}

export interface Category {
  slug: string;
  label: string;
  description: string;
  articleCount: number;
}

export interface SAMPhase {
  id: string;
  name: string;
  subtitle: string;
  overview: string;
  methodology: string[];
  caseExample: { label: string; text: string };
  inputs: string[];
  outputs: string[];
}

export interface CASCADEType {
  id: string;
  name: string;
  description: string;
  example: string;
  indicators: string[];
}

export interface AnalysisEngine {
  slug: string;
  name: string;
  subtitle: string;
  overview: string;
  capabilities: string[];
  methodology: string[];
  inputs: string[];
  outputs: string[];
}

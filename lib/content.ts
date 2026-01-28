import type { SAMPhase, CASCADEType, AnalysisEngine } from './types';

// ---------------------------------------------------------------------------
// S.A.M. Phases
// ---------------------------------------------------------------------------

export const samPhases: SAMPhase[] = [
  {
    id: 'anchor',
    name: 'ANCHOR',
    subtitle: 'Phase 1: False Premise Identification',
    overview:
      'ANCHOR is the foundational phase of the S.A.M. methodology. It identifies the origin points where false premises first emerge in a document corpus\u2014the moments when speculation becomes assertion, hearsay becomes evidence, or assumption becomes fact. Most institutional failures can be traced to specific anchor points: claims that entered the system without adequate verification and subsequently propagated unchecked.',
    methodology: [
      'Identify claims presented as fact without supporting evidence',
      'Trace each assertion backward to its earliest documented appearance',
      'Flag statements that transform uncertainty into certainty without justification',
      'Mark hearsay treated as direct evidence',
      'Detect speculation presented as professional opinion',
    ],
    caseExample: {
      label: 'Social Work Assessment',
      text: 'Report states "the father has anger management issues" as established fact. Tracing backward reveals this originated from a single unverified allegation in an initial referral, never independently assessed or corroborated, yet adopted by three subsequent professionals.',
    },
    inputs: ['Document corpus', 'Claim extraction', 'Citation mapping'],
    outputs: ['Anchor point registry', 'Originator identification', 'Foundation assessment scores'],
  },
  {
    id: 'inherit',
    name: 'INHERIT',
    subtitle: 'Phase 2: Propagation Tracking',
    overview:
      'INHERIT tracks how claims propagate across institutional boundaries without independent verification. When one agency\u2019s assessment is adopted by another without re-evaluation, errors compound and gain apparent authority. This phase maps the transmission pathways\u2014identifying which institutions adopted claims from whom, and whether any verification occurred at each handoff.',
    methodology: [
      'Map citation chains across documents and agencies',
      'Identify circular citation patterns (A cites B cites A)',
      'Flag claims adopted without independent verification',
      'Track how language mutates during transmission',
      'Measure the "authority accumulation" at each step',
    ],
    caseExample: {
      label: 'Multi-Agency Investigation',
      text: 'Initial police report contains speculative statement. Child protection services quotes it as "police findings." Court welfare officer cites both. By final hearing, the statement appears in 6 documents from 4 agencies, each citing the others\u2014but all trace to the same unverified origin.',
    },
    inputs: ['Anchor points', 'Document metadata', 'Agency identifiers'],
    outputs: ['Propagation maps', 'Citation networks', 'Verification gap analysis'],
  },
  {
    id: 'compound',
    name: 'COMPOUND',
    subtitle: 'Phase 3: Authority Accumulation',
    overview:
      'COMPOUND documents how claims gain weight through repetition rather than verification\u2014what is termed "authority laundering." A statement repeated by four professionals appears more credible than one stated by a single source, even when all four trace to the same unverified origin. This phase quantifies how apparent authority accumulates and identifies the tipping points where unverified claims become "established facts."',
    methodology: [
      'Count endorsements of each claim across the corpus',
      'Distinguish verification (new evidence) from repetition (same evidence)',
      'Identify "critical mass" points where claims become assumed facts',
      'Measure the ratio of citations to original evidence',
      'Flag claims where authority exceeds evidentiary basis',
    ],
    caseExample: {
      label: 'Expert Report Analysis',
      text: 'Court accepts finding as "established" because four professionals stated it. Analysis reveals: Professional A originated the claim without evidence; B, C, and D each cited the previous reports. Authority ratio: 4 endorsements, 0 independent verifications, 1 origin point.',
    },
    inputs: ['Propagation maps', 'Endorsement counts', 'Evidence registry'],
    outputs: ['Authority scores', 'Laundering detection', 'Evidence-to-assertion ratios'],
  },
  {
    id: 'arrive',
    name: 'ARRIVE',
    subtitle: 'Phase 4: Outcome Mapping',
    overview:
      'ARRIVE maps catastrophic outcomes back to their originating false premises, establishing but-for causation: would the outcome have occurred if the anchor claim had been verified? This phase connects the analytical work of phases 1\u20133 to real-world consequences, demonstrating how initial errors cascaded into final decisions.',
    methodology: [
      'Identify key decision points in the timeline',
      'Map which claims were relied upon at each decision',
      'Trace relied-upon claims back to anchor points',
      'Assess whether decision would differ with accurate information',
      'Document the cascade from anchor to outcome',
    ],
    caseExample: {
      label: 'Child Removal Decision',
      text: 'Final order removing child from parent relied on 5 key findings. Tracing backward: 3 findings originated from anchor points with no independent verification, 1 was based on temporal impossibility, 1 was supported. Without the unverified claims, the threshold for removal would not have been met.',
    },
    inputs: ['Decision points', 'Relied-upon claims', 'Anchor registry'],
    outputs: ['Causation chains', 'But-for analysis', 'Outcome attribution maps'],
  },
];

// ---------------------------------------------------------------------------
// CASCADE Contradiction Types
// ---------------------------------------------------------------------------

export const cascadeTypes: CASCADEType[] = [
  {
    id: 'self',
    name: 'SELF',
    description: 'A single document contradicts itself\u2014different claims on different pages that cannot both be true.',
    example: 'Report states "no contact since March" on page 3, describes "weekly contact" on page 12.',
    indicators: [
      'Extract all factual claims with document positions',
      'Cross-reference claims within same document',
      'Flag logical incompatibilities (X and not-X)',
      'Identify numeric inconsistencies',
      'Detect temporal impossibilities within single narrative',
    ],
  },
  {
    id: 'inter',
    name: 'INTER_DOC',
    description: 'Two or more documents make incompatible claims about the same event, person, or fact.',
    example: 'Police report: "subject was cooperative." Social work assessment: "subject refused to engage."',
    indicators: [
      'Extract claims with subject-predicate structure',
      'Match claims across documents by subject entity',
      'Compare predicates for logical compatibility',
      'Assess temporal context (same time period?)',
      'Rank severity based on claim importance',
    ],
  },
  {
    id: 'temporal',
    name: 'TEMPORAL',
    description: 'Dates, sequences, or durations that are logically impossible given other established facts.',
    example: 'Report "summarizes" a meeting that occurred three days after report was written.',
    indicators: [
      'Extract all temporal references (dates, times, durations)',
      'Build unified timeline from all sources',
      'Check for impossible sequences (effect before cause)',
      'Verify durations sum correctly',
      'Flag references to documents before their creation',
    ],
  },
  {
    id: 'evidentiary',
    name: 'EVIDENTIARY',
    description: 'Claims presented as factual that lack supporting evidence, or cited evidence actually contradicts the claim.',
    example: '"The father has a history of violence"\u2014no incidents, arrests, or evidence cited anywhere in record.',
    indicators: [
      'Identify claims with factual certainty markers',
      'Locate cited sources and evidence',
      'Verify evidence actually supports the claim',
      'Flag claims with no supporting reference',
      'Detect inverse citations (evidence says opposite)',
    ],
  },
  {
    id: 'modality',
    name: 'MODALITY',
    description: 'Possibility becomes probability becomes certainty\u2014without new evidence to justify the shift.',
    example: 'Initial note: "parent may have substance issues." Final report: "history of substance abuse."',
    indicators: [
      'Track claim certainty markers (may, might, possibly \u2192 likely \u2192 definitely)',
      'Map certainty changes across documents',
      'Check for new evidence justifying increased certainty',
      'Flag unexplained shifts from hypothesis to fact',
      'Identify where qualifiers are dropped',
    ],
  },
  {
    id: 'selective',
    name: 'SELECTIVE',
    description: 'Selective citation that omits context, qualifications, or contradicting passages from source material.',
    example: 'Quotes "child expressed fear" but omits "in the context of a nightmare about monsters."',
    indicators: [
      'Compare cited passages against full source documents',
      'Identify omitted qualifications and context',
      'Flag selective quotation that changes meaning',
      'Calculate bias score (pro/con omission ratio)',
      'Detect pattern of one-sided citation',
    ],
  },
  {
    id: 'scope',
    name: 'SCOPE',
    description: 'Conclusions that exceed the scope of the analysis or apply findings beyond their valid domain.',
    example: 'Single 2-hour observation leads to conclusion about "persistent parenting deficits."',
    indicators: [
      'Extract stated scope and limitations',
      'Compare conclusions against stated scope',
      'Flag recommendations exceeding assessment parameters',
      'Identify extrapolation from limited data',
      'Detect expertise boundary violations',
    ],
  },
  {
    id: 'unexplained',
    name: 'UNEXPLAINED',
    description: 'A party changes position without explanation, or conclusions change without new evidence.',
    example: 'March: "No concerns about care." June: "Significant safeguarding concerns." No new incidents documented.',
    indicators: [
      'Track position statements by author/entity over time',
      'Identify significant position changes',
      'Search for explanatory evidence between positions',
      'Flag reversals with no documented justification',
      'Detect patterns of strategic position changes',
    ],
  },
];

// ---------------------------------------------------------------------------
// Analysis Engines
// ---------------------------------------------------------------------------

export const analysisEngines: AnalysisEngine[] = [
  {
    slug: 'entity-resolution',
    name: 'Entity Resolution',
    subtitle: 'Canonical Identity Mapping',
    overview:
      'Creates a unified identity registry across your document corpus. Resolves aliases, tracks role changes, and maps relationships between individuals.',
    capabilities: [
      'Alias Detection',
      'Role Tracking',
      'Relationship Mapping',
      'Temporal Context',
      'Conflict Detection',
    ],
    methodology: [
      'Extract named entities with NLP',
      'Cluster by phonetic similarity and context',
      'Resolve clusters using document proximity and co-reference chains',
      'Build canonical identity with all known aliases',
      'Map relationships from co-occurrence and explicit mentions',
    ],
    inputs: ['Document corpus', 'Named entity extraction', 'Co-reference resolution'],
    outputs: ['Identity registry', 'Relationship graph', 'Conflict of interest flags'],
  },
  {
    slug: 'temporal-parser',
    name: 'Temporal Parser',
    subtitle: 'Timeline Construction & Analysis',
    overview:
      'Constructs unified timelines from scattered date references. Identifies gaps, overlaps, and impossible sequences that indicate error or manipulation.',
    capabilities: [
      'Date Extraction',
      'Timeline Construction',
      'Gap Detection',
      'Sequence Validation',
      'Deadline Tracking',
    ],
    methodology: [
      'Extract all temporal expressions with context',
      'Normalize to ISO 8601 format with confidence scores',
      'Link events to their temporal anchors',
      'Build event sequence graphs',
      'Validate against logical constraints',
    ],
    inputs: ['Document corpus', 'Temporal expressions', 'Event references'],
    outputs: ['Unified timeline', 'Gap analysis report', 'Anomaly findings'],
  },
  {
    slug: 'argumentation',
    name: 'Argumentation',
    subtitle: 'Toulmin Structure Analysis',
    overview:
      'Deconstructs claims into their logical components using the Toulmin model. Identifies unsupported assertions, missing warrants, and logical gaps.',
    capabilities: [
      'Claim Extraction',
      'Warrant Analysis',
      'Gap Detection',
      'Rebuttal Mapping',
      'Strength Scoring',
    ],
    methodology: [
      'Identify assertions requiring support',
      'Extract grounds (evidence) for each claim',
      'Evaluate warrant (logical connection) validity',
      'Find claims with missing grounds or implicit warrants',
      'Rate argument quality from evidence to claim',
    ],
    inputs: ['Document corpus', 'Claim extraction', 'Evidence mapping'],
    outputs: ['Argument maps', 'Strength scores', 'Gap identification report'],
  },
  {
    slug: 'contradiction',
    name: 'Contradiction',
    subtitle: 'Cross-Document Inconsistency Detection',
    overview:
      'Systematically detects inconsistencies across your document corpus using the CASCADE 8-type framework. Surfaces conflicts that undermine institutional conclusions.',
    capabilities: [
      'CASCADE Detection',
      'Source Comparison',
      'Conflict Mapping',
      'Confidence Scoring',
      'Severity Rating',
    ],
    methodology: [
      'Scan each document for internal contradictions (SELF)',
      'Cross-reference claims across documents (INTER_DOC)',
      'Validate timeline consistency (TEMPORAL)',
      'Check claims against cited evidence (EVIDENTIARY)',
      'Track certainty shifts (MODALITY)',
    ],
    inputs: ['Document corpus', 'Claim registry', 'Citation network'],
    outputs: ['Contradiction findings', 'Confidence/severity scores', 'Resolution suggestions'],
  },
  {
    slug: 'bias',
    name: 'Bias Detection',
    subtitle: 'Statistical Imbalance Analysis',
    overview:
      'Performs statistical analysis of directional bias in reporting. Calculates omission ratios, measures framing imbalance, and quantifies selective presentation.',
    capabilities: [
      'Directional Scoring',
      'Omission Analysis',
      'Framing Metrics',
      'Selection Bias Detection',
      'Pattern Identification',
    ],
    methodology: [
      'Compare cited passages against full source documents',
      'Calculate pro/con omission ratios',
      'Measure space/time allocation between perspectives',
      'Identify systematic omission patterns',
      'Compute directional bias score (-1.0 to +1.0)',
    ],
    inputs: ['Document corpus', 'Source materials', 'Citation mapping'],
    outputs: ['Bias scores', 'Omission inventory', 'Framing analysis report'],
  },
  {
    slug: 'accountability',
    name: 'Accountability',
    subtitle: 'Duty Mapping & Violation Detection',
    overview:
      'Maps statutory duty violations to specific actors and regulatory bodies. Links evidence to relevant professional standards and complaint pathways.',
    capabilities: [
      'Duty Mapping',
      'Actor Attribution',
      'Regulatory Routing',
      'Breach Detection',
      'Evidence Packaging',
    ],
    methodology: [
      'Map relevant statutory and professional duties to each actor',
      'Identify where actions violated duties',
      'Link violations to specific individuals',
      'Match breaches to appropriate regulatory bodies',
      'Organize evidence for complaint submission',
    ],
    inputs: ['Entity registry', 'Timeline', 'Contradiction findings'],
    outputs: ['Duty breach report', 'Regulatory routing', 'Complaint packages'],
  },
];

// ---------------------------------------------------------------------------
// Roadmap Items
// ---------------------------------------------------------------------------

export interface RoadmapItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'concept' | 'development' | 'next' | 'planned' | 'research';
  features: string[];
  isProduct?: boolean;
}

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'aletheia',
    name: 'Aletheia',
    tagline: 'Political Analytics Platform',
    description:
      'Apply the same forensic rigor to political discourse. Analyze claims from news outlets, YouTubers, influencers, and political figures. Track accuracy over time and surface contradictions.',
    status: 'concept',
    features: ['YouTube Analysis', 'Twitter/X Monitoring', 'Podcast Support', 'Claim Database', 'Historical Accuracy'],
    isProduct: true,
  },
  {
    id: 'nous',
    name: 'Nous',
    tagline: 'Adaptive Analytics Platform',
    description:
      'Describe what you want to understand. The system builds the right analytical approach for your goal. Structure emerges from purpose, not templates. No databases to configure, no schemas to learn.',
    status: 'research',
    features: ['Intent Capture', 'Dynamic Pipelines', 'Session Memory', 'Exploratory Mode', 'Zero Setup'],
    isProduct: true,
  },
  {
    id: 'obsidian',
    name: 'Obsidian Integration',
    tagline: 'Deep Vault Synchronization',
    description:
      'Deep integration with Obsidian for researchers who live in their knowledge bases. Sync findings directly to your vault with bidirectional linking.',
    status: 'development',
    features: ['Vault Sync', 'Wikilinks', 'YAML Frontmatter'],
  },
  {
    id: 'mcp',
    name: 'MCP Server',
    tagline: 'Claude Integration via Model Context Protocol',
    description:
      'Model Context Protocol server enabling Claude and other AI assistants to directly query your analysis database and run forensic operations.',
    status: 'development',
    features: ['Claude Integration', 'Tool Definitions', 'Local-First'],
  },
  {
    id: 'omission',
    name: 'Advanced Omission Detection',
    tagline: 'Source-to-Report Gap Analysis',
    description:
      'Compare any document against its source materials to identify what was excluded. Calculate directional bias scores and map selective citation patterns.',
    status: 'next',
    features: ['Source Comparison', 'Bias Scoring', 'Gap Mapping'],
  },
  {
    id: 'expert',
    name: 'Expert Witness Analyzer',
    tagline: 'Professional Standards Compliance',
    description:
      'Evaluate expert reports against professional standards. Check FJC compliance, assess scope boundaries, and identify opinions that exceed expertise.',
    status: 'next',
    features: ['FJC Compliance', 'Scope Analysis', 'Standard Mapping'],
  },
  {
    id: 'documentary',
    name: 'Documentary Comparison',
    tagline: 'Broadcast vs. Source Analysis',
    description:
      'Compare broadcast or published content against source materials. Quantify what was included versus omitted and measure editorial bias in framing.',
    status: 'planned',
    features: ['Broadcast Analysis', 'Framing Metrics', 'Source Matching'],
  },
  {
    id: 'coordination',
    name: 'Cross-Institutional Mapping',
    tagline: 'Hidden Coordination Detection',
    description:
      'Detect hidden coordination between supposedly independent agencies. Identify shared language, circular citations, and pre-disclosure information flow.',
    status: 'planned',
    features: ['Coordination Detection', 'Citation Networks', 'Pattern Matching'],
  },
  {
    id: 'mobile',
    name: 'Mobile Companion',
    tagline: 'Capture & Sync On-the-Go',
    description:
      'Capture documents on the go and sync to your desktop instance. Take photos of physical documents and queue them for processing.',
    status: 'research',
    features: ['Document Capture', 'Offline Queue', 'Secure Sync'],
  },
  {
    id: 'api',
    name: 'Developer API',
    tagline: 'RESTful Integration',
    description:
      'RESTful API for integrating Phronesis analysis capabilities into your own applications. Build custom workflows and connect to existing systems.',
    status: 'research',
    features: ['REST Endpoints', 'Webhooks', 'SDK Libraries'],
  },
  {
    id: 'team',
    name: 'Team Collaboration',
    tagline: 'Encrypted Multi-User Support',
    description:
      'Optional cloud sync for teams working on the same case. Maintain local-first principles with encrypted, opt-in collaboration features.',
    status: 'research',
    features: ['E2E Encryption', 'Role Permissions', 'Audit Logs'],
  },
];


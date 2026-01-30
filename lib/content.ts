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
    problemStatement:
      'The same person appears five different ways across 500 pages. "Dr. J. Smith," "Jane Smith," "Ms Smith," "the psychologist," and "JS" are all one actor \u2014 but fragmented identity means fragmented analysis. Manual tracking breaks down at scale, and missed connections mean missed accountability.',
    sampleOutput:
      'Canonical Identity Card\n\nCanonical Name: Dr. Jane Smith\nAliases: J. Smith, Jane Smith, Ms Smith, "the psychologist," JS\nRole: Clinical Psychologist (2019\u2013present)\nOrganisation: Regional Assessment Service\nDocuments: 47 appearances across 23 documents\nFirst Seen: Doc 3, p.2 (14 March 2021)\nLast Seen: Doc 156, p.8 (9 October 2024)\nRelationships: Supervised by Prof. R. Williams; assessed Client A (12 sessions); authored reports E4.1, E4.3, E4.7\nFlags: Role change: "Independent Expert" \u2192 "Trust Employee" at Doc 89 (no disclosure in subsequent reports)',
    worksWith: [
      { engine: 'Temporal Parser', slug: 'temporal-parser', description: 'Uses resolved entities to build per-person timelines and detect when someone\u2019s role or involvement changed.' },
      { engine: 'Contradiction', slug: 'contradiction', description: 'Relies on canonical identities to determine whether two conflicting statements came from the same or different sources.' },
      { engine: 'Accountability', slug: 'accountability', description: 'Maps statutory duties to resolved individuals, ensuring breach findings attach to the right person regardless of how they were named.' },
    ],
    useCases: [
      { title: 'Family court proceedings', description: 'A social worker is referred to by name, job title, and pronouns across 40 reports from different agencies. Entity Resolution unifies these references so their assessments can be tracked as a single professional narrative.' },
      { title: 'Corporate investigations', description: 'Beneficial ownership tracing across shell companies where directors use variations of their names. The engine surfaces hidden connections between entities that appeared unrelated.' },
      { title: 'Multi-agency reviews', description: 'Witness and professional identification across police, health, and education records where different agencies use different naming conventions for the same individuals.' },
    ],
    technicalApproach: [
      'Named Entity Recognition using spaCy transformer models, tuned for UK institutional documents (titles, honorifics, role-based references)',
      'Phonetic clustering via Soundex and Double Metaphone algorithms to catch spelling variations and transliterations',
      'Co-reference resolution using neural co-reference chains to link pronouns and descriptions back to named entities',
      'Manual verification layer \u2014 ambiguous merges (confidence < 0.85) are flagged for human review before finalisation',
    ],
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
    problemStatement:
      'Dates are scattered across hundreds of pages in inconsistent formats. A report dated 15 March references an assessment from 22 March \u2014 a temporal impossibility buried in volume. Manual timeline construction is slow, error-prone, and collapses under the weight of large document sets. Critical gaps and impossible sequences go undetected.',
    sampleOutput:
      'TEMPORAL CONTRADICTION DETECTED\n\nEvent A: Assessment report authored\n  Date: 15 March 2023 | Source: Doc 12, p.3 | Author: Dr. J. Smith\n\nEvent B: Assessment session conducted\n  Date: 22 March 2023 | Source: Doc 14, p.1 | Participants: Dr. J. Smith, Client A\n\nFinding: Report (Event A) predates the assessment it describes (Event B) by 7 days.\nCASCADE type: TEMPORAL | Severity: HIGH\n\nGap detected: 14 June 2023 \u2013 9 September 2023\n  No recorded activity for 87 days\n  Statutory deadline (45-day review) exceeded\n  Last actor: Social Worker B',
    worksWith: [
      { engine: 'Entity Resolution', slug: 'entity-resolution', description: 'Provides the identity layer so the Temporal Parser can build per-person timelines and track who did what when.' },
      { engine: 'Contradiction', slug: 'contradiction', description: 'Consumes timeline data to identify TEMPORAL type contradictions \u2014 events that couldn\u2019t have happened in the stated order.' },
      { engine: 'Accountability', slug: 'accountability', description: 'Uses deadline tracking to identify where statutory timeframes were breached and which actors were responsible.' },
    ],
    useCases: [
      { title: 'Police investigation review', description: 'Reconstructing the sequence of witness statements, forensic results, and investigative decisions to identify where the timeline diverges from what was reported to the court.' },
      { title: 'Contract dispute analysis', description: 'Tracking amendment dates, notice periods, and performance milestones across hundreds of communications to identify breached deadlines.' },
      { title: 'Medical record sequencing', description: 'Building a unified patient timeline from GP notes, hospital records, specialist referrals, and pharmacy dispensing logs to identify treatment gaps or contradictory clinical accounts.' },
    ],
    technicalApproach: [
      'Date extraction combines regex patterns for structured dates with NLP models for natural language temporal expressions',
      'ISO 8601 normalization resolves locale ambiguity using document metadata, institutional conventions, and cross-referencing against anchor dates',
      'Event-graph construction using directed acyclic graphs with temporal constraint edges, enabling both forward and backward sequence traversal',
      'Anomaly detection via constraint satisfaction \u2014 the engine identifies configurations where no valid temporal ordering exists',
    ],
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
    problemStatement:
      'Claims are presented as fact with no visible evidence chain. "The father has anger management issues" appears in a professional report \u2014 but where is the evidence? What connects observation to conclusion? The Toulmin model exposes the skeleton of every argument: claim, grounds, warrant, backing, qualifier, and rebuttal. When components are missing, the argument is unsupported.',
    sampleOutput:
      'CLAIM: "The father has anger management issues"\n  Source: Doc 23, p.7, para 3 | Author: Social Worker B\n\nGROUNDS (evidence): [NONE FOUND in document corpus]\nWARRANT (reasoning): [MISSING]\nBACKING (warrant support): [MISSING]\nQUALIFIER (certainty level): Stated as fact (no hedging language)\nREBUTTAL (counter-evidence): [NONE \u2014 no alternative explanations considered]\n\nSTRENGTH SCORE: 0.08 / 1.0\n\nFinding: Evaluative claim stated as established fact with no identified evidential basis, no reasoning chain, and no consideration of alternatives.',
    worksWith: [
      { engine: 'Contradiction', slug: 'contradiction', description: 'Identifies claims that conflict across documents \u2014 the Argumentation Engine then assesses which version has stronger evidential support.' },
      { engine: 'Bias Detection', slug: 'bias', description: 'Uses argument strength data to determine whether weak arguments systematically favour one direction.' },
      { engine: 'Accountability', slug: 'accountability', description: 'Consumes argument maps to identify where professionals made claims that violate evidence-based practice standards.' },
    ],
    useCases: [
      { title: 'Expert report analysis', description: 'Deconstructing a psychological assessment or expert witness report to identify which conclusions are evidence-based and which are unsupported professional opinion presented as fact.' },
      { title: 'Court judgment deconstruction', description: 'Mapping the logical structure of judicial reasoning to identify where findings of fact rest on contested evidence, hearsay, or assumptions not tested at trial.' },
      { title: 'Policy document evaluation', description: 'Assessing whether institutional policies and recommendations are grounded in cited research and evidence, or whether they rest on unstated assumptions.' },
    ],
    technicalApproach: [
      'Claim extraction using fine-tuned classification models that distinguish propositional claims from factual observations, procedural descriptions, and hedged statements',
      'Toulmin decomposition maps each claim to the six Toulmin components, identifying which are present, absent, or implicit',
      'Gap detection prioritises findings by severity \u2014 a conclusion stated as fact with no grounds scores lower than a hedged opinion with partial evidence',
      'Strength scoring weights completeness, evidence quality, warrant soundness, and acknowledgment of limitations into a single 0.0\u20131.0 metric',
    ],
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
    problemStatement:
      'Document 12 says "no concerns." Document 47 says "significant concerns." Both are authored by the same professional, six weeks apart, with no intervening events to explain the shift. Buried in a 500-page corpus, this contradiction is invisible to manual review. Multiply that across hundreds of claims and dozens of documents, and systematic inconsistency becomes undetectable without automation.',
    sampleOutput:
      'CASCADE Type: UNEXPLAINED_CHANGE | Severity: HIGH | Confidence: 0.94\n\nStatement A:\n  "No safeguarding concerns were raised during the visit."\n  Source: Doc 12, p.3, para 2 | Author: Social Worker A | Date: 14 March 2023\n\nStatement B:\n  "Significant safeguarding concerns persist and have been present throughout the period of involvement."\n  Source: Doc 47, p.8, para 1 | Author: Social Worker A | Date: 28 April 2023\n\nAnalysis: Same author, 45 days apart. No intervening events documented. No explanation for position change found in corpus. Direction: Escalation without evidential basis.',
    worksWith: [
      { engine: 'Entity Resolution', slug: 'entity-resolution', description: 'Ensures contradictions are correctly attributed \u2014 confirming whether conflicting statements came from the same person or different individuals.' },
      { engine: 'Temporal Parser', slug: 'temporal-parser', description: 'Provides the timeline data needed to detect TEMPORAL contradictions and to sequence when positions changed.' },
      { engine: 'Bias Detection', slug: 'bias', description: 'Consumes contradiction findings to determine whether conflicts follow a systematic directional pattern.' },
      { engine: 'Argumentation', slug: 'argumentation', description: 'Uses contradiction data to assess claim strength \u2014 a claim contradicted by the same author\u2019s earlier statement scores lower.' },
    ],
    useCases: [
      { title: 'Multi-agency investigation analysis', description: 'When police, social services, and health agencies produce separate reports about the same events, the Contradiction Engine surfaces where their accounts diverge and classifies the type of inconsistency.' },
      { title: 'Contract dispute documentation', description: 'Tracking how representations change across pre-contractual correspondence, the contract itself, and post-execution communications to identify where parties\u2019 positions shifted.' },
      { title: 'Regulatory filing review', description: 'Comparing statements made to different regulatory bodies about the same activities, detecting where organisations told different stories to different audiences.' },
    ],
    technicalApproach: [
      'Claim extraction using semantic parsing to identify propositional content \u2014 what each sentence actually asserts, independent of hedging language',
      'Semantic similarity matching via sentence embeddings to find claims about the same subject across documents, even when phrased differently',
      'Logical compatibility testing to determine whether two claims can coexist (compatible, contradictory, or in tension)',
      'CASCADE classification assigns each finding to one of 8 types, with severity scoring based on source authority, temporal proximity, and directional favouring',
    ],
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
    problemStatement:
      'Selective citation looks thorough. A report that cites 20 sources appears well-researched \u2014 until you check what was left out. When every omission favours the same side, that\u2019s not oversight. It\u2019s a pattern. But proving it requires systematic comparison of what was included against what was available, and statistical testing to determine whether the imbalance could have occurred by chance.',
    sampleOutput:
      'DOCUMENT: Editorial Investigation Report\nSOURCE MATERIALS: 12 documents analysed\n\nOMISSION INVENTORY:\n  Total omissions detected: 8\n  Pro-prosecution: 8 | Pro-defence: 0\n\nDIRECTIONAL BIAS SCORE: +1.0 (All omissions favour prosecution narrative)\n\nSTATISTICAL SIGNIFICANCE:\n  Binomial test (H0: random omission direction)\n  p = 0.004 (significant at p < 0.01)\n  Probability of this pattern by chance: 0.4%\n\nFRAMING RATIO:\n  Subject-as-suspect: 132 minutes | Subject-as-cleared: 10 minutes\n  Ratio: 13.2:1\n\nPATTERN: 100% prosecution-favoring omission pattern across all source materials.',
    worksWith: [
      { engine: 'Contradiction', slug: 'contradiction', description: 'Feeds SELECTIVE_CITATION type findings into Bias Detection, which then tests whether selective citation follows a systematic directional pattern.' },
      { engine: 'Argumentation', slug: 'argumentation', description: 'Provides argument strength data \u2014 the engine checks whether weak arguments consistently support one side.' },
      { engine: 'Accountability', slug: 'accountability', description: 'Uses bias scores to establish breaches of impartiality duties, packaging statistical evidence for regulatory complaints.' },
      { engine: 'Entity Resolution', slug: 'entity-resolution', description: 'Ensures omissions are correctly attributed to the right source documents and authors.' },
    ],
    useCases: [
      { title: 'Broadcast documentary analysis', description: 'Comparing a programme\u2019s content against its source materials to quantify what was included, what was omitted, and whether the omission pattern is statistically significant.' },
      { title: 'Expert report evaluation', description: 'Assessing whether a professional\u2019s report cited evidence selectively, checking whether omitted studies consistently contradict the report\u2019s conclusions.' },
      { title: 'Regulatory investigation review', description: 'Analysing whether an investigating body\u2019s final report reflects a balanced assessment or exhibits systematic directional bias in its source selection.' },
    ],
    technicalApproach: [
      'Source-to-report comparison using document alignment to map every claim back to available source materials, identifying coverage gaps',
      'Omission extraction classifies each gap by type (exculpatory, contextual, procedural, temporal, contradicting) and direction',
      'Binomial significance testing calculates the probability that the observed directional pattern could arise by chance, providing p-values',
      'Framing ratio calculation measures allocation of space, time, or emphasis between perspectives using word count, segment duration, and prominence weighting',
    ],
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
    problemStatement:
      'You\u2019ve found the contradictions, the bias, the unsupported claims. Now what? Duty breaches identified in analysis aren\u2019t actionable until they\u2019re mapped to specific professionals, linked to the standards they violated, and routed to the correct regulatory body with a properly structured evidence package. Without this final step, findings remain observations instead of complaints.',
    sampleOutput:
      'ACTOR: Dr. Jane Smith | ROLE: Clinical Psychologist | REGULATOR: HCPC\n\nBREACH 1: HCPC Standards of Proficiency \u00a72.7 (evidence-based practice)\n  Finding: 4 evaluative claims with no evidential basis\n  Evidence: Doc 23 p.7, Doc 31 p.4, Doc 31 p.12, Doc 45 p.2\n  Strength scores: 0.08, 0.12, 0.05, 0.15\n\nBREACH 2: BPS Code of Ethics \u00a73.4 (balanced consideration)\n  Finding: Directional bias score +0.87 across authored reports\n  Evidence: 7 exculpatory findings omitted; binomial test p = 0.008\n\nBREACH 3: HCPC Standards of Conduct \u00a79 (duty of candour)\n  Finding: Role change from independent expert to trust employee undisclosed\n  Evidence: Doc 89 header vs Doc 92 header; no disclosure in Docs 90\u2013156\n\nCOMPLAINT PACKAGE: 3 breaches, 11 supporting documents, 14 specific findings.\nROUTE: HCPC Fitness to Practise',
    worksWith: [
      { engine: 'Entity Resolution', slug: 'entity-resolution', description: 'Identifies who held what role and when, ensuring duty breaches attach to the right professional.' },
      { engine: 'Temporal Parser', slug: 'temporal-parser', description: 'Tracks when duties applied, when deadlines were breached, and establishes the chronological narrative for each complaint.' },
      { engine: 'Contradiction', slug: 'contradiction', description: 'Provides the inconsistencies that may constitute breaches of professional honesty, accuracy, and record-keeping duties.' },
      { engine: 'Argumentation', slug: 'argumentation', description: 'Identifies unsupported claims that breach evidence-based practice requirements.' },
      { engine: 'Bias Detection', slug: 'bias', description: 'Supplies the statistical evidence for impartiality breaches, turning pattern detection into quantified complaint evidence.' },
    ],
    useCases: [
      { title: 'Professional misconduct complaints', description: 'Building structured HCPC, GMC, or SRA complaints where each allegation is linked to a specific professional standard, supported by cited evidence.' },
      { title: 'Regulatory filings', description: 'Assembling Ofcom complaints (Broadcasting Code violations), ICO complaints (data protection breaches), or LGO complaints (maladministration) with evidence packages structured to each body\u2019s requirements.' },
      { title: 'Civil claims preparation', description: 'Organising findings into a litigation-ready format: duty of care established, breach identified with evidence, causation traced through the timeline, loss documented.' },
    ],
    technicalApproach: [
      'Statutory duty mapping maintains a structured database of professional codes, regulatory standards, and statutory obligations keyed to role and jurisdiction',
      'Actor-duty assignment cross-references resolved entities and their roles against applicable duty frameworks, tracking when duties commenced and ended',
      'Breach detection applies rule-based matching between engine findings and specific duty provisions, with confidence thresholds to filter noise',
      'Complaint template generation produces body-specific output formats: HCPC Fitness to Practise, Ofcom Broadcasting Code, ICO complaint framework, and LGO maladministration template',
    ],
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


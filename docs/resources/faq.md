# Frequently Asked Questions

Common questions about S.A.M. methodology and the Phronesis platform.

---

## General Questions

### What is S.A.M.?

S.A.M. (Systematic Adversarial Methodology) is a principled framework for forensic analysis of institutional document chains. It identifies how false premises propagate through institutional systems, accumulate spurious authority, and contribute to harmful outcomes.

### What does "adversarial" mean in this context?

"Adversarial" refers to systematic skepticism applied to institutional claims. Rather than accepting claims at face value due to institutional authority, S.A.M. treats all claims as requiring evidential justification. This adversarial stance is methodological, not personal - the goal is institutional accountability, not individual blame.

### Who should use Phronesis/S.A.M.?

- **Legal professionals**: Defense attorneys, civil rights lawyers, appellate advocates
- **Investigative journalists**: Reporters investigating institutional failures
- **Researchers**: Academics studying institutional epistemology and accountability
- **Oversight professionals**: Internal affairs investigators, inspectors general
- **Advocates**: Organizations working on wrongful convictions, child welfare reform, medical safety

### What types of cases is S.A.M. appropriate for?

S.A.M. is designed for cases involving:
- Suspected institutional failure or wrongful outcomes
- Complex document chains across multiple institutions
- Questions about how claims gained institutional acceptance
- Need for systematic, replicable analysis
- Potential for expert witness testimony or publication

S.A.M. is NOT appropriate for:
- Cases with minimal documentation
- Real-time decision support (S.A.M. is retrospective)
- Purely normative disputes (policy disagreements, value conflicts)
- Routine case management

### Is S.A.M. admissible in court?

S.A.M. is designed to meet Daubert standards for expert testimony admissibility:
- Based on established theory (social epistemology, institutional analysis)
- Uses systematic, replicable methodology
- Capable of validation and falsification
- Published and peer-reviewed (methodology paper)
- Appropriate error rates can be established

However, admissibility is determined by judges on case-by-case basis. Consult with legal experts about specific jurisdictions and contexts.

### How long does a S.A.M. analysis take?

Highly variable depending on:
- Document volume (pages, number of documents)
- Case complexity (number of institutions, claims, actors)
- Depth of analysis required
- Availability of complete document sets

Rough estimates:
- **Small case** (20-50 documents): 1-2 weeks
- **Medium case** (50-200 documents): 2-4 weeks
- **Large case** (200-1000+ documents): 1-3 months
- **Major institutional failure** (thousands of documents): 3-6+ months

AI-assisted analysis through Phronesis significantly accelerates timeline compared to manual analysis.

---

## Methodology Questions

### How is S.A.M. different from traditional document review?

Traditional review often:
- Follows chronological order (privileging early claims)
- Accepts institutional authority at face value
- Seeks narrative coherence (filtering contradictions)
- Lacks systematic verification tracking

S.A.M. explicitly:
- Traces claims backward to origin (evidential quality assessment)
- Distinguishes authority from evidence
- Systematically identifies contradictions
- Tracks verification status across propagation chains

### What are the four phases of S.A.M.?

1. **ANCHOR**: Identify where claims first entered the institutional record and assess initial evidential basis
2. **INHERIT**: Track how claims propagated across documents and institutions without verification
3. **COMPOUND**: Map how claims accumulated institutional authority through repetition and endorsement
4. **ARRIVE**: Trace connections from false premises to harmful outcomes through but-for causation analysis

### What are the eight contradiction types?

1. **SELF**: Internal contradictions within single document
2. **INTER_DOC**: Contradictions between documents
3. **TEMPORAL**: Timeline impossibilities and date inconsistencies
4. **EVIDENTIARY**: Conclusions not supported by cited evidence
5. **MODALITY_SHIFT**: Unjustified certainty changes
6. **SELECTIVE_CITATION**: Cherry-picked references
7. **SCOPE_SHIFT**: Unexplained generalizations
8. **UNEXPLAINED_CHANGE**: Position reversals without justification

### What is "authority laundering"?

Authority laundering occurs when a weakly-founded claim gains credibility through institutional processing:
1. Speculation enters record (low authority)
2. Adopted by professional (medium authority)
3. Cited in official report (high authority)
4. Becomes basis for court finding (highest authority)

At each step, actors may reasonably assume prior verification occurred. If no verification happened at any step, the final high-authority determination rests on original speculation.

### How do you determine evidential quality scores?

Evidential quality (0.0-1.0) is assessed based on:
- **Source credibility**: First-hand observation > hearsay
- **Evidence type**: Physical > testimonial; contemporaneous > retrospective
- **Corroboration**: Independent corroboration increases quality
- **Citation trail**: Does evidence actually support the claim?

Scores reflect evidential basis at claim origin, not institutional weight assigned to it.

### What counts as a "false premise"?

A claim that:
1. Entered the institutional record without adequate evidential foundation, OR
2. Contradicts available evidence

Formally: evidential quality score < 0.3 (threshold may vary by context)

False premises are not necessarily lies - often they are speculation, hearsay, or inference that was presented or later treated as established fact.

### How do you handle legitimate uncertainty?

S.A.M. distinguishes between:
- **Acknowledged uncertainty**: Claims appropriately hedged ("may have," "possibly") - not false premises
- **Suppressed uncertainty**: Claims presented with unjustified certainty - potential false premises
- **Genuine epistemic uncertainty**: Cases where evidence is ambiguous and experts reasonably disagree - not resolvable by S.A.M.

S.A.M. identifies when institutional certainty exceeds evidential warrant, not when humans face irreducible uncertainty.

### Can S.A.M. determine ground truth?

No. S.A.M. does NOT determine what actually happened. S.A.M. analyzes the relationship between:
- What institutional documents claim happened
- What evidence actually supports those claims
- How claims propagated and gained authority

S.A.M. identifies gaps between institutional certainty and evidential foundation. It cannot resolve genuine factual disputes where evidence is ambiguous.

---

## Platform Questions

### What is Phronesis?

Phronesis is a desktop application implementing S.A.M. methodology. It provides:
- Document processing (PDF extraction, OCR)
- 11 specialized analysis engines
- AI-assisted claim extraction and contradiction detection
- Propagation network visualization
- Court-ready report generation

### Why desktop rather than web application?

**Confidentiality**: Legal and investigative documents often contain sensitive information. Desktop/local-first architecture means:
- Documents never leave your device
- No cloud storage of case materials
- Complete control over data
- Compliance with professional confidentiality obligations

### What AI models does Phronesis use?

Phronesis supports multiple AI providers:
- **Claude (Anthropic)**: Primary recommendation for reasoning tasks
- **Groq**: Fast inference for high-volume processing
- **Gemini (Google)**: Alternative provider

Users supply their own API keys. Phronesis is provider-agnostic.

### Does Phronesis send my documents to AI providers?

Yes, for AI-assisted analysis. Document chunks are sent to selected AI provider for analysis (claim extraction, contradiction detection, etc.).

**Important considerations**:
- Review AI provider terms of service regarding data use
- Claude (Anthropic) and Gemini (Google) have enterprise options with data processing agreements
- For highly sensitive cases, consider using local models or manual analysis
- Always redact PII before analysis where possible
- Consult with legal/ethics counsel about client confidentiality obligations

### Can I use Phronesis offline?

Partially:
- Document loading and organization: Yes (fully offline)
- Manual annotation: Yes (fully offline)
- AI-assisted analysis: No (requires API calls to AI providers)
- Report generation: Yes (offline after analysis complete)

Future versions may support local LLM integration for fully offline operation.

### What file formats does Phronesis support?

Currently:
- **PDF**: Native text and image-based (with OCR)
- **Text files**: .txt, .md
- **Export formats**: PDF, DOCX, JSON

Planned:
- Word documents (.docx, .doc)
- Email archives (.mbox, .pst)
- Audio transcripts

### How much does Phronesis cost?

Phronesis is currently in development. Pricing model TBD.

Expected approach:
- **Community edition**: Free, open-source
- **Professional edition**: Paid, with enhanced features and support
- **Enterprise edition**: Custom licensing for organizations

AI API costs are separate (user pays provider directly).

---

## Technical Questions

### What are the system requirements?

**Minimum**:
- OS: Windows 10+, macOS 11+, or Linux (Ubuntu 20.04+)
- RAM: 8GB
- Storage: 5GB for application + space for document corpus
- Internet: Required for AI-assisted analysis

**Recommended**:
- RAM: 16GB+
- Storage: SSD for performance
- CPU: Multi-core for parallel processing

### How do I install Phronesis?

See [Getting Started Guide](../guides/getting-started.md) for detailed installation instructions.

Quick start:
1. Download installer for your platform
2. Run installer
3. Configure AI provider API keys
4. Create first case

### Can I customize the analysis engines?

Advanced users can:
- Adjust engine parameters (thresholds, weights)
- Create custom prompts for AI analysis
- Extend with custom engines (requires Rust/TypeScript development)

See [Technical Documentation](../technical/) for details.

### How is data stored?

- **Local SQLite database**: Structured data (claims, propagations, authority markers)
- **File storage**: Original documents, extracted text
- **No cloud storage**: Everything stays on your device

### Can I export my analysis?

Yes, multiple formats:
- **PDF**: Court-ready reports with citation links
- **DOCX**: Editable reports with tracked citations
- **JSON**: Programmatic access to all analysis data
- **Audit trail**: Complete evidence chain for replication

### Can multiple analysts work on the same case?

Current version: No (single-user, local-first architecture)

Future versions will support:
- Export/import of case files for sharing
- Merge capabilities for collaborative analysis
- Optional cloud sync for teams (with appropriate security)

---

## Validation Questions

### Has S.A.M. been validated?

S.A.M. is an emerging methodology. Validation is ongoing:

**Theoretical foundations**: Grounded in established fields (social epistemology, institutional theory, cognitive science)

**Construct validity**: Methodology paper provides formal definitions and detection criteria for all constructs

**Empirical validation**: Currently needed:
- Large-scale inter-rater reliability studies
- Sensitivity/specificity analysis on ground truth datasets
- Predictive validation (do S.A.M. findings predict institutional corrections?)

See [Validation Studies](../research/validation-studies.md) for detailed framework and planned studies.

### How reliable is AI-assisted analysis?

AI assistance accelerates analysis but requires human oversight:

**Strengths**:
- Semantic understanding across paraphrases
- Pattern recognition at scale
- Consistent application of criteria

**Limitations**:
- May hallucinate (generate unsupported content)
- Can reproduce biases in training data
- Lacks true understanding of institutional context
- Inconsistent across runs

**Mitigation**:
- Structured outputs (JSON schemas)
- Multi-pass analysis for cross-checking
- Human review of all AI findings
- Source grounding (require citations)
- Adversarial prompting (explicit skepticism instructions)

### What are the error rates?

Unknown at present. Establishing error rates requires:
1. Ground truth dataset (known cases with documented failures)
2. Systematic application of S.A.M. to dataset
3. Calculation of false positive and false negative rates
4. ROC analysis to optimize thresholds

This is priority for empirical validation. Current approach: Conservative thresholds (high specificity) to minimize false positives at cost of some false negatives.

### How do I verify S.A.M. findings?

All S.A.M. findings include:
- **Source citations**: Specific document, page, quote
- **Evidence chains**: Complete trace from claim to origin
- **Reasoning transparency**: Why classification was assigned
- **Alternative hypotheses**: Other possible explanations considered

Verification involves:
1. Checking source citations (is quote accurate and in context?)
2. Reviewing reasoning (is inference warranted?)
3. Considering alternatives (are there other explanations?)
4. Independent review by another analyst

### Can S.A.M. results be replicated?

Yes, if:
- **Complete document corpus**: All documents used are available
- **Methodology specification**: Analysis parameters documented
- **Audit trail**: Complete record of analytical steps

Phronesis generates audit trails enabling replication. Note: AI-assisted analysis may vary slightly across runs (LLM non-determinism), but overall findings should be stable.

---

## Ethical and Legal Questions

### Is it ethical to apply adversarial skepticism to institutional decisions?

S.A.M. is designed for **failure analysis**, not routine review. Adversarial skepticism is appropriate when:
- Harmful outcomes have occurred
- Questions exist about decision quality
- Accountability analysis is needed
- Systematic review may prevent future harm

S.A.M. is NOT intended to:
- Delegitimize all institutional decision-making
- Undermine good-faith professional judgment
- Second-guess reasonable decisions under uncertainty
- Create adversarial relationships where collaborative review would suffice

### Does S.A.M. blame individuals?

No. S.A.M. focuses on **systemic patterns**, not individual culpability:
- Identifies structural factors enabling false premise propagation
- Analyzes institutional incentives and constraints
- Recognizes that individual actors often operate in good faith within flawed systems

Individual professional conduct may be relevant, but S.A.M. goal is systemic understanding and reform, not personal blame.

### What about privacy and confidentiality?

Critical considerations:

**Legal documents**: Often subject to confidentiality rules (attorney-client privilege, attorney work product, protective orders). Consult legal ethics counsel.

**Medical records**: Subject to HIPAA (U.S.) or equivalent. Ensure appropriate authorization or anonymization.

**Child protection records**: Often legally confidential. Ensure compliance with relevant laws.

**Publication**: All case studies must be properly redacted to protect privacy. See [Redaction Guidelines](../case-studies/redaction-guidelines.md).

**General principle**: When in doubt, err on the side of privacy protection.

### Can S.A.M. be used against vulnerable populations?

S.A.M. is designed to hold powerful institutions accountable, not to scrutinize individuals subject to institutional power.

**Appropriate**: Analyzing how child protection agency handled case, how prosecutor built case, how hospital documented treatment

**Inappropriate**: Scrutinizing parent's statements for contradictions, analyzing defendant's testimony adversarially, treating patient reports with default skepticism

Ensure S.A.M. is applied consistent with its intended purpose: institutional accountability, not further marginalization of vulnerable populations.

### What if S.A.M. reveals attorney mistakes in my own case?

Complex issue requiring consultation with legal ethics counsel. General considerations:

- **Duty to client**: May require disclosure if error affected outcome
- **Professional responsibility**: Attorney obligations regarding errors
- **Privilege**: Self-critical analysis may be privileged
- **Remedies**: Potential for post-conviction relief, malpractice claims

No universal answer - context-specific and jurisdiction-dependent.

---

## Practical Application Questions

### Where do I start with a new case?

1. **Assemble documents**: Collect complete document set
2. **Organize chronologically**: Sort by creation date
3. **Identify key claims**: What are the critical factual determinations?
4. **Run ANCHOR phase**: Where did key claims originate?
5. **Run INHERIT phase**: How did claims propagate?
6. **Run COMPOUND phase**: What authority did claims accumulate?
7. **Run ARRIVE phase**: How did false premises contribute to outcome?

See [Analysis Workflow](../guides/analysis-workflow.md) for detailed step-by-step guide.

### What if I don't have all the documents?

Common issue in real cases. Strategies:

**Identify gaps**: What documents should exist but are missing?
**Document the gap**: Note in analysis that document set is incomplete
**Request production**: Discovery requests, FOIA, subpoenas
**Adverse inference**: Missing documents may support inference of unfavorable content
**Qualify conclusions**: Findings are based on available documents; additional documents could change analysis

Incomplete document sets don't prevent analysis, but findings must be qualified accordingly.

### How do I handle privileged documents?

**Option 1**: Exclude from analysis (safest for privilege)
**Option 2**: Include but don't disclose in reports (use as context)
**Option 3**: Seek waiver of privilege to enable full analysis

Consult legal counsel about specific privileges and jurisdictions.

### Can I use S.A.M. for cases still in litigation?

Yes, but consider:

**Work product**: Analysis may be discoverable depending on who conducts it and why
**Strategic timing**: When to deploy S.A.M. analysis in litigation strategy
**Expert designation**: If analyst will testify, disclosure requirements apply
**Privilege**: Attorney-client communications about analysis

Coordinate with legal team about strategic use.

### How do I present S.A.M. findings to non-technical audiences?

**For courts**:
- Focus on methodology transparency
- Provide clear definitions and criteria
- Use visual aids (propagation networks, timelines)
- Explain each finding with source citations
- Anticipate Daubert challenges

**For clients**:
- Executive summary with key findings
- Visual representations (graphs, timelines)
- Concrete examples before abstract theory
- Practical implications (what does this mean for the case?)

**For media**:
- Compelling narrative arc
- Concrete examples and case studies
- Human impact (not just methodology)
- Avoid jargon
- Prepare for fact-checking

### What if S.A.M. finds no significant issues?

Possible outcomes:
1. **No false premises detected**: Institutional claims were well-founded
2. **False premises exist but didn't contribute to outcome**: Harmless error
3. **Incomplete analysis**: Need more documents or different analytical approach
4. **Wrong tool**: Case doesn't involve institutional failure S.A.M. is designed to detect

Null findings are valuable - they rule out certain failure modes and may support institutional decision quality.

### How do I handle cases where I disagree with S.A.M. output?

S.A.M. is a tool, not an oracle. If you disagree:

1. **Review source citations**: Are they accurate and in context?
2. **Check reasoning**: Is the inference warranted?
3. **Consider alternatives**: Are there other explanations?
4. **Adjust parameters**: Maybe thresholds need tuning for this case
5. **Manual override**: You can override AI classifications
6. **Document disagreement**: Note in analysis why you disagreed and what you concluded instead

Human judgment is essential. AI assistance accelerates analysis but doesn't replace expertise.

---

## Future Directions

### What features are planned for future versions?

**Short-term**:
- Additional export formats
- Enhanced visualization (interactive graphs)
- Template libraries for common case types
- Collaboration features (case sharing, merge)

**Medium-term**:
- Local LLM support (offline operation)
- Email archive processing
- Audio/video transcript analysis
- Multi-lingual support

**Long-term**:
- Real-time monitoring (prospective S.A.M.)
- Integration with legal research platforms
- Regulatory compliance modules
- Training/certification programs

### Will S.A.M. be extended to other domains?

Currently focused on legal, medical, child protection, and investigative contexts. Potential extensions:

**Corporate governance**: Board decisions, compliance failures
**Academic misconduct**: Research fraud, plagiarism investigation
**Regulatory enforcement**: Agency decision-making
**Historical research**: Analyzing historical document chains
**Journalism**: Source verification and fact-checking

Methodology is domain-agnostic, but validation and tooling need domain-specific development.

### How can I contribute to S.A.M. development?

**Research**:
- Validation studies
- Theoretical extensions
- Empirical applications
- Publications and peer review

**Software**:
- Code contributions (GitHub)
- Bug reports
- Feature requests
- Documentation improvements

**Case studies**:
- Apply S.A.M. to real cases (properly redacted)
- Share lessons learned
- Contribute to validation datasets

**Community**:
- Participate in discussions
- Share expertise
- Provide feedback
- Spread awareness

See project GitHub and community forums for how to get involved.

---

## Support

### Where do I get help?

**Documentation**: Start with [Getting Started Guide](../guides/getting-started.md) and relevant sections of this documentation

**GitHub Issues**: Report bugs, request features, ask technical questions

**GitHub Discussions**: Community Q&A, share experiences, methodological discussions

**Professional support**: Contact for consulting, training, expert witness services (when available)

### How do I report a bug?

1. Check if issue already reported (GitHub Issues)
2. Provide minimal reproducible example if possible
3. Include:
   - Platform/OS version
   - Phronesis version
   - Steps to reproduce
   - Expected vs. actual behavior
   - Relevant logs/screenshots
4. For security issues, use responsible disclosure (security@apatheia.dev when established)

### How do I request a feature?

1. Check if already requested (GitHub Issues)
2. Describe:
   - Use case (what problem does it solve?)
   - Proposed solution (how should it work?)
   - Alternatives considered
   - Importance/priority
3. Be prepared to discuss tradeoffs and implementation challenges

### Is training available?

Planned offerings:
- **Documentation**: Self-paced learning (current)
- **Video tutorials**: Screencasts and walkthroughs (in development)
- **Workshops**: In-person or virtual training (future)
- **Certification**: Formal S.A.M. analyst certification (future)
- **Consultation**: Case-specific guidance (available on request)

---

## Citation and Attribution

### How do I cite Phronesis or S.A.M.?

**Software**:
```
Phronesis: A Systematic Adversarial Methodology for Institutional Accountability Analysis
Apatheia Labs (2025)
https://github.com/apatheia-labs/phronesis
```

**Methodology paper**:
```
Systematic Adversarial Methodology (S.A.M.): A Framework for Forensic Analysis of Institutional Document Chains
[Author list when published]
[Journal/Conference when published]
```

### Can I use S.A.M. for commercial purposes?

License terms TBD. Expected approach:
- **Methodology**: Free to use, cite appropriately
- **Software**: Open-source community edition; commercial edition for organizations
- **Trademark**: "S.A.M." and "Phronesis" are trademarks of Apatheia Labs

### Can I teach S.A.M. methodology?

Yes, with appropriate attribution. Welcome uses:
- Academic courses
- Professional training
- Workshops and seminars
- Publications and presentations

Please cite methodology paper and acknowledge Apatheia Labs.

---

Last updated: 2025-01-16

# Plan: Website Evaluation and Improvement

**Date**: 2026-01-21
**Research**: Validated 2026-01-21
**Complexity**: Complex

## Implementation Summary

Focus on high-impact, low-risk improvements: add missing download section, consolidate research hub CSS into shared stylesheet, streamline page length by combining redundant sections, and improve hero messaging. Preserve existing patterns and avoid breaking changes.

---

## Steps

### Step 1: Add Download Section to index.html
**File**: `index.html`
**Purpose**: The `#download` anchor exists but has no target section. Add a proper download section before the waitlist.

**Change**: Add new section after CTA, before Waitlist:
```html
<!-- Download Section -->
<section class="download" id="download">
  <div class="container">
    <div class="section-header">
      <p class="section-label">Get Started</p>
      <h2 class="section-title">Download Phronesis</h2>
      <p class="section-description">
        Free, open source, runs entirely on your machine. No account required.
      </p>
    </div>
    <div class="download-grid">
      <div class="download-card primary">
        <div class="download-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18"/>
          </svg>
        </div>
        <h3>Windows</h3>
        <p>Windows 10/11 (64-bit)</p>
        <a href="https://github.com/apatheia-labs/phronesis/releases/latest" class="btn btn-primary btn-large" target="_blank" rel="noopener">
          Download Latest
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
        </a>
        <span class="download-note">~80MB • Portable, no installer</span>
      </div>
      <div class="download-card">
        <div class="download-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>
          </svg>
        </div>
        <h3>Build from Source</h3>
        <p>Clone, build, contribute</p>
        <a href="https://github.com/apatheia-labs/phronesis" class="btn btn-secondary" target="_blank" rel="noopener">
          View on GitHub
        </a>
        <span class="download-note">Requires Node.js 18+ and Rust</span>
      </div>
    </div>
    <div class="download-requirements">
      <h4>System Requirements</h4>
      <ul>
        <li>Windows 10 version 1903 or later (64-bit)</li>
        <li>4GB RAM minimum, 8GB recommended</li>
        <li>500MB disk space</li>
        <li>Optional: API keys for AI features (Claude, Groq, Gemini)</li>
      </ul>
    </div>
  </div>
</section>
```

**Test**: Click "Download" in nav → scrolls to download section
**Rollback**: `git checkout -- index.html`

---

### Step 2: Add Download Section Styles
**File**: `styles.css`
**Purpose**: Style the new download section

**Change**: Add after `.cta-note` styles (~line 1740):
```css
/* Download Section */
.download {
  background: var(--charcoal-900);
  border-top: 1px solid var(--charcoal-700);
}

.download-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto 48px;
}

@media (max-width: 768px) {
  .download-grid {
    grid-template-columns: 1fr;
  }
}

.download-card {
  background: linear-gradient(135deg, var(--charcoal-800), var(--charcoal-900));
  border: 1px solid var(--charcoal-700);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
}

.download-card.primary {
  border-color: rgba(184, 134, 11, 0.4);
  background: linear-gradient(135deg, rgba(103, 69, 20, 0.15), var(--charcoal-900));
}

.download-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--charcoal-700);
  border-radius: 14px;
  margin: 0 auto 20px;
}

.download-icon svg {
  width: 28px;
  height: 28px;
  stroke: var(--bronze-500);
}

.download-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.download-card > p {
  font-size: 14px;
  color: var(--charcoal-400);
  margin-bottom: 20px;
}

.download-card .btn {
  width: 100%;
  justify-content: center;
}

.download-note {
  display: block;
  margin-top: 12px;
  font-size: 12px;
  color: var(--charcoal-500);
}

.download-requirements {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: var(--charcoal-800);
  border-radius: 12px;
  border: 1px solid var(--charcoal-700);
}

.download-requirements h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--charcoal-200);
}

.download-requirements ul {
  list-style: none;
  display: grid;
  gap: 8px;
}

.download-requirements li {
  font-size: 13px;
  color: var(--charcoal-400);
  padding-left: 20px;
  position: relative;
}

.download-requirements li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--bronze-500);
}
```

**Test**: Download section renders correctly at all breakpoints
**Rollback**: `git checkout -- styles.css`

---

### Step 3: Extract Research Hub CSS to Shared Stylesheet
**File**: `research/article.css` (extend) + `research/index.html`
**Purpose**: Eliminate 580 lines of duplicate CSS in research/index.html

**Change Part A**: Create `research/shared.css` with research hub specific styles extracted from `research/index.html` (lines 20-580). This is the inline `<style>` block.

**Change Part B**: Update `research/index.html` to use external stylesheets:
```html
<!-- Replace inline <style> block with: -->
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/research/shared.css">
```

**Test**: Research hub renders identically before/after
**Rollback**: `git checkout -- research/index.html`

---

### Step 4: Improve Hero Headline
**File**: `index.html`
**Purpose**: Lead with benefit, not product name

**Change**: Update hero section (~lines 100-106):
```html
<!-- FROM -->
<h1><span>Phronesis</span><br>by Apatheia Labs</h1>
<p class="hero-tagline">Forensic document analysis for evidence-based investigations.</p>

<!-- TO -->
<h1>Find the <span>contradictions</span> they missed.</h1>
<p class="hero-tagline">Phronesis — Free forensic document analysis for investigators who demand evidence.</p>
```

**Test**: Visual check - headline communicates value before product name
**Rollback**: `git checkout -- index.html`

---

### Step 5: Combine/Streamline Sections
**File**: `index.html`
**Purpose**: Reduce page length by combining redundant content

**Changes**:

A. **Remove Stats section** (it's weak - just "Open Source", "Privacy First", "Built by Practitioners" with no numbers). The About section already conveys this.

B. **Combine Research and Documentation sections** into single "Resources" section with tabs or unified grid.

C. **Trim Roadmap** to show only 6 items (next 2 quarters) with "View full roadmap" link.

**Test**: Page loads faster, less scrolling to reach CTAs
**Rollback**: `git checkout -- index.html`

---

### Step 6: Add Mobile Hero Visual
**File**: `styles.css`
**Purpose**: Show simplified version of hero card on mobile instead of hiding entirely

**Change**: Update mobile styles (~line 387-391):
```css
/* FROM */
@media (max-width: 968px) {
  .hero-visual {
    display: none;
  }
}

/* TO */
@media (max-width: 968px) {
  .hero-visual {
    margin-top: 48px;
  }
  .hero-card {
    padding: 24px;
  }
  .finding-item:nth-child(n+3) {
    display: none; /* Show only 2 findings on mobile */
  }
}
```

**Test**: Hero card visible on mobile with 2 findings
**Rollback**: `git checkout -- styles.css`

---

### Step 7: Simplify Navigation
**File**: `index.html`
**Purpose**: Reduce cognitive load - 9 items is too many

**Change**: Reduce nav to 5-6 essential items:
```html
<nav>
  <a href="#about">About</a>
  <a href="#methodology">Methodology</a>
  <a href="/research/">Research</a>
  <a href="https://github.com/apatheia-labs/phronesis" target="_blank">GitHub</a>
  <a href="#download" class="btn btn-primary">Download</a>
</nav>
```

Move Engines, Use Cases, Documentation, Roadmap, Waitlist to footer or page sections only.

**Test**: Nav fits cleanly, primary action stands out
**Rollback**: `git checkout -- index.html`

---

## Integration Test

After all steps:
1. Run `npm run build` to regenerate research articles
2. Open `index.html` in browser
3. Test all anchor links (#about, #methodology, #download, etc.)
4. Test research hub loads with external CSS
5. Test at mobile breakpoints (375px, 768px, 968px)
6. Verify Lighthouse score maintained or improved

## Rollback Plan

Full rollback:
```bash
git checkout -- index.html styles.css research/index.html
rm research/shared.css  # if created
```

Partial rollback - each step is independent, can revert individual files.

---

## Implementation Order

| Order | Step | Risk | Dependencies |
|-------|------|------|--------------|
| 1 | Step 2 (CSS) | Low | None |
| 2 | Step 1 (Download HTML) | Low | Step 2 |
| 3 | Step 4 (Hero) | Low | None |
| 4 | Step 6 (Mobile hero) | Low | None |
| 5 | Step 7 (Nav) | Medium | None |
| 6 | Step 5 (Streamline) | Medium | None |
| 7 | Step 3 (Research CSS) | Medium | Build system |

---
**Status**: Ready for Validation

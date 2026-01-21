# Research: Website Evaluation and Improvement

**Date**: 2026-01-21
**Task**: Evaluate and improve the Apatheia Labs website
**Complexity**: Complex (10+ files, multi-domain concerns)

## Task Understanding

Evaluate the Apatheia Labs website for usability, messaging clarity, visual design, conversion optimization, mobile experience, and technical quality. Identify improvement opportunities across all areas.

## Current Site Assessment

### Architecture Summary
| Component | Technology |
|-----------|------------|
| Build System | Custom Node.js (build.js) |
| Styling | Plain CSS (~2300 lines in styles.css) |
| JavaScript | Vanilla JS (~1400 lines in app.js) |
| Content | 200+ markdown research articles |
| Hosting | Static HTML (GitHub Pages compatible) |

### Site Structure
```
/ (index.html) - Main landing page
/research/ - Research hub
/research/{category}/{article}/ - Individual articles
```

---

## Evaluation Areas

### 1. MESSAGING & VALUE PROPOSITION

**Current State:**
- Hero headline: "Phronesis by Apatheia Labs" with tagline "Forensic document analysis for evidence-based investigations"
- Clear "Free & Local-First" badge
- Good problem articulation in "Why Institutions Fail Without Accountability" section
- Comparison section effectively contrasts enterprise tools ($150K+) vs free Phronesis

**Issues Identified:**
| Issue | Severity | Notes |
|-------|----------|-------|
| Hero headline is product name, not benefit | Medium | Visitors see "Phronesis" before understanding what it does |
| "Forensic document analysis" may be unclear to non-technical users | Medium | Could be more accessible language |
| Target audience mentioned late (line 188-189) | Low | "journalists, researchers, legal professionals" buried in About |
| No social proof metrics | Medium | No download counts, testimonials, or case studies |

**Strengths:**
- "Why I Built This" section establishes authenticity (solo dev, open source)
- Cost comparison is compelling
- Problem statement resonates with target audience

---

### 2. VISUAL DESIGN

**Current State:**
- Dark theme with bronze accents (no blue per preferences)
- Clean, professional aesthetic
- Good use of CSS custom properties
- Card-based UI with subtle hover animations

**Issues Identified:**
| Issue | Severity | Notes |
|-------|----------|-------|
| Hero visual card hidden on mobile | Medium | `.hero-visual { display: none }` at 968px |
| Very long page (multiple full-height sections) | Low | May cause fatigue |
| No visual differentiation between sections | Low | All dark charcoal |
| Modal system has lots of content but hard to discover | Medium | Users must click cards to see 1,162 content entries |

**Strengths:**
- Consistent color system
- Good typography hierarchy (Inter, Playfair Display, JetBrains Mono)
- Subtle grid background in hero adds depth
- Status colors well-designed (critical red, high bronze, success green)

---

### 3. NAVIGATION & DISCOVERY

**Current State:**
- Fixed header with 9 nav items + Download button
- Anchor links for page sections
- Research hub as separate page
- Mobile hamburger menu

**Issues Identified:**
| Issue | Severity | Notes |
|-------|----------|-------|
| Too many nav items (9+) | Medium | Cognitive overload, especially on mobile |
| No clear primary CTA distinction in nav | Low | Download and other links visually similar |
| Research hub duplicates inline CSS | Medium | Not using shared styles.css |
| No breadcrumbs or secondary navigation | Low | Research articles orphaned |

**Strengths:**
- Fixed header provides persistent access
- Mobile menu exists and works
- Active state styling on research page

---

### 4. CONTENT ARCHITECTURE

**Current State:**
- Main page sections: Hero → About → Problem → Comparison → Methodology (S.A.M.) → CASCADE → Engines → Use Cases → Roadmap → Stats → Research → Documentation → CTA → Waitlist
- 14+ major sections
- Research hub well-organized with 6 methodologies, 12 domains, 2 matrices

**Issues Identified:**
| Issue | Severity | Notes |
|-------|----------|-------|
| Page length is excessive | High | Too much scrolling before conversion points |
| Stats section weak (just "Open Source", "Privacy First", "Built by Practitioners") | Medium | No actual numbers |
| Documentation section links appear broken | Medium | Would need testing |
| Roadmap section very long with 12+ cards | Medium | Overwhelming |

**Strengths:**
- Clear section labels and headers
- Good content hierarchy within sections
- Research hub well-structured

---

### 5. CONVERSION OPTIMIZATION

**Current State:**
- Multiple CTAs: Download, Waitlist, GitHub, How It Works
- Waitlist form at bottom of page
- Download anchors but no actual download section visible in read portion

**Issues Identified:**
| Issue | Severity | Notes |
|-------|----------|-------|
| Primary CTA (Download) anchor target unclear | High | No `#download` section visible |
| Waitlist buried at very bottom | Medium | After 14 sections |
| No pricing clarity | Low | "Free" mentioned but AI costs ($5-20/mo) buried |
| No clear "getting started" path | Medium | Users may not know what to do after download |

**Strengths:**
- Free pricing is prominent
- Multiple conversion points exist
- Waitlist has good form UX

---

### 6. MOBILE EXPERIENCE

**Current State:**
- Responsive breakpoints at 968px, 868px, 768px, 640px, 568px
- Mobile menu toggle
- Grid columns collapse appropriately

**Issues Identified:**
| Issue | Severity | Notes |
|-------|----------|-------|
| Hero visual completely hidden on mobile | Medium | Loses engaging demo card |
| Mobile modal slides from bottom | Low | Good pattern but could be optimized |
| Nav menu doesn't close on scroll | Low | Minor UX issue |
| Touch targets may be small for some elements | Low | Needs testing |

**Strengths:**
- Good responsive grid patterns
- Mobile-first considerations in many places
- Touch-friendly button sizes for primary CTAs

---

### 7. TECHNICAL QUALITY

**Current State:**
- Clean HTML5 structure
- Good SEO (meta tags, Open Graph, JSON-LD schema)
- Plausible analytics (privacy-focused)
- Font preloading

**Issues Identified:**
| Issue | Severity | Notes |
|-------|----------|-------|
| CSS preload with JS fallback may flash | Low | `onload="this.onload=null;this.rel='stylesheet'"` pattern |
| No favicon in multiple formats | Low | Only .ico |
| Research hub duplicates all CSS inline | High | 580 lines duplicated, maintenance nightmare |
| app.js is 1,400 lines in single file | Medium | Could be modular |
| No service worker or PWA features | Low | Could improve offline/caching |

**Strengths:**
- Good meta tags and SEO structure
- Schema.org markup
- Privacy-focused analytics
- Font optimization

---

### 8. CONTENT GAPS

**Issues Identified:**
| Gap | Severity | Notes |
|-----|----------|-------|
| No actual download section | High | #download anchor has no target |
| No getting started guide | Medium | After download, what next? |
| No screenshots/demo | Medium | Only stylized card in hero |
| No testimonials/case studies | Medium | No social proof |
| No changelog/version info | Low | Users don't know what version they'd get |
| Contact info sparse | Low | Just email in footer |

---

## Files to Modify

| File | Lines | Purpose |
|------|-------|---------|
| index.html | ~800 | Main page content, structure, CTAs |
| styles.css | ~2300 | Visual improvements, section refinements |
| app.js | ~1400 | Potential modularization, new features |
| research/index.html | ~990 | Consolidate CSS, improve consistency |
| templates/article.html | TBD | Breadcrumbs, navigation improvements |
| templates/partials/header.html | TBD | Shared header for research pages |
| templates/partials/footer.html | TBD | Shared footer |
| build.js | ~200 | Any build improvements |

## Existing Patterns

### Pattern: CSS Custom Properties
Location: `styles.css:1-22`
```css
:root {
  --bronze-400: #e3aa3f;
  --bronze-500: #d4a017;
  /* ... */
}
```
Use this pattern for any new colors/values.

### Pattern: Section Structure
Location: `index.html:168-260`
```html
<section class="about" id="about">
  <div class="container">
    <div class="section-header">
      <p class="section-label">Label</p>
      <h2 class="section-title">Title</h2>
      <p class="section-description">Description</p>
    </div>
    <!-- content -->
  </div>
</section>
```
Use this pattern for any new sections.

### Pattern: Card Component
Location: `styles.css:380-404`
```css
.card {
  background: linear-gradient(135deg, var(--charcoal-800), var(--charcoal-900));
  border: 1px solid var(--charcoal-700);
  border-radius: 16px;
  padding: 28px;
  transition: transform 0.3s, border-color 0.3s;
}
```

## Dependencies
- Google Fonts (Inter, Playfair Display, JetBrains Mono)
- Plausible Analytics
- Build dependencies: glob, gray-matter, marked

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking existing layout | Medium | Test all breakpoints after changes |
| SEO regression | Low | Preserve meta tags and structure |
| Research hub CSS divergence | High | Extract to shared stylesheet |
| Modal content loss | Low | Preserve app.js content definitions |

## Improvement Priority Matrix

| Priority | Area | Impact | Effort |
|----------|------|--------|--------|
| P1 | Add actual download section | High | Low |
| P1 | Consolidate research hub CSS | High | Medium |
| P1 | Reduce page length (combine/remove sections) | High | Medium |
| P2 | Improve hero messaging | Medium | Low |
| P2 | Add social proof/metrics | Medium | Medium |
| P2 | Mobile hero visual | Medium | Medium |
| P3 | Nav simplification | Medium | Low |
| P3 | Add getting started guide | Medium | Medium |
| P3 | Code modularization | Low | High |

## Validation Checklist
- [x] All files identified
- [x] Patterns documented
- [x] Risks assessed
- [ ] Blocking questions resolved

## Open Questions

1. **Where does the download actually link?** Need to verify if there's a GitHub releases page or similar
2. **Waitlist backend?** Form action shows `YOUR_FORM_ID` placeholder - is this configured?
3. **Which sections are essential?** User input needed on what to cut vs keep
4. **Mobile visual priority?** Should hero card show simplified version on mobile?

---
**Status**: Ready for Validation

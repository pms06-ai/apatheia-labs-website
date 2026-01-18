# Website

Static marketing site and research library content.

## Structure
- landing/: static site output (HTML, assets, research pages)
- research/: research markdown sources
- docs/research/: foundations research markdown sources

## Build research pages
From repo root:

```bash
python scripts/build-research-pages.py
```

This generates HTML into `website/landing/research/`.

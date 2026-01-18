import re
import subprocess
from pathlib import Path
from typing import Optional


ROOT = Path(__file__).resolve().parents[1]
WEBSITE_DIR = ROOT / 'website'
REPO_URL = 'https://github.com/apatheia-labs/phronesis/blob/main'
RESEARCH_DIR = WEBSITE_DIR / 'research'
DOCS_RESEARCH_DIR = WEBSITE_DIR / 'docs' / 'research'
OUTPUT_DIR = WEBSITE_DIR / 'landing' / 'research'
TEMPLATE_PATH = ROOT / 'scripts' / 'templates' / 'research-page.html'
SOURCE_CONFIGS = [
    {'root': RESEARCH_DIR, 'prefix': '', 'label': ''},
    {'root': DOCS_RESEARCH_DIR, 'prefix': 'foundations', 'label': 'Foundations'},
]


def slugify(value: str) -> str:
    value = value.strip().lower().replace('_', '-')
    value = re.sub(r'[^a-z0-9\\-]+', '-', value)
    value = re.sub(r'-{2,}', '-', value)
    return value.strip('-') or 'page'


def extract_title(markdown: str, fallback: str) -> str:
    for line in markdown.splitlines():
        if line.startswith('# '):
            return line[2:].strip()
    return fallback


def extract_description(markdown: str) -> str:
    lines = markdown.splitlines()
    paragraph = []
    in_code = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        if stripped.startswith('#'):
            continue
        if stripped.startswith(('-', '*', '>')) or re.match(r'\\d+\\.', stripped):
            if paragraph:
                break
            continue
        if stripped == '':
            if paragraph:
                break
            continue
        paragraph.append(stripped)
    if not paragraph:
        return ''
    text = ' '.join(paragraph)
    text = re.sub(r'\\*\\*(.*?)\\*\\*', r'\\1', text)
    text = re.sub(r'\\[(.*?)\\]\\([^)]*\\)', r'\\1', text)
    text = re.sub(r'`([^`]*)`', r'\\1', text)
    return text.strip()


def find_source_config(md_path: Path) -> Optional[dict]:
    for config in SOURCE_CONFIGS:
        try:
            md_path.relative_to(config['root'])
            return config
        except ValueError:
            continue
    return None


def md_to_slug(md_path: Path) -> str:
    config = find_source_config(md_path)
    if not config:
        return slugify(md_path.stem)
    rel = md_path.relative_to(config['root'])
    name = rel.name.lower()
    prefix = config['prefix']
    if config['root'] == RESEARCH_DIR:
        if name == 'index.md':
            base = 'library'
        elif name == 'readme.md':
            if rel.parent == Path('.'):
                base = 'overview'
            else:
                base = '/'.join(slugify(part) for part in rel.parent.parts)
        else:
            stem = slugify(rel.stem)
            if rel.parent == Path('.'):
                base = stem
            else:
                base = '/'.join([*(slugify(part) for part in rel.parent.parts), stem])
    else:
        if name in ('index.md', 'readme.md'):
            rel_parts = rel.parent.parts
        else:
            rel_parts = (*rel.parent.parts, rel.stem)
        base_parts = [slugify(part) for part in rel_parts if part]
        base = '/'.join(base_parts) or 'page'
    if prefix:
        return '/'.join([prefix, base])
    return base


def md_to_url(md_path: Path) -> str:
    return f"/research/{md_to_slug(md_path)}/"


def replace_markdown_links(html: str, md_path: Path) -> str:
    def repl(match: re.Match) -> str:
        url = match.group(1)
        if url.startswith(('http://', 'https://', 'mailto:', '#')):
            return match.group(0)
        base, anchor = (url.split('#', 1) + [''])[:2]
        if base.endswith('.md'):
            target = (md_path.parent / base).resolve()
            if target.exists():
                config = find_source_config(target)
                if config:
                    new_url = md_to_url(target)
                    if anchor:
                        new_url = f"{new_url}#{anchor}"
                    return f'href="{new_url}"'
                if ROOT in target.parents:
                    rel_path = target.relative_to(ROOT).as_posix()
                    new_url = f"{REPO_URL}/{rel_path}"
                    if anchor:
                        new_url = f"{new_url}#{anchor}"
                    return f'href="{new_url}"'
        return match.group(0)

    return re.sub(r'href="([^"]+)"', repl, html)


def convert_markdown(md_path: Path, output_path: Path) -> None:
    markdown = md_path.read_text(encoding='utf-8')
    title = extract_title(markdown, md_path.stem.replace('-', ' ').title())
    description = extract_description(markdown)
    status = 'Planned' if 'Status: Planned' in markdown else 'Active'

    slug = md_to_slug(md_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        'pandoc',
        str(md_path),
        '--from', 'markdown',
        '--to', 'html',
        '--toc',
        '--toc-depth=3',
        '--shift-heading-level-by=1',
        '--template', str(TEMPLATE_PATH),
        '--metadata', f'title={title}',
        '--metadata', f'description={description}',
        '--metadata', f'slug={slug}',
        '--metadata', f'source_path={md_path.relative_to(ROOT).as_posix()}',
        '--metadata', f'breadcrumb={build_breadcrumb(md_path)}',
        '--metadata', f'status={status}',
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f'Pandoc failed for {md_path}')

    html = replace_markdown_links(result.stdout, md_path)
    output_path.write_text(html, encoding='utf-8')


def build_breadcrumb(md_path: Path) -> str:
    config = find_source_config(md_path)
    if not config:
        return 'Research'
    rel = md_path.relative_to(config['root'])
    parts = []
    if config['label']:
        parts.append(config['label'])
    if rel.name.lower() in ('index.md', 'readme.md'):
        rel_parts = rel.parent.parts
    else:
        rel_parts = (*rel.parent.parts, rel.stem)
    for part in rel_parts:
        clean = part.replace('-', ' ').replace('_', ' ').title()
        parts.append(clean)
    if not parts:
        parts.append('Overview')
    return 'Research / ' + ' / '.join(parts)


def main() -> None:
    for config in SOURCE_CONFIGS:
        markdown_files = sorted(config['root'].rglob('*.md'))
        for md_path in markdown_files:
            slug = md_to_slug(md_path)
            output_path = OUTPUT_DIR / slug / 'index.html'
            convert_markdown(md_path, output_path)


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
rain_items.py — emit the BrutalistCommandRain `items` array from the ACTUAL tree.

Nothing about this reel's rain is typed from memory. Every label on screen is a
name in the repo and every status is the repo's own status, read at build time.
Run from the reel folder; writes items.json beside it and prints a summary.

    python3 rain_items.py ../../..        # path to the-reallocation-engine-fresh

Statuses emitted:
    COMMAND           an npm script entry point (package.json)
    DRAFT             recipe frontmatter `status: DRAFT`
    RUNNABLE-SAMPLE   recipe frontmatter, no named attestation
    RUNNABLE-LIVE     recipe frontmatter, no named attestation
    ATTESTED          RUNNABLE-* AND carrying a named human attestation
                      (attestation: "Name · YYYY-MM-DD", or a last_gate/att. file)
"""
import json, re, sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
items = []

pkg = json.loads((root / 'package.json').read_text())
for name in pkg.get('scripts', {}):
    if name.startswith('post') or name.startswith('pre'):
        continue                      # lifecycle hooks are not entry points
    items.append({'label': f'npm run {name}', 'status': 'COMMAND'})
n_cmd = len(items)

named = re.compile(r'attestation:\s*["\']([^"\']+·[^"\']+)["\']')
# Some RUNNABLE-SAMPLE recipes store the human signature in last_gate rather than
# attestation (SNICKERDOODLE: the `attestation:` field is reserved for VERIFIED).
# Pattern: last_gate: "...signed by a human (Firstname Lastname, YYYY-MM-DD)..."
last_gate_human = re.compile(r'last_gate:\s*["\'][^"\']*\([A-Z][a-z]+ [A-Z][a-z]+,\s*\d{4}-\d{2}-\d{2}\)')
n_rec = 0
for f in sorted((root / 'recipes').glob('*.md')):
    if f.name.endswith('.card.md'):
        continue                      # cards mirror their parent recipe
    head = f.read_text(errors='ignore')[:2000]
    m = re.search(r'^status:\s*([A-Z\-]+)', head, re.M)
    if not m:
        continue
    status = m.group(1)
    n_rec += 1
    if status.startswith('RUNNABLE') and (
        named.search(head) or 'attestation.md' in head or last_gate_human.search(head)
    ):
        status = 'ATTESTED'
    items.append({'label': f.stem, 'status': status})

Path('items.json').write_text(json.dumps(items, indent=2) + '\n')
counts = {}
for it in items:
    counts[it['status']] = counts.get(it['status'], 0) + 1
print(f'{n_cmd} commands + {n_rec} recipes = {len(items)} items -> items.json')
for k in sorted(counts):
    print(f'  {k:16} {counts[k]}')
print('\nVERIFY these counts against FACTCHECK.md before rendering.')

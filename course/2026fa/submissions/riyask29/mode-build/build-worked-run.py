#!/usr/bin/env python3
"""Build 02-worked-run.md from 02-worked-run.src.md by pasting saved run outputs verbatim.

Placeholders: {{file:P}} whole file · {{tail:P:N}} last N lines · {{inline:P}} one-line file inline ·
{{section:P:START:END}} lines from the heading START up to (not including) END.
Paths are relative to this folder. The only rewrite is the home-directory prefix, shown as "~".
Any placeholder that cannot be filled stops the build (exit 2).
"""
import re, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
HOME = str(Path.home())

def get(kind, arg):
    parts = arg.split(":")
    p = (HERE / parts[0]).resolve()
    if not p.is_file():
        print(f"[build] HALT: missing {parts[0]}", file=sys.stderr); sys.exit(2)
    t = p.read_text().rstrip("\n")
    if kind == "file":
        return t
    if kind == "inline":
        return "`" + t.strip() + "`"
    if kind == "tail":
        return "\n".join(t.splitlines()[-int(parts[1]):])
    if kind == "section":
        lines = t.splitlines()
        i = next((k for k, l in enumerate(lines) if l.strip().startswith(parts[1])), None)
        j = next((k for k, l in enumerate(lines) if l.strip().startswith(parts[2]) and i is not None and k > i), None)
        if i is None or j is None:
            print(f"[build] HALT: section {parts[1]!r}..{parts[2]!r} not found in {parts[0]}", file=sys.stderr); sys.exit(2)
        return "\n".join(lines[i:j]).rstrip()
    raise ValueError(kind)

src = (HERE / "02-worked-run.src.md").read_text()
out = re.sub(r"\{\{(file|tail|inline|section):([^}]+)\}\}", lambda m: get(m.group(1), m.group(2)), src)
out = out.replace(HOME, "~")
left = re.findall(r"\{\{[^}]*\}\}", out)
if left:
    print(f"[build] HALT: unfilled {left}", file=sys.stderr); sys.exit(2)
(HERE / "02-worked-run.md").write_text(out + "\n")
print(f"[build] 02-worked-run.md: {len(out.splitlines())} lines, {len(out.split())} words")

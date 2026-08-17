#!/usr/bin/env python3
"""
cowork-agentic-repo.py -- scaffold a Cowork agentic repo that is also a book.

This extends the ordinary book scaffold with the repository structure needed for
agentic operation: verified local data, vetted scripts, human-readable docs,
agent-readable recipes, phase gates, and root agent instructions.

Usage:
    python3 scripts/cowork-agentic-repo.py "My Book" "Author Name"
    python3 scripts/cowork-agentic-repo.py "My Book" "Author Name" --dir ../books --chapters 12
    python3 scripts/cowork-agentic-repo.py "My Book" "Author Name" --subtitle "A Field Guide" --with-slides

The generated repo uses lowercase scripts/ only. It never creates SCRIPTS/.
"""

import argparse
import json
import re
from datetime import date
from pathlib import Path


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"['\"`]", "", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "agentic-book"


def write_file(path: Path, content: str, force: bool = False) -> bool:
    if path.exists() and not force:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def subtitle_line(subtitle: str | None, markdown_prefix: str = "**Subtitle:** ") -> str:
    if not subtitle:
        return ""
    return f"{markdown_prefix}{subtitle}\n"


def frontmatter(title: str, author: str, subtitle: str | None, publisher: str) -> str:
    year = date.today().year
    subtitle_md = f"*{subtitle}*\n\n" if subtitle else ""
    return f"""# {title}

{subtitle_md}**{author}**

---

## Copyright

Copyright (c) {year} {author}. All rights reserved.

Published by {publisher}.

ISBN: [INSERT ISBN]

---

## Dedication

[OPTIONAL]

---

## Preface

[Explain why this book exists, why now, who it is for, and what it does not
try to cover.]
"""


def introduction(title: str) -> str:
    return f"""# Introduction

{title} is both a book and a working agentic repository. The book teaches the
reader how to understand the system. The repository gives agents and humans a
structured way to operate it.

## How This Book Is Organized

[Add a short map of the chapters after the outline is stable.]
"""


def chapter_stub(number: int) -> str:
    return f"""# Chapter {number}: [Title]

## Opening Claim

[State the chapter's central claim.]

## What This Chapter Teaches

- [Outcome 1]
- [Outcome 2]
- [Outcome 3]

## Agentic Connection

[Explain how this chapter maps to data, scripts, recipes, phase gates, or human
judgment in the repo.]
"""


def appendix_best_practices() -> str:
    return """# Appendix: Best Practices for Agentic Book Repos

This appendix is the operating compact for the repo.

## Two Customers

Every operating artifact has two customers:

1. Agents that read recipes, scripts, data contracts, and gate definitions.
2. Humans who must understand what agents do, why it is safe, and when to stop.

Recipes and recipes are primarily for agents to execute. Each one should begin
with a human-readable executive summary.

## Verified Data First

Before external lookup or model inference, check local verified evidence:

- `data/`
- generated audits
- metadata
- source exports
- tracker files
- stored reports

If verified local data is missing, stale, or insufficient, say so before looking
elsewhere.

## Vetted Scripts First

Before writing new code, check:

1. `scripts/`
2. `scripts/README.md`
3. `package.json`

Use stored scripts when they fit. Create ad hoc scripts only when no suitable
stored script exists. Promote reusable ad hoc scripts into `scripts/` after
review.

## Phase Gates

Do not run a fully automated pipeline until these gates pass:

1. Problem gate
2. Local evidence gate
3. Stored script gate
4. Small-run gate
5. Verification gate
6. Review gate
7. Logging gate

## Logging

Use `logs/RUN_LOG.md` for meaningful runs, blockers, generated artifacts, and
workflow changes. Do not log secrets or private user details.
"""


def back_matter() -> str:
    return """---

## Acknowledgments

[ACKNOWLEDGMENTS]

---

## About the Author

[AUTHOR BIO]

---

## Notes

[NOTES]

---

## References

[REFERENCES]
"""


def readme(title: str, author: str, subtitle: str | None) -> str:
    sub = subtitle_line(subtitle)
    return f"""# {title}

{sub}**Author:** {author}

## Overview

This repository is both a book and an agentic Cowork system. The book explains
the ideas. The repo gives agents and humans a verified way to operate them.

## Repository Structure

- `README.md` - human-facing overview.
- `CLAUDE.md` - Claude/Cowork operating rules.
- `AGENTS.md` - cross-agent operating rules.
- `docs/` - human-readable system documentation.
- `data/` - verified local data, exports, metadata, and audits.
- `scripts/` - tested, vetted, reusable automation.
- `recipes/` - agent-readable recipes with human-readable summaries.
- `chapters/` - book manuscript.
- `slides/` - optional decks and teaching material.
- `pantry/` - research notes and source material.
- `output/` - generated artifacts, not source of truth.

Use lowercase `scripts/`. Do not create `SCRIPTS/`.

## Operating Rule

Run the script and read the audit before you prompt. If the script does not
exist, say so before inventing one.

## Human Docs

- `docs/repo-structure.md`
- `docs/recipes.md`
- `docs/phase-gates.md`

## Book Map

| # | Chapter | Purpose |
|---|---|---|
| 00 | `chapters/00-introduction.md` | Introduces the book and repo. |
| 98 | `chapters/98-appendix-best-practices.md` | Best practices for agentic operation. |
| 99 | `chapters/99-back-matter.md` | Back matter. |
"""


def claude_md() -> str:
    return """# Claude Instructions

This repo is both a book and an agentic Cowork system.

## Rules

1. Read `README.md`, `AGENTS.md`, and `docs/repo-structure.md` before structural work.
2. Check verified local data before external lookup.
3. Check vetted stored scripts before creating ad hoc scripts.
4. Use lowercase `scripts/` only. Never create `SCRIPTS/`.
5. Treat recipes as agent-facing recipes with human-readable summaries.
6. Do not run a fully automated pipeline until phase gates pass.
7. Log meaningful runs in `logs/RUN_LOG.md`.

## Completion Report

When done, report files changed, data checked, scripts run, tests performed, and
remaining risks.
"""


def agents_md() -> str:
    return """# Agent Instructions

## Two Customers

Agents execute recipes. Humans audit, supervise, and decide when to intervene.

## Grounding Order

1. Verified local data in `data/`.
2. Vetted stored scripts in `scripts/`.
3. External lookup only when local evidence is insufficient.
4. Ad hoc scripts only when no stored script fits.

## Phase Gates

Do not advance automation until the problem, local evidence, stored scripts,
small run, verification, review, and logging gates pass.
"""


def data_contract() -> str:
    return """# Data Contract

## Source Data

Put source exports, original datasets, and approved reference records in
`data/`.

## Generated Data

Generated audits and reports should sit beside the data they inspect and use
`-audit.md` when appropriate.

## Rules

- Check local data before external lookup.
- Never invent counts, rates, coverage, or confidence.
- Mark missing data as missing.
- Do not store secrets in tracked data files.
"""


def repo_structure_doc() -> str:
    return """# Repository Structure

This repo is organized by function and audience.

## Human-Facing

- `README.md`
- `docs/`
- `chapters/`
- `slides/`

## Agent-Facing

- `CLAUDE.md`
- `AGENTS.md`
- `recipes/`
- `scripts/`

## Evidence

- `data/`
- `pantry/`
- generated audits and reports

Use lowercase `scripts/` only.
"""


def skills_doc() -> str:
    return """# Recipes

Recipes are agent-facing recipes with human-readable executive summaries.

Each recipe should include:

1. Executive summary
2. Required reads
3. Phase gates
4. Primary stored scripts or a clear "not implemented yet"
5. Workflow
6. Output contract
7. Logging rule
8. Stop conditions
"""


def phase_gates_doc() -> str:
    return """# Phase Gates

Automation expands only after explicit gates pass.

## Standard Gates

1. Problem gate
2. Local evidence gate
3. Stored script gate
4. Small-run gate
5. Verification gate
6. Review gate
7. Logging gate

If a gate has no failure path, it is not a gate.
"""


def shared_skill() -> str:
    return """# Shared Recipe Contract

## Executive Summary

This file defines the rules all recipes must follow.

## Rules

1. Check verified local data first.
2. Check vetted stored scripts in `scripts/` first.
3. Do not create or reference `SCRIPTS/`.
4. Use external lookup only after local evidence is insufficient.
5. Create ad hoc scripts only when no stored script fits.
6. Run explicit tests before scaling automation.
7. Log meaningful runs in `logs/RUN_LOG.md`.

## Phase Gates

1. Problem gate
2. Local evidence gate
3. Stored script gate
4. Small-run gate
5. Verification gate
6. Logging gate
"""


def skill_readme() -> str:
    return """# Recipes

## Executive Summary

Recipes are executable recipes for agents and readable operating cards for
humans.

## Required Shape

Every recipe should include an executive summary, required reads, phase gates,
primary tools, workflow, output contract, logging rule, and stop conditions.
"""


def run_log() -> str:
    return """# Run Log

Use this file for meaningful recipe runs, blockers, generated artifacts, and
workflow changes.

## Template

```markdown
## YYYY-MM-DD -- Short task name

- **Recipe:** ...
- **Inputs:** ...
- **Commands:** ...
- **Outputs:** ...
- **Result:** ...
- **Open issues:** ...
```
"""


def script_readme() -> str:
    return """# scripts

Tested, vetted, reusable automation belongs here.

Agents must check this directory before writing ad hoc scripts.

Use lowercase `scripts/` only. Do not create `SCRIPTS/`.
"""


def outline(title: str, author: str, subtitle: str | None, chapters: int) -> str:
    sub = subtitle_line(subtitle)
    rows = "\n".join(
        f"{i}. **[Chapter {i} Title]** - [One-line description]"
        for i in range(1, chapters + 1)
    )
    return f"""# {title} - Outline

{sub}**Author:** {author}

## Front Matter

- Copyright
- Dedication
- Preface

## Introduction

[One-sentence introduction purpose.]

## Chapters

{rows}

## Back Matter

- Appendix: Best Practices for Agentic Book Repos
- Acknowledgments
- About the Author
- Notes
- References
"""


def book_md(title: str, author: str, subtitle: str | None) -> str:
    sub = subtitle_line(subtitle)
    return f"""# {title}

{sub}**Author:** {author}

## One-Sentence Pitch

[ONE SENTENCE]

## The Argument

[ARGUMENT]

## The Reader

[READER]

## Open Questions

- [ ]
"""


def metadata(title: str, author: str, subtitle: str | None, publisher: str) -> str:
    data = {
        "title": title,
        "subtitle": subtitle or "",
        "author": author,
        "publisher": publisher,
        "created": str(date.today()),
        "type": "cowork-agentic-book-repo",
    }
    return "\n".join(f"{k}: {json.dumps(v)}" for k, v in data.items()) + "\n"


def package_json(slug: str) -> str:
    data = {
        "name": slug,
        "version": "0.1.0",
        "type": "module",
        "description": "Cowork agentic book repository",
        "scripts": {
            "verify": "echo \"Add repo-specific verification scripts under scripts/\"",
            "svg-to-png": "node scripts/svg-to-png.mjs",
        },
        "dependencies": {
            "glob": "^10.0.0",
            "sharp": "^0.33.0",
        },
    }
    return json.dumps(data, indent=2) + "\n"


def svg_to_png_script() -> str:
    return """#!/usr/bin/env node
import { glob } from "glob";
import sharp from "sharp";
import { stat } from "node:fs/promises";
import path from "node:path";

const svgs = await glob("images/**/*.svg");
for (const svg of svgs) {
  const png = svg.replace(/\\.svg$/i, ".png");
  let skip = false;
  try {
    const [src, out] = await Promise.all([stat(svg), stat(png)]);
    skip = out.mtimeMs >= src.mtimeMs;
  } catch {}
  if (skip) continue;
  await sharp(svg, { density: 300 }).png().toFile(png);
  console.log(`${svg} -> ${png}`);
}
if (!svgs.length) console.log("No SVG files found under images/.");
"""


def gitignore() -> str:
    return """.DS_Store
node_modules/
output/
*.log
.env
data/private/
"""


def create_repo(args: argparse.Namespace) -> None:
    slug = args.slug or slugify(args.title)
    root = Path(args.dir).expanduser().resolve() / slug
    if root.exists() and any(root.iterdir()) and not args.force:
        raise SystemExit(f"Refusing to overwrite non-empty directory: {root}\nUse --force to overwrite scaffold files.")

    dirs = [
        "chapters",
        "data",
        "docs",
        "images",
        "d3",
        "output",
        "pantry",
        "scripts",
        "recipes",
        "resumes",
    ]
    if args.with_slides:
        dirs.append("slides")
    for name in dirs:
        (root / name).mkdir(parents=True, exist_ok=True)

    files: dict[str, str] = {
        "README.md": readme(args.title, args.author, args.subtitle),
        "CLAUDE.md": claude_md(),
        "AGENTS.md": agents_md(),
        "DATA_CONTRACT.md": data_contract(),
        "docs/repo-structure.md": repo_structure_doc(),
        "docs/recipes.md": skills_doc(),
        "docs/phase-gates.md": phase_gates_doc(),
        "scripts/README.md": script_readme(),
        "scripts/svg-to-png.mjs": svg_to_png_script(),
        "recipes/README.md": skill_readme(),
        "recipes/_shared.md": shared_skill(),
        "logs/RUN_LOG.md": run_log(),
        "book.md": book_md(args.title, args.author, args.subtitle),
        "outline.md": outline(args.title, args.author, args.subtitle, args.chapters),
        "metadata.yaml": metadata(args.title, args.author, args.subtitle, args.publisher),
        "package.json": package_json(slug),
        ".gitignore": gitignore(),
        "chapters/00-frontmatter.md": frontmatter(args.title, args.author, args.subtitle, args.publisher),
        "chapters/00-introduction.md": introduction(args.title),
        "chapters/98-appendix-best-practices.md": appendix_best_practices(),
        "chapters/99-back-matter.md": back_matter(),
    }
    for i in range(1, args.chapters + 1):
        files[f"chapters/{i:02d}-chapter-{i:02d}.md"] = chapter_stub(i)

    written = []
    skipped = []
    for rel, content in files.items():
        if write_file(root / rel, content, args.force):
            written.append(rel)
        else:
            skipped.append(rel)

    print(f"Created Cowork agentic book repo: {root}")
    print(f"Written files: {len(written)}")
    if skipped:
        print(f"Skipped existing files: {len(skipped)}")
    print("Next steps:")
    print(f"  cd {root}")
    print("  read README.md, CLAUDE.md, AGENTS.md, and docs/repo-structure.md")
    print("  add verified data under data/ and vetted scripts under scripts/")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scaffold a Cowork agentic repository that is also a book."
    )
    parser.add_argument("title", help="Book/repo title")
    parser.add_argument("author", help="Author name")
    parser.add_argument("--subtitle", default=None, help="Optional subtitle")
    parser.add_argument("--publisher", default="Bear Brown, LLC", help="Publisher")
    parser.add_argument("--dir", default=".", help="Parent directory for the new repo")
    parser.add_argument("--slug", default=None, help="Directory/package slug")
    parser.add_argument("--chapters", type=int, default=12, help="Number of body chapter stubs")
    parser.add_argument("--with-slides", action="store_true", help="Create optional slides/ directory")
    parser.add_argument("--force", action="store_true", help="Overwrite scaffold files if they exist")
    return parser.parse_args()


def main() -> None:
    create_repo(parse_args())


if __name__ == "__main__":
    main()

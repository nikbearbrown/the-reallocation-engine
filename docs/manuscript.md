# Manuscript

The manuscript teaches the ideas behind The Reallocation Engine. The repository
implements those ideas through data, scripts, recipes, audits, and logs.

## Manuscript Files

- `book.md`: manuscript entry point and book positioning.
- `outline.md`: chapter plan.
- `chapters/00-frontmatter.md`: front matter.
- `chapters/00-introduction.md`: introduction.
- `chapters/01-*.md` through `chapters/16-*.md`: main chapters.
- `chapters/97-fundamental-themes.md`: synthesis chapter.
- `chapters/98-appendix-best-practices.md`: operational appendix.
- `chapters/99-back-matter.md`: back matter.

Supporting editorial files include:

- `CHAPTER-RESEARCH-MAP.md`;
- `chapters-spec.md`;
- `architecture.md`;
- `vision.md`;
- `risks.md`;
- `RESTRUCTURE-PLAN.md`;
- `TIKTOC.md` and `TIKTOK.md`.

## Separation of Concerns

Use this split:

- Conceptual explanation belongs in `chapters/`.
- Operational rules belong in `docs/`.
- Repeatable agent recipes belong in `recipes/`.
- Maintained automation belongs in `scripts/`.
- Evidence and audits belong in `data/`.
- Generated manuscript/build artifacts belong in `output/`.

Do not bury scripts, raw data, or private tracker state in manuscript folders.

## Claim Discipline

Chapters should preserve the book's core distinction: fluent output is not the
same as warranted judgment.

For claims about sponsorship, role quality, ATS liveness, BLS/O*NET signals,
SEC funding, visa timing, or outcomes:

- cite local evidence when available;
- avoid invented counts or rates;
- label uncertainty and missing coverage;
- distinguish observation from recommendation;
- preserve the educational framing.

## Revision Checklist

Before revising manuscript files:

- Does the claim follow `DATA_CONTRACT.md`?
- Should a related doc, recipe, script, or audit also change?
- Are paths and command references current?
- Is private job-search information excluded?
- Does the prose avoid legal, immigration, or financial advice?

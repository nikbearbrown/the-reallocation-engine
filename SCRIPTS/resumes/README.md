# Resume Scripts

Utilities for turning anonymized student-style Markdown CV examples into
ATS-friendly PDFs.

## Generate PDFs

Render every `resumes/*-cv.md` file:

```bash
npm run resumes:pdf -- --all
```

Render one file:

```bash
npm run resumes:pdf -- resumes/aarav-patel-cv.md
```

Default output directory:

- `output/resumes/`

The generator uses Playwright/Chromium and a small built-in Markdown renderer
for resume-safe Markdown headings, paragraphs, bold text, inline code, and
bullets.

Install browser support first:

```bash
npm install
npx playwright install chromium
```

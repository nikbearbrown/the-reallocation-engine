# Mode: pdf -- Generate ATS-Friendly CV PDFs

Use this mode to turn the anonymized Markdown CV examples into PDF files for
classroom testing.

This mode is for formatting and reproducibility. It should not invent resume
content or tailor a student CV beyond evidence already present in the source
Markdown.

## Required Context

Read first:

- `modes/_shared.md`
- `SCRIPTS/resumes/README.md`
- `resumes/*.md`
- `modes/RUN_LOG.md`

## Primary Tool

```bash
npm run resumes:pdf -- resumes/aarav-patel-cv.md
```

The underlying script is:

```bash
node SCRIPTS/resumes/generate-pdf.mjs <input-cv.md> [output.pdf]
```

## Workflow

1. Choose the Markdown CV.
   - Use only anonymized examples or student-approved Markdown.
   - Do not use deleted original PDFs.

2. Inspect the Markdown.
   - Confirm the name, email, phone number, and links are fake or approved.
   - Confirm the content is plain text and ATS-friendly.

3. Generate the PDF.
   - If no output path is given, the script writes into `output/resumes/`.
   - If Playwright or Chromium is missing, record the failure and the needed
     dependency.

4. Verify the result.
   - Confirm the PDF file exists.
   - If possible, check page count and file size.

5. Log the run in `modes/RUN_LOG.md`.

## Log Template

```markdown
## YYYY-MM-DD -- CV PDF generation

- **Mode:** pdf
- **Input:** resumes/first-last-cv.md
- **Command:** `npm run resumes:pdf -- resumes/first-last-cv.md`
- **Output:** output/resumes/first-last-cv.pdf
- **Worked:** ...
- **Did not work:** ...
- **Next:** ...
```

## Tailoring Rule

For class exercises, students may create a tailored Markdown variant first.
Every added skill, project, credential, or achievement must be traceable to the
student's real evidence. Keyword matching is allowed; fabrication is not.

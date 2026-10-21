# SWE STEM-OPT Prototype

## Executive summary

This folder holds a small program that checks three sample job postings for an international student on STEM OPT. It looks up each company in the repository's local sponsorship file, labels every number by where it came from (a data record, a model's judgment, or the student's own input), and hands the result to the repository's existing scorer, which returns Apply / Consider / Skip. It runs fully offline. It does **not** check whether a posting is really still open, and it does **not** read job descriptions; those values are the student's own assumptions and are labeled that way.

## Run

From the repo root:

```bash
node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js
```

Optional flags: `--fixture <jobs.json>` (default: `fixture.json` here) and `--out-dir <dir>` (default: this folder).

## Offline test

```bash
node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs
```

No network calls. It runs the prototype on `fixture.json` into a temp folder and checks the source labels, the two named failure cases (company missing from the CSV; non-ATS URL), and that a job missing its `fit` value stops the run instead of getting an invented value.

## Files

| File | What it is |
|---|---|
| `index.js` | the prototype |
| `index.test.mjs` | the offline test |
| `fixture.json` | 3 sample jobs (your-input: `fit`, `timeline`) |
| `my-roles.json` | prototype output → scorer input, every term labeled |
| `role-scores.json` | scorer output — JSON log for the agent |
| `role-scores.md` | scorer output — Markdown report for the person |

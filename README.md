> **Fall 2026 fresh cut.** This repository was re-cut on 2026-08-17 from the
> Summer 2026 post-integration tree. The complete Summer 2026 history — all
> student PRs, merged badges, and run logs — lives permanently at
> [**the-reallocation-engine-summer-2026**](https://github.com/nikbearbrown/the-reallocation-engine-summer-2026).
> Summer students: update portfolio links to the archive URL
> (`…/the-reallocation-engine-summer-2026/pull/<N>`).
> Contributing this term? Read [`CONTRIBUTING.md`](CONTRIBUTING.md) first — contributions live in
> per-student namespaces and CI enforces the privacy contract.
>
> **License:** code is MIT ([`LICENSE`](LICENSE)); the book manuscript under `book/` is
> CC BY 4.0 ([`LICENSE-BOOK-CC-BY-4.0.md`](LICENSE-BOOK-CC-BY-4.0.md)).

# The Reallocation Engine

*Verified Data, Phase Gates, and CLI Pipelines for the F-1 OPT Search*

**Nik Bear Brown** and **Humanitarians AI** · Published by Humanitarians AI · First edition, 2026

---

## About this book

*The Reallocation Engine* is a book and a working machine at once. The chapters teach a method for running a high-stakes search — specifically, the job search of an international student on an F-1 visa with the OPT clock running — and the same repository contains the scripts, data, and operating recipes that *run* that method. You can clone it, open a terminal, type a command, and get a sourced Apply / Consider / Skip decision about a real role. The book is not a description of a system that lives somewhere else; the book *is* the system, explained.

Its argument starts with the fluency trap: the first sign of trouble is usually not failure but fluency. A draft looks clean, an answer sounds reasonable, the code runs — and nothing on the surface announces that a human still has work to do. AI has made that surface cheap to produce, and in making *execution* cheap it has left *judgment* scarce. For a student with sixty to ninety days to find a sponsoring employer, that gap is an emergency: scarce effort, spent confidently, in the wrong place. The engine exists to **reallocate** that effort — away from polished cold applications the evidence says will go nowhere, and toward the few roles where a record, not a feeling, says effort can matter.

It does this by refusing to fight fluency with more fluency. Every count, rate, and confidence traces to a source (the verified-data contract); some facts — a dead posting, an impossible visa timeline — veto a role outright rather than nudging a score (gates, not votes); and a healthy run skips at least half of what it evaluates, because the engine's value is in the applications it talks you out of. The machine executes up to a deliberate phase gate and then hands the decision back to you with every source labeled, so the part that is irreducibly human — deciding whether a role is worth a day of your life — stays yours.

The book is for international students on the clock, for the advisors and Humanitarians AI fellows who work alongside them, and for anyone who wants to see what disciplined human–AI collaboration looks like when a real deadline removes the option of self-deception. It is not immigration counsel, not a guide to gaming applicant-tracking systems, and not a general AI manual — it is one search, run honestly, as a way of teaching a discipline that travels.

---

## Start here

This README is the front door. It deliberately does **not** restate what is runnable,
what is broken, or where the work stands — those change with every run, and a copy of
them here would be wrong within a week. Each has one owner:

| Read | For |
|---|---|
| [`_MANIFEST.md`](_MANIFEST.md) | the read-first map of the whole repository |
| [`status.md`](status.md) | **where the work is right now** and what is next |
| [`DOMAIN.md`](DOMAIN.md) | what this domain is, what is runnable **today**, and the honest list of known gaps |
| [`SNICKERDOODLE.md`](SNICKERDOODLE.md) | the agent-operating-system that governs the repo |
| [`logs/RUN_LOG.md`](logs/RUN_LOG.md) | ground-truth history — what has actually been run |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | namespaces, the privacy contract, and CI, before you open a PR |

**If this README disagrees with `DOMAIN.md`, `status.md`, or a run log, they are right and this file is a bug.**

### First win — about 30 minutes

Work through [`docs/tutorials/01-first-scan.md`](docs/tutorials/01-first-scan.md). It walks the
full loop: configure `portals.yml`, predict what you expect to see, run a dry scan, read the
report line by line, judge it against the live job board, and log the run. Exercises included.
The tutorial index is at [`docs/tutorials/README.md`](docs/tutorials/README.md).

### Quick start

Requires **Node.js** (the package is ESM; `npm install` pulls `playwright`, `sharp`, `js-yaml`, `glob`)
and **Python 3** for the SEC, BLS, and ATS analysis scripts.

```bash
git clone https://github.com/nikbearbrown/the-reallocation-engine.git
cd the-reallocation-engine
npm install

npm run doctor          # tools, npm command targets, domain dirs, recipe-status dashboard
npm run verify          # conformance + manifest checks
npm run ats:scan -- --dry-run    # ATS provider scan, nothing written
```

`npm run doctor` is the fastest way to see what your machine can actually run.
The full verified command surface is listed in [`DOMAIN.md`](DOMAIN.md#runnable-today-verified-command-surface) —
that is the authoritative list, kept next to the code it describes.

### How it actually runs

**Claude Code (or Cowork / Codex) is the v0 runtime.** A recipe's run section is addressed to
the agent: execute the named step, stop at every gate, wait for human clearance, log the run.
The `snickerdoodle` CLI named inside recipe files is **roadmap, not runtime** — those commands
do not execute anywhere yet.

Recipes are **DRAFT** unless a run log and a named human attestation say otherwise. A gate is
cleared by a person, not by a passing script.

---

## Repository layout

| Path | What it is |
|---|---|
| `book/chapters/` | the manuscript — one file per chapter, no scripts or data |
| `book/` | everything else that makes the book: `book.md` (single-file build), `build.sh`, `outline.md`, `images/`, `slides/`, `exercises/`, `study-aids/`, `pantry/` |
| `recipes/` | operating recipes with lifecycle frontmatter (status, todos, gates, attestation) |
| `scripts/` | maintained automation — `sec/`, `ats/`, `bls/`, `score/`, `resumes/` (lowercase `scripts/` only, never `SCRIPTS/`) |
| `data/` | source data: `80-days-to-stay/`, `sec/form-d/`, `bls/`, and `ats/` (**private by default**) |
| `eval/` | evaluation harness — tasks, fixtures, configs, runs, results |
| `docs/` | tutorials, design docs, research maps |
| `course/` | course material and per-student submission namespaces |
| `logs/`, `reports/`, `output/` | run history, generated reports, run artifacts |

### Privacy

Before committing, review `data/ats/`, rendered resumes and PDFs, and any `.env*`. Application
trackers, pipelines, and scan histories can reveal personal job-search activity. They appear
after runs and are not checked in by default. `npm run pii-scan` exists; CI enforces the
contract described in [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## Table of contents

### Front matter
- [Front matter — title, copyright, dedication, preface](book/chapters/00-frontmatter.md)
- [Introduction](book/chapters/00-introduction.md)

### Chapters 1–3 — The core method
- [Chapter 1 — The Fluency Trap](book/chapters/01-the-fluency-trap.md)
- [Chapter 2 — The Reallocation Principle](book/chapters/02-the-reallocation-principle.md)
- [Chapter 3 — The Verified-Data Contract](book/chapters/03-the-verified-data-contract.md)

### Chapters 4–5 — The discipline
- [Chapter 4 — Two Customers: Writing a Recipe for the AI and the Human](book/chapters/04-two-customers.md)
- [Chapter 5 — Verifying the Data](book/chapters/05-verifying-the-data.md)

### Chapters 6–13 — The evidence components
- [Chapter 6 — Where the Money Went: SEC Form D](book/chapters/06-where-the-money-went-sec-form-d.md)
- [Chapter 7 — Who Sponsors: The 80 Days Sponsorship Scorer](book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md)
- [Chapter 8 — Is the Job Real: ATS Detection and Liveness](book/chapters/08-is-the-job-real-ats-detection-and-liveness.md)
- [Chapter 9 — Is the Role Any Good: BLS / O\*NET Role Quality](book/chapters/09-is-the-role-any-good-bls-onet-role-quality.md)
- [Chapter 10 — The Visa Timeline Manager](book/chapters/10-the-visa-timeline-manager.md)
- [Chapter 11 — The Bayesian Role Scorer](book/chapters/11-the-bayesian-role-scorer.md)
- [Chapter 12 — The OPT Framing Generator](book/chapters/12-the-opt-framing-generator.md)
- [Chapter 13 — Resumes That Survive the Filter](book/chapters/13-resumes-that-survive-the-filter.md)

### Chapters 14–16 — Operating the engine
- [Chapter 14 — Recipes: Operating the Engine](book/chapters/14-skills-operating-the-engine.md)
- [Chapter 15 — The Pipeline Tracker and the Skip Rate](book/chapters/15-the-pipeline-tracker-and-the-skip-rate.md)
- [Chapter 16 — The Build and the Honest Run](book/chapters/16-the-build-and-the-honest-run.md)

### Synthesis and back matter
- [The Fundamental Themes](book/chapters/97-fundamental-themes.md)
- [Appendix: Best Practices for Running the Reallocation Engine](book/chapters/98-appendix-best-practices.md)
- [Back matter — acknowledgments, about the author, references, glossary](book/chapters/99-back-matter.md)

## How this connects to Medhavy

These are Kindle / online editions, designed for integration with **Medhavy** (also **Medhavi**), an AI-powered intelligent-textbook system in which the chapters become adaptive practice — hints, worked examples, quizzes, and feedback loops. Learn more at https://www.medhavy.com/.

---

Copyright © 2026 Nik Bear Brown and Humanitarians AI. Published by Humanitarians AI, a 501(c)(3) nonprofit organization.

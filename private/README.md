# private/ — your real data lives here, and never leaves

This folder is for **your actual** job-search data: your real résumé, your real
ATS/application tracker, your real contacts, anything with personal information.

**Everything in this folder is gitignored** — only this `README.md` is tracked.
Nothing you put here will be committed or pushed. This repo is public; that matters.

## What goes here

- `resume.md` / `resume.pdf` — your real CV (the `resumes/` folder at the repo root
  holds *fictional examples* — Aarav, Maya, Priya, Rohan — keep your real one here).
- your real application tracker, recruiter notes, offer details, anything with PII.
- `skills-profile.json` — a flat JSON array of skill labels you have real
  evidence for, used by `npm run skill-demand -- <postings.json> --profile
  private/skills-profile.json` (`recipes/skill-demand-monitor.md`). Same shape
  as the committed example at `data/examples/skill-demand/example-profile.json`.
- `real-postings/*.json` — real postings pulled via `npm run fetch-postings`
  (see `scripts/ats/README.md`). Real, live company data — never committed,
  even though the postings themselves are public.

## How AI uses it

AI tools (Claude, Claude Code, Cowork) **read** files here locally to help you —
tailor a résumé, score a role, draft outreach. They must never:

- copy anything from `private/` into a tracked file (a chapter, a committed report),
- echo your PII into output that gets committed,
- or push it anywhere.

That rule is in `CLAUDE.md`/`AGENTS.md`, and `npm run doctor` fails if any private
path is git-tracked — so a leak is caught before it can be pushed.

## If you ever see your real résumé show up in `git status`

Stop. It belongs in `private/`, not anywhere else. Move it here and run
`npm run doctor` to confirm the repo is clean.

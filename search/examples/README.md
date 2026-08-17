# search/examples/ — fictional, committable search-layer personas

These four personas are **fictional** (555 phone numbers, `@example.com`
addresses) and exist so the engine's full pipeline can be demonstrated,
tested, and shown in videos **without any real personal data**. They pair
with the CVs in `resumes/` and are the ONLY resume-shaped files that belong
in git.

Each persona's resume ships as **`resume.example.json`** — the literal
filename `resume.json` is *never* tracked, with no exceptions: `.gitignore`
blocks it everywhere and `npm run doctor` hard-fails if one is ever tracked.
The engine reads whatever path you point it at; copy the example to your
local untracked layer as `resume.json` to run it.

**The rule (Fall 2026):** your real `profile.yml` / `resume.json` / `gaps.md`
live directly in `search/` and are **gitignored — never commit them, never
`git add -f` them, never un-ignore them.** Every Summer 2026 privacy incident
was a real resume committed to a branch. If you need data on screen or in a
fixture, use these personas or extend them.

To start your own (local, untracked) layer:

    cp search/examples/aarav-patel/profile.yml search/examples/aarav-patel/gaps.md search/
    cp search/examples/aarav-patel/resume.example.json search/resume.json

Each persona deliberately exercises a different `applyProfile` /gate branch:

| Persona | Status | What it exercises |
|---|---|---|
| Aarav Patel | F-1 STEM OPT, "work authorized (EAD)" free text | the authorization-parsing fix (PR #37): "authorized" free text must NOT zero the sponsorship weight |
| Priya Nair | F-1 OPT year 1, explicit `needs_sponsorship: true` | explicit field wins; OPT-window timeline-gate pressure (34/90 unemployment days) |
| Maya Sehgal | H-1B, seeking transfer | nonimmigrant status decisive; soft-sponsorship tiers |
| Rohan Desai | U.S. permanent resident, explicit `needs_sponsorship: false` | sponsorship weight → 0 branch (the non-sponsor control case) |

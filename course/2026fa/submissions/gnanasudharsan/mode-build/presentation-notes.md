# Presentation notes — 5 minutes

## Executive summary

Speaker notes for a five-minute presentation of the AI-startup triage mode: the domain, the hidden fact it checks, a live demo, one lesson and one limitation. The demo uses only local files, so it runs without network access.

## 0:00–0:45 — Domain

- Fictional persona Ananya Rao (`search/examples/ananya-rao/`): F-1, pre-OPT, MS Computer Science (AI), program ends Dec 2026, needs H-1B, targeting AI Engineer roles at funded AI startups.
- The H-1B calendar fixes two dates: petition filing from April 2027, employment start 2027-10-01. The employer has to exist on both.

## 0:45–1:30 — The asymmetry

- A posting shows title, location, salary. It never shows runway.
- The engine's scorer has no funding input, so a perfect-fit role at a startup that will not survive to the petition date scores like any other.
- This mode makes funding a gate: last round + 24 months must reach April 2027 to be held, October 2027 to pass.

## 1:30–3:30 — Live demo (local only)

```bash
node --test scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/
```
20 tests; point at the break cases (fund, blank funding, ambiguous name, weak "AI" title, rescale, regression).

```bash
R=course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b
node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs --as-of 2026-10-20 \
  --postings $R/inputs/postings.json --liveness $R/inputs/ats-liveness-2026-10-20.txt \
  --clearance $R/inputs/clearance.json --out-dir /tmp/demo
```
Expected summary lines: `postings: 4 · scored 1 · held 3 · excluded 0` and `screened employers: 107 · …"CANNOT-VERIFY":4…`.

Show `/tmp/demo/ai-startup-formd-report.md`: the Cohere Health row says scorer "Apply (0.523)" but verdict **HOLD — runway unverified**; CodaMetrix held on `liveness-uncertain`.

Then re-run without the clearance flag: every CANNOT-VERIFY posting is held, nothing is scored.

```bash
node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs --as-of 2026-10-20 \
  --postings $R/inputs/postings.json --liveness $R/inputs/ats-liveness-2026-10-20.txt \
  --out-dir /tmp/demo-noclear
```

## 3:30–4:15 — One lesson

The first real run blamed a "non-AI title" on postings that did not exist. The numbers were right; the explanation was wrong. A regression test now fails on the old code and passes on the new — the report is part of what has to be correct.

## 4:15–5:00 — One limitation

The funding data is from September 2025. "No startup reaches October 2027" may only mean "nobody's 2026 round is in the data yet". The mode says so on every row and holds instead of excluding, but it cannot see funding it was never given. Next: full Form D quarters and an EDGAR check for the four held companies.

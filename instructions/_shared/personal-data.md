## Personal data — read locally, never commit

This repo is public. Real personal data (the user's actual résumé, application
tracker, contacts, outcomes) lives in `private/` and in `data/ats/` (both gitignored
except their policy/README/example files). You may **read** these to help the user —
tailor a résumé, score a role, draft outreach — but you must never:

- copy or paraphrase personal data into a **tracked** file (a chapter, a committed
  report, a fixture, a log) — keep it inside `private/`;
- echo personal data into output that will be committed or pushed;
- move a file out of `private/`/`data/ats/` into a tracked location.

The machine half enforces this: `npm run doctor` fails if any private path is
git-tracked (scaffolding — README, `.gitignore`, `*.example.*` — is exempt). If you
generate an artifact *from* private data, write it back into `private/`, not into the
tracked tree. When in doubt, treat it as private and ask.

#!/bin/sh
# Build the course-site upload: reallocation-riyask29-mode.zip, from the COMMITTED tree (git archive),
# so the zip is exactly what the PR shows. Never contains private/, data/ats/ or the raw DOL/SEC files.
set -e
cd "$(git rev-parse --show-toplevel)"
OUT="${1:-$HOME/Documents/INFO7375/reallocation-riyask29-mode.zip}"
git archive --format=zip -o "$OUT" HEAD \
  recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md \
  recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.card.md \
  course/2026fa/submissions/riyask29/mode-build \
  scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston \
  scripts/ats/liveness-browser.mjs \
  logs/runs/2026fa-riyask29-3.md
unzip -l "$OUT" | tail -1
echo "→ $OUT  (commit $(git rev-parse --short HEAD))"

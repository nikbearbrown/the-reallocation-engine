#!/usr/bin/env bash
# run-real-demo.sh — one command instead of two: fetches real postings from
# real companies, then ranks skill demand across them. Wraps the two-step
# workflow documented in scripts/ats/README.md and recipes/skill-demand-monitor.md.
#
#   npm run demo:real                              # default companies, unfiltered
#   npm run demo:real -- --role-filter "ai engineer"   # extra flags pass through to skill-demand
#
# Real network calls to real Greenhouse/Lever companies. Fetched postings
# land in private/ (gitignored) — never committed, even though they're
# public data. Edit GREENHOUSE_COMPANIES / LEVER_COMPANIES below to try
# different real companies.

set -euo pipefail
cd "$(dirname "$0")/.."

GREENHOUSE_COMPANIES=("Anthropic")
LEVER_COMPANIES=("Palantir")

OUT_JSON="private/real-postings/demo-run.json"
OUT_MD="reports/generated/skill-demand-real-demo.md"

echo "== Step 1/2: fetch real postings (${GREENHOUSE_COMPANIES[*]} via Greenhouse, ${LEVER_COMPANIES[*]} via Lever) =="
npm run fetch-postings -- --greenhouse "${GREENHOUSE_COMPANIES[@]}" --lever "${LEVER_COMPANIES[@]}" -o "$OUT_JSON"

echo
echo "== Step 2/2: rank skill demand =="
npm run skill-demand -- "$OUT_JSON" --out-dir reports/generated --md "$OUT_MD" "$@"

echo
echo "== Done — report: $OUT_MD =="

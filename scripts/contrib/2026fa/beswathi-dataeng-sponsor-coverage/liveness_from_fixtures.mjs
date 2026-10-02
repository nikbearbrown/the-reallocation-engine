#!/usr/bin/env node
/**
 * liveness_from_fixtures.mjs — offline liveness ledger
 *
 * Gate G3 of the dataeng-sponsor-coverage recipe needs a liveness verdict per
 * posting. `npm run ats:liveness` gets one by driving Playwright at a live
 * board, which a test cannot do. So this reuses the repository's OWN pure
 * classifier — `classifyLiveness` from scripts/ats/liveness-core.mjs — against
 * saved page captures in fixtures/postings.fixture.json.
 *
 * It does NOT reimplement the classifier. If the repo's liveness rules change,
 * this ledger changes with them, which is the point.
 *
 * Network calls: none. Hosts contacted: none.
 *
 * Usage:
 *   node liveness_from_fixtures.mjs --fixtures <file> --out <ledger.json>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyLiveness } from '../../../ats/liveness-core.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

function arg(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : dflt;
}

const fixturesPath = arg('fixtures', path.join(here, 'fixtures', 'postings.fixture.json'));
const outPath = arg('out', path.join(here, 'fixtures', 'liveness-ledger.json'));

if (!fs.existsSync(fixturesPath)) {
  console.error(`FAIL missing fixtures: ${fixturesPath} (no verdict invented)`);
  process.exit(1);
}

const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf-8'));
const ledger = {};
const tally = { active: 0, expired: 0, uncertain: 0 };

for (const f of fixtures) {
  if (!f.company) {
    console.error('FAIL fixture entry without a company key');
    process.exit(1);
  }
  const v = classifyLiveness({
    status: f.status ?? 0,
    finalUrl: f.finalUrl ?? '',
    bodyText: f.bodyText ?? '',
    applyControls: f.applyControls ?? [],
  });
  ledger[f.company] = {
    result: v.result,
    code: v.code,
    reason: v.reason,
    posting_url: f.posting_url ?? null,
    // The verdict is a record produced by repo logic over a saved capture.
    // The capture itself is a fixture, not a live fetch — say both.
    source: 'record (classifyLiveness) over fixture capture',
    captured_at: f.captured_at ?? null,
  };
  tally[v.result] = (tally[v.result] ?? 0) + 1;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(ledger, null, 2));

console.log(`liveness ledger: ${Object.keys(ledger).length} postings ` +
  `→ active ${tally.active} · expired ${tally.expired} · uncertain ${tally.uncertain}`);
console.log(`wrote ${path.relative(process.cwd(), outPath)}`);

// mutant-runner.mjs — shared helper for the BROKEN-* mutant scorers (CONTRIBUTING: mutants live in fixtures/).
//
// A mutant is the REAL scripts/score/role-scorer.mjs with exactly one string replaced, written to a
// temp file and run with the same argv. Nothing is re-implemented, so a test that catches the mutant
// is testing the real scorer's behaviour with one defect injected. If the anchor text is no longer in
// the scorer, the mutant exits 3 ("stale mutant") instead of silently running an unmutated scorer.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const SCORER = path.join(REPO, 'scripts', 'score', 'role-scorer.mjs');

export function runMutant(name, anchor, replacement) {
  const src = fs.readFileSync(SCORER, 'utf8');
  if (!src.includes(anchor)) {
    console.error(`${name}: mutation anchor not found in scripts/score/role-scorer.mjs — this mutant is stale`);
    process.exit(3);
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'broken-scorer-'));
  const file = path.join(dir, `${name}.mjs`);
  fs.writeFileSync(file, src.replace(anchor, replacement));
  const r = spawnSync(process.execPath, [file, ...process.argv.slice(2)], { stdio: 'inherit', cwd: process.cwd() });
  fs.rmSync(dir, { recursive: true, force: true });
  process.exit(r.status ?? 1);
}

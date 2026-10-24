#!/usr/bin/env node
// hypothesis-probe.mjs — records what the MAINTAINED components actually do, next to the
// predictions in CHANGE-BRIEF (F1a: role scorer; F2(a): liveness classifier).
//
//   node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/hypothesis-probe.mjs
//
// It is an observation tool, not a test: a wrong prediction is printed as DIFFERS and the probe
// still exits 0. It exits 1 only if a component cannot be run at all. Offline; the scorer runs
// through its CLI into a temporary directory (never over tracked files).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { classifyLiveness } from '../../../ats/liveness-core.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const FIX = path.join(HERE, 'fixtures');
const read = (f) => JSON.parse(fs.readFileSync(path.join(FIX, f), 'utf8'));

let differs = 0;

// ── F1a: maintained scorer on a refusal entered as sponsorship p = 0 ────────
const f1 = read('f1-refusal-roles.json');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'f1a-'));
const rolesPath = path.join(tmp, 'roles.json');
fs.writeFileSync(rolesPath, JSON.stringify(f1.scorer_roles, null, 2));
const cli = ['scripts/score/role-scorer.mjs', rolesPath, '--out-dir', tmp];
console.log('F1a — maintained scorer (CHANGE-BRIEF §9, U1.2)');
console.log(`  $ node ${cli.join(' ').replace(tmp, '<tmp>').replace(tmp, '<tmp>')}`);
const stdout = execFileSync(process.execPath, cli, { cwd: REPO, encoding: 'utf8' });
for (const line of stdout.trim().split('\n')) console.log(`  | ${line.replaceAll(tmp, '<tmp>')}`);
const scored = JSON.parse(fs.readFileSync(path.join(tmp, 'role-scores.json'), 'utf8')).roles;
console.log('  role          predicted (composite, label)   observed (composite, label)   result');
for (const s of scored) {
  const p = f1.predicted_scorer_labels[s.role_id];
  const same = p.label === s.recommendation && Math.abs(p.composite - s.composite) < 1e-9;
  if (!same) differs++;
  console.log(`  ${s.role_id.padEnd(13)} ${String(p.composite).padEnd(6)} ${p.label.padEnd(22)} ${String(s.composite).padEnd(6)} ${s.recommendation.padEnd(21)} ${same ? 'MATCHES' : 'DIFFERS'}`);
  console.log(`      scorer reason: ${s.reason}`);
}

// ── F2(a): maintained liveness classifier on the six snapshots ──────────────
const f2 = read('f2-snapshots.json');
console.log('\nF2(a) — maintained classifyLiveness (CHANGE-BRIEF U1.3)');
console.log('  id    bodyText  applyControls        predicted                        observed                         result');
for (const s of f2.snapshots) {
  const c = classifyLiveness({ status: s.status, finalUrl: s.finalUrl, bodyText: s.bodyText, applyControls: s.applyControls });
  const same = c.result === s.predicted_classifier.result && c.code === s.predicted_classifier.code;
  if (!same) differs++;
  const pred = `${s.predicted_classifier.result}/${s.predicted_classifier.code}`;
  const obs = `${c.result}/${c.code}`;
  console.log(`  ${s.id.padEnd(5)} ${String(s.bodyText.length).padEnd(9)} ${JSON.stringify(s.applyControls).padEnd(20)} ${pred.padEnd(32)} ${obs.padEnd(32)} ${same ? 'MATCHES' : 'DIFFERS'}`);
  console.log(`      classifier reason: ${c.reason}`);
}

console.log(`\nSummary: ${differs} prediction(s) differ from observed behavior. A difference is recorded, not fixed.`);

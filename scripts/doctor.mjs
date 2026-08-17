#!/usr/bin/env node
// doctor.mjs — environment + recipe-status checker for The Reallocation Engine.
// "Is this repo runnable today, and where does each recipe stand?"
//
//   node scripts/doctor.mjs            # full report
//   node scripts/doctor.mjs --strict   # exit 1 if a required tool or command target is missing
//
// Read-only. Reports; never changes anything (machine half of P4: it tells you
// what's well-formed and present; adequacy is still the human gate).

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const strict = process.argv.includes('--strict');
const ok = (b) => (b ? '✓' : '✗');
let hardFail = false;

function ver(cmd) { try { return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return null; } }
function has(mod) { try { execSync(`node -e "require.resolve('${mod}')"`, { stdio: 'ignore' }); return true; } catch { return false; } }

console.log('RECIPE DOCTOR — The Reallocation Engine');
console.log('='.repeat(42));

// --- environment ----------------------------------------------------------
console.log('\nENVIRONMENT (required)');
const node = ver('node -v'), py = ver('python3 --version');
console.log(`  ${ok(!!node)} node       ${node || 'MISSING'}`);
console.log(`  ${ok(!!py)} python3    ${py || 'MISSING'}`);
if (!node || !py) hardFail = true;

console.log('\nENVIRONMENT (optional — features degrade without these)');
const pandoc = ver('pandoc -v'), soffice = ver('soffice --version');
console.log(`  ${pandoc ? '✓' : '—'} pandoc     ${pandoc ? pandoc.split('\n')[0] : 'not found (resume/PDF rendering)'}`);
console.log(`  ${soffice ? '✓' : '—'} libreoffice ${soffice ? 'present' : 'not found (PDF fallback)'}`);
console.log(`  ${has('playwright') ? '✓' : '—'} playwright ${has('playwright') ? 'installed' : 'not installed (ats:liveness needs it)'}`);

// --- runnable command targets exist --------------------------------------
console.log('\nRUNNABLE COMMANDS (npm script → target file present?)');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
  const m = cmd.match(/(?:node|python3?)\s+(\S+\.(?:mjs|js|py))/);
  if (!m) continue;
  const present = fs.existsSync(m[1]);
  if (!present) hardFail = true;
  console.log(`  ${ok(present)} ${name.padEnd(14)} ${m[1]}`);
}

// --- data + script dirs ---------------------------------------------------
console.log('\nDOMAIN DIRECTORIES');
for (const d of ['data/sec', 'data/bls', 'data/ats', 'data/80-days-to-stay', 'scripts/sec', 'scripts/bls', 'scripts/ats', 'scripts/resumes'])
  console.log(`  ${fs.existsSync(d) ? '✓' : '—'} ${d}`);

// --- privacy: no real personal data may be git-tracked --------------------
// This repo is public. A student's real résumé/tracker live in private/ and must
// never be committed. A tracked private path is a PII leak — hard fail.
console.log('\nPRIVACY (no personal data committed)');
let trackedFiles = [];
try { trackedFiles = execSync('git ls-files', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().split('\n').filter(Boolean); }
catch { console.log('  — not a git repo (skipped)'); }
if (trackedFiles.length) {
  // private zones: real personal data; scaffolding (policy/readme/examples) is OK to track.
  const inPrivateZone = (f) => /^private\//.test(f) || /^data\/ats\//.test(f);
  const isScaffold = (f) => /(^|\/)(README\.md|\.gitkeep|\.gitignore)$/i.test(f) || /\.example\./i.test(f);
  const isResumeArtifact = (f) => /\.resume\.(pdf|json)$|(^|\/)resume\.(json|pdf)$/i.test(f);
  const leaks = trackedFiles.filter((f) => (inPrivateZone(f) && !isScaffold(f)) || isResumeArtifact(f));
  if (leaks.length) {
    hardFail = true;
    console.log(`  ✗ ${leaks.length} private/PII path(s) are git-tracked — REMOVE before pushing:`);
    for (const f of leaks.slice(0, 10)) console.log(`      ${f}`);
    if (leaks.length > 10) console.log(`      … +${leaks.length - 10} more`);
    console.log('    fix: git rm --cached <file>; move it into private/; re-run npm run doctor');
  } else {
    console.log('  ✓ no private/PII paths are tracked');
  }
}

// --- recipe status dashboard ---------------------------------------------
const FM_KEYS = ['status', 'todos_open', 'last_gate', 'attestation', 'recipe_version'];
function frontmatter(txt) {
  if (!txt.startsWith('---')) return null;
  const end = txt.indexOf('\n---', 3);
  if (end < 0) return null;
  const fm = {};
  for (const line of txt.slice(3, end).trim().split('\n')) {
    const mm = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (mm) fm[mm[1]] = mm[2].trim();
  }
  return fm;
}

const recipes = fs.readdirSync('recipes')
  // .card.md files are the human half of a recipe/card pair (SNICKERDOODLE P5) —
  // they carry no AI-recipe lifecycle frontmatter by design and are exempt here,
  // same as README.md and *.template.* already were.
  .filter((f) => f.endsWith('.md') && f !== 'README.md' && !f.includes('.template.') && !f.endsWith('.card.md'));
const byStatus = {}; let withFm = 0, declaredTodos = 0, bodyTodos = 0;
const missing = [], mismatched = [];
for (const f of recipes) {
  const txt = fs.readFileSync(path.join('recipes', f), 'utf8');
  const fm = frontmatter(txt);
  const todoCount = (txt.match(/\[TODO/g) || []).length;
  bodyTodos += todoCount;
  if (!fm || !fm.status) { missing.push(f); continue; }
  withFm++;
  byStatus[fm.status] = (byStatus[fm.status] || 0) + 1;
  const dec = parseInt(fm.todos_open, 10);
  if (!Number.isNaN(dec)) { declaredTodos += dec; if (dec !== todoCount) mismatched.push(`${f} (declares ${dec}, body has ${todoCount})`); }
}

console.log(`\nRECIPES (${recipes.length})`);
console.log(`  with lifecycle frontmatter: ${withFm}   missing: ${missing.length}`);
console.log(`  by status: ${Object.entries(byStatus).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}`);
console.log(`  open TODOs: ${declaredTodos} declared (in frontmatter) · ${bodyTodos} [TODO markers in bodies`);
if (mismatched.length) {
  console.log(`  ! todos_open mismatch (${mismatched.length}):`);
  for (const m of mismatched.slice(0, 6)) console.log(`      ${m}`);
  if (mismatched.length > 6) console.log(`      … +${mismatched.length - 6} more`);
}
if (missing.length) {
  console.log(`  ! missing frontmatter (${missing.length}) — add: status / todos_open / last_gate / attestation / recipe_version`);
  for (const m of missing.slice(0, 8)) console.log(`      ${m}`);
  if (missing.length > 8) console.log(`      … +${missing.length - 8} more`);
}

// --- summary --------------------------------------------------------------
console.log('\nSUMMARY');
console.log(`  environment: ${hardFail ? '✗ a required tool or command target is missing' : '✓ runnable'}`);
console.log(`  recipes: ${withFm}/${recipes.length} carry lifecycle frontmatter` + (missing.length ? ` — ${missing.length} need it (gap toward DRAFT→VERIFIED discipline)` : ' — all tracked'));
console.log(`  next: ${missing.length ? 'backfill recipe frontmatter' : (Object.values(byStatus).every(() => byStatus.DRAFT === recipes.length) ? 'promote a recipe past DRAFT with a logged run' : 'continue')}`);

if (strict && hardFail) process.exit(1);

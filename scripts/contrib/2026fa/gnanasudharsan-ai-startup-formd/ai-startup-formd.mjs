#!/usr/bin/env node
// ai-startup-formd.mjs — AI-startup triage with funding health and visa timeline as GATES.
// Recipe: recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md
//
// For a pre-OPT student who will need H-1B sponsorship and is targeting AI Engineer roles
// at funded startups. Reads local repo data only, decides which postings may be scored,
// runs the REAL scorer (scripts/score/role-scorer.mjs — CLI, not a copy), and writes a
// JSON log (agent) and a Markdown report (human). Every value carries a source label:
//   record          — read from a repo data file or a saved tool output
//   model-judgment  — a rule this script applies that a human could disagree with
//   your-input      — stated by the student (fit rating, gate clearance)
//
// Gates are hard stops, never weights. A posting that fails one is EXCLUDED or HELD with
// a reason code and is NOT sent to the scorer. Nothing here fills a missing value.
//
// Offline: liveness comes from a SAVED `npm run ats:liveness` output; this script never
// fetches anything.
//
//   node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs \
//     --as-of YYYY-MM-DD --postings <postings.json> --liveness <liveness.txt> --out-dir <dir> \
//     [--clearance <clearance.json>] [--csv <path>] [--formd-dir <dir>] [--bls <path>]
//
// Exit codes: 0 ok · 2 bad input · 3 scorer misread the profile (sponsorship weight zeroed)
// · 4 scorer failed · 5 run refused: funding snapshot older than the staleness window.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const SCORER = path.join(REPO, 'scripts/score/role-scorer.mjs');

const DEFAULTS = {
  csv: 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv',
  formdDir: 'data/sec/form-d/processed/sample',
  bls: 'data/bls/compact/soc_occupation_compact.csv',
};

// ── Human decisions ([TODO: DEFINE] closures). Who/what/when is recorded in the recipe's
// closure table and the logs/runs/ entry; the values are repeated here so the run log
// can print exactly what was in force.
export const DECISIONS = {
  staleness_months: 24,          // latest round must be within 24 months of --as-of
  min_funding_amount: 5_000_000, // latest_funding_amount floor; latest_funding_stage is NOT used
  runway_months: 24,             // assumed runway after the latest round
  anchor_filing: '2027-04-01',   // H-1B cap petition filing window (CANNOT-VERIFY floor)
  anchor_start: '2027-10-01',    // H-1B employment start (PASS floor)
  decided_by: 'Gnanasudharsan Ashokumar',
  decided_on: '2026-10-20',
};

// AI title family (decided list, whole-word match).
export const AI_TITLE = /\b(ai|ml|llm|machine learning|deep learning|computer vision|nlp|applied scientist|research engineer)\b/gi;
// model-judgment: a match carried only by a bare "ai"/"ml" token in a title with no
// engineering/research word is flagged for human review (e.g. "Operations Manager - AI").
// The flag is a warning; it changes no gate.
const ROLE_WORD = /\b(engineer|engineering|scientist|research|researcher|developer)\b/i;

// SOC rows shown as labeled context. They never move a decision: the scorer's
// role_quality weight is 0.0 (scripts/score/role-scorer.mjs CONFIG.weights).
export const CONTEXT_SOC = ['15-1252', '15-2051', '15-1221', '15-1299'];

const PROFILE = { note: 'written by ai-startup-formd.mjs; no authorization text on purpose — role-scorer.mjs applyProfile then treats the candidate as needing sponsorship, and this script exits 3 if the scorer reads it otherwise' };
const CLEARED_VERDICT = 'HOLD — runway unverified';

// ── company-name normalisation: same port of normalize_company_name() in
// scripts/sec/sec-all-quarters.py (suffix list at :10, function at :34) used by the
// de-mlops-h1b contribution, so CSV names and Form D company_name_normalized are
// compared by the SAME rule. Exact match only.
const SUFFIXES = [/\s+inc\.?$/i, /\s+incorporated$/i, /\s+llc\.?$/i, /\s+l\.?l\.?c\.?$/i, /\s+ltd\.?$/i,
  /\s+limited$/i, /\s+corp\.?$/i, /\s+corporation$/i, /\s+co\.?$/i, /\s+company$/i, /\s+l\.?p\.?$/i,
  /\s+lp$/i, /\s+plc\.?$/i];
export function normalizeCompany(name) {
  let c = String(name ?? '').trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const s of SUFFIXES) { const r = c.replace(s, ''); if (r !== c) { c = r.trim(); changed = true; } }
  }
  return c.replace(/[,.\s\-&']/g, '').toLowerCase() || null;
}

// ── minimal RFC-4180 CSV parser (quoted fields, embedded commas/newlines). No deps.
// Each record keeps `_line`: the physical line it starts on (header = line 1).
export function parseCsv(text) {
  const rows = []; let row = []; let f = ''; let q = false; let line = 1; let start = 1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else { if (ch === '\n') line++; f += ch; }
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(f); f = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(f); rows.push({ cells: row, line: start }); row = []; f = ''; line++; start = line;
    } else f += ch;
  }
  if (f !== '' || row.length) { row.push(f); rows.push({ cells: row, line: start }); }
  const kept = rows.filter((r) => r.cells.length > 1 || r.cells[0] !== '');
  const [head, ...body] = kept;
  return body.map((r) => ({ ...Object.fromEntries(head.cells.map((h, i) => [h, r.cells[i] ?? ''])), _line: r.line }));
}

// top_job_titles_sponsored is a Python-list string: "['A', 'B']". Read quoted items only.
export function parseTitles(s) {
  return [...String(s || '').matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => (m[1] ?? m[2]).trim()).filter(Boolean);
}

export function aiTitleMatch(title) {
  const terms = [...String(title || '').matchAll(AI_TITLE)].map((m) => m[1].toLowerCase());
  if (!terms.length) return { match: false, terms: [], weak: false };
  const weak = terms.every((t) => t === 'ai' || t === 'ml') && !ROLE_WORD.test(title);
  return { match: true, terms: [...new Set(terms)], weak };
}

// Saved `npm run ats:liveness` stdout → Map(url → status). Conflicting lines → 'conflict'.
export function parseLiveness(text) {
  const m = new Map();
  for (const line of String(text).split(/\r?\n/)) {
    const hit = line.match(/^\S+\s+(active|expired|uncertain)\s+(\S+)\s*$/u);
    if (!hit) continue;
    const [, status, url] = hit;
    m.set(url, m.has(url) && m.get(url) !== status ? 'conflict' : status);
  }
  return m;
}

// ── dates (UTC, date-only)
export function parseDate(s) {
  if (typeof s !== 'string') return null;
  const t = s.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const d = new Date(`${t}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== t ? null : d;
}
const MON = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
// Form D processed JSON uses "31-MAR-2026".
export function parseFormDDate(s) {
  const m = String(s || '').trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m || !MON[m[2].toUpperCase()]) return null;
  return parseDate(`${m[3]}-${String(MON[m[2].toUpperCase()]).padStart(2, '0')}-${m[1].padStart(2, '0')}`);
}
export const iso = (d) => d.toISOString().slice(0, 10);
// Calendar months; the day is clamped to the target month's length (Jan 31 + 1 → Feb 28/29).
export function addMonths(d, n) {
  const y = d.getUTCFullYear(); const mo = d.getUTCMonth() + n;
  const ty = y + Math.floor(mo / 12); const tm = ((mo % 12) + 12) % 12;
  const last = new Date(Date.UTC(ty, tm + 1, 0)).getUTCDate();
  return new Date(Date.UTC(ty, tm, Math.min(d.getUTCDate(), last)));
}

export function timelineState(fundingDate, decisions = DECISIONS) {
  const end = addMonths(fundingDate, decisions.runway_months);
  const state = end >= parseDate(decisions.anchor_start) ? 'PASS'
    : end >= parseDate(decisions.anchor_filing) ? 'CANNOT-VERIFY' : 'FAIL';
  return { state, runway_end: iso(end) };
}

const num = (s) => {
  const t = String(s ?? '').trim();
  if (!t) return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
};

// ── Form D sample records → Map(normalized name → [{date, file, name, industry}])
export function loadFormD(dir) {
  const out = new Map();
  if (!dir || !fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const c of doc.companies || []) {
      const key = c.company?.company_name_normalized || normalizeCompany(c.company?.name);
      const date = parseFormDDate(c.filing?.date_filed);
      if (!key || !date) continue;
      if (!out.has(key)) out.set(key, []);
      out.get(key).push({ date: iso(date), file: f, name: c.company?.name, industry: c.company?.industry ?? null });
    }
  }
  return out;
}

// ── Company-level gates. Returns { status: 'ok'|'STOP'|'FAIL', reason, ... }.
// Order: stop conditions first (fund, blank date, blank amount), then funding gates
// (minimum, staleness), then the three-state visa timeline.
export function evaluateCompany(row, ctx) {
  const { asOf, snapshot, formd, decisions = DECISIONS } = ctx;
  const base = { company: row.company_name, csv_line: row._line, industry: row.industry || null,
    latest_funding_date: row.latest_funding_date || null, latest_funding_amount: num(row.latest_funding_amount) };
  if (/pooled investment fund/i.test(row.industry || '')) return { ...base, status: 'STOP', reason: 'pooled-investment-fund' };
  const csvDate = parseDate(row.latest_funding_date);
  if (!csvDate) return { ...base, status: 'STOP', reason: 'funding-date-blank' };
  const amount = num(row.latest_funding_amount);
  if (amount == null) return { ...base, status: 'STOP', reason: 'funding-amount-blank' };
  if (amount < decisions.min_funding_amount) return { ...base, status: 'FAIL', reason: 'funding-below-minimum' };

  // Fresher evidence: a Form D filing for the same normalized name dated after the
  // snapshot moves the effective funding date (model-judgment: a filing date stands in
  // for a funding-activity date).
  let effective = csvDate; let evidence = null;
  const hits = formd?.get(normalizeCompany(row.company_name)) || [];
  const newer = hits.filter((h) => h.date > iso(snapshot) && h.date > iso(csvDate)).sort((a, b) => (a.date < b.date ? 1 : -1));
  if (newer.length) {
    effective = parseDate(newer[0].date);
    evidence = { ...newer[0], source: 'model-judgment', basis: 'Form D filing date after the funding snapshot used as the effective funding date' };
  }
  const formdChecked = { matches: hits.length, newer_than_snapshot: newer.length };

  if (effective < addMonths(asOf, -decisions.staleness_months)) {
    return { ...base, status: 'FAIL', reason: 'funding-stale', effective_funding_date: iso(effective), formd: formdChecked, formd_evidence: evidence };
  }
  const t = timelineState(effective, decisions);
  return { ...base, status: t.state === 'FAIL' ? 'FAIL' : 'ok', reason: t.state === 'FAIL' ? 'runway-ends-before-filing' : null,
    timeline: t.state, runway_end: t.runway_end, effective_funding_date: iso(effective), formd: formdChecked, formd_evidence: evidence };
}

// ── Posting-level gates. Returns a posting record with status 'scored'|'held'|'excluded'.
export function evaluatePosting(p, ctx) {
  const { byName, liveness, clearance } = ctx;
  const rec = { posting_id: p.posting_id, company: p.company, title: p.title, url: p.url ?? null, reasons: [], warnings: [] };
  const fail = (r) => { rec.status = 'excluded'; rec.reasons.push(r); return rec; };
  const hold = (r) => { rec.reasons.push(r); };

  const rows = byName.get(normalizeCompany(p.company)) || [];
  if (rows.length === 0) { rec.status = 'held'; rec.reasons.push('company-unmatched'); return rec; }
  if (rows.length > 1) { rec.status = 'held'; rec.reasons.push('company-ambiguous'); rec.csv_lines = rows.map((r) => r._line); return rec; }
  const row = rows[0];
  rec.csv_line = row._line;
  const co = evaluateCompany(row, ctx);
  rec.company_gate = co;
  if (co.status !== 'ok') return fail(co.reason);
  // No posting supplied: nothing else about the posting can be judged, so report only that.
  if (!p.url) { rec.status = 'held'; rec.reasons.push('no-posting-supplied'); return rec; }

  const tm = aiTitleMatch(p.title);
  rec.title_match = tm;
  if (!tm.match) hold('title-not-ai');
  else if (tm.weak) rec.warnings.push('weak-title-match: only a bare "ai"/"ml" token matched — human review (model-judgment)');

  const live = liveness.get(p.url);
  rec.liveness = live ?? null;
  if (live === 'expired') return fail('liveness-expired');
  if (live == null) hold('liveness-not-run');
  else if (live === 'uncertain') hold('liveness-uncertain');
  else if (live === 'conflict') hold('liveness-conflict');

  const fit = p.fit;
  if (!fit || typeof fit.p !== 'number' || !(fit.p >= 0 && fit.p <= 1) || fit.source !== 'your-input') hold('fit-missing');

  const rate = num(row.Approval_Rate);
  if (rate == null) hold('sponsorship-record-missing');
  else if (rate < 0 || rate > 100) hold('approval-rate-out-of-range');

  let timelineSource = 'record';
  if (co.timeline === 'CANNOT-VERIFY') {
    const cleared = clearance && clearance.companies.map(normalizeCompany).includes(normalizeCompany(row.company_name));
    if (!cleared) hold('runway-unverified');
    else if (rec.liveness !== 'active') { /* clearance requires a live posting; the liveness reason above already holds it */ }
    else { timelineSource = 'your-input'; rec.cleared = { by: clearance.by, date: clearance.date, verdict: CLEARED_VERDICT }; }
  }

  if (rec.reasons.length) { rec.status = 'held'; return rec; }
  rec.status = 'scored';
  rec.role = {
    role_id: p.posting_id, company: row.company_name, title: p.title,
    sponsorship: { p: rate / 100, source: 'record', basis: `Approval_Rate ${rate}% (CSV line ${row._line}) ÷ 100` },
    fit: { p: fit.p, source: 'your-input', note: fit.note ?? null },
    liveness: { factor: 1, source: 'record', basis: `saved ats:liveness: active (${p.url})` },
    timeline: { factor: 1, source: timelineSource,
      basis: timelineSource === 'record' ? `runway to ${co.runway_end} reaches ${DECISIONS.anchor_start}` : `CANNOT-VERIFY cleared for sample scoring by ${clearance.by} on ${clearance.date}` },
  };
  return rec;
}

export function loadClearance(file) {
  if (!file) return null;
  const c = JSON.parse(fs.readFileSync(file, 'utf8'));
  const missing = ['gate', 'by', 'date', 'condition'].filter((k) => typeof c[k] !== 'string' || !c[k].trim());
  if (missing.length) throw new Error(`clearance is missing ${missing.join(', ')} — a gate clears only with who/what/when (P4)`);
  if (c.gate !== 'G-TIMELINE') throw new Error(`clearance gate must be G-TIMELINE, got ${c.gate}`);
  if (!parseDate(c.date)) throw new Error('clearance date must be YYYY-MM-DD');
  if (!Array.isArray(c.companies) || !c.companies.length) throw new Error('clearance must name the companies it covers');
  return c;
}

function blsContext(file) {
  if (!file || !fs.existsSync(file)) return { file, rows: [], missing: true };
  const rows = parseCsv(fs.readFileSync(file, 'utf8')).filter((r) => CONTEXT_SOC.includes(r.bls_soc_code));
  return { file, rows: rows.map((r) => ({ onet_soc_code: r.onet_soc_code, title: r.title, job_zone: r.job_zone,
    annual_median_wage: r.annual_median_wage, cognitive_pivot_score: r.cognitive_pivot_score, csv_line: r._line })) };
}

const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) throw new Error(`unexpected argument ${k}`);
    const v = argv[i + 1];
    if (v == null || v.startsWith('--')) throw new Error(`${k} needs a value`);
    a[k.slice(2)] = v; i++;
  }
  return a;
}

export function run(argv) {
  let args;
  try { args = parseArgs(argv); } catch (e) { return { code: 2, error: e.message }; }
  for (const k of ['as-of', 'postings', 'liveness', 'out-dir']) if (!args[k]) return { code: 2, error: `--${k} is required` };
  const asOf = parseDate(args['as-of']);
  if (!asOf) return { code: 2, error: '--as-of must be YYYY-MM-DD' };
  const csvPath = path.resolve(REPO, args.csv || DEFAULTS.csv);
  const formdDir = path.resolve(REPO, args['formd-dir'] || DEFAULTS.formdDir);
  const blsPath = path.resolve(REPO, args.bls || DEFAULTS.bls);
  const outDir = path.resolve(args['out-dir']);
  for (const f of [csvPath, args.postings, args.liveness]) if (!fs.existsSync(f)) return { code: 2, error: `file not found: ${f}` };

  let clearance;
  try { clearance = loadClearance(args.clearance); } catch (e) { return { code: 2, error: e.message }; }
  const postingsDoc = JSON.parse(fs.readFileSync(args.postings, 'utf8'));
  const postings = Array.isArray(postingsDoc) ? postingsDoc : postingsDoc.postings;
  if (!Array.isArray(postings)) return { code: 2, error: 'postings file must be an array or {postings:[...]}' };
  const ids = postings.map((p) => p.posting_id);
  if (ids.some((x) => !x) || new Set(ids).size !== ids.length) return { code: 2, error: 'every posting needs a unique posting_id' };

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const dates = rows.map((r) => parseDate(r.latest_funding_date)).filter(Boolean);
  if (!dates.length) return { code: 2, error: 'no parseable latest_funding_date in the CSV' };
  const snapshot = new Date(Math.max(...dates));
  const caveat = `computed from funding snapshot dated ${iso(snapshot)}; rounds after that date are not visible`;
  const inputs = { csv: { path: path.relative(REPO, csvPath), sha256: sha(csvPath), rows: rows.length },
    postings: { path: args.postings, sha256: sha(args.postings), count: postings.length },
    liveness: { path: args.liveness, sha256: sha(args.liveness) },
    clearance: args.clearance ? { path: args.clearance, sha256: sha(args.clearance) } : null,
    formd_dir: path.relative(REPO, formdDir), bls: path.relative(REPO, blsPath) };
  const log = { _tool: 'ai-startup-formd', recipe: 'recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md',
    generated_at: new Date().toISOString(), as_of: iso(asOf), decisions: DECISIONS, snapshot_date: iso(snapshot), caveat, inputs };

  fs.mkdirSync(outDir, { recursive: true });
  const staleCut = addMonths(asOf, -DECISIONS.staleness_months);
  if (snapshot < staleCut) {
    log.run_gate = { status: 'REFUSED', reason: 'cannot verify current runway',
      detail: `newest funding date in the dataset (${iso(snapshot)}) is older than the ${DECISIONS.staleness_months}-month window (cutoff ${iso(staleCut)})` };
    writeOutputs(outDir, log, null);
    return { code: 5, log };
  }
  log.run_gate = { status: 'OPEN', detail: `snapshot ${iso(snapshot)} is within the ${DECISIONS.staleness_months}-month window (cutoff ${iso(staleCut)})` };

  const byName = new Map();
  for (const r of rows) { const k = normalizeCompany(r.company_name); if (!k) continue; if (!byName.has(k)) byName.set(k, []); byName.get(k).push(r); }
  const formd = loadFormD(formdDir);
  const ctx = { asOf, snapshot, formd, byName, liveness: parseLiveness(fs.readFileSync(args.liveness, 'utf8')), clearance };

  // Screened universe (report context): H-1B employers whose sponsored-title history has an AI title.
  const universe = rows.filter((r) => String(r['Total Approvals'] ?? '').trim() && parseTitles(r.top_job_titles_sponsored).some((t) => aiTitleMatch(t).match));
  const screened = universe.map((r) => ({ ...evaluateCompany(r, ctx),
    ai_titles: parseTitles(r.top_job_titles_sponsored).filter((t) => aiTitleMatch(t).match),
    approvals: num(r['Total Approvals']), denials: num(r['Total Denials']), approval_rate: num(r.Approval_Rate) }));
  const counts = {};
  for (const s of screened) { const k = s.status === 'ok' ? s.timeline : `${s.status}:${s.reason}`; counts[k] = (counts[k] || 0) + 1; }
  log.screened = { definition: 'CSV rows with Total Approvals present and at least one AI title in top_job_titles_sponsored', total: universe.length, counts,
    timeline_evaluated: screened.filter((s) => s.timeline || s.reason === 'runway-ends-before-filing') };

  log.postings = postings.map((p) => evaluatePosting(p, ctx));
  log.bls_context = { note: 'context only — does not affect the score; the scorer role_quality weight is 0', ...blsContext(blsPath) };
  log.clearance = clearance;

  const roles = log.postings.filter((p) => p.status === 'scored').map((p) => p.role);
  log.scorer = { ran: false, eligible: roles.length };
  if (roles.length) {
    const rolesPath = path.join(outDir, 'roles.json');
    const profilePath = path.join(outDir, 'profile.json');
    fs.writeFileSync(rolesPath, JSON.stringify({ roles }, null, 2) + '\n');
    fs.writeFileSync(profilePath, JSON.stringify(PROFILE, null, 2) + '\n');
    const r = spawnSync(process.execPath, [SCORER, rolesPath, '--profile', profilePath, '--out-dir', outDir], { encoding: 'utf8' });
    log.scorer = { ran: true, eligible: roles.length, exit: r.status, stdout: r.stdout.trim(), stderr: r.stderr.trim(), command: `node scripts/score/role-scorer.mjs ${path.basename(rolesPath)} --profile ${path.basename(profilePath)} --out-dir <out-dir>` };
    if (r.status !== 0) { writeOutputs(outDir, log, null); return { code: 4, log }; }
    const scores = JSON.parse(fs.readFileSync(path.join(outDir, 'role-scores.json'), 'utf8'));
    if (scores.profile_needs_sponsorship !== true) { log.scorer.error = 'scorer did not read the profile as needing sponsorship'; writeOutputs(outDir, log, null); return { code: 3, log }; }
    const byId = new Map(scores.roles.map((s) => [s.role_id, s]));
    for (const p of log.postings.filter((x) => x.status === 'scored')) {
      const s = byId.get(p.posting_id);
      p.scorer = { composite: s?.composite ?? null, recommendation: s?.recommendation ?? null, reason: s?.reason ?? null };
      p.verdict = p.cleared ? CLEARED_VERDICT : s?.recommendation ?? null;
    }
  }
  writeOutputs(outDir, log, roles);
  return { code: 0, log };
}

// ── outputs: one JSON log for agents, one Markdown report for humans (P5).
function writeOutputs(outDir, log, roles) {
  fs.writeFileSync(path.join(outDir, 'ai-startup-formd-log.json'), JSON.stringify(log, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'ai-startup-formd-report.md'), renderReport(log));
}

const cell = (v) => (v == null || v === '' ? '' : String(v).replace(/\|/g, '\\|'));
const money = (v) => (v == null ? '' : `$${Math.round(v).toLocaleString('en-US')}`);

export function renderReport(log) {
  const o = [];
  o.push('# AI-startup triage — funding and visa-timeline gates', '');
  o.push('## Executive summary', '');
  if (log.run_gate?.status === 'REFUSED') {
    o.push('This report checks whether AI startups that have sponsored work visas before look funded well enough to still be operating when an H-1B petition would be filed and when the job would start. **This run refused to judge any company:** the funding data is too old to say anything about current runway, so every company is reported as "cannot verify current runway". Fresher funding data is needed before this report can help.', '');
  } else {
    const ps = log.postings || [];
    const n = (s) => ps.filter((p) => p.status === s).length;
    const sc = log.screened?.counts || {};
    o.push(`This report helps decide where to spend scarce application effort on AI Engineer roles at funded startups, for a student who will need H-1B sponsorship. A company is only considered if its last recorded funding round could plausibly carry it to the H-1B start date (${log.decisions.anchor_start}); job postings are only scored if they are confirmed live. Of ${log.screened?.total ?? 0} sponsoring employers with AI job titles, ${sc.PASS || 0} clear the funding and timeline checks outright, ${sc['CANNOT-VERIFY'] || 0} cannot be verified (their runway reaches the petition window but not the start date), and the rest fail or lack data. Of ${ps.length} postings supplied, ${n('scored')} were scored, ${n('held')} are on hold for a human, and ${n('excluded')} were excluded. Every funding conclusion is ${log.caveat}; a failed check means "not supported by local data", not "the company has closed".`, '');
  }
  o.push('## Run record', '');
  o.push(`- As of: ${log.as_of} · generated ${log.generated_at}`);
  o.push(`- Funding snapshot: ${log.snapshot_date} — ${log.caveat}`);
  o.push(`- Run gate: **${log.run_gate.status}** — ${log.run_gate.detail}`);
  o.push(`- Inputs: CSV \`${log.inputs.csv.path}\` (${log.inputs.csv.rows} rows, sha256 ${log.inputs.csv.sha256.slice(0, 12)}…) · postings \`${log.inputs.postings.path}\` · liveness \`${log.inputs.liveness.path}\` · clearance ${log.inputs.clearance ? `\`${log.inputs.clearance.path}\`` : 'none'} · Form D \`${log.inputs.formd_dir}\``);
  o.push('', '## Decisions in force (human, recorded)', '');
  const d = log.decisions;
  o.push('| Decision | Value |', '|---|---|');
  o.push(`| Funding staleness window | ${d.staleness_months} months before the as-of date |`);
  o.push(`| Minimum funding | latest round ≥ ${money(d.min_funding_amount)} (funding stage not used) |`);
  o.push(`| Runway assumption | ${d.runway_months} months after the latest round |`);
  o.push(`| Visa timeline | PASS if runway reaches ${d.anchor_start} · CANNOT-VERIFY if it reaches ${d.anchor_filing} but not ${d.anchor_start} · FAIL if it ends before ${d.anchor_filing} |`);
  o.push(`| Decided by | ${d.decided_by}, ${d.decided_on} |`);
  if (log.run_gate.status === 'REFUSED') return o.join('\n') + '\n';

  o.push('', '## Postings', '');
  o.push('| Posting | Company | Title | Status | Verdict | Reasons / warnings | Scorer (sample) |', '|---|---|---|---|---|---|---|');
  for (const p of log.postings) {
    const why = [...p.reasons, ...p.warnings].join('; ');
    const sc = p.scorer ? `${p.scorer.recommendation} (${p.scorer.composite?.toFixed?.(3) ?? ''})` : '';
    const verdict = p.status === 'scored' ? p.verdict : p.status === 'held' ? 'HOLD' : 'Skip';
    o.push(`| ${cell(p.posting_id)} | ${cell(p.company)} | ${cell(p.title)} | ${p.status} | **${cell(verdict)}** | ${cell(why)} | ${cell(sc)} |`);
  }
  if (log.clearance) {
    o.push('', `**Gate clearance in force (verbatim):** G-TIMELINE cleared by ${log.clearance.by} on ${log.clearance.date}. Condition: "${log.clearance.condition}" Covers: ${log.clearance.companies.join(', ')}. A cleared posting's verdict stays **${CLEARED_VERDICT}**; its scorer output is sample scoring only.`);
  }
  o.push('', '## Companies that reached the visa-timeline check', '');
  o.push(`Each row: ${log.caveat}.`, '');
  o.push('| Company (CSV line) | Latest round | Effective date | Runway ends | Timeline | Approvals / denials | Approval rate | AI titles sponsored | Form D sample |', '|---|---|---|---|---|---|---|---|---|');
  const order = { PASS: 0, 'CANNOT-VERIFY': 1 };
  const tl = [...log.screened.timeline_evaluated].sort((a, b) => (order[a.timeline] ?? 2) - (order[b.timeline] ?? 2));
  for (const s of tl) {
    const state = s.timeline || 'FAIL';
    const fd = s.formd_evidence ? `newer filing ${s.formd_evidence.date} (${s.formd_evidence.file})` : `${s.formd?.matches ?? 0} match(es), none newer`;
    o.push(`| ${cell(s.company)} (${s.csv_line}) | ${cell(s.latest_funding_date)}, ${money(s.latest_funding_amount)} | ${cell(s.effective_funding_date)} | ${cell(s.runway_end || '')} | **${state}** | ${cell(s.approvals)} / ${cell(s.denials)} | ${cell(s.approval_rate)} | ${cell(s.ai_titles.join('; '))} | ${cell(fd)} |`);
  }
  o.push('', 'Screened employers by outcome:', '');
  for (const [k, v] of Object.entries(log.screened.counts).sort()) o.push(`- ${k}: ${v}`);
  o.push('', '## Occupation context (does not affect the score)', '');
  o.push('Shown for orientation only. The scorer gives role quality a weight of 0, so none of these numbers moves a verdict. Blank cells are blank in the source.', '');
  o.push('| O*NET code | Title | Job zone | Annual median wage | Cognitive pivot score |', '|---|---|---|---|---|');
  for (const r of log.bls_context.rows) o.push(`| ${r.onet_soc_code} | ${cell(r.title)} | ${cell(r.job_zone)} | ${cell(r.annual_median_wage)} | ${cell(r.cognitive_pivot_score)} |`);
  o.push('', '## What this run cannot verify', '');
  o.push(`- Funding after ${log.snapshot_date}: rounds after the snapshot are invisible unless a local Form D sample record shows a newer filing.`);
  o.push('- Actual runway: the runway length is an assumption, not a record.');
  o.push('- Sponsorship volume: the approval rate measures petition outcomes, not how often a company sponsors (6 approvals and 102 approvals can both read 100%).');
  o.push('- Original postings: an aggregator page being live does not prove the employer\'s own posting is live.');
  o.push('- Fit: every fit value is the student\'s own judgment.');
  return o.join('\n') + '\n';
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const res = run(process.argv.slice(2));
  if (res.error) console.error(`ai-startup-formd: ${res.error}`);
  if (res.log) {
    const l = res.log;
    console.log(`run gate: ${l.run_gate.status} — ${l.run_gate.detail}`);
    if (l.postings) {
      const c = (s) => l.postings.filter((p) => p.status === s).length;
      console.log(`postings: ${l.postings.length} · scored ${c('scored')} · held ${c('held')} · excluded ${c('excluded')}`);
      console.log(`screened employers: ${l.screened.total} · ${JSON.stringify(l.screened.counts)}`);
      if (l.scorer.ran) console.log(l.scorer.stdout);
    }
  }
  process.exit(res.code);
}

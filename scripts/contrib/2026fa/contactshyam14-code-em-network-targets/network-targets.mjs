#!/usr/bin/env node
// network-targets.mjs — "network, don't apply" for an MS Engineering Management
// graduate on 12-month OPT, targeting SOC 13-1082 and 11-3051.
//
// Reads the 80 Days company table (H-1B record + funding columns), the BLS/O*NET
// compact file (SOC titles), the shipped SEC Form D samples, a persona (your-input)
// and liveness observations. Writes a roles.json, runs the EXISTING scorer
// (scripts/score/role-scorer.mjs, unmodified) on it, then sorts the scorer's
// verdicts into: apply · network · skip · check-liveness.
//
// It scores nothing itself — every Apply/Consider/Skip comes from the scorer's
// own role-scores.json. No network calls. No model calls.
//
// Every evidence value carries a label: record | your-input | model-judgment.
// A value this script derives takes the WEAKEST label of its inputs and lists
// what it was derived from — nothing derived is promoted to "record".
//
//   node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs \
//     [--persona p.json] [--liveness l.json] [--out-dir dir] [--as-of YYYY-MM-DD] \
//     [--csv file] [--soc-file file] [--formd-dir dir]
//
// Exit codes: 0 ok · 2 usage / out-dir refused · 3 input gate (G1) failed · 4 scorer failed.
// On exit 2 or 3 nothing is written.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const VERSION = '0.1.0';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const SCORER = path.join(REPO, 'scripts/score/role-scorer.mjs');

const DEFAULTS = {
  persona: path.join(HERE, 'inputs/persona.shyam.json'),
  liveness: path.join(HERE, 'inputs/liveness.json'),
  outDir: path.join(REPO, 'course/2026fa/submissions/contactshyam14-code/runs/latest'),
  csv: path.join(REPO, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv'),
  soc: path.join(REPO, 'data/bls/compact/soc_occupation_compact.csv'),
  formd: path.join(REPO, 'data/sec/form-d/processed/sample'),
};

// Real path of p even when its tail doesn't exist yet (resolves symlinks / 8.3 names).
function realish(p) {
  let cur = path.resolve(p); const rest = [];
  while (!fs.existsSync(cur)) { const up = path.dirname(cur); if (up === cur) break; rest.unshift(path.basename(cur)); cur = up; }
  return path.join(fs.realpathSync.native(cur), ...rest);
}
const caseKey = (p) => (process.platform === 'win32' ? p.toLowerCase() : p);
const inside = (p, root) => { const a = caseKey(realish(p)), r = caseKey(realish(root)); return a === r || a.startsWith(r + path.sep); };

// Outputs may only land in my own namespaces, or — for paths outside the repository —
// the OS temp dir (tests). Inside the repo, the namespaces are the only allowance even
// when the repo itself sits under the temp dir (an unzipped submission did, and the old
// "anything under tmp" rule let it write into data/examples/).
const OUT_ROOTS = [
  path.join(REPO, 'course/2026fa/submissions/contactshyam14-code'),
  HERE,
];
const outAllowed = (p) => (inside(p, REPO) ? OUT_ROOTS.some((r) => inside(p, r)) : inside(p, os.tmpdir()));

const LABEL = { record: 'record', input: 'your-input', model: 'model-judgment' };
const STRENGTH = { record: 3, 'your-input': 2, 'model-judgment': 1 };
const weakest = (...labels) => labels.reduce((w, l) => (STRENGTH[l] < STRENGTH[w] ? l : w));

const REQUIRED_COLUMNS = ['company_name', 'website', 'Total Approvals', 'Total Denials', 'Approval_Rate',
  'median_salary_offered', 'top_job_titles_sponsored', 'latest_funding_date', 'latest_funding_amount',
  'latest_funding_stage', 'total_funding'];
const OBSERVERS = { script: LABEL.record, person: LABEL.input, 'ai-agent': LABEL.model };
const RESULTS = { 'matching-open': 1, 'no-matching-open': 0, expired: 0 };

class Stop extends Error {
  constructor(gate, message, code = 3) { super(message); this.gate = gate; this.code = code; }
}

// ── small parsers ───────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const key = { '--persona': 'persona', '--liveness': 'liveness', '--out-dir': 'outDir', '--as-of': 'asOf',
      '--csv': 'csv', '--soc-file': 'soc', '--formd-dir': 'formd' }[a];
    if (!key) throw new Stop('usage', `unknown argument: ${a}`, 2);
    if (argv[i + 1] == null || argv[i + 1].startsWith('--')) throw new Stop('usage', `${a} needs a value`, 2);
    out[key] = argv[++i];
  }
  return out;
}

// RFC-4180-style CSV: quoted fields, doubled quotes, newlines inside quotes.
export function parseCsv(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(f); rows.push(row); row = []; f = '';
    } else f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

// top_job_titles_sponsored is a Python list repr: "['A', 'B', \"C's\"]".
export function parseTitleList(s) {
  const out = [];
  const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(s || ''))) out.push((m[1] ?? m[2]).replace(/\\(.)/g, '$1').trim());
  return out.filter(Boolean);
}

// Exact-match key for company names. No fuzzy matching, by design: a fuzzy
// join is what attached one H-1B record to CONVEY INC *and* COVEY INC.
const SUFFIXES = new Set(['inc', 'incorporated', 'llc', 'ltd', 'limited', 'corp', 'corporation', 'co', 'company', 'lp', 'plc']);
export function normalizeName(name) {
  const toks = String(name || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  while (toks.length > 1 && SUFFIXES.has(toks[toks.length - 1])) toks.pop();
  return toks.join('');
}

const normTitle = (t) => ` ${String(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

function readDate(s, what) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s || ''))) throw new Stop('G1', `${what} must be YYYY-MM-DD, got ${JSON.stringify(s)}`);
  const [y, m, d] = s.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d);
  if (new Date(t).getUTCDate() !== d) throw new Stop('G1', `${what} is not a real date: ${s}`);
  return t;
}
const daysBetween = (a, b) => Math.round((b - a) / 86400000);
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const rel = (p) => path.relative(REPO, p).split(path.sep).join('/');
const num = (s) => (s === '' || s == null || !isFinite(Number(s)) ? null : Number(s));

function readJson(file, what) {
  if (!fs.existsSync(file)) throw new Stop('G1', `${what} not found: ${rel(file)}`);
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { throw new Stop('G1', `${what} is not valid JSON (${rel(file)}): ${e.message}`); }
}

// ── loaders (all validation happens before anything is written) ─────────────

function loadPersona(file) {
  const p = readJson(file, 'persona file');
  const need = (cond, msg) => { if (!cond) throw new Stop('G1', `persona: ${msg}`); };
  need(p.visa && typeof p.visa === 'object', 'missing "visa"');
  need(p.visa.needs_sponsorship === true || p.visa.needs_sponsorship === false, 'visa.needs_sponsorship must be true or false');
  const end = readDate(p.visa.opt_end_date, 'persona visa.opt_end_date');
  if (p.visa.opt_start_date != null)
    need(readDate(p.visa.opt_start_date, 'persona visa.opt_start_date') < end, `visa.opt_start_date ${p.visa.opt_start_date} must be before visa.opt_end_date ${p.visa.opt_end_date}`);
  need(p.visa.unemployment_days_used == null || (Number.isInteger(p.visa.unemployment_days_used) && p.visa.unemployment_days_used >= 0),
    'visa.unemployment_days_used must be null or a non-negative integer');
  need(Array.isArray(p.targets) && p.targets.length > 0, '"targets" must list at least one SOC code');
  for (const t of p.targets) {
    need(/^\d{2}-\d{4}$/.test(t.soc || ''), `target SOC must look like 13-1082, got ${JSON.stringify(t.soc)}`);
    need(Array.isArray(t.keywords), `target ${t.soc}: "keywords" must be a list`);
  }
  const r = p.rules || {};
  need(r.tier && isFinite(r.tier.proven_min_approvals) && isFinite(r.tier.proven_min_rate) && isFinite(r.tier.likely_min_rate), 'rules.tier needs proven_min_approvals, proven_min_rate, likely_min_rate');
  need(r.tier_to_p && ['Proven', 'Likely', 'Possible'].every((k) => isFinite(r.tier_to_p[k])), 'rules.tier_to_p needs Proven, Likely, Possible');
  need(r.hiring_lag_days && r.hiring_lag_days.apply > 0 && r.hiring_lag_days.network > 0, 'rules.hiring_lag_days needs apply and network (> 0)');
  need(Number.isInteger(r.liveness_max_age_days) && r.liveness_max_age_days >= 0, 'rules.liveness_max_age_days must be a non-negative integer');
  need(Array.isArray(r.network_tiers), 'rules.network_tiers must be a list of tiers');
  need(Number.isInteger(r.recent_funding_months) && r.recent_funding_months > 0, 'rules.recent_funding_months must be a positive integer');
  return p;
}

function loadSocVocab(file, persona) {
  if (!fs.existsSync(file)) throw new Stop('G1', `SOC file not found: ${rel(file)}`);
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const head = rows[0] || [];
  const ix = Object.fromEntries(head.map((h, i) => [h, i]));
  for (const c of ['onet_soc_code', 'bls_soc_code', 'title', 'alternate_titles_sample'])
    if (!(c in ix)) throw new Stop('G1', `SOC file lacks column "${c}": ${rel(file)}`);
  const vocab = [];
  const socInfo = {};
  for (const t of persona.targets) {
    const hits = rows.slice(1).filter((r) => r[ix.bls_soc_code] === t.soc);
    if (!hits.length) throw new Stop('G1', `SOC code ${t.soc} has no row in ${rel(file)} — refusing to guess a title list for it`);
    socInfo[t.soc] = { title: hits.find((r) => r[ix.onet_soc_code].endsWith('.00'))?.[ix.title] ?? hits[0][ix.title], onet_rows: hits.map((r) => r[ix.onet_soc_code]), label: LABEL.record };
    for (const k of t.keywords) vocab.push({ soc: t.soc, phrase: k, ambiguous: false, label: LABEL.input, from: 'persona keyword' });
    for (const k of t.ambiguous_keywords || []) vocab.push({ soc: t.soc, phrase: k, ambiguous: true, label: LABEL.input, from: 'persona keyword (ambiguous)' });
    // "primary" (default): only the SOC's .00 O*NET row. Run 01 used every row and
    // 11-3051.01's "Quality Assurance Manager" pulled in software-QA titles.
    const primary = hits.filter((r) => r[ix.onet_soc_code].endsWith('.00'));
    const vocabRows = persona.bls_title_rows === 'all' || !primary.length ? hits : primary;
    if (persona.use_bls_titles !== false) {
      for (const r of vocabRows) {
        const code = r[ix.onet_soc_code];
        vocab.push({ soc: t.soc, phrase: r[ix.title].replace(/s$/i, ''), ambiguous: false, label: LABEL.record, from: `BLS/O*NET ${code} title` });
        for (const alt of (r[ix.alternate_titles_sample] || '').split(';').map((s) => s.trim()).filter(Boolean)) {
          const m = alt.match(/^(.*?)\s*\((.*)\)\s*$/);
          for (const phrase of m ? [m[1], m[2]] : [alt])
            vocab.push({ soc: t.soc, phrase, ambiguous: false, label: LABEL.record, from: `BLS/O*NET ${code} sample alternate title` });
        }
      }
    }
  }
  for (const v of vocab) v.norm = normTitle(v.phrase);
  return { vocab: vocab.filter((v) => v.norm.trim().length > 0), socInfo };
}

function loadCompanies(file) {
  if (!fs.existsSync(file)) throw new Stop('G1', `company CSV not found: ${rel(file)}`);
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const head = rows[0] || [];
  const ix = Object.fromEntries(head.map((h, i) => [h, i]));
  const missing = REQUIRED_COLUMNS.filter((c) => !(c in ix));
  if (missing.length) throw new Stop('G1', `company CSV lacks required column(s) ${missing.map((c) => `"${c}"`).join(', ')}: ${rel(file)}`);
  const ragged = rows.slice(1).filter((r) => r.length !== head.length).length;
  if (ragged) throw new Stop('G1', `company CSV has ${ragged} row(s) whose field count differs from the header — refusing to read shifted columns`);
  return rows.slice(1).map((r, i) => ({ line: i + 2, get: (c) => r[ix[c]] }));
}

// Two checks the shipped audits don't run. Both are computed from the file, every run.
function dataChecks(companies) {
  const h1b = companies.filter((c) => c.get('Total Approvals') !== '');
  const a = h1b.map((c) => num(c.get('Total Approvals'))).filter((x) => x != null);
  const d = h1b.map((c) => num(c.get('Total Denials'))).filter((x) => x != null);
  const odd = (xs) => xs.filter((x) => Number.isInteger(x) && x % 2 !== 0).length;
  const parity = {
    rows_with_h1b: h1b.length,
    approvals_odd: odd(a), approvals_even: a.length - odd(a),
    denials_odd: odd(d), denials_even: d.length - odd(d),
    label: LABEL.record,
  };
  parity.all_even = h1b.length >= 20 && parity.approvals_odd === 0 && parity.denials_odd === 0;
  parity.meaning = parity.all_even
    ? 'Every approval and denial count is even; real counts would be about half odd, so the absolute counts are probably doubled upstream (the approval rate is unaffected). Counts are shown as stored, not halved.'
    : 'no parity anomaly detected';
  const fp = new Map();
  for (const c of h1b) {
    const key = ['Total Approvals', 'Total Denials', 'median_salary_offered', 'top_job_titles_sponsored'].map((k) => c.get(k)).join('|');
    if (!fp.has(key)) fp.set(key, []);
    fp.get(key).push(c.get('company_name'));
  }
  const twinsOf = new Map();
  let groups = 0, involved = 0;
  for (const names of fp.values()) {
    if (names.length < 2) continue;
    groups++; involved += names.length;
    for (const n of names) twinsOf.set(n, names.filter((x) => x !== n));
  }
  return { parity, twins: { groups, companies_involved: involved, label: LABEL.record }, twinsOf };
}

function loadFormD(dir) {
  if (!fs.existsSync(dir)) throw new Stop('G1', `Form D sample directory not found: ${rel(dir)}`);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  if (!files.length) throw new Stop('G1', `no Form D sample files in ${rel(dir)}`);
  const byName = new Map();
  let records = 0;
  for (const f of files) {
    const j = readJson(path.join(dir, f), 'Form D sample');
    for (const c of j.companies || []) {
      records++;
      const k = normalizeName(c.company?.name);
      if (!byName.has(k)) byName.set(k, []);
      byName.get(k).push({
        file: rel(path.join(dir, f)),
        accession_number: c.accession_number ?? null,
        date_filed: c.filing?.date_filed ?? null,
        total_offering_amount: c.funding?.total_offering_amount ?? null,
        total_amount_sold: c.funding?.total_amount_sold ?? null,
        date_of_first_sale: c.funding?.date_of_first_sale ?? null,
        industry: c.company?.industry ?? null,
      });
    }
  }
  return { files: files.map((f) => rel(path.join(dir, f))), records, byName };
}

function loadLiveness(file) {
  const j = readJson(file, 'liveness file');
  const obs = Array.isArray(j) ? j : j.observations;
  if (!Array.isArray(obs)) throw new Stop('G1', `liveness file must hold an "observations" list: ${rel(file)}`);
  obs.forEach((o, i) => {
    if (!o || typeof o.company !== 'string' || !o.company.trim()) throw new Stop('G1', `liveness observation #${i + 1} has no company`);
    if (!(o.observed_by in OBSERVERS)) throw new Stop('G1', `liveness observation for "${o.company}": observed_by must be one of ${Object.keys(OBSERVERS).join(', ')}`);
    readDate(o.checked_on, `liveness observation for "${o.company}" checked_on`);
  });
  return obs;
}

// ── evidence → candidates ───────────────────────────────────────────────────

function matchTitles(titles, vocab) {
  const out = [];
  for (const title of titles) {
    const t = normTitle(title);
    for (const v of vocab) if (t.includes(v.norm)) out.push({ title, soc: v.soc, phrase: v.phrase, ambiguous: v.ambiguous, vocab_label: v.label, vocab_from: v.from });
  }
  return out;
}

function tierFor(approvals, rate, matches, rules) {
  const solid = matches.some((m) => !m.ambiguous);
  if (rate == null) return { tier: 'Possible', why: 'no approval rate on record' };
  if (solid && approvals != null && approvals >= rules.proven_min_approvals && rate >= rules.proven_min_rate)
    return { tier: 'Proven', why: `unambiguous title match, approvals ${approvals} ≥ ${rules.proven_min_approvals}, rate ${rate.toFixed(1)}% ≥ ${rules.proven_min_rate}%` };
  if (rate >= rules.likely_min_rate) {
    if (!solid) return { tier: 'Likely', why: 'only an ambiguous title match (capped at Likely)' };
    const short = [];
    if (approvals == null || approvals < rules.proven_min_approvals) short.push(`approvals ${approvals ?? '—'} < ${rules.proven_min_approvals}`);
    if (rate < rules.proven_min_rate) short.push(`rate ${rate.toFixed(1)}% < ${rules.proven_min_rate}%`);
    return { tier: 'Likely', why: `below the Proven bar: ${short.join(', ')}` };
  }
  return { tier: 'Possible', why: `approval rate ${rate.toFixed(1)}% < ${rules.likely_min_rate}%` };
}

function timeline(persona, asOfMs) {
  const v = persona.visa;
  const optEnd = readDate(v.opt_end_date, 'persona visa.opt_end_date');
  const daysToOptEnd = daysBetween(asOfMs, optEnd);
  if (daysToOptEnd <= 0) throw new Stop('G1', `OPT end date ${v.opt_end_date} is on or before the as-of date — refusing to score a window that has already closed`);
  // Optional start date: before it, no job can begin and the unemployment clock isn't running yet.
  const daysToStart = v.opt_start_date != null ? daysBetween(asOfMs, readDate(v.opt_start_date, 'persona visa.opt_start_date')) : null;
  const started = daysToStart == null ? null : daysToStart <= 0;
  let deadlineDays = daysToOptEnd, unemployment = 'not checked (persona gives no unemployment_days_used)';
  if (v.unemployment_days_used != null) {
    const left = 90 - v.unemployment_days_used;
    if (left <= 0) throw new Stop('G1', `unemployment_days_used ${v.unemployment_days_used} leaves no days under the 90-day OPT unemployment limit — refusing to score`);
    deadlineDays = Math.min(daysToOptEnd, (started === false ? daysToStart : 0) + left);
    unemployment = `${left} unemployment days left (90 − ${v.unemployment_days_used})${started === false ? `, counted from the OPT start ${v.opt_start_date}` : ''}`;
  }
  const factor = (lag) => Number(Math.min(1, Math.max(0, deadlineDays / lag)).toFixed(3));
  const lag = persona.rules.hiring_lag_days;
  return {
    opt_start_date: { value: v.opt_start_date ?? null, label: LABEL.input },
    opt_started: { value: started, label: LABEL.input, derived_from: 'opt_start_date and as-of date (both your-input); null when no start date is given' },
    days_to_opt_start: { value: started === false ? daysToStart : null, label: LABEL.input },
    opt_end_date: { value: v.opt_end_date, label: LABEL.input },
    days_to_opt_end: { value: daysToOptEnd, label: LABEL.input, derived_from: 'opt_end_date and as-of date (both your-input)' },
    unemployment,
    days_available: { value: deadlineDays, label: LABEL.input },
    apply: { factor: factor(lag.apply), hiring_lag_days: lag.apply, label: LABEL.input, formula: `min(1, ${deadlineDays} / ${lag.apply})` },
    network: { factor: factor(lag.network), hiring_lag_days: lag.network, label: LABEL.input, formula: `min(1, ${deadlineDays} / ${lag.network})` },
  };
}

function liveFor(company, observations, asOfMs, maxAge, used) {
  const key = normalizeName(company);
  const mine = observations.map((o, i) => ({ o, i })).filter(({ o }) => normalizeName(o.company) === key);
  if (!mine.length) return { status: 'hold', reason: 'no liveness observation' };
  mine.forEach(({ i }) => used.add(i));
  const { o } = mine.sort((a, b) => b.o.checked_on.localeCompare(a.o.checked_on))[0];
  const age = daysBetween(readDate(o.checked_on, 'checked_on'), asOfMs);
  let label = OBSERVERS[o.observed_by];
  const notes = [];
  if (o.observed_by === 'script' && !o.evidence) { label = LABEL.input; notes.push('script observation with no evidence file — treated as your-input'); }
  // The scan is a record of a board; that the board is THIS company's is a separate claim.
  if (o.board_identity === 'unconfirmed') { label = weakest(label, LABEL.model); notes.push('board identity unconfirmed (the ATS returns no board name) — liveness is a model-judgment until a person confirms the board'); }
  else if (/^person-confirmed\b/.test(o.board_identity || '')) { label = weakest(label, LABEL.input); notes.push(`board identity confirmed by a person (${o.board_identity}) — liveness carries that person's label`); }
  const base = { checked_on: o.checked_on, age_days: age, method: o.method || null, result: o.result, evidence: o.evidence || null, board_url: o.board_url || null, board_identity: o.board_identity || null, matching_postings: o.matching_postings || [], observed_by: o.observed_by, label, notes };
  if (age < 0) return { status: 'hold', reason: `observation dated after the as-of date (${o.checked_on})`, ...base };
  if (age > maxAge) return { status: 'hold', reason: `observation is ${age} days old (limit ${maxAge})`, ...base };
  if (!(o.result in RESULTS)) return { status: 'hold', reason: `result "${o.result}" is not a usable liveness result (unchecked or unknown)`, ...base };
  return { status: 'scored', factor: RESULTS[o.result], ...base };
}

// ── report ──────────────────────────────────────────────────────────────────

const esc = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function renderReport(log) {
  const b = (k) => log.candidates.filter((c) => c.bucket === k);
  const net = b('network'), app = b('apply'), hold = b('check-liveness'), skip = b('skip');
  const o = [];
  o.push(`# Network targets — ${log.persona.label_name} — ${log.run.as_of.value}`);
  o.push('\n## Executive summary\n');
  o.push(`This report sorts companies with a public record of sponsoring visas for project-management or production-management job titles into four groups: talk to them first because nothing matching is open yet, apply because a matching job is open, check their job board before deciding, or skip. It is for a master's graduate in engineering management on a twelve-month work permit ${log.timeline.opt_start_date.value ? `that runs from ${log.timeline.opt_start_date.value} to ${log.timeline.opt_end_date.value}${log.timeline.opt_started.value === false ? ` and has not started yet, so no job can begin before ${log.timeline.opt_start_date.value}` : ''}` : `that ends on ${log.timeline.opt_end_date.value}`}.`);
  o.push(`\nOf ${log.counts.candidates} matching companies: networking targets **${net.length}**; open matching job **${app.length}**; job board still to check **${hold.length}**; skipped **${skip.length}**. ${log.scorer.ran ? `The decision tool skipped ${log.scorer.skip_summary} — the networking targets are among those skips, because the tool skips any role with nothing open.` : 'The decision tool was not run, because no company had a usable job-board check yet.'}`);
  const warn = [];
  if (log.data_checks.parity.all_even) warn.push('every sponsorship count in the source table is an even number, so the counts are probably doubled — read them as relative sizes, not exact numbers');
  if (log.gates.G5_identity.companies.length) warn.push(`${log.gates.G5_identity.companies.length} of these companies share an identical sponsorship record with a differently named company, so the record may not be theirs`);
  if (log.formd.matched_candidates === 0) warn.push('none of the companies appears in the small sample of recent funding filings that ships with the repository — that is a gap in the sample, not evidence that they have no funding');
  if (warn.length) o.push(`\nRead before acting: ${warn.join('; ')}.`);
  o.push(`\nNothing here is a decision. Two checks belong to a person: confirming with the school's international-student office that a visa path exists after the work permit ends, before tailoring any application; and confirming the identity of any company flagged as sharing a record.`);

  o.push('\n## Gates waiting for a human\n');
  o.push(`- **Visa-path sign-off — ${log.gates.G4_visa_path.status}.** ${log.gates.G4_visa_path.question}`);
  o.push(`- **Identity check — ${log.gates.G5_identity.status}.** ${log.gates.G5_identity.companies.length ? log.gates.G5_identity.companies.map((c) => `${c.company} (shares its record with ${c.shares_with.join(', ')})`).join('; ') : 'no flagged company in this run'}.`);
  o.push(`- **Liveness — ${hold.length} held.** Companies without a fresh job-board check are not scored; a missing check is never treated as "open" or "closed".`);

  const row = (c) => `| ${esc(c.company)} | ${esc(c.evidence.matched_titles.value.join('; '))} | ${esc(c.evidence.soc.value.join(', '))} | ${c.evidence.tier.value} | ${c.evidence.approvals.value ?? '—'} / ${c.evidence.approval_rate.value == null ? '—' : c.evidence.approval_rate.value.toFixed(1) + '%'} | ${esc(c.evidence.latest_funding_date.value)}${c.evidence.recent_funding.value ? ' (recent)' : ''} | ${esc(c.evidence.formd_sample.value)} | ${c.liveness.result ?? '—'} [${c.liveness.label ?? '—'}] | ${[c.identity_check_required && '⚠ check identity', c.liveness.label === LABEL.model && '⚠ confirm board'].filter(Boolean).join('; ')} |`;
  const header = '| Company | Sponsored title(s) that matched [record] | SOC [your-input inference] | Tier [your-input rule] | Approvals / rate [record] | Latest funding [record] | Form D sample [record] | Liveness [label] | Flag |\n|---|---|---|---|---|---|---|---|---|';

  o.push('\n## Network first — sponsors with nothing matching open\n');
  o.push('Next action: ask for a 20-minute informational conversation about upcoming project/production roles and how they have handled H-1B sponsorship for them. This is networking time, not application time.\n');
  o.push(net.length ? `${header}\n${net.map(row).join('\n')}` : '_None in this run._');
  o.push('\n## Apply — a matching job is open\n');
  o.push('Next action: tailor an application **after** the visa-path sign-off. Fit to the posting was not assessed by this tool.\n');
  o.push(app.length ? `${header}\n${app.map(row).join('\n')}\n\n${app.map((c) => `- ${esc(c.company)}: scorer says **${c.scorer.recommendation}** — ${esc(c.scorer.reason)}; postings: ${c.liveness.matching_postings.map((p) => `${esc(p.title)}${p.location ? ` (${esc(p.location)})` : ''}${p.url ? ` <${p.url}>` : ''}`).join(', ') || '—'}`).join('\n')}` : '_None in this run._');
  o.push('\n## Check the job board first\n');
  o.push('Next action: find the company\'s real careers page (the website column in the source table is a guessed domain), check for a matching open role, and record the result.\n');
  o.push(hold.length ? hold.map((c) => `- ${esc(c.company)} — ${esc(c.liveness.reason)}; tier ${c.evidence.tier.value}; titles: ${esc(c.evidence.matched_titles.value.join('; '))}; ${c.evidence.website.value ? `listed website: ${esc(c.evidence.website.value)} (guessed upstream)` : 'no website listed'}`).join('\n') : '_None in this run._');
  o.push('\n## Skipped\n');
  o.push(skip.length ? skip.map((c) => `- ${esc(c.company)} — ${esc(c.skip_reason)}`).join('\n') : '_None in this run._');

  o.push('\n## Data warnings\n');
  const p = log.data_checks.parity;
  o.push(`- **Count parity:** ${p.approvals_even} of ${p.rows_with_h1b} approval counts and ${p.denials_even} of ${p.rows_with_h1b} denial counts are even. ${p.meaning}`);
  o.push(`- **Shared records:** ${log.data_checks.twins.groups} groups covering ${log.data_checks.twins.companies_involved} companies carry an identical sponsorship record (same approvals, denials, median salary and title list) under different names.`);
  o.push(`- **Form D sample:** ${log.formd.records} filings across ${log.formd.files.length} files (the first 50 of each quarter); ${log.formd.matched_candidates} of ${log.counts.candidates} candidates matched by exact normalized name. Absence from the sample is not evidence of no funding.`);
  o.push('- **Websites:** the source pipeline guesses domains from company names; a listed website is not a verified careers site.');
  o.push('- **Titles, not occupations:** the source table lists each company\'s top sponsored job titles (truncated), not the occupation codes actually filed. A company absent from this list may still sponsor these roles.');

  o.push('\n## Verified vs. inferred\n');
  o.push('| Term | Label | Where it comes from |\n|---|---|---|');
  o.push('| company name, sponsored titles, approvals, denials, approval rate, median salary, funding date/amount/stage, website | record | the 80 Days company table, row number in the log |');
  o.push('| Form D filing (or "not in sample") | record | the shipped Form D sample files, accession number in the log |');
  o.push('| count-parity and shared-record warnings | record | computed from the company table on this run |');
  o.push('| SOC assignment of a title | your-input | keyword list in the persona plus BLS/O*NET sample titles; the table does not record SOC codes |');
  o.push('| sponsorship tier and its scorer number | your-input | the persona\'s tier rule applied to record values; no record produces a probability |');
  o.push('| timeline factor | your-input | OPT end date, as-of date and hiring-lag assumptions from the persona |');
  o.push('| liveness | record / your-input / model-judgment | record only when a repository script produced it and its output is saved; a person\'s check is your-input; an AI\'s reading of a page is model-judgment |');
  o.push('| fit to a posting | — | not assessed |');

  o.push('\n## What this run cannot tell you\n');
  for (const s of log.cannot_verify) o.push(`- ${s}`);

  o.push('\n## Run record\n');
  o.push(`- Tool: em-network-targets v${log._version}; as-of ${log.run.as_of.value} [${log.run.as_of.label}]; generated ${log.run.generated_at}`);
  o.push(`- Persona: ${log.persona.label_name}; OPT start ${log.timeline.opt_start_date.value ?? 'not given'}${log.timeline.opt_started.value === false ? ` (in ${log.timeline.days_to_opt_start.value} days)` : ''}; OPT end ${log.timeline.opt_end_date.value}; ${log.timeline.unemployment}; days available ${log.timeline.days_available.value}; timeline factor apply ${log.timeline.apply.factor} (${log.timeline.apply.formula}), network ${log.timeline.network.factor} (${log.timeline.network.formula})`);
  for (const i of log.run.inputs) o.push(`- Input (${i.role}): \`${i.path}\` sha256 \`${i.sha256.slice(0, 16)}…\``);
  o.push(`- Scorer: ${log.scorer.ran ? `\`${log.scorer.command}\` → ${esc(log.scorer.stdout.trim().split('\n')[0])}` : `not run — ${log.scorer.why_not}`}`);
  if (log.unmatched_liveness_observations.length)
    o.push(`- Liveness observations that matched no candidate: ${log.unmatched_liveness_observations.map((u) => `${esc(u.company)} (${u.why})`).join('; ')}`);
  return o.join('\n') + '\n';
}

// ── main ────────────────────────────────────────────────────────────────────

export function run(argv) {
  const args = parseArgs(argv);
  const opt = { ...DEFAULTS, ...Object.fromEntries(Object.entries(args).map(([k, v]) => [k, k === 'asOf' ? v : path.resolve(v)])) };

  // out-dir guard: never write over a tracked repo file or outside my namespaces
  const outResolved = path.resolve(opt.outDir);
  if (!outAllowed(outResolved))
    throw new Stop('usage', `--out-dir ${rel(outResolved)} is outside this contribution's folders; refusing to write there`, 2);

  // G1 — every input validated before anything is written
  const asOfStr = args.asOf || today();
  const asOfMs = readDate(asOfStr, '--as-of');
  const persona = loadPersona(opt.persona);
  const { vocab, socInfo } = loadSocVocab(opt.soc, persona);
  const companies = loadCompanies(opt.csv);
  const observations = loadLiveness(opt.liveness);
  const formd = loadFormD(opt.formd);
  const tl = timeline(persona, asOfMs);
  const checks = dataChecks(companies);
  const rules = persona.rules;

  const used = new Set();
  const candidates = [];
  for (const c of companies) {
    if (c.get('Total Approvals') === '') continue;
    const titles = parseTitleList(c.get('top_job_titles_sponsored'));
    const matches = matchTitles(titles, vocab);
    if (!matches.length) continue;
    const name = c.get('company_name');
    const approvals = num(c.get('Total Approvals'));
    const rate = num(c.get('Approval_Rate'));
    const { tier, why } = tierFor(approvals, rate, matches, rules.tier);
    const fundDate = c.get('latest_funding_date');
    let recent = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(fundDate)) recent = daysBetween(readDate(fundDate, 'latest_funding_date'), asOfMs) <= rules.recent_funding_months * 30.44;
    const fd = formd.byName.get(normalizeName(name)) || [];
    const src = `${rel(opt.csv)}#L${c.line}`;
    const live = liveFor(name, observations, asOfMs, rules.liveness_max_age_days, used);
    const twins = checks.twinsOf.get(name) || [];
    candidates.push({
      role_id: `nt-${normalizeName(name)}-l${c.line}`,
      company: name,
      evidence: {
        matched_titles: { value: [...new Set(matches.map((m) => m.title))], label: LABEL.record, source: src },
        title_matches: matches.map((m) => ({ title: m.title, soc: m.soc, phrase: m.phrase, ambiguous: m.ambiguous, vocabulary: `${m.vocab_from} [${m.vocab_label}]` })),
        soc: { value: [...new Set(matches.map((m) => m.soc))], label: LABEL.input, derived_from: 'sponsored titles [record] matched against persona keywords [your-input] and BLS/O*NET titles [record]; the table records titles, not SOC codes' },
        approvals: { value: approvals, label: LABEL.record, source: src, caveat: checks.parity.all_even ? 'all counts in this file are even — probably doubled upstream' : null },
        denials: { value: num(c.get('Total Denials')), label: LABEL.record, source: src },
        approval_rate: { value: rate, label: LABEL.record, source: src },
        median_salary_offered: { value: num(c.get('median_salary_offered')), label: LABEL.record, source: src, caveat: 'company-wide, all sponsored roles — not this occupation' },
        tier: { value: tier, why, label: weakest(LABEL.record, LABEL.input), derived_from: 'approvals, approval rate, title matches [record] + persona tier rule [your-input]' },
        sponsorship_p: { value: rules.tier_to_p[tier], label: LABEL.input, derived_from: `persona tier_to_p mapping for tier ${tier}` },
        latest_funding_date: { value: fundDate || null, label: LABEL.record, source: src },
        latest_funding_amount: { value: num(c.get('latest_funding_amount')), label: LABEL.record, source: src },
        latest_funding_stage: { value: c.get('latest_funding_stage') || null, label: LABEL.record, source: src, caveat: 'stage is estimated by the upstream pipeline' },
        recent_funding: { value: recent, label: LABEL.input, derived_from: `latest_funding_date [record] within ${rules.recent_funding_months} months of the as-of date [your-input]` },
        formd_sample: fd.length
          ? { value: `${fd.length} filing(s); latest filed ${fd.map((f) => f.date_filed).sort().pop()}`, filings: fd, label: LABEL.record }
          : { value: 'not in shipped sample', label: LABEL.record, note: `absence from ${formd.records} sampled filings is not evidence of no funding` },
        website: { value: c.get('website') || null, label: LABEL.record, source: src, caveat: 'domain guessed from the company name by the upstream pipeline — not a verified careers site' },
      },
      liveness: live,
      identity_check_required: twins.length > 0,
      shares_record_with: twins,
    });
  }

  const unmatched = observations
    .map((o, i) => ({ o, i }))
    .filter(({ i }) => !used.has(i))
    .map(({ o }) => ({ company: o.company, checked_on: o.checked_on, why: companies.some((c) => normalizeName(c.get('company_name')) === normalizeName(o.company)) ? 'in the CSV but not a candidate (no H-1B record or no matching title)' : 'not in the company CSV' }));

  // roles.json for the EXISTING scorer — only candidates with a usable liveness observation
  const toScore = candidates.filter((c) => c.liveness.status === 'scored');
  const roles = toScore.map((c) => {
    const pathKey = c.liveness.factor > 0 ? 'apply' : 'network';
    c.timeline_path = pathKey;
    return {
      role_id: c.role_id,
      company: c.company,
      title: `${c.evidence.matched_titles.value[0]} (sponsored title per 80 Days CSV)`,
      sponsorship: { p: c.evidence.sponsorship_p.value, tier: c.evidence.tier.value, source: LABEL.input },
      liveness: { factor: c.liveness.factor, source: c.liveness.label },
      timeline: { factor: tl[pathKey].factor, source: LABEL.input },
    };
  });

  // nothing has been written yet; from here on we write into outDir only
  fs.mkdirSync(outResolved, { recursive: true });
  const rolesPath = path.join(outResolved, 'roles.json');
  fs.writeFileSync(rolesPath, JSON.stringify(roles, null, 2) + '\n');

  const scorer = { ran: false, command: null, stdout: '', why_not: null, skip_summary: null };
  let scoredById = new Map(), gateZero = null;
  if (!roles.length) {
    scorer.why_not = 'no candidate has a usable liveness observation, so there is nothing the scorer can decide';
  } else {
    scorer.command = `node ${rel(SCORER)} ${rel(rolesPath)} --out-dir ${rel(outResolved)}`;
    try {
      scorer.stdout = execFileSync(process.execPath, [SCORER, rolesPath, '--out-dir', outResolved], { cwd: REPO, encoding: 'utf8' });
    } catch (e) {
      throw new Stop('scorer', `the scorer failed: ${(e.stderr || e.message).toString().trim()}`, 4);
    }
    scorer.ran = true;
    const scores = JSON.parse(fs.readFileSync(path.join(outResolved, 'role-scores.json'), 'utf8'));
    gateZero = scores.config?.gate_zero;
    if (typeof gateZero !== 'number') throw new Stop('scorer', 'role-scores.json has no config.gate_zero — the scorer output shape changed', 4);
    scoredById = new Map(scores.roles.map((r) => [r.role_id, r]));
    const m = scorer.stdout.match(/Skip (\d+) \(skip (\d+)%\)/);
    scorer.skip_summary = m ? `${m[1]} of ${roles.length} scored roles (${m[2]}%)` : 'an unreported share';
  }

  // sort the scorer's verdicts into buckets (no re-scoring)
  for (const c of candidates) {
    if (c.liveness.status !== 'scored') { c.bucket = 'check-liveness'; continue; }
    const s = scoredById.get(c.role_id);
    if (!s) throw new Stop('scorer', `scorer output has no role ${c.role_id}`, 4);
    c.scorer = { recommendation: s.recommendation, machine_recommendation: s.machine_recommendation, composite: s.composite, reason: s.reason, arithmetic: s.trace.arithmetic };
    const liveGate = s.trace.gates.find((g) => g.factor === 'liveness');
    if (liveGate.multiplier > gateZero) {
      if (s.recommendation === 'Apply' || s.recommendation === 'Consider') c.bucket = 'apply';
      else { c.bucket = 'skip'; c.skip_reason = `matching job open, but the scorer says Skip — ${s.reason}`; }
    } else {
      if (s.recommendation !== 'Skip') throw new Stop('scorer', `${c.company}: liveness gate closed but the scorer did not skip — scorer behaviour changed`, 4);
      const tierOk = rules.network_tiers.includes(c.evidence.tier.value);
      const timeOk = tl.network.factor > gateZero;
      if (tierOk && timeOk) c.bucket = 'network';
      else { c.bucket = 'skip'; c.skip_reason = !tierOk ? `nothing open and tier ${c.evidence.tier.value} is not a networking tier` : `nothing open and the networking timeline (${tl.network.factor}) is closed`; }
    }
  }

  const order = { Proven: 0, Likely: 1, Possible: 2 };
  const ranked = (k) => candidates.filter((c) => c.bucket === k);
  const sortKey = (a, b) => (order[a.evidence.tier.value] - order[b.evidence.tier.value])
    || ((b.evidence.recent_funding.value ? 1 : 0) - (a.evidence.recent_funding.value ? 1 : 0))
    || (String(b.evidence.latest_funding_date.value || '').localeCompare(String(a.evidence.latest_funding_date.value || '')))
    || ((b.evidence.approval_rate.value ?? -1) - (a.evidence.approval_rate.value ?? -1));
  const sorted = ['network', 'apply', 'check-liveness', 'skip'].flatMap((k) => ranked(k).sort(sortKey));

  const log = {
    _tool: 'em-network-targets', _version: VERSION,
    run: {
      as_of: { value: asOfStr, label: LABEL.input },
      generated_at: new Date().toISOString(),
      inputs: [
        { role: 'persona', path: rel(opt.persona), sha256: sha256(opt.persona) },
        { role: 'liveness observations', path: rel(opt.liveness), sha256: sha256(opt.liveness) },
        { role: '80 Days company table', path: rel(opt.csv), sha256: sha256(opt.csv) },
        { role: 'BLS/O*NET compact', path: rel(opt.soc), sha256: sha256(opt.soc) },
        ...formd.files.map((f) => ({ role: 'SEC Form D sample', path: f, sha256: sha256(path.join(REPO, f)) })),
      ],
    },
    persona: { label_name: persona.name || 'persona', degree: persona.degree ?? null, visa_status: persona.visa.status ?? null, needs_sponsorship: persona.visa.needs_sponsorship, targets: persona.targets.map((t) => ({ soc: t.soc, bls_title: socInfo[t.soc].title, onet_rows: socInfo[t.soc].onet_rows })), label: LABEL.input },
    timeline: tl,
    gates: {
      G1_inputs: { status: 'pass' },
      G2_liveness: { held: candidates.filter((c) => c.bucket === 'check-liveness').length, scored: toScore.length },
      G3_timeline: { apply_factor: tl.apply.factor, network_factor: tl.network.factor, closed_below: gateZero ?? 'scorer not run' },
      G4_visa_path: {
        status: 'awaiting human sign-off',
        question: persona.visa.opt_start_date
          ? `OPT runs ${persona.visa.opt_start_date} to ${persona.visa.opt_end_date} with no STEM extension claimed. Before tailoring any application, a DSO or immigration attorney must confirm which H-1B registration cycle(s) fall inside that window, what happens if a registration is not selected, and whether STEM eligibility of the degree, a cap-exempt employer, or another status changes that. This tool cannot answer that.`
          : `OPT ends ${persona.visa.opt_end_date} with no STEM extension claimed. Before tailoring any application, a DSO or immigration attorney must confirm a path past that date (e.g. cap-exempt employer, STEM eligibility of the degree, another status). This tool cannot answer that.`,
        signed_by: null,
      },
      G5_identity: { status: candidates.some((c) => c.identity_check_required) ? 'awaiting human check' : 'nothing flagged', companies: candidates.filter((c) => c.identity_check_required).map((c) => ({ company: c.company, shares_with: c.shares_record_with })) },
    },
    data_checks: { parity: checks.parity, twins: checks.twins },
    formd: { files: formd.files, records: formd.records, matched_candidates: candidates.filter((c) => c.evidence.formd_sample.filings).length },
    scorer,
    counts: {
      companies_in_csv: companies.length,
      companies_with_h1b: checks.parity.rows_with_h1b,
      candidates: candidates.length,
      by_bucket: Object.fromEntries(['network', 'apply', 'check-liveness', 'skip'].map((k) => [k, ranked(k).length])),
      by_soc: Object.fromEntries(persona.targets.map((t) => [t.soc, candidates.filter((c) => c.evidence.soc.value.includes(t.soc)).length])),
      by_tier: Object.fromEntries(['Proven', 'Likely', 'Possible'].map((k) => [k, candidates.filter((c) => c.evidence.tier.value === k).length])),
    },
    cannot_verify: [
      'Whether a company will sponsor this person, for this role, now — the record is a rear-view mirror (years not stated in the source table).',
      'The SOC code actually filed for any sponsored title — the source table holds job titles only, and only the top few per company.',
      'The true size of any sponsorship count — every count in the file is even, which suggests doubling upstream.',
      'That a sponsorship record belongs to the named company — fuzzy joins upstream attached identical records to differently named companies.',
      'Funding for any company outside the 200 sampled Form D filings, or that a funding row in the source table belongs to the named company.',
      'That a listed website is the company\'s real careers site.',
      'Any visa-law conclusion — timeline factors are arithmetic on the person\'s own dates and assumptions.',
      'Fit between this person and any posting — not assessed.',
    ],
    unmatched_liveness_observations: unmatched,
    candidates: sorted,
  };

  fs.writeFileSync(path.join(outResolved, 'network-targets.json'), JSON.stringify(log, null, 2) + '\n');
  fs.writeFileSync(path.join(outResolved, 'network-targets.md'), renderReport(log));
  return { log, outDir: outResolved };
}

const invokedDirectly = process.argv[1] && caseKey(realish(process.argv[1])) === caseKey(realish(fileURLToPath(import.meta.url)));
if (invokedDirectly) {
  try {
    const { log, outDir } = run(process.argv.slice(2));
    const c = log.counts.by_bucket;
    console.log(`✓ ${log.counts.candidates} candidates from ${log.counts.companies_with_h1b} H-1B rows (${Object.entries(log.counts.by_soc).map(([k, v]) => `${k}: ${v}`).join(', ')})`);
    console.log(`  network ${c.network} · apply ${c.apply} · check-liveness ${c['check-liveness']} · skip ${c.skip}`);
    console.log(`  scorer: ${log.scorer.ran ? log.scorer.stdout.trim().split('\n')[0] : `not run — ${log.scorer.why_not}`}`);
    const t = log.timeline;
    console.log(`  OPT window: ${t.opt_start_date.value ?? '(start not given)'} → ${t.opt_end_date.value}${t.opt_started.value === false ? ` (starts in ${t.days_to_opt_start.value} days)` : ''}; ${t.days_available.value} days available; timeline factor apply ${t.apply.factor}, network ${t.network.factor}`);
    if (log.data_checks.parity.all_even) console.log(`  ! parity: all ${log.data_checks.parity.rows_with_h1b} approval and denial counts are even — counts probably doubled upstream`);
    if (log.gates.G5_identity.companies.length) console.log(`  ! identity check needed: ${log.gates.G5_identity.companies.map((x) => x.company).join(', ')}`);
    if (log.unmatched_liveness_observations.length) console.log(`  ! liveness observations with no candidate: ${log.unmatched_liveness_observations.map((u) => `${u.company} (${u.why})`).join('; ')}`);
    console.log(`  gate G4 visa-path: ${log.gates.G4_visa_path.status}`);
    console.log(`  wrote ${rel(path.join(outDir, 'network-targets.json'))} + network-targets.md + roles.json${log.scorer.ran ? ' + role-scores.json/.md' : ''}`);
  } catch (e) {
    if (e instanceof Stop) {
      console.error(`STOP (${e.gate}): ${e.message}`);
      if (e.code === 2 || e.code === 3) console.error('Nothing was written.');
      process.exit(e.code);
    }
    throw e;
  }
}

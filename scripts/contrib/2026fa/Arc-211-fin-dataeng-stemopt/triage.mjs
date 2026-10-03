#!/usr/bin/env node
// triage.mjs — finance data-engineering triage for a STEM-OPT master's graduate.
//
// Reads the 80 Days to Stay CSV, the BLS compact CSV, and the shipped Form D samples;
// labels every value record / model-judgment / your-input; computes the visa-timeline
// gate; writes a roles.json shaped like data/examples/ch11-roles.json; runs the EXISTING
// scorer (scripts/score/role-scorer.mjs) on it; and writes a JSON log (agent) plus a
// Markdown report (person). No network. No writes outside --out-dir.
//
// Usage (from repo root):
//   node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs \
//     [--config <config.json>] [--out-dir <dir>] [--as-of YYYY-MM-DD]
//
// Exit codes: 0 ok · 2 bad/missing input (gate G1) · 3 no target SOC found in BLS data.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const SCORER = path.join(REPO, 'scripts/score/role-scorer.mjs');
const L = { record: 'record', model: 'model-judgment', input: 'your-input' };

// ── tiny helpers ─────────────────────────────────────────────────────────────
function die(code, msg) { console.error(`✗ ${msg}`); process.exit(code); }
function arg(name, def) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : def; }
const v = (value, label, source) => ({ value, label, source }); // a labeled value
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  .replace(/(incorporated|inc|llc|corporation|corp|company|co|ltd|lp)$/, '');
const day = (s) => { const d = new Date(`${s}T00:00:00Z`); if (isNaN(d)) die(2, `bad date: ${s}`); return d; };
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const diffDays = (a, b) => Math.round((a - b) / 86400000);
const iso = (d) => d.toISOString().slice(0, 10);
const num = (s) => { const x = parseFloat(s); return Number.isFinite(x) ? x : null; };

// RFC-4180 CSV parser (quoted fields may contain commas, quotes, newlines).
function parseCsv(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { f += '"'; i++; }
      else if (c === '"') q = false;
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(f); rows.push(row); row = []; f = '';
    } else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0] !== '');
  return { head, rows: body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))) };
}

function readCsv(p, required) {
  if (!fs.existsSync(p)) die(2, `G1 input missing: ${path.relative(REPO, p)}`);
  const { head, rows } = parseCsv(fs.readFileSync(p, 'utf8'));
  const missing = required.filter((c) => !head.includes(c));
  if (missing.length) die(2, `G1 ${path.relative(REPO, p)} lacks required column(s): ${missing.join(', ')}`);
  return rows;
}

// ── load config + inputs (gate G1) ───────────────────────────────────────────
const cfgPath = path.resolve(arg('--config', path.join(HERE, 'config.json')));
if (!fs.existsSync(cfgPath)) die(2, `G1 config missing: ${path.relative(REPO, cfgPath)}`);
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const rel = (p) => (p == null ? null : path.resolve(REPO, p)); // config paths are repo-root relative
const asOf = day(arg('--as-of', cfg.as_of || iso(new Date())));
const outDir = path.resolve(arg('--out-dir', rel(cfg.out_dir)));
if (!outDir) die(2, 'no --out-dir and no out_dir in config');

const CSV_COLS = ['company_name', 'industry', 'Total Approvals', 'Total Denials', 'Approval_Rate',
  'median_salary_offered', 'top_job_titles_sponsored', 'latest_funding_date'];
const sponsorsAll = readCsv(rel(cfg.paths.sponsors_csv), CSV_COLS);
const bls = readCsv(rel(cfg.paths.bls_csv), ['onet_soc_code', 'title', 'oews_year', 'annual_median_wage']);

const formdDir = rel(cfg.paths.formd_dir);
if (!fs.existsSync(formdDir)) die(2, `G1 Form D directory missing: ${path.relative(REPO, formdDir)}`);
const formd = new Map(); const formdFiles = [];
for (const f of fs.readdirSync(formdDir).filter((x) => x.endsWith('.json')).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(formdDir, f), 'utf8'));
  formdFiles.push({ file: f, records: d.companies.length, quarter: d.metadata?.quarter, note: d.metadata?._sample });
  for (const c of d.companies) {
    const k = norm(c.company?.name);
    if (!formd.has(k)) formd.set(k, []);
    formd.get(k).push({ quarter: d.metadata?.quarter, offering: c.funding?.total_offering_amount ?? null, file: f });
  }
}
const readOpt = (p) => (p && fs.existsSync(rel(p)) ? JSON.parse(fs.readFileSync(rel(p), 'utf8')) : {});
const liveness = readOpt(cfg.paths.liveness_json);
const everify = readOpt(cfg.paths.everify_json);
const lookup = (obj, name) => obj[name] ?? Object.entries(obj).find(([k]) => norm(k) === norm(name))?.[1];

// ── BLS context for the target SOCs (record) ─────────────────────────────────
const blsRows = new Map(bls.map((r) => [r.onet_soc_code, r]));
const socs = cfg.target_socs.map((soc) => {
  const r = blsRows.get(soc);
  return r ? { soc, title: r.title, median: v(num(r.annual_median_wage), L.record, `BLS OEWS ${r.oews_year} national, ${cfg.paths.bls_csv}`), status: 'ok' }
    : { soc, status: 'missing', reason: 'no-occupation-row' };
});
if (!socs.some((s) => s.status === 'ok')) die(3, `none of the target SOCs (${cfg.target_socs.join(', ')}) has a row in ${cfg.paths.bls_csv}`);

// ── visa-timeline gate (G3) — every input is your-input ──────────────────────
function timeline() {
  const end = day(cfg.visa.program_end_date);
  const graceEnd = addDays(end, cfg.visa.grace_days_after_end);
  const optStart = day(cfg.visa.opt_start_date);
  const offer = addDays(asOf, cfg.visa.hiring_lag_days);
  const t = { as_of: iso(asOf), program_end: iso(end), filing_deadline: iso(graceEnd), opt_start_assumed: iso(optStart),
    hiring_lag_days: cfg.visa.hiring_lag_days, earliest_offer: iso(offer), unemployment_days: cfg.visa.unemployment_days };
  if (!cfg.visa.opt_filed && asOf > graceEnd)
    return { ...t, factor: 0, reason: `OPT not filed and the filing window closed on ${iso(graceEnd)}` };
  if (offer <= optStart) return { ...t, factor: 1, reason: 'offer lands before OPT starts — no unemployment days used' };
  const used = diffDays(offer, optStart);
  if (used >= cfg.visa.unemployment_days)
    return { ...t, factor: 0, reason: `earliest offer uses ${used} of ${cfg.visa.unemployment_days} unemployment days — window gone` };
  return { ...t, factor: +(1 - used / cfg.visa.unemployment_days).toFixed(3), reason: `earliest offer uses ${used} of ${cfg.visa.unemployment_days} unemployment days` };
}
const tl = timeline();

// ── candidate selection ──────────────────────────────────────────────────────
const industryRe = new RegExp(cfg.filters.industry_pattern, 'i');
const strongRe = new RegExp(cfg.filters.title_strong_pattern, 'i');
const weakRe = new RegExp(cfg.filters.title_weak_pattern, 'i');
const hasH1b = (r) => r['Total Approvals'].trim() !== '';
const byName = new Map(sponsorsAll.map((r) => [norm(r.company_name), r]));
const titlesOf = (r) => (r.top_job_titles_sponsored.match(/'([^']*)'|"([^"]*)"/g) || []).map((s) => s.slice(1, -1).trim());

let candidates; const census = {};
if (Array.isArray(cfg.candidates) && cfg.candidates.length) {
  candidates = cfg.candidates.map((name) => ({ name, row: byName.get(norm(name)) || null }));
  census.mode = 'named candidates (your-input list)';
} else {
  const ind = sponsorsAll.filter((r) => industryRe.test(r.industry));
  const withH = ind.filter(hasH1b);
  const matched = withH.filter((r) => titlesOf(r).some((t) => strongRe.test(t) || weakRe.test(t)));
  Object.assign(census, { mode: 'auto: industry filter + sponsored-title match',
    csv_rows: sponsorsAll.length, csv_rows_with_h1b: sponsorsAll.filter(hasH1b).length,
    industry_rows: ind.length, industry_rows_with_h1b: withH.length,
    industry_rows_h1b_blank: ind.length - withH.length, title_matched: matched.length });
  candidates = matched.map((r) => ({ name: r.company_name, row: r }));
  for (const name of cfg.extra_candidates || []) // your-input additions on top of the auto list
    if (!candidates.some((c) => norm(c.name) === norm(name))) candidates.push({ name, row: byName.get(norm(name)) || null });
}

// ── per-candidate evidence ───────────────────────────────────────────────────
const tierOf = (appr, rate) => {
  const t = cfg.sponsorship_tiers;
  if (appr >= t.proven.min_approvals && rate >= t.proven.min_approval_rate) return 'Proven';
  if (appr >= t.likely.min_approvals) return 'Likely';
  return 'Weak';
};

const evaluated = candidates.map(({ name, row }) => {
  const e = { company: name, csv: cfg.paths.sponsors_csv };
  if (!row) return { ...e, status: 'not-found', next_action: 'not-in-data', note: 'company not in the sponsorship CSV — no value invented' };

  // sponsorship (record counts; tier rule + p mapping are your-input)
  if (!hasH1b(row)) return { ...e, status: 'sponsorship-unknown', next_action: 'research-sponsorship',
    note: 'H-1B fields blank in the CSV — blank means unknown, NOT "never sponsored"; not scored' };
  const appr = num(row['Total Approvals']); const rate = num(row.Approval_Rate);
  const tier = tierOf(appr, rate);
  e.sponsorship = { approvals: v(appr, L.record, 'Total Approvals'), denials: v(num(row['Total Denials']), L.record, 'Total Denials'),
    approval_rate: v(rate, L.record, 'Approval_Rate'), tier: v(tier, L.input, 'tier rule in config.sponsorship_tiers'),
    p: v(cfg.sponsorship_tiers[tier.toLowerCase()].p, L.input, 'p mapping in config.sponsorship_tiers') };

  // fit — rule-based title match; a judgment, not a record
  const titles = titlesOf(row);
  const strong = titles.filter((t) => strongRe.test(t)); const weak = titles.filter((t) => !strongRe.test(t) && weakRe.test(t));
  e.sponsored_titles = v(titles, L.record, 'top_job_titles_sponsored (top titles only — not a full list)');
  // which of the company's past sponsored titles look like the target role (evidence about sponsorship, not fit)
  e.sponsored_title_match = v(strong.length ? 'strong' : weak.length ? 'weak' : 'none', L.model,
    `rule-based match on sponsored titles: ${[...strong, ...weak].join(' | ') || 'none'}`);

  // salary floor — applied OUTSIDE the scorer (role_quality weight is 0.0)
  const med = num(row.median_salary_offered);
  e.salary = { company_median_all_titles: v(med, L.record, 'median_salary_offered (all sponsored titles, not the data role)'),
    floor: v(cfg.salary_floor, L.input, 'config.salary_floor'),
    check: med == null ? 'unknown' : med >= cfg.salary_floor ? 'meets-floor' : 'below-floor' };

  // funding — context only (the scorer has no funding term)
  const fd = row.latest_funding_date ? day(row.latest_funding_date) : null;
  const months = fd ? Math.floor(diffDays(asOf, fd) / 30.44) : null;
  e.funding = { latest_funding_date: v(row.latest_funding_date || null, L.record, 'latest_funding_date (80 Days CSV)'),
    months_since: months, recent: months != null && months <= cfg.funding_recent_months,
    form_d_sample_hits: v(formd.get(norm(name)) || [], L.record, `Form D samples in ${cfg.paths.formd_dir} (first 50/quarter only)`) };

  // gates
  const lv = lookup(liveness, name);
  // method "manual" = the student looked at the page: their observation, not a checker record
  e.liveness = !lv ? v(null, L.record, 'not checked')
    : lv.method === 'manual' ? v(lv.result, L.input, `manual check of ${lv.url} (${lv.checked_on})${lv.note ? ` — ${lv.note}` : ''}`)
      : v(lv.result, L.record, `ats:liveness on ${lv.url} (${lv.checked_on}), transcribed`);
  if (lv?.posting_title) e.posting_title = v(lv.posting_title, L.input, 'title of the posting the student checked');

  // fit — rule-based title match; a judgment, not a record. Judged on the POSTING when one is recorded;
  // otherwise falls back to the company's sponsored titles (a weaker proxy, said so in the source).
  const fitOn = (t) => (strongRe.test(t) ? 'strong' : weakRe.test(t) ? 'weak' : 'none');
  const fitLevel = e.posting_title ? fitOn(e.posting_title.value) : e.sponsored_title_match.value;
  const fitBasis = e.posting_title ? `posting title "${e.posting_title.value}"` : `fallback — company's sponsored titles (${e.sponsored_title_match.source.split(': ')[1]})`;
  e.fit = fitLevel === 'none' ? v(null, L.model, `no target-role match on ${fitBasis} — no fit vote`)
    : v(cfg.fit[`${fitLevel}_p`], L.model, `rule-based ${fitLevel} match on ${fitBasis}`);
  e.timeline = v(tl.factor, L.input, tl.reason);
  const ev = lookup(everify, name);
  // method "e-verify.gov" = a government record transcribed by hand; anything else is the student's own claim
  e.everify = !ev ? v('unknown', L.input, '[TODO: DATA SOURCE] no E-Verify data in repo')
    : ev.method === 'e-verify.gov' ? v(ev.status, L.record, `E-Verify Employer Search "${ev.search_term}" (${ev.checked_on}), transcribed: ${(ev.matched || []).length} matching record(s)${ev.caveat ? ` — ${ev.caveat}` : ''}`)
      : v(ev.status, L.input, `manual claim ${ev.checked_on || ''}`.trim());

  if (e.salary.check === 'below-floor') return { ...e, status: 'below-floor', next_action: 'skip' };
  // a closed timeline gate stops everything — no point checking postings that cannot be taken
  if (tl.factor === 0 && (!lv || lv.result === 'uncertain')) return { ...e, status: 'timeline-closed', next_action: 'skip',
    note: `timeline gate closed (${tl.reason}) — not worth checking the posting` };
  if (!lv || lv.result === 'uncertain') return { ...e, status: 'needs-liveness-check', next_action: 'check-posting-by-hand',
    note: lv ? 'liveness result was uncertain' : 'no liveness check recorded — not sent to the scorer (it would default to 1.0)' };
  return { ...e, status: 'scored' };
});

// ── build roles.json and run the EXISTING scorer ─────────────────────────────
fs.mkdirSync(outDir, { recursive: true });
const toScore = evaluated.filter((e) => e.status === 'scored');
const roles = toScore.map((e) => ({
  role_id: norm(e.company), company: e.company, title: e.posting_title?.value || 'Data engineer / BI analyst (no posting title recorded)',
  sponsorship: { p: e.sponsorship.p.value, tier: e.sponsorship.tier.value, source: L.record,
    derivation: `approvals ${e.sponsorship.approvals.value}, rate ${e.sponsorship.approval_rate.value}% [record] → tier/p by your-input rule` },
  ...(e.fit.value != null ? { fit: { p: e.fit.value, source: L.model } } : {}),
  liveness: { factor: e.liveness.value === 'active' ? 1 : 0, source: e.liveness.label },
  timeline: { factor: tl.factor, source: L.input },
}));
const rolesPath = path.join(outDir, 'roles.json');
fs.writeFileSync(rolesPath, JSON.stringify(roles, null, 2) + '\n');

let scorer = { ran: false, reason: 'no candidate passed the pre-checks — scorer not called' };
if (roles.length) {
  const stdout = execFileSync(process.execPath, [SCORER, rolesPath, '--out-dir', outDir], { cwd: REPO, encoding: 'utf8' });
  const out = JSON.parse(fs.readFileSync(path.join(outDir, 'role-scores.json'), 'utf8'));
  scorer = { ran: true, command: `node scripts/score/role-scorer.mjs ${path.relative(REPO, rolesPath)} --out-dir ${path.relative(REPO, outDir)}`, stdout: stdout.trim() };
  for (const r of out.roles) {
    const e = toScore.find((x) => norm(x.company) === r.role_id);
    e.score = { composite: r.composite, recommendation: r.recommendation, reason: r.reason, arithmetic: r.trace?.arithmetic };
    const strongSponsor = e.sponsorship.tier.value === 'Proven';
    if (r.recommendation !== 'Skip' && e.fit.value == null) e.next_action = 'review-role-fit'; // your-input rule: sponsorship alone can clear 0.3
    else if (r.recommendation === 'Skip') e.next_action = e.liveness.value === 'expired' && strongSponsor ? 'network-into-company' : 'skip';
    else if (e.everify.value === 'not-enrolled') e.next_action = 'network-only (no E-Verify → STEM extension impossible)';
    else if (e.everify.value === 'confirmed') e.next_action = 'tailor-application';
    else e.next_action = 'verify-everify-then-tailor';
  }
}

// ── outputs: JSON log (agent) + Markdown report (person) ─────────────────────
const count = (k) => evaluated.filter((e) => e.next_action === k).length;
const log = {
  _tool: 'Arc-211-fin-dataeng-stemopt/triage.mjs', generated: new Date().toISOString(), as_of: iso(asOf),
  config: path.relative(REPO, cfgPath), inputs: { sponsors_csv: cfg.paths.sponsors_csv, bls_csv: cfg.paths.bls_csv, formd_samples: formdFiles,
    liveness_json: cfg.paths.liveness_json, everify_json: cfg.paths.everify_json },
  data_mode: 'sample — Form D is the shipped 50-per-quarter sample only', census, target_socs: socs, timeline_gate: tl,
  scorer, results: evaluated,
};
fs.writeFileSync(path.join(outDir, 'triage-log.json'), JSON.stringify(log, null, 2) + '\n');

const fmt$ = (x) => (x == null ? '—' : `$${Math.round(x).toLocaleString('en-US')}`);
const lines = [];
lines.push(`# Finance data-engineering triage — ${iso(asOf)}`, '', '## Executive summary', '',
  `This report sorts ${evaluated.length} employer(s) into what to do next for a STEM-OPT master's graduate targeting data-engineering and business-intelligence roles. ` +
  `Each employer was checked against past visa-sponsorship records, the job titles it actually sponsored, its recorded pay level, recent funding, and the visa calendar. ` +
  `Result: ${count('tailor-application') + count('verify-everify-then-tailor')} worth tailoring an application to (after an E-Verify check where unknown), ` +
  `${count('review-role-fit')} where the posting itself may not be a target role, ${count('network-into-company')} to network into, ${count('check-posting-by-hand')} whose job posting still needs checking by hand, ` +
  `and ${count('skip')} to skip. Nothing here is a hiring prediction; every number below says where it came from, and the final call is yours.`, '');
lines.push('## Run record', '', `- As of: ${iso(asOf)} · data mode: **sample** (Form D = shipped samples only)`,
  `- Sponsorship CSV: \`${cfg.paths.sponsors_csv}\``, `- Scorer: ${scorer.ran ? `\`${scorer.command}\`` : scorer.reason}`, '');
if (census.csv_rows != null) lines.push('### How the list was narrowed', '', '| Step | Count | Label |', '|---|---|---|',
  `| Companies in CSV | ${census.csv_rows} | record |`, `| …with any H-1B data | ${census.csv_rows_with_h1b} | record |`,
  `| Industry matches \`${cfg.filters.industry_pattern}\` | ${census.industry_rows} | your-input filter on record |`,
  `| …with H-1B data | ${census.industry_rows_with_h1b} | record |`, `| …H-1B blank (unknown, not scored) | ${census.industry_rows_h1b_blank} | record |`,
  `| …sponsored a data/BI-type title | ${census.title_matched} | model-judgment (title rule) |`, '');
lines.push('### Visa-timeline gate (all your-input)', '', `- Program end ${tl.program_end}; OPT filing deadline ${tl.filing_deadline}; assumed OPT start ${tl.opt_start_assumed}`,
  `- Hiring lag ${tl.hiring_lag_days} days → earliest offer ${tl.earliest_offer}; unemployment allowance ${tl.unemployment_days} days`,
  `- **Factor ${tl.factor}** — ${tl.reason}`, '');
lines.push('### Target occupations (BLS national median, record)', '', ...socs.map((s) => s.status === 'ok'
  ? `- ${s.soc} ${s.title}: ${fmt$(s.median.value)}` : `- ${s.soc}: **missing** (${s.reason}) — no value used`), '');
lines.push('## Decisions', '', '| Company | Next action | Score | Sponsorship [record → your-input tier] | Fit [model-judgment] | Liveness [label] | E-Verify [label] | Pay median, all titles [record] | Latest funding [record] |',
  '|---|---|---|---|---|---|---|---|---|');
for (const e of evaluated) {
  const s = e.sponsorship;
  lines.push(`| ${e.company} | **${e.next_action}** | ${e.score ? `${e.score.composite.toFixed(3)} ${e.score.recommendation}` : `— (${e.status})`} | ` +
    `${s ? `${s.approvals.value} appr, ${s.approval_rate.value?.toFixed(1)}% → ${s.tier.value}` : '—'} | ${e.fit?.value ?? '—'} | ${e.liveness?.value ? `${e.liveness.value} [${e.liveness.label}]` : '—'} | ${e.everify?.value ? `${e.everify.value} [${e.everify.label}]` : '—'} | ` +
    `${e.salary ? `${fmt$(e.salary.company_median_all_titles.value)} (${e.salary.check})` : '—'} | ${e.funding?.latest_funding_date.value ?? '—'} |`);
}
lines.push('', '## Why each row', '');
for (const e of evaluated) lines.push(`- **${e.company}**${e.posting_title ? ` (posting: ${e.posting_title.value}; liveness ${e.liveness.label})` : ''} — ${e.score ? `${e.score.reason}; ${e.score.arithmetic}` : e.note || e.status}` +
  `${e.fit?.source ? `. Fit: ${e.fit.source}` : ''}`);
lines.push('', '## What this run could not verify', '',
  '- **E-Verify enrollment** — no data in the repo; every "unknown" must be looked up by hand before tailoring (gate G4).',
  '- **Role-specific sponsorship** — the CSV lists only a company\'s top sponsored titles; a missing data-engineer title is not evidence they never sponsor one.',
  '- **Pay for the actual role** — the company median covers all sponsored titles; the BLS figure is a national occupation median, not an offer.',
  '- **Funding** — the latest-funding date comes from the 80 Days CSV; the Form D cross-check uses a 50-row-per-quarter sample, so "no hit" means "not in the sample".',
  '- **Liveness** — read from a hand-transcribed `ats:liveness` result; this script never touches the network.', '',
  '## Human gate', '', 'Before acting on any row: confirm the posting is still live, look up E-Verify, and read the sponsored titles yourself. Record the decision in the run log.', '');
fs.writeFileSync(path.join(outDir, 'triage-report.md'), lines.join('\n'));

console.log(`✓ triage ${iso(asOf)}: ${evaluated.length} evaluated → ` +
  ['tailor-application', 'verify-everify-then-tailor', 'review-role-fit', 'network-into-company', 'check-posting-by-hand', 'research-sponsorship', 'not-in-data', 'skip']
    .map((k) => `${k} ${count(k)}`).join(' · '));
console.log(`  timeline factor ${tl.factor} (${tl.reason})`);
console.log(`  ${path.relative(REPO, path.join(outDir, 'triage-log.json'))}  +  ${path.relative(REPO, path.join(outDir, 'triage-report.md'))}`);

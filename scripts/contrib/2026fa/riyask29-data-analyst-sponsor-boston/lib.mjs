// lib.mjs — pure functions for the Data-Analyst Sponsor Check (riyask29, 2026fa).
//
// No network, no file writes. Everything here takes data in and returns
// labeled values out, so the offline test can drive it from fixtures.
// Every value this module emits carries a `source`:
//   record          — read straight from a repo data file (or a dated liveness run)
//   your-input      — typed by the student (persona, candidates, keyword rules)
//   model-judgment  — not used anywhere in this prototype (no LLM is called)

import fs from 'node:fs';

export const SRC = { record: 'record', input: 'your-input', model: 'model-judgment' };

// ── CSV (RFC 4180: quoted fields, embedded commas/quotes/newlines) ──────────
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, j) => [h, r[j] ?? ''])));
}

export const readCsv = (p) => parseCsv(fs.readFileSync(p, 'utf8'));

// ── company identity (Gate G1) ──────────────────────────────────────────────
const SUFFIX = /\b(inc|llc|l\.?l\.?c|corp|corporation|co|company|ltd|limited|lp|l\.?p|pbc|plc)\b\.?/g;
export function normalizeName(s) {
  return String(s || '').toLowerCase().replace(/&/g, ' and ').replace(SUFFIX, ' ')
    .replace(/[^a-z0-9]/g, '');
}
const words = (s) => String(s || '').toLowerCase().replace(SUFFIX, ' ').split(/[^a-z0-9]+/).filter(Boolean);

// Exact normalized match only. Zero or several exact matches is a hard stop;
// near matches (every query word appears as a word in the CSV name) are
// returned for the human to look at — never auto-picked.
export function findCompany(rows, query) {
  const q = normalizeName(query);
  const exact = rows.filter((r) => normalizeName(r.company_name) === q);
  const qw = words(query);
  const near = exact.length === 1 ? [] : rows
    .filter((r) => { const w = new Set(words(r.company_name)); return qw.length && qw.every((x) => w.has(x)); })
    .map((r) => r.company_name).slice(0, 10);
  if (exact.length === 1) {
    const r = exact[0];
    const hasH1b = String(r['Total Approvals'] || '').trim() !== '';
    return { status: hasH1b ? 'found' : 'no-h1b-record', row: r, near: [] };
  }
  if (exact.length > 1) return { status: 'ambiguous', row: null, near: exact.map((r) => r.company_name) };
  return { status: near.length ? 'not-exact-near-matches' : 'not-in-dataset', row: null, near };
}

// The CSV stores the list as a Python repr: ['A', "B's", 'C']
export function parseTitleList(s) {
  const out = [];
  const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(String(s || '')))) out.push((m[1] ?? m[2]).trim());
  return out;
}

// ── title classification (Gate G4 shows every match to a human) ────────────
export function classifyTitle(title, families) {
  const t = title.toLowerCase();
  const hit = (list) => list.find((k) => t.includes(k));
  if (!/analyst/.test(t)) return { title, family: 'non-analyst', matched: null };
  let k;
  if ((k = hit(families.data_analyst_family))) return { title, family: 'data-analyst-family', matched: k };
  if ((k = hit(families.ambiguous_analyst))) return { title, family: 'ambiguous-analyst', matched: k };
  return { title, family: 'other-analyst', matched: hit(families.other_analyst_examples) || 'analyst' };
}

// Tier for THIS role family, from the classified titles. The p per tier is
// a student-chosen mapping (Proven 0.9 / Likely 0.6 mirror data/examples/ch11-roles.json).
export function sponsorshipTier(classified, families) {
  const has = (f) => classified.some((c) => c.family === f);
  const tier = has('data-analyst-family') ? 'Proven'
    : has('ambiguous-analyst') ? 'Likely'
    : has('other-analyst') ? 'Possible'
    : 'Unknown';
  return { tier, p: families.tier_p[tier], p_source: SRC.input };
}

// ── timeline factor (Gate G3) — formula is the student's, so: your-input ───
const DAY = 86400000;
const toDate = (s) => new Date(`${s}T00:00:00Z`);
export function timelineFactor(persona, lagWeeks, today) {
  const v = persona.visa;
  const lagDays = Math.round(Number(lagWeeks) * 7);
  const daysToOptEnd = Math.round((toDate(v.opt_end_date) - toDate(today)) / DAY);
  const unempLeft = v.unemployment_ceiling - v.unemployment_days_used;
  const runway = Math.min(daysToOptEnd, unempLeft);
  const base = {
    source: SRC.input, today, opt_end_date: v.opt_end_date, days_to_opt_end: daysToOptEnd,
    unemployment_days_left: unempLeft, runway_days: runway, hiring_lag_days: lagDays,
    buffer_days: v.buffer_target_days,
    binding_clock: daysToOptEnd <= unempLeft ? 'opt-end-date' : 'unemployment-days',
  };
  if (!Number.isFinite(lagDays) || lagDays <= 0) return { ...base, factor: null, status: 'missing-hiring-lag' };
  if (daysToOptEnd <= 0) return { ...base, factor: 0, status: 'opt-already-ended' };
  if (unempLeft <= 0) return { ...base, factor: 0, status: 'unemployment-days-exhausted' };
  const slack = runway - lagDays;
  const factor = slack <= 0 ? 0 : Math.min(1, slack / v.buffer_target_days);
  return {
    ...base, slack_days: slack, factor: Number(factor.toFixed(3)),
    status: slack <= 0 ? 'start-after-cliff' : slack < v.buffer_target_days ? 'inside-buffer' : 'clear',
    arithmetic: `slack = min(${daysToOptEnd}, ${unempLeft}) − ${lagDays} = ${slack}; factor = clamp(slack / ${v.buffer_target_days}, 0, 1)`,
  };
}

// ── wage check (NOT a scorer input — role_quality weight is 0, Fact 1) ─────
export function wageCheck(blsRows, socCodes, companyRow) {
  const company = companyRow ? Number(companyRow.median_salary_offered) : NaN;
  return socCodes.map((soc) => {
    const r = blsRows.find((b) => b.onet_soc_code === soc);
    if (!r) return { soc, status: 'no-occupation-row', source: SRC.record };
    const bls = Number(r.annual_median_wage);
    if (!r.annual_median_wage || !Number.isFinite(bls)) return { soc, title: r.title, status: 'no-wage-value', source: SRC.record };
    return {
      soc, title: r.title, status: 'ok', source: SRC.record, oews_year: r.oews_year,
      bls_annual_median: bls,
      company_median_salary_offered: Number.isFinite(company) ? company : null,
      ratio_company_to_bls: Number.isFinite(company) ? Number((company / bls).toFixed(2)) : null,
      caveat: 'company median spans ALL its sponsored roles, not analyst roles only',
    };
  });
}

// ── Form D join ──────────────────────────────────────────────────────────────
// The repo ships 50-company SAMPLES per quarter (Fact 3). Full quarters are fetched
// locally (gitignored) with scripts/sec/download-form-d-quarters.py + refresh-recent-
// sec-quarters.py. A file is "complete" when it holds every company its metadata counts.
export function formDComplete(formD) {
  return formD.length > 0 && formD.every((f) => (f.metadata?.total_companies || 0) === f.companies.length);
}

export function formDLookup(formD, companyName) {
  const n = normalizeName(companyName);
  const hits = [];
  for (const f of formD) for (const c of f.companies)
    if (normalizeName(c.company?.name) === n)
      hits.push({ quarter: c.filing?.quarter, date_filed: c.filing?.date_filed, amount_sold: c.funding?.total_amount_sold ?? null });
  const held = formD.reduce((s, f) => s + f.companies.length, 0);
  const total = formD.reduce((s, f) => s + (f.metadata?.total_companies || 0), 0);
  const quarters = formD.map((f) => f.metadata?.quarter).filter(Boolean).join(', ');
  if (formDComplete(formD)) {
    return {
      status: hits.length ? 'filed' : 'not-filed-under-this-name', filings: hits, source: SRC.record, complete: true,
      coverage: `all ${total} companies in ${formD.length} full quarter file(s): ${quarters}`,
      meaning: hits.length
        ? 'filed a Form D in these quarters (a private raise; it says nothing about hiring or sponsorship)'
        : 'no Form D under this exact name in these quarters; public companies, other entity names and older raises are not covered',
    };
  }
  return {
    status: hits.length ? 'in-sample' : 'not-in-sample', filings: hits, source: SRC.record, complete: false,
    coverage: `${held} of ${total} companies across ${formD.length} sample quarter file(s)`,
    meaning: hits.length ? 'filed a Form D in a sampled quarter' : 'absent from the SAMPLE — says nothing about whether it raised money',
  };
}

// ── DOL LCA join (SOC-level sponsorship evidence; closes recipe TODO 1) ───────
// rows: lca_slice.py output (employer x SOC counts of certified H-1B LCAs, one state).
export function lcaLookup(rows, companyName, file = '') {
  const n = normalizeName(companyName);
  const hits = rows.filter((r) => normalizeName(r.employer_name) === n);
  const sum = (fam) => hits.filter((r) => r.family === fam).reduce((s, r) => s + Number(r.certified_lcas || 0), 0);
  const core = sum('core'), adjacent = sum('adjacent');
  return {
    status: hits.length ? 'found' : 'none-under-this-name', core_lcas: core, adjacent_lcas: adjacent,
    by_soc: hits.map((r) => ({ soc_code: r.soc_code, soc_title: r.soc_title, family: r.family,
      certified_lcas: Number(r.certified_lcas), top_job_titles: r.top_job_titles })),
    source: SRC.record, coverage: `certified H-1B LCAs at the slice's worksite state, ${file}`,
    meaning: hits.length
      ? (core ? 'filed certified LCAs in the target analyst SOC codes' : 'filed certified LCAs only in adjacent analyst SOC codes: a person decides if that work fits (G4)')
      : 'no certified analyst-family LCA under this exact employer name in this file; not evidence that it never sponsors',
  };
}

// ── seniority (Gate G0): title words only ─────────────────────────────────────
// A your-input rule: a title containing one of `words` (whole words) signals more experience than
// the persona's max_years_experience. It cannot read the posting's own "N+ years" requirement.
export function seniorityCheck(title, words = []) {
  const toks = String(title || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const hit = words.find((w) => toks.includes(w.toLowerCase()));
  return { status: hit ? 'too-senior' : 'ok', matched: hit ?? null };
}

// ── what the student does next (the 3-3-2 hand-off) ─────────────────────────
export function nextAction(e) {
  const strong = ['Proven', 'Likely'].includes(e.sponsorship?.tier);
  if (e.stopped_at === 'G0') return { action: 'skip', hours: '—', why: `seniority: title word "${e.seniority.matched}" signals more than ${e.seniority.max_years} years of experience` };
  if (e.stopped_at === 'G1') return { action: 'resolve-company', hours: 'research (2h)', why: `company identity: ${e.company_match.status}` };
  if (e.stopped_at === 'G2') return { action: 'check-posting-by-hand', hours: 'research (2h)', why: `liveness: ${e.liveness.result}` };
  if (e.stopped_at === 'G3') return { action: 'fix-input', hours: 'research (2h)', why: `timeline: ${e.timeline.status}` };
  if (e.stopped_at === 'no-posting') return strong
    ? { action: 'network', hours: 'networking (3h)', why: `${e.sponsorship.tier} analyst sponsor with no posting to apply to` }
    : { action: 'skip', hours: '—', why: 'no posting and no analyst-sponsorship evidence' };
  const rec = e.scorer?.recommendation;
  if (rec === 'Apply') return { action: 'tailor-application', hours: 'apply (2h)', why: e.scorer.reason };
  if (rec === 'Consider') return { action: 'review-then-tailor', hours: 'apply (2h)', why: e.scorer.reason };
  if (e.liveness?.result === 'expired' && strong)
    return { action: 'network', hours: 'networking (3h)', why: 'posting is dead but the company sponsored analyst-type titles' };
  return { action: 'skip', hours: '—', why: e.scorer?.reason || 'not scored' };
}

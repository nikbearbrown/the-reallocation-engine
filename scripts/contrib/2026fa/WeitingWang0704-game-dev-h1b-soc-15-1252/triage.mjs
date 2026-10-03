#!/usr/bin/env node
// triage.mjs — games-sector sponsorship triage for SOC 15-1252.
//
// WHAT THIS DOES
//   Turns a list of job postings at game studios into a roles.json that the
//   existing Bayesian Role Scorer (scripts/score/role-scorer.mjs) can read,
//   then runs that scorer and renders a games-specific human report.
//
//   This script does NOT re-implement the composite. It shells out to the
//   repo's scorer and reads role-scores.json back, which is the second of the
//   two routes CONTRIBUTING.md sanctions. (The first route — importing
//   CONFIG / SRC / applyProfile / scoreRole — is documented but not available:
//   role-scorer.mjs carries no export statements as of commit 015843d.)
//
// WHAT IT CANNOT DO
//   - It cannot tell you a company is a game studio. The 80 Days CSV has 24
//     industry labels and none of them is games. Sector is INFERRED from name
//     and website keywords and is labelled model-judgment everywhere.
//   - It cannot tell you a company does not sponsor. Only 1,557 of 30,369 CSV
//     rows (5.1%) carry an H-1B approvals value. An empty record is an absence
//     of evidence, never evidence of absence, and is labelled model-judgment.
//   - It does not touch the network. Liveness must be checked by a human with
//     `npm run ats:liveness -- <url>` and supplied in a file. A posting whose
//     liveness is unverified is NOT scored; it is blocked at the gate.
//
// USAGE (from the repo root)
//   node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
//     --postings <postings.json> --liveness <liveness.json> \
//     --opt-end YYYY-MM-DD --hiring-lag-days 75 --out-dir <dir>
//
// Every emitted value carries one of three labels:
//   record         — read out of a shipped data file, unmodified
//   model-judgment — inferred by this script or by a model
//   your-input     — supplied by the human operator

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const SRC = { record: 'record', model: 'model-judgment', input: 'your-input' };

// ───────────────────────────────────────────────────────────────────────────
// ASSUMPTIONS — every number a human must agree to before trusting a row.
// These are MINE, not the repository's. They are stated here so that a reader
// can disagree with one number instead of with the whole report.
// ───────────────────────────────────────────────────────────────────────────
export const ASSUMPTIONS = {
  // Sponsorship probability by tier. Only the first three come from a record;
  // UNKNOWN_PRIOR is a judgment call about a company with no H-1B row at all.
  p_proven: 0.90,   // >= 10 approvals AND approval rate >= 80%
  p_likely: 0.60,   // >= 1 approval
  p_none: 0.05,     // approvals recorded as 0 with denials on file
  p_unknown: 0.35,  // [model-judgment] row exists, H-1B columns empty (94.9% of rows)

  // Timeline: factor rises from 0 at one hiring cycle of runway to 1.0 at two.
  // Below one cycle the gate is closed — the hire cannot finish before the
  // OPT window does. Both the lag and the OPT date are your-input.
  default_hiring_lag_days: 75,

  // Sector keywords. Deliberately short and deliberately fallible — see the
  // over-match / under-match note in README.md.
  game_keywords: [
    'game', 'games', 'gaming', 'studio', 'studios', 'interactive',
    'entertainment', 'playable', 'arcade', 'esports', 'pixel', 'voxel',
  ],

  // Title fragments that count as engineering work when checking whether a
  // company's past sponsorships were for THIS kind of role.
  engineering_title_fragments: [
    'engineer', 'developer', 'programmer', 'software', 'technical',
    'architect', 'sde', 'swe',
  ],
};

const CSV_80_DAYS = 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv';
const CSV_BLS = 'data/bls/compact/soc_occupation_compact.csv';

// ───────────────────────────────────────────────────────────────────────────
// Errors. Each named failure case exits non-zero and writes nothing, so that a
// failure can never be mistaken for a low score.
// ───────────────────────────────────────────────────────────────────────────
export class TriageError extends Error {
  constructor(code, msg) { super(msg); this.code = code; }
}

// ── minimal CSV reader (quoted fields, embedded commas and newlines) ────────
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map((h) => h.replace(/^﻿/, ''));
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

// ── company-name normalisation, so "Epic Games, Inc." matches "EPIC GAMES INC"
export function normalizeName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[.,'"&]/g, ' ')
    .replace(/\b(inc|llc|l l c|corp|corporation|ltd|limited|co|company|holdings|group|the)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

// ───────────────────────────────────────────────────────────────────────────
// Step 1 — sector. INFERRED. The CSV cannot answer this question.
// ───────────────────────────────────────────────────────────────────────────
export function classifySector(posting) {
  const hay = `${posting.company || ''} ${posting.website || ''}`.toLowerCase();
  const hits = ASSUMPTIONS.game_keywords.filter((k) => new RegExp(`\\b${k}`).test(hay) || hay.includes(k));
  return {
    is_game_employer: hits.length > 0,
    matched_keywords: hits,
    source: SRC.model,
    note: hits.length
      ? `matched ${hits.join(', ')} in company name/website — a keyword match, not an industry record`
      : 'no games keyword matched; the human must confirm or reject this company by hand',
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Step 2 — sponsorship. RECORD where a record exists, and explicitly not
// where one does not.
// ───────────────────────────────────────────────────────────────────────────
export function lookupSponsorship(index, posting) {
  const key = normalizeName(posting.company);
  const row = index.get(key);

  if (!row) {
    return {
      status: 'NOT_IN_RECORD',
      tier: null, p: null, source: null,
      note: `"${posting.company}" is not among the 30,369 companies in the 80 Days CSV. `
          + 'No sponsorship value is emitted. This is a gap in coverage, not a finding about the company.',
    };
  }

  const approvals = Number(row['Total Approvals']);
  const denials = Number(row['Total Denials']);
  const rate = Number(row['Approval_Rate']);
  const titles = row['top_job_titles_sponsored'] || '';
  const hasRecord = (row['Total Approvals'] || '').trim() !== '';

  if (!hasRecord) {
    return {
      status: 'NO_SPONSORSHIP_RECORD',
      tier: 'unknown',
      p: ASSUMPTIONS.p_unknown,
      source: SRC.model, // NOT record — this is a prior, not a filing
      csv_row: { company_name: row.company_name, industry: row.industry, city: row.city, state: row.state },
      note: 'The company is in the CSV but its H-1B columns are empty. 94.9% of rows are like this. '
          + `Scored with the stated prior p=${ASSUMPTIONS.p_unknown} (model-judgment). `
          + 'An absent record is NOT evidence that this company does not sponsor.',
    };
  }

  // A record exists. Tier it, and check WHICH roles it sponsored for.
  let tier, p;
  if (approvals >= 10 && rate >= 80) { tier = 'proven'; p = ASSUMPTIONS.p_proven; }
  else if (approvals >= 1) { tier = 'likely'; p = ASSUMPTIONS.p_likely; }
  else { tier = 'none'; p = ASSUMPTIONS.p_none; }

  const titleList = titles.toLowerCase();
  const engineeringSponsored = ASSUMPTIONS.engineering_title_fragments.some((f) => titleList.includes(f));

  return {
    status: 'IN_RECORD',
    tier, p,
    source: SRC.record,
    evidence: {
      total_approvals: approvals, total_denials: denials, approval_rate: rate,
      median_salary_offered: row['median_salary_offered'] || null,
      top_job_titles_sponsored: titles || null,
    },
    role_title_match: {
      engineering_titles_present: engineeringSponsored,
      source: SRC.model,
      note: engineeringSponsored
        ? 'past sponsorships include at least one engineering title'
        : 'past sponsorships include NO engineering title — this company has sponsored, but not visibly for this kind of role',
    },
    note: `${approvals} approvals / ${denials} denials, rate ${rate}% — read from the CSV row.`,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Step 3 — funding recency. RECORD (the CSV's own Form D-derived columns).
// ───────────────────────────────────────────────────────────────────────────
export function fundingSignal(row, today) {
  if (!row || !row['latest_funding_date']) return { status: 'NO_FUNDING_RECORD', source: null };
  const d = new Date(row['latest_funding_date']);
  if (isNaN(d)) return { status: 'NO_FUNDING_RECORD', source: null };
  const months = Math.round((today - d) / (1000 * 60 * 60 * 24 * 30.44));
  return {
    status: 'IN_RECORD',
    source: SRC.record,
    latest_funding_date: row['latest_funding_date'],
    latest_funding_stage: row['latest_funding_stage'] || null,
    latest_funding_amount: row['latest_funding_amount'] || null,
    months_since_funding: months,
    note: months <= 24
      ? `funded ${months} months ago — recent enough to be hiring`
      : `last recorded raise was ${months} months ago — the CSV shows no newer round`,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Step 4 — timeline gate. YOUR-INPUT entirely. Two numbers, both stated.
// ───────────────────────────────────────────────────────────────────────────
export function timelineFactor(optEnd, today, lagDays) {
  const days = Math.round((optEnd - today) / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    throw new TriageError('E_OPT_DATE_PAST',
      `--opt-end ${optEnd.toISOString().slice(0, 10)} is not in the future (today ${today.toISOString().slice(0, 10)}). `
      + 'Refusing to compute a timeline factor from a date that has passed.');
  }
  const raw = (days - lagDays) / lagDays;
  const factor = Math.max(0, Math.min(1, raw));
  return {
    factor: Number(factor.toFixed(3)),
    source: SRC.input,
    days_of_runway: days,
    assumed_hiring_lag_days: lagDays,
    arithmetic: `(${days} - ${lagDays}) / ${lagDays} = ${raw.toFixed(3)} → clamped to [0,1] = ${factor.toFixed(3)}`,
    note: factor === 0
      ? 'gate CLOSED: less than one assumed hiring cycle of runway remains'
      : 'gate open; both numbers above are assumptions, not records',
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Step 5 — role quality, read but NOT fed to the scorer.
// DOMAIN.md "Known gaps" fact 1: role-scorer.mjs sets role_quality weight to
// 0.0 and tags it [VERIFY]. Passing a role_quality vote would therefore
// contribute exactly nothing to the composite. Rather than propose a weight I
// cannot justify, this script reads the SOC row and shows it in the human
// report only, where a person can use it. It is never sent to the scorer.
// ───────────────────────────────────────────────────────────────────────────
export function loadSocRow(repoRoot, soc) {
  const file = path.join(repoRoot, CSV_BLS);
  if (!fs.existsSync(file)) throw new TriageError('E_BLS_MISSING', `${CSV_BLS} not found`);
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const row = rows.find((r) => r.bls_soc_code === soc);
  if (!row) {
    throw new TriageError('E_SOC_NOT_FOUND',
      `SOC ${soc} has no row in ${CSV_BLS}. Refusing to invent a wage or an ability level.`);
  }
  return {
    source: SRC.record,
    bls_soc_code: row.bls_soc_code,
    title: row.title,
    annual_median_wage: row.annual_median_wage,
    employment: row.employment,
    cognitive_pivot_score: row.cognitive_pivot_score,
    oews_year: row.oews_year,
    scorer_weight_note:
      'role_quality carries weight 0.0 in scripts/score/role-scorer.mjs (tagged [VERIFY]). '
      + 'These numbers are shown to the human and are deliberately NOT passed to the scorer, '
      + 'because a vote with weight zero would look like evidence while contributing nothing.',
  };
}

// ───────────────────────────────────────────────────────────────────────────
// The pipeline.
// ───────────────────────────────────────────────────────────────────────────
export function triage({ repoRoot, postings, liveness, optEnd, today, lagDays, soc }) {
  const socRow = loadSocRow(repoRoot, soc);

  const csvPath = path.join(repoRoot, CSV_80_DAYS);
  if (!fs.existsSync(csvPath)) throw new TriageError('E_CSV_MISSING', `${CSV_80_DAYS} not found`);
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const index = new Map();
  for (const r of rows) {
    const k = normalizeName(r.company_name);
    if (k && !index.has(k)) index.set(k, r);
  }

  const timeline = timelineFactor(optEnd, today, lagDays); // throws on a past date
  // Liveness provenance is per entry, not per file. An entry is a real record
  // only if a human ran `npm run ats:liveness` against that URL and wrote down
  // what they saw; `synthetic: true` marks the ones that were not checked.
  // The file-level `_synthetic` is the default for entries that do not say.
  // Carry the counts into both outputs rather than letting a fixture pass for
  // an observation — or letting one real check vouch for the whole table.
  const fileDefaultSynthetic = liveness._synthetic === true;
  const isSynthetic = (e) => (e && typeof e.synthetic === 'boolean') ? e.synthetic : fileDefaultSynthetic;

  const scored = [];   // rows that clear every gate and go to the scorer
  const blocked = [];  // rows stopped at a gate, with the reason
  const roles = [];    // the scorer's input shape

  for (const p of postings) {
    if (p.skip) continue; // annotation rows in a fixture, not postings
    const sector = classifySector(p);
    const sponsorship = lookupSponsorship(index, p);
    const csvRow = index.get(normalizeName(p.company));
    const funding = fundingSignal(csvRow, today);
    const live = liveness[p.posting_id];

    const record = {
      posting_id: p.posting_id,
      company: p.company,
      title: p.title,
      url: p.url || null,
      sector, sponsorship, funding,
      fit: { p: p.fit_p ?? null, source: SRC.model, note: p.fit_note || 'self-assessed fit, stated by the operator' },
      liveness: live
        ? { factor: live.factor,
            source: isSynthetic(live) ? SRC.model : SRC.record,
            verified: !isSynthetic(live),
            checked_at: live.checked_at, observed: live.observed, url: live.url,
            note: isSynthetic(live)
              ? 'SYNTHETIC — nobody checked this posting; this value is not a record'
              : 'checked by a human with npm run ats:liveness; see checked_at' }
        : { factor: null, source: null, verified: false, note: 'liveness NOT checked' },
      timeline,
      role_quality_context: socRow,
    };

    // Gate 1 — sector. Not a hard stop; a flag the human must clear.
    if (!sector.is_game_employer) record.gate1_flag = 'sector unconfirmed — human must confirm this is a game studio';

    // Gate 2 — liveness. HARD STOP. An unchecked posting is not scored.
    if (!live) {
      blocked.push({ ...record, blocked_at: 'GATE_2_LIVENESS',
        what_the_human_must_do: `run: npm run ats:liveness -- ${p.url || '<url>'} and add the result to the liveness file` });
      continue;
    }

    // No sponsorship record of any kind → not scored, surfaced as a coverage gap.
    if (sponsorship.status === 'NOT_IN_RECORD') {
      blocked.push({ ...record, blocked_at: 'NOT_IN_RECORD',
        what_the_human_must_do: 'this company is outside the dataset; research it by hand or drop it — do not assume either way' });
      continue;
    }

    roles.push({
      role_id: p.posting_id,
      company: p.company,
      title: p.title,
      sponsorship: { p: sponsorship.p, tier: sponsorship.tier, source: sponsorship.source },
      fit: { p: p.fit_p ?? 0.5, source: SRC.model },
      liveness: { factor: live.factor, source: isSynthetic(live) ? SRC.model : SRC.record },
      timeline: { factor: timeline.factor, source: SRC.input },
    });
    scored.push(record);
  }

  // Count across every row that reached a liveness lookup, scored or blocked.
  // Counting only scored rows would have reported "0 checked" on a run whose
  // only real checks happened to be blocked at a later gate.
  const all = [...scored, ...blocked];
  const withLive = all.filter((r) => r.liveness && r.liveness.factor != null);
  const livenessProvenance = {
    rows: all.length,
    with_liveness: withLive.length,
    verified: withLive.filter((l) => l.liveness.verified === true).length,
    synthetic: withLive.filter((l) => l.liveness.verified !== true).length,
    scored_verified: scored.filter((r) => r.liveness && r.liveness.verified === true).length,
    scored_total: scored.length,
  };
  return { socRow, timeline, roles, scored, blocked, livenessProvenance };
}

// ── run the repo's scorer (never a copy of it) and read its output back ─────
export function runRepoScorer(repoRoot, rolesPath, outDir) {
  const scorer = path.join(repoRoot, 'scripts/score/role-scorer.mjs');
  if (!fs.existsSync(scorer)) throw new TriageError('E_SCORER_MISSING', 'scripts/score/role-scorer.mjs not found');
  const stdout = execFileSync('node', [scorer, rolesPath, '--out-dir', outDir], { encoding: 'utf8' });
  const scoresPath = path.join(outDir, 'role-scores.json');
  if (!fs.existsSync(scoresPath)) throw new TriageError('E_SCORER_NO_OUTPUT', 'scorer wrote no role-scores.json');
  return { stdout, scores: JSON.parse(fs.readFileSync(scoresPath, 'utf8')) };
}

// ── next action per result: this is where the recipe meets the 3-3-2 day ────
export function nextAction(scoredRow, decision) {
  if (decision === 'Apply') return { bucket: 'apply', action: 'Tailor and apply — spend part of the 2 research-and-apply hours here.' };
  if (decision === 'Consider') return { bucket: 'network', action: 'Do not apply cold. Find one person and ask — this belongs to the 3 networking hours.' };
  const s = scoredRow?.sponsorship;
  if (s && s.tier === 'none') return { bucket: 'skip', action: 'Skip. A recorded non-sponsor is the clearest Skip the dataset can give you.' };
  return { bucket: 'skip', action: 'Skip. Spend the hour on the credibility project instead.' };
}

function renderReport({ socRow, timeline, scored, blocked, scores, livenessProvenance, meta }) {
  const byId = new Map(scored.map((r) => [r.posting_id, r]));
  const o = [];
  o.push(`# Games-sector sponsorship triage — SOC ${socRow.bls_soc_code}`);
  o.push('');
  o.push(`Run ${meta.when} · ${scores.roles.length} scored · ${blocked.length} blocked at a gate`);
  o.push('');
  const lp = livenessProvenance;
  if (lp.synthetic > 0) {
    o.push(`> **Liveness provenance: ${lp.verified} of ${lp.with_liveness} postings in this run were actually checked**`);
    o.push(`> with \`npm run ats:liveness\`; the other ${lp.synthetic} carry synthetic values nobody observed.`);
    o.push(`> Of the ${lp.scored_total} rows that reached the scorer, **${lp.scored_verified}** had a checked liveness value.`);
    o.push('> Checked rows show `liveness [record]` with a timestamp and an observed status in');
    o.push('> `triage.json`; unchecked rows show `[model-judgment]` and their decisions demonstrate');
    o.push('> the pipeline rather than advising about those companies.');
    o.push('');
  } else if (lp.with_liveness > 0) {
    o.push(`> **Liveness provenance: all ${lp.with_liveness} postings were checked** with`);
    o.push('> `npm run ats:liveness`. Timestamps and observed statuses are in `triage.json`.');
    o.push('');
  }
  o.push('## What is a record here and what is not');
  o.push('');
  o.push('- Sponsorship counts, approval rates and funding dates below are **records** — read from');
  o.push(`  \`${CSV_80_DAYS}\` without modification.`);
  o.push('- Whether a company is a **game studio** is a **model-judgment**: a keyword match on the');
  o.push('  company name. The CSV has 24 industry labels and none of them is games.');
  o.push('- A company with **no H-1B row** is scored on a stated prior of');
  o.push(`  ${ASSUMPTIONS.p_unknown} (**model-judgment**). 94.9% of rows in the CSV are like this.`);
  o.push('  An absent record is not evidence that a company does not sponsor.');
  o.push('- The **OPT date and the hiring lag** are **your-input**. They can close a gate on their own.');
  o.push('');
  o.push('## Timeline gate (applies to every row)');
  o.push('');
  o.push(`\`${timeline.arithmetic}\` → factor **${timeline.factor}** [${timeline.source}]`);
  o.push('');
  o.push(`${timeline.days_of_runway} days of runway against an assumed ${timeline.assumed_hiring_lag_days}-day hiring cycle. ${timeline.note}`);
  o.push('');
  o.push('## Decisions');
  o.push('');
  o.push('| Company | Title | Composite | Decision | Sponsorship evidence | Next action |');
  o.push('|---|---|---|---|---|---|');
  for (const s of scores.roles.sort((a, b) => b.composite - a.composite)) {
    const row = byId.get(s.role_id);
    const na = nextAction(row, s.recommendation);
    const sp = row?.sponsorship;
    const ev = sp?.status === 'IN_RECORD'
      ? `${sp.evidence.total_approvals} approvals, rate ${Number(sp.evidence.approval_rate).toFixed(1)}% [record]${sp.role_title_match.engineering_titles_present ? '' : ' · **no engineering title in past sponsorships**'}`
      : `no H-1B row — prior ${sp?.p} [model-judgment]`;
    o.push(`| ${s.company} | ${s.title} | ${s.composite.toFixed(3)} | **${s.recommendation}** | ${ev} | ${na.action} |`);
  }
  o.push('');
  o.push('## Blocked at a gate — not scored');
  o.push('');
  if (!blocked.length) o.push('*(none)*');
  else {
    o.push('| Company | Title | Blocked at | Liveness | What you must do |');
    o.push('|---|---|---|---|---|');
    for (const b of blocked) {
      const l = b.liveness;
      const lv = l && l.factor != null
        ? `${l.factor} ${l.verified ? `[record] — ${l.observed}` : '[model-judgment, synthetic]'}`
        : 'never checked';
      o.push(`| ${b.company} | ${b.title} | \`${b.blocked_at}\` | ${lv} | ${b.what_the_human_must_do} |`);
    }
  }
  o.push('');
  o.push('## Role-quality context (shown, not scored)');
  o.push('');
  o.push(`${socRow.title} · BLS ${socRow.oews_year} median wage \`${socRow.annual_median_wage}\` · employment \`${socRow.employment}\` · cognitive-pivot score \`${socRow.cognitive_pivot_score}\` [record]`);
  o.push('');
  o.push(socRow.scorer_weight_note);
  o.push('');
  o.push('## Stop condition');
  o.push('');
  o.push('This report ends here. It does not apply, contact anyone, or rank you against other candidates.');
  o.push('A decision you cannot explain term by term is one to distrust before you distrust your confusion.');
  o.push('');
  return o.join('\n');
}

// ───────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) throw new TriageError('E_BAD_ARGS', `unexpected argument ${argv[i]}`);
    a[argv[i].slice(2)] = argv[i + 1];
  }
  return a;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const repoRoot = a['repo-root'] || process.cwd();
  const outDir = a['out-dir'];
  if (!a.postings || !a.liveness || !a['opt-end'] || !outDir) {
    console.error('Usage: triage.mjs --postings <f> --liveness <f> --opt-end YYYY-MM-DD '
      + '[--hiring-lag-days 75] [--soc 15-1252] [--today YYYY-MM-DD] --out-dir <dir>');
    process.exit(2);
  }

  // Normalise 'now' to UTC midnight. Without this the runway is computed
  // against the current clock time and the same run on the same day can
  // report 119 days or 120 depending on the hour. Found on the first real
  // run (2026-10-03): the test said 120, the CLI said 119.
  const nowRaw = a.today ? new Date(`${a.today}T00:00:00Z`) : new Date();
  const today = new Date(Date.UTC(nowRaw.getUTCFullYear(), nowRaw.getUTCMonth(), nowRaw.getUTCDate()));
  const optEnd = new Date(`${a['opt-end']}T00:00:00Z`);
  if (isNaN(optEnd)) { console.error('E_BAD_DATE: --opt-end must be YYYY-MM-DD'); process.exit(2); }
  const lagDays = Number(a['hiring-lag-days'] || ASSUMPTIONS.default_hiring_lag_days);
  const soc = a.soc || '15-1252';

  const postings = JSON.parse(fs.readFileSync(a.postings, 'utf8'));
  const liveness = JSON.parse(fs.readFileSync(a.liveness, 'utf8'));

  let result;
  try {
    result = triage({ repoRoot, postings, liveness, optEnd, today, lagDays, soc });
  } catch (e) {
    if (e instanceof TriageError) { console.error(`${e.code}: ${e.message}`); process.exit(3); }
    throw e;
  }

  fs.mkdirSync(outDir, { recursive: true });
  const rolesPath = path.join(outDir, 'roles.json');
  fs.writeFileSync(rolesPath, JSON.stringify(result.roles, null, 2));

  const { stdout, scores } = runRepoScorer(repoRoot, rolesPath, outDir);
  process.stdout.write(stdout);

  const when = today.toISOString().slice(0, 10);
  const agentLog = {
    _recipe: 'game-dev-h1b-soc-15-1252',
    _version: '0.1.0',
    generated: when,
    inputs: { postings: a.postings, liveness: a.liveness, opt_end: a['opt-end'], hiring_lag_days: lagDays, soc },
    assumptions: ASSUMPTIONS,
    source_labels: SRC,
    timeline_gate: result.timeline,
    role_quality_context: result.socRow,
    liveness_provenance: result.livenessProvenance,
    scored: result.scored,
    blocked_at_gate: result.blocked,
    scorer_output: scores,
  };
  fs.writeFileSync(path.join(outDir, 'triage.json'), JSON.stringify(agentLog, null, 2));
  fs.writeFileSync(path.join(outDir, 'triage-report.md'),
    renderReport({ ...result, scores, meta: { when } }));
  const lp = result.livenessProvenance;
  if (lp.synthetic > 0) console.warn(`  ! liveness: ${lp.verified}/${lp.with_liveness} postings actually checked (${lp.scored_verified}/${lp.scored_total} of the scored rows); ${lp.synthetic} synthetic and labelled model-judgment, not record`);

  console.log(`✓ triage: ${result.scored.length} scored, ${result.blocked.length} blocked at a gate`);
  console.log(`  ${path.join(outDir, 'triage.json')}  +  ${path.join(outDir, 'triage-report.md')}`);
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) main();

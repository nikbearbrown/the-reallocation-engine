#!/usr/bin/env node
// attach-liveness.mjs — bridge the liveness classifier to the role scorer.
//
// THE GAP THIS FILLS
// checkUrlLiveness() (scripts/ats/) produces { result, code, reason }; role-scorer.mjs
// (scripts/score/) consumes role.liveness.factor, a 0–1 gate multiplier. Until now
// nothing connected them: scan.mjs --verify used the verdict to ROUTE offers into
// buckets and then discarded the code, writing only a coarse status word to
// scan-history.tsv. Factors in roles.json were written by hand.
//
// This module is that bridge, and nothing else. It does not classify (that is
// liveness-core.mjs), it does not score (that is role-scorer.mjs), and it does not
// decide the numbers (that is liveness-factor.mjs).
//
//   import { attachLiveness } from './attach-liveness.mjs';
//   const { roles, rejected, stats } = attachLiveness(roles, { [url]: code });
//
// PURE CORE, LIVE SHELL
// attachLiveness() is pure: roles in, roles out, verdicts INJECTED. That keeps it
// deterministic and testable without Chromium. The CLI's --live flag obtains real
// verdicts through Playwright and then calls the exact same function, so both paths
// converge on one code path rather than drifting apart.
//
//   node scripts/score/attach-liveness.mjs <roles.json> --out <path>
//          [--verdicts <json>]  # inject { "<url>": "<code>" } — deterministic
//          [--live]             # obtain verdicts via Playwright (sequential)
//          [--overwrite]        # replace an existing role.liveness (default: preserve)
//          [--rejects <path>]   # default: <out>.rejects.json
//
// SCOPE NOTE (deliberate)
// scan.mjs --verify already DROPS expired and no_apply_control postings before any
// roles.json exists, so in that workflow this bridge mostly sees `active` and
// `navigation_error` → factor 1.0. The 0.0 and 0.5 factors earn their keep in a
// workflow that does not pre-filter. Reconciling the two layers means changing
// scan.mjs and is out of scope here.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { livenessFactor } from './liveness-factor.mjs';

/**
 * Attach a mapped liveness gate to each role that has a verdict.
 *
 * @param {object[]} roles - role records; each MAY carry a `url`.
 * @param {Record<string,string>} verdicts - { [url]: classifier `code` }.
 * @param {{overwrite?: boolean}} [opts] - overwrite an existing role.liveness.
 * @returns {{roles: object[], rejected: object[], stats: object}}
 *   `roles` excludes any role whose code is not scoreable; those appear in
 *   `rejected`. Input is never mutated.
 * @throws re-throws `unknown_liveness_code` (and any unexpected error) so the run
 *   aborts — see the asymmetry note below.
 *
 * THE ASYMMETRY, DELIBERATE
 *   not_scoreable       → per-ROW data defect (one bad URL in portals.yml, or the
 *                         SSRF guard firing). Isolate it, keep the batch going.
 *   unknown_liveness_code → SYSTEMIC drift: scripts/ats/ gained a code scripts/score/
 *                         does not classify. Isolating that per-row would silently
 *                         exclude every affected role and hide precisely what the
 *                         loud failure exists to catch. So it aborts the run.
 *
 * A not-scoreable role is EXCLUDED from the output rather than passed through, so
 * it cannot reach the scorer, where `num(undefined) ?? 1` would read a missing
 * factor as a fully open gate.
 */
export function attachLiveness(roles, verdicts = {}, { overwrite = false } = {}) {
  if (!Array.isArray(roles)) throw new TypeError('attachLiveness: `roles` must be an array');
  if (verdicts === null || typeof verdicts !== 'object') {
    throw new TypeError('attachLiveness: `verdicts` must be an object of { url: code }');
  }

  const out = [];
  const rejected = [];
  const stats = { attached: 0, preserved: 0, no_url: 0, no_verdict: 0, rejected: 0 };

  for (const original of roles) {
    // Clone so the caller's array and objects are never mutated.
    const role = structuredClone(original);
    const url = role?.url;

    // No URL — nothing to look up. Pass through untouched; never invent a factor.
    if (!url) { stats.no_url++; out.push(role); continue; }

    // Has a URL but we hold no verdict for it. Same rule: leave it exactly as it was.
    if (!Object.hasOwn(verdicts, url)) { stats.no_verdict++; out.push(role); continue; }

    // Protect hand-authored liveness (e.g. the Ch.11 worked example) by default.
    if (role.liveness !== undefined && !overwrite) { stats.preserved++; out.push(role); continue; }

    const code = verdicts[url];
    let mapped;
    try {
      mapped = livenessFactor(code);
    } catch (err) {
      if (err?.code === 'not_scoreable') {
        stats.rejected++;
        rejected.push({
          role_id: role.role_id ?? null,
          company: role.company ?? null,
          url,
          code,
          reason: err.message,
        });
        continue; // excluded from `out` — must not reach the scorer
      }
      throw err; // unknown_liveness_code, or anything unexpected — never swallowed
    }

    // Copy: LIVENESS_FACTORS entries are frozen and shared.
    role.liveness = { factor: mapped.factor, source: mapped.source };
    stats.attached++;
    out.push(role);
  }

  return { roles: out, rejected, stats };
}

// ── CLI shell ───────────────────────────────────────────────────────────────

function flagValue(args, name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

/** Obtain real verdicts via Playwright. Sequential — project rule: never parallel. */
async function liveVerdicts(urls) {
  let chromium, checkUrlLiveness;
  try {
    ({ chromium } = await import('playwright'));
    ({ checkUrlLiveness } = await import('../../../ats/liveness-browser.mjs'));
  } catch (err) {
    throw new Error(
      `--live requires Playwright with Chromium (run "npx playwright install chromium"): ${err.message}`,
      { cause: err },
    );
  }
  const browser = await chromium.launch({ headless: true });
  const verdicts = {};
  try {
    const page = await browser.newPage();
    for (const url of urls) {
      const { result, code } = await checkUrlLiveness(page, url);
      verdicts[url] = code;
      console.error(`  ${result.padEnd(9)} ${code.padEnd(22)} ${url}`);
    }
  } finally {
    await browser.close();
  }
  return verdicts;
}

async function main() {
  const args = process.argv.slice(2);
  const input = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--out'
    && args[args.indexOf(a) - 1] !== '--verdicts' && args[args.indexOf(a) - 1] !== '--rejects');
  const out = flagValue(args, '--out');
  const verdictsPath = flagValue(args, '--verdicts');
  const live = args.includes('--live');
  const overwrite = args.includes('--overwrite');

  if (!input || !fs.existsSync(input)) {
    console.error('Usage: attach-liveness.mjs <roles.json> --out <path> [--verdicts <json> | --live] [--overwrite] [--rejects <path>]');
    process.exit(2);
  }
  // --out is MANDATORY and may not be the input: never write in place, and never
  // clobber a hand-authored fixture the way an in-place default would.
  if (!out) {
    console.error('attach-liveness: --out <path> is required (this tool never writes in place).');
    process.exit(2);
  }
  if (path.resolve(out) === path.resolve(input)) {
    console.error('attach-liveness: --out must differ from the input file (refusing to overwrite it).');
    process.exit(2);
  }
  if (!live && !verdictsPath) {
    console.error('attach-liveness: pass --verdicts <json> or --live to obtain liveness verdicts.');
    process.exit(2);
  }

  let roles = JSON.parse(fs.readFileSync(input, 'utf8'));
  if (!Array.isArray(roles)) roles = roles.roles || [];

  let verdicts;
  if (live) {
    const urls = [...new Set(roles.map((r) => r?.url).filter(Boolean))];
    console.error(`Checking liveness of ${urls.length} URL(s) with Playwright (sequential)...`);
    verdicts = await liveVerdicts(urls);
  } else {
    verdicts = JSON.parse(fs.readFileSync(verdictsPath, 'utf8'));
  }

  const { roles: enriched, rejected, stats } = attachLiveness(roles, verdicts, { overwrite });

  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(enriched, null, 2));

  const rejectsPath = flagValue(args, '--rejects') || `${out}.rejects.json`;
  if (rejected.length > 0) fs.writeFileSync(rejectsPath, JSON.stringify(rejected, null, 2));

  console.error(
    `\nattached ${stats.attached} · preserved ${stats.preserved} · ` +
    `no-url ${stats.no_url} · no-verdict ${stats.no_verdict} · rejected ${stats.rejected}`,
  );
  console.error(`  → ${out}`);
  if (rejected.length > 0) {
    console.error(`\n  ⛔ ${rejected.length} role(s) NOT scoreable — excluded from the output:`);
    for (const r of rejected) console.error(`     ${r.code.padEnd(22)} ${r.url}`);
    console.error(`  → ${rejectsPath}`);
    console.error('  These are portals.yml data defects or SSRF-guard hits, not liveness findings.');
  }
}

// Only run when invoked directly, so importing this module for tests does NOT
// execute the CLI (role-scorer.mjs calls main() unconditionally, which is why its
// scoreRole cannot be imported).
const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((err) => {
    console.error(`attach-liveness: ${err.message}`);
    process.exit(1);
  });
}

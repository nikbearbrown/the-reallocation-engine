#!/usr/bin/env node
/**
 * Evidence-First Output Linter — v0.1
 *
 * A deterministic conformance tool. It checks whether a Reallocation Engine
 * output follows the repository's evidence, provenance, and
 * calibrated-language conventions (SNICKERDOODLE P3, P8).
 *
 * It is NOT a truth or adequacy judge. Per SNICKERDOODLE P1: "Machines
 * verify conformance; humans verify adequacy." This tool never decides
 * whether a factual claim is true — only whether the required
 * evidence/provenance signal is present, and whether the wording claims
 * more certainty than the surrounding evidence structure supports.
 *
 * v0.1 SCOPE (deliberately narrowed — see recipes/output-linter.md
 * "Descoped for v0.1" section for the reasoning):
 *   E001  Unsourced Numeric Claim   — IMPLEMENTED
 *   W001  Over-Warranted Verb       — IMPLEMENTED
 *   E002  Unlabeled Model Judgment  — NOT IMPLEMENTED (roadmap v0.2)
 *   W002  Missing Evidence Boundary — NOT IMPLEMENTED (roadmap v0.2)
 *
 * Reason for descoping E002/W002 in v0.1: reliably deciding "is this
 * sentence a model judgment" or "is this sentence finding-shaped" without
 * a labeled marker requires semantic judgment that a deterministic,
 * regex-based v0.1 cannot make reliably. Per the project's own standard —
 * "prefer 'not implemented yet' to fabrication" — we do not ship a rule
 * that would silently guess at meaning.
 *
 * PROVENANCE MARKER RECOGNITION POLICY (important — read before relying
 * on this tool):
 *   The repository does not currently establish a single canonical
 *   inline syntax for attaching provenance to an individual claim.
 *   SNICKERDOODLE.md formally defines `[TODO: TYPE]` — a different
 *   mechanism, for marking incomplete work, not for citing evidence for
 *   a completed claim. The only inline evidence-citation precedent found
 *   in the repository's recipes is the parenthetical form
 *   `(confirmed: ...)`, used in exactly one recipe
 *   (case-backend-infra-jobops-liveness-ranfei.md).
 *
 *   This tool therefore RECOGNIZES two marker forms as evidence signals:
 *     1. `(confirmed: ...)`   — existing precedent, one recipe
 *     2. `[keyword: ...]`     — a PROPOSED bracket form (e.g.
 *                               `[source: ...]`, `[script-output: ...]`),
 *                               used for readability in this tool's own
 *                               test fixtures, NOT established elsewhere
 *                               in the repository.
 *   Neither form is declared canonical by this tool. Adopting either as
 *   a repository-wide convention is a governance decision requiring
 *   human/maintainer sign-off (SNICKERDOODLE P1), which is out of scope
 *   for a linter. This tool's job is only to recognize evidence signals
 *   when present, not to mandate their shape repo-wide.
 */

import { readFileSync, existsSync } from 'node:fs';

// ---------------------------------------------------------------------------
// Rule vocabulary
// ---------------------------------------------------------------------------

// W001 — high-certainty vocabulary that over-warrants a claim.
const HIGH_CERTAINTY_WORDS = [
  'will',
  'guarantees',
  'guarantee',
  'proves',
  'prove',
  'definitely',
  'always',
  'never',
];

// A line is "operational" (about a script/tool/file, not an
// employer/outcome claim) if it references a path-like token or a
// recognizable file extension — e.g. "The script will write
// reports/output.md." (TC-008).
const PATH_LIKE_TOKEN = /[\w.-]+\/[\w./-]+|\.(mjs|md|py|json|ya?ml|txt|csv)\b/i;

// A line is describing a SYSTEM/DATA/TEST behavior rather than making an
// employer/outcome claim if its subject is one of these nouns. This
// exempts sentences like "The data never includes private files." and
// "The test proves that the parser preserves the title field." — both
// are behavior descriptions, not over-warranted claims about an
// employer or an applicant's odds. Found via review: an unconditional
// keyword scan over "never"/"proves"/"always" flagged these as false
// positives, which is exactly the "keyword-only, not claim-context"
// failure mode the spec's TC-008 was designed to guard against for
// "will" — the same guard needed to extend to the other high-certainty
// words.
const SYSTEM_SUBJECT_CONTEXT =
  /\b(the\s+)?(data|dataset|script|tool|linter|pipeline|test|conformance\s+check(?:er)?|doctor|schema|contract)\b/i;

// E001 — recognized provenance markers (see policy note above).
// Bracket form is restricted to a small, meaningful keyword set —
// `[foo: banana]` must NOT count as evidence just because it has the
// right punctuation. An unrestricted `[anything: ...]` pattern would
// let any bracketed aside suppress a real E001 finding, which defeats
// the purpose of the check.
const PROVENANCE_MARKER =
  /\[(?:source|record|script-output|evidence|data-source)\s*:\s*[^\]]+\]|\(confirmed:\s*[^)]+\)/i;

// E001 — numeric-claim signals.
const PERCENT_PATTERN = /\b\d+(\.\d+)?\s?%/;
// Decimal number not immediately preceded by "v"/"V" (excludes version
// strings like v0.1) and not on a line mentioning "version" (excludes
// "recipe_version: 0.1.0" style frontmatter/metadata lines).
const DECIMAL_PATTERN = /(?<![vV])\b\d{1,3}\.\d{1,4}\b/;
const VERSION_CONTEXT = /\bversion\b/i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip inline code spans so numbers/words inside `...` are never scanned. */
function stripInlineCode(line) {
  return line.replace(/`[^`]*`/g, '');
}

function hasProvenanceMarker(line) {
  return PROVENANCE_MARKER.test(line);
}

function hasNumericClaim(line) {
  if (VERSION_CONTEXT.test(line)) return false;
  const stripped = stripInlineCode(line);
  if (PERCENT_PATTERN.test(stripped)) return true;
  if (DECIMAL_PATTERN.test(stripped)) return true;
  return false;
}

function isOperationalWillContext(line) {
  return PATH_LIKE_TOKEN.test(line);
}

// Anchored to sentence-subject position deliberately: we only want to
// exempt sentences that ARE ABOUT the system/data/test (subject at the
// front), not any sentence that merely mentions one of these nouns in
// passing (e.g. "ExampleCo always tests new hires before extending an
// offer" should still be evaluable, not blanket-exempted just because
// it contains "tests").
function isSystemSubjectContext(line) {
  const trimmed = line.trim();
  return /^(the\s+)?(data|dataset|script|tool|linter|pipeline|test|conformance\s+check(?:er)?|doctor|schema|contract)\b/i.test(
    trimmed
  );
}

// ---------------------------------------------------------------------------
// Rule checks — each returns an array of findings for one line
// ---------------------------------------------------------------------------

function checkE001(line) {
  if (!hasNumericClaim(line)) return [];
  if (hasProvenanceMarker(line)) return [];
  return [
    {
      code: 'E001',
      severity: 'error',
      name: 'UNSOURCED_NUMERIC_CLAIM',
      message: 'Quantitative claim has no recognized provenance marker.',
    },
  ];
}

function checkW001(line) {
  const findings = [];
  const stripped = stripInlineCode(line);

  for (const word of HIGH_CERTAINTY_WORDS) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    if (!re.test(stripped)) continue;

    if (word.toLowerCase() === 'will' && isOperationalWillContext(stripped)) {
      // Operational statement about a script/tool/file — not a claim
      // about an outcome. Exempted per TC-008.
      continue;
    }
    if (word.toLowerCase() !== 'will' && isSystemSubjectContext(stripped)) {
      // Sentence subject is the system/data/test itself, not an
      // employer/outcome claim — e.g. "The data never includes private
      // files." Exempted for the same reason TC-008 exempts operational
      // "will".
      continue;
    }

    findings.push({
      code: 'W001',
      severity: 'warning',
      name: 'OVER_WARRANTED_VERB',
      message: `Wording ("${word}") asserts more certainty than the evidence boundary supports.`,
    });
    break; // one W001 finding per line is enough signal; avoid noisy duplicates
  }

  return findings;
}

// ---------------------------------------------------------------------------
// Core lint routine
// ---------------------------------------------------------------------------

/**
 * @param {string} text  Full file contents.
 * @returns {{findings: Array, errors: number, warnings: number}}
 */
export function lint(text) {
  const lines = text.split(/\r?\n/);
  const findings = [];
  let inCodeFence = false;

  lines.forEach((rawLine, idx) => {
    const lineNo = idx + 1;
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      inCodeFence = !inCodeFence;
      return; // fence markers themselves are never scanned
    }
    if (inCodeFence) return; // command/code blocks are non-claim context

    const lineFindings = [...checkE001(rawLine), ...checkW001(rawLine)];
    for (const f of lineFindings) {
      findings.push({ ...f, line: lineNo, text: rawLine.trim() });
    }
  });

  const errors = findings.filter((f) => f.severity === 'error').length;
  const warnings = findings.filter((f) => f.severity === 'warning').length;

  return { findings, errors, warnings };
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------

function formatHuman(inputPath, result) {
  const out = [];
  out.push('Evidence-First Output Linter');
  out.push('');
  out.push(`File: ${inputPath}`);
  out.push('');

  for (const f of result.findings) {
    out.push(`${f.code} line ${f.line} ${f.name}`);
    out.push(`  "${f.text}"`);
    out.push(`  ${f.message}`);
    out.push('');
  }

  out.push('Summary');
  out.push(`Errors:   ${result.errors}`);
  out.push(`Warnings: ${result.warnings}`);
  out.push('');
  out.push(result.errors + result.warnings > 0 ? 'LINT FAILED' : 'LINT PASSED');

  return out.join('\n');
}

function formatJson(inputPath, result) {
  return JSON.stringify(
    {
      file: inputPath,
      errors: result.errors,
      warnings: result.warnings,
      findings: result.findings.map((f) => ({
        code: f.code,
        severity: f.severity,
        line: f.line,
        message: f.name,
      })),
    },
    null,
    2
  );
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  const inputPath = args.find((a) => !a.startsWith('--'));

  if (!inputPath) {
    console.error('Usage: node scripts/output-linter.mjs <input-file> [--json]');
    process.exit(2);
  }
  if (!existsSync(inputPath)) {
    console.error(`Error: file not found: ${inputPath}`);
    process.exit(2);
  }

  let text;
  try {
    text = readFileSync(inputPath, 'utf8');
  } catch (err) {
    console.error(`Error: could not read file: ${err.message}`);
    process.exit(2);
  }

  const result = lint(text);
  const output = jsonMode ? formatJson(inputPath, result) : formatHuman(inputPath, result);
  console.log(output);

  process.exit(result.errors + result.warnings > 0 ? 1 : 0);
}

// Only run the CLI when this file is executed directly (not when imported
// by the test runner).
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

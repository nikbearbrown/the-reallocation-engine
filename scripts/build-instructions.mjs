#!/usr/bin/env node
// build-instructions.mjs
// Compile the instruction SOURCE (instructions/_shared/*.md shared modules +
// instructions/<project>.md + instructions/manifest.yml) into the tool-native
// adapters — the same source-vs-adapter pattern as build-prompts.mjs, applied to
// the repo's instruction files.
//
//   AGENTS.md  — the cross-tool standard (Codex, Cursor, Gemini CLI, Copilot…):
//                shared modules + project, INLINED (AGENTS.md has no import syntax).
//                This is the CANONICAL adapter; every other shim points AT it.
//   CLAUDE.md  — Claude Code reads this name: `@AGENTS.md` import + a claude_only
//                tail (Claude supports @import, so no duplication).
//
// Thin shims (generated, never hand-edited — so they cannot drift; each points at
// the canonical AGENTS.md / SNICKERDOODLE.md instead of duplicating rule content):
//   .gemini/settings.json               — Gemini CLI context.fileName → AGENTS.md
//   .aider.conf.yml                     — Aider read: AGENTS.md (it won't auto-read it)
//   .github/copilot-instructions.md     — Copilot pointer to AGENTS.md
//   .cursor/rules/reallocation-engine.mdc — Cursor alwaysApply rule → AGENTS.md
//
// Which shims are emitted is controlled by `targets:` in instructions/manifest.yml.
// NEVER hand-edit any generated file — edit instructions/ and rebuild. This is what
// kills the drift class (the files can no longer diverge; nobody writes them by hand).
//
// Usage:
//   node scripts/build-instructions.mjs            # build to .build/ + show the diff vs root
//   node scripts/build-instructions.mjs --promote  # build, then promote .build/ -> repo root
//
// The default (no --promote) is the VERIFIED gate: review the diff, then promote.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SRC = 'instructions';
const SHARED = path.join(SRC, '_shared');
const BUILD = path.join(SRC, '.build');
const ROOT = '.';

const MD_BANNER =
`<!-- GENERATED FILE — do not edit by hand.
     Source: instructions/ (_shared/ modules + project file) · manifest: instructions/manifest.yml
     Rebuild: node scripts/build-instructions.mjs   ·   Promote: --promote
     Hand edits are overwritten on the next build. -->\n\n`;

const YAML_BANNER =
`# GENERATED FILE — do not edit by hand.
# Source: instructions/ · manifest: instructions/manifest.yml
# Rebuild: node scripts/build-instructions.mjs --promote\n`;

const GEN_NOTE =
'GENERATED from instructions/ by scripts/build-instructions.mjs — do not edit by hand. ' +
'Thin shim: points at the canonical AGENTS.md (SNICKERDOODLE.md governs).';

// --- manifest (YAML via PyYAML, like conformance.mjs) --------------------
function loadManifest() {
  const p = path.join(SRC, 'manifest.yml');
  if (!fs.existsSync(p)) { console.error(`No ${p}`); process.exit(2); }
  const json = execSync(
    `python3 -c "import yaml,json,sys;print(json.dumps(yaml.safe_load(open('${p}'))))"`,
    { encoding: 'utf8' });
  return JSON.parse(json);
}

function readModule(name) {
  // suite-local-first: a project may override a shared module by dropping a
  // same-named file in instructions/ (mirrors prompts/ _shared resolution)
  for (const base of [SRC, SHARED]) {
    const p = path.join(base, name);
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
  }
  throw new Error(`module not found (checked ${SRC}/ then ${SHARED}/): ${name}`);
}

function assembleBody(m) {
  const parts = (m.shared || []).map(readModule);
  if (m.project) parts.push(readModule(m.project));
  return parts.join('\n\n');
}

// --- builders ------------------------------------------------------------
function buildAgents(body) {
  return MD_BANNER + '# Agent Instructions\n\n' + body + '\n';
}
function buildClaude(m) {
  const tail = (m.claude_only || []).join('\n');
  return MD_BANNER + '@AGENTS.md\n\n' + (tail ? tail + '\n' : '');
}
// Gemini CLI: no import syntax in GEMINI.md, but settings.json can point context
// at an existing file — so we point it at AGENTS.md (zero rule duplication).
function buildGemini() {
  return JSON.stringify({
    _comment: GEN_NOTE,
    context: { fileName: ['AGENTS.md', 'SNICKERDOODLE.md'] },
  }, null, 2) + '\n';
}
// Aider: does not auto-read AGENTS.md; `read:` loads it as read-only context.
function buildAider() {
  return YAML_BANNER + 'read:\n  - AGENTS.md\n  - SNICKERDOODLE.md\n';
}
// Copilot: reads .github/copilot-instructions.md; no import — thin pointer.
function buildCopilot() {
  return MD_BANNER +
`# Copilot Instructions — The Reallocation Engine

Read **\`AGENTS.md\`** (generated cross-agent instructions) and **\`SNICKERDOODLE.md\`**
(the constitution — it governs) before acting. The portable read-first map is
**\`_MANIFEST.md\`**.

If anything conflicts with \`SNICKERDOODLE.md\`, it wins, and the conflict is a bug —
log it in \`logs/RUN_LOG.md\`.
`;
}
// Cursor: .mdc rule with frontmatter; alwaysApply so it loads every session.
function buildCursor() {
  return `---
description: The Reallocation Engine — read the canonical agent instructions
alwaysApply: true
---
` + MD_BANNER +
`Read \`AGENTS.md\` (generated cross-agent instructions) and \`SNICKERDOODLE.md\`
(the constitution; it governs) before acting. Portable read-first map: \`_MANIFEST.md\`.
Conflicts → \`SNICKERDOODLE.md\` wins; log them in \`logs/RUN_LOG.md\`.
`;
}

// target name (manifest.yml `targets:`) -> { file, build(m, body) }
const TARGETS = {
  agents:  { file: 'AGENTS.md',                                build: (m, body) => buildAgents(body) },
  claude:  { file: 'CLAUDE.md',                                build: (m)       => buildClaude(m) },
  gemini:  { file: '.gemini/settings.json',                   build: ()        => buildGemini() },
  aider:   { file: '.aider.conf.yml',                         build: ()        => buildAider() },
  copilot: { file: '.github/copilot-instructions.md',         build: ()        => buildCopilot() },
  cursor:  { file: '.cursor/rules/reallocation-engine.mdc',   build: ()        => buildCursor() },
};

function diff(rootFile, buildFile) {
  if (!fs.existsSync(rootFile)) { console.log(`  (new) ${rootFile} — no current version`); return true; }
  try {
    execSync(`diff -u "${rootFile}" "${buildFile}"`, { stdio: 'pipe' });
    console.log(`  = ${rootFile} unchanged`); return false;
  } catch (e) {
    console.log(`--- diff: ${rootFile} ---`);
    console.log(e.stdout?.toString() || '(changed)');
    return true;
  }
}

function writeNested(base, name, content) {
  const out = path.join(base, name);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}

function main() {
  const promote = process.argv.includes('--promote');
  const m = loadManifest();
  const body = assembleBody(m);

  fs.mkdirSync(BUILD, { recursive: true });
  const outputs = {};
  for (const t of (m.targets || [])) {
    const spec = TARGETS[t];
    if (!spec) { console.error(`  ! unknown target in manifest.yml: ${t} (skipped)`); continue; }
    outputs[spec.file] = spec.build(m, body);
  }

  for (const [name, content] of Object.entries(outputs))
    writeNested(BUILD, name, content);
  console.log(`✓ staged ${Object.keys(outputs).join(' + ')} in ${BUILD}/\n`);

  if (!promote) {
    let changed = false;
    for (const name of Object.keys(outputs))
      changed = diff(path.join(ROOT, name), path.join(BUILD, name)) || changed;
    console.log(changed
      ? '\nReview the diff above, then promote:  node scripts/build-instructions.mjs --promote'
      : '\nNo changes vs the current root files.');
    return;
  }

  for (const name of Object.keys(outputs)) {
    const dest = path.join(ROOT, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(BUILD, name), dest);
    console.log(`  promoted ${name}`);
  }
  console.log('✓ Adapters regenerated from source. Do not hand-edit them.');
}

main();

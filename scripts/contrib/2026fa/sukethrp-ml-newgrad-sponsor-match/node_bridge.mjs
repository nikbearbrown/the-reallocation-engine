#!/usr/bin/env node
// node_bridge.mjs — lets sponsor_match.py reuse the engine's JavaScript
// instead of copying it into Python.
//
//   node node_bridge.mjs yaml <file.yml>     → the YAML file as JSON on stdout
//                                              (js-yaml, already a repo dependency)
//   node node_bridge.mjs liveness < in.json  → classify saved posting snapshots with
//                                              scripts/ats/liveness-core.mjs classifyLiveness
//
// `liveness` reads a JSON array of {status, finalUrl, bodyText, applyControls}
// and prints a same-length array of {result, code, reason}. No network: it only
// classifies text that is already on disk.

import fs from 'node:fs';
import yaml from 'js-yaml';
import { classifyLiveness } from '../../../ats/liveness-core.mjs';

const [cmd, arg] = process.argv.slice(2);

if (cmd === 'yaml') {
  if (!arg) { console.error('usage: node_bridge.mjs yaml <file.yml>'); process.exit(2); }
  process.stdout.write(JSON.stringify(yaml.load(fs.readFileSync(arg, 'utf8'))));
} else if (cmd === 'liveness') {
  const snapshots = JSON.parse(fs.readFileSync(0, 'utf8'));
  if (!Array.isArray(snapshots)) { console.error('liveness: expected a JSON array on stdin'); process.exit(2); }
  process.stdout.write(JSON.stringify(snapshots.map((s) => classifyLiveness(s))));
} else {
  console.error('usage: node_bridge.mjs yaml <file.yml> | liveness < snapshots.json');
  process.exit(2);
}

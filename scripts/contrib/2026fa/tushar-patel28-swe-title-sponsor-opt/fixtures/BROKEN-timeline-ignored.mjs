// BROKEN mutant (G2): the scorer ignores the timeline factor we send and multiplies by 1.
// A role starting before the EAD start would then be scored as if the date fit. The gate-echo guard
// must reject this scorer's output.
import { runMutant } from './mutant-runner.mjs';

runMutant(
  'BROKEN-timeline-ignored',
  'const timeline = num(role.timeline?.factor) ?? 1;',
  'const timeline = 1;',
);

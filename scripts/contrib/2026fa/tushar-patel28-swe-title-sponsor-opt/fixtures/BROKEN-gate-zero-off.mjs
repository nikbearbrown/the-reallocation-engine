// BROKEN mutant (G2): a closed gate is no longer recognised as closed (gate_zero below any factor).
// The composite is still 0, but the scorer stops saying "gated: timeline" — it would read as an ordinary
// low score. The gate-echo guard requires every timeline=0 role to be a gated Skip, so it must reject this.
import { runMutant } from './mutant-runner.mjs';

runMutant(
  'BROKEN-gate-zero-off',
  'gate_zero: 0.05,',
  'gate_zero: -1,',
);

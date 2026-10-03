// BROKEN mutant (F6): reproduces the EFFECT of the F-1 "work authorized" bug without passing --profile.
// The real bug: applyProfile's regex matches "authorized" in an F-1 profile -> needsSponsor = false ->
// sponsorship weight 0. Here needsSponsor is forced false for the no-profile path. The sponsorship-weight
// guard must reject this scorer's output.
import { runMutant } from './mutant-runner.mjs';

runMutant(
  'BROKEN-sponsorship-weight-zero',
  'const needsSponsor = profile == null ? true',
  'const needsSponsor = profile == null ? false',
);

#!/usr/bin/env node
// Demo: fixed durations, asserts exact output. --assert exits non-zero on mismatch.
import { parseSeconds, format } from '../src/duration.mjs';

const CASES = [
  ['P1W', 604800, 'P1W'],
  ['PT1H30M', 5400, 'PT1H30M'],
  ['P1DT2H', 93600, 'P1DT2H'],
];

let failed = 0;
for (const [input, seconds, canonical] of CASES) {
  const s = parseSeconds(input);
  const f = format(input);
  const pass = s === seconds && f === canonical;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${input} -> ${s}s ${f}`);
}
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);

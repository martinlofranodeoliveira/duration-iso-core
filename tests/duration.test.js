import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parse, toSeconds, parseSeconds, format, DurationError } from '../src/duration.mjs';

describe('parse', () => {
  it('parses weeks, days and clock parts', () => {
    assert.deepEqual(parse('P1W'), { weeks: 1, days: 0, hours: 0, minutes: 0, seconds: 0 });
    assert.deepEqual(parse('P1DT2H30M15S'), { weeks: 0, days: 1, hours: 2, minutes: 30, seconds: 15 });
    assert.deepEqual(parse('pt36h'), { weeks: 0, days: 0, hours: 36, minutes: 0, seconds: 0 });
  });
  it('rejects years/months as calendar-ambiguous', () => {
    assert.throws(() => parse('P1Y'), (e) => e.code === 'CALENDAR_AMBIGUOUS');
    assert.throws(() => parse('P1M'), (e) => e.code === 'CALENDAR_AMBIGUOUS');
    assert.throws(() => parse('P1Y2M3DT4H'), (e) => e.code === 'CALENDAR_AMBIGUOUS');
  });
  it('rejects empty, bare and combined weeks', () => {
    assert.throws(() => parse('P'), (e) => e.code === 'BAD_DURATION');
    assert.throws(() => parse('PT'), (e) => e.code === 'BAD_DURATION');
    assert.throws(() => parse('P1W2D'), (e) => e.code === 'BAD_DURATION');
    assert.throws(() => parse('tomorrow'), (e) => e.code === 'BAD_DURATION');
    assert.throws(() => parse(42), (e) => e.code === 'NOT_STRING');
    assert.ok(new DurationError('X') instanceof Error);
  });
});

describe('seconds and format', () => {
  it('converts fixed units', () => {
    assert.equal(parseSeconds('P1W'), 604800);
    assert.equal(parseSeconds('P7D'), 604800);
    assert.equal(parseSeconds('PT1H30M'), 5400);
    assert.throws(() => parseSeconds('P400D'), (e) => e.code === 'OUT_OF_BOUNDS');
  });
  it('formats canonically with round-trip', () => {
    assert.equal(format('P1W'), 'P1W');
    assert.equal(format('PT1H30M'), 'PT1H30M');
    assert.equal(format('P1DT2H'), 'P1DT2H');
    assert.equal(format('PT90S'), 'PT1M30S');
    for (const s of ['P1W', 'P7D', 'PT1H30M', 'P1DT2H15M9S']) {
      assert.equal(parseSeconds(format(s)), parseSeconds(s));
    }
  });
});

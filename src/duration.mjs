// SPDX-License-Identifier: MIT
// ISO 8601 durations over unambiguous units: weeks, days, hours, minutes,
// integer seconds. Years/months rejected as calendar-ambiguous (explicit
// code, never silently fixed). No network, no I/O.

export const MAX_TOTAL_SECONDS = 366 * 86400;

export class DurationError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'DurationError';
    this.code = code;
  }
}

const RE = /^P(?:(\d+)W|(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?)$/;

/**
 * Parse to frozen { weeks, days, hours, minutes, seconds }.
 * Rejects Y/M (CALENDAR_AMBIGUOUS), empty/ bare 'P' (BAD_DURATION).
 */
export function parse(input) {
  if (typeof input !== 'string') throw new DurationError('NOT_STRING');
  const t = input.trim().toUpperCase();
  if (/P\d+[YM]/.test(t) || /P[^T]*[YM]/.test(t.replace(/T.*$/, ''))) {
    throw new DurationError('CALENDAR_AMBIGUOUS', 'years/months need a calendar');
  }
  const m = RE.exec(t);
  if (!m || t === 'P' || t === 'PT') throw new DurationError('BAD_DURATION');
  const [, w, d, h, mi, s] = m;
  if (w !== undefined && (d !== undefined || h !== undefined || mi !== undefined || s !== undefined)) {
    throw new DurationError('BAD_DURATION', 'weeks do not combine');
  }
  if (w === undefined && d === undefined && h === undefined && mi === undefined && s === undefined) {
    throw new DurationError('BAD_DURATION');
  }
  return Object.freeze({
    weeks: Number(w ?? 0),
    days: Number(d ?? 0),
    hours: Number(h ?? 0),
    minutes: Number(mi ?? 0),
    seconds: Number(s ?? 0),
  });
}

/** Total seconds (W=604800, D=86400, H=3600, M=60). Bounded to one year. */
export function toSeconds(parts) {
  for (const k of ['weeks', 'days', 'hours', 'minutes', 'seconds']) {
    if (!Number.isInteger(parts?.[k]) || parts[k] < 0) throw new DurationError('BAD_PARTS');
  }
  const total = parts.weeks * 604800 + parts.days * 86400 + parts.hours * 3600 + parts.minutes * 60 + parts.seconds;
  if (total > MAX_TOTAL_SECONDS || total <= 0) throw new DurationError('OUT_OF_BOUNDS');
  return total;
}

/** Convenience: parse then convert. */
export function parseSeconds(input) {
  return toSeconds(parse(input));
}

/** Canonical minimal form (weeks stay weeks; else D+H+M+S split). */
export function format(parts) {
  const total = typeof parts === 'string' ? parseSeconds(parts) : toSeconds(parts);
  if (total % 604800 === 0) return `P${total / 604800}W`;
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  let out = 'P';
  if (d) out += `${d}D`;
  const t = `${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
  if (t) out += `T${t}`;
  return out;
}

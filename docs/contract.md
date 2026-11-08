# Contract — duration-iso-core

Pure ESM in `src/duration.mjs`, zero runtime dependencies, Node >= 22.
Integer weeks/days/hours/minutes/seconds only. Years and months are
rejected with `CALENDAR_AMBIGUOUS` — never silently fixed to 365/30 days.

| Export | Result |
| --- | --- |
| `MAX_TOTAL_SECONDS` (31622400 = 366d) | Hard bound. |
| `parse(input)` | Frozen `{ weeks, days, hours, minutes, seconds }`. Case-insensitive. Weeks never combine (`P1W2D` invalid). |
| `toSeconds(parts)` | Fixed factors (W=604800, D=86400, H=3600, M=60). Zero/over-year → `OUT_OF_BOUNDS`. |
| `parseSeconds(input)` | Parse + convert. |
| `format(partsOrString)` | Canonical minimal: `P1W`, `P1DT2H`, `PT1H30M`. |

Errors: `NOT_STRING` · `CALENDAR_AMBIGUOUS` · `BAD_DURATION` ·
`BAD_PARTS` · `OUT_OF_BOUNDS`.

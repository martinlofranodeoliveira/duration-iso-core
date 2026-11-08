# Design — duration-iso-core

One anchored regex with optional groups; the calendar check runs first
so `P1Y2M3DT4H` reports ambiguity instead of partially parsing. Weeks
are ISO-isolated by construction. Formatting decomposes greedily
(W if divisible, else D/H/M/S), and every canonical form re-parses to
the same total — the round-trip test pins this.

Oracle: week/day/clock hand values, ambiguity rejections, bound
rejection, canonical shapes. No fractional seconds, no month math.

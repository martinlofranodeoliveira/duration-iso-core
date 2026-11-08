# duration-iso-core

ISO 8601 durations over unambiguous units (weeks/days/time), with explicit
rejection of calendar-ambiguous years/months. Zero runtime dependencies,
Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { parseSeconds, format } from './src/duration.mjs';
parseSeconds('PT1H30M'); // 5400
format('PT90S');         // 'PT1M30S'
```

```sh
npm test          # 5 tests, node:test, no dependencies
npm run demo
```

At most 366 days; `P1Y` fails loudly instead of guessing. MIT — see
`LICENSE`. [Versão em português](README.pt-BR.md).

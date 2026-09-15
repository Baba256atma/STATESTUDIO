# Regression gates

| Gate | Result |
| --- | --- |
| Independent TypeScript | PASS with `NODE_OPTIONS=--max-old-space-size=8192`; the default 4 GB run ended with a confirmed heap OOM rather than hanging |
| Focused RECERT-FIX2 | PASS (12/12) |
| Manager-experience owning layer | PASS |
| FIX2 + historical regression scope | PASS (46/46 across four suites) |
| Production build | PASS; 13 routes generated |
| Live `/executive` | PASS (9/9); 0 page errors; 0 architecture-copy leaks |
| NXA L1 | PASS (1/1 required task) |
| NXA L2 | PASS (1/1 required task) |
| NXA L3 | PASS (1/1 required task) |
| NXA L4 | PASS (7/7 required tasks; `durationMs` 296155) |

Zero-Failure: no required gate failed, skipped, remained running, or remained uninspected.

Two pre-existing Next.js development servers and `.next/dev/lock` were observed. They predated this recovery and were not provably task-owned, so they were not terminated. No stale build, test, funnel, or live-audit process remained.


# Regression gates

| Gate | Result |
|---|---|
| Focused FIX3 | PASS — 16/16 |
| Affected focused regression batch | PASS — 77/77 |
| RECERT-FIX1/FIX2 and FINAL fidelity combined | PASS — included in 101/101 historical batch |
| NXA L1 | PASS — 19/19 |
| NXA L2 | PASS — 437/437 |
| NXA L3 | PASS — 47/47 |
| NXA L4 | PASS — 7/7 required tasks |
| L4 executive omnibus | PASS — 1613/1613 |
| DIR inventory | PASS — 58/58 |
| TypeScript | PASS |
| ESLint PREP surface | PASS |
| Diff check PREP surface | PASS |
| Production build | PASS |
| NXA live smoke | PASS |
| 103-turn FIX3 live replay | FAIL — 33/34 |
| Live page errors | PASS — 0 |
| Architecture leaks | PASS — 0 |
| Decision/CC:10 canonical safety | PASS |
| Execution/CC:11 canonical safety | PASS |
| Mutation safety | PASS |
| Causal safety | PASS |

The required live parity failure blocks certification even though the automated funnel, typecheck, and build pass.

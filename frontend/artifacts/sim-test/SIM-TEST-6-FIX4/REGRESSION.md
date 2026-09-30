# FIX4 regression funnel

| Gate | Result |
| --- | --- |
| T71 focused reproduction | PASS `fnv1a32:fada8518` |
| Referent candidate/selection + matrix tests | PASS `nexoraSimulationReferentFix4.test.ts` |
| CC:1 owner tests | PASS `conversationalIntent.test.ts` |
| FIX3 T69 | PASS |
| FIX2 T64 | PASS (`obj-delivery` locative) |
| FIX1 T50 | PASS (no REPEATED_CLARIFICATION at T50) |
| SIM-TEST:5-FIX3 named-issue / unique Execution | PASS |
| SIM-TEST:5-FIX2 / FIX1 regressions (via existing sim-test files) | PASS |
| FINAL:6.2 / 6.3 lifetime tests | PASS |
| FAST parity | PASS S1=0 signature `fnv1a32:8a0767d0` |
| TypeScript | PASS (8GB heap) |
| Changed-path ESLint | PASS |
| New S0 | 0 |
| New FIX4-owned S1 | 0 |
| Harness failures | 0 |

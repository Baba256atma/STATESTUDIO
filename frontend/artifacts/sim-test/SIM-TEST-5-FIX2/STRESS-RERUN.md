# SIM-TEST:5-FIX2 — stress / journey rerun

Deterministic SIM-TEST:5 journeys after Advisor/evidence repair. Manager scripts not rewritten to avoid failures.

| Journey | Signature | S0 | S1 | Harness | Decision | Execution |
| --- | --- | --- | --- | --- | --- | --- |
| manufacturing-lifecycle | fnv1a32:87fcb824 | 0 | 2 | PASS | cc10:decision:cc9:scenario:do-nothing:do-nothing:v1 count=1 | execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1 in-progress @ T17 |
| project-lifecycle | fnv1a32:28ecdf3f | 0 | 2 | PASS | cc10:decision:cc9:scenario:intervention:obj-delivery:v1 count=1 | not started by T17 in this bounded project path (independent clarification) |
| logistics-parity | fnv1a32:3cadb58b | 0 | 0 | PASS | Option B path retained from FIX1 | parity |
| service-parity | fnv1a32:497aed1b | 0 | 0 | PASS | Option B path retained from FIX1 | parity |
| fast-lifecycle | fnv1a32:fd9b7750 | 0 | 0 | PASS | FIX1 path | FAST |

FIX1 manufacturing signature `fnv1a32:418b0673` changed because T15/T38/T4 presentation and isolation changed. Project signature unchanged.

Remaining S1: manufacturing T28/T31 REPEATED_CLARIFICATION; project T13/T16 REPEATED_CLARIFICATION.

Newly exposed after evidence repair: none classified as S0. Remaining named-issue findings were already independent after FIX1.

CSV versions manufacturing: v1 → v2 tick 7 → v3 tick 21 preserved.

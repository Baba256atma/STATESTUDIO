# SIM-TEST:6-FIX14-R3 Regression

## Focused results

- Exact three Runtime-mutation cases after repair: 3 pass / 0 fail.
- R3 read/write plus owning Director tests: 8 pass / 0 fail.
- R2, FIX10–FIX14, CC:1, CC:10, and R3 guard matrix: 91 pass / 0 fail.

| Proof | Result |
| --- | --- |
| `What is Demand Surge Scenario?` does not commit Runtime | PASS |
| Scenario explanation mutation guard | PASS |
| `explain DEMAND SURGE` does not commit Runtime | PASS |
| `Explain`, `What is`, `Describe`, and `Tell me about` share read semantics | PASS |
| Explanation Runtime state is structurally unchanged | PASS |
| Explanation Director plan is `NO_CHANGE` | PASS |
| Explicit `Show scenarios` still produces `SHOW_COLLECTION` mutation | PASS |
| R2 navigation | PASS |
| FIX14 | PASS |
| FIX13 | PASS |
| FIX12 | PASS |
| FIX11 | PASS |
| FIX10 | PASS |
| CC:10 Decision authority | PASS |
| Genuine ambiguity clarification | PASS |
| Ground Truth leakage | NO |

## Remaining Scenario tests

- Delayed Delivery `why?` response fidelity: FAIL unchanged — independent.
- `why?` after `explain DEMAND SURGE` semantic operation: FAIL unchanged — independent.
- Additional code added for either failure: NO.

## Funnel

- NXA Level 1: PASS — 19 pass / 0 fail / 0 skipped.
- NXA Level 2: FAIL — 451 pass / 2 fail / 0 skipped.
- New Level 2 failures introduced: 0.
- Known remaining Level 2 failures: 2.
- Required background tasks still running/uninspected: 0.
- Levels 3 and 4: not run because Level 2 remains red.


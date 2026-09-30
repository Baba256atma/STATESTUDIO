# SIM-TEST:6-FIX14-R2 Regression

## Focused results

- Exact Level 2 navigation reproductions after repair: 3 pass / 0 fail.
- R2 semantic guards: 5 pass / 0 fail.
- R2 plus clarification-lifetime and named-historical-return guards: 26 pass / 0 fail.
- FIX10–FIX14, CC:1, CC:10, and R2 guard matrix: 89 pass / 0 fail.

| Guard | Result |
| --- | --- |
| Conversation `Go back` | PASS |
| Recommendation `Go back` | PASS |
| Scenario `Go back` | PASS |
| No-target navigation does not fabricate a subject | PASS |
| Genuine clarification answer `Capacity.` closes the pending clarification | PASS |
| Named historical return restores Delivery | PASS |
| Unrelated use of `back` is not navigation | PASS |
| FIX14 terse named details | PASS |
| FIX13 independent non-commitment request | PASS |
| FIX12 current-subject deictic issue | PASS |
| FIX11 named historical return | PASS |
| FIX10 data referent | PASS |
| CC:10 Decision authority | PASS |
| Ground Truth leakage | NO |

## Funnel

- NXA Level 1: PASS — 19 pass / 0 fail / 0 skipped.
- NXA Level 2: FAIL — 448 pass / 5 fail / 0 skipped.
- New Level 2 failures introduced: 0.
- Navigation failures remaining: 0.
- Known remaining Level 2 debt: 5, all in the previously classified Scenario explanation/runtime-mutation and `why?` semantic/response clusters.
- Required background tasks still running/uninspected: 0.
- Levels 3 and 4: not run because Level 2 remains red.


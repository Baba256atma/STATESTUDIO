# SIM-TEST:6-FIX14-R4 Regression

## Focused proof

- Exact two pre-repair failures: 0 pass / 2 fail.
- Exact two cases after repair: 2 pass / 0 fail.
- R4 semantic/response proof plus R3 read-only and Scenario composition: 16 pass / 0 fail.
- Bounded FIX10–FIX14, R2–R4, intent, and CC:10 commitment guard: 94 pass / 0 fail.

| Proof | Result |
| --- | --- |
| Demand Surge subject continuity | PASS |
| Demand Surge `describe` → `impact-why` transition | PASS |
| Delayed Delivery modeled-relationship fidelity | PASS |
| Modeled relationship is not promoted to proven cause | PASS |
| Subjectless `why?` does not invent a Scenario or cause | PASS |
| Scenario explanation remains read-only | PASS |
| Director remains `NO_CHANGE` for Scenario explanation | PASS |
| `shouldCommitRuntime=false` for Scenario explanation | PASS |
| R3 | PASS |
| R2 navigation | PASS |
| FIX14 | PASS |
| FIX13 | PASS |
| FIX12 | PASS |
| FIX11 | PASS |
| FIX10 | PASS |
| CC:10 Decision authority | PASS |
| Ground Truth leakage | NO |

## NXA funnel

- Level 1: PASS — 19 pass / 0 fail / 0 skipped.
- Level 2: PASS — 453 pass / 0 fail / 0 skipped.
- Level 3: PASS — 48 pass / 0 fail / 0 skipped.
- Level 4: FAIL — 1656 pass / 5 fail / 0 skipped.
- R4-attributable new failures: 0.
- Required tasks still running: 0.
- Required results uninspected: 0.
- Nonessential tasks still running: 0.

## Level 4 failure inventory

- `NEX-MVP-FINAL:6.1`: one NLU ambiguity corpus failure.
- `NEX-MVP-FINAL:6.3`: clarification corpus, EXPLAIN resume, and reset-precondition failures caused by the same missing clarification state.
- `NEX-MVP-FINAL:6.4`: generic Advisor response verbosity on four corpus turns within one failing test.

The smallest next certification-recovery blocker is the earliest one-case NLU ambiguity divergence for `Show the risk problem.` No repair for that independent blocker was attempted in R4.

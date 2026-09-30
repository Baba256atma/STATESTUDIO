# SIM-TEST:6-FIX14-R9 Regression

## Baseline (frozen before repair)

- SIM-TEST: 156/158 (FAST pin, S1-06).
- Typecheck: 0 errors.
- R5–R8 guards: green.

## Repair

- Root B, FINAL:6.1 `canonicalManagerMeaningInterpreter.ts` `findObjectMentions` last-resort part matching.
  - FIX10's coverage rule is kept for modifiers and aliases.
  - When the key is not fully covered, a compound **canonical name's** head (final) word may still match ("pressure" names Margin Pressure). A modifier word ("production" in the alias "production capacity") still does not. An alias head ("performance" in "delivery performance") still does not.
  - A head-only match that two subjects share at the best distance selects nothing (no silent pick).
- Root A: no production change. Intended FIX11 behavior. The FAST pin in `nexoraSimulationDecisionFix5.test.ts` was re-baselined `8a0767d0` → `3aa7cfc6`, and new FAST semantic invariants now guard it.
- New authority: NO. Simulation-specific logic: NO. No utterance, scenario, turn, object, test-name, or hash checks in production.

## Focused (`nexoraSimulationRegressionFix14R9.test.ts`): 8 pass / 0 fail / 0 skipped

| Test | Result | Pre-repair |
| --- | --- | --- |
| B1: exact S1-06 journey. T2 Advisor `ctx-problem-margin`; T3 evidence answer ("not a confirmed cause", "not enough evidence"), no "Which item do you mean?" | PASS | FAIL |
| B2: one-referent evidence follow-up proceeds (after the pressure turn, and after `Show Capacity.`) | PASS | FAIL |
| B3: two competing recent referents: `Explain that.` clarifies with pending | PASS | PASS (guard) |
| B4: FIX8 `What supports that claim?` → `obj-inventory` | PASS | PASS (guard) |
| B5/B6: unresolved `Explain that.` clarifies; resolved proceeds on Delivery | PASS | PASS (guard) |
| 6.1 head-noun resolves; modifier (`production data`) not Capacity; alias head (`performance`) null | PASS | FAIL |
| 6.1 shared head noun (synthetic Cost Pressure + Margin Pressure) does not silently pick | PASS | PASS (guard) |
| FAST: T16/T17/T20/T21/T30 canonical = Advisor = Stage = `obj-capacity`; S0/S1 = 0 | PASS | FAILS without FIX11: controlled run shows Advisor `ctx-problem-capacity` vs canonical `obj-capacity` at T17/T20/T21 |

The FAST-without-FIX11 row is evidenced by the controlled reverse run recorded in ROOT-CAUSE.md. Re-running the test itself against that reversed tree was not repeated.

## FAST replay

- Per-turn observations and checkpoints are byte-identical before and after the 6.1 repair.
- Signature `fnv1a32:3aa7cfc6`; S0 = 0; S1 = 0; clarification turns 18, 22, 23, 33, 34.

## Guards

| Guard | Result |
| --- | --- |
| R5 compound ambiguity (`Show the risk problem.`) | PASS |
| R6 `that` semantics (A–J) | PASS |
| R7 Trusted Communication (A–J) | PASS |
| R8 (typecheck 0, dumps, R3/R4 type guards) | PASS |
| R2, R3, R4, FIX14 | PASS |
| FIX13 independent request supersedes non-commitment clarification | PASS |
| FIX12 bare deictic issue/problem | PASS |
| FIX11 named historical returns (`conversationNamedHistoricalReturn`, `AdvisorFix11`) | PASS |
| FIX10 T92 production data not Capacity; NCA-POST:1 registry recovery | PASS |
| CC:10 (no Decision without valid commitment; no commitment from evidence/deictic repair) | PASS (`CommitmentFix1`, R6 J) |
| Owning layers FINAL:6.1–6.4 (10 suites) | 104 pass / 0 fail / 0 skipped |

## SIM-TEST

- Before: 156 pass / 2 fail (158).
- After: **166 pass / 0 fail / 0 skipped** (158 + 8 R9).
  - S1-06: behavioral recovery.
  - FAST: baseline evolution, evidence-backed as an intended FIX11 change.

## NXA funnel

| Level | Result |
| --- | --- |
| L1 | PASS 19/19 |
| L2 | PASS 453/453 |
| L3 | PASS 48/48 |
| L4 omnibus | PASS 1681/1681, 0 skipped |
| L4 dir-inventory | PASS 58/58 |
| L4 typecheck | PASS (0 errors) |
| L4 eslint | PASS |
| L4 diff-check | PASS |
| L4 build | PASS (compiled; 14/14 static pages) |
| L4 live-smoke | PASS (`ok: true`, zero page errors) |

Barrier: 7/7 required started and passed, 0 running, 0 uninspected, 0 blocked.

# NPA-T SIM-TEST:6-FIX14-R8 — Regression

## Repair

| Cluster | File | Change | Runtime behavior |
|---|---|---|---|
| A | `app/lib/manager-object/conversationContinuityResolver.ts` | Added `explicit &&` to the existing `if (visitedNamedExplicit && …)` guard | Unchanged: the added condition is already implied by `visitedNamedExplicit` |
| B | `app/lib/sim-test/nexoraSimulationFix14Dump.ts` | Reads the canonical finding fields; output keys unchanged | No production effect; the dump now prints real values instead of `undefined` |
| C | `…ScenarioRuntimeFix14R3.test.ts`, `…ScenarioWhyFix14R4.test.ts` | `assert.ok(result.directorPlan)` before dereferencing | Adds a presence assertion; all existing assertions are unchanged |

None of the following was added or changed: `any`, `@ts-ignore`, `@ts-expect-error`, broad casts, tsconfig, strictness, file exclusions, new authority or store.

## Incremental typecheck

- Baseline: 10 errors.
- After Cluster A: 9 errors, none in the resolver.
- After Clusters B and C: 0 errors, exit 0.

## Focused behavioral guards

| Guard | Suite | Result |
|---|---|---|
| FIX11 named historical return | `conversationNamedHistoricalReturn`, `nexoraSimulationAdvisorFix11` | PASS |
| FIX12 deictic issue/problem | `nexoraSimulationAdvisorFix12` | PASS |
| R5 compound ambiguity | `nexoraMvpFinal61CompoundAmbiguityFix14R5` | PASS |
| R6 Smart Clarification / context | `nexoraMvpFinal63ClarificationStateFix14R6` | PASS |
| 6.2 continuity | `nexoraMvpFinal62ConversationContinuity` | PASS |
| R2 navigation | `nexoraSimulationNavigationFix14R2` | PASS |

The Cluster A batch above totals 48/48.

| Guard | Suite | Result |
|---|---|---|
| R3 read-only Scenario (NO_CHANGE, `shouldCommitRuntime=false`) | `…ScenarioRuntimeFix14R3` | PASS |
| R4 Scenario why (`impact-why`, qualified modeled relationship) | `…ScenarioWhyFix14R4` | PASS |
| R7 Trusted Communication | 6.4 suite plus `…Fix14R7` | PASS |
| CC:10 Decision boundary | `nexoraSimulationCommitmentFix1` | PASS |
| FIX14 Impatient guard | `nexoraSimulationImpatientFix14` | PASS |

The Clusters B/C batch above totals 32/32.

## SIM-TEST

`app/lib/sim-test/*.test.ts`: **156/158**. The two failures are exactly the known ones with unchanged values:

- FAST: actual `fnv1a32:3aa7cfc6`, expected `fnv1a32:8a0767d0`.
- S1-06: actual `Which item do you mean?`.

New SIM-TEST failures from R8: **0**.

## NXA funnel

| Level / command | Result |
|---|---|
| L1 | PASS 19/19 |
| L2 | PASS 453/453 |
| L3 | PASS 48/48 |
| L4 `l4-executive-omnibus` | PASS 1681/1681 |
| L4 `l4-dir-inventory` | PASS 58/58 |
| L4 `l4-typecheck` | PASS, 0 errors |
| L4 `l4-eslint` | PASS (funnel scope: certification infrastructure files) |
| L4 `l4-diff-check` | PASS (same scope) |
| L4 `l4-build` | PASS |
| L4 `l4-live-smoke` | PASS (`ok: true`, `zeroPageErrors: true`) |

The L4 barrier reported `allowed=true`: 7/7 required commands started, passed and inspected, with 0 still running.

IDE lints on the four R8 files: clean.

## Out of scope, unchanged

- FAST parity and S1-06 regressions.
- The R7 observations: `Give me the details.` missing-subject behavior, the detailed walk-through drift, the ECA confidence note, and the `..` formatting.

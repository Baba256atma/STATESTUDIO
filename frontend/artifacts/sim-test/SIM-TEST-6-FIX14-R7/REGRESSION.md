# NPA-T SIM-TEST:6-FIX14-R7 — Regression

## Repair (production)

| File | Change |
|---|---|
| `app/lib/nexora-conversation/ecaExecutiveRecommendation.ts` | ECA:7 answers a `why?` as a recommendation follow-up only when a recommendation is in the discourse: a current `recommended` option, a delivered or formed recommendation in the ECA session (`delivered` / `lastOptionId`), or an explicit "recommend" in the utterance. |
| `app/lib/nexora-problem-solving/npsComparisonRecommendationRuntime.ts` | NPS:5 accepts an optional `recommendationInDiscourse`. A bare `why?` appends the recommendation rationale only when it is not `false`. Explicit `why that one?` and `why do you recommend (that)?` are unchanged. |
| `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` | Passes `recommendationInDiscourse` to NPS:5 from the existing ECA:7 session (`delivered` or `lastOptionId`). |
| `app/lib/manager-object/nexoraMvpFinal64TrustedCommunication.ts` | 6.4 drops exact repeated sentences before the existing depth cap (unlocked path only). |

- New authority: **NO**. ECA:7, the declared recommendation owner, is consumed. No composer, Advisor, verbosity registry, formatter or store was added.
- No change to canonical identity, continuity, NCA, Advisor, Stage, clarification or depth policy. No character or word truncation.

## Focused proof (`nexoraMvpFinal64TrustedCommunicationFix14R7.test.ts`, 10/10)

| Test | Result |
|---|---|
| A — exact failing case (B1 Delivery, G Delivery/Capacity/Risk): BRIEF, ≤6 sentences, on the Object, no unpresented recommendation | PASS |
| B — another generic Object (Inventory) | PASS |
| C — explicit detail (`Walk me through the evidence.`) keeps DEEP and is not capped | PASS |
| D — Explain keeps NORMAL depth and relationship qualification | PASS |
| E — Evidence keeps supporting and missing evidence | PASS |
| F — Why keeps "not a confirmed cause" / "does not by itself tell us" qualification | PASS |
| G — `How sure are you?` stays honest (uncertainty preserved, no certainty words) | PASS |
| H — canonical subject fidelity (Risk `Why?` does not justify another subject's recommendation) | PASS |
| I — `Why?` after a formed recommendation still justifies it (ECA:7 and NPS:5) | PASS |
| J — NPS:5 unit: bare why gated; explicit forms unchanged | PASS |

## Pre-funnel regression

- FINAL:6.4 suite (including exact `certifies trusted-communication dialogues`) plus R7: **19/19**.
- Recommendation owners (ECA:7, ECA commitment, all `nexora-problem-solving` tests, `executiveRecommendation`): **295/295**.
- R6, R5, R4, R3, R2 guards plus 6.1/6.2/6.3 suites (SmartClarification, ClarificationLifetime, NLU, Continuity): **71/71**.
- `app/lib/sim-test/*.test.ts` (FIX10–14, CC:10, all R-guards): **156/158**. The 2 failures are the known pre-existing ones, with values identical to before R7:
  - `nexoraSimulationDecisionFix5` FAST: actual `fnv1a32:3aa7cfc6`, expected `fnv1a32:8a0767d0`. Unchanged.
  - `nexoraSimulationFindingsFix1` S1-06: actual `Which item do you mean?`. Unchanged.
- Ground Truth: no test or production path reads Ground Truth. The repair consumes only runtime session state.

## NXA funnel

| Level | Result |
|---|---|
| L1 | PASS 19/19 |
| L2 | PASS 453/453 |
| L3 | PASS 48/48 |
| L4 `l4-executive-omnibus` | **PASS 1681/1681**, 0 skipped (was 1670/1 in R6; +10 R7 tests) |
| L4 `l4-dir-inventory` | PASS 58/58 |
| L4 `l4-typecheck` | **FAIL**: exit 2, exactly the 10 known pre-existing errors, 0 in R7 files |
| L4 `l4-eslint`, `l4-diff-check`, `l4-build`, `l4-live-smoke` | Not started (the funnel stops at typecheck; those logs date from Sep 14 and are stale) |

The known typecheck errors are:

- `conversationContinuityResolver.ts(417)`
- `nexoraSimulationFix14Dump.ts` (4)
- `nexoraSimulationScenarioRuntimeFix14R3.test.ts` (4)
- `nexoraSimulationScenarioWhyFix14R4.test.ts` (1)

## Observed, not repaired (outside the R7 Stop Condition)

- `Give me the details.` after `Show Delivery.` is misread at 6.1 as a missing subject: "I couldn't find a clear match for “Give Me The”…". Pre-existing and upstream; R7 did not touch NLU.
- The DEEP `Walk me through the evidence.` answer after Delivery talks about Capacity and Customer. Pre-existing content drift.
- ECA:7's `How sure are you?` confidence note ("I would not treat this as a strong recommendation") appears even when no recommendation exists. Same pattern as the root cause, but it is not a failing assertion and stays within length.
- The ECA:7 `why` note joins items that already end in `.` with `". "`, producing `..` in legitimate recommendation follow-ups. Pre-existing formatting.

# SIM-TEST:6-FIX14-R6 Regression

## Focused R6 proof (`nexoraMvpFinal63ClarificationStateFix14R6.test.ts`)

| Proof | Result |
| --- | --- |
| A — cold-start compound ambiguity clarifies | PASS |
| B — after `Show Risk.`, compound still clarifies; 6.1 keeps 3 candidates and a null ref; pending created | PASS |
| C — sustained subject: `Explain that.` / `What evidence do we have on that?` proceed on Capacity; FIX8 `What supports that claim?` proceeds on Inventory; `Explain it.` proceeds | PASS |
| D — `Explain that.` clarifies while two recent subjects compete | PASS |
| E — `Explain that.` after a single subject proceeds on it | PASS |
| F — `Capacity.` / `The first one.` resume; intent `explain`; pending cleared | PASS |
| G — fresh session has no pending; `Never mind.` clears pending and keeps `obj-capacity` continuity | PASS |
| H — `What changed?` supersedes and clears pending | PASS |
| I — `Go back.` is `navigate-back`, supersedes and clears pending | PASS |
| J — commitment with competing subjects: gate `COMMITMENT`, `required=true`; no decision committed | PASS |

## Focused suites

- R6 + R5 + FINAL:6.3 Smart Clarification + clarification lifetime + FINAL:6.1 NLU + FINAL:6.2 continuity: **61 pass / 0 fail / 0 skipped**.
- The four exact pre-repair failures (6.3 dialogues, EXPLAIN resume, session reset, R5 after-Risk): all PASS.

## SIM-TEST suites (`app/lib/sim-test/*.test.ts`)

- **156 pass / 2 fail / 0 skipped** (158 tests).
- R2, R3, R4, FIX14, FIX13, FIX12, FIX11, FIX10, FIX8, FIX6, FIX3, and CC:10 (`CommitmentFix1`): PASS.
- A transient R6 regression in the FIX8 `What supports that claim?` case was found during this run. It was repaired inside R6 by limiting the recency rule to a standalone demonstrative, and it now passes.
- Two failures are **pre-existing and not R6-attributable**. With all three R6 changes switched off, both journeys produced byte-identical turns and signatures:
  1. `nexoraSimulationDecisionFix5.test.ts`: the FAST parity signature pin expects `fnv1a32:8a0767d0` (recorded through FIX10), but the actual is `fnv1a32:3aa7cfc6`. It regressed within FIX11–R5.
  2. `nexoraSimulationFindingsFix1.test.ts` S1-06: ingestion-manufacturing T3 `What evidence supports that?` with no canonical subject now answers `Which item do you mean?` rather than the negated-causal evidence response. It regressed within FIX11–R5.
- Neither suite is part of the NXA L1–L4 funnel. Both were left unpatched because they belong to earlier phases.

## NXA funnel

- Level 1: PASS — 19/19.
- Level 2: PASS — 453/453.
- Level 3: PASS — 48/48.
- Level 4 omnibus: FAIL — **1670 pass / 1 fail / 0 skipped** (1671 tests; +7 new R6 tests).
- Only failure: FINAL:6.4 `certifies trusted-communication dialogues`, identical to R5 (`B1:1`, `G0a:2`, `G1a:2`, `G2a:2` COMMUNICATION_VERBOSITY_FAILURE). Independent and untouched.
- Remaining Level 4 commands (`l4-dir-inventory`, `l4-typecheck`, `l4-eslint`, `l4-diff-check`, `l4-build`, `l4-live-smoke`): **not started** in this run because the funnel stops on the omnibus failure. The existing logs for them date from Sep 14 and are stale.
- Required tasks running: 0. Required results uninspected: 0.

## Diagnostic (non-certifying) gates

- ReadLints on the R6 files: clean.
- `git diff --check` on the R6 files: clean.
- `npm run typecheck`: exit 2 with **10 errors, none in R6 files**. They are in `conversationContinuityResolver.ts` (1), `nexoraSimulationFix14Dump.ts` (4), `nexoraSimulationScenarioRuntimeFix14R3.test.ts` (4), and `nexoraSimulationScenarioWhyFix14R4.test.ts` (1). This debt is pre-existing and will block `l4-typecheck` once the omnibus is green.

## Guards

| Guard | Result |
| --- | --- |
| R5 6.1 semantics | PASS |
| R4 | PASS |
| R3 | PASS |
| R2 | PASS |
| FIX14 | PASS |
| FIX13 | PASS |
| FIX12 | PASS |
| FIX11 | PASS |
| FIX10 | PASS |
| CC:10 | PASS |
| Ground Truth leakage | NO |

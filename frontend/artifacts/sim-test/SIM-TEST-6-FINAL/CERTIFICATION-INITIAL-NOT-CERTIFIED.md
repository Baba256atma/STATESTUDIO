# NPA-T SIM-TEST:6 — FINAL RECERTIFICATION

**Verdict: NOT CERTIFIED**

FINAL stopped at the first genuine certification blocker, under §29 (Known External Test Failures). No repair was made and no production file changed during FINAL: the `frontend/app` content hashes and git status are identical at the start and end of FINAL.

## Blocker

The MRA/ECA runtime suites in `app/lib/nexora-conversation/` fail 17 tests. The FIX15–FIX17 certifications recorded these as "12 pre-existing MRA/ECA failures outside the funnel".

That classification was only checked against the pre-FIX15 tree. Compared with the pre-program baseline (git `HEAD` `dd3320ed`, 2026-09-26, where every SIM-TEST:6 program production change is still uncommitted):

| Set | Count |
| --- | --- |
| Failing at `HEAD` | 5 |
| Failing now | 17 |
| Shared with `HEAD` (unchanged debt) | 4 |
| Failing at `HEAD`, passing now | 1 ("E recovers the uniquely defensible earlier Problem") |
| **New since `HEAD`** | **13** |

Reverting all 25 changed production files to `HEAD` in a `/tmp` copy reproduces exactly the `HEAD` failing set. The 13 new failures are therefore caused entirely by production changes in the recovery program, not by test or environment drift.

§29 lets certification continue only if an external failure is unchanged from the certified baseline, outside the SIM-TEST:6 contract, and not evidence of a regression introduced by FIX10–FIX17. The 13 new failures break the first and third conditions, so FINAL cannot certify.

See `EXTERNAL-FAILURES.md` for the per-test attribution.

## First wrong seams (per-file and per-hunk revert in a `/tmp` copy)

| Seam | Phase | New failures | Evidence |
| --- | --- | --- | --- |
| `conversationalExperienceOrchestrator.ts` `describeResolvedScenario` no longer treats `isDeicticSubjectFollowUpUtterance` ("investigate it", "look deeper into it", "what else do we know about it") as a Scenario describe request | SIM-TEST:6-FIX14-R4 (Scenario "why?") | 9 | Restoring only this predicate makes all 9 pass, with no new failures. The reply becomes "There isn't a current Scenario impact assessment to explain…" instead of the named subject (Demand Surge). |
| `nexoraRegisteredReferenceRecovery.ts` `compoundKeyCoveredByInput` (fuzzy part-match requires every compound word) | SIM-TEST:6-FIX10, later adjusted by R9 | 3 | Reverting only this file makes the 3 pass. "look at capcity" resolves the Capacity KPI instead of the active Capacity Gap Problem, and isolated NLU loses its ambiguity candidates. |
| `nexoraNca2ConversationState.ts` ordinal/collection referability (`isNcaLastCollectionOrdinalReferable`, new CLARIFY branch) | SIM-TEST:6 program (most likely FIX9 ordinal context; the hunk was not isolated) | 1 | Reverting only this file makes the test pass. The contrastive "other" follow-up now clarifies ("I don't have a current ordered list…") instead of binding the sibling Margin Pressure. |

The FIX16 promotion hunk, the FIX17 commit-gate hunk, the FIX15 Scenario option retention and the Decision lock hunk were each reverted individually. None of them changes the failing set.

- Affected invariant: §29 ("not evidence of a regression introduced by FIX10–FIX17"), plus the certified MRA:3-FIX1, MRA:3-FIX2 and MRA:3-RECERT-FIX1/2/3 referent-fidelity contracts.
- Regression or newly exposed debt: **regression**. These tests passed at the pre-program baseline and fail only because of program production changes.
- Earlier FIX10, R4 and FIX15–FIX17 records did not identify this. FIX15 compared the 12 failures across five files with and without FIX15 only. The two MRA:3-RECERT files (FIX3, FIX6) were never compared, and no comparison was made against the pre-program tree.

## What FINAL confirmed before stopping

- Contract: `SIM_TEST_6_JOURNEYS` in `nexoraSimulationLongSessionJourneys.ts`, run by `nexoraSimulationLongSessionJourney.test.ts`. It has 7 journeys: Manufacturing long, Project long, Logistics parity, Service parity, FAST parity, Manufacturing Impatient and Fresh session. The report writer regenerates `artifacts/sim-test/SIM-TEST-6/*`.
- The last generated SIM-TEST:6 record (from the FIX17 run, with no production change since): S0 0, S1 0, S2 0, S3 2 (both NPS `SUBJECT_LOSS`), 0 harness failures, cross-run isolation PASS.
- Signatures in `PARITY-RUNS.md`: FAST `fnv1a32:3aa7cfc6`, Impatient `fnv1a32:a5d79e5e`.
- The FIX17 entry evidence (SIM-TEST 198/198, typecheck 0, NXA L1–L4 7/7) is recorded in `SIM-TEST-6-FIX17/CERTIFICATION.md`. FINAL did not rerun the heavy gates after the blocker.
- Every DIRECTOR-1 test passes under one of the two runners (`tsx` or `node --test`). These are runner-environment debt, not a blocker.

## Not run (stopped at blocker)

- The full focused set, the SIM-TEST folder, the determinism replay, NXA L1–L4, and the debt and authority ledgers.
- These must run in the recertification that follows the bounded recovery.

## Proposed bounded recovery (not started)

**NPA-T SIM-TEST:6-FIX18 — MRA/ECA referent-fidelity regressions from FIX10/R4/NCA:2**

1. **R4 seam.** Restore Scenario describe routing for deictic follow-ups, but only when the deictic referent really is the resolved Scenario. Keep the R4 guarantee that "Why?" on a Scenario is not a describe request. Guards: `nexoraSimulationScenarioWhyFix14R4.test.ts` and the 9 MRA tests.
2. **FIX10 seam.** Let the compound-key coverage rule prefer the active conversational subject for a fuzzy head noun, keeping the R9 head-noun rule. Guards: `nexoraMvpFinal61CompoundAmbiguityFix14R5`, R9 S1-06, and the 3 MRA:3-FIX2 tests.
3. **NCA:2 seam.** Contrastive "other" after a single Problem should bind the sibling rather than the ordinal-collection CLARIFY path. Keep the FIX9 ordinal guards. Guards: `nexoraSimulationOrdinalFix9.test.ts` and MRA:2 C1.
4. **Stop condition:** the `nexora-conversation` failing set equals the 4 unchanged `HEAD` failures; SIM-TEST:6 S0 = S1 = 0; FAST and Impatient signatures are unchanged or explained. Then rerun this FINAL.

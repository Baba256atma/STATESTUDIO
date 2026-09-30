# SIM-TEST:6-FIX14-R9 Root Cause

## Method

- Per-turn layer trace (CC:1, CC:2, FINAL:6.1, 6.2, 6.3, pending clarification) through the real CC:5 entry, using a temporary env-guarded trace that has since been removed.
- Controlled comparisons in a scratch copy of `frontend/` outside the worktree. The working tree was never reverted.
  - S1-06: HEAD versus current, per-file, then cumulative, then per-hunk.
  - FAST: the exact post-FIX10 edits (FIX11, FIX12, FIX13, R7, R8) recorded in this session were reverse-applied phase by phase. R6 was already proven FAST-neutral by R6's switch-off run.
- Attribution came from the artifacts and the session's own edit record.

## Regression A — FAST parity (`8a0767d0` → `3aa7cfc6`)

| Field | Value |
| --- | --- |
| First divergent turn | T16 `Go back to the capacity issue.` |
| Last known-good (pin) | FIX10: 6.1 `obj-capacity`, 6.2 `CONTEXT_PREVIOUS_SUBJECT` → `ctx-problem-capacity` (Capacity Gap), CC:2 `ctx-problem-capacity` |
| Current | 6.1 `obj-capacity`, 6.2 `CONTEXT_PREVIOUS_SUBJECT` → `obj-capacity`, CC:2 `obj-capacity` |
| CC:1 | `focus` (same both) |
| 6.3 | `proceed` (same both); clarification turns 18, 22, 23, 33, 34 in both states |
| Advisor | pin: `ctx-problem-capacity` at T17/T20/T21 while canonical/Stage were `obj-capacity`. Current: `obj-capacity`, equal to canonical |
| Operation / mutation | unchanged; Decision 1, Execution 1 in both |
| Response semantics | T20 `Explain this.` explains Capacity instead of Capacity Gap. T30 `Go back to capacity.` now says "Returning to Capacity" instead of "Returning to Capacity Gap" |
| Signature material changed | `advisorReferentId` at T17, T20, T21 (plus derived conversation frames). Response text is not signed: R7 text differences leave the hash unchanged |
| Owning seam | FINAL:6.2 `conversationContinuityResolver.ts` named historical return (`visitedNamedExplicit`) |
| Repair family | **FIX11** (controlled: reversing only FIX11's continuity edits restores exactly `fnv1a32:8a0767d0`; reversing R8, R7, FIX13, and FIX12 first leaves `3aa7cfc6`) |
| Classification | **Intended certified change / stale expectation.** FAST T16 uses the same utterance FIX11 repaired for Service T16. The pin encoded the pre-FIX11 canonical/Advisor divergence. FIX11 did not run `nexoraSimulationDecisionFix5.test.ts`, so the pin was never re-baselined |

`3aa7cfc6` also equals the original pre-FIX1 SIM-TEST:6 FAST signature. The consistent explanation is that FIX1 moved T16 onto the Problem kind gate and FIX11 moved it back. This was not reconstructed directly, because no pre-FIX1 tree exists. The FIX11 attribution does not depend on it.

## Regression B — SIM-TEST-2 S1-06

| Field | Value |
| --- | --- |
| Journey | `ingestion-manager-investigation-manufacturing` (runId `sim-test-2-fix1-0`) |
| T1 | `What is happening in operations?`. Unchanged; no subject |
| T2 (first divergent) | `What pressure deserves my attention?`. Historical: 6.1 `ctx-problem-margin` (EXPLICIT_CURRENT_TURN), answer "…in the context of Margin Pressure…". Current: 6.1 null, 6.2 UNRESOLVED, answer "…in the context of the current issue…" |
| T3 | `What evidence supports that?`. CC:1 `explain`, CC:2 `missing-context`, 6.1 `EVIDENCE`, 6.2 historical `CONTEXT_ACTIVE_SUBJECT` → `ctx-problem-margin` / current UNRESOLVED, 6.3 `proceed` in both |
| Threads | historical `[ctx-problem-margin@2]`; current empty |
| Expected evidence target | Margin Pressure, the single referent established at T2 |
| Actual | no referent anywhere. The CC generic `clarification-required` copy "Which item do you mean?" (`conversationalExperienceResponse.ts`). 6.3 did not ask. No candidates |
| First wrong seam | FINAL:6.1 `findObjectMentions` last-resort part matching (`canonicalManagerMeaningInterpreter.ts`) |
| Root cause | FIX10's compound-key coverage rule (added for T92 `production` ⊄ `production capacity`) also rejected the head noun of a compound canonical name (`pressure` in `Margin Pressure`). The registry-level FIX10 guard alone does not break S1-06; the 6.1 fallback copy does (per-hunk proof) |
| Repair family | **FIX10**, not FIX11–R5. FIX10's certification did not run the SIM-TEST:2 findings suite, so the regression surfaced first in R6's full SIM-TEST run |
| Classification | Genuine regression |

## Relationship

**Independent.** A lives at 6.2 named-return continuity (FIX11) and is an intended change. B lives at 6.1 lexical part matching (FIX10) and is a genuine regression. Neither turn path passes through the other seam. Repairing B leaves FAST byte-identical per turn.

## R6 `that` semantics

Unaffected. B has at most one referent at T3. When no referent exists, "Explain that." still clarifies. With two competing recent subjects, "Explain that." still clarifies (R6 D).

## Out of scope (not same-root)

- `Give me the details.` missing subject.
- Delivery walkthrough drift.
- ECA `How sure are you?` note about a nonexistent recommendation.
- `..` formatting.

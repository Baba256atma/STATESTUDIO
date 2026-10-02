# NPA-T SIM-TEST:9-FIX2 — Context-Scoped Scenario Set Resolution

## A. Status

**CERTIFIED** for FIX2 only.

This does not certify SIM-TEST:9 or SIM-TEST:9-R2.

## B. Root cause

First divergent production layer: **CC:5** consuming a **CC:9** Scenario session.

`seedInvestigationScenarioPair` treated any global do-nothing/intervention kinds as sufficient, so Delivery/Revenue `Options.` did not seed a new set. `primarySubjectId` could fall back to the stale session intervention (Capacity). `retainActiveScenarioOptionCollection` then restored the last non-empty candidate list whenever a later turn produced none.

CC:9 `compare` / `open-candidate` used `candidateScenarioIds` as a global presented set. Being recent and non-empty was treated as valid for the current Problem.

## C. Production repair

Files:

- `executiveScenarioDefinition.ts` — record `sourceSubjectId` from the defining primary subject
- `executiveScenarioResolver.ts` — `scenarioSourceManagementSubjectId`, `scopeScenarioSessionToManagementContext`; compare/open-candidate scope to that subject
- `conversationalExperienceOrchestrator.ts` — seed kinds per source subject; no stale intervention fallback; scope compare/open-candidate; ordinal follow-up on unmapped focus
- `executiveDecisionCommitmentResolver.ts` — ordinals/letters use the scoped presented set; explicit names unchanged
- `index.ts` — export the CC:9 helpers

Rule: deictic/ordinal reuse requires the session's presented collection to belong to the current management object. Related graph links and shared evidence are not enough. Zero matching contexts → no stale reuse. One matching source → reuse. Multiple sources without a current object → no ordinal bind.

Explicit named Scenario/Capacity options still resolve from `scenariosById`.

New authority: **none**.

## D. Original R2 findings

Original occurrences: 8. Journeys: 6 (C, D, E, F, J, K).

Post-FIX: remaining stale Capacity-under-Delivery/Revenue Options. rows: **0**. All 6 journeys replayed with matching signatures. Wrong Scenario bindings on those Options. turns: **0**.

Family D now writes a Delivery Decision in addition to Capacity (expected once Delivery has its own set).

## E. Focused tests

`nexoraSimulationMultiThreadFix2.test.ts` T1–T18 plus micro-funnel, R2 replays, B T5 preservation: **pass**.

T9: after Delivery with no Delivery set, `The second one.` does not write a Decision and does not answer as Investigate Capacity (NCA ordered-list clarification).

T11: after return, **Options.** then `The second one.` resolves Capacity. Bare ordinal without re-presenting Options. remains NCA ordered-list clarification (not repaired).

## F. Micro-funnel

P1 Capacity set, P2 Delivery set (no Capacity titles), P3 Inventory ordinal writes no extra Decision, return Capacity Options. restores Capacity.

## G. Decision safety

Stale `Go with B.` after Delivery focus without a Delivery set: clarification, 0 writes (FIX15 I).

After Delivery Options.: Delivery Decision may apply; Capacity Decision is not selected.

Duplicate Decision identity: none observed in focused tests.

## H. FIX1 regression

Capacity Execution from Delivery `Start it.`: **0**. Original blocker journey may now form a Delivery Decision; that is not a Capacity execution. Focused FIX1 suite pass except T1 assertions updated to the Capacity-execution invariant.

## I. Remaining findings

- B T5 canonical/L1 lag: reproduced, independent, unrepaired
- Advisor Delivery/Capacity debt: unrepaired
- NPS S3: unrepaired
- NCA ordered-list ordinals without a presented collection: clarification, not CC:9 session restore

## J. Ground Truth / Temporal

T18: helper uses `sourceSubjectId` / intervention subject only. Extra Ground Truth fields ignored. Leak hits: 0 in focused tests.

## K. Regression

Executed: FIX2 T1–T18, R2 six journeys, FIX1 suite, SIM-TEST:8-FIX1 reassessment, CC:9 conversation, CC:10 commitment, MVP-OUT1 FIX2 follow-up, Decision FIX15, FIX18 referent. **146 tests, 0 failures** in that combined run.

Full SIM-TEST:9 population: **not** rerun.

## L. Architecture integrity

No second Scenario authority, management-thread store, context authority, referent engine, Decision/Execution authority, NMI, Stage, Advisor, or Object authority.

## M. Production changes

- `frontend/app/lib/conversational-control/executiveScenarioDefinition.ts`
- `frontend/app/lib/conversational-control/executiveScenarioResolver.ts`
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `frontend/app/lib/conversational-control/executiveDecisionCommitmentResolver.ts`
- `frontend/app/lib/conversational-control/index.ts`

Tests/artifacts separate.

## N. Next action

Do not start another repair automatically.

Next step: full SIM-TEST:9 recertification from turn 1, reporting actual multiplicity of Scenario sets, Decisions, and Executions.

NPA-T SIM-TEST:9-FIX2 — CERTIFIED

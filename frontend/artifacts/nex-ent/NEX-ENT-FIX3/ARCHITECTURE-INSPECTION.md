# NEX-ENT-FIX3 — Architecture inspection

Inspection date: 2026-09-05.

## Experience-context authority

Guided Entrance vs normal Executive workspace is already owned by certified Entrance session state:

- `/executive?entrance=1` plus `withActiveNexoraGuidedEntrance` for first-time
- `isNexoraGuidedEntranceActive` / `isNexoraGuidedEntranceScene`
- ENT:10 `isNexoraPersonalDemoHandoffFinished` (`COMPLETED` | `SKIPPED`)

FIX3 adds a **read-only** projection `resolveExecutiveExperienceContext`:

- `GUIDED_ENTRANCE` when `isNexoraGuidedEntranceScene(session)`
- `EXECUTIVE_WORKSPACE` otherwise (skip, ENT:10 finished, default `/executive`)

Stage and Advisor may read this. They must not write it. This is not BCA Business/Project, not Focus/Overview, and not a `nexoraModeStore`.

## Overview authority

Canonical Executive Overview reset remains `resetNexoraMVPObjectInteractionOverview` (`mode: "overview"`, `focusedSubject: null`).

That reset is correct for `EXECUTIVE_WORKSPACE`.

It is incorrect as the sole meaning of Overview during Guided Entrance.

## Background-click chain (defect)

1. `NexoraStageCanvas` `onPointerMissed`
2. `shouldResetExecutiveStage2DToOverview({ source: "background", topologyMode: "anchored", hitKind: "none" })`
3. `Nexora3DExecutiveStage.onClearSelection` → `onOverview`
4. Shell `resetNexoraMVPObjectInteractionOverview`
5. `deriveNexoraMVPStageInteractionPresentation` forces `focusedObjectId: null` in overview
6. `resolveExecutiveStageDisclosure` overview occupancy expects executive-context / watch-eligible objects
7. Educational `NEXORA` (`attention: normal`, `status: stable`) is marked `hidden-unrelated` and disappears
8. Advisor `composeNexoraProfessionalAdvisorPresentation` treats `advisorSubjectId == null` as `isOverview`
9. `deriveNexoraMVPExecutiveIntelligenceContext.overviewAttention` reads **NEX-MVP default stage fixtures**
10. `NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES` / flow intelligence compose **Capacity Gap** as Investigation Priority
11. `NEXORA_MVP_STAGE_OBJECT_FIXTURES` `obj-risk` (**Risk**, `attention: critical`) appears in overview attention

## Capacity Gap source

Canonical source: NEX-MVP demo/default catalog context subject `ctx-problem-capacity` in `nexoraMVPObjectInteractionFixtures.ts`, consumed by Advisor/EI overview when there is no Stage subject.

Truth class: **local MVP demo/default fixture**, not manager-confirmed business truth, not ENT educational actor.

## Risk source

Canonical source: NEX-MVP stage fixture `obj-risk` label **Risk** in `nexoraMVPStageFixtures.ts`, ranked into overview attention by `overviewAttentionItems()`.

Truth class: **local MVP demo/default fixture**.

## FIX3 routing

`resetNexoraExperienceAwareStageOverview`:

- `GUIDED_ENTRANCE` + restrained catalog → restore `applyEntranceCenterSubject` (educational scene home)
- `EXECUTIVE_WORKSPACE` → existing `resetNexoraMVPObjectInteractionOverview`

Presentation: when experience is `GUIDED_ENTRANCE`, Stage derive passes `overviewOccupancy: "current-catalog"` so Overview of the current educational catalog keeps those actors visible.

Advisor: `resolveExperienceAwareAdvisorSubject` plus a GUIDED_ENTRANCE bridge overlay so null-focus overview does not compose Executive Overview from default fixtures.

## ENT:10 / Skip / reset

Isolation ends when `isNexoraGuidedEntranceScene` is false: Skip (`SKIPPED` + `existing-workspace`) or Personal Demo Handoff `COMPLETED`/`SKIPPED`.

`?entrance=1&reset=1` remains educational re-entry. Stored identity is not deleted. Stored business state is not permission to present Business Overview during active education.

## Background-click semantics (after FIX3)

| Experience | View | Background click | Result |
| --- | --- | --- | --- |
| GUIDED_ENTRANCE | Focus (anchored) | click | Educational scene home (NEXORA / current lesson catalog) |
| GUIDED_ENTRANCE | Overview | click | No-op or educational occupancy (`current-catalog`) |
| GUIDED_ENTRANCE + object selected | Focus | click | Deselect investigation; restore Entrance scene |
| EXECUTIVE_WORKSPACE | Overview | click | Existing Executive Overview |
| After Skip / ENT:10 | Overview | click | Existing Executive Overview |

Focus/Overview remain presentation state. Experience context is independent.

## Duplicate-authority audit

No second Stage, Director, Advisor, or writable experience store.

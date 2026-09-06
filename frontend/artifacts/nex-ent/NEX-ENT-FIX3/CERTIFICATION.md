# NEX-ENT-FIX3 — Entrance Stage Background Interaction & Overview Isolation — CERTIFICATION

**Status: NEX-ENT-FIX3 — CERTIFIED**

**STOP.** Do not start NEX-ENT:11, NEX-ENT:E2E, FIX4, BCA persistence, a global NexoraMode store, a new Stage, a new Director, or a new Advisor.

Date: 2026-09-05.

Live production server: `http://localhost:3009` (`npx next start -p 3009`). Existing servers on `:3000`, `:3006`, `:3007`, `:3008` were not killed.

## Root cause

Empty Stage background click (`NexoraStageCanvas.onPointerMissed` → `shouldResetExecutiveStage2DToOverview` → `onClearSelection` → `onOverview`) called `resetNexoraMVPObjectInteractionOverview`. That is Executive Business Overview: `mode: overview`, `focusedSubject: null`.

Educational `NEXORA` (`obj-nexora-entrance`, attention `normal`) is not watch-eligible in STAGE-PROD overview disclosure, so it was hidden. Advisor treated null subject as `isOverview` and composed default NEX-MVP fixtures.

## Capacity Gap source

NEX-MVP demo/default context subject `ctx-problem-capacity` in `nexoraMVPObjectInteractionFixtures.ts`, surfaced by Executive Intelligence / professional Advisor when there is no Stage subject (`Investigation Priority`).

Truth class: local MVP demo fixture, not manager-confirmed business truth.

## Risk source

NEX-MVP stage fixture `obj-risk` label **Risk** in `nexoraMVPStageFixtures.ts`, ranked into `overviewAttentionItems()` (`attention: critical`).

Truth class: local MVP demo fixture.

## Experience-context authority

Read-only `resolveExecutiveExperienceContext(session)` from existing Entrance/ENT:10 state (`isNexoraGuidedEntranceScene`). Values: `GUIDED_ENTRANCE` | `EXECUTIVE_WORKSPACE`. Stage and Advisor consume it; they do not write it. Not BCA. Not Focus/Overview.

## Stage responsibility

Stage knows `overviewOccupancy: current-catalog` when experience is `GUIDED_ENTRANCE`. Stage does not decide Education vs Business.

## Overview semantics

`resetNexoraExperienceAwareStageOverview`: educational scene home during Guided Entrance (`applyEntranceCenterSubject`); existing Executive Overview after Skip / ENT:10 / default `/executive`.

## Background-click semantics

During Guided Entrance: restore/preserve educational scene. Must not mean “leave Education and open Business Overview.” After Skip or ENT:10 handoff: existing Executive Overview is valid.

## Focus semantics

`onPresentationStateChange` still only changes presentation class. Experience context is independent.

## Advisor synchronization

During Guided Entrance, Advisor subject stays NEXORA / educational center. Live: after background click, `advisorSubject: obj-nexora-entrance`, no Capacity Gap / Investigation Priority. After Skip: Executive Overview + Capacity Gap + Risk return (required proof Overview was not destroyed).

## ENT:10 boundary

`isNexoraPersonalDemoHandoffFinished` (`COMPLETED` | `SKIPPED`) ends `isNexoraGuidedEntranceScene`. Skip sets `existing-workspace` and `SKIPPED`.

## Reset

`?entrance=1&reset=1` remains educational re-entry. Stored identity is not deleted. Stored business state does not authorize Business Overview during active education.

## Explicit business request

Entrance is not a sandbox. Skip remains canonical. Isolation is accidental Overview fallthrough only.

## Default `/executive`

Still `EXECUTIVE_WORKSPACE` with default catalog (8 objects) and Executive Overview Advisor (Capacity Gap / Risk). Live `00-default-executive.png`.

## Actor integrity

ENT:1 start: 1 actor, `obj-nexora-entrance`. After background: still 1. After Skip: 8 default MVP objects.

## Business writer audit

FIX3 writes zero Goal/KPI/Problem/Risk/BCA/identity/Data Reality truth. Resolver is read-only.

## Duplicate-authority audit

No second Stage, Director, Advisor, or writable mode store.

## Known environmental (not this defect)

Local RDI / Data Reality snapshots can still appear in Advisor chrome during Entrance (Customer / Capacity Utilization “Recent Change” on this machine). That is not Executive Overview Capacity Gap/Risk fallthrough, was present before background click, and is not hidden with CSS. Classified environmental / local-data overlay, not a FIX3 regression of the reported screenshot chain.

## Tests

- NEX-ENT-FIX3 focused: 16/16
- `nexora-entrance` pack (ENT:1–10, FIX1/FIX2, EXP overlays): 313/313
- STAGE-PROD:0: 15/15
- DIR:GA: 9/9
- DIR:VI: 10/10

TypeScript: pass (`npm run typecheck`).

ESLint on changed files: 0 errors (3 pre-existing warnings elsewhere in shell/object-interaction).

Production build: pass.

Live: `:3009`, HTTP 200, `runtimeErrors: 0`. Evidence: `frontend/.certification/nex-ent-fix3-stage-overview-isolation/`.

## Files created

- `frontend/app/lib/nexora-entrance/nexoraExecutiveExperienceContext.ts`
- `frontend/app/lib/nexora-entrance/nexoraExecutiveExperienceContext.test.ts`
- `frontend/scripts/nex-ent-fix3-stage-overview-isolation-certify.mjs`
- `frontend/artifacts/nex-ent/NEX-ENT-FIX3/ARCHITECTURE-INSPECTION.md`
- `frontend/artifacts/nex-ent/NEX-ENT-FIX3/CERTIFICATION.md`

## Files modified

- `frontend/app/lib/spatial-presentation/executiveStageProductivityContract.ts`
- `frontend/app/lib/nex-mvp/nexora3DExecutiveStage.ts`
- `frontend/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts`
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx`
- `frontend/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx`

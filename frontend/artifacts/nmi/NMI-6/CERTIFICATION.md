# NPA-T NMI:6 — Management Context → Stage Projection

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start NMI:7. Do not start DTH-EXP. No NMI Stage and no second Director were created.

## Status

**NPA-T NMI:6 — CERTIFIED**

## Architecture inspected

NMI:1–5, STAGE-PROD:1 Queue, `selectNexoraMVPInteractionSubject`, DIRECTOR-1:1, DRI presentation intent, Advisor/CC:5/NCA/ECA, MO/VAI/Data Reality/RDI:1, RMS:1 isolation.

Canonical handoff: NMI context bundle → existing Stage writer → Director/Stage presentation.

## Files created

- `frontend/app/lib/nmi/nmiStageProjectionIdentity.ts`
- `frontend/app/lib/nmi/nmiStageProjectionContract.ts`
- `frontend/app/lib/nmi/nmiStageProjectionCompose.ts`
- `frontend/app/lib/nmi/nmiStageProjectionHandoff.ts`
- `frontend/app/lib/nmi/nmiStageProjectionFoundation.ts`
- `frontend/app/lib/nmi/nmiStageProjection.test.ts`
- `frontend/artifacts/nmi/NMI-6/*`

## Files modified

- `frontend/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx` — NMI:6 chrome, optional map-node select, projection anchor attribute; Queue rows/testids preserved
- `frontend/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx` — overlay receives existing focus ID and `onSelectSubject`
- `frontend/app/lib/nmi/nmiManagementNavigation.test.ts` — overlay `data-nmi="6"`

NMI:1–5 contracts remain `startsNmi6: false` on NMI:5. NMI:6 `startsNmi7: false`.

## Tests / gates

Focused NMI:6: **11 pass / 0 fail**.

Focused NMI:1–6: **50 pass / 0 fail**.

STAGE-PROD:1 Queue foundation: **20 pass / 0 fail**.

Queue hydration: **10 pass / 0 fail** (plus existing extra hydration cases in that file).

NCA:1 referent architecture: **13 pass / 0 fail**.

NPS:2 understanding: **11 pass / 0 fail**.

VAI:1 foundation: **10 pass / 0 fail**.

DRI-5:2 presentation intent: **16 pass / 0 fail**.

DIRECTOR-1:1 foundation: identity/contracts pass; one file-list test fails under `npx tsx --test` because `import.meta.dirname` is undefined (environmental; not an NMI:6 product defect).

ESLint NMI:6 + overlay + Stage: **0 errors** (pre-existing Stage `aria-description` warning unchanged).

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining debt

See `KNOWN-DEBT.md`.

## Program close

NMI:7 was not started. Advisor was not made NMI-aware. DTH-EXP was not started. No second Stage store or focus registry exists.

## Final status

**NPA-T NMI:6 — CERTIFIED**

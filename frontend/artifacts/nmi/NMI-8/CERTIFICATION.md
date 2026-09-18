# NPA-T NMI:8 — Live Management Intelligence & Real Manager Certification

**Status: CERTIFIED**

Date: 2026-09-17.

Stop. Do not start DTH-EXP.

## Status

**NPA-T NMI:8 — CERTIFIED**

## Architecture inspected

Certified NMI:1–7, `/executive` `NexoraExecutiveShell` catalog + Queue + Stage + CC:5, MO:1 Goal overlay, STAGE-PROD:1 Queue, RDI:1 Gate, RMS sealed Ground Truth.

Live-host gap closed: `/executive` now composes a UnifiedManagementModel from the existing catalog (composer/adapter, not a store).

Live composition point: `NexoraExecutiveShell` → `hostNmiLiveManagementIntelligence`.

## Files created

- `frontend/app/lib/nmi/nmiLiveIdentity.ts`
- `frontend/app/lib/nmi/nmiLiveContract.ts`
- `frontend/app/lib/nmi/nmiLiveHost.ts`
- `frontend/app/lib/nmi/nmiLivePipeline.ts`
- `frontend/app/lib/nmi/nmiLiveFoundation.ts`
- `frontend/app/lib/nmi/nmiLive.test.ts`
- `frontend/artifacts/nmi/NMI-8/*`

## Files modified

- `frontend/app/lib/nmi/nmiAdvisorCompose.ts` — live Journey C phrases; roadmap Decision/Execution/Outcome status text
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx` — live host + `nmiAdvisorBundle`
- `frontend/app/executive/nex-mvp/NexoraStageMount.tsx` — pass live map
- `frontend/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx` — NMI:6 projection then existing Stage writer
- `frontend/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx` — live section counts, `data-nmi-live="8"`
- `frontend/artifacts/nmi/NMI-7/KNOWN-DEBT.md` — live host debt closed by NMI:8

## Live behavior

UnifiedManagementModel is read-only, preserves catalog IDs, supports partial knowledge.

Management Map counts derive from live catalog + MO:1 Goal.

Attention IDs equal Queue object IDs. No second Queue.

Map/Attention selection: `selectedCanonicalId === projectionAnchorId`. Collection cannot steal referent.

Advisor receives live NMI bundle in `/executive` conversation.

Decision Roadmap reconstructs from live map without requiring every stage.

## Journeys A–E

Pass under live host bundle. NCA may retarget “problem”/“decision” wording; NMI itself does not promote Scenario→Decision or Decision→Execution.

## Safety

NMI remains read-only. Gate stays upstream. RMS sealed truth cannot leak. Referent/causal/evidence semantics intact.

## Browser

No live browser MCP in this environment. Classified as environmental limitation. Node runtime + overlay SSR executed.

## Tests / gates

See `REGRESSION-EVIDENCE.md`.

## Remaining debt

See `KNOWN-DEBT.md`.

## Program close

NMI:1–7 remain intact. DTH-EXP was not started.

## Final status

**NPA-T NMI:8 — CERTIFIED**

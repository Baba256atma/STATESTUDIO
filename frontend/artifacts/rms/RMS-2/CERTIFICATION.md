# NPA-T RMS:2 — Business/Project Ground Truth

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start RMS:3.

## Status

**NPA-T RMS:2 — CERTIFIED**

## Architecture inspected

RMS:1, D7 `app/lib/simulation`, NMI:1, VAI, Data Reality/RDI, MO:1, CC:10/11, Outcome/Learning.

## Files created

- `frontend/app/lib/rms/rmsWorldContract.ts`
- `frontend/app/lib/rms/rmsWorldEngine.ts`
- `frontend/app/lib/rms/rmsWorldFixtures.ts`
- `frontend/app/lib/rms/rmsGroundTruthWorld.test.ts`
- `frontend/artifacts/rms/RMS-2/*`

## Files modified

- `rmsGroundTruth.ts`
- `rmsSession.ts`
- `rmsSimulationState.ts`
- `rmsFoundation.ts`

## Ground Truth / fixtures

Northstar Manufacturing: demand 100→125, capacity 110→85. Warehouse Expansion: actual progress 0.63→0.65. Same RMS engine. HYBRID instantiable.

## Tests / gates

RMS:2 focused + RMS:1: **13 pass / 0 fail**.

NMI:1 regression included in a 21-pass batch with RMS.

ESLint on touched RMS files: 0 errors.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining debt

See `KNOWN-DEBT.md`. RMS:3 (Operator → Observable Data) is not started.

## Final status

**NPA-T RMS:2 — CERTIFIED**

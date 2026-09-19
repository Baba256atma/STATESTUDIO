# NPA-T DTH-EXP:1 — Theatre Foundation

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:2.

## Status

**NPA-T DTH-EXP:1 — CERTIFIED**

## 1. Architecture inspected

DTH:1–12, DIR:1, NEX-MVP:3/4 Stage, MO/Object catalog, NMI:1–8, VAI:1–8, NPS, ECA/CC pipeline, CC:8 Evidence / Data Reality, CC:10/11 Decision/Execution, CORE-OUT / DTH:11–12 Outcome/Learning, RMS boundary. See `ARCHITECTURE-INSPECTION.md` and `AUTHORITY-MAP.md`.

## 2. Contracts introduced

Theatre Scene, Theatre Actor, visual-role registry (reserved Nexo families), scene relationship projection, Evidence attachment refs, NexoTime boundary (timeline is a NexoTime visualization technique, not a Theatre system), Director consumption path `Manager Context → Director → Scene Composition → Theatre Projection`.

## 3. Authority ownership

DTH-EXP:1 owns only the read/projection contracts. DIR:1 remains Director. NEX-MVP:3 remains Stage. VAI remains LEVER/OUTCOME/PATH_OF_EFFECT/MODERATOR/CONTROL/CONFOUNDER. CC:8 remains Evidence. No new Object/Evidence/Stage/Director/Decision/Execution/Outcome store or writer.

## 4. Files created

- `frontend/app/lib/dth-exp/dthExpIdentity.ts`
- `frontend/app/lib/dth-exp/dthExpAuthorityBoundary.ts`
- `frontend/app/lib/dth-exp/dthExpVisualRole.ts`
- `frontend/app/lib/dth-exp/dthExpTheatreContract.ts`
- `frontend/app/lib/dth-exp/dthExpProjectTheatreScene.ts`
- `frontend/app/lib/dth-exp/dthExpPublicIndex.ts`
- `frontend/app/lib/dth-exp/dthExpTheatreFoundation.test.ts`
- `frontend/artifacts/dth-exp/DTH-EXP-1/*`

## 5. Files modified

None. Certified DTH:1–12 contracts, reserved-capability count (7), orchestrator, and Stage renderer were not changed.

## 6. Focused tests

`tsx --test app/lib/dth-exp/dthExpTheatreFoundation.test.ts app/lib/decision-theatre/nexoraDecisionTheatreFoundation.test.ts`

**28 pass / 0 fail** (13 DTH-EXP:1 + 15 DTH:1).

## 7. Lint / typecheck

ESLint on `app/lib/dth-exp`: 0 errors. `npm run typecheck`: pass.

## 8. Remaining debt

See `KNOWN-DEBT.md`. Nexo families, animation, automatic Nexo selection, and live orchestrator wiring remain later DTH-EXP phases.

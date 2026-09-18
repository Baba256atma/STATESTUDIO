# NPA-T RMS:9 — Take Control & Human Manager Handoff

**Status: CERTIFIED**

Date: 2026-09-17.

Stop. Do not start RMS:10. Next named phase after this stop is NPA-T RMS:10 — Experiment, Fork & Management Path Comparison.

## Status

**NPA-T RMS:9 — CERTIFIED**

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`. Handoff changes only who owns future manager turns. One sealed RMS session keeps Ground Truth, Operator, Data Reality, Observer, and the same CC:5 bind. Exclusive `activeManagerAuthority` is `MANAGER_AGENT` or `HUMAN_MANAGER`, never both.

## Files created

- `frontend/app/lib/rms/rmsHandoffContract.ts`
- `frontend/app/lib/rms/rmsHandoffStore.ts`
- `frontend/app/lib/rms/rmsHandoffRuntime.ts`
- `frontend/app/lib/rms/rmsTakeControl.test.ts`
- `frontend/artifacts/rms/RMS-9/*`

## Files modified

- `frontend/app/lib/rms/rmsSession.ts`
- `frontend/app/lib/rms/rmsWatchSession.ts`
- `frontend/app/lib/rms/rmsFoundation.ts`
- `frontend/app/executive/watch/RmsWatchExperience.tsx`

## Tests / gates

RMS:1–9 focused: **47 pass / 0 fail**.

ESLint: 0 errors.

16GB `typecheck`: pass.

16GB `build`: pass.

## Stop rule

Takeover does not restart the Scenario, create a second Nexora, or clone the world. Manager Agent is frozen after ownership change; stale scheduled agent turns do not execute. Human input is blocked until TAKE_CONTROL. Failed handoff leaves MANAGER_AGENT. Take Control grants no mutation, Decision (CC:10), or Execution (CC:11) bypass. Customer surface does not leak Ground Truth, hidden events, or Observer diagnostics. `RMS_9_BOUNDARY.startsRms10` remains false.

## Remaining debt

See `KNOWN-DEBT.md`. Full browser reload uses explicit re-entry (B). Live `/executive/watch` Take Control journey was not run in this certification. RMS:10 is not started.

## Final status

**NPA-T RMS:9 — CERTIFIED**

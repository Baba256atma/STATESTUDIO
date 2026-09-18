# NPA-T RMS:3 — Operator Agent & Observable Data

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start RMS:4. Next named phase after this stop is NPA-T RMS:4 — Manager Agent & Real Nexora Conversation.

## Status

**NPA-T RMS:3 — CERTIFIED**

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`. Canonical path: Ground Truth → Operator → Observable Data → RDI:1 → P0:1 Data Reality. Reality ≠ Observable Data ≠ Nexora Knowledge.

Operator publishes as an external API-style source. DATA-ADV:2 remains semantic confirmation authority. `CAP_AV` is not confirmed as Available Capacity.

## Files created

- `frontend/app/lib/rms/rmsOperatorContract.ts`
- `frontend/app/lib/rms/rmsObservationPolicy.ts`
- `frontend/app/lib/rms/rmsOperatorRuntime.ts`
- `frontend/app/lib/rms/rmsDataRealityPublication.ts`
- `frontend/app/lib/rms/rmsOperatorObservable.test.ts`
- `frontend/artifacts/rms/RMS-3/*`

## Files modified

- `frontend/app/lib/rms/rmsSession.ts`
- `frontend/app/lib/rms/rmsFoundation.ts`

CC:5, Advisor, Stage, Evidence, NMI, VAI, Object store, Decision, and Execution modules were not given RMS Ground Truth or semantic confirmation.

## Authority ownership

| Concern | Owner |
| --- | --- |
| Operator behavior, observation policy, simulated sources, Observable Records, RDI adapter, observation history | RMS:3 |
| Data Reality | P0:1 via RDI:1 |
| Semantic confirmation | DATA-ADV:2 |
| Evidence / Objects / NMI / VAI / Advisor / Stage / Decision / Execution / Outcome / Learning | existing Nexora |

## Tests / gates

RMS:1 + RMS:2 + RMS:3 focused: **17 pass / 0 fail**.

ESLint on touched RMS files: 0 errors.

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

See `TESTS-EXECUTED.md` and `REGRESSIONS.md`.

## Stop rule

No Ground Truth → direct Nexora Knowledge. No Ground Truth → automatic semantic confirmation. No parallel Data Reality, semantic, Evidence, or management authority.

## Remaining debt

See `KNOWN-DEBT.md`. RMS:4 is not started.

## Final status

**NPA-T RMS:3 — CERTIFIED**

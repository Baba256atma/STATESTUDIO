# NPA-T STAGE-COMPOSITION:1-FIX1 — Stage Camera Contract Reconciliation

Identity: `NPA-T STAGE-COMPOSITION:1-FIX1/StageCameraContractReconciliation`

Stop Condition: reconcile `data-stage-camera-mode` with latest certified camera authority; isolated STAGE-2D:1 host test PASS; Stage regression 0 fail; ACTIONS focused 0 fail; funnel L1–L3 0 fail; live ACTIONS + fixed-camera proof.

## Classification

**STALE TEST.** Production `fixed-executive-perspective` is the STAGE-SPATIAL:2 diagnostic name for the still-authoritative STAGE-2D:1 fixed camera. Placement remains `true-2d` / `z=0`. Production camera behavior was not changed.

## Repair

`frontend/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.test.tsx` test 7b now assert exact `data-stage-camera-mode="fixed-executive-perspective"` plus `data-stage-camera-fixed="true"`. Comment records that STAGE-SPATIAL:2 named the diagnostic; STAGE-2D:1 placement is unchanged.

No production camera owner, store, controller, or mode was added or redesigned.

## Gates

| Gate | Result |
| --- | --- |
| Isolated 7b before repair | FAIL (`fixed-2d` vs production `fixed-executive-perspective`) |
| Isolated 7b after repair | PASS |
| Stage regression | 24 passed, 0 failed |
| STAGE-2D:1 + STAGE-SPATIAL:2 camera tests | 18 passed |
| STAGE-COMPOSITION:1 ACTIONS focused | 38 passed, 0 failed |
| Funnel L1 | PASS |
| Funnel L2 | PASS |
| Funnel L3 | PASS (`failed: 0`) |
| Funnel L4 | not required (test-only assertion; AGENTS no L4 after small edit) |
| Live `/executive?reset=1` | PASS — see `live-browser.json` |

Live pose (Capacity → Actions → Investigate Problem → Actions reopen → Overview): `cameraMode=fixed-executive-perspective`, `cameraFixed=true`, azimuth `8`, elevation `10`, distance `11`, target `0,0,0`, depth `0`. Unchanged across steps.

## Dual certification

- NPA-T STAGE-COMPOSITION:1-FIX1 — CERTIFIED
- NPA-T STAGE-COMPOSITION:1 — CERTIFIED + SEALED

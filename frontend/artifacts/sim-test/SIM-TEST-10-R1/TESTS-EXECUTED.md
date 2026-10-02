# SIM-TEST:10-R1 tests executed

## Population

`frontend/app/lib/sim-test/nexoraSimulationOutcomeLearningR1.test.ts` — pass (measurement)

33 journeys (14 A–N families + profile/seed/RMS variants + SIM-TEST:5 compatibility). 356 Manager/Nexora turns.

Artifacts: `artifacts/sim-test/SIM-TEST-10-R1/population-run.json`

## Focused (295/295)

- OUT-LIVE:1 T1–T18
- CORE-OUT:1A
- CORE-OUT:1 identity + 1A consumption
- CORE-OUT:2 identity
- MVP-OUT:1-R2
- NPS:8
- ECA:11
- ECA:12

## Replays

FIX1 blocker + FIX2 Options. isolation inside R1 test. 6 population journeys replay-matched.

## Also inspected

- `nexoraSimulationReassessmentFix1.test.ts` — 3 pass / 9 fail (not repaired)
- Full FIX1/FIX2 files — classified, not recertified as passing

## Not run

- Level 4
- Full repository
- Original `nexoraSimulationOutcomeLearning.test.ts` overwrite of SIM-TEST-10/
- SIM-TEST:10-FIX1
- OUT-LIVE:2

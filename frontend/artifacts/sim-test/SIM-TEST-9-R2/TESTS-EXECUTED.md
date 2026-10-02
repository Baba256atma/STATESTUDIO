# SIM-TEST:9-R2 tests executed

Measurement-only. No product repair. No FIX2.

| Suite | Result |
| --- | --- |
| `nexoraSimulationMultiThreadR2.test.ts` (160 journeys from turn 1 + 6 material replays + original FIX1 blocker twice) | PASS 1/1 |
| Full-repo Test Funnel Level 4 | not run |
| `nexoraSimulationMultiThreadFix1.test.ts` T1–T16 | not re-run this phase (FIX1 already CERTIFIED; blocker replayed inside R2) |

Population composition inside the R2 test:

- 14 SIM-TEST:9 A–N journeys (`SIM_TEST_9_R2_JOURNEYS`)
- 90 SIM-TEST:7 manager-population journeys
- 56 SIM-TEST:8 adaptive journeys

Harness failures: 0.

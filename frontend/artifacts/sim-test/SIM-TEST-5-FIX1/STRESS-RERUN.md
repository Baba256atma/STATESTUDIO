# Stress / bounded rerun

| Journey | Original signature | Repaired signature | S0 | S1 | Harness | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| sim-test-5-manufacturing-lifecycle | fnv1a32:b92137ed | fnv1a32:418b0673 | 0 | 4 | PASS | Commitment repaired; remaining independent S1s |
| sim-test-5-project-lifecycle | fnv1a32:d958dc7f | fnv1a32:28ecdf3f | 0 | 2 | PASS | Decision created; later named-issue clarification remains |
| sim-test-5-logistics-parity | (SIM-TEST:5 suite) | fnv1a32:4a81a8e6 | 0 | 1 | PASS | Remaining: Production.csv EVIDENCE_MISMATCH T4 |
| sim-test-5-service-parity | (SIM-TEST:5 suite) | fnv1a32:6237a0f6 | 0 | 1 | PASS | Remaining: Production.csv EVIDENCE_MISMATCH T4 |
| sim-test-5-fast-lifecycle | (SIM-TEST:5 suite) | fnv1a32:fd9b7750 | 0 | 0 | PASS | Commitment + downstream clarification cleared |

SIM-TEST:3-FIX1 manufacturing primary and SIM-TEST:4-FIX1 manufacturing/project stress: **PASS**, S0=0, S1=0 (`nexoraSimulationLifecycleJourney.test.ts` regression test).

CC:10 suite: 27 pass. CC:11 `executiveExecutionFollowUp.test.ts`: pass. FINAL:6.2 / 6.3 / NXA:1: pass. Named historical return: pass. RMS observer + SIM-TEST:3 manager journeys: pass.

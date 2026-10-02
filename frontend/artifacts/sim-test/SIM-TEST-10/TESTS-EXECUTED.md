# SIM-TEST:10 tests executed

## Population

`npx tsx --test app/lib/sim-test/nexoraSimulationOutcomeLearning.test.ts`

- tests 1, pass 1, fail 0
- ~7.4s
- 33 journeys: 14 A–N core + 7 delayed-profile + 4 seed + 3 extra RMS + 5 SIM-TEST:5 lifecycle

## Focused regression

`npx tsx --test` on:

- `nexoraSimulationMultiThreadFix1.test.ts`
- `nexoraSimulationMultiThreadFix2.test.ts`
- `nexoraSimulationReassessmentFix1.test.ts`
- `npsOutcomeLearning.test.ts`
- `ecaExecutiveOutcome.test.ts`

Result: **135 pass / 0 fail**

## Not run

- Level 4 funnel
- `nexoraOutcomeLearningRuntimeIntegration.test.ts` / full MVP-OUT:1 matrix
- Full SIM-TEST:9 160-journey recert

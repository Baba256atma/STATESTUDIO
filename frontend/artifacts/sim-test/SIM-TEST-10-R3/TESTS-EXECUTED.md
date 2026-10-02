# TESTS-EXECUTED — SIM-TEST:10-R3

## This phase

- `frontend/app/lib/sim-test/nexoraSimulationOutcomeLearningR3.test.ts` — 1 pass / 0 fail (population + integrity gates; does not assert parent CERTIFIED)

Population: 33 journeys from turn 1 (`SIM_TEST_10_JOURNEYS` + `SIM_TEST_5_JOURNEYS`).

## Focused regression

Command (frontend): `./node_modules/.bin/tsx --test` on:

- `app/lib/sim-test/nexoraOutEvalLive1.test.ts`
- `app/lib/sim-test/nexoraOutLive1.test.ts`
- `app/lib/sim-test/nexoraCommitLive1.test.ts`
- `app/lib/executive-intelligence/nexoraLiveOutcomeIntelligence.test.ts`
- `app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.test.ts`
- `app/lib/executive-intelligence/nexoraGroundedLearningIntelligence.test.ts`
- `app/lib/nex-mvp/nexoraOutcomeLearningRuntimeIntegration.test.ts`
- `app/lib/nexora-problem-solving/npsOutcomeLearning.test.ts`
- `app/lib/nexora-problem-solving/npsOutcomeLearning.runtime.test.ts`
- `app/lib/nexora-conversation/ecaExecutiveOutcome.test.ts`
- `app/lib/nexora-conversation/ecaExecutiveOutcome.runtime.test.ts`
- `app/lib/nexora-conversation/ecaExecutiveLearningClosure.test.ts`
- `app/lib/nexora-conversation/ecaExecutiveLearningClosure.runtime.test.ts`
- `app/lib/sim-test/nexoraSimulationMultiThreadFix1.test.ts`
- `app/lib/sim-test/nexoraSimulationMultiThreadFix2.test.ts`
- `app/lib/sim-test/nexoraSimulationReassessmentFix1.test.ts`

Result: **401 pass / 0 fail**.

## Not run

- Level 4 / full repository
- SIM-TEST:10-FIX1 (not started)

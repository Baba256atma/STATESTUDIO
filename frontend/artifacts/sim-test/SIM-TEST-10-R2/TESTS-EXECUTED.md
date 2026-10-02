# SIM-TEST:10-R2 tests executed

```
npx tsx --test app/lib/sim-test/nexoraSimulationOutcomeLearningR2.test.ts
# pass 1 fail 0  (full 33-journey population from turn 1)

npx tsx --test \
  app/lib/sim-test/nexoraCommitLive1.test.ts \
  app/lib/sim-test/nexoraOutLive1.test.ts \
  app/lib/sim-test/nexoraSimulationMultiThreadFix1.test.ts \
  app/lib/sim-test/nexoraSimulationMultiThreadFix2.test.ts \
  app/lib/sim-test/nexoraSimulationReassessmentFix1.test.ts \
  app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.test.ts \
  app/lib/executive-intelligence/nexoraLiveOutcomeIntelligence.test.ts \
  app/lib/executive-intelligence/nexoraGroundedLearningIntelligence.test.ts \
  app/lib/nexora-problem-solving/npsOutcomeLearning.test.ts \
  app/lib/nexora-problem-solving/npsOutcomeLearning.runtime.test.ts
# pass 207 fail 0

npx tsx --test \
  app/lib/nex-mvp/mvpOut1R2LiveExpectedObservation.test.ts \
  app/lib/nex-mvp/mvpOut1R3LiveOutcomeClosure.test.ts \
  app/lib/nexora-conversation/ecaExecutiveOutcome.test.ts \
  app/lib/nexora-conversation/ecaExecutiveLearningClosure.test.ts
# pass 170 fail 0
```

Not run: Level 4 / full repository.

Production digest unchanged across the R2 population (`SOURCE-INTEGRITY-BEFORE.md` / `SOURCE-INTEGRITY-AFTER.md`).

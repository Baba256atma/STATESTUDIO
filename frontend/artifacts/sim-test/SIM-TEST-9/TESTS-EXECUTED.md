# SIM-TEST:9 tests executed

All commands passed as test commands. Product certification remains blocked by recorded behavior, not by a harness crash.

1. Focused reproduction and deterministic replay:
   `node --import tsx --test app/lib/sim-test/nexoraSimulationMultiThreadCertification.test.ts` — 1/1 pass.
2. Owning layers:
   `node --import tsx --test app/lib/conversational-control/executiveDecisionCommitment.test.ts app/lib/conversational-control/executiveExecutionRuntimeAdapter.test.ts app/lib/sim-test/nexoraSimulationDecisionFix15.test.ts` — exit 0.
3. Locked regressions and lifecycle integration:
   `node --import tsx --test app/lib/sim-test/nexoraSimulationReferentRegressionFix18.test.ts app/lib/sim-test/nexoraSimulationReassessmentFix1.test.ts app/lib/sim-test/nexoraSimulationLifecycleJourney.test.ts` — 36/36 pass.
4. `npm run nxa:funnel -- --level 1` — PASS, 0 failures.
5. `npm run nxa:funnel -- --level 2` — PASS, 0 failures.
6. `npm run nxa:funnel -- --level 3` — PASS, 0 failures.

Level 4 and full SIM-TEST:7/8 populations were not run and are not claimed.

# SIM-TEST:9-FIX1 tests executed

1. `node --import tsx --test app/lib/sim-test/nexoraSimulationMultiThreadCertification.test.ts app/lib/sim-test/nexoraSimulationMultiThreadFix1.test.ts` — 19/19 pass (T1–T16, micro-funnel, vocabulary, immutable evidence).
2. `node --import tsx --test app/lib/conversational-control/executiveExecutionFollowUp.test.ts app/lib/conversational-control/executiveDecisionCommitment.test.ts app/lib/sim-test/nexoraSimulationMultiThreadCertification.test.ts app/lib/sim-test/nexoraSimulationMultiThreadFix1.test.ts app/lib/sim-test/nexoraSimulationDecisionFix15.test.ts app/lib/sim-test/nexoraSimulationReferentRegressionFix18.test.ts app/lib/sim-test/nexoraSimulationReassessmentFix1.test.ts app/lib/sim-test/nexoraSimulationReferentFix16.test.ts app/lib/sim-test/nexoraSimulationNamedIssueFix3.test.ts app/lib/sim-test/nexoraSimulationLifecycleJourney.test.ts` — 115/115 pass.
3. `npm run nxa:funnel -- --level 1` — PASS, 0 failures.
4. `npm run nxa:funnel -- --level 2` — PASS, 0 failures.
5. `npm run nxa:funnel -- --level 3` — PASS, 0 failures.

Level 4 and the full SIM-TEST:9 population were intentionally not run.

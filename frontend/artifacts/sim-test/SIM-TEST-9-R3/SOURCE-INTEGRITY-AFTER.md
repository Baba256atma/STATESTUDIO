# SIM-TEST:9-R3 production integrity (post-execution)

R3 test hasher after the full population and focused regression:

- digest: `87af1d96252cb83b3dd6c377df0c24b8add93806b915f84adeb8ce3046545bf8`
- fileCount: 12704

Production changes during R3: **0**

Working tree still contains FIX1/FIX2 production diffs versus git HEAD. Those hashes were identical at R3 start and R3 end. R3 did not edit them.

Harness/test/artifact writes only:

- `frontend/app/lib/sim-test/nexoraSimulationTestContract.ts` (observational `sourceSubjectId` on scenario ledger)
- `frontend/app/lib/sim-test/nexoraSimulationTestHarness.ts` (map `sourceSubjectId`)
- `frontend/app/lib/sim-test/nexoraSimulationMultiThreadR3.test.ts`
- `frontend/artifacts/sim-test/SIM-TEST-9-R3/*`

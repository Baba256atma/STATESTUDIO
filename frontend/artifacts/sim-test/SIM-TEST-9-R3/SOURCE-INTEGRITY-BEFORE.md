# SIM-TEST:9-R3 production integrity (pre-execution)

Certification-only. No production repair in this phase.

R3 test hasher (`productionSnapshot` over `frontend/app` `.ts/.tsx/.js/.mjs`, excluding `app/lib/sim-test/` and `*.test.*`):

- digest: `87af1d96252cb83b3dd6c377df0c24b8add93806b915f84adeb8ce3046545bf8`
- fileCount: 12704

Independent pre-notes hasher from the R3 setup turn (same fileCount, different path-set algorithm): `e7eeeac4c61acd7df596026392dba2b31da76cfbe2272c3a8ecc0d72ebaa6767`. Certification uses the R3 test hasher for before/after equality.

Protected content hashes recorded at R3 start (and unchanged at R3 end):

- conversationalExperienceOrchestrator.ts `5d4961ad58879fd253c4348f519955d9f45e77dbb2a82641170032ad040c6955`
- executiveExecutionFollowUp.ts `3014add9c544cfa3c245c1192ee523c3407aa591f650dbe8477ce37d501cb4e4`
- executiveScenarioResolver.ts `00fb4871ef844902522ef5b3f9ada143506019c5a18997d60f17e046bb28f24d`
- executiveScenarioDefinition.ts `c89de88c4278426613a6ba5bfce6f7e704690dcea5ee6f2ea7745be19a67853b`
- executiveDecisionCommitmentResolver.ts `a457a1e23d4c5e04488defd581ea55cb678c5887be681ffc59fea40caf0ae2f3`
- executiveDecisionRuntimeAdapter.ts `4841cb77f06ca219013a3664cbb8f509d5ecd42b0e7a0acf154d63944eff70d6`
- executiveExecutionRuntimeAdapter.ts `99c6e140c46c81dee6de159297f71b1f3ae26013405a326bd59db046b19f6321`
- conversationalIntent.ts `b886847236ef60c8` (full hash in `population-run.json`)
- nmiAdvisorContract.ts `abf58d9041246e8b` (prefix; full hash in `population-run.json`)
- rmsManagerCc5Adapter.ts `34fbbfaa6667729b` (prefix; full hash in `population-run.json`)
- npsExecutionMonitoring.ts `c7dc887101580341` (prefix; full hash in `population-run.json`)

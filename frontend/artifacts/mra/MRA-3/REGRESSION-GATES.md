# MRA:3 — Regression Gates

Date: 2026-09-09

No required NXA funnel command was skipped. Extra Stage host-scan is classified (failed). No test was weakened.

| Gate | Result | Notes |
| --- | --- | --- |
| NXA funnel L1 Focused | PASS | 1/1 `l1-cert-infra` 2755 ms |
| NXA funnel L2 Layer | PASS | 1/1 `l2-owning-layers` 17037 ms — CC, DIR, NXA contracts |
| NXA funnel L3 Integration | PASS | 1/1 `l3-cross-layer` 2697 ms |
| NXA funnel L4 Milestone | PASS | 7/7 required: omnibus, DIR inventory, typecheck, eslint PREP, diff-check, production build, live `/executive` smoke. Duration 544055 ms. Barrier requiredStarted 7, requiredPassed 7, requiredFailed 0, requiredStillRunning 0, requiredUninspected 0 |
| TypeScript `npm run typecheck` | PASS | via L4 `l4-typecheck` |
| Production `npm run build` | PASS | via L4 `l4-build` |
| L4 live smoke | PASS | `l4-live-smoke` |
| NCA / NCA-POST (omnibus `app/lib/manager-object/*.test.ts`) | PASS | Included in `l4-executive-omnibus` |
| ECA conversational-control + entrance (omnibus) | PASS | Same L4 omnibus |
| DATA-ADV `nexoraAdvisorDataInquiry.test.ts` + POST-ECA:3 CSV tests | PASS | Extra bundle 335/336 with UX:2 excluded from the fail |
| DATA-UX CSV vertical slice `csvRealDataVerticalSlice.test.ts` | PASS | Extra bundle |
| Stage `nexora3DExecutiveStage.test.ts` | PASS | Extra bundle |
| Stage UX:2 host wiring `nexoraExecutiveUx2StageInteraction.test.ts` | **FAIL 1** | Expects `/resetNexoraMVPObjectInteractionOverview/` in Stage host source. Not in NXA L4 command list. Classified; not patched in MRA:3 |
| DTH `nexoraDecisionTheatreDecisionCommitment.test.ts` + live execution theatre test | PASS | Extra bundle |
| Manager–Object composer test | PASS | Extra bundle |
| Decision CC:10 / Execution CC:11 (`nexoraExecutionPlanning.test.ts`, ECA commitment/live execution) | PASS | Extra bundle; missing-CC:11 still does not fake start |
| Mutation confirmation (`ecaMutationProposal`, `ecaWorkingConversationContext`, risk handoff) | PASS | Extra bundle — unit contracts pass; **journey J10 still fails** confirmation-after-topic-change (MRA-3-004), classified as simulation S1 not a unit-test skip |
| Outcome `ecaExecutiveOutcome.test.ts` | PASS | Extra bundle |
| MRA:2 focused `mra2ManagerReadiness.runtime.test.ts` | PASS | Included in extra bundle (no fail from that file) |

Certified **regression suites** are green except the extra UX:2 host-scan. **Simulation S1s are not unit-test failures**; they are manager-journey failures in `FAILURE-MAP.md`.

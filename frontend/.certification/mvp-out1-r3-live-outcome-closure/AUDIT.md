# R3 Audit

## Pre-implementation answers

1. **Committed Decision event:** CC:10 `transitionDecision` to `Approved` (conversation confirm or flow approve).
2. **Timestamp:** only if the mutation supplies `committedAt`.
3. **Storage:** `NexoraCanonicalDecisionRecord.committedAt` on Decision Runtime.
4. **Why live fixtures were null:** `ctx-decision-capacity` / `ctx-decision-reprice` are Under Review; no historical commitment event.
5. **Approval vs commitment:** in CC:10, Approved is the commitment boundary.
6. **Approval time as committedAt:** yes, when the mutation happens now and the host passes the mutation clock.
7. **Live measurable expected:** no. Scenario collector has summary + dimension, no unit/target.
8. **Scenario→Decision handoff:** identity can survive only if a canonical measurable expectation is supplied; summary prose cannot.
9. **Decision Brief:** presentation prose, not a target contract.
10. **Legitimate measurable fields:** explicit `ExecutiveOutcomeExpectation` (dimension, unit, target/direction/comparator).
11. **Forbidden:** Advisor/recommendation prose, Stage labels, scenario summary, current KPI, later Actual.
12. **Before/at commitment:** yes, via `resolveDecisionOutcomeCommitment` at the Approved mutation.
13. **Boundary:** Decision `committedAt`; Execution `startedAt` only if canonically present (live Execution has none).
14. **Live Execution startedAt:** no (NEX-MVP:8 fixtures have no start clock).
15. **Post-boundary Data Reality:** possible when a journal observation has a later `observedAt`.
16. **Default live dataset:** does not produce longitudinal Outcome observations.
17. **Refresh:** re-read is not a new observation; journal identity must change.
18. **T1 vs T2 identity:** `obs:{sourceId}:{datasetId}:{metricId}:{observedAt}`.
19. **R2 capture subscription:** connected after coordinator registers context.
20. **Current KPI ≠ T2:** no Outcome binding/window/linkage → Reality only.
21. **Can become CODE CONNECTED:** commitment path, window from genuine time, R2 capture, 1A→1→2→EXI:5.
22. **Remain LIVE-ABSENT:** fixture measurable expected, default T2 Actual, live Learning, live APP-4 promotion.

Prior live bug: `/executive` passed a hardcoded `2026-08-15` clock on every conversational turn. R3 replaced that with the mutation-time ISO timestamp and does not backfill fixture Decisions.

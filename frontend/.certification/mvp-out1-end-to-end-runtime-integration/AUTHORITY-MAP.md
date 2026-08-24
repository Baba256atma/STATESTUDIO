# MVP-OUT:1 Authority Map

MVP-OUT:1 owns **runtime integration only**. It does not own Decision, Execution, Data Reality, Outcome observation, Outcome evaluation, Learning, causality, APP-4 storage, or EXI presentation.

## Pre-implementation answers

1. **Live Decision origin:** CC:10 Decision Runtime, projected onto `/executive` by NEX-MVP:8 flow records (`ctx-decision-reprice`, `ctx-decision-capacity`). Initial live status is `under-review`, not committed.

2. **Live Execution origin:** NEX-MVP:8 flow records (`ctx-execution-rollout` in-progress 62%, `ctx-execution-capacity` planned 0%). Not CC:11.

3. **Is CC:11 live on /executive?** No. Advisor compose still passes `cc11Live: false`.

4. **If CC:11 unwired, live Execution path:** NEX-MVP:8 / `nexoraMVPExecutiveFlow.ts` presentation + flow domain.

5. **Expected Outcomes created:** Scenario presentation fixtures via `collectNexoraLiveExpectedOutcome` (stable `expected:{scenarioId}`), or an explicit CORE-OUT:1 `ExecutiveOutcomeExpectation` supplied to the integrator.

6. **Stable IDs?** Yes for fixture/canonical expectations (`expected:{sourceId}` / `canonicalExpectedOutcomeId`).

7. **Expected Outcomes linked to Decisions:** PARTIAL live — Decision subjects can collect a scenario-sourced expectation; Decision-source expectations exist when `subjectKind === "decision"`.

8. **Linked to Executions:** PARTIAL via NEX-MVP:8 `sourceDecisionId` and linked subject kind `execution`.

9. **Data Reality observations enter:** P2:4 Advisor binding + RDI when a validated dataset is active. Numeric KPI results are not automatically captured as Outcome observations on the live EXI path.

10. **Does CORE-OUT:1A receive them automatically?** PARTIAL. Live compose projects current KPI as Reality through CORE-OUT:1A `projectOutcomeObservationCapture` only when `currentKpi` is supplied. Explicit `captureOutcomeObservation` is TEST-ONLY / caller-supplied.

11. **Outcome observation repository:** In-memory session store in `nexoraLiveOutcomeObservationCapture.ts`.

12. **Lifetime:** session (`LIVE_OUTCOME_OBSERVATION_BOUNDARY.storageLifetime = "session"`).

13. **Observation windows:** `openOutcomeObservationWindow` in CORE-OUT:1A.

14. **Live window paths:** PARTIAL — integrator opens a window when Decision/Execution refs exist; without `committedAt` / start timestamps the window is `timing-incomplete`. No live timestamps are invented.

15. **CORE-OUT:1 reads linked Actuals:** From CORE-OUT:1A `capture.linkedActuals` only.

16. **CORE-OUT:2 receives assessments:** Yes, from the integrator (`projectGroundedLearningIntelligence({ assessment, capture, ... })`).

17. **CORE-OUT:2 live vs empty:** Live `/executive` currently yields 0 Learning candidates (honest). Deterministic tests can produce candidates.

18. **EXI:5 source:** Integrator calls `composeNexoraExi5OutcomeLearningExperience` with CORE-OUT:1/2 + CORE-INT:3.

19. **Advisor consumes EXI:5:** `composeNexoraExecutiveIntelligenceExperience` → `applyNexoraExecutiveIntelligenceExperienceToAdvisor` in `NexoraAdvisorInsightRegion`.

20. **Conversation consumes EXI:5:** `projectNexoraExiConversationalAnswers` / `classifyNexoraExiUtterance`.

21. **APP-4 eligible Learning:** `promoteGroundedLearningToApp4` in CORE-OUT:2.

22. **APP-4 live promotion:** TEST-ONLY / PARTIAL. Live compose sets `authorizeApp4Promotion: false`.

23. **CONNECTED:** CORE-OUT:1A→CORE-OUT:1, CORE-OUT:1→CORE-OUT:2, CORE-OUT:2→EXI:5, EXI:5→Advisor/Conversation.

24. **PARTIAL:** Decision→expected, Decision→Execution (NEX-MVP:8), Data Reality→1A, Execution→observation window (no live timestamps).

25. **MISSING:** CC:11 live Execution; automatic live longitudinal Actual; live APP-4 promotion.

26. **TEST-ONLY:** Explicit observation capture + linkage; authorized APP-4 promotion seam.

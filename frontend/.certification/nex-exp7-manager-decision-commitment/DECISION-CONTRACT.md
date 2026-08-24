# NEX-EXP:7 Decision Contract

Identity: `NEX-EXP:7/ManagerDecisionCommitmentExperience` `1.0.0`

Law: **RECOMMENDATION ≠ DECISION ≠ EXECUTION**

NEX-EXP:7 is an experience/integration layer. Commitment writes only through CC:10R Canonical Decision Runtime.

## Flags

- `nexoraCanRecommend = true`
- `nexoraCanCommitDecision = false`
- `managerConfirmationRequired = true`
- `startsExecution = false`

## `ExecutiveDecisionExperienceView`

decisionQuestion, activeGoal, recommendedScenario, alternatives, selectedPreference, decisionStatus, rationale, tradeoffs, risks, assumptions, unknowns, evidence, confirmationRequired, managerConfirmed, committedDecisionId, committedAt, startsExecution: false

## States (semantic, not wizard pages)

NOT_STARTED → DECISION_READY → REVIEWING_DECISION → PREFERENCE_EXPRESSED → AWAITING_CONFIRMATION → COMMITTED | REJECTED | DEFERRED → READY_FOR_EXECUTION_PLANNING

READY_FOR_EXECUTION_PLANNING is a handoff only. NEX-EXP:8 is not started.

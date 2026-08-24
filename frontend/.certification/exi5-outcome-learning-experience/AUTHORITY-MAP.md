# EXI:5 — Authority Map

EXI:5 is a **presentation/read model**. It does not create Outcome, Learning, causality, recommendations, or durable memory.

## Frozen authorities

| Concern | Authority |
|---|---|
| Observed business truth | Data Reality |
| Observation capture + linkage | CORE-OUT:1A |
| Expected vs Actual evaluation | CORE-OUT:1 |
| Grounded Learning | CORE-OUT:2 |
| Epistemic / uncertainty | CORE-INT:2 |
| Causal + constraint | CORE-INT:3 |
| Priority | CORE-INT:4 |
| Trade-off | CORE-INT:5 |
| Decision | Decision Runtime |
| Execution | Execution Runtime / NEX-MVP:8 (CC:11 unwired) |
| Durable historical memory | APP-4 |
| Existing experience | EXI:1–4 |
| Frozen manager UX | UX:1–6 |
| Frozen MVP | `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0** |

EXI:5 owns only Outcome + Learning **experience integration**.

## Pre-implementation read-path answers

1. **Expected Outcome** — CORE-OUT:1 `expectedOutcome` via `projectNexoraLiveOutcomeIntelligence` in `composeNexoraExecutiveIntelligenceExperience`. Live `/executive` may have a scenario/decision PREDICTION; often pending Actual.
2. **Actual Outcome** — CORE-OUT:1 `actualOutcome` from CORE-OUT:1A `linkedActuals`. Live fixture: none.
3. **Outcome status** — CORE-OUT:1 `status` / `comparison`. Previously shown as EXI `outcome` field with authority `missing` when no Actual.
4. **CORE-OUT:2 candidates** — `coreLearningAssessment` already projected live; live candidates = 0.
5. **Learning confidence/evidence** — CORE-OUT:2 `confidence` / `evidenceStrength`. Not previously manager-explained beyond a missing Learning sentence.
6. **APP-4 historical Learning** — `retrieveHistoricalGroundedLearning`. Not previously shown in Advisor/Conversation.
7. **Advisor** — no dedicated Outcome/Learning section before EXI:5. Situation/recommendation only.
8. **Conversation** — `"What was the outcome?"` / `"What did we learn?"` existed; `"Did it work?"` / `"Why did this happen?"` / historical Learning did not.
9. **Presentation as Learning authority?** — EXI:1 `learning` field used `presentGroundedLearning` as a reader. EXI:5 keeps that as projection; `createsLearning = false`.
10. **Path classes** — see `runtime-connectivity.json`.

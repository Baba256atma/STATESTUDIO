# NPA-T NPS:1 — Architecture Inspection

Inspection date: 2026-09-15.

NPS is not a Nexora layer, store, writer, or reasoning engine. It is a read-oriented path contract over existing authorities.

## Existing authorities inspected

| Capability | Existing authority | Useful exposed state | NPS:1 reuse |
| --- | --- | --- | --- |
| Manager–Object / Stage context | MO Context (`managerObjectContext.ts`), NCA-POST:3 collection, Stage/MVP object interaction | `associatedProblem`, object kind, scenarios, decisions, execution | Observe Problem anchor and related IDs. Do not own Stage focus. |
| Conversation / ECA | ECA:1 working context; ECA:2–12 judgments; NCA:2 conversation state | Active subject, pending confirmation, recommendation/commitment/readiness/outcome/learning projections | Consume later as facts. Do not become a conversation authority. |
| Problem | EI:3 Problem/Risk/Opportunity reference; MO associated Problem; CC:8 assessment framing | Problem identity/label without a second Problem store | Anchor `problemId` only when confidence is HIGH/MEDIUM. |
| Investigation | FINAL:5 `executiveInvestigationComposer.ts` | Investigation thread, candidates, observations | `investigationPresent` / investigation id. |
| Data Reality / Evidence | RDI / Data Reality; CC:8 evidence pack; NCA-POST:4 `evidenceState` | NONE / INSUFFICIENT / PARTIAL / SUFFICIENT | Observe evidence sufficiency. Never write evidence. |
| Causal / variable intelligence | CORE-INT:3 grounded causal constraint intelligence | Recorded contributors/hypotheses, no inferred root cause | `causeHypothesesAvailable` only when CORE-INT:3 already exposes them. |
| Scenario | CC:9 scenario conversation/evaluation; scenario-intelligence packages | Scenario ids related to the Problem | Options facts. No Scenario store. |
| Comparison | NCA-POST:4 collection comparison; DTH:7 comparison theatre | Comparison candidate set and evidence state | `comparisonAvailable`. |
| Recommendation | ECA:7 recommendation judgment; NCA:4 advisory | Readiness READY / READY_WITH_CONDITIONS | `recommendationReady`. Not a Decision. |
| Decision | CC:10 / CC:10R Decision runtime | Approved/committed Decision id and status | `approvedDecisionId`. NPS never transitions Decision. |
| Execution | CC:11 Execution follow-up + canonical Execution runtime; ECA:9 readiness; DTH:9–10 | Execution id/status | Observe READY / ACTIVE / MONITORING / COMPLETED. Never start Execution. |
| Outcome / Learning / Reassessment | CORE-OUT; EI:6; ECA:11–12; DTH:11–12; MO:5 outcome/learning projection | Observed outcome, unresolved vs improved | `outcome.observed` / `problemResolved`. NPS does not invent Outcome or Learning. |
| Decision Theatre / Director | DTH:5 scene intent; DIR:1 director plan | Presentation of investigation, comparison, commitment, execution, outcome | Presentation only. NPS does not redesign Theatre or Advisor. |
| Goal-centered journey | MO:5 Executive Journey (`JOURNEY_STATES`) | Goal phase and coarser journeyState | Adjacent, not replaced. MO:5 answers Goal progress; NPS answers Problem-solving position. |
| Object exploration paths | MO:3 exploration path kinds | Related investigate/evidence/scenario/decision/execution/outcome paths | Navigation hints, not Problem path state. |

## Handoffs that already exist

- Investigation → evidence/causal: FINAL:5 reads CORE-INT:3 and live relationships.
- Comparison → advisory: NCA-POST:4 isolates comparison from Decision write.
- Recommendation → commitment: ECA:7 → ECA:8; write remains CC:10.
- Commitment → Decision: CC:10 / CC:10R only.
- Decision → Execution: DTH:9 readiness then CC:11 start.
- Execution → Outcome/Learning: CORE-OUT / ECA:11–12 / DTH:11–12.
- Conversation consumes all of the above; it does not own them.

## Where the journey is currently fragmented

1. MO:5 is Goal-centered and coarser (`INVESTIGATING`, `AWAITING_DECISION`, `EXECUTING`) and can move with Stage object focus.
2. ECA states are conversation judgments (recommendation, commitment, readiness, outcome talk), not “where this Problem sits.”
3. DTH:5 scene intent is visual purpose, not problem-solving path state.
4. NCA-POST:4 comparison, CC:9 scenarios, and CC:10/11 writes are correct locally but are not composed into one Problem-anchored path.
5. Stage focus, collection members, stale Scenario, and conversation subject can diverge from the active Problem.

NPS:1 adds one derived path snapshot so those facts can be read in order without creating a parallel owner.

## Authority boundary kept

| Domain | Writer / owner | NPS |
| --- | --- | --- |
| Conversation | ECA / NCA | Observe only |
| Evidence / Data | Data Reality / CC:8 | Observe only |
| Scenario | CC:9 / scenario authorities | Observe only |
| Recommendation | ECA:7 / NCA:4 | Observe only |
| Decision | CC:10 / CC:10R | Observe only |
| Execution | CC:11 | Observe only |
| Outcome / Learning | CORE-OUT / ECA:11–12 | Observe only |
| Stage / Theatre | Stage / DIR / DTH | Observe only |
| Path continuity | **NPS (this contract)** | Derive `currentState` and next valid step |

No production adapter is wired in NPS:1. Callers pass observed canonical facts into `composeNpsProblemSolvingPath`.

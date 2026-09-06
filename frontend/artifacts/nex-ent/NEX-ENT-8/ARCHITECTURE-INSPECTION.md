# NEX-ENT:8 — Architecture inspection (before implementation)

Inspection date: 2026-09-04.

## Who owns what

| # | Question | Canonical owner | Files |
| --- | --- | --- | --- |
| 1 | Issue truth | NEX-EXP:4 issue discovery + EI:3 | `nexoraIssueDiscoveryExperience.ts` |
| 2 | Scenario truth | NEX-EXP:5 scenario discovery + CC:9 | `nexoraScenarioDiscoveryExperience.ts` |
| 3 | Comparison | NEX-EXP:6 + EI:4 + DTH:7 | `nexoraScenarioComparisonExperience.ts`, DTH decision comparison |
| 4 | Recommendation | CC:8 / NEX-EXP:6 recommendation view | comparison experience; Advisor narrates |
| 5 | Decision write | **CC:10R** via NEX-EXP:7 | `executiveDecisionRuntimeAdapter.ts`, `nexoraDecisionExperienceResolution.ts` `commitThroughCanonicalRuntime` |
| 6 | Explicit commitment | Manager confirmation (`Confirm?` then yes/approve) | NEX-EXP:7; `nexoraCanCommitDecision: false` |
| 7 | Execution create/start | **CC:11** | `executiveExecutionRuntimeAdapter.ts`, NEX-EXP:8 |
| 8 | Execution transitions | CC:11 | same |
| 9 | Outcome observation | NEX-EXP:9 + DTH:11 | manager-reported / session observations; `NEXORA_OUTCOME_MONITORING_BOUNDARY` |
| 10 | Outcome durable? | Session/experience path on first-time entrance; not Data Library | Do not claim durable business Outcome |
| 11 | Learning interpretation | CORE-OUT:2 / NEX-EXP:10 / DTH:12 | presentation; APP-4 not written by Theatre |
| 12 | Learning durable? | **No** Theatre writer; APP-4 is memory authority and is not added by ENT:8 | `nexoraDecisionTheatreLearningReassessmentRegistry.ts` |
| 13 | ENT:8 allowed | Lesson pacing + copy. May request DIR:GA STAGE. Must not write Decision/Execution/Outcome/Learning/Data Reality. | this phase |

## Visual Intelligence / DIR:GA

Reuse only. ENT:8 does not own charts or attention.

## NEX-EXP relationship

The certified first-time loop (Goal → Reality → Issues → Scenarios → Compare → Decision → Execution → Outcome) already exists. ENT:8 **teaches** that loop. It does not duplicate it.

On restrained ENT `/executive?entrance=1` identity is typically insufficient, so NEX-EXP:7 does not own `Approve` until `scenarioComparison.state === READY_FOR_DECISION`. Therefore an educational ENT session must **not** fabricate a Decision. Canonical commitment is proven on the existing NEX-EXP path (callable outside ENT).

## Educational evidence

ENT:6 example CSV: two OTD observations (89.8, 90.1). Not a confirmed Problem. Not six months. Not fabricated 91/94/96 unless the manager later supplies those on the NEX-EXP path.

Do not start NEX-ENT:9.

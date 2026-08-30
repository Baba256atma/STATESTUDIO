# DTH:1 Architecture inspection

Decision Theatre is a renderer-neutral projection over the certified `/executive` path. It does not own Stage, Director, Runtime, Advisor, Decision, Execution, Outcome, Learning, evidence, or journey truth.

## Path (required)

Manager interaction or conversation
→ Canonical intent and context (CC:1–2, FINAL:6.1/6.2, NCA/NXA)
→ Existing Runtime authorities (CC:4 / NEX-MVP:4)
→ Director (DIR:1 `directNexoraPresentation` / `applyDirectorPlanToStage`)
→ Decision Theatre scene projection (`projectNexoraDecisionTheatreFoundation`)
→ Existing Stage renderer (NEX-MVP:3)
→ Advisor explanation (existing composer; DTH:1 does not redesign replies)

## Inspected authorities (reused unchanged)

| Concern | Authority | DTH:1 reuse |
|---|---|---|
| Stage scene contracts | NEX-MVP:3 `resolveNexoraMVPStageScenePresentation` | Read via existing derive |
| Object interaction, focus, selection, trail | NEX-MVP:4 | Sole interaction writer |
| Collection presentation | STAGE-PROD / DIR:1 `presentNexoraMVPExecutiveQueueCollection` | Unchanged |
| 2D fixed camera + local 3D objects | STAGE-2D:1 / NEX-MVP:3 | Not modified |
| Click-to-center | UX:2 / `selectNexoraMVPInteractionSubject` | Unchanged |
| Related-object disclosure | `resolveExecutiveStageDisclosure` | Unchanged |
| Back, Forward, Escape, Overview | NEX-MVP:4 trail + shell | Unchanged |
| Director | DIR:1 | Sole presentation planner |
| Advisor → Director → Stage | CC:5 orchestrator | Theatre attached after DIR apply |
| Click / conversation parity | UX:4 + CC:4 bridge | Unchanged writers |
| Scene HUD / object panel | HUD freeze contracts | Not in Theatre scope |
| Manager–Object | MO:1–6 | Unchanged |
| Executive journey | NEX-EXP | Unchanged |
| Scenario / Decision / Execution / Outcome / Learning | CC:9–11, NEX-EXP | Theatre `writes.* = false` |
| Evidence / provenance / confidence | Existing MO/EI stores | Not written |
| Scene snapshots | CC:2 `NexoraActiveStageContextSnapshot` | Not rewritten |
| REX-2 Stage foundation | REX-2:1 identity only | No REX-2 internals imported |
| Diagnostics | `diagnosticSwitch` scope `dthDecisionTheatre` (default off) | Developer-only |

## Created

- `frontend/app/lib/decision-theatre/*` foundation, adapter, invariants, Director boundary, Advisor-readable context, diagnostics, public index, tests
- `frontend/artifacts/dth/DTH-1/` certification package

## Modified (minimal compatibility)

- `conversationalExperience.ts` — optional `decisionTheatre` projection field
- `conversationalExperienceOrchestrator.ts` — project after DIR:1 Stage application
- `diagnosticSwitch.ts` / test — default-off `dthDecisionTheatre` scope

## Not created

Second Stage, Director, Scene store, Runtime, navigation system, interaction pipeline, Advisor, Decision/Execution/Outcome/Evidence store, or Journey engine. No Theatre visuals, cards, charts, replay, War Room, NexoGraph, or suggested-question UI.

# NPA-T NPS:2 — Architecture Inspection

Inspection date: 2026-09-15.

NPS remains a path/composition contract. NPS:2 does not add a Problem, questioning, investigation, or evidence authority.

## Certified NPS:1 reuse

`composeNpsProblemSolvingPath` remains the only Problem-solving path resolver. NPS:2 starts from `problemOwnership`. `UNCERTAIN` and `CONFLICTED` produce `CLARIFY_PROBLEM` and do not start investigation against Stage focus, latest Scenario, collection, stale conversation subject, recommendation, Decision, or Execution.

## Who owns what

| Concern | Owner | NPS:2 role |
| --- | --- | --- |
| Problem truth | EI:3 / MO associated Problem / catalog Problem identity | Observe only |
| Active Problem ownership | NPS:1 path (`DETERMINED` / `UNCERTAIN` / `CONFLICTED`) | Consume; preserve across follow-ups via session `npsProblemId` (continuity hint, not a store) |
| Conversation questioning | ECA:4 information acquisition; ECA:5 intake; ECA:6 objective control; ECA:3 initiative | Handoff the path need. NPS does not select the spoken question. |
| Investigation | FINAL:5 `composeExecutiveInvestigationAnswer`; CORE-INT:3 for recorded causal constraint | Handoff when trusted evidence exists |
| Evidence truth | Data Reality / CC:8 evidence pack / catalog presentation observations | Observe availability and trust |
| Manager confirmation | Existing ECA / NCA / CC:10 / CC:11 confirmation paths | Unchanged |

## Existing contracts reused

- NPS:1 path states `UNDERSTANDING` → `INVESTIGATING` → `EVIDENCE_REVIEW`
- ECA:4 `ASK_MANAGER` / `USE_EXISTING_INFORMATION` acquisition actions
- FINAL:5 investigation thread and known-condition presentation
- MO Context `associatedProblem`
- Catalog KPI/summary as observed facts, not invented business meaning

## Handoffs

NPS identifies the smallest unresolved investigation need.

If manager meaning is required: `questioningHandoff` to ECA:4, then ECA:5 interprets the answer.

If trusted evidence exists: `investigationHandoff` to FINAL:5 / CORE-INT:3.

NPS:2 does not perform NPS:3 cause analysis. Symptom, correlation, and manager statement remain non-causes unless an existing causal authority already records support.

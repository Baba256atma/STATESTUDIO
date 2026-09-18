# NPA-T NMI:6 — Architecture Inspection

Inspection date: 2026-09-17.

Stop condition: read-only Management Context → Stage Projection handoff. Do not create an NMI Stage, second Director, DTH-EXP, or NMI:7.

## Inspected authorities

| Area | Finding |
| --- | --- |
| NMI:1 UnifiedManagementModel | Read-only compose. No mutation on selection. |
| NMI:2 Management Map / branch | `extractNmiManagementBranch` is the bounded undirected extractor. Reused. |
| NMI:3 Relationship Intelligence | Interpretations + gap reports reused. No new relation kinds. |
| NMI:4 Decision Roadmap | Descriptive journey; contributes ROADMAP-tier node refs only when already in the NMI:2 branch. |
| NMI:5 Attention / Map navigation | Overlay selection identity preserved. `projectsOntoStage` remains false on NMI:5. |
| STAGE-PROD:1 Queue | Category, collection, CENTER, back/forward/escape remain Queue/Stage writers. |
| Stage selection | Canonical writer is `selectNexoraMVPInteractionSubject` in `nexoraMVPObjectInteraction.ts`. |
| Director | DIRECTOR-1:1 owns scene orchestration, camera, layout, animation. Metadata-only foundation. |
| DTH scene intents | DRI presentation intent remains Director Runtime. NMI does not emit scene geometry. |
| Advisor / CC:5 / ECA / NCA | Conversational referent authority unchanged. NMI:7 not started. |
| MO / VAI / Data Reality / Scenario / Decision / Execution / Outcome | Canonical owners unchanged. NMI only references IDs. |
| RMS | Ground Truth FORBIDDEN. Projection cannot display sealed facts. |
| Gate | RDI:1 remains the only Gate API. |

## Canonical Stage/Director entry

NMI feeds **existing** `selectNexoraMVPInteractionSubject` via `handoffNmiStageProjectionToExistingStage`.

There is no parallel projection store, no NMI Stage, and no second focus registry.

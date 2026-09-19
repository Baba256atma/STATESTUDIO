# DTH-EXP:1 — Architecture inspection

## Smallest extension point

Add a read-oriented **Theatre Foundation** projection over certified DTH:1–12. Objects remain actors; Nexo families remain unimplemented visual languages; Director remains the composer; the existing Stage remains the theatre host.

Stop condition: shared Theatre Scene / Actor / visual-role / relationship / Evidence-attachment contracts plus focused tests. Do not start DTH-EXP:2. Do not implement NexoBubble, NexoBars, NexoFlow, NexoImpact, NexoRisk, NexoTime, NexoCause, NexoExecution, or NexoOutcome.

## Canonical flow

Manager Context → DIR:1 Scene composition intent → DTH:5 Scene Intent / Scene Script → DTH:1 Stage compatibility projection → DTH-EXP:1 Theatre Scene projection.

DTH-EXP:1 does not call `applyDirectorPlanToStage`. It does not write Runtime, Objects, Evidence, VAI roles, Decision, Execution, Outcome, or Learning.

## Inspected authorities (reused, not replaced)

| Concern | Owner | DTH-EXP:1 |
|---|---|---|
| Canonical Objects | MO:1 / NEX-MVP:4 catalog | Actor references `canonicalObjectId` |
| Stage state / projection | NEX-MVP:3 / NEX-MVP:4 + DTH:1 adapter | Host only; no second Stage |
| Director intent | DIR:1 | Composition metadata only |
| Scene composition | DTH:5 | `sceneIntentRef` / `sceneScriptRef` |
| Evidence | CC:8 | Attachment refs; no copy |
| Data Reality | P0:1 / RDI:1 | Not duplicated |
| Advisor context | DTH:1 `advisorReadable` / CC:5 | Reference only |
| Relationships | DTH:1–3 / NMI:1 | Preserve `sourceAuthority` / `sourceRef` |
| Variable roles | VAI:1–8 `VAI_CONTEXTUAL_ROLES` | Same tuple identity |
| Decision / Execution | CC:10 / CC:11 | `writes.* = false` |
| Outcome / Learning | CORE-OUT / DTH:11–12 | `writes.* = false` |
| NMI / NPS / RMS / ECA | Certified programs | Consumed as context, not replaced |
| Timeline visualization | Future NexoTime technique; EVE-4 is not Theatre authority | No parallel timeline engine |

## Product invariant

A manager does not see a chart. A manager sees a management scene in which Objects, visualizations, Evidence, and Advisor are actors in the decision process.

## Not created

Second Stage, Director, Object store, Evidence store, Data Reality, VAI role registry, Decision/Execution/Outcome writer, Timeline authority, animation engine, automatic Nexo selection, or Nexo scene families.

# MO:1 — Manager–Object Interaction Foundation

Identity: `MO:1/ManagerObjectInteractionFoundation`  
Stage authority: `NEX-MVP:4/selectNexoraMVPInteractionSubject`  
Conversation: `CC:1 → CC:2 → CC:3 → CC:4`  
Advisor: `UX:3` reader  
Evidence: Data Reality / presentation fixtures / recorded relationships  
Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline`

## Law

The manager interacts with **executive objects**, not with Nexora’s internal architecture.

```
Manager → Object → Context → Intelligence → Guidance → Next Object / Action
```

Object = executive subject + context + evidence + relationships + available actions.

Canonical Runtime Truth > Interaction Context > Presentation.

## Active object

`activeObjectId` is established when the manager clicks or conversationally names an object.

Deictic follow-ups (`Explain this`, `Why?`, `What should I do about this?`) preserve the current active object.

Named turns replace the active object. Stage click-to-center remains:

`CLICK OBJECT → CENTER (0,0) → RELATED CONTEXT → UNRELATED HIDDEN`

MO:1 does not write Stage coordinates. Click still uses `selectNexoraMVPInteractionSubject`.

## Object context

Generic fields, never fabricated:

identity, kind, executive meaning, current state, KPI/evidence, provenance, relationships, parent/child, associated goal/problem/risk, scenarios, decisions, execution, outcomes, confidence.

Missing fields are `UNKNOWN`.

## Manager intents

Generic across object types:

EXPLAIN · STATUS · WHY · RELATIONSHIPS · IMPACT · RISK · OPTIONS · SCENARIO · RECOMMEND · DECIDE · NEXT_ACTION · EXECUTION · OUTCOME

## Support statuses

| Status | Meaning |
|---|---|
| KNOWN | Supported by runtime/evidence |
| INFERRED | Derived from recorded relationships/reasoning |
| UNKNOWN | Insufficient evidence — valid result, not an error |

UNKNOWN is never converted into a confident executive claim.

## Explain Engine handoff

Request: `object + manager intent + executive context + evidence + relationships`  
Response: `explanation + significance + evidence + uncertainty + suggested next questions/actions`

MO:1 prepares this contract. It does not hard-code a per-object explanation engine.

## What MO:1 did not do

- No Stage, Advisor, EI, or object-architecture redesign
- No parallel truth system
- No MO:2
- No APP-4 write
- No LLM

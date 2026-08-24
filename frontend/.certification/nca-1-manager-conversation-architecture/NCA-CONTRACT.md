# NCA:1 — Manager Conversation Architecture & Advisor Behavior Foundation

Identity: `NCA:1/ManagerConversationArchitectureAdvisorBehaviorFoundation` `1.0.0`  
Namespace: `nexora.nca.manager-conversation-architecture`  
Live LLM: **false**

NCA interprets the manager turn and selects advisor behavior. It does **not** own Goal truth, Decision, Execution, evidence, object identity, or a second Advisor.

```
Manager message
      ↓
6.1 understanding  (+ nested-name / knowledge remap)
      ↓
6.2 reference / continuity
      ↓
6.3 clarify / correct
      ↓
Manager Need  +  Knowledge sufficiency  +  Advisor Behavior
      ↓
Existing CC / MO / EI / EXP / RDI capability
      ↓
Advisor response strategy
      ↓
6.4 trusted communication  +  NCA presentation overlay
      ↓
Manager-facing reply  +  continuity
```

## Canonical turn

`ManagerConversationTurn` in `nexoraNca1ConversationTypes.ts`.

Need families and advisor behaviors are behavioral layers over existing 6.1 operations — not a keyword enum and not a sentence table.

## Reference precedence

`NCA1_REFERENCE_PRECEDENCE` (delegates to 6.2):

1. Explicit current-turn name (longest nested registered name, not verb-inflated titles)
2. Active conversational subject
3. Immediately previous subject
4. Existing Stage context
5. Active investigation
6. Active Goal
7. Unresolved

Stage focus is not used when conversation has a stronger semantic subject.

## Knowledge sufficiency

If the need is EVALUATE / DECIDE / ACT and missing facts would change the recommendation, behavior is ASK and **one** highest-value question is asked.

## Capability routing (readers, not new engines)

| Need | Authority |
| --- | --- |
| UNDERSTAND / EXPLAIN | MO:2 |
| INVESTIGATE | MO / EI:3 |
| COMPARE | EI:4 / EXP:6 |
| DECIDE / REQUEST_RECOMMENDATION | CC:8 / CC:10 |
| ACT | CC:11 |
| FOLLOW_UP | CC:12 |
| LEARN | EI:6 |
| LOCATE | CC:4 / Stage |
| TEACH / ORIENT | NEX-EXP / FINAL:6.5 |
| SOCIAL / UNKNOWN | CC:5 recovery |

## Boundary

No second Advisor, Goal store, object registry, Decision/Execution authority, journey, Domain model, LLM project, RAG, SQL, supplier discovery, or NCA:2.

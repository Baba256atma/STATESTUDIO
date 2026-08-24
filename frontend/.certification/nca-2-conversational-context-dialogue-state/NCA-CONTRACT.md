# NCA:2 — Conversational Context, Topic & Dialogue State Intelligence

Identity: `NCA:2/ConversationalContextTopicDialogueStateIntelligence` `1.0.0`  
Namespace: `nexora.nca.conversational-context-dialogue-state`  
Live LLM: **false**

NCA:2 organizes **session conversation state**. It does **not** own Goal, Decision, Execution, evidence, KPI values, durable memory, Stage history, or a second Advisor.

```
Previous dialogue state
      ↓
Manager message
      ↓
NCA:1 turn meaning (Need + Reference + Behavior)
      ↓
NCA:2 dialogue interpretation
      ↓
Resolve: answer / continue / shift / return / correction
      ↓
Existing Nexora capability (CC / MO / EI / EXP)
      ↓
Advisor response
      ↓
Register Nexora dialogue effects
      ↓
Updated NexoraConversationState (ManagerObjectSession)
```

## Conversation vs executive state

Executive truth remains in existing authorities (Delivery %, Goal, Decision, Execution, outcomes).

NCA:2 tracks: active topic, conversational subject, thread stack, pending Nexora question, expected information, unfinished advisory work.

## Persistence

`NexoraConversationState` lives on `ManagerObjectSession.ncaConversationState`. It is session-scoped, bounded (`NCA2_STATE_BOUNDS`), and frozen. 6.2 `ConversationContinuitySnapshot` remains the object-reference continuity authority.

## Pending-question validity

A pending question expires when it is answered, the thread is abandoned or resolved, it is superseded by a later Nexora question on the same thread, or `pendingExpired` is set. Abandoned questions are not resurrected on return.

## Boundary

No second durable memory, conversation store, Stage history, journey engine, object registry, Advisor, LLM project, RAG, SQL, or NCA:3.

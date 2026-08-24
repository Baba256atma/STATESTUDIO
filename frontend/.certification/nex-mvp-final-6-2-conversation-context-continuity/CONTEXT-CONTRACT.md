# FINAL:6.2 — Conversation Context & Continuity

Identity: `NEX-MVP-FINAL:6.2/ConversationContextContinuity`  
Version: `1.0.0`  
Namespace: `nexora.mvp.final62.conversation-context-continuity`

Conversation Context = what we are talking about.  
Business Authorities = what Nexora knows about it.

## Pipeline

Natural Manager Turn → FINAL:6.1 `CanonicalManagerMeaning` → FINAL:6.2 `ContextualManagerMeaning` → existing CC / MO / EI / EXP.

## Precedence

1. Explicit current-turn subject  
2. Strong typed contextual reference (`this problem`, `that risk`, `the goal`)  
3. Correction binding (FINAL:6.3 hook)  
4. Stage click / existing Stage context  
5. Active investigation (tell me more / this problem)  
6. Active conversational subject  
7. Recent / previous subject  
8. Presented-set continuation (`what else`, `the other one`)  
9. Unresolved / ambiguous (preserved for FINAL:6.3)

Stage camera trail remains CC/Stage authority. Conversation thread is session-scoped references only (bound 8). `Go back` pops the conversation thread; CC:1 `navigate-back` still owns visual trail.

## Session

Lives on `ManagerObjectSession.conversationContinuity`. Cleared by `createEmptyManagerObjectSession` and `/executive?entrance=1&reset=1`. Not APP-4 durable memory.

# FINAL:6.3 — Smart Clarification & Correction

Identity: `NEX-MVP-FINAL:6.3/SmartClarificationCorrection`  
Version: `1.0.0`  
Namespace: `nexora.mvp.final63.smart-clarification-correction`

Clarification answers: what does the manager mean?  
Confirmation answers: does the manager authorize this action?

They are not the same gate.

## Pipeline

Manager turn → FINAL:6.1 `CanonicalManagerMeaning` → FINAL:6.2 `ContextualManagerMeaning` → FINAL:6.3 trust gate → existing CC / MO / EI / EXP.

## Precedence

1. Explicit new complete request (including commitment intents)  
2. Explicit correction  
3. Pending clarification answer  
4. FINAL:6.2 contextual meaning  
5. Clarification gate  
6. Existing authority  

## Session

`ManagerObjectSession.pendingClarification` is session-scoped. Cleared by empty/freeze session and `/executive?entrance=1&reset=1`. Not APP-4 durable memory. Not a second business-truth store.

# NEX-CONV:1 — Conversation Kernel contract

```
Manager Message
      ↓
Canonical Meaning (NCA)          — never replaced
      ↓
Resolved Subject (NCA/NXA/MO)    — never a second object registry
      ↓
Conversation Context
  Turn / Working threads / Durable (existing)
      ↓
Conversation Policy
  resolveConversationalMove({ meaning, subject, purpose, coverage, previousResult, capabilities })
      ↓
Conversational Move + coverage + reason
      ↓
Domain / Advisor / EI            — what can truthfully be said
Director / Stage                 — presentation if requested
      ↓
Action result → working continuity
      ↓
Composer                         — manager-facing language (no reason codes)
```

## Authority

| Responsibility | Canonical owner | NEX-CONV |
| --- | --- | --- |
| Manager meaning | NCA | consumes |
| Subject/reference | NCA/NXA/MO | consumes |
| Dialogue clarification | NCA | consumes pending clarification |
| Conversation progression | NEX-CONV | owns |
| Conversational Move | NEX-CONV | owns |
| Business semantics | MO/EI/domain | never replaces |
| Evidence truth | Data Reality/EI | never writes |
| Recommendation | Advisor/EI/NCA | never replaces |
| Stage presentation | Director/Stage | requests only |
| Decision | CC:10/10R | never writes |
| Execution | CC:11 | never writes |
| Outcome/Learning | existing owners | never writes |
| Durable manager memory | existing authorities | not created |

## Code

- `frontend/app/lib/nexora-conversation/nexoraConversationKernelContract.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationalMove.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationProgression.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationPolicy.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationWorkingContext.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationDiagnostics.ts`

Consumers: `nexoraObjectEducationExperience.ts` (IDENTIFY/WHY_PRESENT), `nexoraGuidedEntranceExperience.ts` (Appears/Capability/Focus Why).

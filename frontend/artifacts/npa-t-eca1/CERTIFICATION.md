# NPA-T ECA:1 — Working Conversation Context

Status: **NOT CERTIFIED**

## Implemented slice

- `ARCHITECTURE-INSPECTION.md` records existing NCA, NEX-CONV, Stage, Manager-Object, Director, Decision Theatre, Data Reality, domain lifecycle, memory, and confirmation authorities.
- `ecaWorkingConversationContext.ts` adds a deterministic immutable ECA read projection with explicit subject precedence, Stage separation, references, provenance, confidence, unknowns, pending questions, data-field context, bounded ambiguity, and unexecuted mutation proposals.
- CC:5 exposes the projection as `ecaWorkingContext`; it does not add a writer or durable store.
- Focused tests cover continuity, subject switching, Stage/conversation separation, ambiguity, knowledge intent, mutation confirmation gating, data context, and session scope.

## Evidence

- Focused ECA tests: **7 passed / 0 failed**.
- ECA-adjacent NCA, NEX-CONV, and Stage tests: **96 passed / 0 failed**.
- `npm run typecheck`: **passed**.
- Touched-file ESLint: **passed**.
- `NODE_OPTIONS=--max-old-space-size=8192 npm run build`: **passed**.

## Remaining certification gates

This is not a full ECA:1 certification. The complete requested NCA/NCA-POST, NXA conversation, Manager-Object, Director, BCA, DATA-ADV, Decision Theatre, Decision/Execution/Outcome, production runtime, refresh/session, and full funnel evidence has not been rerun as one certification package. The CC:5 integration currently composes from the canonical meaning and NCA state; an end-to-end production adapter for every optional domain/data authority remains to be certified.

Do not start ECA:2.
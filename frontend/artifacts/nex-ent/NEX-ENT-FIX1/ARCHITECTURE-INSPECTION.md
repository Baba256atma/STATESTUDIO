# NEX-ENT-FIX1 — Architecture inspection (before the composer change)

Inspection date: 2026-09-05.

FIX1 is conversation continuity over certified NEX-ENT:1–10. It must not reopen the curriculum, add a second Advisor/NLU, or own Stage/business truth.

## Observed loop (raw)

On `/executive?entrance=1`:

1. `What can Nexora do?` → fixed capability paragraph
2. `What can Nexora do?` → same paragraph
3. `Show me` → Stage intro
4. `What appears here?` → appears copy
5. `Show me how focus works` → Focus demonstration copy
6. `Explain first` → pre-demonstration offer copy (“I can show you that now”)
7. Repeat 5–6 forever

## Trace (owning modules)

| Turn | Canonical meaning | Lesson / continuity | Composer | Stage | Transition |
| --- | --- | --- | --- | --- | --- |
| What can Nexora do? | NCA `ASK_CAPABILITY` / HELP | `guidedIntroduction` intro; depth was unused | `nexoraGuidedEntranceExperience.ts` static `CAPABILITY_COPY` | none | none |
| repeat | same intent | same | same static copy | none | none |
| Show me | CONTINUE | Stage `INTRODUCING` | `CONTINUE_COPY` | orient + existing select | ENT:2 start |
| What appears here? | APPEARS (phrase) | Stage active | `APPEARS_COPY` | none | appearsDepth unused |
| Show me how focus works | FOCUS_DEMO (phrase) | `focusDemonstrated: true` | `FOCUS_DEMO_COPY` | `selectNexoraMVPInteractionSubject` on `obj-nexora-entrance` | FOCUS_DEMONSTRATED semantics |
| Explain first | FOCUS_EXPLAIN (phrase) | **ignored `focusDemonstrated`** | static `FOCUS_EXPLAIN_COPY` offering Show | none | AWAITING_FOCUS without using presented result |
| repeat Show / Explain | same intents | composer ignored presented Focus | same two templates | repeat select, no new actor | tutorial loop |

CC:5 `executeNexoraConversationalExperience` already owns the turn when `shouldNexoraGuidedEntranceOwnUtterance` is true and locks the presented response. NCA still interprets meaning. `guidedIntroduction.*` remains pacing.

## Root cause (actual)

Not a second engine. Not failed Stage presentation.

The educational composer treated **phrase → fixed template**:

1. Capability always returned the same paragraph (lesson events / depth unused).
2. `FOCUS_EXPLAIN` always used pre-demonstration copy, including “I can show you that now”, even after `stageEducation.focusDemonstrated`.
3. Suggested actions kept offering Show/Explain as if nothing had happened.
4. Locked educational copy could still be rewritten by FINAL:6.4 filler polish (`of course`) and by an unlocked NXA `LEARN_NEXORA` overlay on “how can you help”.

Repetition came from **static ENT templates + composer ignoring lesson events**, plus **stale lock/polish**, not from a transcript database gap.

## Authority (unchanged)

| Concern | Owner |
| --- | --- |
| Manager meaning | NCA `interpretCanonicalManagerMeaning` |
| Education pacing | `guidedIntroduction.*` |
| Educational response depth | `guidedIntroduction.conversationContinuity` (bounded lesson facts only) |
| Presentation | Director / Stage `selectNexoraMVPInteractionSubject` |
| Conversation execution | CC:5 orchestrator |
| Business writes | none on this path |

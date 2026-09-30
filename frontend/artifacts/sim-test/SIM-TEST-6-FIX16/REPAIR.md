# NPA-T SIM-TEST:6-FIX16 — Repair

## Files

| File | Change |
| --- | --- |
| `app/lib/manager-object/conversationContinuityResolver.ts` | `parseNamedHistoricalReturn` now accepts `(?:go )?back to X` as well as `go back to X` / `return to X`; the collection guard for "back to the problems" uses the same `(?:go )?back to`; `namedReturnNameTokens` treats `known` as a history qualifier, like `discussed` and `earlier`. |
| `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` | The `unknown` → `focus` promotion also accepts FINAL:6.2's `previous-referent` verdict: `isExplicitPresentationRequest(utterance, "focus") \|\| contextualManagerMeaning.continuityMove === "previous-referent"`. |
| `app/lib/sim-test/nexoraSimulationReferentFix16.test.ts` | New: 10 FIX16 tests. |
| `app/lib/sim-test/nexoraSimulationImpatientFix14.test.ts` | The measured Impatient S1 ledger no longer contains `16:JOURNEY/STALE_REFERENT`. |

## Authority repaired

- FIX11 named historical return (FINAL:6.2) is the only owner of "return to a named subject". It now recognizes the terse return form and a history qualifier it missed. There is no second parser or "Back to X" authority.
- The orchestrator's existing promotion from FINAL:6.1/6.2 to CC:1 `focus` consumes the FINAL:6.2 verdict instead of rechecking vocabulary. The runtime focus command, the canonical interaction subject and the Stage then follow through their existing path.
- `isExplicitPresentationRequest` is unchanged, because the SIM Observer also uses it (`nexoraSimulationJourneyObservation.ts`).

## Behavior change

- "Back to X", where X was visited, is a FINAL:6.2 `previous-referent` return (`CONTEXT_PREVIOUS_SUBJECT`). CC:1 becomes `focus`, and canonical, conversation, Advisor and Stage all move to X.
- "Go back to / Back to the known X issue" resolves the visited X instead of clarifying.
- "Back to <unknown>" (for example supplier) is a failed named return and clarifies. Before FIX16 it was a generic unsupported reply. It does not create a subject.
- The following are unchanged:
  - "Go back." / "Back." are still R2 `navigate-back` / `backtrack`.
  - "Back to the problems" is not a subject return.
  - For an unvisited but valid target, "Back to inventory." keeps the canonical subject and Stage where they are. That is the same as before FIX16; the conversation continuity/Advisor split on that turn is pre-existing and recorded as debt.

## Necessity (scratch differential on a pre-FIX16 copy)

| Variant | T14 canonical / Advisor / Stage | Impatient S1 |
| --- | --- | --- |
| Pre-FIX16 | Delivery / Capacity / Delivery | T16, T30, T31 |
| Parser extension only | Delivery / Capacity / Delivery | T16, T30, T31 |
| Promotion only | Delivery / Capacity / Delivery | T16, T30, T31 |
| Both (FIX16) | Capacity / Capacity / Capacity | T30, T31 |
| FIX16 without `known` | — | project-long gains `34:REPEATED_CLARIFICATION` |

## Generalization

The repair applies to any visited catalog subject, in any domain. It does not depend on the profile, the journey, the object IDs, Capacity/Delivery or the Observer finding type. An ambiguous named return stays unresolved and clarifies through FINAL:6.3. Promotion needs a resolved FINAL:6.2 referent, because `namedFocusName` is null when a `previous-referent` target is unresolved.

New authority: NO. Profile-specific: NO. Observer changed: NO.

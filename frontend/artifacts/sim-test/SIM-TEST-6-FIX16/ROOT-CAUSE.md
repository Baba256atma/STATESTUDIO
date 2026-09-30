# NPA-T SIM-TEST:6-FIX16 — Impatient T16 STALE_REFERENT root cause

## Baseline (before FIX16, signature `fnv1a32:3270d743`, S1=3: T16, T30, T31)

| Turn | Utterance | Canonical | Conversation (harness) | Advisor | Stage | Clarify | Decisions | Executions | Response (head) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T10 | Start it. | cc9:scenario:intervention:obj-capacity:v1 | same | obj-capacity | obj-capacity | no | 1 | 1 | Execution has started… |
| T11 | Done yet? | cc9:scenario:intervention:obj-capacity:v1 | same | obj-capacity | obj-capacity | no | 1 | 1 | I can help investigate that… |
| T12 | Delivery. | obj-delivery | obj-delivery | obj-delivery | obj-delivery | no | 1 | 1 | Focused on Delivery. |
| T13 | This. | obj-delivery | obj-delivery | obj-delivery | obj-delivery | no | 1 | 1 | Focused on Delivery. |
| **T14** | **Back to capacity.** | **obj-delivery** | obj-delivery | **obj-capacity** | **obj-delivery** | no | 1 | 1 | Returning to Capacity. We were checking… |
| T15 | Supplier issue. | obj-delivery | obj-delivery | — | obj-delivery | no | 1 | 1 | I couldn't find a clear match for "Supplier"… |
| **T16** | **Capacity again.** | **obj-delivery** | obj-delivery | obj-capacity | **obj-delivery** | no | 1 | 1 | I'm not sure how that relates… |
| T17 | Changed? | obj-delivery | obj-delivery | — | obj-delivery | no | 1 | 1 | I can help investigate that… |
| T18 | Source? | obj-delivery | obj-delivery | — | obj-delivery | no | 1 | 1 | I can help investigate that… |

Per-layer detail at T14 and T16 (RMS adapter, same sequence):

| Layer | T14 "Back to capacity." | T16 "Capacity again." |
| --- | --- | --- |
| CC:1 intent | `unknown`, no target hints | `unknown`, no target hints |
| FINAL:6.1 | FOCUS → `obj-capacity` | FOCUS → `obj-capacity` |
| FINAL:6.2 | `obj-capacity`, `EXPLICIT_CURRENT_TURN`, move `none` | `obj-capacity`, `EXPLICIT_CURRENT_TURN`, move `none` |
| FINAL:6.3 | proceed | proceed |
| Continuity `activeSubjectId` | `obj-capacity` | `obj-capacity` |
| Status | `unsupported` | `unsupported` |
| Canonical / manager-object active / Stage focus | `obj-delivery` | `obj-delivery` |
| NXA Advisor referent | `obj-capacity` | `obj-capacity` |

## T16 STALE_REFERENT, defined

- Expected: after "Capacity again." (RETURN_TO_SUBJECT, intended Capacity), the canonical subject, the conversation subject, the Advisor and the Stage are Capacity, and the reply addresses Capacity.
- Observed: canonical, conversation and Stage are Delivery. The Advisor is Capacity, and the reply is generic, so it does not address Capacity.
- Stale referent: `obj-delivery`, retained from T12.
- The Observer's rule was checked. The move is named, it has an intended subject, and there is no clarification. The reply does not mention Capacity, and the canonical families are disjoint from the intended one. The Observer is correct and was not changed.

## Identity timeline and first disagreement

- T10–T11: a scenario-intervention canonical subject (the recorded T10 debt). The Advisor and Stage are on Capacity.
- T12–T13: every layer is Delivery.
- **T14 is the first disagreement.** FINAL:6.2, continuity and the Advisor adopt Capacity. The canonical interaction subject, the manager-object active subject and the Stage keep Delivery. T14 is not flagged, only because the thread-return prose mentions Capacity.
- T16 repeats the same split. The reply no longer mentions Capacity, so the stale canonical subject becomes visible.

## Classification: B — canonical transition failure

The conversation layer resolved the correct target, but the canonical transition never happened. This is not a resolution failure (A): 6.1 and 6.2 find `obj-capacity`. It is not a projection failure (C): Stage faithfully projects the canonical subject, and the canonical subject is wrong. It is not state contamination (D): T12 cleanly resets every layer to Delivery.

## First owner that preserves the stale referent

1. **FINAL:6.2 named historical return (FIX11, `conversationContinuityResolver.ts` `parseNamedHistoricalReturn`).** It accepts "Go back to X", "Return to X", "Show me X again", "Open X we discussed" and "What about X". It does not accept the terse "Back to X". So "Back to capacity." is a plain mention (move `none`) rather than a `previous-referent` return.
2. **Orchestrator FOCUS promotion (`conversationalExperienceOrchestrator.ts`).** An `unknown` intent with a named FINAL:6.1 FOCUS is promoted to CC:1 `focus` only when `isExplicitPresentationRequest` recognizes the utterance as a presentation request. That predicate's prefix list has no "back to". CC:1 stays `unknown`, so no runtime focus command runs, and the canonical subject and Stage stay Delivery.

The control forms prove the seam. With the same state, "Go back to capacity." and "Return to capacity." are FINAL:6.2 `previous-referent` returns. They are promoted to `focus`, and canonical, Stage and Advisor all become Capacity.

## Relationship to T10

Independent. A minimal replay without T6–T11 ("Status." "Capacity. Details." "Delivery." "Back to capacity.") fails identically. At T12, "Delivery." correctly moves every layer off the T10 scenario subject.

## Relationship between T14 and T16

T16 is downstream of T14. With only the T14 root repaired, T14 makes Capacity canonical. "Capacity again." then targets the subject that is already authoritative, every layer stays Capacity, and T16 is no longer flagged. "X again" still reaches CC:1 as `unknown` on its own (Capacity → Delivery → "Capacity again." keeps Delivery). No SIM journey exercises that failure after the T14 repair, so it is recorded as debt rather than repaired (§26).

## Why normal journeys did not expose it

Normal and parity journeys return with "Go back to…", "Return to…" or "What about…", which the FIX11 parser and the promotion gate both recognize. Only the Impatient profile uses the terse "Back to capacity.".

## Related defect exposed by the repair (same owner)

Extending the parser to "back to X" made project-long T32 "Back to the known delivery issue." reach FIX11's named-return resolution. There it clarified ("Which one do you want me to show?"), and together with the existing T33 and T34 clarifications this tripped `34:JOURNEY/REPEATED_CLARIFICATION` (S1).

A pre-FIX16 scratch tree shows the same clarification and the same S1 for the existing FIX11 form "Go back to the known delivery issue.". The defect was therefore already present, only exposed by the repair. `candidateMatchesNamedReturn` requires every name token. `namedReturnNameTokens` strips history qualifiers ("discussed", "earlier", "started", "originally", …) but not "known". So `known` remained a required token, nothing matched, and the named target failed.

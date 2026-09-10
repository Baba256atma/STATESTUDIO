# MRA:3-FIX2 — Architecture Inspection

Date: 2026-09-09

No second reference resolver, continuity store, clarification store, Stage authority, collection authority, or mutation writer was added.

## Authorities reused

| Concern | Owner |
| --- | --- |
| Collection vs named-object SHOW | CC:1 `matchCollectionShows` + NCA-POST:2 `interpretExecutiveCollectionQuery` |
| Typed continuity / pronoun / weak lexical override | FINAL:6.2 `conversationContinuityResolver` + `updateConversationContinuity` |
| Clarification gate / pending compatibility | FINAL:6.3 `interpretClarificationTurn` + `evaluateClarificationGate` |
| Multi-match hint disambiguation | CC:2 `resolveHint` consuming presented / last-collection members |
| Fuzzy catalog recovery | NCA-POST:1 `resolveRegisteredReference` (token parts; same-distance stays ambiguous) |
| Mutation confirmation | Existing ECA mutation proposal (unchanged writer) |

## Dual interpretation that caused FIX1 L4 failures

`Show Risk.` matched the collection pattern `risks?` as `show-problems`. NLU still named the Risk object, but continuity `resolvedSubjectId` kept the previous Stage/object (Delivery). Pronouns then inherited Delivery. Collection membership was copied into `presentedIds`, so `that` was treated as unsafe/unresolved even when the only conversational subject was Risk.

## Knowledge vs navigation

Referent resolution does not choose the speech act. `look at X` remains FOCUS; `explain X` / deictic explain remains EXPLAIN. Continuity only supplies the referent.

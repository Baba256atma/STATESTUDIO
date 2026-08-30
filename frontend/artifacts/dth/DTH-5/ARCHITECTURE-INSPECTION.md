# DTH:5 Architecture inspection

## Smallest extension point

Reuse `projectNexoraDecisionTheatreFoundation` as the only Scene Intent / Scene Script attachment path.

Do **not** create a second NLU, conversation-intent engine, Director, Stage model, or executive truth store.

Canonical flow:

Manager turn → existing NLU / CC:1 / NCA-POST / NXA / MO journey (already resolved) → DIR:1 Stage apply → Theatre projection → DTH:5 Scene Intent (visual purpose) → DTH:5 Scene Script (renderer-neutral composition instructions) → Advisor-readable summary.

Phrase fixtures may exercise the upstream path. DTH:5 consumes structured `NexoraDecisionTheatreSceneSemanticInput` only.

## Canonical inputs Scene Intent may consume

| Input | Authority | Role |
|---|---|---|
| Conversation intent kind | CC:1 | Already-resolved request class |
| Canonical manager meaning | FINAL:6.1 | Operation, communicative intent, question type, ambiguity |
| Semantic scope / primary owner / references / collection members | NCA-POST:3 | Collection and knowledge vs workspace vs business |
| Comparison members and criterion | NCA-POST:4 | Comparable set; unspecified “important” stays ambiguous |
| Pending clarification / correction | FINAL:6.3 | One clarification; explicit correction is not hijacked |
| Observation vs scenario | NXA-5 FIX5 | Observation does not become consequence/Scenario |
| Stage meta / orientation | NXA-5 FIX4 | What is on Stage vs mutation |
| Journey phase/state | MO:5 / NEX-EXP | Lifecycle context only |
| Stage snapshot | NEX-MVP:4 | Focus, collection, visible IDs |
| Director plan | DIR:1 | Presentation effect already applied |
| Theatre participants | DTH:1–2 | Executive actors and owner-attached Iconics |
| Visual grammar | DTH:3 | Referenced, not redefined |
| Atmosphere | DTH:4 | Referenced, never selected by Scene Intent |

Do not re-parse raw manager text inside the Scene Intent resolver.

## Semantic separation preserved

Conversation Intent ≠ Canonical Semantic Result ≠ Journey State ≠ Scene Intent ≠ Scene Script ≠ NexoGraph ≠ Atmosphere ≠ Renderer ≠ Advisor.

## Live policy

Shell continues to project Theatre from Stage. Conversation attaches resolved semantic input through the existing orchestrator. Atmosphere remains DTH:4-only. No Card, Chart, NexoSelect, NexoCompare, or NexoTime UI.

DTH:6 is not started.

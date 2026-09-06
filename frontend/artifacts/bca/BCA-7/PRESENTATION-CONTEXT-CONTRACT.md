# BCA:7 presentation-context contract

Identity: `BCA:7/ContextAwarePresentation`.

Resolver: `resolveBusinessProjectPresentationContext` — pure, frozen.

## BCA:6 → BCA:7 handoff

If `clarificationNeeded`, the manager-facing payload uses BCA:6 `clarificationQuestionIntent` for situation/clarification turns. NCA still owns wording (`ncaOwnsWording: true`). BCA does not write.

## Presentation ≠ truth

`presentationOnly: true`. Underlying `underlyingEvidenceFingerprint` is role-independent.

## Handoffs

- **Advisor:** emphasis meanings, process areas, qualified relationships, explanation text, optional clarification intent.
- **Director:** relevant ids; `mutatesStageMembership/Focus/Collections: false`.
- **Stage:** `objectsAdded: []`, `focusMutatedTo: null`.
- **Theatre:** relevance flags; size/color/causal/process-map/scoring/commit/start all rejected.

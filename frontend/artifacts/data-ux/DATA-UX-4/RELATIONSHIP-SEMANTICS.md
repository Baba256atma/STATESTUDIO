# DATA-UX:4 Relationship Semantics

Date: 2026-08-31

## Authority

Relationships are projected from Executive Source Intelligence `affectedObjects` that already have a `stageObjectId`. They are not inferred from filename, proximity, or visual convenience.

Canonical semantic: `supplies-data-to`

Support state: `established` only when the affected-object mapping exists.

`impliesCausality` is always `false`. Visual claim ledger records:

- line means mapped data support
- must not infer causality, business importance, or data quality

## Rendering

Reuse DTH:3 `resolveNexoraDecisionTheatreRelationshipVisual` and the existing Stage connection renderer.

Smallest compatible extension: optional `linePattern: "dashed"` on `NexoraMVPStageConnectionPresentation`. Dashed context lines are association, not cause. Direction is `source-to-target` (data supplies the object). Weight stays neutral. No independent Data Object edge language.

A relationship whose target is not in the current executive scene does not render.

## What Advisor may say

“This source supplies mapped data to {object}. That is provenance, not evidence that the source caused any business condition.”

Unrelated sources are not connected.

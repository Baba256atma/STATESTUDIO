# NPA-T NMI:6 — Attention → Stage

Attention items remain STAGE-PROD:1 Queue object IDs (NMI:5).

Selecting an Attention subject:

1. Preserve canonical ID.
2. Compose `NmiStageProjection` with `source: ATTENTION`.
3. Hand off through `selectNexoraMVPInteractionSubject`.

Queue category selection, collection disclosure, CENTER placement, back/forward, escape, and counts are unchanged.

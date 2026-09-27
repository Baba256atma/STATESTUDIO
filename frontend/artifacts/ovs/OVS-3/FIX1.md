# NPA-T OVS:3-FIX1 — blocked handoff

## liveStageWiring: false

**A + B, not C for Theatre composition; C for Nexo family.**

Certified DTH-EXP projectors (`projectDthExpSpatialLayout`, `orchestrateDthExpTheatreSceneResponse`) set `liveStageWiring: false` by design: they project spatial records and do not attach to Stage. That was deferred live integration (A), plus the missing adapter (B).

Live DTH **does** expose composition: `projectNexoraDecisionTheatreFoundation` → scene intent, visible Objects, relationships, STAGE-PROD:3.

Live DTH **does not** expose the Nexo/family input DTH-EXP:5A requires:

- Shell does not call DTH-EXP:7B and does not pass a DIR:1 `NexoraDirectorPlan` into Theatre.
- Focused Stage objects resolve DTH:5 **REVIEW_FOCAL_OBJECT**.
- Overview resolves **ORIENT_TO_STAGE**.
- DTH-EXP:4A `deriveNeed` does not map those kinds (only INVESTIGATE_CONDITION, REVIEW_EXECUTION, REVIEW_OUTCOME, COMPARE_CANDIDATES + comparisonKind, and some DIR collection/relationship intents).
- Result: `selectedFamily === null` / `UNSPECIFIED`.

Inventing `if Risk → NexoRisk` or defaulting overview to NexoFlow in Shell/Stage/OVS is forbidden.

## Missing upstream value

`DthExpNexoRecipeFamily` (via already-interpreted `managementNeed` or a DTH:5 kind 4A already understands).

## Owner

1. **DTH-EXP:4A** — consume live DTH:5 `REVIEW_FOCAL_OBJECT` / `ORIENT_TO_STAGE` only if product-intended, without a second selector.
2. **CC:5 / DTH-EXP:7A–7B** — retain `orchestrateDthExpTheatreSceneResponse().spatial` when a management need is already interpreted.
3. Then a thin Stage prop pass: `response.spatial` → `dthExpSpatial`.

## Not implemented

No production adapter. No parallel Nexo selector. No fake spatial.

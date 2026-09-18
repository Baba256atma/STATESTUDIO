# NPA-T NMI:8 — Stage Live Wiring

Map node click:

1. `composeNmiStageProjection` with `selectedCanonicalId`
2. existing `onSelectSubject(projection.projectionAnchorId)` → `selectNexoraMVPInteractionSubject`

Invariant: `selectedCanonicalId === projectionAnchorId`.

Related Scenarios cannot steal the Capacity Gap anchor.

Attention Queue category clicks remain collection disclosure. Attention item Stage handoff is proven via NMI:6 `source: ATTENTION` using Queue object IDs.

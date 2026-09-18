# NPA-T NMI:6 — Projection contract

`NmiStageProjection` is a **context bundle**, not Stage state.

Minimum fields:

- `projectionId`
- `selectedCanonicalId` / `selectedNodeKind`
- `projectionAnchorId` (must equal selected ID)
- `managementContext`
- `mapNodeRefs` (relevance-tiered)
- `relationshipRefs`
- `decisionRoadmapRef`
- `evidenceRefs` / `provenanceRefs`
- `unresolvedRelationshipIds` / `relationshipGaps`
- `suggestedManagementFocus` (the anchor ID)
- `omittedNodeIds` / `omittedCount`
- `projectionProvenance`

Identity: `NPA-T NMI:6/ManagementContextStageProjection`.

Presentation authority recorded as `DIRECTOR-1:1/DirectorFoundation`.
Stage writer recorded as `selectNexoraMVPInteractionSubject`.

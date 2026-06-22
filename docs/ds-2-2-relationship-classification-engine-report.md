# DS-2:2 Relationship Classification Engine Report

## Status

PASS — DS-2:2 relationship classification is implemented as a classification-only layer.

Required tags:

- [DS22_RELATIONSHIP_CLASSIFICATION]
- [RELATIONSHIP_CATEGORY_ENGINE]
- [RELATIONSHIP_STRENGTH_ENGINE]
- [RELATIONSHIP_CLASSIFICATION_PERSISTED]
- [DS23_READY]
- [DS_2_2_COMPLETE]

## Implementation

Created `frontend/app/lib/workspace/workspaceRelationshipClassificationContract.ts`.

The contract classifies DS-2:1 candidate relationships through:

- `classifyCandidateRelationships(workspaceId)`
- `getRelationshipClassifications(workspaceId)`
- `getRelationshipClassification(workspaceId, candidateRelationshipId)`

Classification records include:

- `candidateRelationshipId`
- `workspaceId`
- `relationshipType`
- `relationshipCategory`
- `relationshipStrength`
- `direction`
- `confidence`
- `classificationReason`
- `classifiedAt`
- `source`

Default source is `ds-2:2-classification`.

## Input Boundary

DS-2:2 reads only:

`getCandidateRelationships(workspaceId)`

It does not re-run relationship discovery, inspect raw CSV, re-run schema discovery, or re-run candidate object discovery.

## Category Rules

Relationship type validation accepts only:

- `owns`
- `contains`
- `belongs_to`
- `supplies`
- `purchases`
- `depends_on`
- `reports_to`
- `assigned_to`
- `managed_by`
- `related_to`
- `unknown`

Invalid relationship types normalize to `unknown`.

Category mapping:

- `supplies`, `purchases` -> Business Flow
- `owns`, `contains` -> Ownership
- `belongs_to`, `reports_to`, `assigned_to` -> Organization
- `depends_on` -> Dependency
- `managed_by` -> Governance
- `related_to`, `unknown` -> Unknown

## Strength Rules

Strength is calculated from candidate confidence:

- `0.00-0.39` -> weak
- `0.40-0.69` -> medium
- `0.70-0.89` -> strong
- `0.90-1.00` -> critical

Confidence is preserved on the classification record.

## Persistence And Isolation

Relationship classifications persist under:

`workspaceId -> relationshipClassifications`

Workspace isolation is preserved by reading candidates only from the requested workspace and writing only that workspace's classification map.

## Safety

DS-2:2 does not create relationships and does not touch scene/runtime systems.

No changes were made to:

- scene relationship rendering
- `RelationshipLine`
- `RelationshipRenderer`
- `runtimeObjectPosition`
- `sceneRenderUtils`
- object click pipeline
- selection pipeline
- dashboard routing
- assistant runtime
- MRP writes
- scene JSON synchronization
- topology

Diagnostics use the required prefix:

`[NexoraRelationshipClassification]`

Diagnostic payload includes:

- `workspaceId`
- `candidateRelationshipId`
- `relationshipType`
- `category`
- `strength`
- `confidence`

## Tests

Added `frontend/app/lib/workspace/workspaceRelationshipClassificationContract.test.ts`.

Coverage:

- Supplier -> Product -> Business Flow, strong
- Customer -> Product -> Business Flow, strong
- Employee -> Department -> Organization, strong
- Project -> Department -> Governance, medium/strong
- invalid relationship type normalization to `unknown`
- Unknown category with weak strength
- strength boundary calculation
- confidence preservation
- persisted classification lookup
- workspace isolation
- no relationship creation
- no scene node or scene sync mutation

Verification:

- `NEXT_PUBLIC_NEXORA_DIAGNOSTICS=false node --test app/lib/workspace/workspaceRelationshipCandidateContract.test.ts app/lib/workspace/workspaceRelationshipClassificationContract.test.ts`
- `npm run build`

Both passed.

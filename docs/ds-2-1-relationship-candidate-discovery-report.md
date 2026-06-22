# DS-2:1 Relationship Candidate Discovery Report

## Status

PASS — DS-2:1 relationship candidate discovery is implemented as a discovery-only layer.

Required tags:

- [DS21_RELATIONSHIP_DISCOVERY]
- [RELATIONSHIP_CANDIDATES_READY]
- [RELATIONSHIP_DIRECTION_ENGINE]
- [RELATIONSHIP_DISCOVERY_PERSISTED]
- [DS22_READY]
- [DS_2_1_COMPLETE]

## Implementation

Created `frontend/app/lib/workspace/workspaceRelationshipCandidateContract.ts`.

The contract discovers candidate relationships from existing DS-1 workspace objects via:

- `discoverCandidateRelationships(workspaceId)`
- `getCandidateRelationships(workspaceId)`
- `getCandidateRelationship(workspaceId, candidateRelationshipId)`

Candidate records include:

- `candidateRelationshipId`
- `workspaceId`
- `sourceObjectId`
- `targetObjectId`
- `relationshipType`
- `confidence`
- `reason`
- `direction`
- `discoveredAt`
- `status`

Default status is `suggested`.

## Discovery Rules

Discovery is deterministic only. No LLM calls, raw CSV inspection, schema rediscovery, or classification reruns are used by the DS-2:1 engine.

Inputs are limited to `getWorkspaceCreatedObjects(workspaceId)` and DS-1 lineage fields already present on created objects:

- `originCandidateId`
- `sourceColumns`
- `dataSourceId`

Implemented directional rules include:

- Customer -> Product: `purchases`
- Supplier -> Product: `supplies`
- Employee -> Department: `belongs_to`
- Project -> Department: `managed_by`
- Employee -> Project: `assigned_to`
- Employee -> Manager: `reports_to`

Unknown deterministic combinations fall back to `related_to` when source dataset context is shared, otherwise `unknown`.

## Confidence

Confidence is calculated in the `0.0` to `1.0` range using:

- deterministic rule strength
- shared source dataset context
- identifier/name source column quality
- DS-1 origin lineage presence
- source column family overlap
- object naming/type match strength

The named acceptance examples meet the requested thresholds:

- Customer -> Product `purchases`: `0.75+`
- Supplier -> Product `supplies`: `0.80+`
- Employee -> Department `belongs_to`: `0.85+`
- Project -> Department `managed_by`: `0.70+`

## Persistence And Isolation

Candidate relationships persist under:

`workspaceId -> candidateRelationships`

Workspace isolation is preserved by reading only objects from the requested workspace and writing only that workspace's candidate map. Tests confirm Workspace B receives no candidates when discovery runs for Workspace A.

## Safety

DS-2:1 does not create relationships and does not touch scene/runtime systems.

No changes were made to:

- scene relationship rendering
- `RelationshipLine`
- `RelationshipRenderer`
- `runtimeObjectPosition`
- object click pipeline
- dashboard routing
- assistant runtime
- MRP writes
- scene JSON synchronization
- topology

Diagnostics use the required prefix:

`[NexoraRelationshipDiscovery]`

Diagnostic payload includes:

- `workspaceId`
- `sourceObjectId`
- `targetObjectId`
- `relationshipType`
- `confidence`
- `candidateRelationshipId`

## Tests

Added `frontend/app/lib/workspace/workspaceRelationshipCandidateContract.test.ts`.

Coverage:

- Customer + Product -> `purchases`
- Supplier + Product -> `supplies`
- Employee + Department -> `belongs_to`
- Project + Department -> `managed_by`
- multiple relationship discovery
- unknown fallback to `related_to` / `unknown`
- workspace isolation
- confidence scoring thresholds
- persisted candidate lookup
- no relationship creation
- no scene node or scene sync mutation

Verification:

- `NEXT_PUBLIC_NEXORA_DIAGNOSTICS=false node --test app/lib/workspace/workspaceRelationshipCandidateContract.test.ts`
- `npm run build`

Both passed.

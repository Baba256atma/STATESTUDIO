# DS-2:3 Relationship Approval Panel Report

## Status

PASS — DS-2:3 relationship approval is implemented as an approval-only layer.

Required tags:

- [DS23_RELATIONSHIP_APPROVAL]
- [RELATIONSHIP_REVIEW_WORKFLOW]
- [RELATIONSHIP_APPROVAL_PERSISTED]
- [DS24_READY]
- [DS_2_3_COMPLETE]

## Implementation

Created `frontend/app/lib/workspace/workspaceRelationshipApprovalContract.ts`.

The contract consumes only DS-2:2 relationship classifications via:

`getRelationshipClassifications(workspaceId)`

Approval APIs:

- `approveRelationshipCandidate(workspaceId, candidateRelationshipId)`
- `rejectRelationshipCandidate(workspaceId, candidateRelationshipId)`
- `renameRelationshipType(workspaceId, candidateRelationshipId, relationshipType)`
- `getApprovedRelationships(workspaceId)`
- `getRelationshipApprovalState(workspaceId)`

Approval records include:

- `candidateRelationshipId`
- `workspaceId`
- `relationshipType`
- `relationshipCategory`
- `relationshipStrength`
- `confidence`
- `approvalStatus`
- `approvalReason`
- `approvedAt`
- `updatedAt`

Default status is `suggested`.

## Approval Panel

Created `frontend/app/components/main-right-panel/workspace/operational/WorkspaceRelationshipApprovalPanel.tsx`.

Panel title:

`Relationship Approval Panel`

Flow indicator:

`DS-2 Discovery -> Relationship Approval`

The panel displays relationship candidates with:

- Source Object
- Relationship Type
- Target Object
- Category
- Strength
- Confidence
- Reason
- Status
- Approve / Reject / Rename actions

Filters:

- All / Suggested / Approved / Rejected
- Category
- Strength

The panel is mounted in the operational sources workspace beside the DS data source and object approval panels.

## Manager Actions

Supported actions:

- Approve
- Reject
- Rename Type

Rename only updates relationship metadata. It does not mutate source objects, target objects, scene objects, topology, or created relationships.

Examples supported:

- `supplies` -> `vendor_supplies`
- `managed_by` -> `owned_by`
- `related_to` -> `depends_on`

## Persistence And Isolation

Relationship approvals persist under:

`workspaceId -> relationshipApprovals`

Workspace isolation is preserved by reading classifications only for the requested workspace and writing approvals only to that workspace's approval map.

## Safety

DS-2:3 does not create relationships and does not touch scene/runtime systems.

No changes were made to:

- scene relationship rendering
- `RelationshipLine`
- `RelationshipRenderer`
- `runtimeObjectPosition`
- object positions
- object click pipeline
- selection pipeline
- dashboard routing
- assistant runtime
- MRP writes
- scene JSON synchronization
- topology

Diagnostics use the required prefix:

`[NexoraRelationshipApproval]`

Diagnostic payload includes:

- `workspaceId`
- `candidateRelationshipId`
- `action`
- `approved`
- `rejected`
- `renamed`
- `relationshipType`

## Tests

Added `frontend/app/lib/workspace/workspaceRelationshipApprovalContract.test.ts`.

Coverage:

- Approve Supplier -> Product
- Reject Customer -> Product
- Rename `managed_by` -> `owned_by`
- multiple approvals
- mixed approval states
- persistence after reload
- workspace isolation
- filter approved
- filter rejected
- category and strength filters
- no relationship creation
- no scene node or scene sync mutation

Verification:

- `NEXT_PUBLIC_NEXORA_DIAGNOSTICS=false node --test app/lib/workspace/workspaceRelationshipCandidateContract.test.ts app/lib/workspace/workspaceRelationshipClassificationContract.test.ts app/lib/workspace/workspaceRelationshipApprovalContract.test.ts`
- `npm run build`

Both passed.

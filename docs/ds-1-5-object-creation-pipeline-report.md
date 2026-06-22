# DS-1:5 — Object Creation Pipeline Report

Freeze Tags: `[DS15_OBJECT_CREATION]`, `[WORKSPACE_OBJECTS_CREATED]`, `[APPROVED_CANDIDATES_CONSUMED]`, `[OBJECT_TRACEABILITY_ENABLED]`, `[DS16_READY]`, `[DS_1_5_COMPLETE]`

Diagnostic Prefix: `[NexoraObjectCreation]`

Prerequisites: DS-1:1 Schema Discovery = PASS, DS-1:2 Column Classification Engine = PASS, DS-1:3 Candidate Object Discovery = PASS, DS-1:4 Object Approval Panel = PASS

## Objective

Transform approved candidate objects into real workspace objects. This is the first phase that creates actual Nexora objects. Creation is explicit only — no automatic, background, or post-approval auto-trigger.

## Flow

```
Candidate Objects
       ↓
Approved Candidates
       ↓
Create Selected Objects
       ↓
Workspace Objects
```

## Input

Object creation reads **only** from DS-1:4:

```typescript
getApprovedCandidates(workspaceId, dataSourceId)
```

No rediscovery. No CSV, schema, or classification inspection. Rejected and suggested candidates are ignored.

## Modules

| Module | Responsibility |
|--------|----------------|
| `workspaceObjectCreationContract.ts` | DS-1:5 contract, created object fields, tags |
| `workspaceObjectCreationPipeline.ts` | Registry, creation from approved candidates, persistence, APIs |
| `workspaceObjectCreationLegacyBridge.ts` | Legacy pipeline object bridge for facade and context resolver |
| `objectCreationPipeline.ts` | Thin facade for downstream compatibility |
| `objectApprovalPanelRuntime.ts` | Explicit `createSelectedApprovedObjects` entry point |

## Created Object Contract

Each workspace object stores:

- `objectId` (stable, e.g. `obj_customer`)
- `workspaceId`
- `dataSourceId`
- `objectName`
- `objectType`
- `primaryIdentifier`
- `sourceColumns`
- `originCandidateId`
- `createdAt` / `updatedAt`
- `creationSource` (`ds-1-approved-candidate`)

Persistence map:

```
workspaceId → objectId → createdObject
```

Storage key: `nexora.workspaceCreatedObjects.v2`

## APIs

| API | Purpose |
|-----|---------|
| `createWorkspaceObjectsFromApprovedCandidates(workspaceId, dataSourceId)` | Create objects from approved candidates for one data source |
| `createWorkspaceObjectsFromAllApprovedCandidates(workspaceId)` | Batch create across all data sources (panel entry) |
| `getWorkspaceCreatedObjects(workspaceId)` | List created workspace objects |
| `getWorkspaceCreatedObject(workspaceId, objectId)` | Read one created object |
| `createSelectedApprovedObjects(workspaceId)` | Explicit UI action — approved only |

## Object Identity Rules

Stable IDs derived from object name:

| Object | objectId |
|--------|----------|
| Customer | `obj_customer` |
| Supplier | `obj_supplier` |
| Employee | `obj_employee` |
| Project | `obj_project` |
| Product | `obj_product` |

Duplicate creation is blocked. If an object or candidate already exists, creation is skipped and a diagnostic is emitted with action `duplicate`.

## Traceability

Candidate records are preserved. Each workspace object stores `originCandidateId` linking back to the DS-1:3 candidate.

## Safety Rules

DS-1:5 does **not**:

- create scene nodes
- create topology or relationships
- create KPIs, risks, or dashboard cards
- create assistant memory
- modify `sceneJson`, object positions, or layouts

Scene creation belongs to DS-1:6 and is invoked separately via `syncWorkspacePipelineObjectsToScene`.

## Workspace Isolation

Created objects are scoped by `workspaceId`. Workspace A objects never appear in Workspace B. Access is guarded via `guardWorkspaceDataSourceAccess`.

## Diagnostics

Prefix: `[NexoraObjectCreation]`

Logged fields:

- `workspaceId`
- `dataSourceId`
- `candidateId`
- `objectId`
- `objectName`
- `action` (`created` | `skipped` | `duplicate`)

## Tests

| Test | Result |
|------|--------|
| Create Customer | 1 object |
| Create Supplier | 1 object |
| Multiple approved candidates | Multiple objects |
| Rejected candidate | 0 objects |
| Suggested candidate | 0 objects |
| Duplicate create attempt | Skip |
| Workspace isolation | No leakage |
| Traceability | `originCandidateId` preserved |
| No scene writes | 0 scene objects |

Test files:

- `workspaceObjectCreationPipeline.test.ts`
- `objectCreationPipeline.test.ts`
- `objectApprovalPanelRuntime.test.ts`

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Approved candidates create workspace objects | PASS |
| Rejected candidates ignored | PASS |
| Suggested candidates ignored | PASS |
| Duplicate creation blocked | PASS |
| Workspace isolation preserved | PASS |
| Traceability preserved | PASS |
| No scene nodes created | PASS |
| No topology created | PASS |
| No relationships created | PASS |
| Build passes | PASS |

## Required Tags

- `[DS15_OBJECT_CREATION]`
- `[WORKSPACE_OBJECTS_CREATED]`
- `[APPROVED_CANDIDATES_CONSUMED]`
- `[OBJECT_TRACEABILITY_ENABLED]`
- `[DS16_READY]`
- `[DS_1_5_COMPLETE]`

## Next Phase

DS-1:6 — Scene sync from workspace objects via explicit `syncWorkspacePipelineObjectsToScene`.

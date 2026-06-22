# DS-1:4 — Object Approval Panel Report

Freeze Tags: `[DS14_OBJECT_APPROVAL]`, `[OBJECT_REVIEW_WORKFLOW]`, `[APPROVAL_PERSISTENCE_READY]`, `[DS15_READY]`, `[DS_1_4_COMPLETE]`

Diagnostic Prefix: `[NexoraObjectApproval]`

Prerequisites: DS-1:1 Schema Discovery = PASS, DS-1:2 Column Classification Engine = PASS, DS-1:3 Candidate Object Discovery = PASS

## Objective

Introduce the first approval workflow so users can review candidate objects before creation. Discovery and creation remain separated. No workspace objects, scene nodes, topology, relationships, or KPIs are created in this phase.

## Workflow

```
Candidate Objects
       ↓
    Review
       ↓
Approve / Reject / Rename
       ↓
Ready for DS-1:5
```

## Input

Approval reads **only** from DS-1:3:

```typescript
getCandidateObjects(workspaceId, dataSourceId)
```

No rediscovery. No CSV inspection. No DS-1:3 bypass.

## Modules

| Module | Responsibility |
|--------|----------------|
| `workspaceObjectApprovalContract.ts` | DS-1:4 contract, approval statuses, tags |
| `workspaceObjectApprovalRuntime.ts` | Sync from candidates, persistence, approve/reject/rename APIs |
| `workspaceObjectApprovalLegacyBridge.ts` | Legacy record bridge for panel facade and DS-1:5 pipeline |
| `objectApprovalPanelRuntime.ts` | Panel snapshot, selection, legacy facade |
| `objectApprovalContract.ts` | Legacy contract re-exports |
| `WorkspaceObjectApprovalPanel.tsx` | Object Approval Panel UI |

## Approval State Contract

Storage map:

```
workspaceId → dataSourceId → candidateId → approvalState
```

Each approval state stores:

- `candidateId`
- `objectName` (supports rename)
- `originalObjectName`
- `status` (`suggested` | `approved` | `rejected`, default `suggested`)
- `confidence` (numeric)
- `primaryIdentifier`
- `sourceColumns`
- `sourceColumnCount`
- `reason`
- `createdAt` / `updatedAt`

Persistence key: `nexora.workspaceObjectApprovals.v2`

## APIs

| API | Purpose |
|-----|---------|
| `approveCandidateObject(workspaceId, dataSourceId, candidateId)` | Mark candidate approved |
| `rejectCandidateObject(workspaceId, dataSourceId, candidateId)` | Mark candidate rejected |
| `renameCandidateObject(workspaceId, dataSourceId, candidateId, newName)` | Rename candidate before approval |
| `getApprovedCandidates(workspaceId, dataSourceId?)` | List approved candidates |
| `getCandidateApprovalStates(workspaceId, dataSourceId)` | List synced approval states |
| `syncApprovalStatesForWorkspace(workspaceId)` | Sync approval rows from candidates |

## UI Placement

**Object Approval Panel** in Workspace Flow:

```
DS-1 Discovery
       ↓
Object Approval
```

The panel appears after successful candidate discovery and is reachable from the Data Source Panel and Workspace Hub (`dashboardContext === "sources"`).

### Object Card

Each selected candidate displays:

- Object Name
- Confidence (numeric, e.g. `0.92`)
- Primary Identifier
- Source Columns Count
- Reason
- Status

### Actions

| Action | Behavior |
|--------|----------|
| Approve | Status → `approved` |
| Reject | Status → `rejected` |
| Rename | Updates `objectName`, preserves `originalObjectName` |
| Merge | Future placeholder only (disabled) |

## Safety Rules

DS-1:4 does **not**:

- create workspace objects
- create scene nodes
- create topology or relationships
- create KPIs
- modify `sceneJson`
- trigger DS-1:5 automatically

`createSelectedApprovedObjects` remains an explicit, manual DS-1:5 entry point and is not invoked by approval actions.

## Workspace Isolation

Approval state is scoped by `workspaceId`. Workspace A approvals never affect Workspace B. Access is guarded via `guardWorkspaceDataSourceAccess` and `resolveWorkspaceDataSource`.

## Diagnostics

Prefix: `[NexoraObjectApproval]`

Logged fields:

- `workspaceId`
- `dataSourceId`
- `candidateId`
- `action`
- `oldStatus`
- `newStatus`

## Tests

| Test | Result |
|------|--------|
| Approve Customer | Status → `approved` |
| Reject Supplier | Status → `rejected` |
| Rename Product → Inventory Item | Persisted rename |
| Multiple approvals | Independent approved list |
| Workspace isolation | Cross-workspace state unaffected |
| Reload persistence | localStorage v2 reload |
| Approval only | No workspace objects or scene writes |

Test files:

- `workspaceObjectApprovalRuntime.test.ts`
- `objectApprovalPanelRuntime.test.ts`

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Candidate objects displayed | PASS |
| Approve works | PASS |
| Reject works | PASS |
| Rename works | PASS |
| Persistence works | PASS |
| Workspace isolation works | PASS |
| No objects created | PASS |
| No scene writes | PASS |
| No topology writes | PASS |
| Build passes | PASS |

## Required Tags

- `[DS14_OBJECT_APPROVAL]`
- `[OBJECT_REVIEW_WORKFLOW]`
- `[APPROVAL_PERSISTENCE_READY]`
- `[DS15_READY]`
- `[DS_1_4_COMPLETE]`

## Next Phase

DS-1:5 — Object Creation from approved candidates. Approval persistence is ready via `getApprovedCandidates()`.

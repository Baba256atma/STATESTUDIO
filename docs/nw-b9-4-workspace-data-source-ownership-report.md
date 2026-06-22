# NW-B:9-4 Workspace Data Source Ownership Report

Required tags:

[NWB94]
[DATA_SOURCE_OWNERSHIP]
[WORKSPACE_DATA_ISOLATION]

## Summary

NW-B:9-4 guarantees complete workspace isolation for data sources. Every data source carries a `workspaceId`, and ownership is validated before read, update, delete, bind, and import operations.

## Implementation

| Layer | Path |
|---|---|
| Ownership contract | `frontend/app/lib/workspace/workspaceDataSourceOwnershipContract.ts` |
| Isolation guard | `frontend/app/lib/workspace/workspaceDataSourceIsolationGuard.ts` |
| Resolver | `frontend/app/lib/workspace/workspaceDataSourceResolver.ts` |
| Registry enforcement | `frontend/app/lib/workspace/workspaceDataSourceRegistry.ts` |

## Ownership Contract

Every workspace data source must include:

- `workspaceId`
- `dataSourceId`

Supported guarded actions:

- `read` — workspace list scope allowed without a specific `dataSourceId`
- `update`
- `delete`
- `bind`
- `import` — workspace import scope allowed before a record exists; post-register ownership verified on the created record

## Isolation Behavior

```text
Workspace A → inventory.csv
Workspace B → sales.csv

Switch workspace
  ↓
Resolver returns only that workspace's sources
  ↓
Cross-workspace read/update/delete/bind/import denied safely
```

Cross-workspace access returns `null` or `{ success: false }` with reason `cross_workspace_access_denied`. No data leaks across workspace boundaries.

## Integration Points

- `workspaceContextResolver.getWorkspaceDataSources()` uses `resolveWorkspaceDataSources()`
- CSV upload imports through `importWorkspaceDataSource()`
- Data source panel remove/refresh uses owned resolver mutations
- Registry read/update/delete/import paths invoke the isolation guard

## Diagnostics

Development-only diagnostics:

- `[DataSourceOwnership] Ownership Verified`
- `[DataSourceOwnership] Access Denied`
- `[DataSourceOwnership] Isolation Guard Triggered`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceDataSourceOwnership.test.ts
node --test app/lib/workspace/workspaceDataSourcePanelRuntime.test.ts
node --test app/lib/workspace/workspaceCsvUploadRuntime.test.ts
npm run build
```

## Acceptance Status

PASS:

- Ownership enforced
- Isolation enforced
- Switching safe
- Build passes

## Scope Notes

This phase enforces ownership and isolation across existing NW-B:9 data source foundations. Future DS engines should consume data only through `workspaceDataSourceResolver.ts`.

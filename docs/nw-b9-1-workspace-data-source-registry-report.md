# NW-B:9-1 Workspace Data Source Registry Report

Required tags:

[NWB91]
[WORKSPACE_DATASOURCE_REGISTRY]
[WORKSPACE_DATA_FOUNDATION]

## Summary

NW-B:9-1 introduces the canonical workspace-scoped data source registry. Each workspace owns its own data sources, and workspace switching resolves the active data source context independently per workspace.

## Implementation

### Registry

- `frontend/app/lib/workspace/workspaceDataSourceRegistry.ts`

### Context integration

- `frontend/app/lib/workspace/workspaceContextResolver.ts` now resolves owned data sources from the workspace registry via `getWorkspaceDataSources()`.

### Data source contract

| Field | Values |
|---|---|
| `dataSourceId` | Stable workspace-scoped identifier |
| `workspaceId` | Owning workspace |
| `name` | Display name |
| `type` | `csv`, `excel`, `api`, `database` |
| `status` | `empty`, `connected`, `processing`, `error` |
| `createdAt` | ISO timestamp |
| `updatedAt` | ISO timestamp |

## Ownership Rules

- Workspace A cannot read Workspace B data sources through registry lookups.
- `listWorkspaceDataSources(workspaceId)` returns only that workspace's entries.
- `getActiveWorkspaceDataSources()` follows the active workspace from the workspace registry.
- Workspace switching updates the active data source context without cross-workspace leakage.

## Diagnostics

Development-only diagnostics:

- `[WorkspaceDataSource] Registered`
- `[WorkspaceDataSource] Updated`
- `[WorkspaceDataSource] Removed`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceDataSourceRegistry.test.ts
npm run build
```

## Acceptance Status

PASS:

- Registry exists
- Workspace scoped
- Isolation preserved
- Build passes

## Scope Notes

This phase establishes registry and ownership foundations only. Data ingestion, sync, KPI binding, and UI management remain future phases.

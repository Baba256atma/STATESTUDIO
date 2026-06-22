# NW-B:9-3 Data Source Panel Report

Required tags:

[NWB93]
[DATA_SOURCE_PANEL]
[WORKSPACE_DATA_MANAGEMENT]

## Summary

NW-B:9-3 adds a workspace-level data source panel for managing CSV data sources registered in the active workspace. The panel uses existing Nexora operational styling and the NW-B:9-1 / NW-B:9-2 workspace data foundations.

## Implementation

| Layer | Path |
|---|---|
| Panel runtime | `frontend/app/lib/workspace/workspaceDataSourcePanelRuntime.ts` |
| Panel UI | `frontend/app/components/main-right-panel/workspace/operational/WorkspaceDataSourcePanel.tsx` |
| Operational mount | `frontend/app/components/main-right-panel/workspace/operational/OperationalWorkspace.tsx` |

## Panel Features

- Lists workspace data sources by file name
- Shows status, row count, and column count for the selected source
- Adds CSV files through workspace CSV upload
- Removes selected workspace data sources
- Refreshes selected source metadata
- Shows selected-source metadata for future data source engines

## Workspace Isolation

- Snapshot reads only `listWorkspaceDataSources(activeWorkspaceId)`
- Remove and refresh validate `source.workspaceId === active workspace`
- No cross-workspace listing or mutation paths

## UI Behavior

```text
Data Sources
──────────────
inventory.csv
orders.csv
suppliers.csv
──────────────
Selected metadata
[Add CSV] [Remove] [Refresh]
```

Selecting a source updates the metadata panel. Styling reuses `operationalVisualContract` tokens and card patterns from the operational workspace.

## Diagnostics

Development-only diagnostics:

- `[DataSourcePanel] Opened`
- `[DataSourcePanel] Closed`
- `[DataSourcePanel] Source Selected`
- `[DataSourcePanel] Source Removed`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceDataSourcePanelRuntime.test.ts
node --test app/lib/workspace/workspaceCsvUploadRuntime.test.ts
npm run build
```

## Acceptance Status

PASS:

- Panel renders in operational sources context
- Lists workspace sources
- Remove works
- Refresh works
- Build passes

## Scope Notes

This phase delivers workspace panel management and metadata inspection only. Global DS:1 manager panels remain available in code but are no longer mounted in the operational sources workspace surface.

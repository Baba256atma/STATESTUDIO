# DS:1:3 — Data Source Manager Panel Report

Freeze Tag: `[DS:1:3_DATA_SOURCE_MANAGER]`

## Objective

Create an executive Data Source Manager panel for Nexora Type-C.

The panel displays:

- Source Name
- Type
- Status
- Records
- Last Sync

The panel actions are:

- View
- Refresh
- Delete

## Implementation

Added a metadata-only manager contract and runtime:

- `buildDataSourceManagerSnapshot()` builds display rows from the canonical registry.
- `viewDataSource()` selects an existing source for executive inspection.
- `refreshDataSource()` updates `lastSyncAt`, `updatedAt`, and status metadata only.
- `deleteDataSource()` removes the registry entry through the canonical DS registry runtime.

Added `DataSourceManagerPanel` to the Data Sources dashboard context. It follows Nexora executive visual tokens, uses a 4px panel/table/action radius, and does not introduce legacy styling or new routing.

The existing upload panel now notifies the manager after successful uploads so the visible registry stays current.

## Guardrails

- Registry metadata only.
- No object generation.
- No relationship generation.
- No scenario generation.
- No AI analysis.
- No scene, topology, SVIE, or routing changes.

## Acceptance

- A. Registry visible: passed. The manager snapshot and UI expose registered source rows.
- B. Actions functional: passed. View, Refresh, and Delete are covered by focused tests.
- C. No routing regressions: passed. The `sources` dashboard context still resolves to the operational workspace mount.
- D. Build pass: passed.

## Verification

- `node --test frontend/app/lib/data-sources/dataSourceRegistryRuntime.test.ts frontend/app/lib/data-sources/dataSourceUploadRuntime.test.ts frontend/app/lib/data-sources/dataSourceManagerRuntime.test.ts frontend/app/lib/ui/mrpWorkspace/mrpWorkspaceLoader.test.ts`
- Targeted ESLint on DS manager runtime and touched operational workspace files
- `npm run build` from `frontend`


# DS:1:5 — Runtime Synchronization Foundation Report

Freeze Tag: `[DS:1:5_RUNTIME_SYNC]`

## Objective

Prepare future source refresh and update mechanisms for the Nexora Type-C Data Source Registry.

Runtime APIs:

- `syncDataSource()`
- `markSourceStale()`
- `refreshSource()`

Display states:

- Healthy
- Warning
- Out Of Sync

## Implementation

Added a manual synchronization contract and runtime:

- `resolveDataSourceSyncState()` derives the visible sync state from registry metadata.
- `syncDataSource()` performs an explicit manual sync and updates `lastSyncAt`.
- `markSourceStale()` marks a source inactive so it displays as Out Of Sync.
- `refreshSource()` routes manual refresh through the sync runtime.

Updated the Data Source Manager panel to show a dedicated `Sync` column with Healthy, Warning, and Out Of Sync labels.

## Guardrails

- Manual sync only.
- No automatic updates.
- No ingestion pipeline.
- No object creation.
- No scenario generation.
- No AI analysis.
- No scene, topology, SVIE, or routing changes.

Every sync snapshot records:

- `manualSyncOnly: true`
- `automaticUpdatesEnabled: false`

## Acceptance

- A. Sync state visible: passed. Data Source Manager rows expose sync labels.
- B. State updates correctly: passed. Tests cover Warning → Healthy → Out Of Sync transitions.
- C. Build pass: passed.

## Verification

- `node --test frontend/app/lib/data-sources/dataSourceRegistryRuntime.test.ts frontend/app/lib/data-sources/dataSourceUploadRuntime.test.ts frontend/app/lib/data-sources/dataSourceManagerRuntime.test.ts frontend/app/lib/data-sources/dataSourceObjectMappingRuntime.test.ts frontend/app/lib/data-sources/dataSourceSyncRuntime.test.ts`
- Targeted ESLint on DS sync and touched manager files
- `npm run build` from `frontend`


# DS-1:1 — Data Source Schema Discovery Report

Freeze Tags: `[DS11]`, `[SCHEMA_DISCOVERY]`

Diagnostic Prefix: `[NexoraSchemaDiscovery]`

## Objective

Create the first layer of Data Source Intelligence for Nexora Type-C. Inspect uploaded CSV files and generate a normalized schema contract without creating objects, relationships, KPIs, or mutating scene/workspace runtime state beyond schema persistence.

## Pipeline

```
CSV
  → Parse Metadata       parseCsvMetadata()
  → Inspect Columns      inspectColumns()
  → Infer Type           inferColumnTypes()
  → Build Schema Contract buildSchemaContract()
```

Pure discovery orchestration: `discoverWorkspaceCsvSchema()`.

## Modules

| Module | Responsibility |
|--------|----------------|
| `workspaceDataSourceSchemaContract.ts` | DS-1:1 contract, column/profile types, diagnostic prefix |
| `workspaceDataSourceSchemaDiscovery.ts` | Pure CSV pipeline (no registry, no React) |
| `workspaceDataSourceSchemaResolver.ts` | Workspace-scoped store, guards, public API |
| `workspaceDataSourceSchemaLegacyBridge.ts` | Legacy flat profile bridge for DS-1:2+ engines |
| `workspaceSchemaRegistry.ts` | Thin facade for downstream compatibility |

## Storage Model

Schema profiles are stored as:

```
workspaceId → dataSourceId → schema
```

Persistence key: `nexora.workspaceDataSourceSchemas.v2`

Legacy array snapshots (`v1`) are normalized to the map shape on hydrate.

## Public API

```typescript
discoverDataSourceSchema(workspaceId, dataSourceId)
getDataSourceSchema(workspaceId, dataSourceId)
```

- `discoverDataSourceSchema` resolves the CSV data source through `workspaceDataSourceResolver.ts`, reads `metadata.csvText`, runs the discovery pipeline, and stores the schema profile.
- `getDataSourceSchema` returns the stored schema profile for a workspace/data source pair.

Lower-level helpers remain available for tests and downstream phases:

- `discoverWorkspaceCsvSchema(input)`
- `discoverAndSaveWorkspaceDataSourceSchema(input)`
- `resolveWorkspaceDataSourceSchema(workspaceId, dataSourceId)`

## Required Output

### Per CSV

- `dataSourceId`
- `workspaceId`
- `fileName`
- `rowCount`
- `columnCount`

### Per Column

- `columnName`
- `detectedType`
- `uniqueValueCount`
- `nullPercentage`
- `sampleValues`

### Detected Types

`text`, `number`, `currency`, `percentage`, `date`, `boolean`, `identifier`, `unknown`

## Diagnostics

Certification-ready dev diagnostics use:

```
[NexoraSchemaDiscovery]
```

Required payload fields:

- `workspaceId`
- `dataSourceId`
- `columnCount`
- `rowCount`

Pipeline step events:

- `Parse Metadata`
- `Inspect Columns`
- `Infer Type`
- `Schema Discovered`
- `Schema Stored` / `Schema Updated` / `Schema Removed`

## Guardrails

- Data source registry reads go only through `workspaceDataSourceResolver.ts`.
- No React dependency in the runtime layer.
- No scene mutation.
- No object creation.
- No relationship creation.
- No workspace object mutation.
- Upload path stores CSV text in data source metadata, then calls `discoverDataSourceSchema()`.
- Downstream classification/candidate discovery is opt-in and not part of DS-1:1 default upload behavior.

## Tests

File: `frontend/app/lib/workspace/workspaceDataSourceSchemaDiscovery.test.ts`

| Scenario | Result |
|----------|--------|
| Empty CSV | Rejected with `empty_csv` |
| One column CSV | Schema contract built with one text column |
| Mixed type CSV | Currency, boolean, date, identifier, and null columns inferred |
| Finance CSV | Currency, percentage, date, boolean, identifier columns inferred |
| Invalid CSV | Rejected with `unclosed_quote` |
| API persistence | `discoverDataSourceSchema` + `getDataSourceSchema` workspace isolation |
| Runtime isolation | No pipeline objects or synced scene objects created |

Additional regression coverage:

- `workspaceSchemaRegistry.test.ts`
- `workspaceCsvUploadRuntime.test.ts`
- `columnClassificationEngine.test.ts`
- `candidateObjectDiscoveryEngine.test.ts`
- `objectCreationFromDataSourcesCertification.test.ts`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceDataSourceSchemaDiscovery.test.ts
node --test app/lib/workspace/workspaceSchemaRegistry.test.ts
node --test app/lib/workspace/workspaceCsvUploadRuntime.test.ts
node --test app/lib/workspace/columnClassificationEngine.test.ts
node --test app/lib/workspace/candidateObjectDiscoveryEngine.test.ts
node --test app/lib/workspace/objectCreationFromDataSourcesCertification.test.ts
npm run build
```

## Acceptance

- A. Schema discovered successfully: passed
- B. Build passes: passed
- C. No scene mutation: passed
- D. No object creation: passed
- E. No relationship creation: passed
- F. No workspace object mutation: passed
- G. Resolver-only data source reads: passed
- H. Certification diagnostics present: passed

## Out of Scope (DS-1:1)

- Object creation
- Relationship creation
- KPI generation
- Column classification (DS-1:2)
- Candidate object discovery (DS-1:3)
- Scene writes
- Dashboard mutations
- Assistant mutations

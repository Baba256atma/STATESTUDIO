# DS-1:2 — Column Classification Engine Report

Freeze Tags: `[DS12_COLUMN_CLASSIFICATION]`, `[COLUMN_BUSINESS_ROLE_READY]`, `[COLUMN_CLASSIFICATION_PERSISTED]`, `[WORKSPACE_COLUMN_ISOLATION]`, `[DS13_READY]`, `[DS_1_2_COMPLETE]`

Diagnostic Prefix: `[NexoraColumnClassification]`

Prerequisite: DS-1:1 Data Source Schema Discovery = PASS

## Objective

Classify discovered CSV schema columns into business-meaning categories. This phase transforms schema columns into business column roles without creating objects, relationships, KPIs, risks, scene nodes, or modifying MRP/Assistant runtime.

## Input

Classification reads DS-1:1 schema only through:

```typescript
getDataSourceSchema(workspaceId, dataSourceId)
```

No CSV re-parse. No schema resolver bypass.

## Modules

| Module | Responsibility |
|--------|----------------|
| `workspaceColumnClassificationContract.ts` | DS-1:2 contract, business roles, tags, diagnostics |
| `workspaceColumnClassificationEngine.ts` | Rule engine, persistence, public API |
| `workspaceColumnClassificationLegacyBridge.ts` | Legacy profile bridge for DS-1:3 engines |
| `columnClassificationEngine.ts` | Thin facade for downstream compatibility |
| `columnClassificationContract.ts` | Legacy contract re-exports |

## Business Roles

Allowed `businessRole` values:

`Identifier`, `Name`, `Metric`, `Currency`, `Percentage`, `Date`, `Category`, `Status`, `Boolean`, `Quantity`, `Location`, `Text`, `Unknown`

Each classification stores:

- `workspaceId`
- `dataSourceId`
- `columnName`
- `detectedType` (from DS-1:1 schema)
- `businessRole`
- `confidence` (0.0–1.0)
- `reason`
- `classifiedAt`
- `source` (`ds-1:1-schema`)

## Classification Rules

Deterministic rule-based classification using:

- Column name patterns
- DS-1:1 detected type
- Null percentage (empty columns → Unknown)
- Sample context from schema metadata

Examples:

| Column | Role |
|--------|------|
| `customer_id`, `account_id` | Identifier |
| `customer_name`, `supplier_name` | Name |
| `revenue`, `expenses` | Metric / Currency |
| `margin_percent` | Percentage |
| `order_date`, `invoice_date` | Date |
| `region`, `department`, `category` | Category |
| `status`, `stage` | Status |
| `notes`, `misc` | Unknown |

Confidence examples:

- Exact name match: 0.9+
- Type + name match: 0.8+
- Weak inference: 0.5–0.7
- Unknown: 0.2

## Storage Model

```
workspaceId → dataSourceId → columnName → classification
```

Persistence key: `nexora.workspaceColumnClassifications.v2`

Legacy array snapshots (`v1`) normalize to the map shape on hydrate.

## Public API

```typescript
classifyDataSourceColumns(workspaceId, dataSourceId)
getColumnClassifications(workspaceId, dataSourceId)
getColumnClassification(workspaceId, dataSourceId, columnName)
```

Legacy facade helpers remain for DS-1:3:

- `classifyAndSaveWorkspaceColumnsFromSchema()`
- `getWorkspaceColumnClassificationProfile()`

## Diagnostics

Development diagnostics:

```
[NexoraColumnClassification]
```

Required payload fields:

- `workspaceId`
- `dataSourceId`
- `columnName`
- `businessRole`
- `confidence`
- `reason`

## Guardrails

- Pure runtime layer — no React dependency
- No object generation
- No candidate object creation (DS-1:3 not triggered)
- No scene object creation
- No relationship creation
- No `sceneJson` mutation
- No UI layout changes
- Workspace A classifications never leak into Workspace B
- Data source reads go through `workspaceDataSourceResolver.ts`

## Tests

File: `frontend/app/lib/workspace/workspaceColumnClassificationEngine.test.ts`

| Scenario | Result |
|----------|--------|
| Identifier columns (`customer_id`, `account_id`) | Passed |
| Name columns (`customer_name`, `supplier_name`) | Passed |
| Financial metrics (`revenue`, `expenses`, `margin_percent`) | Passed |
| Dates (`order_date`, `invoice_date`) | Passed |
| Categories (`region`, `department`, `category`) | Passed |
| Unknown columns (`notes`, `misc`) | Passed |
| Workspace isolation | Passed |
| Missing DS-1:1 schema rejection | Passed |
| No object/scene mutation | Passed |

Regression coverage:

- `columnClassificationEngine.test.ts`
- `candidateObjectDiscoveryEngine.test.ts`
- `objectCreationFromDataSourcesCertification.test.ts`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceColumnClassificationEngine.test.ts
node --test app/lib/workspace/columnClassificationEngine.test.ts
node --test app/lib/workspace/candidateObjectDiscoveryEngine.test.ts
node --test app/lib/workspace/objectCreationFromDataSourcesCertification.test.ts
npm run build
```

## Acceptance

- Columns classified from schema: passed
- Business roles assigned: passed
- Confidence assigned: passed
- Reasons generated: passed
- Classifications persisted: passed
- Workspace isolation preserved: passed
- No objects created: passed
- No scene writes: passed
- No relationship writes: passed
- Build passes: passed

## Out of Scope (DS-1:2)

- Object creation (DS-1:3+)
- Relationship creation
- KPI generation
- Risk generation
- Scene writes
- MRP mutations
- Assistant mutations

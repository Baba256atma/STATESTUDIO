# DS-1:3 — Candidate Object Discovery Report

Freeze Tags: `[DS13_CANDIDATE_OBJECT_DISCOVERY]`, `[CANDIDATE_OBJECTS_READY]`, `[OBJECT_GROUPING_ENGINE]`, `[OBJECT_DISCOVERY_PERSISTED]`, `[DS14_READY]`, `[DS_1_3_COMPLETE]`

Diagnostic Prefix: `[NexoraCandidateDiscovery]`

Prerequisites: DS-1:1 Schema Discovery = PASS, DS-1:2 Column Classification Engine = PASS

## Objective

Transform classified columns into candidate business objects. Nexora suggests objects but does not create workspace objects, scene nodes, or relationships. Object creation belongs to DS-1:5.

## Input

Candidate discovery reads **only** from DS-1:2:

```typescript
getColumnClassifications(workspaceId, dataSourceId)
```

No raw CSV inspection. No DS-1:2 bypass.

## Modules

| Module | Responsibility |
|--------|----------------|
| `workspaceCandidateObjectContract.ts` | DS-1:3 contract, business object fields, tags |
| `workspaceCandidateObjectDiscoveryEngine.ts` | Prefix grouping, fallback clustering, persistence, API |
| `workspaceCandidateObjectLegacyBridge.ts` | Legacy proposal bridge for DS-1:4 approval panel |
| `candidateObjectDiscoveryEngine.ts` | Thin facade for downstream compatibility |
| `candidateObjectContract.ts` | Legacy contract re-exports |

## Candidate Object Contract

Each candidate stores:

- `candidateId`
- `workspaceId`
- `dataSourceId`
- `objectName`
- `confidence` (0.0–1.0)
- `reason`
- `sourceColumns`
- `primaryIdentifier`
- `candidateType` (`prefixed_entity` | `generic_entity`)
- `discoveredAt`
- `status` (`suggested` | `approved` | `rejected`, default `suggested`)

## Discovery Rules

Rule engine only — no LLM.

### Prefix Grouping

Columns sharing entity prefixes are grouped into named candidates:

| Columns | Candidate |
|---------|-----------|
| `customer_id`, `customer_name`, `customer_status`, `customer_region` | Customer |
| `supplier_id`, `supplier_name`, `supplier_region` | Supplier |
| `employee_id`, `employee_name`, `employee_department` | Employee |
| `project_id`, `project_name`, `project_status` | Project |
| `product_id`, `product_name`, `product_category` | Product |

### Fallback Clustering

When prefixes are absent, DS-1:2 role clustering proposes a generic **Business Entity** with lower confidence (Identifier + Name + Status patterns).

## Confidence

Numeric score from:

- Identifier present
- Name present
- Supporting column count
- Classification consistency

Examples:

- Customer with id + name + status + region → 0.9+
- Generic weak cluster → capped around 0.68

## Primary Identifier

The engine stores the primary identifier column (for example `customer_id`, `supplier_id`) on each candidate as `primaryIdentifier`.

## Storage Model

```
workspaceId → dataSourceId → candidateObjects
```

Persistence key: `nexora.workspaceCandidateObjects.v2`

Legacy array snapshots (`v1`) normalize to the map shape on hydrate.

## Public API

```typescript
discoverCandidateObjects(workspaceId, dataSourceId)
getCandidateObjects(workspaceId, dataSourceId)
getCandidateObject(workspaceId, dataSourceId, candidateId)
```

Legacy facade helpers remain for DS-1:4:

- `discoverAndSaveCandidateObjectsFromClassification()`
- `listWorkspaceCandidateObjectsForDataSource()`

## Diagnostics

Development diagnostics:

```
[NexoraCandidateDiscovery]
```

Required payload fields:

- `workspaceId`
- `dataSourceId`
- `candidateId`
- `objectName`
- `confidence`
- `sourceColumns`

## Guardrails

- Discovery only — no workspace object creation
- No scene nodes
- No relationships
- No KPI or risk generation
- No topology mutation
- No `sceneJson` writes
- Does not trigger DS-1:5 object creation
- Workspace isolation enforced via data-source guards and resolver reads

## Tests

File: `frontend/app/lib/workspace/workspaceCandidateObjectDiscoveryEngine.test.ts`

| Scenario | Result |
|----------|--------|
| Customer dataset | Customer candidate with primary identifier |
| Supplier dataset | Supplier candidate |
| Employee dataset | Employee candidate |
| Project dataset | Project candidate |
| Product dataset | Product candidate |
| Mixed Customer + Supplier | 2 candidates |
| Weak dataset (no prefixes) | Generic Business Entity |
| Workspace isolation | Passed |
| Missing DS-1:2 classifications | Rejected |
| No object/scene mutation | Passed |

Regression coverage:

- `candidateObjectDiscoveryEngine.test.ts`
- `objectCreationFromDataSourcesCertification.test.ts`

## Verification

```bash
cd frontend
node --test app/lib/workspace/workspaceCandidateObjectDiscoveryEngine.test.ts
node --test app/lib/workspace/candidateObjectDiscoveryEngine.test.ts
node --test app/lib/workspace/objectCreationFromDataSourcesCertification.test.ts
npm run build
```

## Acceptance

- Candidate objects discovered: passed
- Columns grouped correctly: passed
- Confidence calculated: passed
- Primary identifier detected: passed
- Explanations generated: passed
- Classifications persisted: passed
- Workspace isolation preserved: passed
- No workspace objects created: passed
- No scene nodes created: passed
- No relationships created: passed
- Build passes: passed

## Out of Scope (DS-1:3)

- Workspace object creation (DS-1:5)
- Scene node creation
- Relationship creation
- KPI generation
- Risk generation
- Topology changes
- Dashboard mutations
- Assistant mutations

# APP-7:2 — Business Event Engine

## Purpose

APP-7:2 implements the **Business Event Engine** for Nexora Type-C APP-7 Business Timeline. The engine creates, validates, normalizes, stores, and retrieves immutable organizational business events.

This phase builds exclusively on **APP-7:1 Business Timeline Foundation**. It does not modify certified prior platforms.

## Scope

### In scope

- Immutable business event creation
- Event normalization and validation
- Deterministic event ID generation
- Append-only in-memory registry
- Workspace-isolated storage and retrieval
- Filtering by category, type, importance, status, source, tags, and occurredAt range
- Controlled metadata updates with numeric revision versioning
- Archive policy (no hard delete)
- Certification runner

### Out of scope

- Visualization
- Dashboard integration
- Assistant integration
- Data-source ingestion
- Scenario timeline coupling
- Decision timeline coupling
- Persistence

## Public API

| Function | Description |
| --- | --- |
| `createBusinessEvent()` | Normalize, validate, and register a new event |
| `normalizeBusinessEvent()` | Trim and normalize input fields |
| `validateBusinessEventInput()` | Validate create/update input against APP-7:1 vocabulary |
| `registerBusinessEvent()` | Append-only registry publication |
| `getBusinessEventById()` | Retrieve current revision by id |
| `getBusinessEventsByWorkspace()` | List workspace events |
| `filterBusinessEvents()` | Filter workspace events |
| `updateBusinessEventMetadata()` | Controlled metadata update (revision +1) |
| `archiveBusinessEvent()` | Archive via status transition |
| `runBusinessEventEngineCertification()` | Run APP-7:2 certification checks |

## Event lifecycle

1. **Initialize** — APP-7:1 foundation must be ready; engine initialized via `initializeBusinessEventEngine()`.
2. **Create** — Input normalized and validated; event id generated or supplied; revision starts at `1`.
3. **Register** — Event appended to workspace-scoped registry; duplicate ids rejected.
4. **Update** — Only title, description, importance, status, tags, and metadata may change; revision increments; identity fields remain stable.
5. **Archive** — Status set to `archived`; event remains retrievable unless filtered out.
6. **Retrieve / Filter** — Query by workspace, id, or filter dimensions.

## Versioning

- `contractVersion` — APP-7:1 foundation contract (`APP-7/1`)
- `revisionVersion` — Numeric revision starting at `1`; increments on metadata updates
- `id` — Stable across all revisions
- Revision history retained append-only per event id

## Files

- `businessEventEngineTypes.ts`
- `businessEventEngineNormalization.ts`
- `businessEventEngineValidation.ts`
- `businessEventEngineRegistry.ts`
- `businessEventEngineFilters.ts`
- `businessEventEngineMutations.ts`
- `businessEventEngine.ts`
- `businessEventEngineRunner.ts`
- `businessEventEngine.test.ts`

## Certification

Run:

```bash
cd frontend && node --test app/lib/business-timeline/businessEventEngine.test.ts
```

Certification groups A–O verify foundation availability, engine initialization, creation, validation, workspace isolation, append-only behavior, no hard delete, archive policy, versioning, filtering, prior platform integrity, and absence of dashboard/assistant/visualization/scenario/decision coupling.

## Prerequisites

- APP-7:1 Business Timeline Foundation certified

## Next phase

APP-7:3 may consume APP-7:2 public APIs for business timeline lifecycle orchestration.

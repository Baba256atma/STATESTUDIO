# APP-7:3 — Business Timeline Query + Ordering Layer

## Purpose

APP-7:3 implements the **read-only Business Timeline Query + Ordering Layer** for Nexora Type-C APP-7. It transforms certified APP-7:2 business events into stable, ordered timeline read models.

This phase builds on **APP-7:1** (foundation contracts) and **APP-7:2** (event engine) only. It does not create, mutate, or archive events.

## Scope

### In scope

- Workspace-isolated timeline queries
- Deterministic ordering (occurredAt → createdAt → id)
- Ascending and descending direction (default: descending)
- Filtering by category, type, importance, status, source, tags, and occurredAt range
- Archived inclusion policy (default: exclude)
- Timeline summary metadata (counts only — no intelligence)
- Certification runner

### Out of scope

- Event creation or mutation
- Archive mutation
- Visualization, dashboard, assistant
- Data-source ingestion
- Scenario or decision timeline coupling

## Public API

| Function | Description |
| --- | --- |
| `queryBusinessTimeline()` | Execute full timeline query and return read model |
| `getBusinessTimelineOrderedEvents()` | Return ordered events only |
| `getBusinessTimelineRange()` | Range-filtered timeline query |
| `getBusinessTimelineSummary()` | Summary metadata for a query |
| `buildBusinessTimelineReadModel()` | Build read model from filters |
| `validateBusinessTimelineQuery()` | Validate query input and prerequisites |
| `runBusinessTimelineQueryCertification()` | Run APP-7:3 certification checks |

## Ordering rules

1. **Primary:** `occurredAt`
2. **Secondary:** `createdAt` (when occurredAt ties)
3. **Stable fallback:** `id` (when both dates tie)
4. **Direction:** `desc` by default; `asc` when explicitly requested

## Read model

`BusinessTimelineQueryResult` includes:

- `workspaceId`, `events`, `totalEvents`
- `includedArchived`, `orderedBy`, `direction`, `range`, `filters`, `generatedAt`
- `summary` with `firstEventAt`, `lastEventAt`, `criticalCount`, `highCount`, `archivedCount`, `categoryCounts`, `typeCounts`

## Files

- `businessTimelineQueryTypes.ts`
- `businessTimelineQueryValidation.ts`
- `businessTimelineOrdering.ts`
- `businessTimelineQueryFilters.ts`
- `businessTimelineReadModel.ts`
- `businessTimelineQuery.ts`
- `businessTimelineQueryRunner.ts`
- `businessTimelineQuery.test.ts`

## Certification

```bash
cd frontend && node --test app/lib/business-timeline/businessTimelineQuery.test.ts
```

Certification groups A–R verify foundation, event engine, query initialization, isolation, ordering, filters, archive policy, summary accuracy, empty workspace safety, read-only surface, and absence of dashboard/assistant/visualization coupling.

## Prerequisites

- APP-7:1 Business Timeline Foundation certified
- APP-7:2 Business Event Engine certified

## Next phase

APP-7:4 may consume APP-7:3 read models for lifecycle orchestration or API exposure.

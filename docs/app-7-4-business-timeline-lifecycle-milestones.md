# APP-7:4 — Business Timeline Lifecycle + Milestone Layer

## Purpose

APP-7:4 structures ordered business events into **lifecycle phases** and **milestones**. It is a metadata-only history structuring layer — not prediction, recommendation, or dashboard analytics.

Builds on **APP-7:1**, **APP-7:2**, and **APP-7:3** only.

## Scope

### In scope

- Lifecycle phase contracts and classification rules
- Milestone extraction rules
- Workspace-isolated lifecycle models
- Event-to-lifecycle and event-to-milestone mappings
- Lifecycle summary metadata
- Deterministic read-only builder over APP-7:3 query results

### Out of scope

- Event creation, mutation, or archiving
- UI, visualization, dashboard, assistant
- Data-source ingestion
- Scenario or decision timeline coupling
- Predictions or recommendations

## Lifecycle phases

`founding`, `early-growth`, `growth`, `expansion`, `transformation`, `crisis`, `recovery`, `stabilization`, `decline`, `renewal`, `unknown`

Each segment includes: `id`, `workspaceId`, `phase`, `title`, `description`, `startAt`, `endAt`, `eventIds`, `importance`, `confidence`, `metadata`.

## Milestone extraction

Milestones extracted when events match:

- `importance` = `high` or `critical`
- `category` in financial, strategy, product, investment, legal, risk, operations
- `type` in achievement, transformation, expansion, investment, acquisition, merger, incident, financial
- Manual flag in metadata (`milestone`, `manualMilestone`, or `manual_milestone` = true)

## Public API

| Function | Description |
| --- | --- |
| `buildBusinessLifecycleModel()` | Build full lifecycle model from APP-7:3 timeline |
| `classifyBusinessLifecycleSegments()` | Group ordered events into lifecycle segments |
| `extractBusinessMilestones()` | Extract milestones from events |
| `mapEventsToLifecycle()` | Map each event to a lifecycle phase |
| `getBusinessLifecycleSummary()` | Return summary metadata |
| `validateBusinessLifecycleModel()` | Validate model contract |
| `runBusinessTimelineLifecycleCertification()` | Run certification checks |

## Files

- `businessTimelineLifecycleTypes.ts`
- `businessTimelineLifecycleRules.ts`
- `businessTimelineMilestones.ts`
- `businessTimelineLifecycleBuilder.ts`
- `businessTimelineLifecycleValidation.ts`
- `businessTimelineLifecycle.ts`
- `businessTimelineLifecycleRunner.ts`
- `businessTimelineLifecycle.test.ts`

## Certification

```bash
cd frontend && node --test app/lib/business-timeline/businessTimelineLifecycle.test.ts
```

## Prerequisites

- APP-7:1 Business Timeline Foundation
- APP-7:2 Business Event Engine
- APP-7:3 Business Timeline Query + Ordering Layer

## Next phase

APP-7:5 may consume lifecycle models for history aggregation or API exposure.

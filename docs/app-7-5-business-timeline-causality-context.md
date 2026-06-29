# APP-7:5 — Business Timeline Causality + Context Layer

## Purpose

APP-7:5 structures business history by connecting events into **historical context** — relationships, possible causal links, and business episode clusters. This is not prediction, recommendation, or proven causality.

Builds on **APP-7:1** through **APP-7:4** only.

## Scope

### In scope

- Event relationship contracts (previous, next, same-category, same-type, same-tag, lifecycle-phase, milestone, temporal proximity, possible-cause/effect)
- Context cluster builder (business episodes from lifecycle segments)
- Per-event context model with related events and cluster membership
- Confidence scoring (0–1)
- Read-only access to APP-7:3 query results and APP-7:4 lifecycle models

### Out of scope

- Event or lifecycle mutation
- True causal proof
- UI, visualization, dashboard, assistant
- Scenario/decision coupling

## Public API

| Function | Description |
| --- | --- |
| `buildBusinessTimelineContextModel()` | Build full context model for a workspace |
| `buildBusinessEventContexts()` | Build per-event context records |
| `buildBusinessEventRelationships()` | Build relationship graph |
| `buildBusinessContextClusters()` | Build episode clusters |
| `getBusinessEventContext()` | Lookup event context by id |
| `getBusinessRelatedEvents()` | Lookup related events for an event |
| `validateBusinessTimelineContextModel()` | Validate model contract |
| `runBusinessTimelineContextCertification()` | Run certification checks |

## Relationship types

`previous`, `next`, `same-category`, `same-type`, `same-tag`, `same-lifecycle-phase`, `milestone-related`, `temporal-proximity`, `possible-cause`, `possible-effect`, `unknown`

Possible cause/effect links are **historical relatedness only** — not proven causality.

## Cluster rules

Clusters derive from APP-7:4 lifecycle segments. Each cluster includes dominant category/type, lifecycle phase, milestone references, and intra-cluster relationship ids.

## Files

- `businessTimelineContextTypes.ts`
- `businessTimelineContextRules.ts`
- `businessTimelineRelationships.ts`
- `businessTimelineClusters.ts`
- `businessTimelineContextBuilder.ts`
- `businessTimelineContextValidation.ts`
- `businessTimelineContext.ts`
- `businessTimelineContextRunner.ts`
- `businessTimelineContext.test.ts`

## Certification

```bash
cd frontend && node --test app/lib/business-timeline/businessTimelineContext.test.ts
```

## Prerequisites

- APP-7:1 Foundation
- APP-7:2 Event Engine
- APP-7:3 Query Layer
- APP-7:4 Lifecycle Layer

## Next phase

APP-7:6 may consume context models for history aggregation or API exposure.

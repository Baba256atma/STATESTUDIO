# APP-5:5 — Scenario Timeline Query Engine

## Overview

APP-5:5 implements the canonical **Scenario Timeline Query Engine** — a read-only gateway for retrieving timeline information through APP-5:2, APP-5:3, and APP-5:4 public APIs.

The Query Engine does **not** own data, does **not** mutate data, and does **not** implement persistence or search indexes.

## APP-5 Canonical Pipeline

```
APP-5:1 → Platform Foundation
APP-5:2 → Event Engine
APP-5:3 → Lifecycle Engine
APP-5:4 → History Engine
APP-5:5 → Query Engine (read-only gateway)
```

Future Timeline UI, Playback, Dashboard, Assistant, Executive Memory, and LAY modules must retrieve timeline information only through this engine.

## Architecture

```
Query Input (queryType + filters)
        │
        ▼
  Query Validator ──► filter and query contract validation
        │
        ▼
  Canonical Source Adapter ──► APP-5:2 / APP-5:3 / APP-5:4 public APIs only
        │
        ▼
  Filter Engine ──► stage, date, sequence, event type, workspace
        │
        ▼
  Selector / Projection ──► events, progress, status, milestones
        │
        ▼
  Query Builder ──► immutable ScenarioTimelineQueryResult
        │
        ▼
  Query Registry ──► in-memory query record cache
```

## Supported Queries

| Query API | Purpose |
|---|---|
| `queryScenarioTimeline()` | Full timeline projection |
| `queryTimelineEvents()` | Chronological events |
| `queryTimelineHistory()` | History object |
| `queryTimelineLifecycle()` | Lifecycle projection |
| `queryTimelineMilestones()` | History milestones |
| `queryTimelineSummary()` | History summary |
| `queryTimelineProgress()` | Lifecycle progress |
| `queryTimelineStatus()` | Lifecycle status |
| `queryLatestTimelineEvent()` | Latest event |
| `queryTimelineByStage()` | Stage-filtered events |
| `queryTimelineByDate()` | Date-range filtered events |

## Supported Filters

`scenarioId`, `workspaceId`, `eventId`, `historyId`, `stage`, `eventType`, `dateFrom`, `dateTo`, `sequenceFrom`, `sequenceTo`

## Public APIs

- `initializeScenarioTimelineQueryEngine()`
- All query APIs listed above
- `validateTimelineQuery()`
- `getTimelineQueryRegistry()`
- `getTimelineQueryContract()`
- `certifyScenarioTimelineQueryEngine()`

## Compatibility

- **APP-5:2** — events retrieved via history engine public APIs and event registry snapshots
- **APP-5:3** — lifecycle derived read-only via `buildScenarioLifecycle()` and registry status APIs
- **APP-5:4** — history retrieved via `getScenarioHistory()` and related public APIs
- **APP-5:1** — foundation contract validated through compatibility layer
- No direct imports of APP-5:2/3/4 registry modules

## Explicitly Forbidden

- Persistence, search indexes, playback, UI, charts
- Dashboard and assistant integration
- Direct registry bypass
- Event, lifecycle, or history mutation

## Certification

```bash
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineQueryEngine.test.ts
cd frontend && node --test app/lib/scenario-timeline/*.test.ts
cd frontend && node --test app/lib/executiveMemory/*.test.ts
```

## Status

**APP-5/5 — Scenario Timeline Query Engine — BUILD**

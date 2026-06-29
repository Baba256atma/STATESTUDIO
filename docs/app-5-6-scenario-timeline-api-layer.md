# APP-5:6 — Scenario Timeline API Layer

## Overview

APP-5:6 establishes the official **public API Layer** for the Scenario Timeline Platform. It is the only supported integration point for future Nexora consumers.

The API Layer orchestrates certified APP-5:1 through APP-5:5 engines. It does not own data, does not mutate engine internals directly, and does not implement UI, persistence, REST, GraphQL, or WebSockets.

## Canonical Architecture

```
APP-5:1 → Platform Foundation
APP-5:2 → Event Engine
APP-5:3 → Lifecycle Engine
APP-5:4 → History Engine
APP-5:5 → Query Engine
APP-5:6 → Public API Layer (this phase)
```

All future Dashboard, Assistant, Executive Memory, INT, LAY, UI, SDK, and external integrations must use this layer.

## Responsibilities

- **API Facade** — stable public method surface
- **API Router** — routes requests to canonical engine operations
- **API Validator** — validates requests and filters
- **API Response Builder** — immutable responses with metadata and diagnostics
- **API Error Translator** — normalized error objects
- **Version Manager** — layered version metadata
- **Compatibility Manager** — APP-5:1–5:5 contract checks
- **API Registry** — in-memory request audit trail

## Public APIs

| API | Purpose |
|---|---|
| `initializeScenarioTimelinePlatform()` | Initialize APP-5:1 foundation |
| `initializeScenarioTimeline()` | Initialize full APP-5 stack + API layer |
| `getScenarioTimeline()` | Full scenario timeline view |
| `createScenarioTimelineEvent()` | Create event and refresh projections |
| `buildScenarioTimelineLifecycle()` | Build/register lifecycle |
| `getScenarioTimelineHistory()` | Retrieve registered history |
| `queryScenarioTimeline()` | Execute canonical query |
| `validateScenarioTimeline()` | Validate scenario timeline state |
| `getScenarioTimelineStatus()` | Lifecycle status |
| `getScenarioTimelineProgress()` | Lifecycle progress |
| `getScenarioTimelineSummary()` | History summary |
| `getScenarioTimelineMilestones()` | History milestones |
| `getScenarioTimelineHealth()` | Engine health diagnostics |
| `getScenarioTimelineVersion()` | Version metadata |
| `certifyScenarioTimelinePlatform()` | Full platform certification |

## Response Contract

Every API response includes:

- `success`, `status` (`ok` | `warning` | `error`)
- `data` (immutable payload)
- `errors`, `warnings`
- `metadata` (`requestId`, `timestamp`, `platformVersion`, `contractVersion`, `apiVersion`, `category`)
- `diagnostics` (engine readiness flags)
- `readOnly: true`

## Engine Orchestration Rules

- API sources import **only** public exports from `scenarioTimelinePlatform.ts` and `*Engine.ts` files
- No direct imports of engine registry modules
- `createScenarioTimelineEvent()` refreshes lifecycle and history projections after event creation
- Query/read methods delegate to APP-5:5 query engine public APIs

## Explicitly Forbidden

- Timeline UI, dashboard, assistant integration
- Persistence, search indexes, playback
- REST endpoints, GraphQL, WebSockets
- Authentication and authorization

## Certification

```bash
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineApiLayer.test.ts
cd frontend && node --test app/lib/scenario-timeline/*.test.ts
cd frontend && node --test app/lib/executiveMemory/*.test.ts
```

## Status

**APP-5/6 — Scenario Timeline API Layer — BUILD**

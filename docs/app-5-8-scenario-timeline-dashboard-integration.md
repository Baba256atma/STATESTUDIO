# APP-5:8 — Scenario Timeline Dashboard Integration

## Overview

APP-5:8 integrates the Scenario Timeline Platform with the Executive Dashboard through the certified **APP-5:6 API Layer** and optional **APP-5:7 Assistant Context**.

This phase is **not** a UI implementation. It prepares immutable dashboard-ready Timeline View Models. Dashboard rendering belongs to the Dashboard platform; APP-5 provides timeline data only.

## Canonical Architecture

```
APP-5:1 → Platform Foundation
APP-5:2 → Event Engine
APP-5:3 → Lifecycle Engine
APP-5:4 → History Engine
APP-5:5 → Query Engine
APP-5:6 → Public API Layer
APP-5:7 → Assistant Integration
APP-5:8 → Dashboard Integration (this phase)
```

Every Dashboard Timeline widget must receive data from this integration layer.

## Responsibilities

| Component | Purpose |
|---|---|
| Timeline Dashboard Adapter | Wraps APP-5:6 public APIs exclusively |
| Timeline Dashboard Context Builder | Produces immutable dashboard context |
| Timeline Dashboard ViewModel Builder | Full dashboard view model assembly |
| Timeline Progress Builder | Progress data for dashboard widgets |
| Timeline Milestone Builder | Milestone views |
| Timeline Status Builder | Lifecycle status data |
| Timeline Metrics Builder | Event counts, duration, stage metrics |
| Timeline Executive Summary Builder | Concise executive summary string |
| Timeline Dashboard Registry | In-memory view model registration |
| Compatibility Manager | APP-5:1–5:7 readiness checks |
| Certification | Architecture boundary validation |

## Public APIs

| API | Purpose |
|---|---|
| `buildScenarioTimelineDashboardContext()` | Immutable dashboard context |
| `buildScenarioTimelineDashboardViewModel()` | Full dashboard view model |
| `buildScenarioTimelineDashboardSummary()` | Timeline summary |
| `buildScenarioTimelineDashboardStatus()` | Status and current stage |
| `buildScenarioTimelineDashboardProgress()` | Progress percentage |
| `buildScenarioTimelineDashboardMilestones()` | Milestone list |
| `buildScenarioTimelineDashboardRecentChanges()` | Recent change records |
| `buildScenarioTimelineDashboardMetrics()` | Aggregated metrics |
| `validateScenarioTimelineDashboardContext()` | Context contract validation |
| `certifyScenarioTimelineDashboardIntegration()` | Full certification suite |

## Dashboard View Model Contract

Immutable view models include:

- `scenarioId`, `workspaceId`
- `summary`, `executiveSummary`
- `status`, `progress`, `currentStage`
- `milestones`, `recentChanges`, `recentEvents`
- `historySummary`, `historyDuration`
- `completedStages`, `remainingStages`
- `eventCount`, `timelineHealth`, `metrics`
- `diagnostics`, `platformVersion`, `metadata`
- `readOnly: true`

No UI properties, React state, or rendering logic.

## Architecture Rules

- **Never bypass APP-5:6** — adapter imports only from `scenarioTimelineApiLayer.ts`
- **Optional APP-5:7** — via `buildScenarioTimelineAssistantContext()` public API only
- **No React components, dashboard pages, or widgets**
- **No persistence, REST, GraphQL, playback, or charts**

## Explicitly Forbidden

- React components, dashboard pages, timeline widgets, charts
- Playback, persistence, REST, GraphQL, WebSockets, notifications
- Filtering UI, search UI, assistant conversations, recommendations

## Certification

```bash
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineDashboardIntegration.test.ts
cd frontend && node --test app/lib/scenario-timeline/*.test.ts
```

Expected: 24/24 certification checks PASS, 87/87 APP-5 tests PASS.

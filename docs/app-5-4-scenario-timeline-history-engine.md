# APP-5:4 — Scenario Timeline History Engine

## Overview

APP-5:4 implements the canonical **Scenario Timeline History Engine** for Nexora Type-C. It reconstructs the complete chronological story of a scenario from immutable APP-5:2 timeline events, with optional read-only APP-5:3 lifecycle context.

This phase is **engine only**. It does not implement UI, persistence, search, playback, dashboard integration, or assistant integration.

## APP-5 Event Pipeline

```
APP-5:1 → Platform foundation
APP-5:2 → Immutable timeline events
APP-5:3 → Current lifecycle state (read-only input)
APP-5:4 → Complete scenario history
```

Future phases (Query, Playback, Dashboard, Assistant, Executive Memory, LAY) must consume these canonical engines.

## Pipeline

```
APP-5:2 Timeline Events (+ optional APP-5:3 Lifecycle)
        │
        ▼
  Compatibility Validator ──► APP-5:1 / APP-5:2 / APP-5:3 checks
        │
        ▼
  Ordering Engine ──► sequenceOrder + timestamp sort
        │
        ▼
  Grouping Engine ──► stage, date, event type, sequence, workspace, scenario
        │
        ▼
  Milestone Detector ──► history_started, stage milestones, history_completed
        │
        ▼
  Summary Builder ──► narrative, duration, bounds
        │
        ▼
  History Builder ──► immutable ScenarioTimelineHistory
        │
        ▼
  History Registry ──► in-memory cache (no persistence)
```

## History Output Contract

| Field | Description |
|---|---|
| `scenarioId` | Scenario identity |
| `workspaceId` | Workspace identity |
| `historyId` | Canonical history identifier |
| `events` | Original immutable events |
| `orderedEvents` | Chronologically ordered events |
| `milestones` | Detected milestone records |
| `historySummary` | Narrative summary object |
| `historyStart` | First event timestamp |
| `historyEnd` | Latest event timestamp |
| `duration` | Duration in milliseconds |
| `eventCount` | Total event count |
| `stageGroups` | Events grouped by lifecycle stage |
| `groups` | Multi-dimensional grouping index |
| `latestStage` | Latest chronological stage |
| `latestEventId` | Latest event ID |
| `timelineVersion` | `APP-5/4` |
| `metadata` | Optional string metadata |

## Public APIs

| API | Purpose |
|---|---|
| `initializeScenarioTimelineHistoryEngine()` | Initialize engine |
| `buildScenarioHistory()` | Build history without registry write |
| `calculateScenarioHistory()` | Build and register history |
| `validateScenarioHistory()` | Validate history object |
| `getScenarioHistory()` | Read history from registry |
| `getScenarioHistorySummary()` | Read summary from registry |
| `getScenarioHistoryMilestones()` | Read milestones from registry |
| `getScenarioHistoryDuration()` | Read duration from registry |
| `getScenarioHistoryRegistry()` | Registry snapshot |
| `getScenarioHistoryContract()` | Contract surface |
| `certifyScenarioHistoryEngine()` | Certification suite |

## Compatibility

- **APP-5:2** — consumes `ScenarioTimelineEvent`; never mutates events
- **APP-5:3** — optional read-only `ScenarioTimelineLifecycle` for consistency checks; never mutates lifecycle
- **APP-5:1** — event foundation projection validated via APP-5:2 mappers
- APP-5:1 through APP-5:3 files are **not modified**

## Explicitly Forbidden

- Timeline UI, charts, playback, search, filters
- Persistence, dashboard, assistant integration
- AI recommendations, synchronization, notifications
- Business / Decision / Executive timeline viewers

## Files

| File | Role |
|---|---|
| `scenarioTimelineHistoryConstants.ts` | Versioning, limits, milestone keys |
| `scenarioTimelineHistoryTypes.ts` | Domain types |
| `scenarioTimelineHistoryErrors.ts` | Result helpers |
| `scenarioTimelineHistoryGrouping.ts` | Ordering and grouping |
| `scenarioTimelineHistoryMilestones.ts` | Milestone detection |
| `scenarioTimelineHistorySummary.ts` | Summary and duration |
| `scenarioTimelineHistoryValidator.ts` | History validation |
| `scenarioTimelineHistoryCalculator.ts` | History ID and bounds |
| `scenarioTimelineHistoryBuilder.ts` | History builder |
| `scenarioTimelineHistoryRegistry.ts` | In-memory registry |
| `scenarioTimelineHistoryCompatibility.ts` | APP-5:1/2/3 compatibility |
| `scenarioTimelineHistoryContracts.ts` | Stage manifest + contract |
| `scenarioTimelineHistoryEngine.ts` | Public entry point |
| `scenarioTimelineHistoryCertification.ts` | Certification suite |
| `scenarioTimelineHistoryEngine.test.ts` | Tests |

## Certification

```bash
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineHistoryEngine.test.ts
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineLifecycleEngine.test.ts
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineEventEngine.test.ts
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelinePlatformFoundation.test.ts
cd frontend && node --test app/lib/executiveMemory/*.test.ts
```

## Status

**APP-5/4 — Scenario Timeline History Engine — BUILD**

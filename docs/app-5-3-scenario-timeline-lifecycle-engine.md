# APP-5:3 — Scenario Timeline Lifecycle Engine

## Overview

APP-5:3 implements the canonical **Scenario Timeline Lifecycle Engine** for Nexora Type-C. It derives immutable scenario lifecycle state exclusively from APP-5:2 timeline events.

This phase is **engine only**. It does not implement persistence, playback, visualization, dashboard integration, or assistant integration.

## Architectural Principle

The Scenario Timeline architecture is event-driven:

- **APP-5:1** defines the platform foundation
- **APP-5:2** creates immutable timeline events
- **APP-5:3** derives lifecycle state from those events

Future APP-5 modules must consume the Lifecycle Engine rather than implementing independent lifecycle logic.

## Pipeline

```
APP-5:2 Timeline Events (readonly input)
        │
        ▼
  Compatibility Validator ──► APP-5:2 + APP-5:1 event contract checks
        │
        ▼
  Lifecycle Validator ──► transition rules, ordering, duplicates, missing stages
        │
        ▼
  Lifecycle Calculator ──► current stage, progress, status, completion
        │
        ▼
  Lifecycle Builder ──► immutable ScenarioTimelineLifecycle
        │
        ▼
  Lifecycle Registry ──► in-memory derived state cache (no persistence)
```

## Frozen Lifecycle Chain

```
scenario_created → scenario_updated → scenario_simulated → decision_made
→ execution_started → execution_finished → actual_results_recorded → lessons_learned
```

- `scenario_updated` allows repeat transitions
- All other stages are single-occurrence within valid progression
- Backward transitions and stage skips are blocked
- `lessons_learned` is the terminal stage

## Lifecycle Output Contract

| Field | Description |
|---|---|
| `scenarioId` | Scenario identity |
| `workspaceId` | Workspace identity |
| `currentStage` | Last valid lifecycle stage reached |
| `completedStages` | Stages reached in canonical order |
| `remainingStages` | Stages after current stage |
| `progressPercentage` | Completed stages / 8 × 100 |
| `status` | `not_started` · `in_progress` · `completed` · `blocked` |
| `lastEventId` | Last processed event ID |
| `lastTimestamp` | Last processed event timestamp |
| `transitionHistory` | Immutable transition audit trail |
| `isCompleted` | True when terminal stage reached with valid lifecycle |
| `isBlocked` | True when validation fails |
| `validationResult` | Full validation result |
| `platformVersion` | `APP-5/3` |
| `metadata` | Optional string metadata |

## Public APIs

| API | Purpose |
|---|---|
| `initializeScenarioTimelineLifecycleEngine()` | Initialize engine |
| `buildScenarioLifecycle()` | Derive lifecycle from events (no registry write) |
| `calculateScenarioLifecycle()` | Derive lifecycle and register |
| `validateScenarioLifecycle()` | Validate lifecycle object |
| `getScenarioCurrentStage()` | Read current stage from registry |
| `getScenarioProgress()` | Read progress from registry |
| `getScenarioStatus()` | Read status from registry |
| `validateScenarioTransition()` | Validate stage transition rules |
| `getLifecycleRegistry()` | Registry snapshot |
| `getScenarioLifecycleContract()` | Contract surface |
| `certifyScenarioLifecycleEngine()` | Certification suite |

## APP-5:1 and APP-5:2 Compatibility

- Consumes only `ScenarioTimelineEvent` objects from APP-5:2
- Never mutates timeline events
- Validates each event with `validateTimelineEvent()` (APP-5:2)
- Validates APP-5:1 foundation projection via `mapTimelineEventToFoundationContract()`
- APP-5:1 and APP-5:2 files are **not modified**

## Explicitly Forbidden

- Timeline UI, charts, playback
- Persistence, search, filters, history viewers
- Dashboard and assistant integration
- Simulation execution, notifications, synchronization
- Business / Decision / Executive timeline viewers

## Files

| File | Role |
|---|---|
| `scenarioTimelineLifecycleConstants.ts` | Versioning, status keys, limits |
| `scenarioTimelineLifecycleTypes.ts` | Domain types |
| `scenarioTimelineLifecycleErrors.ts` | Error helpers |
| `scenarioTimelineLifecycleTransitions.ts` | Transition rules engine |
| `scenarioTimelineLifecycleValidator.ts` | Event sequence analysis |
| `scenarioTimelineLifecycleCalculator.ts` | Progress and status calculation |
| `scenarioTimelineLifecycleBuilder.ts` | Lifecycle builder + summary |
| `scenarioTimelineLifecycleRegistry.ts` | In-memory lifecycle cache |
| `scenarioTimelineLifecycleCompatibility.ts` | APP-5:1/5:2 compatibility |
| `scenarioTimelineLifecycleContracts.ts` | Stage manifest + contract |
| `scenarioTimelineLifecycleEngine.ts` | Public entry point |
| `scenarioTimelineLifecycleCertification.ts` | Certification suite |
| `scenarioTimelineLifecycleEngine.test.ts` | Tests |

## Certification

```bash
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineLifecycleEngine.test.ts
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineEventEngine.test.ts
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelinePlatformFoundation.test.ts
cd frontend && node --test app/lib/executiveMemory/*.test.ts
```

## Status

**APP-5/3 — Scenario Timeline Lifecycle Engine — BUILD**

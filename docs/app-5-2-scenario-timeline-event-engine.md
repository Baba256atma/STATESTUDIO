# APP-5:2 — Scenario Timeline Event Engine

## Overview

APP-5:2 implements the canonical **Scenario Timeline Event Engine** for Nexora Type-C. This phase builds on the immutable APP-5:1 Scenario Timeline Platform Foundation and produces validated, normalized, immutable timeline events for every scenario lifecycle action.

This phase is **engine only**. It does not implement storage, visualization, playback, AI recommendations, dashboard integration, or assistant integration.

## Architecture

```
CreateTimelineEventInput
        │
        ▼
  Normalizer ──► resolve stage → eventType, trim fields, metadata/extensions
        │
        ▼
  Validator ──► identity, stage compatibility, timestamp, contract, duplicates
        │
        ▼
  Builder ──► immutable ScenarioTimelineEvent + identity + version + ordering
        │
        ▼
  Registry ──► in-memory publish (no persistence)
```

## Frozen Lifecycle Vocabulary

| Stage | Canonical Event Type |
|---|---|
| `scenario_created` | `lifecycle_transition` |
| `scenario_updated` | `lifecycle_transition` |
| `scenario_simulated` | `scenario_milestone` |
| `decision_made` | `decision_record` |
| `execution_started` | `execution_milestone` |
| `execution_finished` | `execution_milestone` |
| `actual_results_recorded` | `results_recorded` |
| `lessons_learned` | `lesson_learned` |

No additional stage names are introduced.

## Event Contract (APP-5/2)

Every immutable event includes:

- `eventId`
- `scenarioId`
- `workspaceId`
- `eventType`
- `stage`
- `timestamp`
- `createdBy`
- `platformVersion` (`APP-5/2`)
- `metadata`
- `extensions`
- `identity` (immutable identity snapshot)
- `version` (semantic, schema, engine, foundation contract version)
- `sequenceOrder` (monotonic per scenario)
- `title`, `summary`, `sourceModule` (required for APP-5:1 compatibility mapping)

Events do **not** include runtime UI state or visualization data.

## Public APIs

| API | Purpose |
|---|---|
| `initializeScenarioTimelineEventEngine()` | Initialize engine state |
| `createTimelineEvent()` | Normalize, validate, build, and publish event |
| `buildTimelineEvent()` | Build preview event without publishing |
| `validateTimelineEvent()` | Validate immutable event contract |
| `registerTimelineEventType()` | Register stage → event type binding |
| `getTimelineEventRegistry()` | Read in-memory registry snapshot |
| `getTimelineEventContract()` | Read mandatory contract surface |
| `certifyTimelineEventEngine()` | Run APP-5/2 certification suite |

## APP-5:1 Compatibility

APP-5:2 events map to the APP-5:1 `ScenarioTimelineEventContract` via `mapTimelineEventToFoundationContract()`:

- `stage` → `lifecycleStage`
- `timestamp` → `occurredAt`
- `contractVersion` remains `APP-5/1` on the foundation projection

APP-5:1 files are **not modified**.

## Explicitly Forbidden

- Timeline database / persistence
- Playback, search, filters, history viewers
- Timeline UI, charts, dashboard, assistant integration
- Simulation execution
- Notifications and synchronization

## Files

| File | Role |
|---|---|
| `scenarioTimelineEventConstants.ts` | Versioning, stage map, limits |
| `scenarioTimelineEventTypes.ts` | Domain types |
| `scenarioTimelineEventErrors.ts` | Engine error helpers |
| `scenarioTimelineEventIdentity.ts` | Event identity builder |
| `scenarioTimelineEventNormalizer.ts` | Input normalization |
| `scenarioTimelineEventValidator.ts` | Contract validation + APP-5:1 mapping |
| `scenarioTimelineEventBuilder.ts` | Immutable event builder |
| `scenarioTimelineEventFactory.ts` | Build/create orchestration |
| `scenarioTimelineEventRegistry.ts` | In-memory registry |
| `scenarioTimelineEventContracts.ts` | Stage manifest + contract surface |
| `scenarioTimelineEventEngine.ts` | Public engine entry point |
| `scenarioTimelineEventCertification.ts` | Certification suite |
| `scenarioTimelineEventEngine.test.ts` | Unit and certification tests |

## Certification

Run:

```bash
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelineEventEngine.test.ts
cd frontend && node --test app/lib/scenario-timeline/scenarioTimelinePlatformFoundation.test.ts
```

Regression:

```bash
cd frontend && node --test app/lib/executiveMemory/*.test.ts
```

## Status

**APP-5/2 — Scenario Timeline Event Engine — BUILD**

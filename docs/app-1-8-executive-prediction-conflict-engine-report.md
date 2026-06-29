# APP-1:8 — Executive Time Prediction & Conflict Engine Report

## Purpose

APP-1:8 implements the **Executive Prediction & Conflict Engine** — the sole authority for generating canonical Executive Predictions and Executive Conflicts across the Nexora platform. This extends APP-1:7.5 Prediction Authority Contract with deterministic evaluation pipelines. No ML, LLM reasoning, persistence, or business execution.

## Prediction Architecture

```
Prediction Request
        │
        ▼
Prediction Authority (validateExecutivePredictionRequest)
        │
        ▼
Prediction Engine (generatePrediction / generatePredictions)
        │
        ├───────────────┐
        ▼               ▼
Future Prediction   Conflict Detection
        │               │
        └──────┬────────┘
               ▼
Immutable Prediction Result
               │
               ▼
Future Consumers
```

The Executive Prediction Engine is the **only** component allowed to generate canonical predictions. The Executive Conflict Engine is the **only** component allowed to generate canonical conflicts. Neither engine mutates business entities or executes scenarios.

## Conflict Architecture

Conflict detection is metadata-driven and deterministic:

| Conflict Type | Trigger Signal |
|---------------|----------------|
| `temporal_overlap` | Camera context differs from declared time context |
| `transition_conflict` | Transition path blocked by transition engine |
| `approval_conflict` | Approval required for evaluated transition |
| `priority_conflict` | Entity priority is critical or urgent |
| `dependency_conflict` | Dependency forecast prediction type |
| `state_conflict` | Entity in terminal-like state (archived/completed) |
| `resource_reservation_metadata` | Resource reservation metadata present |
| `duplicate_prediction_request` | Duplicate request id in batch |
| `custom` | Fallback classification |

No automatic resolution is performed. Conflicts include `suggestedResolution` hints only.

## Prediction Pipeline

`generatePrediction()` steps:

1. Validate request via Prediction Authority
2. Gather read-only temporal signals (Context, Camera, State, Transition, Priority, Events)
3. Detect conflicts via Conflict Engine
4. Build contributing factors and confidence score
5. Generate deterministic explanation
6. Return frozen `ExecutivePredictionEvaluatedResult`

Batch generation via `generatePredictions()` tracks prior request ids for duplicate detection.

## Conflict Pipeline

`detectConflicts()` evaluates all applicable conflict rules against temporal signals and request metadata. `detectConflict()` returns the first detected conflict. `classifyConflict()` exposes conflict type for downstream resolution.

Conflict resolver APIs aggregate without executing resolution:

- `resolveConflictsByType()`
- `resolveHighestSeverityConflict()`
- `resolveConflictCountBySeverity()`

## Explanation Engine

`buildExecutivePredictionExplanation()` produces deterministic metadata explanations including:

- Why the prediction exists
- Contributing temporal signals (context, camera, state, priority, events)
- Detected assumptions
- Detected risks and warnings
- Detected conflict summaries

`formatExecutivePredictionExplanation()` renders a single-line explanation string. No LLM or AI generation.

## Immutable Models

### ExecutivePredictionEvaluatedResult

Fields: `predictionId`, `predictionCategory`, `predictionHorizon`, `confidence`, `assumptions`, `contributingFactors`, `explanation`, `warnings`, `conflicts`, `recommendationHints`, `dependencies`, `metadata`.

### ExecutiveConflictResult

Fields: `conflictId`, `conflictType`, `severity`, `affectedEntities`, `explanation`, `suggestedResolution`, `metadata`.

All results are frozen via `Object.freeze()`.

## Prediction Horizons

Supported horizons: `immediate`, `today`, `short_term`, `medium_term`, `long_term`, `custom`. Horizon may be overridden via request metadata or inferred from prediction type. No calendar execution — metadata only.

## Certification

Tags: `[APP1_8_EXECUTIVE_PREDICTION_ENGINE]`, `[EXECUTIVE_PREDICTION_READY]`, `[EXECUTIVE_CONFLICT_READY]`, `[IMMUTABLE_PREDICTION_RESULT]`, `[IMMUTABLE_CONFLICT_RESULT]`, `[DETERMINISTIC_PREDICTION]`, `[NO_UI_MUTATION]`

Gates A–Y verify engine, conflict engine, resolvers, explanation, generation, batch, conflict detection/classification, horizons, immutability, determinism, read-only dependencies, authority deferral, future contracts, UI isolation, and report.

Run:

```bash
cd frontend && node --test app/lib/executive-time/executivePredictionCertification.test.ts
cd frontend && node --test app/lib/executive-time/*.test.ts
```

## Tests

Lightweight tests cover:

- Single prediction generation
- Batch prediction with duplicate detection
- Prediction horizon metadata override
- Conflict detection and severity classification
- Immutable prediction and conflict results
- Explanation generation
- Prediction resolver aggregation
- Authority deferral regression (APP-1:7.5)
- Full certification gate pass

## Isolation Summary

No modifications to:

- Dashboard UI
- Assistant UI
- Timeline UI
- Time Panel UI
- Scenario Runtime
- Recommendation Runtime
- Executive Memory Runtime
- Audit Runtime
- Workspace Runtime
- Scene Runtime
- DS Runtime
- INT Runtime
- APP Runtime
- LAY Runtime

`requestPrediction()` in the Authority contract continues to throw `ExecutivePredictionExecutionDeferredError` — canonical entry is `generatePrediction()`.

## Deferred Features

- ML / statistical forecasting
- LLM-generated explanations
- Persistence and replay of predictions
- Dashboard / Assistant / Timeline integration
- Recommendation execution
- Scenario execution
- Automatic conflict resolution
- Calendar-based scheduling

## Next Phase

**APP-1:9 — Executive Time Integration**

Integrate Context, Camera, State, Transition, Priority, Events, and Prediction into a unified Executive Time API and platform service consumed by Dashboard, Assistant, Timeline, Executive Memory, Scenario Intelligence, and future LAY modules — without changing UI behavior until the final certification phase.

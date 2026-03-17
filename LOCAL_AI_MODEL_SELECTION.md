# Local AI Model Selection

## Purpose

Nexora uses local AI for tasks with different tradeoffs. Some requests need lower latency, some benefit from stronger reasoning, and some are primarily extraction-oriented. A single default model does not express those differences well.

The model selection engine gives Nexora a deterministic way to choose the most appropriate local model before calling Ollama, while keeping FastAPI as the orchestration boundary.

## Model Roles

### Default model

The default model is the safe baseline and fallback choice.

Use it when:

- model selection is disabled
- a preferred model is unavailable
- the system needs a stable compatibility path

### Fast model

The fast model is intended for latency-sensitive tasks.

Typical examples:

- intent classification
- lightweight routing decisions
- tasks where response speed matters more than deeper reasoning

### Reasoning model

The reasoning model is intended for analysis-heavy tasks.

Typical examples:

- scenario analysis
- explanation
- context summarization

### Extraction model

The extraction model is intended for structured object-oriented tasks.

Typical examples:

- object extraction
- entity identification
- candidate generation for deterministic downstream logic

## Request Flow

```text
Client
  -> FastAPI router
  -> LocalAIOrchestrator
  -> LocalAIModelSelectionEngine
  -> Ollama client
  -> structured response validation
  -> response mapping
  -> API response
```

Flow summary:

1. The router receives a Local AI request.
2. The orchestrator resolves task metadata.
3. The orchestrator asks the selection engine to choose a model.
4. The selection engine applies deterministic policy against configured model roles and currently available models.
5. The orchestrator sends the request to Ollama using the selected model.
6. The provider output is validated and mapped into Nexora’s typed response schema.

## Current Rules-Based Strategy

The current strategy is deterministic and configuration-driven.

Task mapping:

- `analyze_scenario` -> reasoning model
- `explain` -> reasoning model
- `summarize_context` -> reasoning model
- `extract_objects` -> extraction model
- `classify_intent` -> fast model

Overrides:

- if `latency_sensitive = true`, prefer the fast model
- if `quality_policy` is `high` or `reasoning`, prefer the reasoning model
- if a request explicitly sets a model, that requested model wins

The selection engine also checks the currently available models returned by Ollama before finalizing the decision.

## Fallback Behavior

Fallback behavior is designed to keep the Local AI Layer resilient.

Fallback path:

1. Try the preferred model for the task.
2. If that model is unavailable, fall back to the configured default model when possible.
3. If the default model is unavailable but Ollama reports other models, use the first available model.
4. If no models are available, return the configured default or the safe placeholder decision path.

Each selection result records whether fallback was used.

## Diagnostic Endpoints

### `POST /ai/local/select-model`

Returns the model Nexora would choose for a task without running inference.

Response includes:

- `selected_model`
- `selection_reason`
- `fallback_used`
- `model_class`
- `strategy`

This endpoint is intended for diagnostics and configuration checks.

### `GET /ai/local/selection-stats`

Returns compact in-memory metrics for recent selection activity.

Includes:

- total selections
- selections by model
- selections by task
- fallback rate
- selections by latency bucket
- recent selection history

These metrics are process-local and reset on backend restart.

## Observability

The selection engine records lightweight in-memory metrics for MVP diagnostics.

Each recorded event contains:

- task type
- selected model
- fallback used
- timestamp
- optional latency bucket

This supports basic operational questions such as:

- which models are selected most often
- whether fallback is happening too frequently
- which task types are driving model usage

## Future Extension Points

### Benchmark-driven tuning

Selection rules can be improved using Nexora-specific benchmark results instead of fixed defaults.

### Provider-aware selection

The current schema and service boundaries are generic enough to support non-Ollama providers later.

### Cost-aware selection

Future selection policy may consider hardware pressure, inference cost, or mixed local/cloud execution.

### Adaptive policy

The current rules are static. Future versions may adjust policy using observed latency, validation success, or fallback frequency.

## Design Constraints

The model selection engine is intentionally narrow in scope:

- it does not control scene logic
- it does not persist state to a database
- it does not require Redis or external infrastructure
- it does not change the public analyze contract

Its responsibility is limited to choosing the best available local model for a task in a predictable, testable way.

# Local AI Benchmark Tuning

## Purpose

Benchmark tuning lets Nexora combine deterministic task-based model routing with evidence from local benchmark runs. The goal is not to replace the rules-based selection engine, but to help it prefer models that have already performed well on Nexora-specific workloads.

The benchmark layer is advisory. Rules remain the first layer. Benchmark data adjusts ranking only when it is available and benchmark tuning is enabled.

## How It Fits with Rules-Based Selection

Selection still starts with the existing rules-based policy:

- task type determines the preferred model class
- latency-sensitive requests prefer the fast path
- explicit model requests still override policy
- fallback behavior remains unchanged

Benchmark tuning is applied after that initial task policy is resolved.

High-level flow:

1. Resolve the preferred model class using rules.
2. Load benchmark summary data from the local JSON report file.
3. Score available candidate models using:
   - static capability scores
   - benchmark metrics
4. Choose the highest-ranked available model.
5. If benchmark data is missing or invalid, fall back to the existing static selection path.

## Benchmark Metrics Used

The benchmark loader reads the benchmark summary file and extracts per-model metrics such as:

- average latency
- success rate
- JSON validity rate
- average extracted objects
- average risk signals
- average confidence

These values are normalized into per-model benchmark preferences used by the selection engine.

## Benchmark File Expectations

The benchmark tuning layer expects a local JSON file with a top-level `summary` array. Each summary entry should be keyed by model and can include:

- `model`
- `avg_latency_ms`
- `success_rate`
- `json_valid_rate`
- `avg_objects_detected`
- `avg_risk_signals`
- `avg_confidence`

Entries that are missing a valid model name are ignored. Missing or malformed files do not stop selection; the engine falls back to static rules.

## Task-Specific Tuning Behavior

### Reasoning-oriented tasks

Examples:

- `analyze_scenario`
- `explain`
- `summarize_context`

Reasoning tasks prioritize:

- success rate
- confidence
- stable structured responses

### Extraction-oriented tasks

Examples:

- `extract_objects`

Extraction tasks prioritize:

- JSON validity
- extraction quality
- successful structured completion

### Latency-sensitive tasks

Examples:

- `classify_intent`
- requests marked `latency_sensitive=true`

Latency-sensitive tasks prioritize:

- lower average latency
- acceptable success rate
- acceptable JSON validity

## Configuration

Benchmark tuning is controlled by these settings:

- `AI_BENCHMARK_TUNING_ENABLED`
- `AI_BENCHMARK_RESULTS_PATH`
- `AI_BENCHMARK_WEIGHT_LATENCY`
- `AI_BENCHMARK_WEIGHT_SUCCESS`
- `AI_BENCHMARK_WEIGHT_JSON_VALIDITY`
- `AI_BENCHMARK_WEIGHT_EXTRACTION`
- `AI_BENCHMARK_WEIGHT_REASONING`
- `AI_BENCHMARK_MIN_SUCCESS_RATE`

If tuning is disabled, the selection engine behaves exactly like the current rules-based implementation.

## Scoring Overview

Selection still begins with deterministic task routing. Benchmark data is only used to re-rank available candidates.

Scoring inputs:

- static capability score from the model profile
- benchmark success rate
- benchmark latency
- benchmark JSON validity
- benchmark extraction quality
- benchmark confidence

Task emphasis:

- reasoning tasks emphasize success rate and confidence consistency
- extraction tasks emphasize JSON validity and extracted object quality
- latency-sensitive tasks emphasize lower latency with acceptable reliability

Guardrail:

- models below `AI_BENCHMARK_MIN_SUCCESS_RATE` do not receive a benchmark boost

This keeps the benchmark layer explainable and prevents weak benchmark performers from overriding the static safe baseline.

## Fallback Behavior

Benchmark tuning must never break model selection.

Safe fallback behavior:

1. If the benchmark file is missing, ignore benchmark tuning.
2. If the benchmark file is malformed, ignore benchmark tuning.
3. If a model has no benchmark entry, its benchmark score is treated as zero.
4. If the preferred model is unavailable, use the existing fallback path.

This keeps benchmark tuning deterministic and non-destructive.

## Diagnostic Visibility

### `POST /ai/local/select-model`

The diagnostic selection endpoint exposes:

- `selected_model`
- `selection_reason`
- `fallback_used`
- `benchmark_used`

This makes it clear whether the decision came purely from static policy or whether benchmark data influenced the result.

### `GET /ai/local/selection-stats`

Selection stats remain lightweight and in-memory. They show:

- selection counts
- selection distribution by task
- fallback rate
- recent history

These stats are process-local and reset on restart.

## Operational Expectations

Benchmark tuning is intended to be:

- deterministic
- explainable
- safe to disable
- resilient when benchmark data is missing

It is not:

- a training system
- an optimization service
- a replacement for explicit routing rules

## Future Extension Points

### Benchmark-driven tuning refinement

Current weighting is simple and static. Future versions can refine weights per task family using stronger benchmark coverage.

### Provider-aware tuning

The same approach can later be applied to cloud providers if Nexora supports multiple execution backends.

### Cost-aware selection

Future selection policy can incorporate resource usage, inference cost, or hardware pressure alongside benchmark results.

### Adaptive policy

Future policy may adjust weights over time based on observed production outcomes, while keeping the decision path explainable.

# AI End-to-End Evaluation

## Purpose

This harness evaluates Nexora's full AI routing pipeline as a system.

It checks whether privacy classification, routing, provider selection, model selection, execution, fallback, audit logging, and structured response handling behave as expected for realistic scenarios.

## Benchmark vs Evaluation

- Model benchmark measures individual model quality or latency in isolation.
- Routing benchmark measures policy or selection behavior for a narrower routing concern.
- End-to-end evaluation measures the complete orchestrated pipeline and verifies that all stages align with policy and produce valid structured output.

## Evaluation Case Structure

Each case defines:

- a realistic input request
- provider availability and deterministic mock execution behavior
- expected privacy outcome
- expected routing and provider outcome
- expected fallback behavior
- expected structured response validity
- expected audit stages

## Stage-Based Scoring

Each case is scored across these checks:

- privacy classification
- routing decision
- provider selection
- model selection
- fallback behavior
- structured response validity
- audit completeness and redaction safety

Scores are deterministic and derived from typed comparisons only.

## Execution Modes

Current MVP mode uses deterministic mocked providers while exercising the real orchestrator, privacy classifier, routing policy, model selection engine, validators, and audit logger.

This keeps the harness repeatable and avoids requiring a real Ollama server or cloud credentials.

## Report Outputs

The harness generates:

- a console summary
- a JSON report file, defaulting to `backend/tools/e2e_ai_eval/e2e_eval_results.json`

The JSON report includes per-case stage assertions and an aggregated summary.

## How To Run

From the repository root:

```bash
python3 backend/tools/e2e_ai_eval/eval_runner.py
```

Run a subset of cases:

```bash
python3 backend/tools/e2e_ai_eval/eval_runner.py --case provider_unavailable_fallback_case --case benchmark_influenced_selection_scenario
```

Write to a custom output file:

```bash
python3 backend/tools/e2e_ai_eval/eval_runner.py --output backend/tools/e2e_ai_eval/custom_eval_results.json
```

## Future Extension Points

- regression suites with curated policy snapshots
- tenant-specific evaluation packs
- policy conformance packs
- scheduled or CI-driven continuous evaluation

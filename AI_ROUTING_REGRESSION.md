# AI Routing Regression

## Purpose

The regression suite protects Nexora's AI routing architecture from unintended behavior changes.

It verifies that privacy classification, routing, provider selection, model selection, fallback handling, audit logging, and structured response validation still behave as expected after code changes.

## Protection Scope

The suite acts as a deterministic merge gate for:

- privacy policy enforcement
- routing policy decisions
- provider abstraction behavior
- model selection policy
- fallback behavior
- audit trail completeness
- end-to-end orchestration behavior

## Test Categories

- `privacy`: privacy classification regression checks
- `routing`: routing policy regression checks
- `provider`: provider abstraction regression checks
- `model_selection`: model selection regression checks
- `fallback`: fallback behavior regression checks
- `audit`: audit logging regression checks
- `e2e`: end-to-end pipeline regression checks
- `regression`: umbrella marker for the full suite

## CI Pipeline Stages

The GitHub Actions workflow runs these stages:

1. backend syntax validation
2. fast regression subset
3. full routing regression suite
4. end-to-end evaluation harness artifact generation

Any stage failure produces a failing workflow and should block merging on protected branches.

## Local Execution

Run the full regression suite:

```bash
pytest backend/tests/ai_regression
```

Run only routing checks:

```bash
pytest -m routing
```

Run end-to-end regression checks:

```bash
pytest -m e2e
```

Run the standalone evaluation harness:

```bash
python3 backend/tools/e2e_ai_eval/eval_runner.py
```

## Interpreting Failures

- privacy failures indicate classification behavior changed
- routing failures indicate provider choice changed
- provider failures indicate abstraction or registry issues
- model selection failures indicate task-policy drift
- fallback failures indicate safety-path regressions
- audit failures indicate missing or unsafe audit events
- end-to-end failures indicate orchestration drift across multiple stages

## Evaluation Harness Relationship

- the evaluation harness provides reusable deterministic end-to-end cases
- the regression suite reuses those cases inside pytest
- the CI gate runs both regression tests and harness-driven artifact generation

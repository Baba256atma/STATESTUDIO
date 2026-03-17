# AI Routing Regression Suite

## Purpose

The regression suite prevents unnoticed policy drift in Nexora's AI routing system.

It verifies that established routing behavior remains stable across privacy classification, routing, provider selection, model selection, fallback handling, audit logging, structured response validation, and evaluation harness execution.

## Evaluation Harness vs Regression Suite

- the evaluation harness executes deterministic end-to-end scenarios and produces scored results
- the regression suite selects critical scenarios from that harness and treats them as merge-gating checks
- the CI gate runs the regression suite automatically and blocks changes when expected behavior changes

## CI Gate

The CI gate runs:

1. backend syntax validation
2. fast routing-related regression markers
3. full regression marker suite
4. regression report generation

If any regression check fails, the workflow fails and should block merge or deployment promotion.

## Adding New Regression Scenarios

1. add or update a deterministic evaluation case in the evaluation harness
2. register it in `backend/tests/ai_regression/regression_cases.py`
3. assign the most relevant regression category
4. confirm the case passes in `regression_runner.py`

## Local Execution

Run the pytest regression suite:

```bash
pytest backend/tests/ai_regression
```

Run the shell entrypoint used by CI:

```bash
./scripts/run_ai_regression.sh
```

Run the regression runner directly:

```bash
python3 backend/tests/ai_regression/regression_runner.py --verbose
```

## Interpreting Failures

- privacy failure: classification no longer matches expected policy
- routing failure: provider path changed unexpectedly
- provider failure: provider resolution or selection behavior changed
- model selection failure: selected model or benchmark influence drifted
- fallback failure: fallback behavior changed or safety handling broke
- audit failure: expected stages were missing or unsafe audit fields appeared

## Future Extension Points

- policy drift detection across historical baselines
- performance regression thresholds
- prioritized regression subsets for faster presubmit workflows

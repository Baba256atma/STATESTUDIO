# OUT-EVAL-LIVE:1 findings

## Root cause (closed)

Live CORE-OUT:1A capture registered Execution without Decision expected-outcome binding. CORE-OUT:1A therefore rejected every current KPI as `missing-outcome-link` / `current-kpi-unlinked`. CC:5 did not host MVP-OUT:1 `integrateNexoraOutcomeLearningRuntime`, so CORE-OUT:1 never ran on the RMS conversation path.

A second live defect: `integrateNexoraOutcomeLearningRuntime` could replace that context with a `timing-incomplete` window when Decision `committedAt` is absent, blocking eligibility even after expected was bound.

## Repair classification

Product integration on existing MVP-OUT:1 / CORE-OUT:1A / CORE-OUT:1 seams. Not a new Outcome engine.

## Residual (out of scope)

- CORE-OUT:2 Learning
- Numeric expected vs observed comparison without a canonical numeric target (comparison-incomplete is valid)
- Full SIM-TEST:10 population recertification

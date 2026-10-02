# SIM-TEST:10-R2 findings

## First divergence

Observation → CORE-OUT:1 Evaluation.

CORE-OUT:1A captured KPI observations after publication. All captures have `eligibleAsActualOutcome = false` (`missing-outcome-link`, `current-kpi-unlinked`). CC:5 does not invoke `projectLiveOutcomeIntelligence`.

## Not a regression of COMMIT-LIVE / OUT-LIVE

Decisions > 0, Executions > 0, Observations > 0. FIX1 wrong-thread Execution = 0. FIX2 stale Scenario reuse = 0. Ground Truth leaks = 0.

## NPS/ECA are not the missing evaluation

NPS:8 may show PARTIAL/BOUNDED. `writesOutcome` / `writesLearning` remain false. Durable Learning = 0. Family J reassessment after capture clarifies (“Which item do you mean?”).

## Classification

Capability gap on live CC:5, not a new Outcome/Learning engine request. Focused CORE-OUT / MVP-OUT / ECA suites still pass in isolation.

## Do not repair in R2

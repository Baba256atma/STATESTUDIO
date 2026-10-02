# SIM-TEST:10-R4 findings

OUT-BASE:1 held: 25 inspections have baseline + actual + expected direction; `baseline-missing` = 0.

CORE-OUT:1 still cannot become `comparison-ready` because live actuals have `observedDirection = null` (hardcoded in CORE-OUT:1A `toEvaluatorObservation`) and no Scenario `numericTarget`.

CORE-OUT:2 inconclusive / not-promotion-eligible is correct no-learning.

Do not repair in R4.

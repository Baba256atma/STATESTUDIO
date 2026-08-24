# Decision Expected Outcome Binding

Identity: `MVP-OUT:1-R2/DecisionExpectedOutcomeBinding` 1.0.0

Contract: `DecisionExpectedOutcomeBinding`

- `bindingId` = `bind:{decisionId}:{expectationId}` (stable across recomposition; revised `expectationId` yields a new binding)
- Allowed only from an explicit canonical `ExecutiveOutcomeExpectation` with dimension, unit, and (numericTarget | direction | comparator)
- Rejected: Advisor prose, Stage labels, scenario summary alone, current KPI target

Live Decisions `ctx-decision-capacity` and `ctx-decision-reprice`: **MISSING** measurable binding. No target was invented.

TEST-ONLY bindings exist when a caller supplies a canonical measurable expectation (capacity-utilization, percent, lte 80).

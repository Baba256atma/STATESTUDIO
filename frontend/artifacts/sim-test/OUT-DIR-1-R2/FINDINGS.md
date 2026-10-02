# OUT-DIR:1-R2 findings

## Seam

`toEvaluatorObservation` hardcoded `observedDirection: null` after RDI-DIR:1 already produced canonical published KPI direction.

## Repair

Match the CORE-OUT:1A capture to a published KPI observation (subject, kpiId, sourceContextId, observedAt) and forward `projectPublishedKpiObservedDirection`. No baseline/actual arithmetic.

## Downstream

Family A: expected `maintain`, observed `increase` → CORE-OUT comparison-ready / not-met under existing qualitative policy. Learning not certified.

# RDI-DIR:1 findings

## Root cause of OUT-DIR:1

Published Data Reality KPIs were numeric-only, and CSV replacement left only the latest source snapshot as current truth. There was no canonical published observation history from which to derive descriptive KPI direction.

## Repair

On RDI:2 commit, record published `NexoraKPIResult` snapshots (same-timestamp replace = correction). Project `increase`/`decrease`/`stable` from same subject + kpi + source + earlier `observedAt`. Live RDI:4 journals are included in the same projection.

## Not in this phase

CORE-OUT:1A still emits `observedDirection: null`. Evaluative `improved`/`worsened` is not assigned. OUT-DIR:1-R2 is the projection recertification.

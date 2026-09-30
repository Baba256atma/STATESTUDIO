# SIM-TEST:4-FIX1 root cause

Shared earliest seam: **named semantic targets with zero legitimate catalog/history identity were treated as successful resolution.**

## A/B — Project Resource and Schedule

No `obj-resource` or `obj-schedule` exists in the MVP catalog. NLU therefore had no identity match. CC:5 `topicSwitch` still treated `what about` as a catalog presentation because it fell through to the current primary subject (`obj-delivery`). Observer saw a named CHANGE_CONTEXT that stayed on Delivery.

## C — Unknown Supplier return

`go back to the supplier problem` is a named historical return. Continuity correctly found no Supplier candidate. CC:5 then rewrote unknown FOCUS from NLU, and NLU could recover `problem` by kind/fuzzy onto another Problem (`Margin Pressure`). Clarification was skipped because NLU still had an objectReference (`namedNlu`).

## D — Advisor Capacity Gap on Delivery

Executive/Stage/MLEVEL stayed on Delivery. `What is the problem?` is a typed kind reference. Continuity preferred `CONTEXT_ACTIVE_INVESTIGATION` (Capacity Gap) over the current object because Delivery is not `subjectKind: problem`. NXA:1 then consumed that NLU/NCA2 subject.

## Not owners

NMI, MLEVEL, Stage, Director, Operator, CSV, RDI, and Data Reality were not the first divergent layer.

# SIM-TEST:2 run and aggregate report

Certification run IDs are `cert-0` through `cert-3`.

| Scenario | Turns | Ticks | CSV versions | Gate commits | Harness | Observed product | Signature |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| manufacturing-capacity-pressure | 4 | 21 | 12 | 8 | PASS | FAIL — 2 S1 | `fnv1a32:0dd20b11` |
| project-delivery-pressure | 3 | 5 | 4 | 4 | PASS | PASS | `fnv1a32:28d59f86` |
| logistics-delivery-pressure | 1 | 4 | 2 | 1 | PASS | FAIL — 2 S1 | `fnv1a32:7c296aef` |
| service-capacity-pressure | 1 | 4 | 2 | 1 | PASS | FAIL — 2 S1 | `fnv1a32:dc5d17f5` |

Aggregate:

- Journeys/domains: 4 / 4.
- Manager turns: 9.
- Simulation ticks: 34.
- Materialized source files: 10.
- Generated file versions in reports: 20.
- Findings: S0 0, S1 6, S2 0, S3 0.
- Owners: DATA_REALITY 3, OPERATOR 2, ADVISOR 1.
- Harness failures: 0.
- Runs containing product findings: 3.
- Reproducibility projection: PASS.
- Auto-repair: none.

Manufacturing proves file evolution at ticks 0, 7, and 21. Production changes from total/used capacity `110/100` to `85/85`; the final version commits through the real Gate. Project proves the same path for PMO and Project Control. Logistics and Service prove bounded source/domain parity while preserving genuinely absent Inventory and HR rows.

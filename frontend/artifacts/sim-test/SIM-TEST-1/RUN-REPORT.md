# SIM-TEST:1 run and aggregate report

Certification run IDs use `cert-0` through `cert-3`. All four harness executions completed through certified RMS and production CC:5.

| Scenario | Journey | Turns | Ticks | Harness | Observed product | Signature |
| --- | --- | ---: | ---: | --- | --- | --- |
| manufacturing-capacity-pressure | baseline-manager-investigation-manufacturing | 4 | 21 | PASS | FAIL — 1 S1 | `fnv1a32:0cbd0ab9` |
| project-delivery-pressure | baseline-manager-investigation-project | 3 | 5 | PASS | PASS | `fnv1a32:5525a370` |
| logistics-delivery-pressure | parity-logistics | 1 | 4 | PASS | FAIL — 1 S1 | `fnv1a32:84baf318` |
| service-capacity-pressure | parity-service | 1 | 4 | PASS | FAIL — 1 S1 | `fnv1a32:ac08ce36` |

## Aggregate

- Journeys/domains: 4 / 4.
- Manager turns: 9.
- Simulation ticks: 34.
- Findings: S0 0, S1 3, S2 0, S3 0.
- Likely owners: ADVISOR 1, OPERATOR 2.
- Harness failures: 0.
- Runs containing product findings: 3.
- Reproducibility projection: PASS.
- Auto-repair: none.

## Preserved findings

### Manufacturing — S1

- Classification: `NEXORA_ERROR/CAUSAL_OVERCLAIM`.
- Likely owner: ADVISOR.
- Tick/turn: 21 / 4.
- Observer evidence: `m:causal:3`; “Confirmed causal language without information-bounded evidence.”
- Visible record refs include `orders_received:21`, `requested_quantity:21`, `CAP_AV:21`, `produced_quantity:21`, `inventory_quantity:21`, and `machine_status:21` under RMS run `rms:cert-0`.
- Final Manager turn: “What can change?”
- Final product state: no active subject, MLEVEL depth 0, Stage overview/NO_CHANGE, three accepted Data Reality publications.
- No repair was attempted.

### Logistics — S1

- Classification: `OPERATOR_ERROR/OBSERVATION_GAP`.
- Likely owner: OPERATOR.
- Tick/turn: 4 / 1.
- Observer evidence: `m:ab:CAP_AV`, `m:ab:produced_quantity`; available capacity had no available `CAP_AV` observation.
- Published visible refs: `orders_received:4`, `requested_quantity:4`, `inventory_quantity:4` under `rms:cert-2`.
- One accepted Data Reality publication. No repair was attempted.

### Service — S1

- Classification: `OPERATOR_ERROR/OBSERVATION_GAP`.
- Likely owner: OPERATOR.
- Tick/turn: 4 / 1.
- Observer evidence: `m:ab:produced_quantity`, `m:ab:actual_progress`, `m:ab:resource_usage`; demand had no available `produced_quantity` observation.
- Published visible refs: `orders_received:4`, `requested_quantity:4` under `rms:cert-3`.
- One accepted Data Reality publication. No repair was attempted.

These integrated findings do not invalidate historical RMS, MLEVEL, NMI, VAI, NPS, or Stage certifications. They are reproducible investigation inputs for a later repair decision.

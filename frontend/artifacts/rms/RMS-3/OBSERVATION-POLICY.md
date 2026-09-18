# NPA-T RMS:3 — Observation policy

`RMS_DEFAULT_OBSERVATION_POLICY` maps Ground Truth keys to operational fields.

| Ground Truth key | Observable field | Source | Notes |
| --- | --- | --- | --- |
| demand | orders_received | ERP | identity |
| demand | requested_quantity | CRM | identity |
| availableCapacity | CAP_AV | PRODUCTION | no confirmed meaning |
| demand + availableCapacity | produced_quantity | PRODUCTION | min(demand, capacity) |
| inventory | inventory_quantity | INVENTORY | delayTicks = 1 |
| machineAvailability | machine_status | MAINTENANCE | running / stopped, not causal |
| plannedProgress | planned_progress | PMO | project |
| projectProgress | actual_progress | PROJECT_CONTROL | project |
| staffAvailable | resource_usage | PMO | project |
| scheduleVarianceDays | schedule_observation | PROJECT_CONTROL | project |

Always-emitted imperfect records:

- `downtime_unreported` — MISSING
- `last_cycle_count` — STALE

No rule publishes “Machine A caused the delivery problem” or any `causalClaim`.
`hiddenGroundTruthKey` is always null on emitted records.

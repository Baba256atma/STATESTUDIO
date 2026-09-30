# SIM-TEST:6 Long Session Plan

Discovery plan recorded before the first long-session run. This file does not prescribe Nexora answers.

## Authority

- Manager Agent → CC:5 → production Nexora authorities
- RMS Ground Truth remains simulation-only
- Observer remains read-only
- Harness orchestrates tests; it is not production intelligence
- No Long Session / Memory / Stress / Conversation / CSV agents

## Determinism

- Scenario versions: `1.0`
- Disturbance: `CERTIFIED_SCENARIO_SCHEDULE`
- Starting mode: `WATCH`
- Signatures: existing harness `fnv1a32`
- Isolated `runId` per journey

## Primary — Manufacturing

| Field | Value |
| --- | --- |
| Journey ID | `sim-test-6-manufacturing-long` |
| Scenario | `manufacturing-capacity-pressure` |
| Manager profile | `DATA_DRIVEN_MANAGER` |
| Data mode | `INGESTION` |
| Target Manager turns | 100–150 (planned 110) |
| Tick budget | 21 |
| Planned publishes | tick 0, 7, 21, then a late republish at 21 |

Planned lifecycle families: orientation, problem investigation, evidence, variables, scenario discussion/comparison, Decision, Execution, early Outcome, later Outcome, subject switch, historical return, unknown named issue, clarification, data update, evidence refresh, causal question, active Execution query, new management issue.

Planned subjects (only if already canonical): Capacity, Capacity Gap, Delivery, Customer, Inventory, Demand, Revenue, Budget, Margin.

Planned subject-switch pattern: A→B→C→A→D→B with conversation between switches.

Planned historical returns after substantial distance, deictic probes at 5/10/20+ turns, named-issue known/unknown, PRODUCT_FICTION, clarification then topic change, Stage click and conversational select, MLEVEL L2/L3 if parent exists.

Checkpoints: every ~10 Manager turns plus Decision, Execution, data-publish, and late Outcome.

## Secondary — Project

| Field | Value |
| --- | --- |
| Journey ID | `sim-test-6-project-long` |
| Scenario | `project-delivery-pressure` |
| Manager profile | `STANDARD_MANAGER` |
| Data mode | `INGESTION` |
| Target Manager turns | 60–100 (planned 68) |
| Tick budget | 15 |

Project-specific pressure: delivery, project evidence, unknown schedule/resource nouns (clarify, do not invent Objects), historical return to Delivery, Decision/Execution if legitimate, Outcome timing.

## Parity

| Journey | Scenario | Profile | Mode | Target turns |
| --- | --- | --- | --- | --- |
| Logistics | `logistics-delivery-pressure` | `STANDARD_MANAGER` | INGESTION | 36 |
| Service | `service-capacity-pressure` | `STANDARD_MANAGER` | INGESTION | 36 |
| FAST | `manufacturing-capacity-pressure` | `DATA_DRIVEN_MANAGER` | FAST | 36 |
| Impatient | `manufacturing-capacity-pressure` | `IMPATIENT_MANAGER` | INGESTION | 36 |

FAST matches the bounded opening of Manufacturing (orientation through first Execution attempt), not the full 110-turn script.

## Isolation

After the primary run, a fresh Manufacturing orientation journey with a new `runId` inspects observable Nexora/session identity for carryover.

## Repair policy

No production repair during discovery. S0 stops the affected run. Material S1 → NOT CERTIFIED. No SIM-TEST:6-FIX1 inside this phase.

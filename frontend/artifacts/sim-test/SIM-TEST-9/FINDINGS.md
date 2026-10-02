# SIM-TEST:9 findings

## ST9-S1-WRONG-EXECUTION-BINDING

- Severity: S1, manager-dangerous.
- Classification: product defect; `WRONG_EXECUTION_REFERENT` / `CROSS_THREAD_REFERENT`.
- Scenario/profile/seed: `manufacturing-capacity-pressure@1.0` / `DECISION_ORIENTED_MANAGER` / `11`.
- Tick: 0, current publication available.
- Expected: Delivery is active and has no committed Decision, so `Start it.` clarifies or refuses.
- Actual: the Capacity Decision is selected and executed while canonical subject, L1, Stage, and Advisor are Delivery.
- Deterministic replay: `fnv1a32:61197640` = `fnv1a32:61197640`.
- First divergent owner for the S1: CC:5 execution handoff Decision selection.
- Production seam: `conversationalExperienceOrchestrator.ts:5420-5438`.
- Canonical Decision: `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`.
- Canonical Execution: `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`.

The CC:11 link is internally consistent with the Decision ID it receives. The defect is that CC:5 obtains the first Approved Decision globally instead of establishing a context-valid execution referent.

## ST9-S2-SCENARIO-SET-CONFUSION

- Severity: S2.
- Classification: product defect candidate; `SCENARIO_SET_CONFUSION`.
- Expected at T6: Delivery-scoped options or honest unavailability.
- Actual at T6: with canonical/L1/Stage Delivery, `Options.` retains `cc9:scenario:intervention:obj-capacity:v1` and says `Investigate Capacity aligns better`.
- Disposition: preserved but not root-merged with the S1. No repair was made.

## Known NPS S3 debt

At T5–T8, NPS continues to label `Capacity Gap` while the canonical, L1, and Stage subject is Delivery. These four observations match the certified pre-existing NPS label mismatch and are not promoted to a new SIM-TEST:9 root.

## Turn evidence

| Turn | Manager | Canonical / L1 / Stage | Decision count | Execution count | Result |
| ---: | --- | --- | ---: | ---: | --- |
| 2 | `Capacity. Details.` | Capacity / Capacity / Capacity | 0 | 0 | Capacity active |
| 3 | `Options.` | Capacity / Capacity / Capacity | 0 | 0 | Capacity options |
| 4 | `Go with B.` | Decision / Capacity / Capacity | 1 | 0 | Capacity Decision approved |
| 5 | `Delivery. Details.` | Delivery / Delivery / Delivery | 1 | 0 | Explicit switch succeeds |
| 6 | `Options.` | Delivery / Delivery / Delivery | 1 | 0 | Capacity options persist (S2) |
| 7 | `Go with A.` | Delivery / Delivery / Delivery | 1 | 0 | Clarifies; no Decision write |
| 8 | `Start it.` | Delivery / Delivery / Delivery | 1 | 1 | Capacity Execution created (S1) |

No Ground Truth leak, duplicate Decision, duplicate Execution, or auto-repair occurred.

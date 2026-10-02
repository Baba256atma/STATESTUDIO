# SIM-TEST:9-R2 findings (measurement only)

Evidence: `population-run.json`. No production repair.

## FIX1 — closed in this recert

Original blocker `fnv1a32:61197640` remains sealed as historical S1 evidence.

Repaired replay `fnv1a32:c5462932` = `fnv1a32:c5462932`. Final subject Delivery. `Start it.` → clarification, Execution ledger empty. Capacity Decision not executed.

Population execution commands: 18 (17 deictic, 1 explicit). Clarifications: 14. Executions created: 3, all `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` while the active Decision was that Capacity Decision. Delivery-context `Start it.` clarified. Wrong cross-thread Execution: **0**. FIX1 regressions: **0**.

## Product S2 — Scenario-set confusion (unresolved)

Detector: `Options.` / EXPLORE_OPTIONS while canonical subject is Delivery or Revenue, but active Scenario remains `cc9:scenario:intervention:obj-capacity:v1` (Investigate Capacity), primary subject `obj-budget`.

| Journey family | Profile | Turns |
| --- | --- | --- |
| C_SCENARIO_SETS | AMBIGUOUS_MANAGER | T4 |
| D_MULTI_DECISION | DECISION_ORIENTED_MANAGER | T5, T8 |
| E_DECISION_EXECUTION_CONCURRENCY | DISTRACTED_MANAGER | T7 |
| F_MULTI_OUTCOME | INVESTIGATIVE_MANAGER | T7 |
| J_ORDINAL_STRESS | DATA_CHALLENGING_MANAGER | T7 |
| K_LONG_SESSION | STRUCTURED_MANAGER | T4, T12 |

Occurrences: **8**. Unique journeys: **6**. Deterministic replays: all 6 matched.

Root hypothesis (not repaired): Scenario session / CC:9 candidate set is not re-scoped to the Problem that just became canonical. This is one root, not six. Owner: existing Scenario session consumed by CC:5, not a new engine.

Wrong Scenario **committed** as a Decision: **0**. Delivery/Revenue `Go with A/B` clarified and did not write a second Decision. Family C after `Back to Capacity.` then `Let's go with the second option.` wrote Capacity `No Action on Capacity` — that write is Capacity-scoped, not MAR-B / Delivery.

Observed max Scenario sets in a ledger at once: **1**. Independent Delivery/Margin sets never coexisted in the ledger. Multi-Decision (D2/D3) therefore never appeared (`maxDecisions` = 1). That is a downstream consequence of this S2, not a separate Decision-identity bug.

Severity remains **product S2** (material multi-thread Scenario identity failure). It does **not** escalate to S1 in this population because no wrong-thread Decision write was observed. G3 therefore fails certification.

Recommended next phase name (not started): **NPA-T SIM-TEST:9-FIX2 — Context-Scoped Scenario Set Resolution**. Smallest seam: re-scope Scenario ordinals/session to the management context that established the set; clarify when the set does not belong to the current Problem.

## Other measured identity splits (not FIX1)

**B T5** `Go back to the first risk.`: L1 / Stage / Advisor = `obj-risk`; canonical stayed `obj-capacity`. Historical return reached presentation layers without moving canonical subject. Classified product S2 presentation/canonical lag; no Risk Decision or Execution written.

**G T4–T5** related-object questions (`What does that do to Delivery/Revenue?`): Advisor and canonical followed the named related Object; L1/Stage stayed on Capacity. Classified as related-object discussion / Observer over-fire for WRONG_REFERENT, not a wrong Decision. Not folded into Scenario-set S2.

## Known debt (not repaired)

- NPS Capacity-label mismatch: SUBJECT_LOSS S3 rows (18) plus named-missing S1 Observer rows for absent titles (Schedule, Milestone, Staffing, Resources).
- Advisor Delivery vs Capacity on SIM-TEST:8 Recovery reassessment (6 raw ADVISOR_DIVERGENCE). Invented reassessment titles: **0**.

## Ground Truth

Unpublished asks checked: 26. Leak hits: **0**.

## Stop rule

No S1 made later population evidence invalid. Full 160 journeys completed. Scenario-set S2 is preserved, not repaired.

# SIM-TEST:5-FIX2 — root-cause ledger

## Family 1 — T15 UNSUPPORTED_CAUSAL_CLAIM

- Symptom: After FIX1, manufacturing T15 (“Yes, that's the decision.”) showed NCA:2 overlay “strengthens the capacity-pressure hypothesis… without treating capacity as a confirmed cause.” Observer classified CAUSAL_OVERCLAIM because of substring `confirmed cause`.
- Temporal position: T15 is CC:10 `already-committed` follow-up. Execution starts at T17. This was not an observed execution outcome.
- First divergence: CC:5 allowed NCA:2 to replace the locked Decision presentation after `decisionCommitmentResult.status === "already-committed"`.
- Earliest owner: CC:5 presentation composition (`conversationalExperienceOrchestrator.ts`), not CC:10 write, not VAI inference, not Ground Truth.
- Why existing safety failed: `lockPresentedResponse` already existed for data-library and targeted deictic investigation; Decision commitment statuses were not included. VAI was not the causal author of this sentence; NCA:2 hypothesis overlay was.
- Production repair: extend `lockPresentedResponse` to `applied` | `already-committed` | `confirmation-required`. Presented text remains “That Decision is already committed.”
- Focused regression: manufacturing T15 match `/already committed/i`; no `UNSUPPORTED_CAUSAL_CLAIM`; Decision id/count unchanged.

## Family 2 — T38 ADVISOR_DIVERGENCE

- Symptom: “Teleport all inventory…” — conversation stayed Capacity; Advisor followed Inventory.
- First divergence: NXA:1 `resolveNxaAdvisorTurnContract` treated PRODUCT_FICTION `objectReference` (inventory) as explicit referent; NCA:2 TOPIC_SHIFT activated Inventory (`warehouse` matches FINAL:6.5 fiction).
- Earliest owner: NXA:1 referent selection + NCA:2 subject activation on PRODUCT_FICTION.
- Why SIM-TEST:4-FIX1 did not cover this: 4-FIX1 prevents stale Advisor context from overriding current canonical subject. T38 is the inverse — an unsupported action noun activating a new subject. Lifecycle Decision/Execution did not force Inventory; the fiction noun did.
- Production repair: PRODUCT_FICTION / UNKNOWN need does not consume incidental `objectReference`; NCA:2 does not shift/activate incoming subject when `classifyGuidanceIntent === PRODUCT_FICTION`. Response remains workspace refusal; canonical/conversation/Advisor Capacity-family aligned.
- Focused regression: T38 `/can't do that from this workspace/`; no `ADVISOR_DIVERGENCE`; NXA teleport unit keeps Capacity referent.

## Family 3 — Logistics/Service Production.csv

- Symptom: T4 “What data supports that?” cited `Production.csv` while ingested sources were ERP+Inventory (logistics) or CRM+HR (service).
- Existence proof: Production.csv was **not** generated or ingested for those scenarios (`SIM_TEST_SCENARIO_CSV_SOURCES`). Manufacturing **does** ingest PRODUCTION.
- First divergence: RDI CSV import store is workspace-scoped (`overview`). Sequential SIM-TEST journeys reused leftover manufacturing imports. Advisor DATA-ADV:1 `objectDataAnswer` cited accepted sources in that store. Not a template that invented Production.csv; not Operator generating a false file.
- Earliest owner: SIM-TEST harness isolation of the existing RDI store (test boundary), not Operator CSV generation.
- Forbidden repair rejected: creating Production.csv for Logistics/Service.
- Production/test repair: `resetCsvRealDataImportStoreForTests()` at `runNexoraSimulationTestJourney` start. After reset, Advisor: “I don't see an accepted source currently supporting Capacity.” ERP/CRM are ingested but not mapped as Capacity evidence — absence is preferred to fabricated Production.csv.
- Manufacturing T4 remains “Production.csv provides accepted Capacity data.” Legitimate Production.csv use preserved.

## Not repaired

Named-issue clarification (manufacturing T28/T31, project T13/T16) is a separate conversation owner. T31 already states Execution is active; Observer still flags REPEATED_CLARIFICATION. Out of FIX2 first pass.

CC:10, CC:11, NMI, MLEVEL, Stage, Operator/Data, Outcome, Learning: not modified as owning repairs.

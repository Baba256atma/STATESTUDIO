# Browser runtime evidence

Runtime target: `http://127.0.0.1:3000/executive/watch`, exercised in Chrome on 2026-09-27.

Observed proof:

1. The page loaded with four interactive scenario buttons.
2. Manufacturing was selected and its `Start simulation` action entered WATCH.
3. At `Beginning`, Manager-visible data was empty; the Stage showed its existing overview/context-forming state.
4. `Data / Files` opened the bounded Observer/test inspector without replacing the Stage.
5. The inspector showed ERP, Production, Inventory, and Maintenance files with filename, source, tick, row count, `sim-test.csv.v1`, verified provenance, ingestion state, CSV content, and update history.
6. Initial Production was v1/tick 0, `110/100`, and `INGESTION_COMPLETED`.
7. `Next moment` advanced the real WATCH session. Production became v2/tick 7 and then v3/tick 21, `85/85`; history displayed all three versions.
8. Manager conversation and the existing Stage remained rendered and operational during progression.
9. Browser console warnings/errors: none.

The inspector uses the same SIM-TEST:2 ingestion harness and the selected WATCH run ID. It creates no second data-management application or data authority.

# Focused pre-Fix reproduction

Command: `./node_modules/.bin/tsx artifacts/nxa5/NXA-5-FIX3-DIAG/reproduce-nxa5-fix3-diag.ts`

The deterministic reproduction passed as a harness execution and reproduced the defect:

- normalized: `exlpain demand surge`
- CC:1: `unknown`
- resolved entity: `ctx-scenario-demand` / Demand Surge
- canonical meaning: `FOCUS`
- FINAL:6.1 overlay: `focus`
- command: `focus-subject`
- read/write: `write`
- DIR: `FOCUS_OBJECT`
- Stage: `focus`, Demand Surge
- response: `Focused on Demand Surge.`

The correctly spelled control used `explain-scenario`, `MO:2/GenericExplainEngine`, `read`, `NO_CHANGE`, and preserved the three-member Scenarios collection.

Primary pre-Fix evidence remains in `../NXA-5-FIX3-DIAG/reproduction-traces.json` and `../NXA-5-FIX3-DIAG/live-A.png`.

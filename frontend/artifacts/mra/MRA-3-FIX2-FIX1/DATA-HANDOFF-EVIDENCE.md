# Data handoff evidence

When `it` resolves to a CSV/Data Object, the turn stays on DATA-ADV:1 (`describeSourceContents`). No new Data explanation engine.

Observed content for the unique pending source used in the live defect (`data-ux3-ambiguous.csv` in tests, not hard-coded in production logic):

- source identity (file label);
- confirmed vs unresolved fields;
- pending vs ready / Data Reality acceptance state;
- bounded interpretation (inspect, do not invent business meaning).

`explain it` after inventory does **not** route through generic Scenario/Problem explanation.

Unit: `nexoraAdvisorDataInquiry.test.ts` unique inventory → `explain it`.
Runtime: `mra3Fix2Fix1CrossDomain.runtime.test.ts` Tests A and E.

Live `/executive` funnel smoke: `live-smoke.json` `zeroPageErrors: true`, `ok: true`.

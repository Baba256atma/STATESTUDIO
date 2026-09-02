# FIX2 Regression Tests

## Permanent source-scope cases

- Exact `data-ux3-clear.csv` plus the observed manager answer prepares successfully without Revenue requirements.
- Partial Finance claim (`Current Revenue` without `Previous Revenue`) fails on the genuinely required paired metric and reports no unrelated Production/Shipping issue.
- Finance and Delivery sources validate and commit independently.
- Replacing Delivery preserves its source identity and leaves Finance unchanged.
- Previously committed source state cannot add validation requirements to a new source.
- Workspace A failure cannot contaminate Workspace B import state.
- Manager-confirmed semantic meaning survives failed validation with one confirmation record.
- Failed replacement remains atomic.
- Empty source-scoped runtime projection is explicit and does not change the default Stage projector rule for unmapped/invalid state.
- Manager UI copy removes raw IDs from the primary message while raw diagnostics retain exact KPI and metric IDs.

## Observed results

- Focused + owning-layer FIX2 set: 47/47 passed.
- Test Funnel Level 1: passed, 0 failed/skipped.
- Test Funnel Level 2: passed, 0 failed/skipped.
- Test Funnel Level 3: passed, 0 failed/skipped.
- Test Funnel Level 4: 7/7 required tasks passed; no task running, uninspected, skipped, cancelled, or blocked.
- TypeScript: passed.
- `git diff --check`: passed.


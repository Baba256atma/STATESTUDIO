# DATA-UX:3-FIX2 Root Cause

Date: 2026-08-31

## First divergent layer

`prepareCsvRealDataImport` in `csvRealDataVerticalSlice.ts` passed the complete Executive Operations demo registries to `resolveDatasetExecutiveReality` for every individual CSV:

- all resolved object bindings;
- all five KPI definitions;
- all Executive Operations state rules.

`computeNexoraKPIs` then correctly validated every supplied definition. Because the Delivery/Capacity fixture did not map `revenue.currentRevenue`, the first reported issue was:

`KPI "kpi.revenue.growth" is missing required metric "revenue.currentRevenue".`

The KPI engine did not leak state and did not malfunction. The CSV caller supplied workspace/demo-wide definitions to a source-scoped import transaction.

## Why Revenue participated

`kpi.revenue.growth` is statically owned by `demo/executiveOperationsKPIDefinitions.ts`. It requires `revenue.currentRevenue` and `revenue.previousRevenue`. It participated solely because RDI:2 unconditionally called `getExecutiveOperationsKpiDefinitions()` and passed the entire returned registry into the per-source resolver.

It was not introduced by the selected CSV, an earlier Downloads file, browser persistence, the CSV commit store, Data Rail, Advisor, Stage, or Director.

## Corrected boundary

Confirmed canonical RDI mappings now select the object keys claimed by the source. Only KPI definitions, object bindings, and state rules owned by those object keys participate in source validation.

A source that claims one Revenue metric still fails when the paired required Revenue metric is absent. A source with no confirmed canonical KPI claim can commit as a valid source/Data Object with an explicit empty runtime projection. It does not fabricate KPI values or mutate Stage truth.

Advisor now consumes the already-resolved source-scoped Data Reality result instead of recomputing the global demo registry.


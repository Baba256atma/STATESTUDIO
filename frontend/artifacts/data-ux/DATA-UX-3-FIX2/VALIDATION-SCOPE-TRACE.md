# Validation Scope Trace

## Click-to-authority trace

`Validate Import`
→ `NexoraCsvRealDataImportFlow.validate`
→ `prepareCsvRealDataImport`
→ deterministic CSV parse and confirmed `CsvMappingReview`
→ RDI:1 adapter snapshot
→ RDI:1 Data Reality handoff
→ source-scoped Executive Operations definitions/bindings/rules
→ P0 `resolveDatasetExecutiveReality`
→ P0 KPI computation and executive-state resolution
→ P0:5 runtime projection
→ P1:6 Advisor consumption of the same resolved result
→ atomic RDI:2 commit eligibility.

## Before FIX2

Validation scope = every KPI in the Executive Operations demo registry, regardless of the selected source's confirmed mappings.

Import validity and whole-demo KPI completeness were conflated.

## After FIX2

Validation scope = the import transaction plus canonical KPI dependencies of object keys claimed by confirmed, non-ignored mappings from that source.

- Unrelated object definitions are excluded.
- A claimed KPI retains all required-metric validation.
- Zero-claim sources are valid no-op runtime projections, not fabricated executive updates.
- Workspace health can remain incomplete without invalidating an unrelated source.

The mapping review was already the authoritative source-to-canonical-target contract; no new registry, store, or semantic authority was added.


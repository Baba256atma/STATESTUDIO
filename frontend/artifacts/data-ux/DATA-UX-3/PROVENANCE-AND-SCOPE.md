# Provenance and Scope

Semantic metadata is embedded in each existing `CsvColumnMapping` and includes:

- workspace, source-context, and field identity;
- structural datatype and bounded representative values;
- semantic state, proposed and confirmed meaning;
- confirmed canonical target when proven;
- confirmation source (`authoritative-mapping`, `manager`, or `none`);
- unit, materiality, unresolved reason, interpretation basis;
- prior meaning and replacement schema compatibility;
- RDI:2 authority identity.

This is not a second provenance database. The existing mapper continues to emit existing record/field/transformation provenance for business observations.

Reuse requires exact workspace-derived source identity and exact field identity plus compatible datatype and unit. There is no cross-source or cross-workspace reuse. A manager correction affects only the reviewed source field.

Durability is the existing in-memory committed CSV-store boundary. A committed confirmation survives panel close, Stage changes, source selection, and compatible same-source replacement during the browser session. It is not promised across page refresh or session restart. The UI does not claim permanent memory.


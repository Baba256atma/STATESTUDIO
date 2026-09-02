# Data Object Integration

The compatibility contract is `NexoraDecisionTheatreDataObject`, produced only by `projectCsvImportAsDecisionTheatreDataObject(CsvCommittedImport)`.

It contains:

- stable identity derived from canonical workspace + RDI source ID;
- `sourceType=csv`, label, workspace, source snapshot reference, Data Reality dataset reference, and provenance reference;
- validated-mapping understanding state and non-authoritative display counts;
- a Director-compatible resolved reference and Stage-compatible participant identity;
- explicit semantic safety (`isEvidence=false`, `impliesCausality=false`, `createsBusinessTruth=false`);
- explicit all-false writes and an empty relationship list.

The third visual family is `DATA_OBJECT`. It is semantic and renderer-neutral. DATA-UX:2 may define its form, material, label, and interaction using the existing Stage renderer. It must remain visually distinguishable from Manager/Business and Intelligence/Decision objects, and must not borrow Evidence/KPI/Problem semantics.

Projection is deterministic and idempotent: repeated projection of the same committed source yields the same immutable value and ID. It rejects source/workspace identity divergence. It cannot mutate the committed object or nested Data Reality truth.


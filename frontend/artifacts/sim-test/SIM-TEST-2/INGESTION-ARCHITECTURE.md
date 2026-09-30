# Ingestion architecture evidence

## Existing authorities reused

| Concern | Authority |
| --- | --- |
| Observable operational records | `NPA-T RMS:3/OperatorObservableData` |
| CSV parser, mapping review, validation, Gate | `RDI:2/NexoraCsvRealDataVerticalSlice` |
| Real-data adaptation and handoff | `RDI:1/NexoraRealDataIntegrationFoundation` |
| Data Reality | `P0:1/NexoraDataRealityFoundation` |
| Import lifecycle writer | `RDI:2/csvRealDataImportStore` |
| Manager product entry | production CC:5 / `executeNexoraConversationalExperience` |
| Stage | existing Nexora Stage projection |
| Measurements | certified RMS Observer |

The exact ingestion entry is `prepareCsvRealDataImport`. A ready import is committed only by `commitPreparedCsvRealDataImport`. Unresolved columns use the existing candidate store and mapping-review lifecycle.

The simulation adapter owns only this projection:

`RmsObservableRecord[] → SimulationCsvFileVersion`

It does not own parsing, semantic interpretation, mapping, Gate decisions, business data, or Data Reality. The boundary contract records all duplication/direct-write flags as `false`.

FAST remains unchanged. INGESTION is selected declaratively on the same SIM-TEST journey contract and orchestration harness.

The small Gate registry extension adds only exact operational meanings needed for Orders, Inventory, Project Control, and Service. Production reuses the pre-existing canonical `production.total` and `production.used` targets. Plain `capacity` remains unresolved and unconfirmed.

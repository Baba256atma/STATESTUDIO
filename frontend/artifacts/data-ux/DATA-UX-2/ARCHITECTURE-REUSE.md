# DATA-UX:2 Architecture Reuse

Date: 2026-08-30

DATA-UX:1 remains authoritative. DATA-UX:2 changes presentation and supported UI actions only.

## Reused authorities

| Concern | Existing authority reused | DATA-UX:2 use |
|---|---|---|
| CSV parse, mapping, validation | `csvRealDataVerticalSlice` | The existing `CsvRealDataImportFlow` still invokes the same deterministic functions. |
| CSV commit and source identity | `csvRealDataImportStore` and RDI source identity | The Rail subscribes to and lists canonical commits. Update uses the existing replace mode and refuses a differently named source. |
| Source snapshot and provenance | RDI:1 snapshot/handoff | Read through the existing committed import; never duplicated. |
| Data Reality | existing `NexoraDataRealitySnapshot` handoff/runtime | Import remains the only path that changes active business reality. |
| Executive source interpretation | `projectExecutiveSourceIntelligence` | Reused for authoritative source details and manager attention state. |
| DATA_OBJECT | DATA-UX:1 `projectCsvImportAsDecisionTheatreDataObject` | Wrapped by a presentation-only Rail projection; remains frozen and read-only. |
| Stage and focus | existing NEX-MVP Stage interaction state | The Data control only toggles the Explorer surface. |
| Director | existing semantic presentation Director | No new dispatch, scene, intent, or presentation authority. |
| Advisor/NCA | existing Advisor context and conversational control | `Ask Nexora` remains the sole conversational handoff. |

## Changed surface

- Existing `ExecutiveExplorerDrawer` gained a Data Rail presentation variant.
- Existing `NexoraExecutiveDataExplorer` gained compact source rows, empty CSV state, manager language, DATA_OBJECT diagnostics, and safe update entry.
- Existing `CsvRealDataImportFlow` gained a continuous understanding-first presentation while preserving its state reducer and canonical functions.
- Existing `NexoraExecutiveShell` gained a Stage Data toggle and close/Escape ordering that preserves focus.
- A presentation-only mapper and Stage control component were added.

## Boundary result

No second CSV store, parser, mapping engine, source registry, Data Reality, provenance graph, DATA_OBJECT truth, Stage state, Director, Advisor, Evidence authority, or memory authority was created.


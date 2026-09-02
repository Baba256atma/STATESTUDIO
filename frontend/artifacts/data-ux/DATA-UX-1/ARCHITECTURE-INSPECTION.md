# DATA-UX:1 Architecture Inspection

## Stop condition and observed divergence

Expected: an imported canonical CSV source can participate in Theatre as a source object without becoming business truth, Evidence, or a second Stage/Director authority.

Actual before DATA-UX:1: RDI:1–4 already owned upload, adapter validation, source snapshots, mapping, provenance, Data Reality handoff, runtime projection, source intelligence, Advisor context, and `/executive` UI. DTH:1–12 projected only `EXECUTIVE_OBJECT` and `ICONIC_OBJECT`; no semantic family represented the source itself.

First divergent layer: Decision Theatre visual-family/source projection boundary. Ingestion and Data Reality were not divergent.

## Inspected authorities

| Concern | Authority | Finding |
|---|---|---|
| External observation | `realDataIntegrationFoundation.ts` (RDI:1) | Validated adapter/snapshot/provenance boundary; explicitly not Data Reality, runtime, Advisor, or Stage owner. |
| CSV lifecycle | `csvRealDataVerticalSlice.ts` (RDI:2) | Deterministic parse, preview model, mapping, validation, canonical handoff, runtime and Advisor projections. |
| CSV publication | `csvRealDataImportStore.ts` | Workspace-scoped atomic in-memory commit/replace/remove store. |
| Data Reality | `dataRealityFoundation.ts` and `dataRealityContracts.ts` | Canonical dataset → facts → KPI → executive-state snapshot. |
| Runtime/Stage data truth | `dataRealityStageProjection.ts` | Read-only projection onto existing MVP Stage object status/attention. |
| Source understanding | `executiveSourceIntelligence.ts` (RDI:3) | Provider-neutral source interpretation, affected objects, comparisons, provenance, Advisor context. |
| Executive UI | `NexoraExecutiveDataExplorer.tsx`, `NexoraCsvRealDataImportFlow.tsx` | Production `/executive` Data Explorer and upload flow. |
| Panel/open state | `NexoraExecutiveShell.tsx`, `ExecutiveExplorerDrawer.tsx` | `activeNav` → `explorerKind`; close/Escape returns to Home. Drawer shares the Stage region. |
| Director | `nexoraSemanticPresentationDirector.ts` | Sole semantic presentation planner; accepts resolved references and cannot mutate business truth. |
| Theatre | `decision-theatre/*` | Existing Stage compatibility, visual grammar, Scene Intent/Script, relationship safety, Advisor-readable projection. |
| Advisor clarification | NCA/manager-object conversation authorities | Existing uncertainty/clarification path; no CSV-specific conversation engine required. |

Historical evidence inspected includes `artifacts/rdi2-executive-browser`, `rdi3-executive-source-intelligence`, `rdi4-live-data-connector`, DTH:1–12 artifacts, DIR:1 artifacts, and current certification/tests.

## Minimal resolution

`nexoraDecisionTheatreDataObjectProjection.ts` now projects a validated `CsvCommittedImport` by reference. It adds no persistence, parsing, mapping, Evidence, relationships, scene intent, renderer, Stage state, Director state, or Advisor state.


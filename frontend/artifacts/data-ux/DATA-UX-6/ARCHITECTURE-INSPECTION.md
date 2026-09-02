# DATA-UX:6 Architecture Inspection

Date: 2026-09-02

Inspected `csvRealDataImportStore`, RDI:2 prepare/commit/remove, FIX4 multi-pending, FIX5 presentation, ESI / DATA_OBJECT projection, PM:5 IndexedDB monitoring persistence, APP-4 executive memory, `/executive?reset=1`, Engineering Source live journal, NCA CSV clarification.

No second CSV business store, Data Reality, ESI, DATA_OBJECT authority, Advisor, or NCA routing. ORD_QTY field conversation is out of scope.

## Previous durability boundary

Committed and pending CSVs live in module memory (`committedByWorkspace`, `pendingByWorkspace`, `removedByWorkspace`). Close/reopen Data keeps them. Page refresh / browser restart drops the module. Engineering Source monitoring may recover via PM:5; CSV does not.

## Answers (A–M)

**A. Currently durable.** APP-4 executive memory (goals/decisions/learning — not CSV). PM:5 monitoring policy + live-connection journal (IndexedDB + localStorage key). Entrance identity in localStorage. Panel chrome prefs. CSV is not among these.

**B. Session-only.** `csvRealDataImportStore` committed imports, pending candidates, removal historical references, Data Rail selection, accordion/open panel, NCA CSV clarification pending, Stage focus, Advisor turns.

**C. Reconstruct a committed CSV.** Workspace + `sourceContextId` + `importId` + `committedAt` + full `CsvPreparedImport` (`parse` records/columns, mapping + semantic confirmations, handoff, Data Reality result, runtime/advisor projections, summary). ESI and DATA_OBJECT are **projections** of that record, not separate persisted graphs.

**D. Raw CSV retained?** Pending candidates keep `input.csvText`. Committed `CsvPreparedImport` keeps **parsed records**, not necessarily the original file bytes. Preview and Data Reality come from parse + prepared snapshot.

**E. Bytes vs canonical.** Persist **canonical committed `CsvPreparedImport`** (parse + mapping + prepared truth). Persist pending `csvText` so review can resume. Filename+mappings alone would be a fake source.

**F. Data Reality vs source memory.** Data Reality on a committed import is already inside `prepared.dataReality` / `handoff`. Durability stores that snapshot. Restore hydrates the store; it must **not** call `commitPreparedCsvRealDataImport` (that is a new publication event). ESI is derived after hydrate.

**G. Existing persistence to reuse.** APP-4 is executive memory categories, not source files. PM:5 is monitoring-specific (`nexora-monitoring-runtime`). Reuse the **IndexedDB snapshot pattern** (versioned JSON document, dedicated database), not APP-4 and not the monitoring database.

**H. APP-4 for source durability?** No. APP-4 does not own source lifecycle, mappings, or Data Reality snapshots. Mixing CSV into Learning/Decision memory would create a parallel authority.

**I. Where durable source state lives.** Browser IndexedDB database `nexora-csv-real-data`, backing **only** `csvRealDataImportStore`. Canonical runtime remains the store.

**J. Restore without new commit.** `hydrateCsvRealDataImportState` replaces in-memory maps. Callers must not invoke commit/remove/prepare. DATA_OBJECT ids stay `deriveNexoraDecisionTheatreDataObjectId(workspace, sourceId)`.

**K. Workspace scoping.** Every record carries `workspaceId`. `sourceContextId` already includes workspace (`csv:${workspace}:${normalizedFileName}`). Hydrate keys maps by workspace. UI lists only the current workspace.

**L. `reset=1`.** Existing meaning: reset **entrance identity** (`resetEntrance`), not ordinary refresh. Certification/demo needs a clean slate. DATA-UX:6: `reset=1` also **clears durable CSV + in-memory CSV store**. Ordinary `/executive` without `reset` restores. Refresh ≠ reset.

**M. Incompatible schema.** `nexoraCsvPersistenceVersion` / snapshot `version`. Unknown version → do not hydrate; keep empty store; diagnostic reason `incompatible`. No silent field invention.

## Persistence technology

**IndexedDB** (dedicated DB), not localStorage: structured snapshot, quota for parse+prepared graphs, same pattern as PM:5 without sharing its store. No server/SQL. Tests use an in-memory Storage adapter (no IndexedDB in Node).

## Pending durability decision

Persist pending candidates (including multi-pending and in-progress update-source). They remain `PENDING`. Do **not** restore NCA chat pending / “waiting for Yes”. Manager reopen shows Needs clarification; Ask Nexora can start a new FIX1 question.

## Raw / preview / mapping policy

| Kind | Persist |
|---|---|
| Committed parse records | Yes (truthful preview) |
| Committed mappings + confirmationSource | Yes, unchanged |
| Pending csvText + mapping | Yes |
| Accordion / nav / Stage focus | No |
| NCA conversation turn | No |
| ESI label cache | No — reproject from restored import |

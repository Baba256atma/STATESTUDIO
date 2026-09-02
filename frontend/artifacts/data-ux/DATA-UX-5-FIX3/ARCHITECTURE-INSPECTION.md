# DATA-UX:5-FIX3 Architecture Inspection

Date: 2026-09-01

Inspected DATA-UX:1–5, FIX1, FIX2, `csvRealDataImportStore`, prepare/commit/remove, semantic clarification, Data Rail, ESI, DATA_OBJECT, RDI, Advisor/NCA, Stage/Director, Engineering Source (RDI:4). No second store or ingestion path was added.

## Expected versus actual (before this FIX)

Expected: a newly chosen CSV remains a visible PENDING library row after Close. Close ≠ Cancel ≠ Accept ≠ Remove.

Actual: the candidate lived only in `CsvRealDataImportFlow` reducer state. Closing details or Data unmounted the flow (`adding` / `addKind`). The library listed only `listCsvRealDataImports` (committed). Header `CSV · 0` was correct for committed count and wrong as a manager picture of “did Nexora forget the file?” REMOVE on new review was `dispatch({ type: "reset" })`, not DATA-UX:5 `removeCsvRealDataImport`.

First divergent layer: Data Rail presentation + candidate lifetime. Canonical commit, Data Reality, ESI, Director, and committed removal were not the first divergence.

## Answers (A–L)

**A. Where the uncommitted CSV lived.** Only the import-flow React reducer. Not `committedByWorkspace`. Not Data Reality.

**B. Survive closing CSV details.** No. Unmount discarded reducer state.

**C. Survive closing Data.** No. Same unmount.

**D. Survive page refresh.** No. Same in-memory class as committed CSV (FIX2). No localStorage added.

**E. What commits.** Explicit `commitPreparedCsvRealDataImport` after a prepared import that is `ready` with handoff, Data Reality, runtime, and advisor.

**F. VALIDATE IMPORT.** `prepareCsvRealDataImport` only. Updates candidate `prepared` / errors.

**G. Does validation commit?** No. Failed prepare stays pending. Success enables **Use this data** (canonical commit). `commitPreparedCsvRealDataImport` with `mode: "cancel"` is a no-write result, unused as the manager cancel path.

**H. Why REMOVE on NEW SOURCE.** Mislabelled local reset of uncommitted flow state. Not committed-source removal.

**I. Cancel authority.** Same RDI:2 store: `discardCsvImportCandidate`. Plus `onSemanticClarificationCancel` for candidate-scoped NCA. Must not call `removeCsvRealDataImport`.

**J. Source/object relationships.** ESI `affectedObjects` after commit. Pending: not projected into business reality.

**K. Manager metadata already available.** Filename, size, parse columns/rows, mapping (confirmed / suggested / unresolved), preview records, prepare errors, ESI after commit.

**L. Resume without a second store.** Yes: `pendingByWorkspace` in the existing CSV store. **Limitation:** one pending candidate per workspace. File replace overwrites that slot. Update-source (`replacementSourceContextId` set) is not listed as a second CSV row.

## Close ≠ Cancel ≠ Accept ≠ Remove

| Action | Writer | Effect |
| --- | --- | --- |
| Close details / Close Data | Presentation (`onClose`, `setActiveNav`) | Candidate and committed sources unchanged |
| Cancel import | `discardCsvImportCandidate` + NCA cancel | Uncommitted only; no historical removal refs |
| Use this data | `commitPreparedCsvRealDataImport` | Canonical current CSV; pending slot cleared |
| Remove source | `removeCsvRealDataImport` (DATA-UX:5) | Committed only; dependency/consent |

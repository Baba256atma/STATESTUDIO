# DATA-UX:5-FIX4 Architecture Inspection

Date: 2026-09-01

Inspected DATA-UX:1–5, FIX1–FIX3, `csvRealDataImportStore`, prepare/commit/remove, semantic clarification, NCA pending, Data Rail / Explorer, + Add Data, Replace File, ESI, DATA_OBJECT, Advisor, Stage/Director, Engineering Source.

No second pending store, Data Reality, clarification engine, or ingestion path was added.

## Expected versus actual (before this FIX)

Expected: `+ Add Data` always starts new source intake. Clicking a pending CSV resumes that candidate. A workspace can hold more than one pending CSV.

Actual: `pendingByWorkspace[workspaceId]` held a single candidate. `+ Add Data` → Upload File mounted `CsvRealDataImportFlow` with `initialCandidate={pendingCandidate}` and `key={pendingCandidate.importId}`, so the only pending file hijacked Add Data.

First divergent layer: Data panel action routing + pending map key. Canonical commit, Data Reality, ESI, Director, and committed removal were not the first divergence.

## Answers (A–L)

**A. + Add Data event.** `setUpdatingSource(null); setAdding(true)` then source-choice; Upload File set `addKind: "csv"` and mounted the import flow.

**B. Why pending was selected.** New CSV flow always received `initialCandidate={pendingCandidate}` (the workspace singleton) unless updating a committed source.

**C. pendingByWorkspace key.** Workspace id only: `Record<WorkspaceId, CsvImportCandidate | null>`.

**D. APIs that assumed one pending.** `getCsvImportCandidate(workspaceId)`, `saveCsvImportCandidate` overwrite-by-workspace, `discardCsvImportCandidate(workspaceId)`, `commitPreparedCsvRealDataImport` clearing `pendingByWorkspace[workspace]=null`.

**E. UI that assumed one pending.** Explorer `pendingCandidate`, library `pendingCandidate`, flow persist `csv-pending:${workspace}`, pending row testid singleton.

**F. Semantic clarification.** Already source-scoped via `sourceContextId` / `fieldId`. Did not assume one candidate in the semantic engine; the store/UI did.

**G. NCA pending.** One conversational pending question (`beginNcaCsvSemanticClarification`). Topic id `csv-semantic:${sourceContextId}`. `endNcaCsvSemanticClarification(session, sourceContextId)` already no-ops when the topic does not match. Shell previously nulled `csvSemanticResolverRef` on any cancel.

**H. Mapping IDs.** `rdi2:mapping:${importId}` — import-scoped, therefore candidate-scoped when import ids differ.

**I. sourceContextId before commit.** `csv:${workspace}:${normalizedFileName}` (`csvCanonicalSourceContextId`). Same identity as committed CSV.

**J. Two pending files, same filename.** Same `sourceContextId` / candidate id. Must not silently overwrite.

**K. Replace File.** New parse/importId; identity follows filename. Same-name replace overwrites that candidate only. Different filename re-keys this candidate if the new id is free.

**L. Committed multi-CSV reuse.** Yes: pending map is now `workspace → candidateId → candidate`, using the same canonical sourceContextId as committed imports.

## One-pending assumptions enumerated

1. Store: one candidate per workspace.
2. Commit: wipe all pending for the workspace.
3. Discard: discard by workspace only.
4. Library projector: one optional `pendingCandidate`.
5. Explorer: one `pendingCandidate` for resume and Add Data.
6. Flow persist: `csv-pending:${workspace}`.
7. Shell clarification cancel: always clear the single resolver.

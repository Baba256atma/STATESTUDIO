# DATA-UX:5-FIX3 Certification

Status: **DATA-UX:5-FIX3 — CERTIFIED**

Pending CSVs stay in the manager CSV library until Cancel or Accept. Close is presentation. Validate prepares; **Use this data** commits. Cancel discards the uncommitted candidate only. Committed Remove remains DATA-UX:5.

DATA-UX:6 was not started. BCA was not started.

## Certification report (spec §26)

1. **Architecture inspected.** See `ARCHITECTURE-INSPECTION.md`.
2. **Existing pending-candidate authority.** Same `csvRealDataImportStore`: `pendingByWorkspace`, `get/save/discardCsvImportCandidate`. Not Data Reality. Not a second registry.
3. **Root cause of disappearing pending CSV.** Candidate lived in an unmounted import flow; the library listed only committed imports.
4. **VALIDATE semantics.** `prepareCsvRealDataImport`. Does not write `committedByWorkspace`.
5. **ACCEPT/commit semantics.** Manager **Use this data** → `commitPreparedCsvRealDataImport`. Successful commit clears the pending slot. No second business-reality writer.
6. **CANCEL semantics.** `discardCsvImportCandidate` + `onSemanticClarificationCancel`. Confirm if manager-confirmed fields exist. Does not call `removeCsvRealDataImport`.
7. **Close vs Cancel vs Accept vs Remove.** Close keeps candidate (tests + live A/B). Cancel drops pending only (test + live C). Accept commits (test + live E). Remove committed still `removeCsvRealDataImport` on committed detail.
8. **Files created.** `dataUx5Fix3Pending.test.ts`, `scripts/data-ux5-fix3-live-proof.mjs`, this artifact folder (including `proofs/`).
9. **Files modified.** `csvRealDataImportStore.ts`, `NexoraCsvRealDataImportFlow.tsx`, `NexoraExecutiveDataExplorer.tsx`, `nexoraDataRailPresentation.ts`, FIX2 library header assertion, ESI UI scan (`selectRow`). Presentation/explorer already owned the Data Rail; this FIX extends them.
10. **CSV library.** Separate CSV files vs Connected. Pending row `PENDING` / Needs review. Header Ready vs Pending.
11. **Pending/resume.** Close details / Close Data keep `getCsvImportCandidate`. Click pending remounts flow with `initialCandidate`.
12. **Manager CSV detail.** Filename, status, about, columns/meanings, related objects (ESI), preview, actions. Pending related objects: “Available after validation”.
13. **Short CSV explanation.** `describeCsvSourceForManager` from confirmed `confirmedMeaning` or `targetLabel` only. Unresolved fields get a clarification sentence. No LLM.
14. **Column/mapping presentation.** Existing DATA-UX mapping UI; FIX1 Ask Nexora unchanged.
15. **Related Objects.** ESI `affectedObjects` after commit. No filename-inferred objects. No fabricated causality.
16. **CSV preview.** First 5 parse records; copy states preview does not change the source.
17. **Engineering Source.** Connected list only.
18. **Multi-CSV.** Distinct filenames remain independent `sourceContextId`s (live G + tests).
19. **ASK NEXORA.** FIX1 field clarification on pending review; FIX2 source Ask Nexora / Theatre return on committed/connected. Tests remain in L4 omnibus.
20. **Stage safety.** Inspection does not mutate Decision/Execution/Outcome/Learning. Stage focus only via existing DATA_OBJECT / `onSelectSubject` paths.
21. **Automated tests.** Focused 6/6. Omnibus 1366/1366. Funnel L1–L4 passed.
22. **TypeScript / ESLint / build.** L4 typecheck, PREP ESLint, production build, `git diff --check`.
23. **Live browser proof.** `proofs/live-report.json` `ok: true`. Flows A–H.
24. **Durability limitation.** Close/reopen: supported. Page refresh: not supported (in-memory store, same as FIX2).
25. **Remaining limitations.** One pending new-source per workspace. Update-source candidate is not a second library row. Same normalized filename still shares committed identity. VALIDATE IMPORT label remains prepare, not commit. Header “Ready” equals committed count (a pending file is not Ready).

## Not added

No second Data Reality, CSV registry, semantic engine, Advisor, NCA, lineage engine, Data Object store, Stage, Director, or localStorage durability layer.

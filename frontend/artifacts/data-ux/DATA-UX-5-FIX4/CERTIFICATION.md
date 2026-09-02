# DATA-UX:5-FIX4 Certification

Status: **DATA-UX:5-FIX4 — CERTIFIED**

`+ Add Data` starts new intake. Pending rows resume by identity. Multiple pending CSVs coexist in the existing RDI:2 store. Close ≠ Cancel ≠ Accept ≠ Remove. DATA-UX:6 and BCA were not started.

## Certification report (spec §30)

1. **Architecture inspected.** See `ARCHITECTURE-INSPECTION.md`.
2. **Root cause.** Add Data mounted the CSV flow with the workspace’s only `pendingCandidate`.
3. **One-pending assumptions.** Store keyed by workspace; commit wiped all pending; discard by workspace; library/explorer/flow persist assumed one candidate; shell cleared the NCA resolver on any cancel.
4. **Store evolution.** `pendingByWorkspace: workspace → candidateId → candidate` in `csvRealDataImportStore`.
5. **Pending identity.** `csvCanonicalSourceContextId` (same as committed `sourceContextId`).
6. **Add Data.** `csvIntake: "new"`, new React key, `initialCandidate: null`.
7. **CSV row selection.** Identity-based resume or committed detail. Not Add Data.
8. **Multi-pending.** Independent list/reopen/clarify/validate/cancel/commit.
9. **Semantic/mapping scoping.** `fieldId` / `mappingId` / `sourceContextId` remain source-scoped. Ask Nexora persist writes that candidate only.
10. **NCA.** One conversational pending. Cancel A does not end B’s topic. Resolver cleared only when the topic matches.
11. **Replace.** Candidate-scoped; filename re-key if free; collision refused.
12. **Cancel.** `discardCsvImportCandidate(workspace, candidateId)` only. No DATA-UX:5 history.
13. **Validate.** `prepareCsvRealDataImport` on the open candidate’s input/mapping.
14. **Commit.** Canonical writer; removes only that pending id.
15. **Same pending filename.** Refused with manager copy. No silent overwrite.
16. **Committed duplicate.** Explicit Update existing source. Reuses update lifecycle.
17. **Counts.** Ready = committed; Pending = new-source candidates; Connected = live. Pending is not Data Reality.
18. **Files created.** `dataUx5Fix4MultiPending.test.ts`, `scripts/data-ux5-fix4-live-proof.mjs`, this artifact folder.
19. **Files modified.** `csvRealDataImportStore.ts`, `csvRealDataVerticalSlice.ts` (`csvCanonicalSourceContextId`), `csvSemanticUnderstanding.ts`, `NexoraCsvRealDataImportFlow.tsx`, `NexoraExecutiveDataExplorer.tsx`, `NexoraExecutiveShell.tsx`, FIX3 tests, Data Rail presentation (`pendingCandidates`).
20. **Automated tests.** Focused 7/7. Combined FIX1–4/UX3/presentation 42/42. L4 omnibus **1366/1366**.
21. **TypeScript / ESLint / build.** L4 typecheck, PREP ESLint, production build, `git diff --check`. Live smoke `zeroPageErrors: true`.
22. **Live browser proof.** `proofs/live-report.json` `ok: true`. Flows A–J.
23. **Engineering Source.** Connected independently; no CSV columns/preview.
24. **Stage/Decision/Execution.** Add Data and CSV inspection do not create Decision/Execution/Outcome/Learning. Data Reality receives only committed sources.
25. **Durability.** Close/reopen: supported. Page refresh: not supported (in-memory).
26. **Remaining limitations.** Same normalized filename is one identity (pending or committed). Update-source candidates are not extra library rows. Refresh still drops CSV state (DATA-UX:6).

## Not added

No second pending store, Data Reality, semantic engine, Advisor, NCA, Stage, Director, lineage engine, source-removal authority, or persistence layer.

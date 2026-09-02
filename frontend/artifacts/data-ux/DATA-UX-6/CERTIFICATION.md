# DATA-UX:6 Certification

Status: **DATA-UX:6 — CERTIFIED**

Accepted CSV sources (and pending review candidates) survive page refresh by hydrating `csvRealDataImportStore` from an IndexedDB snapshot. Restore is not a new Use this data / commit event. BCA was not started. ORD_QTY conversation routing was not patched.

## Certification report (spec §37)

1. **Architecture inspected.** See `ARCHITECTURE-INSPECTION.md`.
2. **Previous durability boundary.** In-memory CSV store only. Close/reopen worked; refresh dropped the library.
3. **Persistence technology.** Dedicated IndexedDB `nexora-csv-real-data` (PM:5 pattern, not PM:5 database, not localStorage, not APP-4). Node tests use in-memory storage.
4. **Canonical runtime authority.** `csvRealDataImportStore`.
5. **Durable backing authority.** `csvRealDataImportDurability` snapshot only. `CSV_DURABILITY_AUTHORITY_BOUNDARY.restoreCallsCommit === false`.
6. **Persistence schema/version.** Identity `DATA-UX:6/CsvRealDataImportDurability`, version `1.0.0`.
7. **Committed-source durability.** Full `CsvCommittedImport` including parse, mappings, prepared Data Reality snapshot.
8. **Raw/canonical CSV data policy.** Committed: parsed records (truthful preview). Pending: `csvText` + parse + mappings. No filename-only fakes.
9. **Semantic mapping durability.** `confirmationSource` restored unchanged (manager / authoritative / none).
10. **Pending-source durability.** Yes. Stays PENDING. NCA chat pending is **not** restored.
11. **Multi-pending restore.** Independent candidate ids; live C/D/E.
12. **Safe hydration path.** `recover` → validate → `hydrateCsvRealDataImportState`. Not `commitPreparedCsvRealDataImport`.
13. **Restore vs new-business-event.** Commit invocation count stays 0 across hydrate. No Advisor restore toast.
14. **Data Reality continuity.** Restored `prepared.dataReality` / handoff; not re-published as a new commit.
15. **DATA_OBJECT identity continuity.** `deriveNexoraDecisionTheatreDataObjectId(workspace, sourceId)` unchanged.
16. **ESI / Related Objects.** Reprojected from restored committed import. Not stored UI labels.
17. **Update durability.** Replace commit persists latest `importId`; refresh restores v2.
18. **Remove durability.** Remove persist + historical refs; current source does not return.
19. **Cancel durability.** `discardCsvImportCandidate` then persist; cancelled pending does not return.
20. **Workspace isolation.** Records keyed by `workspaceId`; `sourceContextId` includes workspace. Automated two-workspace proof.
21. **Reset semantics.** Ordinary `/executive` restores. `/executive?reset=1` (`resetEntrance`) clears IndexedDB + in-memory CSV (cert/demo clean slate) and still resets entrance identity.
22. **Corruption/version handling.** Invalid records skipped; incompatible version does not hydrate.
23. **Storage failure.** Persist returns `write-failed`; health `session-only` with manager copy. Not reported as saved.
24. **Engineering Source.** Unchanged Connected / PM:5 path. CSV DB is separate.
25. **Advisor/NCA safety.** No restore messages. No NCA replay. ORD_QTY defect left untouched.
26. **Stage safety.** Hydration does not call Stage focus. Live `focused: none` after refresh.
27. **Decision/Execution/Outcome/Learning.** Durability module does not create them.
28. **Files created.** `csvRealDataImportDurability.ts`, `csvRealDataImportDurability.test.ts`, `scripts/data-ux6-live-proof.mjs`, `test-fixtures/data-ux6/*`, this artifact folder.
29. **Files modified.** `csvRealDataImportStore.ts` (export/hydrate/clear/lifecycle), `NexoraExecutiveShell.tsx` (recover/reset bind), `NexoraExecutiveDataExplorer.tsx` (session-only copy).
30. **Automated tests.** Durability 4/4. Combined DATA-UX suite 65/65. L4 omnibus 1366/1366.
31. **TypeScript / ESLint / build.** L4 typecheck, PREP ESLint, production build, `git diff --check`.
32. **Live browser proof.** `proofs/live-report.json` `ok: true`. Flows A–I.
33. **Remaining limitations.** Browser IndexedDB only (no multi-device sync). Persist is async after commit (brief window before durable). Incompatible snapshots are dropped, not migrated. NCA questions are not restored. ORD_QTY field ask remains a conversation-context issue outside this phase.

## Not added

No BCA, no second CSV store, no new Data Reality/ESI/DATA_OBJECT/Stage, no SQL/cloud sync, no NCA intent change.

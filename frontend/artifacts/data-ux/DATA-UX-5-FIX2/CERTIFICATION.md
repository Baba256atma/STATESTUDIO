# DATA-UX:5-FIX2 Certification

Status: **DATA-UX:5-FIX2 — CERTIFIED**

The Data panel is a manager source library over existing RDI:2 CSV and RDI:4 connected sources. Empty copy, source counts, and filenames agree. Close ≠ remove. ASK NEXORA may collapse Data for Theatre investigation without deleting the source.

DATA-UX:6 was not started. BCA was not started.

## Certification report (spec §22)

1. **Architecture inspected.** See `ARCHITECTURE-INSPECTION.md`.
2. **Root cause of contradictory empty state.** `totalSources` counted CSV + live; empty message used CSV-only `imports.length === 0`. Auto-select of active/stage selection also reopened details after close.
3. **Canonical CSV authority.** `csvRealDataImportStore` only.
4. **Engineering Source.** RDI:4 live GitHub connector `displayName`, connected/monitored, not CSV.
5. **Durability.** Panel close: store remains. Detail close: presentation only. Page refresh / browser restart: CSV (and live connection journal) are in-memory, not APP-4 durable.
6. **Multi-CSV.** Multiple distinct filenames yes. Same normalized filename is one `sourceContextId`.
7. **Files created.** `dataUx5Fix2Library.test.ts`, `nexoraDataRailPresentation` library projection (if new in this FIX), `scripts/data-ux5-fix2-live-proof.mjs`, fixtures `test-fixtures/data-ux5-fix2/*`, this artifact folder.
8. **Files modified.** `NexoraExecutiveDataExplorer.tsx`, `nexoraDataRailPresentation.ts`, `NexoraExecutiveShell.tsx`, `NexoraAdvisorInsightRegion.tsx`, `executiveSourceIntelligence.test.ts`, presentation tests.
9. **Source-list.** `projectNexoraDataRailLibrary` + CSV / Connected sections. `SOURCES · N` with CSV · n · Connected · m.
10. **CSV reopen.** Click row; details from committed import; no re-upload.
11. **Close ≠ Remove.** Close details / Data do not call `removeCsvRealDataImport`. Live proof A + B.
12. **Source → object.** Related Objects from ESI. No fabricated causality.
13. **Engineering Source / View Changes.** Connected source; View Changes keeps `Source: Engineering Source`.
14. **ASK NEXORA.** `setActiveNav("Home")`, keep `dataRailSelectedSourceId`, Advisor context, `Back to {title}` via `setActiveNav("Data")`.
15. **Stage safety.** Focus only `onSelectSubject` / existing DATA_OBJECT show-on-stage. No invented objects.
16. **Source-scoping.** Distinct filenames → distinct source ids and mapping ids; same column name does not merge sources.
17. **Automated tests.** Focused 12/12 + presentation 4/4. Owning suite 158/158. Funnel L4 omnibus 1366/1366.
18. **TypeScript / ESLint / build.** L4 typecheck, PREP ESLint, production build 13/13. Changed-file ESLint: 0 errors (pre-existing hooks warning on Shell `csvImportStoreVersion`).
19. **Live browser proof.** `proofs/live-report.json` `ok: true`.
20. **Remaining limitations.** CSV not durable across refresh. Same filename identity collision. View Changes for live requires a prior observation pair (PM:1). Engineering Source is not a CSV-derived lineage unless ESI provenance says so (it does not invent CSV parentage).

## Not added

No second source store, lineage graph, Data Reality, monitoring runtime, Advisor, Stage, or Data-panel-owned business truth.

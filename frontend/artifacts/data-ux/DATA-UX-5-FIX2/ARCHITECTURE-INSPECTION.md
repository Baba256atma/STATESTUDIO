# DATA-UX:5-FIX2 Architecture Inspection

Date: 2026-09-01

## Expected versus actual

Expected: the Data panel is a manager source map of canonical current sources. CSV empty copy, source count, and listed filenames must agree. Close is presentation. Remove is DATA-UX:5.

Actual before this FIX: `SOURCES · N` counted CSV + live connections. The empty message gated only on `imports.length === 0`. A live connection with zero CSVs showed `SOURCES · 1` and “No CSV sources yet.” Selection also auto-opened the active import after “close details,” so closing details did not stay closed.

First divergent layer: Data Rail presentation of existing RDI:2 / RDI:4 lists. Store, Data Reality, ESI, Director, and removal were not divergent.

## Answers (A–K)

**A/B. Engineering Source.** Default `displayName` of the RDI:4 live GitHub connector (`NexoraLiveDataConnectionFlow`). It is a **connected / monitored source**, not a CSV, not a second Data Reality, and not a Stage object by itself. Observations live in `liveDataConnectionStore`. Related objects come from ESI `affectedObjects` on committed live observations.

**C. Canonical CSV sources.** `csvRealDataImportStore` — in-memory, workspace-scoped `Record<sourceContextId, CsvCommittedImport>`. Identity: `csv:${workspace}:${normalizedFileName}`.

**D. Survives Data panel close.** Yes. The explorer unmounts; the store does not.

**E. Page refresh.** CSV store is process memory. Refresh drops committed CSVs. Live connections are the same class of store. Monitoring policy may use localStorage; that is not CSV durability.

**F. Browser / session restart.** Same as refresh for CSV. Not APP-4 durable memory.

**G. Active source.** Shell `activeCsvImport` / `activeLiveObservation` — one active dataset for Data Reality. Row selection is presentation and does not activate.

**H/I. Source → object.** `projectExecutiveSourceIntelligence` `affectedObjects` (RDI:3 / ESI). Association from Data Reality object states, not causality. Advisor/Stage consume this; they do not own it.

**J. Empty-state contradiction.** Count used all sources; empty copy used CSV-only. Also auto-select from active/stage reopened details after close.

**K. Multi-CSV.** The canonical store already supports multiple `sourceContextId`s. Same normalized filename collides (replace/update identity). Different filenames are independent (mappings, clarification, removal). This FIX does not add a second registry.

## Close ≠ remove

- Close Data: `setActiveNav("Home")`.
- Close details: `setSelectedSourceId(null)`.
- Remove: `removeCsvRealDataImport` after DATA-UX:5 review/confirm.

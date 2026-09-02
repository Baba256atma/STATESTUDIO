# DATA-UX:5-FIX2 Live Manager Proof

Date: 2026-09-01

Command: `EXECUTIVE_URL=http://localhost:3000/executive node scripts/data-ux5-fix2-live-proof.mjs`

`proofs/live-report.json` **`ok: true`**, `pageErrors: []`.

## FLOW A — CSV visibility

Imported `delivery_2026.csv`. Filename listed. Close details → still listed, details closed. Close Data → explorer unmounted. Reopen Data → filename listed. Click → details reopen without re-upload.

## FLOW B — empty-state parity

With CSV present, empty copy absent (`empty: false`) even with `SOURCES` including a connected source (`total: 2` = CSV 1 + Connected 1).

After DATA-UX:5 remove of remaining CSVs: `csv: 0`, `empty: true`, copy “No CSV sources yet.” Connected count remained 1.

## FLOW C — connected source

Opened existing Engineering Source. Label **Connected source**. Related Objects: Capacity, Customer. View Changes: `Source: Engineering Source` plus Customer Satisfaction Index and Capacity Utilization deltas (PM:1). No CSV implied.

## FLOW D — ASK NEXORA

Ask Nexora collapsed Data (`askCollapsed: true`). CSV filenames still present after return (`sourceAfterAsk: true`). `Back to Engineering Source` via existing `setActiveNav("Data")`. Stage focus only through `affectedStageObjectIds` / `onSelectSubject`.

## FLOW E — multiple CSVs

`delivery_2026.csv` and `capacity.csv` listed independently. Canonical store already supports this for distinct filenames.

Limitation: same normalized filename still shares `sourceContextId` (existing RDI identity). Not unlimited independent files of the same name.

## Durability observed

In-session panel close preserves CSV. This proof did not claim refresh/restart persistence; the CSV store remains in-memory.

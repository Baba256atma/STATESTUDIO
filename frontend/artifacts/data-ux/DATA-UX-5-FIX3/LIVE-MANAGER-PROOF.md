# DATA-UX:5-FIX3 Live Manager Proof

Date: 2026-09-01

Command: `EXECUTIVE_URL=http://localhost:3000/executive node scripts/data-ux5-fix3-live-proof.mjs`

`proofs/live-report.json` **`ok: true`**, `pageErrors: []`. Screenshots under `proofs/`.

## FLOW A — Pending + resume

Added `otd-clarification.csv`. Review **Pending review**. After close: row remains, `pending: "1"`, `committed: "0"`. Reopen resumes the same candidate (`review: true`). No re-upload.

## FLOW B — Close Data

While pending, Data closed then reopened. Pending still listed. No Cancel/Remove.

## FLOW C — Cancel import

Cancel import: pending gone (`csv: "0"`, `pending: "0"`). Engineering Source still Connected. No committed CSV removal history implied (no remaining CSV to remove).

## FLOW D — Validation failure

Missing required field: stays `pending: "1"`, `committed: "0"`. **Use this data** not offered. No business-reality commit.

## FLOW E — Accept

Valid CSV → Validate → **Use this data**. `committed: "1"`, `pending: "0"`, filename `delivery_2026.csv`. Close details keeps the row. Reopen without upload.

## FLOW F — Manager CSV detail

Committed detail: filename, grounded **About this data**, columns, preview. Related objects from ESI (Capacity, Revenue on this fixture), not filename invention.

## FLOW G — Multiple CSV

`delivery_2026.csv` and `capacity.csv` listed independently (`csv: "2"`).

## FLOW H — Engineering Source

Under Connected, not CSV files. Status, related objects, existing connected actions. No CSV-only UI on that row.

## Durability observed

Close/reopen Data preserves pending and committed CSV in this session. This proof does not claim page-refresh persistence.

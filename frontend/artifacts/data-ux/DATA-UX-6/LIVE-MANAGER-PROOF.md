# DATA-UX:6 Live Manager Proof

Date: 2026-09-02

Command: `EXECUTIVE_URL=http://localhost:3000/executive node scripts/data-ux6-live-proof.mjs`

`proofs/live-report.json` **`ok: true`**, `pageErrors: []`. `data-csv-durability: durable`. Stage `focused: none` after restore.

## FLOW A — Committed survives refresh

`delivery_2026.csv` Use this data → READY. Refresh `/executive`. Same file READY. Related Objects Capacity · Revenue from ESI. No duplicate row. Focus not forced onto a Data Object.

## FLOW B — Multiple committed

`capacity.csv` and `customer.csv` also committed. Refresh: all three READY independently.

## FLOW C / D — Pending resume and multi-pending

`data-ux3-ambiguous.csv` with manager-confirmed OTD, plus `otd-clarification.csv`. Refresh: both PENDING. Reopen ambiguous: OTD remains Confirmed by manager. Intake `resume`. No commit.

## FLOW E — Cancel

Cancel `otd-clarification.csv`. Refresh: it does not return. Ambiguous pending remains.

## FLOW F — Remove

DATA-UX:5 remove of `capacity.csv`. Refresh: not current. Historical `suppliesCurrentReality: false` covered in automated tests.

## FLOW G — Update

Update `delivery_2026.csv` with v2 file (same identity). Refresh: still current READY. v1 not a second library row.

## FLOW H — Workspace isolation

IndexedDB snapshot contained only `overview`. Cross-workspace isolation is certified in automated tests (`workspace-b` vs `overview` same filename).

## FLOW I — Corruption

Injected incomplete committed record. Reload: no crash, no `corrupt.csv`, valid sources remain.

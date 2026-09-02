# DATA-UX:5 Live Manager Proof

Date: 2026-08-31  
Route: `http://localhost:3000/executive`  
Script: `frontend/scripts/data-ux5-live-proof.mjs`  
Report: `frontend/artifacts/data-ux/DATA-UX-5/proofs/live-report.json` (`ok: true`, `zeroPageErrors: true`)

## Proof A — Zero-object source

Imported `test-fixtures/data-ux4/zero-object.csv`. Show on Stage. Removal review: `NO_EXECUTIVE_IMPACT` (“not currently supplying any Executive Objects”). Cancel left staged count `1` and the source in Data. Confirm emptied the Rail (`SOURCES 0`), dropped staged DATA_OBJECT to `0`, cleared selection. Hexagonal token gone. Catalog Goal/KPI objects remained.

Screenshot: `proofs/proof-a-removed.png`

## Proof B — Source with dependency

Imported `artifacts/data-ux/DATA-UX-2/fixtures/delivery-ready.csv`. Review: `DEPENDENT_DATA_BECOMES_UNAVAILABLE`. Copy named Capacity, Delivery, and Revenue. Cancel left the source. Confirm was not executed in this proof so the dependent source remained for isolation of the cancel path.

Screenshot: `proofs/proof-b-dependent-review.png`

## Proof C — Shared support

Automated: two overlapping committed CSVs; removing the inactive peer reports `SHARED_SUPPORT_REMAINS` and the remaining source stays. Live theatre was not dual-active in this run; current-reality still follows the single active dataset (RDI), not a second freshness model.

## Proof D — Unrelated source isolation

Automated: `zero-object.csv` and `finance.csv` in Overview; a same-filename source in `workspace-b`. Removing Overview delivery/zero source does not mutate Finance or workspace-b, and writes no historical reference in workspace-b.

## Proof E — Advisor conversation

Selected DATA_OBJECT. “What happens if I remove this?” explained zero-object impact. “Remove it.” opened Data review (`review: true`) and did not delete (`staged` still `1`). Cancel closed review. Advisor never called the store.

Screenshot: `proofs/proof-e-review.png`

## Proof F — Stage vs source

Remove from Stage: staged `0`, source still in Rail, business Focus `none`. Show on Stage again. Then Remove data source confirmed: Rail empty, staged `0`. Inspection still exposes only “Remove from Stage”; destructive action lives under Data → More.

## Proof G — Update vs remove + import

Automated: after confirmed remove, a new import of the same filename reuses RDI `sourceContextId` with a new `importId`. Historical reference keeps the old `importId` and `transfersSemanticConfirmation: false`. Update-source identity remains the DATA-UX:2/3 replace path (same import identity, not this remove+reimport).

## Proof H — Theatre continuity

After confirmed removal: Goal/KPI catalog objects still on Stage, Advisor still on Executive Overview, no Decision/Execution/Outcome/Learning created, `data-data-object-business-focus` stayed `none`. Data Rail empty. Camera/scene remained Overview; no Focus rewrite.

## Overlay

Stale Turbopack `nextjs-portal` overlays are dismissed in the proof script before screenshots (same environmental class as DATA-UX:4). Page errors: none.

# DATA-UX:4 Live Manager Proof

Date: 2026-08-31  
Route: `http://localhost:3000/executive`  
Script: `frontend/scripts/data-ux4-live-proof.mjs`  
Report: `frontend/artifacts/data-ux/DATA-UX-4/proofs/live-report.json`

## Proof A — Independent Data Object

Imported `test-fixtures/data-ux4/zero-object.csv`. Show on Stage produced one staged DATA_OBJECT. Inspection: Ready, 1 field understood, no claimed executive relationship. Business focus remained `none`. No KPI/Problem/Evidence was manufactured.

Screenshot: `proofs/proof-a-zero-object.png`

## Proof B / C — Related + multiple sources

Imported `artifacts/data-ux/DATA-UX-2/fixtures/delivery-ready.csv` while the zero-object source remained staged. Two distinct DATA_OBJECT IDs. Dashed `supplies-data-to` lines to visible executive objects for the mapped source only. Unrelated zero-object source had no invented edge.

Screenshot: `proofs/proof-c-multiple-sources.png`

## Proof D — Update identity

Automated owning-layer proof: replacement of the same `sourceContextId` keeps DATA_OBJECT id and one Stage participant. Live UI Update source path is the certified DATA-UX:3 control; not re-opened as a second ingestion.

## Proof E — Deictic Advisor

Selected zero-object source.

- “Explain this.” → CSV Data Object explanation from canonical semantics; focus unchanged.
- “What does it support?” → no supported relationship; Nexora will not invent one.

## Proof F — Stage removal

Remove from Stage dropped staged count from 2 to 1. Canonical sources remained. Re-opening Data showed the Rail. `data-remove-from-stage-deletes-source="false"`.

Screenshot: `proofs/proof-f-remove-from-stage.png`

## Proof G — Theatre preservation

Throughout: Overview, Advisor present, no Decision created, focus not manufactured from Data Object selection (`explainFocus: none`).

## Responsive

`proofs/proof-1024x768.png` at the certified 1024×768 viewport. Inspection sits above the Data control.

## Overlay classification

A stale Turbopack overlay about `AssistantCommandDock` (unrelated dashboard assistant module, still exporting in source) intercepted pointer events until dismissed. `/executive` page errors: none. Classified environmental / non-DATA-UX:4.

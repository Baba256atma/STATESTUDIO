# FIX2 Live Reproof

Date: 2026-08-31  
Route: `http://localhost:3000/executive`

## Historical authoritative reproduction

The pre-fix native manager flow selected the real repository fixture, parsed 4 rows × 5 columns, completed Advisor clarification, retained `Confirmed by manager`, preserved the Stage scene, and failed on `Validate Import` with the unrelated Revenue KPI requirement.

## Post-fix native proof

- `/executive` loaded successfully in the BAHA Chrome profile.
- Data → `+ Add Data` → `Upload File` → `Choose CSV` selected the repository fixture through the real native file chooser.
- `data-ux3-clear.csv` parsed as 4 rows × 5 columns.
- The Advisor asked: `Does on_time_delivery_pct represent on time delivery percent?`
- The manager answered: `Yes, it means on-time delivery percentage.` The source showed `Confirmed by manager` and mapped the field to `Ignore this column`, so the answer did not silently claim a canonical Delivery KPI.
- `Validate Import` reached `Ready to import`, reported 4 valid rows, recognized the date, and reported `0 Executive Objects will update`.
- `Import` completed with `Data connected`, 4 records imported, and `0 Executive Objects updated · 0 require attention`.
- The Data Rail displayed `data-ux3-clear.csv`, `CSV · Ready`, and an executive summary of 4 rows / 0 objects.
- The Stage remained focused on Overview with presentation `minimum`, neutral atmosphere, and no special intensity before and after validation/import.

## Additional visible isolation proof

- `data-ux3-ambiguous.csv` parsed as 4 rows × 5 columns and raised only the material `OTD` clarification.
- A manager correction (`OTD means order-to-dispatch percentage`) was retained as `Confirmed by manager`; the field was explicitly ignored and the independent source imported with 0 Executive Objects.
- A separate `I don't know.` response kept `OTD` unresolved, left validation blocked at `1 field need clarification`, and produced the Advisor message that unrelated usable fields can continue.
- `Update source` selected the different filename `data-ux3-update.csv`, retained the manager-confirmed date/correction semantics, validated 2 rows with 0 Executive Objects, and completed the replacement.
- The visible replacement row was renamed to `data-ux3-update.csv`, while its `data-data-object-id` remained `data-source:overview:csv%3Aoverview%3Adata-ux3-ambiguous-csv`, proving preservation of the original source identity.

Required fixture:

`/Users/bahadoors/Documents/StateStudio/frontend/test-fixtures/data-ux3/data-ux3-clear.csv`

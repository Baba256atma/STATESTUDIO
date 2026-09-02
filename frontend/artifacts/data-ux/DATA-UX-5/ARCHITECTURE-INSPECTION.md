# DATA-UX:5 Architecture Inspection

Date: 2026-08-31

## Expected versus actual

Expected: destructive source removal is a reviewed, confirmed lifecycle operation on the existing RDI:2 store, with canonical dependency analysis, Stage reconciliation, and historical reference retention.

Actual before DATA-UX:5: `removeCsvRealDataImport` already owned inactive-source deletion. The Data Rail “Remove Source” button called it immediately. Active sources were refused. DATA-UX:4 already distinguished Remove from Stage. There was no impact review, no historical reference, and no Advisor review path.

First divergent layer: Data Rail destructive UX and the missing review/history around the existing store. RDI identity, Data Reality, semantics, DATA_OBJECT, Director, and Focus were not divergent.

## Existing removal authority (reused)

`csvRealDataImportStore.removeCsvRealDataImport` remains the only writer. DATA-UX:5 adds:

- confirmed-active removal flag (same function)
- historical source reference in the same store
- read-only impact analysis from Executive Source Intelligence
- review UI and Advisor explanation

## Not reused as deletion authority

APP-4 memory, RTC journal tombstones, and Executive Resource lifecycle. Those are unrelated domains.

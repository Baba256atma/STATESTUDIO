# DATA-UX:2 Live Manager Proof

Date: 2026-08-30  
Route: `http://localhost:3000/executive`  
Method: in-app browser, real visible controls, native file chooser, DOM snapshots, and screenshots emitted inline during the certification session.

## Proof A — Empty CSV state

After a clean reload, opening Data showed `No CSV sources yet` and a restrained `Add a CSV` explanation while preserving the real Engineering Source below it. The first attempt exposed an unreachable empty branch because the canonical connected source made total source count nonzero. The branch was corrected to test canonical CSV imports, then re-proven live without page error.

## Proof B — Native upload

The visible `+ Add Data` → `Upload File` → `Choose CSV` path opened the native file chooser. `delivery-ready.csv` passed Preview, confirmed mapping, validation, and Import. The committed source appeared in the Rail and its executive source intelligence appeared below it. No alternate uploader or ingestion call was used.

## Proof C — Ambiguity

`production-clarification.csv` contained `CAP_AV`. The Rail showed `Needs your help`, `? CAP_AV`, and `Meaning unknown`; the primary action was disabled. After explicit Ignore, validation and import succeeded. A screenshot captured this unresolved state with the normal Advisor visible.

## Proof D — Theatre continuity

Risk was focused before opening Data. While open, the Stage still exposed Risk and the Advisor displayed `Context: Risk`. Selecting both CSV sources changed only the presentation/Data Object diagnostic ID. Closing Data left Risk focused and the Advisor context unchanged.

## Proof E — Multiple sources and identity

Two CSVs were imported through the native UI. The Rail showed separate rows for `delivery-ready.csv` and `production-clarification.csv`, one `In use` marker, independent states, and authoritative Aug 30 update labels. Their Data Object IDs were distinct. Selecting delivery, production, then delivery again returned the exact original delivery Data Object ID.

## Responsive and visual proof

Screenshots captured:

1. unresolved `CAP_AV` at the default viewport;
2. two compact CSV sources with Stage and Advisor visible;
3. the open Rail at 1024×768;
4. the corrected no-CSV state.

The temporary viewport override was reset. The browser session was finalized. The repository live smoke then independently passed with `zeroPageErrors: true` and no captured errors.


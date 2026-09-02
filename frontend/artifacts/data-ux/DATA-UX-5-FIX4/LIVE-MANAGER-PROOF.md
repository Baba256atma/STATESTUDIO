# DATA-UX:5-FIX4 Live Manager Proof

Date: 2026-09-01

Command: `EXECUTIVE_URL=http://localhost:3000/executive node scripts/data-ux5-fix4-live-proof.mjs`

`proofs/live-report.json` **`ok: true`**, `pageErrors: []`.

## FLOW A — Add Data ≠ resume

Added `data-ux3-ambiguous.csv` (PENDING). Close. **+ Add Data** opened source choice (`review: false`), not that CSV. Upload File showed **New source** / Choose CSV (`data-csv-intake: new`). Then `capacity.csv`. Library: both PENDING (`pending: "2"`).

## FLOW B — Independent reopen

Ambiguous preview headers include OTD. Capacity preview headers include `currentRevenue`. Resume `intake: "resume"`. No mapping leakage.

## FLOW C / D — Validate and commit B

Validate capacity → Use this data. `committed: "1"`, `data-ux3-ambiguous.csv` still PENDING.

## FLOW E — Cancel A

Cancel ambiguous. Capacity remains committed. Engineering Source remains Connected.

## FLOW F — Third Add Data

+ Add Data again → new intake, no hijack.

## FLOW G — Same pending filename

Second `otd-clarification.csv` refused: “A pending source with this filename already exists.”

## FLOW H — Committed duplicate

Second `delivery_2026.csv` after commit: **Update existing source** (`nexora-csv-existing-source`).

## FLOW I — Ask Nexora scoped

Ask Nexora on OTD for the ambiguous file. Capacity review remaining revenue/capacity. Single conversational pending.

## FLOW J — Engineering Source

Connected independently. No CSV columns or preview.

## Durability

Close/reopen within session: pending list preserved (FIX3). Page refresh still drops in-memory CSV state.

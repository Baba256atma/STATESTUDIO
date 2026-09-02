# DATA-UX:5-FIX5 Live Manager Proof

Date: 2026-09-01

Command: `EXECUTIVE_URL=http://localhost:3000/executive node scripts/data-ux5-fix5-live-proof.mjs`

`proofs/live-report.json` **`ok: true`**, `pageErrors: []`. Fixture: `data-ux3-ambiguous.csv`.

## FLOW A — Manager readability

Pending review showed **About this data** (honest weak copy before confirmation), **Nexora understands**, **Needs clarification** (OTD + Ask Nexora), Related Objects fallback **Available after validation**, **Columns**, **Data preview**. No “Likely Bkl”. Ask Nexora testid `nexora-csv-ask-OTD` present (FIX1).

Needs clarification listed the material unresolved field only. DT / ORD_QTY / BKL remain in Columns because existing semantic interpretation marks non-material fields ignored until the manager maps them.

## FLOW B — Missing Used Capacity

After confirming Date / On-Time Deliveries / Production Total Capacity and ignoring the rest, Validate Import stayed on the candidate. **Needs attention**: “Nexora needs Used Capacity before this data can be used for Production.” Copy states the file is not broken. No claim that Used Capacity exists.

## FLOW C — Collapse

Closed Needs clarification (absent after resolution), Columns, and Data preview via presentation `details.open`. `data-rdi2-state` stayed `error`. Re-expand did not change candidate status.

## FLOW D — Correct confirmed meaning

**Change meaning** on CAP_AV opened the existing mapping select; **Keep current** restored the lock without mutating other columns.

## FLOW E — Potential relationship

Before confirmation: **Available after validation** (no fabricated objects). After confirmed OTD + CAP_AV: **Potentially related** `Production ? · Shipping ?` and “Nexora has not connected these objects yet.” Pending count stayed candidate-only; no committed Related Objects until Flow F.

## FLOW F — Commit

`capacity.csv` **Use this data**. Committed detail **Related Objects** = Capacity, Revenue from ESI. No causal “caused” language.

## FLOW G — Multi-pending

Ambiguous and capacity coexisted (`pending: "2"`). Independent About copy (weak/delivery vs revenue/capacity).

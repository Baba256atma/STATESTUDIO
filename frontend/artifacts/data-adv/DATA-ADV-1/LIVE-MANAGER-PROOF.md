# DATA-ADV:1 Live Manager Proof

Script: `frontend/scripts/data-adv1-live-proof.mjs`  
Report: `proofs/live-report.json` (`ok: true`)  
URL: `http://localhost:3000/executive`

IndexedDB `nexora-csv-real-data` was cleared once so the library started empty. Data Panel was used only to import. After refresh, Data was **not** opened.

## Original defect (required)

| Turn | Observed |
| --- | --- |
| Nexora (Ask Nexora on OTD) | Does OTD represent on-time delivery? |
| Manager | yes |
| Nexora | Confirmed for this source: OTD means On-Time Delivery. |
| Manager | what is ORD_QTY ? |
| Nexora | ORD_QTY is a field in data-ux3-ambiguous.csv, but its business meaning has not been confirmed yet. This source is still under review… |

Did **not** return “I couldn't find a clear match… in the current executive context.”

## Continuity

- which file is it from? → ORD_QTY is in data-ux3-ambiguous.csv.
- what else is in that file? → same pending source; confirmed OTD; unresolved DT, ORD_QTY, CAP_AV, BKL.

## Library and objects

- What files do we have? → one CSV pending + connected Engineering Source.
- After committing capacity.csv: What data do we have for Capacity? → capacity.csv provides accepted capacity data.
- What should I investigate for Delivery? → accepted capacity.csv; pending ambiguous CSV not treated as accepted evidence; investigation-order language; no “caused the delivery”.

## Restore

Reload. Data Panel closed (`dataOpenAfterRefresh: 0`).

- What is OTD? → OTD means On-Time Delivery in data-ux3-ambiguous.csv. Confirmed. Still pending/not accepted evidence.
- What files do we have? → capacity.csv ready; data-ux3-ambiguous.csv still reviewed.

No restore chatter. Stage focus stayed `none` for field and guidance turns.

Screenshots: `proof-ord-qty.png`, `proof-investigate.png`, `proof-restore.png`.

# DATA-UX:5-FIX1 Live Manager Proof

Date: 2026-08-31  
Route: `http://localhost:3000/executive`  
Script: `frontend/scripts/data-ux5-fix1-live-proof.mjs`  
Report: `proofs/live-report.json` (`ok: true`, `zeroPageErrors: true`)

## Ask once

Imported `test-fixtures/data-ux5-fix1/otd-clarification.csv`. Rail: Needs clarification · 1, OTD likely On-Time Delivery. One ASK NEXORA click. Advisor: “Does OTD represent on-time delivery?” Button became “Waiting for your answer”. Three further clicks did not duplicate the question (`questionCount: 1`).

Screenshot: `proofs/proof-ask-once.png`

## Unrelated then Yes

“What is Capacity Gap?” was answered as ordinary Advisor investigation. OTD remained unresolved (`stillUnresolvedAfterUnrelated: 1`). ASK NEXORA again, then “Yes.” Advisor: “Confirmed for this source: OTD means On-Time Delivery.” Rail: ✓ OTD: On-Time Delivery. Clarification count 1 → 0. Business Focus stayed `none`.

Screenshot: `proofs/proof-yes-resolved.png`

## Correction

New review of the same fixture. ASK NEXORA. “No, OTD means order-to-delivery time.” Rail: ✓ OTD: Order-to-delivery time. No invented KPI/target.

Screenshot: `proofs/proof-correction.png`

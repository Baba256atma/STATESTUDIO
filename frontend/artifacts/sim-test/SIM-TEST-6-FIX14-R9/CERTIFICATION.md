# NPA-T SIM-TEST:6-FIX14-R9 — CERTIFIED

- Regression A (FAST): intended FIX11 change and a stale pin.
  - First divergence is T16 `Go back to the capacity issue.` at FINAL:6.2 named return. It now keeps the visited Capacity Object instead of Capacity Gap, so the Advisor no longer diverges from canonical at T17/T20/T21.
  - Proven by a controlled reversal of FIX11 only, which restores `8a0767d0`.
  - The pin was re-baselined to `3aa7cfc6`, and FAST semantic invariants were added.
- Regression B (S1-06): genuine FIX10 regression at the FINAL:6.1 compound-key coverage rule.
  - It rejected the head noun of a compound canonical name.
  - Repaired at the same 6.1 seam. T2 establishes Margin Pressure, and T3 gives the negated-causal evidence answer.
- Relationship: independent.
- SIM-TEST: 166/166. Typecheck: 0. NXA L1–L4 and every L4 command: PASS.

## Status

- SIM-TEST:6-FIX14-R9: CERTIFIED.
- SIM-TEST:6-FIX14-R5 through R8: remain CERTIFIED (guards green).
- SIM-TEST:6-FIX14: its certification contract for the T3 `<named subject>. Details.` repair is now met. The FIX14 focused suite passes, NXA L1–L4 are absolutely green, typecheck is 0, and SIM-TEST has no known failure. The separately rooted Impatient T8/T16/T30/T31 findings remain open and are outside FIX14's repair.
- SIM-TEST:6: not recertified here. The Impatient T8/T16/T30/T31 work is NOT STARTED.

## Other recorded debt (not repaired)

- S1-06 T3 is observed as `status: clarification-required`, even though its response is the evidence answer. CC:2 reports `missing-context` because the ingestion journey has no canonical subject. This is identical to the historical behavior (same `fc7bcb3c` signature at HEAD).
- S1-06 T1 `What is happening in operations?` answers "couldn't find a clear match for Happening In Operations". This is unchanged since before SIM-TEST.
- Out-of-scope items from the R9 brief remain recorded: `Give me the details.` missing subject, Delivery walkthrough drift, ECA `How sure are you?` note, `..` formatting.

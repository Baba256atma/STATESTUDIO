# NPA-T SIM-TEST:6-FIX14-R7 — Certification

The last Level 4 omnibus failure (FINAL:6.4 `certifies trusted-communication dialogues`) is repaired, and the omnibus now passes **1681/1681** with 0 skipped. The funnel then passes `l4-dir-inventory` and stops at `l4-typecheck` on the 10 known pre-existing errors. None of those errors is in an R7 file.

- Failure: bare `Why?` after an Object turn produced 7–8 sentences, while the limit is 6.
- Classification: mode + duplication, presentation only. Upstream semantics were correct: CC:1 `explain`, 6.1 CAUSE, 6.2 active Object, 6.3 proceed, and the Advisor referent was the Object. The 6.4 depth policy was also correct.
- First wrong seam: the ECA:7 and NPS:5 recommendation overlays appended recommendation justification to a bare `why?` without any recommendation in the discourse.
- Repair: those overlays now consult the existing ECA:7 recommendation session before treating a bare `why?` as a recommendation follow-up. 6.4 also drops exact repeated sentences. New authority: NO.
- Explicit Detail/Explain/Evidence/Why depth and epistemic qualifiers are preserved, including R4's modeled-relationship qualification (R4 guard green).
- External debt:
  - FAST signature is unchanged (`3aa7cfc6` vs expected `8a0767d0`).
  - S1-06 is unchanged (`Which item do you mean?`).
  - The known typecheck count is still 10, with 0 new R7 typecheck errors.
  - None of this was repaired, per scope.

## Status

- **SIM-TEST:6-FIX14-R7 — CERTIFIED**
- **SIM-TEST:6-FIX14-R6 — CERTIFIED** (guards green)
- **SIM-TEST:6-FIX14-R5 — CERTIFIED** (guards green)
- **SIM-TEST:6-FIX14 — STILL NOT CERTIFIED**: the funnel stops at the known typecheck debt, and the two pre-existing SIM-TEST regressions remain.
- **SIM-TEST:6 — NOT CERTIFIED**

Stopped here, per the R7 Stop Condition. Typecheck debt, the SIM-TEST regressions and Impatient T8/T16/T30/T31 were not started.

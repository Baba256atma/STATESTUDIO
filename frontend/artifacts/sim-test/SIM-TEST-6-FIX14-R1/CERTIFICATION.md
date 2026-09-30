# NPA-T SIM-TEST:6-FIX14-R1 — NOT CERTIFIED

## Summary

All eight Level 2 failures are classified **B — PRE-EXISTING FAILURE** by an exact controlled comparison. Removing only FIX14's `terseDetails` branch did not change any result. The branch was restored unchanged.

## R1 repair

- Production change required: NO.
- Owning seam: none for R1. The failures belong to pre-existing navigation/clarification and Scenario explanation/follow-up paths.
- Why not part of FIX14: none of the failing inputs reaches or can match `<named subject> details/detail`; all failures are baseline-equivalent with that branch absent.
- New authority/store: NO.

## Validation

- Eight previously failing cases: 0 pass / 8 fail, both pre- and post-FIX14.
- FIX14 focused and combined guards: 84 pass / 0 fail.
- Relevant standalone CC:1 tests: 31 pass / 0 fail.
- FIX13: PASS.
- FIX12: PASS.
- FIX11: PASS.
- FIX10: PASS.
- CC:10 Decision authority: PASS.
- Ground Truth leakage: NO.
- NXA Level 1: PASS.
- NXA Level 2: FAIL — 445 pass / 8 fail.
- NXA Level 3: NOT RUN.
- NXA Level 4: NOT RUN.

The existing NXA funnel contract requires absolute Level 2 green and contains no baseline-equivalence exception. R1 therefore does not waive the failures even though they predate FIX14.

## Final FIX14 status

**SIM-TEST:6-FIX14 — NOT CERTIFIED.**

Exact blocker: the required NXA Level 2 owning-layer gate remains red with eight pre-existing failures. Before T8 work begins, the smallest certification-recovery action is a separate bounded Level 2 debt-recovery phase covering the three evidenced families: navigation/clarification, Scenario explanation Runtime mutation, and Scenario `why?` semantic fidelity. T8, T16, T30, and T31 were not modified in R1.

# NPA-T SIM-TEST:6-FIX14 — NOT CERTIFIED

## Earliest material root selected

- Turn: T3
- S1: SUBJECT_LOSS
- Root cause: CC:1 returned `unknown` for the explicit terse focus `Capacity. Details.`, so CC:2 and canonical executive selection received no target even though FINAL:6.1/6.2 and Advisor resolved Capacity.
- Why earliest: it is the first independent material failure. T8, T16, and T30 are separately reproducible roots; T31 is downstream of T30.
- Classification: profile-specific stress exposure of a core defect.

## Repair

- Owning seam: existing CC:1 `matchFocusOrOpen` grammar.
- Change: recognize generic `<named subject> details/detail` fragments as explicit focus with a lexical target hint; reject generic/deictic prefixes and keep bare `Details.` targetless.
- Generality: the regression covers Capacity, Delivery, and Customer impact; there are no profile, turn, scenario, or Object-ID checks.
- New authority/store: NO.

## Results

- T3: PASS
- T8: INDEPENDENT
- T16: INDEPENDENT
- T30: INDEPENDENT
- T31: downstream of T30
- Same-root repaired: T3 SUBJECT_LOSS
- Downstream repaired: none
- Independent remaining: T8, T16, T30 (with T31 downstream)
- Observer errors: none
- Test expectation errors: none

## Gates

- Focused tests: 84 pass / 0 fail across FIX10–FIX14, CC:1, and CC:10
- FIX13 regression: PASS
- FIX12 regression: PASS
- FIX11 regression: PASS
- FIX10 regression: PASS
- Decision authority preserved: YES
- Genuine ambiguity still clarifies: YES
- Ground Truth leakage: NO
- New authority/store introduced: NO
- NXA funnel Level 1: PASS
- NXA funnel Level 2: FAIL (445 pass / 8 fail in unrelated existing navigation/scenario/explain assertions)
- NXA funnel Levels 3/4: NOT RUN after Level 2 failure

The requested repair is bounded and its target behavior is proven, but FIX14 is **NOT CERTIFIED** because the required owning-layer funnel is not zero-failure. SIM-TEST:6 recertification remains **STILL NOT CERTIFIED** with Impatient S1=4. The next earliest independent material blocker is T8 MISSING_DECISION; it was not repaired in FIX14.

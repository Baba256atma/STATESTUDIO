# SIM-TEST:6-FIX14 Regression

- Pre-repair focused test: 2 pass / 2 fail, proving `Capacity. Details.` remained `unknown` and T3 canonical subject was null.
- Post-repair FIX14 suite: 4 pass / 0 fail.
- Owning-layer + CC:10 + FIX10–FIX14 suite: 84 pass / 0 fail.
- FIX10 data referent guard: PASS.
- FIX11 named historical return guard: PASS.
- FIX12 current-subject deictic issue guard: PASS.
- FIX13 independently resolvable `What changed?` guard: PASS.
- Genuine unknown named subjects still clarify: PASS (FIX11/FIX13 guards).
- Decision authority preserved: PASS; no Decision is fabricated for the Impatient run.
- Ground Truth leakage: none; manager firewall reports `groundTruthAccess=false`.
- NXA funnel Level 1: PASS, 0 failures, 0 skipped.
- NXA funnel Level 2: FAIL, 445 pass / 8 fail. The failures are in pre-existing navigation, scenario-follow-up, grounded-scenario-impact, and explain-semantic tests. None of their failing utterances contains or exercises the new `<named subject> details` grammar. Per Zero-Failure, Level 3 and Level 4 were not run.

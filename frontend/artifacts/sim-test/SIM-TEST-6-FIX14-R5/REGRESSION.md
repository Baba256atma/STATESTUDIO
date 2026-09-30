# SIM-TEST:6-FIX14-R5 Regression

## Focused R5 proof (existing tests, no production edit this pass)

| Proof | Result |
| --- | --- |
| Adjacent kind tokens keep all plausible canonical candidates | PASS |
| Cold-start `Show the risk problem.` clarifies; unique `Show Risk.` / `Show Margin Pressure.` still resolve | PASS (those asserts run before the failing line) |
| After `Show Risk.`, compound utterance still clarifies | FAIL — actual `proceed`, expected `clarify` |
| Bare `Show the risk.` unique Risk; `Show the problem.` unresolved problems | PASS |
| FINAL:6.1 NLU corpus including `amb1` `Show the risk problem.` | PASS (`nexoraMvpFinal61NaturalLanguageUnderstanding.test.ts`) |
| `show risk problem stays ambiguous` | PASS |

Focused R5 file: **2 pass / 1 fail**. The failing assertion is classified independent 6.3 (see ROOT-CAUSE). No further production change.

Bounded FIX10–FIX14 and R2–R4 guards in the same run: **42 pass / 0 fail** among those files (the only failure in the 43-test batch was the R5 after-Risk clarify line).

| Guard | Result |
| --- | --- |
| FIX10 production-data / T92 | PASS |
| FIX11 Service Advisor | PASS |
| FIX12 Project this-issue | PASS |
| FIX13 Project What changed? | PASS |
| FIX14 Impatient T3 / named detail | PASS |
| R2 navigation | PASS |
| R3 Scenario read-only Runtime | PASS |
| R4 Scenario `why?` operation | PASS |
| CC:10 commitment (CommitmentFix1) | PASS |
| Ground Truth leakage | NO |

## NXA funnel (this pass)

- Level 1: PASS — 19 pass / 0 fail / 0 skipped.
- Level 2: PASS — 453 pass / 0 fail / 0 skipped.
- Level 3: PASS — 48 pass / 0 fail / 0 skipped.
- Level 4: FAIL — **1659 pass / 5 fail / 0 skipped** (executive omnibus, 1664 tests). Funnel command status: 1 failed command (`l4-executive-omnibus`).
- R5-attributable NLU corpus regression: 0 (amb1 and `show risk problem stays ambiguous` pass).
- R5-attributable new omnibus failure: 1 focused after-Risk clarify assertion (6.3 skip).
- Remaining Level 4 commands (`l4-dir-inventory`, `l4-typecheck`, `l4-eslint`, `l4-diff-check`, `l4-build`, `l4-live-smoke`) were **not started** because the funnel stops on the first failed required command.
- Required tasks still running: 0.
- Required results uninspected: 0 (omnibus log inspected).
- Nonessential tasks still running: 0.

## Level 4 failure inventory

1. `nexoraMvpFinal61CompoundAmbiguityFix14R5.test.ts` — after `Show Risk.`, `Show the risk problem.` proceeds. NLU remains unresolved with three mixed-kind candidates. Independent 6.3 `TYPE_AMBIGUITY` skip-with-thread.
2. `nexoraMvpFinal63SmartClarification.test.ts` — clarification/correction dialogues (`Explain that.` false negatives). Independent 6.3. Same cluster as R4.
3. `nexoraMvpFinal63SmartClarification.test.ts` — EXPLAIN resume expects `clarify`, actual `proceed`. Independent 6.3.
4. `nexoraMvpFinal63SmartClarification.test.ts` — session reset expects pending clarification that was never opened. Downstream of (2)/(3). Independent 6.3.
5. `nexoraMvpFinal64TrustedCommunication.test.ts` — four verbosity failures. Independent 6.4. Same cluster as R4.

The R4 NLU ambiguity corpus case is gone from this inventory.

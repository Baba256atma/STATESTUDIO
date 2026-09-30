# SIM-TEST:6 FINAL — External MRA/ECA Failure Ledger (post-FIX18)

The initial FINAL ledger is preserved in `EXTERNAL-FAILURES-INITIAL.md`.

## Corrected historical ledger

The initial FINAL reported 13 program-caused regressions and 4 failures shared with `HEAD`. The FIX18 differential corrected this to 14 program-caused regressions and 3 genuine pre-program `HEAD` failures.

"MRA:3-FIX1 C1 first problem then it stays on that Problem" was a hidden Cluster B regression:

- **At `HEAD` `dd3320ed`:** it failed at a later step (`/Margin Pressure/` did not match).
- **At FIX18 entry:** it failed at "look at capcity" with "Focused on Capacity.".
- **Differential:** reverting only FIX18 Cluster B reproduces exactly that entry failure.

| Cluster | Program-caused regressions | Repaired by |
| --- | --- | --- |
| A — Scenario deictic routing (FIX14-R4 seam) | 9 | FIX18-A |
| B — compound/fuzzy referent (FIX10/R9 seam) | 4 | FIX18-B |
| C — contrastive "other" (NCA:2 ordinal seam) | 1 | FIX18-C |
| **Total** | **14 → 0** | |

## Post-FIX18 run

`tsx --test app/lib/nexora-conversation/*.test.ts`:

| Tree | Tests | Pass | Fail |
| --- | --- | --- | --- |
| Current | 1061 | 1058 | 3 |
| `HEAD` `dd3320ed` (`git archive` into `/tmp`) | 1060 | 1055 | 5 |

The one extra current test is the program's added "stale lastCollection is not an ordinal pool after an out-of-collection subject", which passes. No existing external test file was edited: `git diff dd3320ed` shows only that one added test.

| Remaining failure | File:line | Current | `HEAD` | Changed by FIX10–FIX18 | SIM-TEST:6 blocker |
| --- | --- | --- | --- | --- | --- |
| N — Explain visible actor without prior focus | `ecaPostEca2StageAwareness.test.ts:163` | `shouldCommitRuntime` `true !== false` | identical | no | no |
| H — distinguishes listed/planned Execution objects from active canonical Execution | `mra3RecertFix6…runtime.test.ts:134` | "Current Executions: Capacity Expansion, Pricing Rollout." does not match `/planned or catalog records\|no canonical Execution is active/` | identical (same input) | no | no |
| F — asks the smallest useful clarification for ambiguous earlier Problems | `mra3RecertFix6…runtime.test.ts:116` | the named-options clarification `/Which earlier issue do you mean:.*Margin Pressure.*Capacity Gap/` is missing; reply "Which one do you want me to show?" | same assertion fails; reply "Are you asking about the scenario or the problem?" | no (see note) | no |

Note on F: the same assertion fails at `HEAD` and now. A test that already failed at `HEAD` cannot be a program-introduced regression. Its wrong-reply wording changed during the recovery program, but that wording was identical at FIX18 entry, after every FIX18 cluster, and in every single-cluster revert. FIX18 therefore does not affect it.

All three are outside the SIM-TEST:6 invariants: none is exercised by a registered journey, and none affects S0/S1, Decision or Execution integrity, or isolation.

## Historical improvements preserved

These failed at `HEAD` and pass now:

- "E recovers the uniquely defensible earlier Problem".
- "MRA:3-FIX1 C1 first problem then it stays on that Problem", through the generic FIX18-B repair.

## Closure

| Measure | Value |
| --- | --- |
| Program-caused external regressions discovered | 14 |
| Program-caused regressions remaining after FIX18 | **0** |
| Proven pre-program external failures remaining | **3** (N, F, H) |

## Other external items

- **DIRECTOR-1 runner debt** is unchanged:
  - Under `tsx`: 74/83. The 9 failures are the DIRECTOR-1 inventory tests, which use `import.meta.dirname`.
  - Under `node --test`: 77/78. The one failure is `nexoraSemanticPresentationDirector.test.ts`, which passes under `tsx`.
  - Class: environment debt. Not changed by FIX10–FIX18. Not a blocker.
- **nex-mvp UX suites:** 17 failures in the data-reality, decision and nex-mvp group, run as part of FINAL's broader regression sweep. All 17 are in nex-mvp UX:2, UX:4 and UX:5 files.
  - `HEAD` fails 19 in the same group, and the current 17 are a strict subset.
  - Each fails with the identical assertion, source line and actual value at `HEAD`.
  - Three `HEAD` failures now pass: "FIX4 why? still uses Scenario impact…", "MVP-OUT:1-R1 runtime chain", and `csvRealDataVerticalSlice.test.ts`.
  - Class: pre-program product and test debt, outside the SIM-TEST:6 contract. Not a blocker.

# SIM-TEST:6 FINAL — External failure attribution

## Commands

- Current tree: `tsx --test app/lib/nexora-conversation/*.test.ts`. Result: 1061 tests, 1044 pass, 17 fail.
- Pre-program baseline: `git archive HEAD frontend` extracted to `/tmp`, same command. Result: 1060 tests, 1055 pass, 5 fail.
- Attribution: in a `/tmp` copy of the current tree, each of the 25 changed production files was reverted to `HEAD` one at a time, then selected orchestrator hunks one at a time. The 7 affected test files were rerun after each revert.
- `app/lib/nexora-problem-solving/*.test.ts`: 131/131.

## Per-test classification

| Test (file) | At `HEAD` | Now | Cause | Class | SIM-TEST:6 blocker |
| --- | --- | --- | --- | --- | --- |
| N — Explain visible actor without prior focus (`ecaPostEca2StageAwareness`) | fail | fail | pre-existing | product debt, unchanged | no |
| MRA:3-FIX1 C1 first problem then it stays on that Problem (`mra2ManagerReadiness`) | fail | fail | pre-existing | product debt, unchanged | no |
| F asks the smallest useful clarification… (`mra3RecertFix6`) | fail | fail | pre-existing | product debt, unchanged | no |
| H distinguishes listed/planned Execution objects… (`mra3RecertFix6`) | fail | fail | pre-existing | product debt, unchanged | no |
| E recovers the uniquely defensible earlier Problem (`mra3RecertFix6`) | fail | pass | improved by the program | — | no |
| MRA:3-FIX1 knowledge mention then investigate it (`mra2ManagerReadiness`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| Demand Surge operations keep the same subject (`mra3RecertFix1`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| A: Demand Surge then investigate it stays Demand Surge (`mra3RecertFix2`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| B: look deeper into it stays Demand Surge (`mra3RecertFix2`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| C: what else do we know about it stays Demand Surge (`mra3RecertFix2`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| live-like pending attention review cannot capture investigate it (`mra3RecertFix2`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| A: Scenario collection → Demand Surge → investigate it (`mra3RecertFix3`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| C: Scenario comparison → Demand Surge → investigate it (`mra3RecertFix3`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| D: attention Margin Pressure → explicit Demand Surge → investigate it (`mra3RecertFix3`) | pass | fail | R4 `describeResolvedScenario` | regression | **yes** |
| look at capcity prefers the active Problem over the Capacity KPI (`mra3Fix2`) | pass | fail | FIX10 `compoundKeyCoveredByInput` | regression | **yes** |
| look at demnd prefers Demand Surge over similarly named siblings… (`mra3Fix2`) | pass | fail | FIX10 `compoundKeyCoveredByInput` | regression | **yes** |
| isolated NLU may still pick the exact-stem object… (`mra3Fix2`) | pass | fail | FIX10 `compoundKeyCoveredByInput` | regression | **yes** |
| C1 contrastive other binds the sibling Problem… (`mra2ManagerReadiness`) | pass | fail | `nexoraNca2ConversationState.ts` ordinal referability (program; hunk not isolated) | regression | **yes** |

## Representative observed behavior

- **R4 seam:** "Demand Surge" → "investigate it" replies "There isn't a current Scenario impact assessment to explain. This is a scenario projection, not an observed outcome; its causal interpretation remains uncertain." The expected reply stays on Demand Surge.
- **FIX10 seam:** "look at capcity" with an active Capacity Gap Problem resolves `Capacity`. The expected subject is `Capacity Gap`.
- **NCA:2 seam:** the contrastive "other" follow-up replies "I don't have a current ordered list to apply that to…". The expected reply binds Margin Pressure.

## Hunks that do not affect the failing set (reverted individually)

- FIX15 Scenario option-collection retention.
- FIX16 `previous-referent` focus promotion.
- FIX17 runtime commit gate.
- The Decision-status response lock.
- The `explain-scenario` Advisor explicitness guard.
- The deictic follow-up prior-session condition.

## Other external items

- DIRECTOR-1 inventory tests (9) use `import.meta.dirname`. They fail only under `tsx`; under `node --test`, 77 of 78 director tests pass, and the remaining one is the semantic presentation director file, which passes 6/6 under `tsx`. Class: environment debt. Changed by FIX10–FIX17: no. Blocker: no.

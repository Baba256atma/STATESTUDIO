# SIM-TEST:6 FINAL — Integrated FIX10–FIX18 Repair Ledger

Every repair is in an existing owner. None adds an authority, store, presenter or Decision writer.

Composition evidence:

- All guards pass together in one tree: the sim-test folder is 216/216, which includes every FIX and R guard file.
- All 7 registered journeys run in one process with S0 = S1 = 0.
- The FIX18 differential shows FIX18 leaves every journey signature unchanged: Manufacturing `4add88ad`, Project `564816ec`, Logistics `5c62c131`, Service `a03c509c`, FAST `3aa7cfc6` and Impatient `a5d79e5e` are identical with and without the FIX18 hunks.

| Repair | Original defect | Existing owner repaired | Final guard | Status |
| --- | --- | --- | --- | --- |
| FIX10 | T92 "What does the production data show?" resolved Capacity through the alias "production capacity" | NCA-POST:1 registry compound-key coverage; FINAL:6.1 data-qualifier skip; CC:1 `what does X data show` as evidence | `nexoraSimulationDataFix10.test.ts`; FAST T21 stays on Capacity | CERTIFIED, green |
| FIX11 | Service T16–T18: a stale Delivery overrode a visited Capacity named return, so the Advisor followed the wrong subject | FINAL:6.2 named return (prefers the visited subject) | `nexoraSimulationAdvisorFix11.test.ts`; R9 FAST re-baseline | green |
| FIX12 | Project T18: "this issue" jumped to Capacity Gap instead of the active Customer | FINAL:6.2 generic current-issue deictic | `nexoraSimulationAdvisorFix12.test.ts` | green |
| FIX13 | Project T35: "What changed?" became a third pending-issue clarification | FINAL:6.3 pending clarification lifetime | `nexoraSimulationClarificationFix13.test.ts` | green |
| FIX14 (+R1–R9) | Impatient T3: CC:1 returned `unknown` for "Capacity. Details." | CC:1 `matchFocusOrOpen` grammar; R3–R9 recovered the regressions it exposed | FIX14 and R3–R9 tests; Impatient T3 → obj-capacity | CERTIFIED, green |
| FIX15 | Impatient T8 MISSING_DECISION: "Options." / "Go with B." grammar | CC:1 option-request and explicit-commit grammar; CC:9 seeding; CC:10 ordinal mapping (still the only writer) | `nexoraSimulationDecisionFix15.test.ts`; Impatient T8 gives exactly one Decision | CERTIFIED, green |
| FIX16 | Impatient T14 "Back to capacity." was not a canonical transition | FINAL:6.2 named historical return promotion | `nexoraSimulationReferentFix16.test.ts`, `conversationNamedHistoricalReturn.test.ts`; T14 → obj-capacity | CERTIFIED, green |
| FIX17 | Impatient T30/T31: after "The previous one.", the Advisor and Stage diverged from canonical | orchestrator previous-referent commit gate; narrow Observer back-navigation correction (read-only) | `nexoraSimulationAdvisorFix17.test.ts`, including positive WRONG_REFERENT and ADVISOR_DIVERGENCE detection; T30/T31 fully aligned | CERTIFIED, green |
| FIX18-A | Scenario deictic regression (9): "investigate it" on a Scenario went to `impact-why` | orchestrator `describeResolvedScenario` (reuses `isTargetedDeicticInvestigationUtterance`) | FIX18 A1–A6; R4 "Why?" stays `impact-why`; R3 read-only | CERTIFIED, green |
| FIX18-B | fuzzy/compound referent regression (4): "capcity" lost its ambiguity and resolved to the KPI | NCA-POST:1 registry fuzzy resolver: a partial match can only join a tie | FIX18 B1–B8; FIX10 T92; R9 head noun | CERTIFIED, green |
| FIX18-C | contrastive "other" regression (1): the ordinal CLARIFY branch overrode a resolved contrast | NCA:2 ordinal branch; FINAL:6.2 unique same-type contrast | FIX18 C1–C5; FIX9 ordinal guards | CERTIFIED, green |

## R3–R9 protection

| Phase | What it protects |
| --- | --- |
| R3 | Scenario explain stays read-only (no Runtime commit) |
| R4 | Scenario "Why?" gives `impact-why` |
| R5 | FINAL:6.1 compound-kind ambiguity |
| R6 | FINAL:6.3 Smart Clarification state |
| R7 | FINAL:6.4 recommendation gating and repeated-sentence suppression |
| R8 | typecheck = 0 |
| R9 | FAST semantic pin and the R9 head noun ("pressure" → Margin Pressure) |

All are green in this FINAL.

The three certified hunks removed by the concurrent working-tree rewrite during FIX18 are present, byte-for-byte equal to their certified content: two from R7 and FIX15's "go with X".

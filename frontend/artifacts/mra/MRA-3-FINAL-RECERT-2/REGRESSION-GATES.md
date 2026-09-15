# Regression gates

Current product after MRA:3-RECERT-FIX1. Independent recert-2. No production patch in this phase.

| Gate | Result |
| --- | --- |
| Isolated recert-2 simulation | Ran; 172 turns; LONG-57; leaks 0; deictic INVESTIGATE PASS in isolation |
| Live `/executive` recert-2 | Ran; 0 page errors; leaks 0; Capacity Gap + Demand Surge explain/more PASS; live INVESTIGATE family FAIL |
| FINAL:6.2 | PASS (`nexoraMvpFinal62ConversationContinuity.test.ts`) |
| FINAL:6.3 | PASS (`nexoraMvpFinal63SmartClarification.test.ts`) |
| FINAL-FIX1-FIX1 fidelity | PASS (`mra3FinalFix1Fix1Fidelity.runtime.test.ts`) |
| RECERT-FIX1 deictic suite | PASS (`mra3RecertFix1DeicticFidelity.runtime.test.ts`) — does not cover live INVESTIGATE→Margin Pressure |
| NCA / NCA-POST | PASS (L4 manager-object omnibus) |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 | PASS (`durationMs` 545164; 7/7 including typecheck, production build, live smoke) |
| ECA mutation | PASS |
| ECA Outcome / DTH outcome observation | PASS |
| DATA-ADV / DATA-UX conversation | PASS (`nexoraAdvisorDataInquiry.test.ts`, POST-ECA:3 CSV reasoning) |
| Stage / Manager–Object | PASS (L4) |
| Decision / Execution (CC:10/11 via live counts + L4) | Canonical counts PASS; Advisor Repricing labels are S2 |
| TypeScript | PASS (L4 typecheck) |
| Production build | PASS (L4 build) |

Zero-Failure on required automated gates. Isolated green does not override the live S1.

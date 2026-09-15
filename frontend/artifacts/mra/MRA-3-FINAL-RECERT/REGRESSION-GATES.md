# Regression gates

Current product after FINAL-FIX1-FIX1. Independent recert run. No production patch.

| Gate | Result |
| --- | --- |
| Isolated recert simulation (157 turns, LONG-55) | Ran; S1 `tell me more` reproduced |
| Live `/executive` | Ran; 0 page errors; historical `explain it` PASS; Test C FAIL |
| FINAL:6.2 | PASS (NXA L2/L4) |
| FINAL:6.3 | PASS (`nexoraMvpFinal63SmartClarification.test.ts`) |
| NCA / NCA-POST | PASS (L4 omnibus) |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 | PASS (`durationMs` 541523; 7/7) |
| ECA mutation | PASS |
| ECA Outcome | PASS |
| DATA-ADV / FIX2-FIX1 | PASS |
| Decision Theatre outcome observation | PASS |
| Manager–Object / Stage | PASS (L4) |
| Decision / Execution (CC:10/11 via live+L4) | PASS canonical counts |
| TypeScript | PASS (L4 typecheck) |
| Production build | PASS (L4 build) |

Gates passing do not override the live/isolated S1.

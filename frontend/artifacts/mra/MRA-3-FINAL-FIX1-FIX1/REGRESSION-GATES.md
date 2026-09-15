# Regression gates

| Gate | Result |
| --- | --- |
| Focused fidelity + Stage + A–G | PASS |
| FINAL:6.2 | PASS (`nexoraMvpFinal62ConversationContinuity.test.ts` in L2/L4) |
| FINAL:6.3 | PASS (`nexoraMvpFinal63SmartClarification.test.ts`) |
| NCA / NCA-POST | PASS (L4 manager-object omnibus) |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 | PASS (7/7; `durationMs` 514939) |
| ECA mutation | PASS (`ecaMutationProposal`, `ecaRiskMutationHandoff`) |
| DATA-ADV / FIX2-FIX1 | PASS (`mra3Fix2Fix1CrossDomain.runtime.test.ts`) |
| Stage / Manager–Object | PASS (L4 omnibus) |
| Decision CC:10 / Execution CC:11 | PASS (L4 conversational-control + entrance) |
| TypeScript | PASS (L4 `l4-typecheck`) |
| Production build | PASS (L4 `l4-build`) |
| Live `/executive` | PASS; 0 page errors |

Zero-Failure: no skipped required gates. S2/S3 from MRA:3 were not repaired.

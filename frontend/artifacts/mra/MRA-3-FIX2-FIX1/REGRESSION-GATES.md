# Regression gates

| Gate | Result |
| --- | --- |
| Focused cross-domain Tests A–F + Execution | PASS (`mra3Fix2Fix1CrossDomain.runtime.test.ts`, 8/8) |
| DATA-ADV unique inventory → explain it | PASS |
| NXA:5 risk-criterion composition | PASS |
| FINAL:6.2 corpus / continuity tests | PASS (`nexoraMvpFinal62ConversationContinuity.test.ts`) |
| FINAL:6.3 clarification tests | PASS (`nexoraMvpFinal63SmartClarification.test.ts`) |
| MRA:3-FIX2 referential suite | PASS |
| MRA:2 manager-readiness | PASS |
| DATA-ADV + POST-ECA CSV inventory / content | PASS |
| ECA mutation + working conversation | PASS |
| NCA / NCA-POST / registered reference / Stage FIX4 | PASS |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 omnibus, DIR, typecheck, eslint, diff-check, production build, live `/executive` smoke | PASS (`durationMs` 322355; `zeroPageErrors`) |

## FIX2 paths re-run

- go back to the first problem → explain it
- Scenario compare → explain the second one
- pending clarification `Explain that.`
- What's going on with that?
- look at capcity (FIX2 suite)

Zero-Failure: no skipped required gates. New S0/S1: none observed on required gates.

TypeScript: L4 `l4-typecheck`. Production build: L4 `l4-build`.

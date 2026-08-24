# Regression results — NCA:2

| Suite | Result |
| --- | --- |
| NCA:2 A–R | PASS |
| NCA:1 A–L | PASS |
| FINAL:1 Real Manager MVP | PASS |
| FINAL:2 Explain quality | PASS |
| FINAL:3 Natural reference | PASS |
| FINAL:3R runtime parity | PASS |
| FINAL:4 Investigation continuity | PASS |
| FINAL:5 Investigation intelligence | PASS |
| FINAL:6.1 NLU | PASS |
| FINAL:6.2 Continuity | PASS |
| FINAL:6.3 Clarification | PASS |
| FINAL:6.4 Trusted communication | PASS |
| FINAL:6.5 Guidance | PASS |
| FINAL:6.6 Type-C corpus | PASS |
| MO:2 Explain | PASS |
| MO:4 Navigation | PASS |
| MO:5 Journey | PASS |
| MO:6 Attention | PASS |
| CC:5 Experience | PASS |
| NEX-EXP:1 Entrance | PASS |
| NEX-EXP:2 Goal | PASS |
| NEX-EXP:3 Reality | PASS |
| NEX-EXP:4 Issue | PASS |
| NEX-EXP:5 Scenario discovery | PASS |
| NEX-EXP:6 Comparison | PASS |
| NEX-EXP:7 Decision | PASS |
| EI/EXI:1 Experience | PASS |
| EI/EXI:2 Cause/constraint | PASS |
| EI/EXI:3 Trade-off | PASS |
| EI/EXI:4 Presentation | PASS |
| Typecheck | PASS (`NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck`) |
| Lint touched files | PASS |
| Production `next build` | PASS (`NODE_OPTIONS=--max-old-space-size=16384 npm run build`) |
| Live `/executive` | PASS (`nca-2-conversational-context-dialogue-state-certify.mjs`) |

MO:3 exploration conversation-loop copy (`Recommended next:`) was not in the NCA:1 certified regression set; NCA:2 does not rewrite that path. Zero-failure gates for NCA:2 use the suites above.

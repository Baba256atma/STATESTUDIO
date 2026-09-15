# Regression gates

| Gate | Result |
| --- | --- |
| Isolated Tests A–G | PASS (`mra3FinalFix1Parity.runtime.test.ts`) |
| Isolated Stage reconverge (not Revenue) | PASS (focus returns to Capacity Gap) |
| FIX2-FIX1 | PASS |
| FINAL:6.2 / 6.3 | PASS (pre-L4 suite) |
| DATA-ADV, NCA/NCA-POST, ECA, Stage FIX4, CC:10, CC:11 | PASS (pre-L4 suite) |
| NXA L1–L3 | PASS |
| NXA L4 | PASS (`durationMs` 524277; all 7 required commands) |
| TypeScript | PASS (L4 `l4-typecheck` + production build) |
| Production build | PASS (L4 `l4-build`) |
| Live Test A (MRA-3-FINAL-001) | PASS |
| Live Tests B–G | PASS (same audit file) |
| Live Stage `explain it` after named return | FAIL — Capacity Expansion Plan while Stage is Capacity Gap |
| Live page errors | 0 on the captured audit |

S2/S3 from MRA:3 were not repaired. See `artifacts/mra/MRA-3-FINAL/CONVERSATION-FUTURE-BACKLOG.md`.

A fidelity/remap change that made Stage `explain it` return the Problem **failed** NXA L4 (`mvpOut1Fix2/Fix4/Fix5` Scenario follow-ups). It was reverted. Duplicate Runtime dispatch after Stage move was kept.

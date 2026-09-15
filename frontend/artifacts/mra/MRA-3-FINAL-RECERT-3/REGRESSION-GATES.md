# Regression gates

| Gate | Result |
| --- | --- |
| Independent live manager session | FAIL (103 turns; S1 blockers) |
| Live page errors | PASS (0) |
| Architecture leaks | PASS (0 material) |
| Short isolated RECERT-FIX2 comparison | PASS (12/12) |
| FINAL:6.2 / FINAL:6.3 | NOT RUN in RECERT-3 — stopped on live S1 |
| RECERT-FIX1 / FINAL-FIX1-FIX1 | NOT RUN in RECERT-3 — stopped on live S1 |
| NCA / NCA-POST / ECA / DATA / DTH | NOT RUN in RECERT-3 — stopped on live S1 |
| NXA L1–L4 | NOT RUN in RECERT-3 — stopped on live S1 |
| TypeScript | NOT RUN in RECERT-3 — stopped on live S1 |
| Production build | NOT RUN in RECERT-3 — stopped on live S1 |

The immediately preceding RECERT-FIX2 run recorded all of those gates as PASS, including NXA L4 7/7, 8 GB typecheck, and production build. They are historical evidence only and are not inherited as an independent MRA:3 pass.

Per the no-mid-certification-repair rule, rerunning expensive gates cannot override the confirmed live S1 and was intentionally stopped.


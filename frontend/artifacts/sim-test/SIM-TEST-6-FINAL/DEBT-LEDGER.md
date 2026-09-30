# SIM-TEST:6 FINAL — Debt Ledger

None of these violates a SIM-TEST:6 certification invariant: S0/S1, journey execution, isolation, Decision and Execution integrity, the Ground Truth boundary, and Observer read-only are all intact. None was repaired in FINAL.

| Debt | Class | Evidence | SIM-TEST:6 blocker? |
| --- | --- | --- | --- |
| N — Explain visible actor without prior focus | Product debt (pre-program) | identical assertion at `HEAD` `dd3320ed` (`EXTERNAL-FAILURES.md`) | No |
| F — smallest useful clarification for earlier Problems | Product debt (pre-program) | same assertion at `HEAD`; FIX18 did not change it | No |
| H — listed/planned vs active Execution | Product debt (pre-program) | identical input and assertion at `HEAD` | No |
| After a listed collection, "the other one" is read as "the second one" | Product debt (pre-program) | FIX18 ROOT-CAUSE: identical at `HEAD` | No |
| A "the other one" follow-up binds the correct subject but gets Scenario-impact wording | Product debt (pre-program) | FIX18 ROOT-CAUSE: `HEAD` has the same reply | No |
| Repeated "The previous one." splits CC:2 and FINAL:6.2 | Product debt | FIX17 CERTIFICATION; not exercised by any journey; the commit gate refuses the mismatch | No |
| "X again" is not a named return | Product debt | FIX16/FIX17 records; Impatient T16 still stays on Capacity (no stale referent) | No |
| An unvisited terse "Back to inventory." diverges | Product debt | FIX16 REPAIR/CERTIFICATION | No |
| ECA:8 invents Scenario B wording | Product debt (wording) | FIX15 ROOT-CAUSE | No |
| T9 wording | Product debt (wording) | FIX15/FIX16 records | No |
| T10 Execution contradiction (canonical shows the intervention Scenario while the Decision is do-nothing) | Product debt | Impatient T10 in this FINAL; Execution count 1, identity stable | No |
| CC:9 re-seeding | Product debt | FIX15–FIX17 records; candidate identity reaching CC:10 is canonical | No |
| Advisor option prose vs candidate mismatch | Product debt (wording) | FIX15–FIX17 records | No |
| S1-06 status and S1-06 T1 no-match | Product debt | R8/R9 records; the R9 head-noun repair is green | No |
| "Give me the details." | Product debt | R7/R9 records | No |
| Delivery walkthrough drift | Product debt | R7–R9 records | No |
| ECA confidence wording | Product debt (wording) | FIX16/FIX17 records | No |
| ".." formatting | Product debt (formatting) | R7–R9 records | No |
| Build-memory setting (`NODE_OPTIONS=--max-old-space-size=8192` in `build`) | Environment debt | BUILD-FIX-SIM5; the only `package.json` change vs `HEAD` | No |
| DIRECTOR-1 runner debt | Environment debt | tsx 74/83 (9 inventory tests, `import.meta.dirname`); `node --test` 77/78; unchanged | No |
| NPS `SUBJECT_LOSS` S3 findings (Logistics T23 root, Project T34 downstream) | Product debt (label/presentation) | the NPS problem label differs while the reply stays on the active subject; unchanged since the initial FINAL; identical without FIX18 | No: the referent and reply are correct, so it is not a hidden S1 |
| nex-mvp UX:2/UX:4/UX:5 suites (17 failures) | Test and product debt (pre-program) | strict subset of `HEAD`'s 19, with identical assertions | No |
| Unused `decisions` variable in `executiveExecutionFollowUp.test.ts:102` (eslint warning) | Test debt | eslint 0 errors, 1 warning; L4 eslint passes | No |

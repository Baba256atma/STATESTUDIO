# MRA:2 — Generalization Tests

Date: 2026-09-09

Production code must pass by semantic class, not by memorizing MRA:1 seeds.

| Cluster | Audit seed | Unseen variants exercised | Where |
| --- | --- | --- | --- |
| C3 | `show me Completely Invented Problem` | `list our problems`, `now risks`, `how many problems are on stage` | `mra2ManagerReadiness.runtime.test.ts` interpreter assertions |
| C3 | `how many problem we have` | count + membership together in POST:3 copy | same + runtime `A-imperfect-english` |
| C2 | `show me what is on Stage` | after `Focus on Risk.` (not the isolated cold SHOW) | MRA:2 C2 test + `C-stage-advisor` |
| C1 | `explain the second one` / `and the other one?` | `what about the first problem?` after Demand Surge | C1 tests + `B-context-continuity` |
| C1 | `explain it` after Capacity Gap | stays Capacity Gap (knowledge, not Stage uniqueVisible) | C1 knowledge follow-up test |
| C6 | `explain the CSV file you currently have` | `tell me about my data`, `does this source tell us anything about the capacity issue?` | C6 test + DATA-ADV classifiers |
| C6 | `Can this CSV support Capacity Gap?` | `Can this data support the Capacity Gap?` | `M-data-ready` |
| C7 | Approve then start | `are we ready to execute?` then `start it` on one runtime | C7 test + journey J |
| C8 | `delete Margin Pressure` | must remain REMOVE | C8 test + `H-casual-mutate` |
| C5 | leftover rec on SHOW | `show me problems` after `What should I do?` | C5 test |
| C4 | architecture leak | `what should I do?` must not emit requirement codes | C4 test |

Unseen wording that is **not** required in production, only in tests: `tell me about my data`, `does this source tell us anything about the capacity issue?`, `list our problems`.

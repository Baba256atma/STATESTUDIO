# MRA:3 — Long-Session Evidence

Date: 2026-09-09

Journey `LONG-50` in `runtime-turns.json`. **52 manager turns, one isolated CC:5 conversation, no reset.** Seeded CSV `capacity-ready.csv` remained in the Data Library.

## Coverage actually exercised

Problems, Data (required explain-CSV), Stage SHOW, recommendation, correction, Scenarios, Decision (`Approve Demand Surge` → `canonicalApproved=1`), Execution (`start it` → `canonicalExecutions=1`), unrelated interruption (`what about weather in Paris`), return (`go back to the problem`), mutation attempt, KPI/Evidence/Goals collections, `investigate it`.

## Referent accuracy (selected)

| Turn | Manager | Expected referent | Actual | Result |
| --- | --- | --- | --- | --- |
| 5 | `look at Capacity Gap` | Capacity Gap | Focused Capacity Gap | Pass |
| 21 | `the second one` after Problems list | Margin Pressure | “Understood — Margin Pressure.” | Pass |
| 22 | `no I mean Capacity Gap` | Correction to Capacity Gap | “I'll use capacity-ready.csv.” | Fail — CSV, not Problem |
| 30 | `the first one` after scenario compare | Capacity Expansion Plan | Understood — Capacity Expansion Plan | Pass |
| 31 | `and the other one?` | Demand Surge (next remaining) | Understood — Demand Surge | Pass |
| 34 | `Approve Demand Surge` | Demand Surge Decision | Spoken: Demand Surge approved **and** “Capacity Expansion Plan is already the committed Decision.” Canonical approved count=1 | Fail — identity overlay |
| 36 | `go back to the problem` | Problem collection | Listed Capacity Gap, Margin Pressure | Pass list; no unique focus |
| 50 | `investigate it` after Demand Surge explain | Demand Surge | Compared Problems as “goal items” | Fail — MRA-1-008 class |
| 51 | `what about the first problem?` | Capacity Gap | Capacity Gap listed | Pass |

## Context leak

- After CSV work, `ok forget data for a minute` did not re-anchor; next Stage turns still used Capacity Gap focus (acceptable) but later `why are you recommending this?` explained **Margin Pressure** while the last successful rec was temporary capacity.
- Paris interruption answered with `INSUFFICIENT_REALITY` (internal attention label).
- After Execution start, `should we change the plan` leaked `ECA:10` and reopened Capacity Gap investigation instead of Execution deviation.

## End state

`canonicalApprovedDecisions=1`, `canonicalExecutions=1`. Advisor still mixed Problem investigation with Execution review. Session completed without crash.

## Live long session

Live used **reset between journeys**, not a 50-turn unreset browser session. The 52-turn proof is isolated CC:5. Live nav/reload after Problems SHOW still listed the same Problems (page errors 0).

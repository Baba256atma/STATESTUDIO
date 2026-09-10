# MRA:3 — Runtime Evidence

Date: 2026-09-09

Validation only. Does not rewrite MRA:1 or MRA:2 artifacts.

## Isolated CC:5

- Driver: `frontend/scripts/mra-3-runtime-simulation.ts`
- Trace: `frontend/artifacts/mra/MRA-3/runtime-turns.json`
- Identity: `NPA-T MRA:3/RuntimeManagerSimulation`
- 15 journeys, **153** recorded turns, **52** unreset LONG-50 utterances
- CSV seed: committed `capacity-ready.csv` (`currentRevenue,previousRevenue,usedCapacity,totalCapacity`)
- CC:10/11 threading: `previous ? previous.decisionRuntime : undefined` (same C7 rule as MRA:2)

### Required Data phrase

Isolated J3 and LONG: “Explain the CSV file you currently have and tell me what you understand from it.”

Advisor stayed on the source: confirmed fields, related Capacity/Revenue, no filename-as-cause. Unseen `tell me about my data` matched the same Data answer in J3.

Live `/executive` after importing `test-fixtures/data-ux5-fix2/capacity.csv`: `dataRoute=DATA-ADV:1/AdvisorDataInquiry` for inventory, required explain, `tell me about my data`, and `Can this CSV support Capacity Gap?` (pending review, not treated as evidence). `does that prove it caused the problem?` left DATA-ADV (`dataRoute=none`).

### Decision / Execution parity (threaded)

| Surface | After `Approve Demand Surge` | After `start it` |
| --- | --- | --- |
| Advisor | Approved / Execution has started | Active Execution |
| Canonical CC:10/11 | approved=1 | executions=1 |
| Stage thread counts (live attrs) | decisionCount=0 | executionCount=0 |
| Theatre | Projection; not a second writer | Same |

Invariant held: Advisor did not claim Approve/start without canonical counts incrementing on the threaded runtime. Stage catalog counts remaining 0 is the same spatial vs CC split recorded in MRA:2 — classified, not hidden.

### Mutation

ADD Supplier Delay proposed then cancelled on `no` (isolated and live). Delete Margin Pressure refused (no delete writer) — C8 still holds. J10 later violated confirmation-after-topic-change (MRA-3-004).

### Leaks detected by regex `\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|…)`

- J8 and LONG: `ECA:10 will not change the Decision.`
- Additional manager-facing internals not in that regex: `INSUFFICIENT_REALITY`, `cc9:scenario:do-nothing:do-nothing:v1`

## Live `/executive`

- Driver: `frontend/scripts/mra-3-live-simulation.mjs`
- Trace: `live-audit.json`
- Screenshot: `live-proofs.png`
- `zeroPageErrors: true`, CSV import `ok`
- Journeys used `?reset=1` **between** persona paths (not one 50-turn live thread)
- Stage queue Problems row, Back, Forward, Overview, then reload. Playwright’s visible click on Overview timed out (option exists but is not painted); DOM click succeeded. After `show me problems`, live `whats on stage` reported Capacity Watch and Customer Watch while `stageMode` was `overview`. Isolated Overview reset cleared Problem collection focus; next `whats on stage` listed Capacity Watch and Risk Watch. After reload, `what problems do we have` listed Capacity Gap, Margin Pressure.

## What was not claimed

Live Theatre 3D object identity was not independently dumped beyond shell attributes. Outcome 91/94/96 was not a certified Outcome writer path; Advisor treated manager numbers as observation and did not assert proven causality (J9 mixed Scenario investigation with “too early to judge Outcome”).

# MRA:2 — Runtime Evidence

Date: 2026-09-09

Does not rewrite MRA:1 `runtime-turns.json` or `live-audit.json`.

## Isolated CC:5 corpus

- Script: `frontend/scripts/mra-2-runtime-audit.ts`
- Output: `runtime-turns.json`
- 33 journeys, 150 turns
- Runtimes are threaded (C7). CSV seeds match MRA:1 pending/ready/empty.

### Journey highlights

| Journey | Result |
| --- | --- |
| A Stage-meta / Problems | Count and unknown member closed. `show me what is on Stage` after Risk is Stage membership. |
| B Data | Ready CSV support question stays on data relationship, not cause. Ambiguous CSV follow-up lists unresolved fields. |
| C Problem | `and the other one?` → Margin Pressure. |
| D Scenario | Second-scenario ordinal excludes Watch. Scenario A/B letter aliases still fail (S2-014). |
| E Decision | Approve Demand Surge → canonical approved Decision count 1. |
| F Execution | `start it` after that Decision → Execution started, canonical executions 1. |
| G Mutation | Delete Margin Pressure is REMOVE, not add. |
| H Context | Knowledge `explain it` stays on Capacity Gap. `investigate it` after named Demand Surge still ambiguous (deferred 008). |

## Live `/executive`

- Script: `frontend/scripts/mra-2-live-audit.mjs`
- Outputs: `live-audit.json`, `live-proofs.png`
- Page errors: 0
- URL: production `next start` on a free port with `?reset=1`

| Journey | Result |
| --- | --- |
| A Stage | Problems collection + `explain it` stays Capacity Gap. |
| B Data | Reset workspace has **no imported CSV**. Explain-CSV did not invent a file. Seeded isolated corpus is the Data-path proof. |
| Decision | Approve Demand Surge → Approved; `canonicalApproved=1`; Stage thread decision count `0`. |
| Execution | `start it` → Execution has started; `canonicalExecutions=1`; `eca10=ACTIVE`; Stage thread execution count `0`. |

Stage thread counts are spatial catalog occupancy. Canonical CC:10/CC:11 counts are Decision/Execution truth.


## Data conversation

`Explain the CSV file you currently have and tell me what you understand from it.` and the unseen `tell me about my data` reach DATA-ADV source-semantics on a committed ready CSV.

`Can this CSV support Capacity Gap?` / `does this source tell us anything about the capacity issue?` reach evidence-relevance without treating the file as the cause of Capacity Gap.

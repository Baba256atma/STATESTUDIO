# DTH:9 — Decision → Execution Readiness & Theatre Handoff

## Smallest extension point

Project `ExecutionReadiness` after a DTH:8 COMMITTED Decision. Scene intent reuses DTH:5 `REVIEW_COMMITMENT` / `REVIEW_EXECUTION`. Start writes only through CC:11 follow-up.

Canonical flow:

CC:10 / CC:10R committed Decision → DTH:9 readiness Theatre → explicit “Start it.” → CC:11 create/prepare/start → related Execution.

Approval, click, investigation, comparison, and “show executions” do not start Execution.

## CC:11 availability finding

CC:11 is present on `/executive` as `createNexoraCanonicalExecutionRuntime` on the Executive shell.

Before DTH:9, existing-workspace conversation did not call `resolveNexoraExecutiveExecutionFollowUp` for “Start it.” DTH:9 routes that utterance through CC:11 when an Approved CC:10R Decision exists. If the adapter is omitted, the Theatre stays in `COMMITTED_AWAITING_EXECUTION` and does not invent Execution.

NEX-EXP:8 entrance `data-nex-exp8-started` remains a separate entrance-workspace flag.

## Reused authorities

| Concern | Authority |
|---|---|
| Committed Decision | CC:10 / CC:10R |
| Execution create/start | CC:11 ExecutionFollowUp + CanonicalExecutionRuntime |
| Scene purpose | DTH:5 `REVIEW_COMMITMENT` / `REVIEW_EXECUTION` |
| Comparison history | DTH:7 membership preserved on the readiness contract |
| Investigation | DTH:6 |
| Click / focus | NEX-MVP:4 |

Reserved capabilities remain length 7. DTH:10 is not started.

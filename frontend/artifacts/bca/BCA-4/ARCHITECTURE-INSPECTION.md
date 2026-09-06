# BCA:4 architecture inspection

## Partial work

No BCA:4 files existed. BCA:1–3 in `business-context-awareness/` are the established chain. This phase extends that module only.

## Existing process/execution authorities left untouched

| Authority | Role | BCA:4 relation |
| --- | --- | --- |
| CC:11 Canonical Execution | Decision execution runtime | Not used. Project work phase is `PROJECT_WORK_EXECUTION`. |
| CORE-OUT Outcome | Canonical Outcome | `nexoraOutcomeId: null` |
| ops/project dependency registries | Runtime/schedule dependencies | Not copied; BCA does not emit DEPENDS_ON |
| DS:4 relationship intelligence | Object-graph profiles | Not a process model |
| Journey/workflow flags | Explicitly not workflow engines | BCA:4 is also not a workflow engine |
| Stage / DTH | Presentation | Unwired |

## Intelligence chain

DATA-ADV → BCA:1 context → BCA:2 concept → BCA:3 relationship → BCA:4 process-area placement.

## Safety equations documented

Process Context ≠ Instance, Mining, Workflow. Reference Sequence ≠ Observed Sequence. Process Position ≠ Dependency or Causality. Project work EXECUTION phase ≠ Nexora Execution. Process output ≠ Outcome. Process area ≠ Object.

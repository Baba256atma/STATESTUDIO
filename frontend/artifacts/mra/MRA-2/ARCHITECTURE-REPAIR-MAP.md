# MRA:2 — Architecture Repair Map

Date: 2026-09-09

Stop condition: systemic manager-readiness repairs from the MRA:1 baseline. Do not start MRA:3. Do not add a second Stage, Decision, Execution, Data, collection, dialogue-objective, or mutation writer.

MRA:1 remains the audit record. This map records **which existing authorities were repaired around**, not replaced.

## Preserved authorities

| Concept | Authority | MRA:2 stance |
| --- | --- | --- |
| Live Advisor turn | CC:5 `executeNexoraConversationalExperience` | Single production entry. Isolated audits now thread `decisionRuntime` / `executionRuntime`. |
| Intent | CC:1 | Ordinal / contrastive `other` added to the existing matcher. Knowledge questions such as `What is a Problem?` must not become ordinal/write. |
| Context / reference | CC:2 + FINAL:6.2 | Sibling/`other` resolution uses presented set, then same-kind catalog members, excluding Watch labels. |
| ECA | ECA:1–12 overlay | Mutation proposals carry typed operations. ECA still does not write Decisions or Executions. |
| NCA / NCA-POST | NCA:1–7, POST:2–4 | POST:2 collection queries and POST:3 membership remain collection authority. |
| Stage read | NXA:5-FIX4 | Stage-meta uses workspace-state; Watch actors are Stage projections, not Problems. |
| Data | DATA-ADV:1 | Source + intent + optional business-object relationship routes before generic NCA investigation. |
| Decision | CC:10 | Canonical writer unchanged. Explicit Approve policy still `confirmation-not-required` (deferred S1-002). |
| Execution | CC:11 | Consumes the same CC:10 session the Advisor announced. |
| Risk mutation | canonical Risk writer | ADD Risk only. REMOVE is typed and refused when no delete writer exists. |
| Theatre | projection | Not a competing Decision/Execution store. Stage thread counts remain spatial catalog, distinct from canonical CC counts. |

## Dependency order used

Inspected existing contracts before coding. Implemented in the MRA:1 cluster order with one documented dependency:

1. **C7 before live Decision/Execution journeys** — sequential `execute` must return and reuse one Decision/Execution runtime, otherwise C1/C5 follow-ups cannot be judged against a real Decision.
2. **C3 unknown-member before C1 ordinal-in-collection** — ordinal `first problem` was being classified as an unknown member name.
3. **C2 Stage-meta before C9 presentation** — SHOW-Stage must not enter FINAL:6.3 object clarification.

No second dialogue-objective store, Stage, or recommendation engine was added.

## Intentional Stage vs collection distinction (C9)

A manager asking **What is on Stage?** receives NXA:5-FIX4 membership (including Watch/attention actors).

A manager asking **What Problems do we have?** receives NCA-POST:3 canonical Problems.

Watch actors are not deleted to force collection parity.

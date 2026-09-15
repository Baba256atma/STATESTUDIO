# NPA-T NPS:6 — Architecture Inspection

Inspection date: 2026-09-15.

NPS:6 composes commitment/Decision path state. It does not own commitment interpretation, confirmation, Decision writes, or Execution.

## Canonical owners

| Concern | Owner | NPS:6 role |
| --- | --- | --- |
| Problem truth | NPS:1–5 | `UNCERTAIN`/`CONFLICTED` → `CLARIFY_PROBLEM`, 0 CC:10 writes |
| Recommendation | ECA:7 / NCA:4 via NPS:5 | Observe; never auto-approve |
| Manager preference | ECA:8 `PREFERENCE` | `PREFERENCE_EXPRESSED`; not a Decision |
| Commitment interpretation | ECA:8 | Owner. NPS maps states only |
| Pre-Decision challenge | ECA:8 | One material challenge; NPS preserves conditions |
| Confirmation | CC:10 pending confirmation | Generic Yes without pending target does not approve |
| Decision create/approve | CC:10 / CC:10R | Sole writer. NPS observes `applied` / `failed` |
| Execution readiness | ECA:9 / CC:11 | Next path only; 0 CC:11 writes |

## Path

`RECOMMENDATION_READY` → `AWAITING_COMMITMENT` during commitment dialogue → `DECIDED` only when canonical `approvedDecisionId` is observed. Next valid state is `EXECUTION_READINESS`. NPS:6 does not start Execution.

NPS:7 was not started.

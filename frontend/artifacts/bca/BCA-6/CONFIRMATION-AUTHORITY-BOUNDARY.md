# BCA:6 confirmation-authority boundary

## Sole writers (unchanged)

1. **`applyCsvSemanticClarification`** — CSV/DATA-ADV field meaning, including “I don’t know”, reject, and correction.
2. **ManagerConversation** — manager-confirmed role, process context, and organization-specific placement already consumed by BCA:1/4/5.

NCA:2 holds session `pendingQuestion` only. It is not a durable business-truth store.

## BCA:6 handoff

`confirmationHandoffAuthority` is one of:

- `applyCsvSemanticClarification`
- `ManagerConversation`
- `none`

`writesConfirmation` is always false. Diagnostics `bcaWriteAttempted` is always false.

## What confirmation is not

| Confirmation of | Does not become |
| --- | --- |
| Role (“I am the CFO”) | permission or Decision authority |
| Meaning (“BKL is backlog”) | current backlog amount, Problem, or KPI |
| “Capacity affects backlog” | canonical CAUSES |
| Scenario/option wording | CC:10R Decision |
| Project phase wording | CC:11 Execution |
| Any clarification resolution | Stage or Theatre mutation |

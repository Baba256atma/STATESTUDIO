# NPA-T NPS:4 — Architecture Inspection

Inspection date: 2026-09-15.

NPS:4 composes response-option candidates on the Problem-Solving Path. It does not own Scenarios, comparison, recommendation, Decision, or Execution.

## Canonical owners

| Concern | Owner | NPS:4 role |
| --- | --- | --- |
| Problem truth | NPS:1 (preserved by NPS:2–3) | Operate only when `DETERMINED`; else `CLARIFY_PROBLEM` |
| Evidence truth | CC:8 / Data Reality via NPS:3 | Consume trusted observations; do not write |
| Contributor / cause reasoning | CORE-INT:3 via NPS:3 | Possible contributor ≠ confirmed cause; uncertainty travels with options |
| Scenario proposal | NPS:4 composition | Compose `OPTION_CANDIDATE`s and reuse existing Scenarios |
| Canonical Scenario creation | CC:9 Scenario Conversation | Writer. NPS sets `npsWritesScenario: false` |
| Comparison | NCA-POST:4 | NPS:4 may mark `READY_FOR_COMPARISON` only |
| Recommendation | ECA:7 / NCA:4 | `recommendation` and `preferredOption` stay null |
| Decision | CC:10 | Untouched |
| Execution | CC:11 | Untouched |

## Vocabulary

- Option intents are analytical (`REMOVE`, `REDUCE`, `ABSORB`, `TRANSFER`, `ADAPT`, `DEFER`, `MONITOR`, `DO_NOTHING`), not CC:9 Scenario kinds.
- CC:9 kinds remain `do-nothing | intervention | custom` on the handoff only.
- `OPTION_CANDIDATE` is not `CANONICAL_SCENARIO`. `REUSES_CANONICAL` references an existing catalog Scenario such as Capacity Expansion Plan (`ctx-scenario-capacity`).

## Path

`CAUSE_ANALYSIS` → `OPTIONS_AVAILABLE` when composed candidates/reused ids are observed. Next observed state remains `COMPARING_OPTIONS` only after existing comparison facts exist. NPS:4 does not set `comparisonAvailable`.

NPS:5 was not started.

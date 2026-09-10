# MRA:2 — Systemic Fixes

Date: 2026-09-09

Fixes are by root-cause cluster. Phrase handlers were not added as the production strategy.

## C1 — Reference resolution

- CC:1 `matchOrdinalReference` binds `first/second/third/previous` and contrastive `other`, including `explain`/`investigate` and `what about` prefixes. Matcher is not allowed to consume definition questions (`What is a Problem?`).
- CC:2 `resolveOrdinalHint` uses presented subjects, then same-kind catalog members, then sibling-of-current for `other`. Watch labels are excluded.
- FINAL:6.2 `other-referent` accepts `and the other one` and falls back to same-kind siblings when the presented set is empty.
- Orchestrator treats `other-referent` like backtrack: contextual object wins over stale MO active id.
- NCA:4 does not replace a typed collection-referent follow-up with a leftover recommendation.
- POST:2 strips `about/for` from requested members and resolves ordinal members against canonical membership instead of treating `first` as an unknown name.

## C7 — Decision / Execution session ↔ Theatre / Stage

- Isolated and sequential CC:5 callers must thread `decisionRuntime` / `executionRuntime` from the previous turn. Omitted (`undefined`) creates one runtime for the conversation. Explicit `null` means no CC:10/CC:11 adapter (entrance “missing runtime” must not fake a start).
- After `Approve` with `applied`, later ECA:9/CC:11 talk reads that same runtime. `start it` creates canonical CC:11 Execution.
- Shell exposes `data-canonical-approved-decision-count` and `data-canonical-execution-count` separately from Stage thread catalog counts.

## C6 — DATA-ADV ↔ NCA business routing

- DATA-ADV classifies source-semantics, field-coverage, and evidence-relevance (`can this CSV support X`) before NCA investigation.
- Support questions reason about source existence, confirmation, field meaning, calculability, relevance, and sufficiency. They do not treat relevance as cause.

## C2 — Stage meta / SHOW / count / readiness

- SHOW + workspace cue is `CURRENT_WORKSPACE` / `WORKSPACE_STATE`, not object navigation.
- `what` is rewritten to `show` only when it is not `what is/are/was/were` (so `What is Demand Surge Scenario?` stays knowledge).
- FINAL:6.3 clarification is skipped when semantic scope is `CURRENT_WORKSPACE`, so `show me what is on Stage` after focusing Risk stays Stage membership.

## C5 — Recommendation identity

- Leftover `My recommendation remains…` is suppressed on SHOW/list/how-many/Stage-meta.
- When NCA:4 still leans toward `temporary capacity`, manager copy states it is an advisory suggestion, not a catalog Scenario.
- Typed referent follow-ups do not inherit CC:8 recommendation copy.

## C3 — Collection kind and unknown-member

- Unknown member: collection exists + member missing (`I don't see that Problem. Current Problems are …`).
- Count grammar (`how many problem we have`) is `COLLECTION_QUERY`.
- Kind coverage includes KPI/Evidence/Outcome/Data Object; `OBJECT` plus a named filler (`show the Expand Capacity object`) is not a Problem membership lookup.
- Compound `show risk problem` is not an unknown Problem named Risk.

## C8 — Mutation operation typing

- ECA:1 proposals carry ADD vs REMOVE (and related confirm/reject/cancel). Full delete names. `this` resolves to the active subject.
- Delete/remove never degrades to add/create. Unsupported delete is explained. Kind-only REMOVE stays needs-clarification.

## C4 — Manager-facing composition

- NCA:6 strips architecture leaks (`MANAGER AUTHORITY REQUIREMENT`, `DECISION REQUIREMENT`).
- Attention signals are spoken as executive language.

## C9 — Stage actors vs Advisor collections

- Documented and enforced in copy routing: Stage overview actors vs canonical Problems. No actor deletion to force parity.

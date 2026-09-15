# Architecture trace

MRA:3-RECERT-FIX1. Isolated CC:5 `executeNexoraConversationalExperience`. No second conversation engine.

## Working path

Utterance after focused Demand Surge: `explain it`

| Layer | Result |
| --- | --- |
| Manager utterance | explain it |
| CC:1 | `explain`, no primary hint |
| NLU operation | EXPLAIN |
| Deictic / explicit | pronoun / continuity (`it`) |
| Overlay | skipped (CC:1 already `explain`) |
| Current referent | Demand Surge (`ctx-scenario-demand`) |
| Collection context | may still list Capacity Expansion Plan first |
| Stage | Demand Surge when focused |
| Scenario remap | `explain-scenario` **describe** of the resolved Scenario |
| Composition subject | Demand Surge |
| Final response | Scenario: Demand Surge |

## Failing path (before repair)

Utterance after J4: show scenarios → CSV → Capacity Gap → Demand Surge → `tell me more about it`

| Layer | Result |
| --- | --- |
| Manager utterance | tell me more about it |
| CC:1 | `unknown` |
| NLU operation | EXPLAIN |
| Deictic / explicit | pronoun (`it`) |
| Overlay | unknown → `explain` **with primary hint Capacity Expansion Plan** |
| Contextual provenance | `CONTEXT_RECENT_SUBJECT` leftover collection member |
| Active subject | Demand Surge |
| Investigation / recommendation leftover | lastRecommended / thread still held Expansion Plan |
| CC:2 | treated the overlay hint as an **explicit named** subject |
| Command | `request-explanation` of Capacity Expansion Plan |
| Composition | Investigate Capacity Expansion Plan as a possible contributor |

## First divergence

Not NLU failing to hear Demand Surge. Not Stage. Not the working `explain it` matcher.

1. `tell me more about it` is unknown at CC:1, so FINAL:6.1 overlay runs.
2. Continuity ranking skipped `CONTEXT_ACTIVE_SUBJECT` when that id was already pooled as `CONTEXT_ACTIVE_INVESTIGATION` (duplicate `push`).
3. Ranking then selected leftover `CONTEXT_RECENT_SUBJECT` = Capacity Expansion Plan (SHOW collection first member).
4. Overlay stamped that name as a CC:2 primary target, i.e. pronoun-derived promotion.

Machine-readable: `scripts/mra-3-recert-fix1-diag.ts` (J4 dumps). Isolated tests: `app/lib/nexora-conversation/mra3RecertFix1DeicticFidelity.runtime.test.ts`.

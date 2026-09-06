# BCA:6 clarification-need contract

Identity: `BCA:6/ContextClarificationNeed`.

Resolver: `resolveBusinessProjectContextClarification` — pure, frozen, no persistence.

## BCA:5 → BCA:6 handoff

BCA:5 `ManagerDecisionContext` is an optional input. Role ambiguity is read from `roles[].state === AMBIGUOUS`. BCA:6 does not re-classify titles.

## Ambiguity vs clarification need

Ambiguity can exist without a question. `clarificationNeeded` is true only when the **current request** makes that ambiguity material.

## Unknown vs material ambiguity

UNKNOWN role + “What does Gross Margin mean?” → `UNKNOWN_BUT_NONBLOCKING` / no question.

Ambiguous Delivery Manager + responsibility question → `ROLE_AMBIGUITY`, `BLOCKING`.

## Clarification need vs confirmation

The projection is a need. Confirmation remains the existing writer. `writesConfirmation: false`.

## Clarification intent vs Advisor message

`clarificationQuestionIntent` is a bounded, jargon-free intent. NCA/Advisor own the manager-facing utterance. `ownsNca` / `ownsAdvisor` are false.

## Resolver vs confirmation writer

- Semantic field meaning: `applyCsvSemanticClarification`
- Role / scope / process / temporal: `ManagerConversation` (existing confirmation consumption into BCA:1/4/5)

No `confirmBcaContext`, `saveManagerRoleConfirmation`, or `applyBusinessContextClarification`.

## Materiality

`BLOCKING` | `IMPORTANT` | `OPTIONAL` | `NONE`.

`canProceedWithoutClarification` is false only for `BLOCKING` selected needs.

## One question

At most one primary need per resolve. Remaining ambiguities wait for later turns.

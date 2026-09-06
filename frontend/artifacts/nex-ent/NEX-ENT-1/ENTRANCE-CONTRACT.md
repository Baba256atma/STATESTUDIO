# NEX-ENT:1 entrance contract

Identity: `NEX-ENT:1/NexoraEntranceAndIntroduction` `1.0.0`

## Trigger

- `/executive?entrance=1` (also `true` / `first-time`) with first-time workspace resolution activates guided introduction.
- `/executive` does not activate it.
- Returning-sufficient identity (existing sessionStorage) does not restart introduction.
- `?reset=1` clears stored identity and allows a deterministic first-time re-entry.

## Presentation vs business truth

Introduction, continue, and skip do not create Goal, KPI, Problem, Risk, Scenario, Decision, Execution, Outcome, manager identity, company, or data.

Skip sets `workspaceResolution` to `existing-workspace` and restores the default Stage interaction state.

## Conversation

The existing Advisor chat seeds one introduction message. Suggested actions (`Show me`, `What can Nexora do?`, `Skip introduction`) are buttons that submit those utterances as explicit manager turns. Free text remains available.

Developer terms (NCA, DTH, BCA, RDI, DATA-UX, canonical authority, runtime, projection) are excluded from introduction copy.

## Refresh

Introduction is React session state, not durable onboarding. A full refresh of `?entrance=1` may present the introduction again. It must not duplicate Stage actors or write business truth. Strict-mode seeding is guarded by a ref.

## Reserved, not implemented

- Guided Attention (`presentationOwner: director-stage`)
- Stage / Object / Data / Decision Loop education
- Personal Demo

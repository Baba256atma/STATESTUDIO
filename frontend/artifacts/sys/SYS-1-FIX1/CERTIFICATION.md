# NPA-T SYS:1-FIX1 — Stage Click → Deictic Referent Ownership

**Status: CERTIFIED**

Repair date: 2026-09-15.

No SYS:1 recertification. No SYS:2 started.

## Status

**NPA-T SYS:1-FIX1 — CERTIFIED**

## Root cause

Previous precedence for a singular deictic after `Show me the problems.` then a Stage click:

1. NCA:2 leftover `activeSubject` / last recent collection member (Margin Pressure)
2. Executive `currentSubject` from the click (Capacity Gap)
3. Stage focus (Capacity Gap), recorded only as a low-confidence Stage candidate

`presentedSetKind` remained `problems` with both members. Click closed Stage collection but did not outrank NCA collection residue. `Explain it.` therefore composed Margin Pressure while Stage stayed on Capacity Gap.

`What is related to it?` was parsed as a named-subject inquiry whose hint was title-cased to “Related To It”, not as the existing `show-related` intent.

## Corrected precedence

Explicit named subject
> valid explicit manager Stage click (and matching click-derived active object)
> stale singular NCA collection / recent member

Plural collection requests (`Compare them.`, presented Problems set) are unchanged.

Named `Tell me about Margin Pressure.` sets `conversation-named` and releases click ownership.

## Owning existing authority

- CC:1 `conversationalIntentResolver` — related-to-it is `show-related`, not an Object name
- CC:5 orchestrator deictic `conversationSubjectId` list — click-matching Stage focus before NCA residue
- ECA:1 working context — singular click deictic prefers Stage focus when prior activation is click
- MO:1 intent — `RELATIONSHIPS` recognizes `what is related to it`
- NPS:2 problem anchor — consumes the conversation-resolved Problem when it disagrees with a stale previous `npsProblemId` (adapter only; NPS is not a click resolver)

Theatre was not changed.

## Files modified

- `app/lib/conversational-control/conversationalIntentResolver.ts`
- `app/lib/conversational-control/subjectCompositionFidelity.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `app/lib/nexora-conversation/ecaWorkingConversationContext.ts`
- `app/lib/manager-object/managerObjectIntent.ts`
- `app/lib/nexora-problem-solving/npsProblemUnderstandingRuntime.ts`

## Why the repair is not sticky Stage focus

Click ownership applies only when prior activation is not `conversation-named` and the session active object still equals Stage focus. Explicit naming switches the conversational subject even if Stage has not yet moved.

## Tests

- SYS:1-FIX1 A–L + live proof: pass
- Original SYS:1 B reproduction: pass
- Bounded Stage awareness, MRA deictic, NPS understanding, ECA commitment, MO explain, CC:2: pass
- ESLint on changed surfaces: 0 errors

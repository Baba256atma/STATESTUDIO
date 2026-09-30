# SIM-TEST:6-FIX14-R2 Root Cause

## Stop condition

R2 is certifiable only if one proven navigation/clarification root fixes all three `Go back` cases, preserves no-target, genuine-clarification, named-return, FIX10–FIX14, and CC:10 behavior, introduces no Level 2 regressions, and leaves only the five classified Scenario debts. Levels 3 and 4 must not run while Level 2 is red.

## Pre-repair trace

| Case | Context before `Go back` | CC:1 | Pending state | Expected | Actual path | First wrong seam |
| --- | --- | --- | --- | --- | --- | --- |
| Conversation | Revenue → Capacity; conversation history contains Revenue | `navigate-back` | none | existing back executor applies Revenue | FINAL:6.3 creates `MISSING_SUBJECT`; navigation mapping/execution never runs | FINAL:6.3 gate evaluates unresolved `backtrack` before its context-free navigation exemption |
| Recommendation | Revenue → Capacity; executive context projects Revenue as previous | `navigate-back` | none | existing back executor applies Revenue | same fresh clarification path | same gate ordering |
| Scenario | Revenue → Capacity; executive context projects Revenue as previous | `navigate-back` | none | existing back executor applies Revenue | same fresh clarification path | same gate ordering |

All three exact cases reproduced before repair: 0 pass / 3 fail, each `clarification-required` versus expected `applied`.

## Authority and root

- Grammar owner: CC:1 `matchNavigation`, which already recognizes `Go back`, `Back`, `navigate back`, and `step back` as `navigate-back` without a target.
- Mapping/execution owner: the existing CC command/runtime path maps to `navigation-step-back`, then `stepBackNexoraMVPObjectInteraction` owns the navigation trail and return target.
- Shared root: **YES**.
- Root cause: FINAL:6.3 correctly received the resolved `navigate-back` intent, but canonical contextual meaning also represented bare `Go back` as an unresolved `backtrack` with no object reference. The gate's named-target check ran first and fabricated a new clarification before the already-resolved navigation intent could proceed.
- Owning repair seam: FINAL:6.3 clarification gate ordering. Only complete context-free navigation intents (`overview`, `navigate-back`, `navigate-forward`) bypass the named-target check. Named historical returns remain subject to referent resolution.
- FIX13 relationship: the three failures had no pending clarification, so FIX13 was not their direct cause. The same invariant does apply when a non-commitment clarification is pending; the existing FIX13 independent-request classifier now recognizes the three existing navigation intents. COMMITMENT pending clarifications are not cancelled.
- New navigation authority/store: **NO**.


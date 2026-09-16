# NPA-T PRE-RMS:FIX1 — Named Problem → Deictic Investigation Fidelity

**Status: CERTIFIED**

Repair date: 2026-09-15.

No SYS:2. No Real Manager Simulation started.

## Status

**NPA-T PRE-RMS:FIX1 — CERTIFIED**

## Root cause

After `Show me the problems.` (Capacity Gap, Margin Pressure), NCA `lastCollection` / `recentSubjects` / leftover `activeSubject` still pointed at **Margin Pressure** (last listed member). `Let's work on Capacity Gap.` did not become CC:1 `focus` because apostrophe normalization yields `let s work on capacity gap`, which missed `matchFocusOrOpen`. Intent stayed `unknown`, MO stayed `conversation-deictic` on Margin, and ECA `knowledgeRecent` outranked any spoken-name residue.

`Investigate it.` therefore bound the stale collection member. A Stage click was never required by the certified precedence; the named path never entered `conversation-named`.

Failed-turn follow-up: NCA `lastFailedTurn` was recorded on `Let's work on Unknown Problem.`, but `Investigate it.` is not an NCA repair utterance, so the next NCA state dropped the failed-turn and ECA/NPS reused Margin as if it were a valid singular subject.

## Owning layer

Existing referent chain only:

- CC:1 `matchFocusOrOpen` / `matchAmbiguous` — `let's work on` / `how about` / `I want to look at` named focus; `Let's work on it.` stays underspecified
- CC:5 orchestrator — `conversation-named` owns singular deictics; unresolved `lastFailedTurn` does not pass stale NCA/NPS Problem ids
- ECA:1 — named conversational subject outranks stale recent collection members; unresolved failed-turn blocks that fallback
- MO activation — `conversation-named` on a resolved named Problem; failed unresolved deictic does not preserve the leftover active object

NPS consumes the conversation-resolved Problem. Theatre/Stage is not the owner of the no-click path.

## Corrected precedence (unchanged SYS:1-FIX1 rule)

Explicit named subject
> explicit Stage click while applicable
> stale singular collection / recent member

Plural `Compare the problems.` / `Compare them.` on the Problems collection remains available.

## Why named Capacity Gap failed without a click

CC:1 never classified `Let's work on Capacity Gap.` as named `focus`, so MO never stored `activationSource = conversation-named` with `ctx-problem-capacity`. ECA then treated `Investigate it.` as a knowledge/pronoun follow-up and selected the last recent collection member (Margin Pressure).

## Files changed for this repair

- `app/lib/conversational-control/conversationalIntentResolver.ts`
- `app/lib/conversational-control/conversationalIntent.test.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `app/lib/nexora-conversation/ecaWorkingConversationContext.ts`
- `app/lib/nexora-conversation/ecaWorkingConversationContext.test.ts`
- `app/lib/manager-object/managerObjectActive.ts`
- `app/lib/manager-object/nexoraNxa5Fix4StageContextIntelligence.ts`
- `app/lib/nexora-system/preRmsFix1NamedProblemDeictic.runtime.test.ts`
- adapter-only: `composeNpsRuntimeProblemUnderstanding` inputs when `lastFailedTurn` is `UNRESOLVED_REFERENCE`

## Tests

- PRE-RMS:FIX1 A–O + live no-click identity: pass
- SYS:1-FIX1, SYS:1-FIX2, SYS:1, SYS:1-RECERT: pass
- CC:1, ECA:1, NCA-POST:1 / :4, NPS:2–6 bounded: pass
- ESLint on changed surfaces: 0 errors

Not run: full `tsc --noEmit` (known OOM), APP-4, Theatre visual, CC:10/CC:11 eligibility, giant session replay.

## Preserved certifications

- SYS:1-FIX1 = CERTIFIED
- SYS:1-FIX2 = CERTIFIED
- SYS:1 = CERTIFIED

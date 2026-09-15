# NPA-T ECA:2-FIX1 — Active Subject Context Preservation

**Status: CERTIFIED**

Date: 2026-09-14

## Verdict

**NPA-T ECA:2-FIX1 — CERTIFIED**

## First divergence

`composeEcaWorkingConversationContext` → `spokenExplicit` required the subject label to appear in the current utterance. For `Show me the evidence.` with NCA meaning still carrying Capacity Gap, `explicit` became null, continuity had no confirmed/recent subject in the focused fixture path, and `activeSubject` dropped to null before ECA:2 planning.

## Root cause

Post-ECA MRA tightening of meaning→spoken subject mapping erased valid meaning-carried subjects on compatible operation-only follow-ups. ECA:2’s empty-subject guard then correctly refused `SHOW_EVIDENCE`.

## Repair

In `ecaWorkingConversationContext.ts`:

- Keep spoken-name subjects as the only `EXPLICIT` winner.
- Restore meaning-carried subject as **continuity** after ordinal / spoken / letter / conversational winners.
- Apply continuity only when unambiguous and when the utterance does not uniquely name a different visible subject.
- Do not weaken the ECA:2 planner empty-subject guard.

## Validation

| Suite | Result |
| --- | --- |
| ECA:2 focused A–T + Q-alt | **22/22 PASS** |
| ECA:2 multi-turn 1–4 | **4/4 PASS** |
| ECA:2 runtime integration | **7/7 PASS** (not required; observed green) |
| ECA:1 working context tests | **19/19 PASS** |
| ECA:2-FIX1 A–G + proposal historical | **8/8 PASS** |

Combined focused validation run: **56/56 PASS**.

## Boundaries preserved

No new store, resolver, planner, or writer. ECA:2 remains planning-only. Ordinal leftover-meaning protection (MRA:3-FIX1) retained. Ambiguity still clarifies. Collection/scope STATUS questions still clear `activeSubject`.

## Pre-existing / out of scope (not repaired)

- NXA Level 4 entrance/Manager–Object failures (5)
- MRA runtime TypeScript errors (2)
- L4 log artifact whitespace

## Stop

Full ECA:2 certification not run. ECA:3 / MRA:3 / VAI / VAL / AVI not started.

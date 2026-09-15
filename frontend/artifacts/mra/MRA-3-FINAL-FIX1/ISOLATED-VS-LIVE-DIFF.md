# Isolated vs live diff

Sequence: `show me scenarios` → `is there any CSV files?` → `Capacity Gap` → `explain it`.

## First divergent transition (MRA-3-FINAL-001)

Isolated CC:5 always calls `executeNexoraConversationalExperience`. The live `/executive` Chat path previously **early-returned** on `answerAdvisorDataInquiry` before CC:5.

That skip:

- wrote DATA-ADV dialogue and an assistant-introduced Data continuity bind;
- did **not** run NCA `interpretNcaTurn` (isolated CSV inventory clears `ncaActive.id`);
- did **not** update executive/conversation context through CC:5.

After the manager then named **Capacity Gap**, leftover Scenario collection / NCA active subject still outranked the newer explicit Problem on the next `explain it`. Isolated CC:5 explained Capacity Gap. Live explained Capacity Expansion Plan.

## Writer / reader

| Role | Authority |
| --- | --- |
| Canonical conversational referent | FINAL:6.2 continuity, written only by CC:5 (`executeNexoraConversationalExperience`) |
| Data deictic while Data is current | DATA-ADV, consumed **inside** CC:5 (lock presented response) |
| Stage focus | Runtime / MO:1 click; must not decide `it` when a newer explicit conversational referent exists |
| Collection / presented set | Historical context; must not outrank a newer explicit Problem/KPI/Decision/Execution/Data referent |

## Second live-only transition (Stage test)

After a Stage click, `lastAppliedCommandId` treated a later named focus as a duplicate no-op while Runtime still showed the clicked object. Re-naming the Problem did not reconverge Stage. Duplicate dispatch now reapplies when Runtime focus is no longer the command target.

A follow-on `explain it` was remapped to `explain-scenario` while `currentSubject` was already the Problem (stale presented Scenario set). Fidelity/remap now keeps `explain` when the current referent kind is not Scenario.

Machine traces: `isolated-referent-trace.json`, `live-audit.json`.

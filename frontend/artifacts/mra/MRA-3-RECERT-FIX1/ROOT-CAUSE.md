# Root cause

MRA-3-RECERT-001 is a deictic follow-up **subject** steal, not a failure to recognize Demand Surge.

After SHOW Scenarios, Capacity Expansion Plan remains in the continuity thread. Focusing Demand Surge sets `activeSubjectId` to Demand Surge and often records the same id as `lastRecommendedTargetId` / investigation. The referent pool `push` drops duplicates, so Demand Surge exists only as `CONTEXT_ACTIVE_INVESTIGATION`. Pronoun EXPLAIN ranking then looks for `CONTEXT_ACTIVE_SUBJECT`, misses it, and takes leftover `CONTEXT_RECENT_SUBJECT` (Expansion Plan).

`tell me more about it` is unknown at CC:1. Overlay copies that leftover name into a primary target hint. CC:2 treats it as an explicit named subject. `explain it` never overlays, so composition stays on continuity Demand Surge.

Repair (existing authorities only):

- Prefer the active conversational subject id for deictic follow-ups, even if it was first pooled as investigation.
- Do not overlay pronoun/context names as explicit CC:2 primary hints.
- Extend subject-composition fidelity so deictic follow-ups cannot treat a different Scenario id as compatible.
- Do not treat unmatched recommended-action invocation as “which item?” when a deictic follow-up or active subject already exists.

No phrase table for `tell me more about it`. No Demand Surge / Expansion Plan special cases. Scenario how-sure / why / impact / compare remain assessment operations on the resolved subject.

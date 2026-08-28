# Pre-Fix reproduction

Authoritative diagnosis: `../NXA-5-FIX3-DIAG/diagnosis-B.json` and Conversation B traces.

Sequence:

1. `show me problems` → Problems collection, Capacity Gap + Margin Pressure
2. `which one of prolems is important?`

Pre-Fix (FIX3-DIAG):

- `prolems` not CC:1-corrected; `which one` + active collection still bind Problems
- POST:4 criterion: `OVERALL_SIGNIFICANCE` (later FIX3B classifies this wording as `UNSPECIFIED` + `criterionAmbiguous`)
- NXA:5: INSUFFICIENT, preferred = null
- Advisor (terminal): comparable-impact insufficiency without a criterion question
- DIR: NO_CHANGE; Stage: Problems collection unchanged
- Safety: no invented ranking. Gap: ADVISORY_QUALITY_GAP

This Fix did not re-run a failing permanent test before implementation. Pre-Fix copy is preserved in NXA:5-FIX3-DIAG artifacts.

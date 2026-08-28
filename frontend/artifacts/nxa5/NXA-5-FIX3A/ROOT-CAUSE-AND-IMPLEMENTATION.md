# Root cause confirmation and implementation

## First divergence

FINAL:6.1 overlaid an unknown CC:1 result to Focus because a registered entity had been resolved. Entity resolution established the subject, but did not establish a navigation action. CC:1 had previously left `exlpain` unchanged.

## Correction

1. CC:1 normalization now applies one bounded recovery: a first-token, single-adjacent-transposition match against the registered knowledge action `explain`. It records original token, recovered token, and `adjacent-transposition-of-registered-action`.
2. The existing CC:1 trace records `recovered-action-adjacent-transposition` when that recovery occurs.
3. FINAL:6.1 now permits an unknown result to become Focus only when its existing feature-frame evidence contains an operation cue, or when the turn is the already-certified entity-only fragment matching the resolved reference.

No new typo engine, intent classifier, entity resolver, Explain route, Stage controller, or response template was created. The implementation is generic across registered subjects and contains no Demand Surge branch.

## Post-Fix semantic trace

- original token: `exlpain`
- recovered token: `explain`
- normalized: `explain demand surge`
- selected CC:1 intent: `explain` (specialized downstream to `explain-scenario`)
- canonical reference: `ctx-scenario-demand`
- command: `explain-scenario`
- explanation authority: existing Scenario/MO:2 path
- read/write: `read`
- DIR: `NO_CHANGE`
- Stage: Scenarios collection, unchanged member IDs
- response: existing authoritative Demand Surge scenario explanation

For `frobnicate Demand Surge`, CC:1 remains unknown, the subject can resolve, FINAL:6.1 does not overlay Focus, DIR remains `NO_CHANGE`, and Stage remains unchanged.

# Snapshot / state strategy

`cloneRmsFoundationSession` deep-copies mutable Ground Truth, Operator arrays, event active/traces, and the manager bind. Scenario definitions and immutable event schedules are reused. Each branch gets a new runId/worldId.

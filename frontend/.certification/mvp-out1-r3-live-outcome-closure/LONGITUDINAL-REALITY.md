# Longitudinal Reality

A new observation requires a distinct canonical snapshot identity (`observedAt` and/or source/dataset/metric).

- React render is not an observation
- Page refresh is not automatically an observation
- Re-reading the same snapshot is idempotent

Post-boundary Actual requires `observedAt > committedAt` (or other genuine boundary). Equal or missing time is not silently Actual.

Writer remains CORE-OUT:1A `captureOutcomeObservation`. R2 journal subscribe is the live trigger.

Default `/executive` has no post-boundary RDI commits, so live Actual = pending. That is product-correct, not a missing evaluator.

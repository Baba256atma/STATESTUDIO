# Post-Decision Observation Capture

Identity: `MVP-OUT:1-R2/PostDecisionObservationCapture`

Trigger: Data Reality live journal publish (`subscribeLiveDataConnections`) after capture context is registered by the R1 coordinator. Not React render.

Writer: `captureOutcomeObservation` (CORE-OUT:1A). No second store.

Lifetime: CORE-OUT:1A in-memory session store. Reprocessing the same snapshot is idempotent (`obs:{sourceId}:{datasetId}:{metricId}:{observedAt}`).

Window: CORE-OUT:1A `openOutcomeObservationWindow`. Live Decisions have no `committedAt` → `timing-incomplete`.

Live default `/executive`: capture **seam PARTIAL**; no default RDI commits; no linked Actual.

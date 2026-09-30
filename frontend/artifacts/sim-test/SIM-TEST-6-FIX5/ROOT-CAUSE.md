# Root cause

**Symptom:** Manufacturing T77–T78 `JOURNEY/PREMATURE_DECISION` after a legitimate T13 Decision and T17 Execution.

**First incorrect transition:** Observer `classifyLifecycleJourney` fired when `intent ∈ {EXPLORE_OPTIONS, COMPARE}` and `decisionId` was non-null, regardless of whether CC:10 wrote on that turn.

**Earliest owner:** OBSERVER_EVENT_SCORING_DEFECT (`nexoraSimulationJourneyObservation.ts`). CC:10 was not invoked as a writer.

**Why long-session history exposed it:** SIM-TEST:6 revisits alternatives after commitment (`Show me the alternatives again` / `Compare those options without changing the decision`). Short SIM-TEST:5 journeys compare **before** commit, so Decision ID is absent and the old rule stayed green.

**Why the repair belongs here:** Production Decision/Execution identity and counts are already correct. Changing CC:10 or clearing scenarios would hide a metric error and violate revisit/comparison availability.

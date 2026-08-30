/**
 * DTH:11 — Outcome observation action routes.
 * Presentation only. Outcome capture remains CORE-OUT:1A when used.
 */

import type { NexoraDecisionTheatreOutcomeObservationAction } from "./nexoraDecisionTheatreOutcomeObservation.ts";

export const nexoraDecisionTheatreOutcomeObservationRegistryIdentity =
  "DTH:11/OutcomeObservationRegistry" as const;

export const NEXORA_DECISION_THEATRE_OUTCOME_OBSERVATION_ACTION_ROUTES = Object.freeze({
  VIEW_OUTCOME: "CORE-OUT:1A/LiveOutcomeObservationCapture",
  VIEW_RELATED_EXECUTION: "CC:11/CanonicalExecutionRuntime",
  VIEW_AUTHORIZING_DECISION: "CC:10R/CanonicalDecisionRuntime",
  SHOW_COMPARISON_HISTORY: "DTH:7/DecisionComparison",
  INSPECT_RELATED_OBJECT: "DTH:6/ObjectInvestigation",
} as const satisfies Record<NexoraDecisionTheatreOutcomeObservationAction, string>);

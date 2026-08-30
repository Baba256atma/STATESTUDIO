/**
 * DTH:12 — Learning / reassessment action routes.
 * Presentation only. CORE-OUT:2 remains interpretation authority; APP-4 is not written.
 */

import type { NexoraDecisionTheatreLearningReassessmentAction } from "./nexoraDecisionTheatreLearningReassessment.ts";

export const nexoraDecisionTheatreLearningReassessmentRegistryIdentity =
  "DTH:12/LearningReassessmentRegistry" as const;

export const NEXORA_DECISION_THEATRE_LEARNING_REASSESSMENT_ACTION_ROUTES = Object.freeze({
  VIEW_LEARNING: "CORE-OUT:2/GroundedLearningIntelligence",
  VIEW_RELATED_OUTCOME: "DTH:11/OutcomeObservation",
  VIEW_AUTHORIZING_DECISION: "CC:10R/CanonicalDecisionRuntime",
  SHOW_COMPARISON_HISTORY: "DTH:7/DecisionComparison",
  INSPECT_RELATED_OBJECT: "DTH:6/ObjectInvestigation",
} as const satisfies Record<NexoraDecisionTheatreLearningReassessmentAction, string>);

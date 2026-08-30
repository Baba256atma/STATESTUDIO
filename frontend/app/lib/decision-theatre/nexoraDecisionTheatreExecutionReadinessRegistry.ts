/**
 * DTH:9 — Execution readiness action routes.
 * Presentation only. Start remains CC:11.
 */

import type { NexoraDecisionTheatreExecutionReadinessAction } from "./nexoraDecisionTheatreExecutionReadiness.ts";

export const nexoraDecisionTheatreExecutionReadinessRegistryIdentity =
  "DTH:9/ExecutionReadinessRegistry" as const;

export const NEXORA_DECISION_THEATRE_EXECUTION_READINESS_ACTION_ROUTES = Object.freeze({
  VIEW_COMMITTED_DECISION: "CC:10R/CanonicalDecisionRuntime",
  SHOW_EXECUTION_READINESS: "DTH:9/ExecutionReadiness",
  SHOW_RELATED_EXECUTION: "CC:11/CanonicalExecutionRuntime",
  SHOW_COMPARISON_HISTORY: "DTH:7/DecisionComparison",
  REQUEST_START_EXECUTION: "CC:11/ExecutionFollowUp",
} as const satisfies Record<NexoraDecisionTheatreExecutionReadinessAction, string>);

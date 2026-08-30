/**
 * DTH:10 — Live Execution action routes.
 * Presentation only. Lifecycle remains CC:11.
 */

import type { NexoraDecisionTheatreLiveExecutionAction } from "./nexoraDecisionTheatreLiveExecution.ts";

export const nexoraDecisionTheatreLiveExecutionRegistryIdentity =
  "DTH:10/LiveExecutionRegistry" as const;

export const NEXORA_DECISION_THEATRE_LIVE_EXECUTION_ACTION_ROUTES = Object.freeze({
  VIEW_ACTIVE_EXECUTION: "CC:11/CanonicalExecutionRuntime",
  VIEW_AUTHORIZING_DECISION: "CC:10R/CanonicalDecisionRuntime",
  SHOW_COMPARISON_HISTORY: "DTH:7/DecisionComparison",
  INSPECT_RELATED_OBJECT: "DTH:6/ObjectInvestigation",
} as const satisfies Record<NexoraDecisionTheatreLiveExecutionAction, string>);

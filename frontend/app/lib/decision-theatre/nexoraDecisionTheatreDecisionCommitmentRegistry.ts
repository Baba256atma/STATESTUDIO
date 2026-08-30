/**
 * DTH:8 — Commitment action routes.
 * Presentation only. Commit and execution remain CC:10 / CC:11.
 */

import type { NexoraDecisionTheatreCommitmentAction } from "./nexoraDecisionTheatreDecisionCommitment.ts";

export const nexoraDecisionTheatreDecisionCommitmentRegistryIdentity =
  "DTH:8/DecisionCommitmentRegistry" as const;

export const NEXORA_DECISION_THEATRE_COMMITMENT_ACTION_ROUTES = Object.freeze({
  REVIEW_CANDIDATE: "DTH:8/DecisionReview",
  CHANGE_CANDIDATE: "DTH:7/comparison-membership",
  SHOW_DECISION_EVIDENCE: "DTH:6/ObjectInvestigation",
  SHOW_DECISION_TRADE_OFFS: "DTH:7/DecisionComparison",
  SHOW_DECISION_UNCERTAINTY: "DTH:7/DecisionComparison",
  RETURN_TO_COMPARISON: "DTH:7/DecisionComparison",
  COMMIT_DECISION: "CC:10/confirmation-required",
  CANCEL_DECISION_REVIEW: "DTH:8/close-without-commit",
  VIEW_COMMITTED_DECISION: "CC:10R/CanonicalDecisionRuntime",
  PROCEED_TO_EXECUTION: "CC:11/execution-commitment",
} as const satisfies Record<NexoraDecisionTheatreCommitmentAction, string>);

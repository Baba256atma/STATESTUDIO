/**
 * DTH:7 — Comparison action routes and manager-facing criterion labels.
 * Presentation only. Does not rank or invent scores.
 */

import type { NexoraDecisionTheatreComparisonAction } from "./nexoraDecisionTheatreDecisionComparison.ts";

export const nexoraDecisionTheatreDecisionComparisonRegistryIdentity =
  "DTH:7/DecisionComparisonRegistry" as const;

export const NEXORA_DECISION_THEATRE_COMPARISON_ACTION_ROUTES = Object.freeze({
  INVESTIGATE_CANDIDATE: "DTH:6/ObjectInvestigation",
  COMPARE_EVIDENCE: "NCA-POST:4/EVIDENCE_STRENGTH",
  COMPARE_RISK: "NCA-POST:4/RISK",
  COMPARE_COST: "NCA-POST:4/COST",
  COMPARE_TIME: "unavailable-unless-temporal-authority",
  COMPARE_GOAL_IMPACT: "NCA-POST:4/GOAL_IMPACT",
  SHOW_TRADE_OFFS: "NCA-POST:4/DIFFERENCE",
  SHOW_UNCERTAINTY: "NCA-POST:4/uncertainty",
  EXPLAIN_RECOMMENDATION: "NXA:5/read-only-when-authoritative",
  RETURN_TO_COMPARISON: "DTH:6/close-without-scene-change",
  PROCEED_TO_DECISION: "CC:10/confirmation-required",
} as const satisfies Record<NexoraDecisionTheatreComparisonAction, string>);

export function managerCriterionLabel(criterion: string | null): string | null {
  if (criterion == null || criterion === "UNSPECIFIED") return null;
  return criterion.toLowerCase().replaceAll("_", " ");
}

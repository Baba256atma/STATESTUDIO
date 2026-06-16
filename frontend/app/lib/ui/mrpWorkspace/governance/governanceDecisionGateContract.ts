/**
 * MRP:5B:5 — Governance decision gate contract.
 *
 * Advisory recommends. Governance approves. War Room executes.
 * Governance decides readiness — does not execute, forecast, or recommend alternatives.
 */

export const GOVERNANCE_DECISION_GATE_TAG = "[MRP_5B5_GATE]" as const;

export const GOVERNANCE_DECISION_GATE_VERSION = "5B.5.0";

export type GovernanceDecisionOutcome =
  | "APPROVED"
  | "APPROVED WITH CONDITIONS"
  | "REVIEW REQUIRED"
  | "BLOCKED";

export const GOVERNANCE_OWNERSHIP_RULE =
  "Advisory recommends. Governance approves. War Room executes." as const;

export type GovernanceDecisionGateSurface = Readonly<{
  panelId: "governance_decision_gate";
  label: "Governance Decision Gate";
  outcome: GovernanceDecisionOutcome;
  readinessSummary: string;
  ownershipRule: typeof GOVERNANCE_OWNERSHIP_RULE;
  readOnly: true;
  decidesReadiness: true;
  mayExecute: false;
  mayForecast: false;
  mayRecommendAlternatives: false;
  advisoryRecommends: true;
  warRoomExecutes: true;
  conditions: readonly string[];
  source: "governance_decision_gate";
  tag: typeof GOVERNANCE_DECISION_GATE_TAG;
}>;

export type GovernanceDecisionGateForbiddenAction =
  | "execute_decision"
  | "generate_forecast"
  | "recommend_alternatives"
  | "issue_recommendation"
  | "commit_decision"
  | "replace_advisory"
  | "replace_war_room";

export type GovernanceDecisionGateBoundaryResult = Readonly<{
  allowed: boolean;
  tag: typeof GOVERNANCE_DECISION_GATE_TAG;
  reason: string;
  action: GovernanceDecisionGateForbiddenAction;
}>;

export type GovernanceDecisionGateOwnershipCompliance = Readonly<{
  compliant: boolean;
  tag: typeof GOVERNANCE_DECISION_GATE_TAG;
  advisoryRecommends: true;
  governanceApproves: true;
  warRoomExecutes: true;
}>;

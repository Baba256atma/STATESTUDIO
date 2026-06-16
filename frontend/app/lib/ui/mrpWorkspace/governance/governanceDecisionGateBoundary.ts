/**
 * MRP:5B:5 — Governance decision gate boundary.
 *
 * Governance decides readiness only — no execute, forecast, or recommendation ownership.
 */

import {
  GOVERNANCE_DECISION_GATE_TAG,
  GOVERNANCE_OWNERSHIP_RULE,
  type GovernanceDecisionGateBoundaryResult,
  type GovernanceDecisionGateForbiddenAction,
  type GovernanceDecisionGateOwnershipCompliance,
} from "./governanceDecisionGateContract.ts";
import { guardGovernanceFoundationForbiddenAction } from "./governanceWorkspaceFoundationBoundary.ts";
import { guardNexoraRule14RecommendationOwnership } from "./nexoraRule14RecommendationOwnershipRuntime.ts";

const loggedKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function guardGovernanceDecisionGateForbiddenAction(input: {
  action: GovernanceDecisionGateForbiddenAction;
  source?: string | null;
}): GovernanceDecisionGateBoundaryResult {
  let reason = "Governance decision gate forbids this action.";

  if (input.action === "execute_decision" || input.action === "commit_decision") {
    const rule14 = guardNexoraRule14RecommendationOwnership({
      sourceActor: "governance",
      violationKind: "commit_decisions",
      source: input.source ?? "decision_gate",
    });
    reason =
      rule14.allowed === false
        ? rule14.reason
        : "Governance approves readiness — War Room executes commitment.";
  } else if (input.action === "generate_forecast") {
    reason = guardGovernanceFoundationForbiddenAction({
      action: "generate_forecast",
      source: input.source ?? "decision_gate",
    }).reason;
  } else if (input.action === "recommend_alternatives" || input.action === "issue_recommendation") {
    const rule14 = guardNexoraRule14RecommendationOwnership({
      sourceActor: "governance",
      violationKind: "issue_recommendations",
      source: input.source ?? "decision_gate",
    });
    reason =
      rule14.allowed === false
        ? rule14.reason
        : "Advisory recommends — Governance does not recommend alternatives.";
  } else if (input.action === "replace_advisory") {
    reason = guardGovernanceFoundationForbiddenAction({
      action: "replace_advisory",
      source: input.source ?? "decision_gate",
    }).reason;
  } else if (input.action === "replace_war_room") {
    reason = guardGovernanceFoundationForbiddenAction({
      action: "replace_war_room",
      source: input.source ?? "decision_gate",
    }).reason;
  }

  const result = Object.freeze({
    allowed: false,
    tag: GOVERNANCE_DECISION_GATE_TAG,
    reason,
    action: input.action,
  });

  if (isDev()) {
    const key = `${input.action}:${input.source ?? "unknown"}`;
    if (!loggedKeys.has(key)) {
      loggedKeys.add(key);
      globalThis.console?.debug?.(GOVERNANCE_DECISION_GATE_TAG, {
        action: "governance_decision_gate_boundary_blocked",
        governanceAction: input.action,
        source: input.source ?? null,
      });
    }
  }

  return result;
}

export function verifyGovernanceDecisionGateOwnershipCompliance(): GovernanceDecisionGateOwnershipCompliance {
  const commitBlocked = guardNexoraRule14RecommendationOwnership({
    sourceActor: "governance",
    violationKind: "commit_decisions",
    source: "decision_gate_certification",
  });
  const recommendBlocked = guardNexoraRule14RecommendationOwnership({
    sourceActor: "governance",
    violationKind: "issue_recommendations",
    source: "decision_gate_certification",
  });
  const warRoomCommitAllowed = guardNexoraRule14RecommendationOwnership({
    sourceActor: "war_room",
    commitmentAction: "select_strategy",
    source: "decision_gate_certification",
  });

  return Object.freeze({
    compliant:
      commitBlocked.allowed === false &&
      recommendBlocked.allowed === false &&
      warRoomCommitAllowed.allowed === true,
    tag: GOVERNANCE_DECISION_GATE_TAG,
    advisoryRecommends: true as const,
    governanceApproves: true as const,
    warRoomExecutes: true as const,
  });
}

export function resetGovernanceDecisionGateBoundaryForTests(): void {
  loggedKeys.clear();
}

export { GOVERNANCE_OWNERSHIP_RULE };

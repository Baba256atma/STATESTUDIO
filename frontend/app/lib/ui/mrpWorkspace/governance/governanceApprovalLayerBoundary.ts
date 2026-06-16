/**
 * MRP:5B:4 — Approval layer boundary.
 *
 * Governance evaluates approval — War Room owns commitment. No ownership violation.
 */

import {
  GOVERNANCE_APPROVAL_LAYER_TAG,
  type GovernanceApprovalLayerBoundaryResult,
  type GovernanceApprovalLayerForbiddenAction,
} from "./governanceApprovalLayerIntelligenceContract.ts";
import { guardNexoraRule14RecommendationOwnership } from "./nexoraRule14RecommendationOwnershipRuntime.ts";

const loggedKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function guardGovernanceApprovalLayerForbiddenAction(input: {
  action: GovernanceApprovalLayerForbiddenAction;
  source?: string | null;
}): GovernanceApprovalLayerBoundaryResult {
  const rule14 = guardNexoraRule14RecommendationOwnership({
    sourceActor: "governance",
    violationKind: "commit_decisions",
    source: input.source ?? "approval_layer",
  });

  const result = Object.freeze({
    allowed: false,
    tag: GOVERNANCE_APPROVAL_LAYER_TAG,
    reason:
      input.action === "claim_war_room_ownership"
        ? "Governance evaluates approval — War Room owns commitment execution."
        : input.action === "commit_decision" || input.action === "select_strategy"
          ? rule14.allowed === false
            ? rule14.reason
            : "Governance approval layer must not commit decisions — War Room owns commitment."
          : "Governance approval layer must not execute War Room commitment actions.",
    action: input.action,
  });

  if (isDev()) {
    const key = `${input.action}:${input.source ?? "unknown"}`;
    if (!loggedKeys.has(key)) {
      loggedKeys.add(key);
      globalThis.console?.debug?.(GOVERNANCE_APPROVAL_LAYER_TAG, {
        action: "governance_approval_layer_boundary_blocked",
        governanceAction: input.action,
        source: input.source ?? null,
      });
    }
  }

  return result;
}

export function verifyGovernanceApprovalLayerWarRoomCompliance(): Readonly<{
  compliant: boolean;
  tag: typeof GOVERNANCE_APPROVAL_LAYER_TAG;
  warRoomOwnsCommitment: true;
  governanceEvaluatesOnly: true;
}> {
  const commitBlocked = guardNexoraRule14RecommendationOwnership({
    sourceActor: "governance",
    violationKind: "commit_decisions",
    source: "approval_layer_certification",
  });

  return Object.freeze({
    compliant: commitBlocked.allowed === false,
    tag: GOVERNANCE_APPROVAL_LAYER_TAG,
    warRoomOwnsCommitment: true,
    governanceEvaluatesOnly: true as const,
  });
}

export function resetGovernanceApprovalLayerBoundaryForTests(): void {
  loggedKeys.clear();
}

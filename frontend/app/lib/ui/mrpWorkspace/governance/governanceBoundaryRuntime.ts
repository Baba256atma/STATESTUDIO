/**
 * MRP:5A:5 — Governance Rule #14 boundary runtime for recommendation intake.
 */

import {
  NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
  type Rule14RecommendationOwnershipGuardResult,
} from "./nexoraRule14RecommendationOwnershipContract.ts";
import {
  guardGovernanceApprovalAction,
  guardNexoraRule14RecommendationOwnership,
} from "./nexoraRule14RecommendationOwnershipRuntime.ts";

export type GovernanceForbiddenAction =
  | "issue_recommendation"
  | "commit_decision"
  | "execute_recommendation";

export type GovernanceHandoffBoundaryAction =
  | "intake_recommendation_package"
  | "approve_during_intake"
  | "execute_during_intake";

const loggedGuardKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logGovernanceBoundaryOnce(
  key: string,
  detail: Readonly<Record<string, unknown>>
): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG, detail);
}

export function guardGovernanceForbiddenAction(input: {
  action: GovernanceForbiddenAction;
  source?: string | null;
}): Rule14RecommendationOwnershipGuardResult {
  const violationKind =
    input.action === "issue_recommendation"
      ? "issue_recommendations"
      : "commit_decisions";

  const result = guardNexoraRule14RecommendationOwnership({
    sourceActor: "governance",
    violationKind,
    source: input.source ?? null,
  });

  if (!result.allowed) {
    logGovernanceBoundaryOnce(`${input.action}:${input.source ?? "unknown"}`, {
      action: "governance_boundary_blocked",
      governanceAction: input.action,
      violationKind,
      source: input.source ?? null,
    });
  }

  return result;
}

export function guardGovernanceHandoffBoundary(input: {
  action: GovernanceHandoffBoundaryAction;
  source?: string | null;
}): Rule14RecommendationOwnershipGuardResult {
  if (input.action === "approve_during_intake") {
    const blocked = guardGovernanceApprovalAction({
      action: "approve_decision",
      source: input.source ?? "recommendation_intake",
    });
    logGovernanceBoundaryOnce(`approve_during_intake:${input.source ?? "unknown"}`, {
      action: "governance_handoff_approval_blocked",
      source: input.source ?? null,
      allowed: blocked.allowed,
    });
    return Object.freeze({
      allowed: false,
      tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
      reason: "Governance intake consumes recommendation packages only — approval is a separate governance action.",
      violationKind: "approve_decisions",
      sourceActor: "governance",
    });
  }

  if (input.action === "execute_during_intake") {
    return guardGovernanceForbiddenAction({
      action: "execute_recommendation",
      source: input.source ?? "recommendation_intake",
    });
  }

  return Object.freeze({
    allowed: true,
    tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
  });
}

export function resetGovernanceBoundaryRuntimeForTests(): void {
  loggedGuardKeys.clear();
}

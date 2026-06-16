/**
 * MRP:5A:1 — Advisory workspace Rule #14 boundary runtime.
 */

import {
  NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
  type Rule14RecommendationOwnershipGuardResult,
} from "../governance/nexoraRule14RecommendationOwnershipContract.ts";
import {
  guardAdvisoryRecommendationAction,
  guardNexoraRule14RecommendationOwnership,
  traceNexoraRule14ActiveOnce,
} from "../governance/nexoraRule14RecommendationOwnershipRuntime.ts";
import { ADVISORY_FOUNDATION_TAG } from "./advisoryWorkspaceContract.ts";

export type AdvisoryForbiddenAction = "commit_decision" | "approve_decision";

export type AdvisoryHandoffBoundaryAction =
  | "handoff_to_governance"
  | "execute_recommendation_package"
  | "open_governance_automatically";

export type AdvisoryHandoffBoundaryAttempt = Readonly<{
  action: AdvisoryHandoffBoundaryAction;
  source?: string | null;
}>;

export type AdvisoryBoundaryAttempt = Readonly<{
  action: AdvisoryForbiddenAction;
  source?: string | null;
}>;

export type AdvisoryAllowedRecommendationAction =
  | "generate_recommendation"
  | "rank_alternatives"
  | "suggest_guidance"
  | "evaluate_tradeoffs";

const loggedGuardKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logAdvisoryBoundaryOnce(
  key: string,
  detail: Readonly<Record<string, unknown>>
): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG, detail);
}

export function guardAdvisoryForbiddenAction(
  attempt: AdvisoryBoundaryAttempt
): Rule14RecommendationOwnershipGuardResult {
  const violationKind =
    attempt.action === "approve_decision" ? "approve_decisions" : "commit_decisions";
  const result = guardNexoraRule14RecommendationOwnership({
    sourceActor: "advisory",
    violationKind,
    source: attempt.source ?? null,
  });

  if (!result.allowed) {
    logAdvisoryBoundaryOnce(`${attempt.action}:${attempt.source ?? "unknown"}`, {
      action: "advisory_boundary_blocked",
      advisoryAction: attempt.action,
      violationKind,
      source: attempt.source ?? null,
    });
  }

  return result;
}

export function guardAdvisoryRecommendationBoundary(input: {
  action: AdvisoryAllowedRecommendationAction;
  source?: string | null;
}): Rule14RecommendationOwnershipGuardResult {
  return guardAdvisoryRecommendationAction({
    action: input.action,
    source: input.source ?? null,
  });
}

export function guardAdvisoryHandoffBoundary(
  attempt: AdvisoryHandoffBoundaryAttempt
): Rule14RecommendationOwnershipGuardResult {
  if (attempt.action === "execute_recommendation_package") {
    const blocked = guardAdvisoryForbiddenAction({
      action: "commit_decision",
      source: attempt.source ?? "execute_recommendation_package",
    });
    if (!blocked.allowed) return blocked;
    return Object.freeze({
      allowed: false,
      tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
      reason: "Advisory may package recommendations but may not execute them.",
      violationKind: "commit_decisions",
      sourceActor: "advisory",
    });
  }

  if (attempt.action === "open_governance_automatically") {
    return Object.freeze({
      allowed: false,
      tag: NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
      reason: "Advisory handoff must not auto-open governance workspace.",
      violationKind: "commit_decisions",
      sourceActor: "advisory",
    });
  }

  return guardAdvisoryRecommendationBoundary({
    action: "generate_recommendation",
    source: attempt.source ?? "handoff_to_governance",
  });
}

export function traceAdvisoryFoundationBoundaryOnce(mountKey?: string | null): void {
  traceNexoraRule14ActiveOnce(mountKey ?? "advisory_workspace");
  if (!isDev()) return;
  logAdvisoryBoundaryOnce(`foundation:${mountKey ?? "default"}`, {
    action: "advisory_foundation_boundary_active",
    tag: ADVISORY_FOUNDATION_TAG,
    ownsRecommendationsOnly: true,
    commitmentOwnership: false,
    approvalOwnership: false,
    mountKey: mountKey ?? null,
  });
}

export function resetAdvisoryBoundaryRuntimeForTests(): void {
  loggedGuardKeys.clear();
}

/**
 * MRP:5A:5 — Governance recommendation intake runtime.
 *
 * Accepts RecommendationPackage, validates, stores for governance review.
 * Does not approve decisions or execute recommendations.
 */

import type { RecommendationPackage } from "../advisory/advisoryHandoffContract.ts";
import { buildRecommendationPackageSignature } from "../advisory/advisoryHandoffResolver.ts";
import {
  guardGovernanceForbiddenAction,
  guardGovernanceHandoffBoundary,
} from "./governanceBoundaryRuntime.ts";
import { receiveRecommendationPackage } from "./governanceRecommendationHandoffRuntime.ts";
import {
  GOVERNANCE_RECOMMENDATION_INTAKE_TAG,
  type GovernanceRecommendationIntakeResult,
} from "./governanceRecommendationIntakeContract.ts";
import { validateRecommendationPackage } from "./governanceRecommendationIntakeResolver.ts";

const loggedIntakeKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logIntakeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedIntakeKeys.has(key)) return;
  loggedIntakeKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_RECOMMENDATION_INTAKE_TAG, detail);
}

export function guardGovernanceRecommendationIntakeForbiddenAction(input: {
  action: "issue_recommendation" | "execute_recommendation";
  source?: string | null;
}): ReturnType<typeof guardGovernanceForbiddenAction> {
  return guardGovernanceForbiddenAction({
    action: input.action,
    source: input.source ?? "recommendation_intake",
  });
}

export function intakeRecommendationPackage(
  recommendationPackage: RecommendationPackage,
  source?: string | null
): GovernanceRecommendationIntakeResult {
  const intakeBoundary = guardGovernanceHandoffBoundary({
    action: "intake_recommendation_package",
    source: source ?? "advisory_handoff",
  });
  if (!intakeBoundary.allowed) {
    return Object.freeze({
      ok: false,
      reason: intakeBoundary.reason,
      approvedDecision: false,
      executedAction: false,
    });
  }

  const approvalBlocked = guardGovernanceHandoffBoundary({
    action: "approve_during_intake",
    source: source ?? "advisory_handoff",
  });
  if (approvalBlocked.allowed) {
    return Object.freeze({
      ok: false,
      reason: "Governance intake must not approve recommendations.",
      approvedDecision: false,
      executedAction: false,
    });
  }

  const executionBlocked = guardGovernanceHandoffBoundary({
    action: "execute_during_intake",
    source: source ?? "advisory_handoff",
  });
  if (executionBlocked.allowed) {
    return Object.freeze({
      ok: false,
      reason: "Governance intake must not execute recommendations.",
      approvedDecision: false,
      executedAction: false,
    });
  }

  const validation = validateRecommendationPackage(recommendationPackage);
  if (!validation.valid) {
    return Object.freeze({
      ok: false,
      reason: validation.errors.join("; "),
      approvedDecision: false,
      executedAction: false,
    });
  }

  receiveRecommendationPackage(recommendationPackage);

  const signature = buildRecommendationPackageSignature(recommendationPackage);
  logIntakeOnce(signature, {
    action: "recommendation_package_intake",
    recommendationId: recommendationPackage.recommendationId,
    recommendationTitle: recommendationPackage.recommendationTitle,
    confidence: recommendationPackage.confidence,
    driverCount: recommendationPackage.supportingDrivers.length,
    approvedDecision: false,
    executedAction: false,
    governanceAutoOpen: false,
  });

  return Object.freeze({
    ok: true,
    recommendationPackage,
    approvedDecision: false,
    executedAction: false,
  });
}

export function traceGovernanceRecommendationIntakeOnce(mountKey?: string | null): void {
  logIntakeOnce(`trace:${mountKey ?? "default"}`, {
    action: "governance_recommendation_intake_active",
    mountKey: mountKey ?? null,
    consumesOnly: true,
    approvesDuringIntake: false,
    executesDuringIntake: false,
  });
}

export function resetGovernanceRecommendationIntakeRuntimeForTests(): void {
  loggedIntakeKeys.clear();
}

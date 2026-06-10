/**
 * Phase 6:3 — Policy Evaluation Layer.
 * Evaluates decision, governance, strategic, and scenario context against policy definitions.
 */

import type { PolicyContext } from "./policyContextContract.ts";
import { listPolicies, type PolicyEntry } from "./policyRegistry.ts";
import type {
  PolicyAlignmentLevel,
  PolicyImpactEntry,
  PolicyImpactLevel,
} from "./policyConstraintIntelligenceContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type PolicyEvaluationResult = Readonly<{
  alignment: PolicyAlignmentLevel;
  alignmentTrend: ImpactDirection;
  impactLevel: PolicyImpactLevel;
  affectedPolicies: readonly PolicyImpactEntry[];
}>;

function resolvePolicyImpact(policy: PolicyEntry, ctx: PolicyContext): PolicyImpactLevel {
  if (policy.category === "governance") {
    if (ctx.governance.alignment === "potential_misalignment") return "critical";
    if (ctx.governance.conflictIndicator.includes("conflict")) return "high";
    if (ctx.governance.policyReviewStatus.includes("recommended")) return "moderate";
    return "low";
  }
  if (policy.category === "resource") {
    if (ctx.scenario.expectedImpact.toLowerCase().includes("high")) return "high";
    if (ctx.warRoomExposure.toLowerCase().includes("high")) return "moderate";
    return "low";
  }
  if (policy.category === "operational") {
    if (ctx.decisionGuidance.focus === "decision_required") return "high";
    if (ctx.warRoomUrgency.toLowerCase().includes("immediate")) return "moderate";
    return "low";
  }
  return "low";
}

function resolveAlignment(
  ctx: PolicyContext,
  maxImpact: PolicyImpactLevel
): { alignment: PolicyAlignmentLevel; trend: ImpactDirection } {
  if (
    ctx.governance.conflictIndicator.includes("conflict") ||
    ctx.governance.alignment === "potential_misalignment" ||
    maxImpact === "critical"
  ) {
    return { alignment: "potential_conflict", trend: "deteriorating" };
  }
  if (
    ctx.governance.alignment === "requires_review" ||
    ctx.strategicAlignment.tensionLevel === "strategic_conflict" ||
    maxImpact === "high"
  ) {
    return { alignment: "requires_review", trend: "stable" };
  }
  if (
    ctx.governance.alignment === "partially_aligned" ||
    ctx.strategicAlignment.tensionLevel === "competing_priorities" ||
    maxImpact === "moderate"
  ) {
    return { alignment: "partially_aligned", trend: "stable" };
  }
  return { alignment: "aligned", trend: "improving" };
}

function resolveAggregateImpact(levels: readonly PolicyImpactLevel[]): PolicyImpactLevel {
  if (levels.includes("critical")) return "critical";
  if (levels.includes("high")) return "high";
  if (levels.includes("moderate")) return "moderate";
  return "low";
}

export function evaluatePolicies(ctx: PolicyContext): PolicyEvaluationResult {
  const affectedPolicies: PolicyImpactEntry[] = listPolicies().map((policy) => {
    const impact = resolvePolicyImpact(policy, ctx);
    return Object.freeze({
      policyId: policy.id,
      label: policy.label,
      impact,
      summary: policy.summary,
    });
  });

  const impactLevels = affectedPolicies.map((entry) => entry.impact);
  const impactLevel = resolveAggregateImpact(impactLevels);
  const { alignment, trend } = resolveAlignment(ctx, impactLevel);

  return Object.freeze({
    alignment,
    alignmentTrend: trend,
    impactLevel,
    affectedPolicies: Object.freeze(affectedPolicies),
  });
}

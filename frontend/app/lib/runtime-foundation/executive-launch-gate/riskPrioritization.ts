import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveLaunchGateInput,
  LaunchBlockingItem,
  PrioritizedReadinessRisk,
} from "./executiveLaunchGateTypes.ts";

function clamp(value: number): number {
  return Number(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)).toFixed(2));
}

function riskFromParts(params: {
  description: string;
  businessImpact: number;
  executiveTrustImpact: number;
  workflowImpact: number;
  operationalImpact: number;
  validationSeverity: number;
  recommendedAction: string;
}): PrioritizedReadinessRisk {
  const priorityScore = clamp(
    params.businessImpact * 0.24 +
      params.executiveTrustImpact * 0.24 +
      params.workflowImpact * 0.18 +
      params.operationalImpact * 0.17 +
      params.validationSeverity * 0.17
  );
  return {
    riskId: stableSignature(["d10-prioritized-launch-risk", params.description, priorityScore]).slice(0, 56),
    description: params.description,
    priorityScore,
    businessImpact: clamp(params.businessImpact),
    executiveTrustImpact: clamp(params.executiveTrustImpact),
    workflowImpact: clamp(params.workflowImpact),
    operationalImpact: clamp(params.operationalImpact),
    validationSeverity: clamp(params.validationSeverity),
    recommendedAction: params.recommendedAction,
  };
}

export function prioritizeReadinessRisks(
  input: ExecutiveLaunchGateInput,
  blockers: readonly LaunchBlockingItem[]
): readonly PrioritizedReadinessRisk[] {
  const risks: PrioritizedReadinessRisk[] = [];

  for (const blocker of blockers) {
    risks.push(riskFromParts({
      description: blocker.description,
      businessImpact: blocker.severity === "launch_blocker" ? 1 : 0.82,
      executiveTrustImpact: blocker.affectedCapability.includes("trust") ? 1 : 0.78,
      workflowImpact: blocker.affectedCapability.includes("interaction") ? 0.92 : 0.7,
      operationalImpact: blocker.affectedCapability.includes("validation") ? 0.86 : 0.74,
      validationSeverity: blocker.severity === "launch_blocker" ? 1 : 0.82,
      recommendedAction: blocker.recommendedResolution,
    }));
  }

  for (const gap of input.dashboard?.gaps ?? []) {
    if (gap.severity !== "critical") {
      risks.push(riskFromParts({
        description: gap.description,
        businessImpact: gap.severity === "major" ? 0.72 : 0.48,
        executiveTrustImpact: 0.56,
        workflowImpact: 0.5,
        operationalImpact: 0.58,
        validationSeverity: gap.severity === "major" ? 0.72 : 0.44,
        recommendedAction: gap.recommendedNextAction,
      }));
    }
  }

  for (const classification of input.validationSuite?.results.flatMap((result) => result.classifications) ?? []) {
    risks.push(riskFromParts({
      description: classification.description,
      businessImpact: classification.severity === "critical" ? 0.92 : 0.55,
      executiveTrustImpact: 0.72,
      workflowImpact: 0.68,
      operationalImpact: 0.64,
      validationSeverity: classification.severity === "critical" ? 0.95 : 0.62,
      recommendedAction: classification.recommendation,
    }));
  }

  return Object.freeze(
    Array.from(new Map(risks.map((item) => [item.riskId, item])).values())
      .sort((a, b) => b.priorityScore - a.priorityScore || a.description.localeCompare(b.description))
      .slice(0, 12)
  );
}


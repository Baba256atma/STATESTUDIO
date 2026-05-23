import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  GovernanceClassification,
  GovernanceClassificationSeverity,
  LaunchBlockingItem,
  PrioritizedReadinessRisk,
} from "./executiveLaunchGateTypes.ts";

const RANK: Record<GovernanceClassificationSeverity, number> = {
  informational: 1,
  caution: 2,
  warning: 3,
  critical: 4,
  launch_blocker: 5,
};

export function governanceClassificationRank(severity: GovernanceClassificationSeverity): number {
  return RANK[severity];
}

function classification(
  severity: GovernanceClassificationSeverity,
  explanation: string,
  source: string,
  confidence: number,
  recommendedAction: string
): GovernanceClassification {
  return {
    classificationId: stableSignature(["d10-governance-classification", severity, source, explanation]).slice(0, 56),
    severity,
    explanation,
    source,
    confidence: Number(Math.min(1, Math.max(0, confidence)).toFixed(2)),
    recommendedAction,
  };
}

export function classifyLaunchGovernance(params: {
  blockers: readonly LaunchBlockingItem[];
  risks: readonly PrioritizedReadinessRisk[];
}): readonly GovernanceClassification[] {
  const classifications: GovernanceClassification[] = [];
  for (const blocker of params.blockers) {
    classifications.push(classification(
      blocker.severity === "launch_blocker" ? "launch_blocker" : "critical",
      blocker.rationale,
      blocker.affectedCapability,
      0.94,
      blocker.recommendedResolution
    ));
  }
  for (const risk of params.risks) {
    classifications.push(classification(
      risk.priorityScore >= 0.78 ? "warning" : risk.priorityScore >= 0.55 ? "caution" : "informational",
      risk.description,
      "risk_prioritization",
      risk.priorityScore,
      risk.recommendedAction
    ));
  }
  if (classifications.length === 0) {
    classifications.push(classification(
      "informational",
      "No launch-blocking governance issue is currently detected.",
      "launch_governance",
      0.86,
      "Keep readiness, trust, stability, and validation evidence current."
    ));
  }
  return Object.freeze(
    Array.from(new Map(classifications.map((item) => [item.classificationId, item])).values())
      .sort((a, b) => governanceClassificationRank(b.severity) - governanceClassificationRank(a.severity) || a.source.localeCompare(b.source))
      .slice(0, 14)
  );
}


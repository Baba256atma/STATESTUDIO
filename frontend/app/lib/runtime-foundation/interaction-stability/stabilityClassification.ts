import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  InteractionIntegrityIssue,
  StabilityEventClassification,
  StabilityEventSeverity,
} from "./interactionStabilityTypes.ts";

const SEVERITY_RANK: Record<StabilityEventSeverity, number> = {
  informational: 1,
  caution: 2,
  warning: 3,
  critical: 4,
};

export function stabilitySeverityRank(severity: StabilityEventSeverity): number {
  return SEVERITY_RANK[severity];
}

export function classifyInteractionIssue(issue: InteractionIntegrityIssue): StabilityEventClassification {
  return {
    eventId: stableSignature(["d10-stability-classification", issue.issueId]).slice(0, 56),
    severity: issue.severity,
    explanation: issue.cause,
    origin: issue.source,
    affectedComponent: issue.affectedComponent,
    confidence:
      issue.severity === "critical" ? 0.94 : issue.severity === "warning" ? 0.86 : issue.severity === "caution" ? 0.74 : 0.62,
    suggestedResolution: issue.recommendedCorrection,
  };
}

export function classifyInteractionIssues(
  issues: readonly InteractionIntegrityIssue[]
): readonly StabilityEventClassification[] {
  return Object.freeze(
    issues
      .map(classifyInteractionIssue)
      .sort((a, b) => stabilitySeverityRank(b.severity) - stabilitySeverityRank(a.severity) || a.affectedComponent.localeCompare(b.affectedComponent))
  );
}


import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveDashboardClassificationSeverity,
  ExecutiveReadinessGap,
  RuntimeHealthClassification,
} from "./executiveReadinessDashboardTypes.ts";

function severityFromGap(severity: ExecutiveReadinessGap["severity"]): ExecutiveDashboardClassificationSeverity {
  if (severity === "critical") return "critical";
  if (severity === "major") return "warning";
  if (severity === "moderate") return "caution";
  return "informational";
}

export function classifyRuntimeHealthGaps(
  gaps: readonly ExecutiveReadinessGap[]
): readonly RuntimeHealthClassification[] {
  return Object.freeze(
    gaps.map((gap) => {
      const severity = severityFromGap(gap.severity);
      return {
        classificationId: stableSignature(["d10-runtime-health-classification", gap.gapId]).slice(0, 56),
        severity,
        explanation: gap.rationale,
        affectedArea: gap.description,
        confidence: severity === "critical" ? 0.94 : severity === "warning" ? 0.84 : severity === "caution" ? 0.72 : 0.62,
        recommendedFollowUp: gap.recommendedNextAction,
      };
    })
  );
}


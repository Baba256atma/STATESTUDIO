import type {
  ExecutiveValidationScenarioResult,
  ProductionCandidateVerification,
  ValidationCoverageReport,
} from "./executiveValidationTypes.ts";
import type { StrategicLaunchAssessment } from "../executive-readiness-dashboard/index.ts";

export function evaluateProductionCandidateVerification(
  results: readonly ExecutiveValidationScenarioResult[],
  coverage: ValidationCoverageReport,
  launchAssessment: StrategicLaunchAssessment
): ProductionCandidateVerification {
  if (coverage.coverageScore < 1 || results.some((result) => result.state === "skipped")) {
    return "validation_incomplete";
  }
  if (results.some((result) => result.state === "failed")) return "validation_passed_with_warnings";
  const hasWarnings = results.some((result) => result.classifications.some((item) => item.severity === "warning" || item.severity === "caution"));
  if (hasWarnings) return "validation_passed_with_warnings";
  if (launchAssessment === "production_candidate") return "production_candidate";
  return "validation_passed";
}

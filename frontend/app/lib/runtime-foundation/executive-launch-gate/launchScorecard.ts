import type {
  ExecutiveLaunchGateInput,
  LaunchReadinessScorecard,
  PrioritizedReadinessRisk,
} from "./executiveLaunchGateTypes.ts";

function clamp(value: number): number {
  return Number(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)).toFixed(2));
}

function indicator(input: ExecutiveLaunchGateInput, id: string): number {
  return input.dashboard?.indicators.find((item) => item.indicatorId === id)?.score ?? 0;
}

export function buildLaunchReadinessScorecard(
  input: ExecutiveLaunchGateInput,
  risks: readonly PrioritizedReadinessRisk[]
): LaunchReadinessScorecard {
  const readinessScore = indicator(input, "readiness_score");
  const trustScore = input.reliabilitySnapshot?.summary.trustScore ?? indicator(input, "trust_score");
  const stabilityScore = indicator(input, "stability_score");
  const validationScore = input.validationSuite
    ? (input.validationSuite.coverage.coverageScore + (input.validationSuite.summary.validationPassed ? 1 : 0)) / 2
    : indicator(input, "validation_coverage");
  const riskPenalty = Math.min(0.24, risks.filter((risk) => risk.priorityScore >= 0.72).length * 0.04);
  const launchConfidence = clamp(
    readinessScore * 0.25 +
      trustScore * 0.24 +
      stabilityScore * 0.2 +
      validationScore * 0.23 +
      (1 - Math.min(1, risks.length / 10)) * 0.08 -
      riskPenalty
  );

  return {
    readinessScore: clamp(readinessScore),
    trustScore: clamp(trustScore),
    stabilityScore: clamp(stabilityScore),
    validationScore: clamp(validationScore),
    launchConfidence,
    unresolvedRiskCount: risks.length,
  };
}


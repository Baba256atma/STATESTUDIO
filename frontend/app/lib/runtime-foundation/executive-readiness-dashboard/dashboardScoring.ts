import type {
  ExecutiveDashboardHealthStatus,
  ExecutiveReadinessDashboardInput,
  ExecutiveReadinessIndicator,
} from "./executiveReadinessDashboardTypes.ts";

export function clampDashboardScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Number(Math.min(1, Math.max(0, score)).toFixed(2));
}

export function healthFromScore(score: number): ExecutiveDashboardHealthStatus {
  const safe = clampDashboardScore(score);
  if (safe >= 0.82) return "healthy";
  if (safe >= 0.64) return "warning";
  if (safe >= 0.42) return "degraded";
  return "critical";
}

export function scoreFromHealth(status: ExecutiveDashboardHealthStatus): number {
  if (status === "healthy") return 0.9;
  if (status === "warning") return 0.7;
  if (status === "degraded") return 0.48;
  return 0.2;
}

function validationCoverage(input: ExecutiveReadinessDashboardInput): number {
  const registry = input.readinessRegistry;
  const readinessValidations = registry
    ? [
        ...Object.values(registry.platform.dimensions).map((item) => item.validationStatus),
        ...Object.values(registry.features.features).map((item) => item.validationStatus),
      ]
    : [];
  if (readinessValidations.length === 0) return 0;
  const covered = readinessValidations.filter((status) => status === "validated" || status === "blocked").length;
  return clampDashboardScore(covered / readinessValidations.length);
}

function riskExposure(input: ExecutiveReadinessDashboardInput): number {
  const gapCount =
    (input.readinessSnapshot?.blocked.length ?? 0) +
    (input.reliabilitySnapshot?.risks.length ?? 0) +
    (input.interactionSnapshot?.classifications.length ?? 0);
  return clampDashboardScore(1 - Math.min(1, gapCount / 10));
}

export function buildExecutiveReadinessIndicators(
  input: ExecutiveReadinessDashboardInput
): readonly ExecutiveReadinessIndicator[] {
  const readinessScore = clampDashboardScore(
    ((input.readinessRegistry?.platform.confidence ?? 0) +
      (input.readinessRegistry?.features.confidence ?? 0) +
      (input.readinessSnapshot?.evaluations.mvp.confidence ?? 0)) / 3
  );
  const trustScore = clampDashboardScore(input.reliabilitySnapshot?.summary.trustScore ?? 0);
  const stabilityScore = clampDashboardScore(
    input.interactionSnapshot?.stabilityState === "stable"
      ? 0.9
      : input.interactionSnapshot?.stabilityState === "recovering"
        ? 0.7
        : input.interactionSnapshot?.stabilityState === "degraded"
          ? 0.48
          : input.interactionSnapshot
            ? 0.2
            : 0
  );
  const confidenceScore = clampDashboardScore((readinessScore + trustScore + stabilityScore) / 3);
  const coverage = validationCoverage(input);
  const exposure = riskExposure(input);

  return Object.freeze([
    {
      indicatorId: "readiness_score",
      label: "Readiness score",
      score: readinessScore,
      explanation: "Combines D10 readiness registry confidence and MVP readiness evaluation.",
    },
    {
      indicatorId: "trust_score",
      label: "Trust score",
      score: trustScore,
      explanation: "Uses D10 executive reliability trust score.",
    },
    {
      indicatorId: "stability_score",
      label: "Stability score",
      score: stabilityScore,
      explanation: "Derived from D10 interaction stability state.",
    },
    {
      indicatorId: "confidence_score",
      label: "Confidence score",
      score: confidenceScore,
      explanation: "Averages readiness, trust, and stability evidence.",
    },
    {
      indicatorId: "validation_coverage",
      label: "Validation coverage",
      score: coverage,
      explanation: "Measures readiness items with validation or blocked evidence.",
    },
    {
      indicatorId: "risk_exposure",
      label: "Risk exposure",
      score: exposure,
      explanation: "Inverse score based on unresolved readiness, trust, and interaction risks.",
    },
  ]);
}

export function indicatorScore(
  indicators: readonly ExecutiveReadinessIndicator[],
  id: string
): number {
  return indicators.find((item) => item.indicatorId === id)?.score ?? 0;
}


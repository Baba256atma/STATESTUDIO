import type {
  ExecutiveReadinessGap,
  ExecutiveReadinessSummary,
  RuntimeHealthClassification,
  StrategicLaunchAssessment,
} from "./executiveReadinessDashboardTypes.ts";

function readableAssessment(assessment: StrategicLaunchAssessment): string {
  return assessment.replace(/_/g, " ");
}

export function generateExecutiveReadinessSummary(params: {
  launchAssessment: StrategicLaunchAssessment;
  gaps: readonly ExecutiveReadinessGap[];
  classifications: readonly RuntimeHealthClassification[];
  healthySignals: readonly string[];
}): ExecutiveReadinessSummary {
  const blocking = params.gaps.filter((gap) => gap.severity === "critical").map((gap) => gap.description).slice(0, 5);
  const biggestRisk = params.classifications[0]?.explanation ?? params.gaps[0]?.rationale ?? null;
  const ready = params.launchAssessment === "production_candidate" || params.launchAssessment === "pilot_ready" || params.launchAssessment === "demo_ready";
  const next = params.gaps.length
    ? Array.from(new Set(params.gaps.slice(0, 4).map((gap) => gap.recommendedNextAction)))
    : ["Continue validating readiness, trust, and interaction stability before launch expansion."];

  return {
    isNexoraReady: ready && blocking.length === 0,
    biggestRisk,
    blockingReadiness: Object.freeze(blocking),
    healthySignals: Object.freeze(params.healthySignals.slice(0, 5)),
    shouldHappenNext: Object.freeze(next),
    headline: ready && blocking.length === 0
      ? `Nexora is ${readableAssessment(params.launchAssessment)} with current evidence.`
      : "Nexora needs readiness attention before broader executive launch.",
  };
}


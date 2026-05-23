import { indicatorScore } from "./dashboardScoring.ts";
import type {
  ExecutiveReadinessDashboardInput,
  ExecutiveReadinessGap,
  ExecutiveReadinessIndicator,
  StrategicLaunchAssessment,
} from "./executiveReadinessDashboardTypes.ts";

export function assessStrategicLaunchReadiness(params: {
  input: ExecutiveReadinessDashboardInput;
  indicators: readonly ExecutiveReadinessIndicator[];
  gaps: readonly ExecutiveReadinessGap[];
}): StrategicLaunchAssessment {
  const hasCritical = params.gaps.some((gap) => gap.severity === "critical");
  const readiness = indicatorScore(params.indicators, "readiness_score");
  const trust = indicatorScore(params.indicators, "trust_score");
  const stability = indicatorScore(params.indicators, "stability_score");
  const validation = indicatorScore(params.indicators, "validation_coverage");
  const risk = indicatorScore(params.indicators, "risk_exposure");
  const demoReady = params.input.readinessSnapshot?.evaluations.demo.state === "ready";
  const mvpReady = params.input.readinessSnapshot?.evaluations.mvp.state === "ready";
  const platformNormal = params.input.reliabilitySnapshot?.platformBehavingNormally === true;
  const interactionStable = params.input.interactionSnapshot?.summary.interfaceStable === true;

  if (hasCritical || readiness < 0.45 || trust < 0.45 || stability < 0.45) return "not_ready";
  if (readiness >= 0.86 && trust >= 0.82 && stability >= 0.82 && validation >= 0.82 && risk >= 0.8 && mvpReady && platformNormal && interactionStable) {
    return "production_candidate";
  }
  if (readiness >= 0.76 && trust >= 0.72 && stability >= 0.72 && validation >= 0.68 && mvpReady) {
    return "pilot_ready";
  }
  if (readiness >= 0.66 && trust >= 0.64 && stability >= 0.64 && demoReady) return "demo_ready";
  return "preparation_required";
}


import type {
  ExecutiveLaunchRecommendation,
  LaunchReadinessScorecard,
  ProductionReadinessGateState,
} from "./executiveLaunchGateTypes.ts";

export function deriveProductionReadinessGateState(params: {
  blockerCount: number;
  launchConfidence: number;
  validationPassed: boolean;
  dashboardAssessment?: string | null;
}): ProductionReadinessGateState {
  if (params.blockerCount > 0) return "blocked";
  if (!params.validationPassed || params.launchConfidence < 0.5) return "not_ready";
  if (params.launchConfidence >= 0.86 && params.dashboardAssessment === "production_candidate") return "release_candidate";
  if (params.launchConfidence >= 0.74) return "pilot_ready";
  if (params.launchConfidence >= 0.6) return "conditionally_ready";
  return "not_ready";
}

export function generateLaunchRecommendation(
  state: ProductionReadinessGateState,
  scorecard: LaunchReadinessScorecard
): ExecutiveLaunchRecommendation {
  if (state === "blocked" || state === "not_ready") return "do_not_launch";
  if (state === "conditionally_ready") return "launch_after_remediation";
  if (state === "pilot_ready" && scorecard.launchConfidence >= 0.82) return "controlled_release_recommended";
  if (state === "pilot_ready") return "pilot_launch_recommended";
  return "MVP_release_candidate";
}


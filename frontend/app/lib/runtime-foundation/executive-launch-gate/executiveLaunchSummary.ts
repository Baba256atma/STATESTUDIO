import type {
  ExecutiveLaunchRecommendation,
  ExecutiveLaunchSummary,
  LaunchBlockingItem,
  LaunchDecisionExplainability,
  PrioritizedReadinessRisk,
  ProductionReadinessGateState,
} from "./executiveLaunchGateTypes.ts";

export function generateExecutiveLaunchSummary(params: {
  state: ProductionReadinessGateState;
  recommendation: ExecutiveLaunchRecommendation;
  blockers: readonly LaunchBlockingItem[];
  risks: readonly PrioritizedReadinessRisk[];
  explainability: LaunchDecisionExplainability;
}): ExecutiveLaunchSummary {
  const launchBlockers = params.blockers.map((blocker) => blocker.description).slice(0, 5);
  const remainingRisks = params.risks.map((risk) => risk.description).slice(0, 5);
  const supportingEvidence = params.explainability.strengths.slice(0, 5);
  const shouldHappenNext = params.blockers.length
    ? Array.from(new Set(params.blockers.slice(0, 4).map((blocker) => blocker.recommendedResolution)))
    : params.risks.length
      ? Array.from(new Set(params.risks.slice(0, 4).map((risk) => risk.recommendedAction)))
      : ["Proceed to human executive launch review with current evidence package."];
  const ready = params.state === "release_candidate" || params.state === "pilot_ready";
  const headline =
    params.recommendation === "MVP_release_candidate"
      ? "Nexora is ready for MVP release-candidate review."
      : params.recommendation === "controlled_release_recommended" || params.recommendation === "pilot_launch_recommended"
        ? "Nexora is ready for controlled launch review."
        : "Nexora is not ready for launch without remediation.";

  return {
    isNexoraReady: ready && params.blockers.length === 0,
    launchBlockers: Object.freeze(launchBlockers),
    remainingRisks: Object.freeze(remainingRisks),
    supportingEvidence: Object.freeze(supportingEvidence),
    shouldHappenNext: Object.freeze(shouldHappenNext),
    headline,
  };
}


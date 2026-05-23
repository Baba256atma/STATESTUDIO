import type {
  LaunchDecisionExplainability,
  LaunchEvidenceItem,
  LaunchReadinessScorecard,
  PrioritizedReadinessRisk,
  ProductionReadinessGateState,
} from "./executiveLaunchGateTypes.ts";

export function buildLaunchDecisionExplainability(params: {
  state: ProductionReadinessGateState;
  evidence: readonly LaunchEvidenceItem[];
  risks: readonly PrioritizedReadinessRisk[];
  scorecard: LaunchReadinessScorecard;
}): LaunchDecisionExplainability {
  const strengths = params.evidence
    .filter((item) => item.supportsLaunch)
    .map((item) => item.description)
    .slice(0, 5);
  const weaknesses = [
    ...params.evidence.filter((item) => !item.supportsLaunch).map((item) => item.description),
    ...params.risks.slice(0, 3).map((risk) => risk.description),
  ].slice(0, 6);
  const readinessRationale =
    params.state === "release_candidate"
      ? "Readiness, trust, stability, and validation evidence support MVP release-candidate review."
      : params.state === "pilot_ready"
        ? "Evidence supports controlled pilot review while remaining risks stay visible."
        : params.state === "conditionally_ready"
          ? "Evidence is partially supportive, but remediation is required before launch expansion."
          : "Launch readiness is blocked by unresolved governance evidence.";

  return {
    supportingEvidence: Object.freeze(params.evidence),
    strengths: Object.freeze(strengths),
    weaknesses: Object.freeze(weaknesses),
    risks: Object.freeze(params.risks),
    readinessRationale,
    confidence: params.scorecard.launchConfidence,
  };
}


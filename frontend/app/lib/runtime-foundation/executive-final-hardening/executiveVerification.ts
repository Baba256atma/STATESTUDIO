import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { ExecutiveFinalHardeningInput, ExecutiveReadinessVerification } from "./finalHardeningTypes.ts";

export function verifyExecutiveReadiness(input: ExecutiveFinalHardeningInput): ExecutiveReadinessVerification {
  const understandSystemStatus = Boolean(input.dashboard?.executiveSummary.headline);
  const reviewInsights = Boolean(input.demoPresentation?.snapshot.executiveSummary);
  const inspectFragility = input.demoPresentation?.journeys.some((journey) => journey.journeyId === "fragility_analysis" && !journey.blocked) ?? false;
  const exploreScenarios = input.demoPresentation?.journeys.some((journey) => journey.journeyId === "scenario_simulation" && !journey.blocked) ?? false;
  const evaluateRecommendations = Boolean(input.launchGate?.summary.supportingEvidence.length);
  const interpretConfidence = (input.launchGate?.scorecard.launchConfidence ?? 0) > 0;
  const navigateWorkflows = input.validationSuite?.summary.validationPassed === true;
  const flags = [understandSystemStatus, reviewInsights, inspectFragility, exploreScenarios, evaluateRecommendations, interpretConfidence, navigateWorkflows];

  return {
    verificationId: stableSignature(["d10-executive-verification", input.organizationId ?? "nexora-default"]).slice(0, 56),
    understandSystemStatus,
    reviewInsights,
    inspectFragility,
    exploreScenarios,
    evaluateRecommendations,
    interpretConfidence,
    navigateWorkflows,
    verifiedCount: flags.filter(Boolean).length,
    signature: stableSignature(["d10-executive-verification", flags]),
  };
}

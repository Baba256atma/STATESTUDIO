import type { ExecutiveMVPCompletionInput, ExecutiveCapabilityVerification, MVPCompletionScorecard } from "./mvpCompletionTypes.ts";

function clamp(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

export function buildMVPCompletionScorecard(input: ExecutiveMVPCompletionInput, capabilities: readonly ExecutiveCapabilityVerification[]): MVPCompletionScorecard {
  const readinessScore = clamp(input.launchGate?.scorecard.readinessScore ?? (input.readinessSnapshot?.isNexoraReady ? 0.8 : 0.25));
  const trustScore = clamp(input.launchGate?.scorecard.trustScore ?? input.reliabilitySnapshot?.summary.trustScore ?? 0.25);
  const stabilityScore = clamp(input.launchGate?.scorecard.stabilityScore ?? (input.interactionSnapshot?.summary.interfaceStable ? 0.84 : 0.3));
  const validationScore = clamp(input.launchGate?.scorecard.validationScore ?? (input.validationSuite?.summary.validationPassed ? 0.9 : 0.25));
  const pilotScore = clamp(input.feedbackLearning?.success.evaluation === "highly_successful" ? 0.92 : input.feedbackLearning?.success.evaluation === "successful" ? 0.82 : input.demoPresentation?.successEvaluation.confidenceLevel ?? 0.35);
  const capabilityScore = clamp(capabilities.filter((capability) => capability.ready).length / capabilities.length);
  const hardeningScore = clamp(input.finalHardening?.summary.isProductionCandidate ? 0.9 : input.finalHardening ? 0.58 : 0.2);
  const completionScore = clamp((readinessScore + trustScore + stabilityScore + validationScore + pilotScore + capabilityScore + hardeningScore) / 7);
  const publicationConfidence = clamp(completionScore * 0.72 + hardeningScore * 0.16 + validationScore * 0.12);
  return { readinessScore, trustScore, stabilityScore, validationScore, pilotScore, completionScore, publicationConfidence };
}

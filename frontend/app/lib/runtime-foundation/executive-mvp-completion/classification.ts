import type { ExecutiveCapabilityVerification, GovernanceVerification, MVPCompletionScorecard, MVPCompletionState, PublishRisk } from "./mvpCompletionTypes.ts";

export function classifyMVPCompletion(input: {
  scorecard: MVPCompletionScorecard;
  capabilities: readonly ExecutiveCapabilityVerification[];
  governance: GovernanceVerification;
  risks: readonly PublishRisk[];
  certified: boolean;
}): MVPCompletionState {
  if (input.risks.some((risk) => risk.severity === "critical") || input.governance.missingElements.length > 2) return "incomplete";
  const readyCaps = input.capabilities.filter((capability) => capability.ready).length;
  if (input.scorecard.publicationConfidence >= 0.86 && input.certified && readyCaps === input.capabilities.length && input.risks.length === 0) return "publish_ready";
  if (input.scorecard.completionScore >= 0.8 && input.certified && readyCaps >= input.capabilities.length - 1) return "MVP_complete";
  if (readyCaps >= input.capabilities.length - 1 && input.scorecard.completionScore >= 0.72) return "feature_complete";
  return "partially_complete";
}

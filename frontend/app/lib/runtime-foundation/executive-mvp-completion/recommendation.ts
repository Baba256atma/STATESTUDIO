import type { MVPCompletionScorecard, PublicationRecommendation, PublishReadinessAssessment, PublishRisk } from "./mvpCompletionTypes.ts";

export function generatePublicationRecommendation(input: {
  scorecard: MVPCompletionScorecard;
  assessments: readonly PublishReadinessAssessment[];
  risks: readonly PublishRisk[];
}): PublicationRecommendation {
  if (input.risks.some((risk) => risk.severity === "critical")) return "continue_development";
  if (input.scorecard.completionScore < 0.66) return "stabilization_required";
  if (!input.assessments.find((assessment) => assessment.target === "pilot_programs")?.ready) return "pilot_first";
  if (!input.assessments.find((assessment) => assessment.target === "MVP_publication")?.ready) return "controlled_release";
  return "publish_MVP";
}

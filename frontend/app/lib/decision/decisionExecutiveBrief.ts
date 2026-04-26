import type { DecisionContext, DecisionExecutiveBrief, DecisionRecommendation, EvaluatedScenario } from "./decisionAssistantTypes.ts";

export function buildDecisionExecutiveBrief(params: {
  context: DecisionContext;
  recommendation: DecisionRecommendation;
  topScenario?: EvaluatedScenario;
}): DecisionExecutiveBrief {
  const { context, recommendation, topScenario } = params;
  const headline =
    topScenario != null
      ? `${recommendation.posture.charAt(0).toUpperCase() + recommendation.posture.slice(1)}: ${topScenario.title}`
      : `Decision posture: ${recommendation.posture}`;

  const summary = [
    recommendation.reasonSummary,
    recommendation.watchouts.length ? `Watch: ${recommendation.watchouts[0]}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    headline: headline.slice(0, 160),
    summary: summary.slice(0, 420),
    urgency: context.riskLevel,
  };
}

import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  ExecutiveLearningDashboard,
  FeedbackTrendSummary,
  LearningGovernanceClassification,
  LearningPattern,
  PilotInsightSummary,
  PilotSuccessAssessment,
  ProductImprovementRecommendation,
} from "./executiveFeedbackTypes.ts";

export function buildExecutiveLearningDashboard(input: {
  organizationId: string;
  generatedAt: number;
  patterns: readonly LearningPattern[];
  insights: PilotInsightSummary;
  recommendations: readonly ProductImprovementRecommendation[];
  classifications: readonly LearningGovernanceClassification[];
  trend: FeedbackTrendSummary;
  success: PilotSuccessAssessment;
}): ExecutiveLearningDashboard {
  const strongestProductStrengths = input.patterns
    .filter((pattern) => pattern.type === "successful_workflow" || pattern.type === "trusted_capability")
    .flatMap((pattern) => pattern.evidence.length ? pattern.evidence : [pattern.label])
    .slice(0, 4);
  const trustObservations = input.patterns
    .filter((pattern) => pattern.category === "trust" || pattern.type === "trusted_capability")
    .flatMap((pattern) => pattern.evidence.length ? pattern.evidence : [pattern.label])
    .slice(0, 4);
  const majorFeedbackThemes = input.patterns.slice(0, 5).map((pattern) => pattern.label);
  const nextImprovementOpportunities = input.recommendations.slice(0, 5).map((recommendation) => recommendation.summary);

  return {
    dashboardId: stableSignature(["d10-learning-dashboard", input.organizationId]).slice(0, 56),
    organizationId: input.organizationId,
    generatedAt: input.generatedAt,
    majorFeedbackThemes: Object.freeze(majorFeedbackThemes),
    highestPriorityIssues: Object.freeze(input.recommendations.slice(0, 3)),
    strongestProductStrengths: Object.freeze(strongestProductStrengths.length ? strongestProductStrengths : ["No product strength pattern confirmed yet."]),
    trustObservations: Object.freeze(trustObservations.length ? trustObservations : ["No recurring trust observation confirmed yet."]),
    pilotRecommendations: Object.freeze(input.recommendations.slice(0, 5)),
    nextImprovementOpportunities: Object.freeze(nextImprovementOpportunities),
    classifications: Object.freeze(input.classifications),
    trend: input.trend,
    pilotSuccess: input.success,
    insightSummary: input.insights,
    signature: stableSignature([
      "d10-learning-dashboard",
      input.organizationId,
      input.generatedAt,
      majorFeedbackThemes,
      input.recommendations.map((recommendation) => recommendation.signature),
      input.trend.signature,
      input.success.signature,
      input.insights.signature,
    ]),
  };
}

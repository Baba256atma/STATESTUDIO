import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { classifyFeedbackItems } from "./feedbackClassification.ts";
import { assessFeedbackPriorities } from "./priorityAssessment.ts";
import { detectLearningPatterns } from "./learningLoop.ts";
import { generatePilotInsightSummary } from "./pilotInsights.ts";
import { generateProductImprovementRecommendations } from "./improvementRecommendations.ts";
import { evaluatePilotSuccess } from "./successEvaluator.ts";
import { buildFeedbackTrendPoint, buildFeedbackTrendSummary } from "./feedbackTrend.ts";
import { classifyLearningGovernance } from "./learningGovernance.ts";
import { buildExecutiveLearningDashboard } from "./learningDashboard.ts";
import type {
  ExecutiveFeedbackLearningInput,
  ExecutiveFeedbackLearningResult,
} from "./executiveFeedbackTypes.ts";

export function evaluateExecutiveFeedbackLearningLoop(
  input: ExecutiveFeedbackLearningInput
): ExecutiveFeedbackLearningResult {
  const organizationId = input.organizationId?.trim() || input.registry.organizationId || "nexora-default";
  const generatedAt = input.now ?? Date.now();
  const classifications = classifyFeedbackItems(input.registry.feedback);
  const priorities = assessFeedbackPriorities(input.registry.feedback, classifications);
  const patterns = detectLearningPatterns(input.registry.feedback, classifications);
  const insights = generatePilotInsightSummary(patterns, priorities);
  const recommendations = generateProductImprovementRecommendations(patterns, priorities);
  const success = evaluatePilotSuccess({ ...input, organizationId });
  const currentTrend = buildFeedbackTrendPoint(input.registry.feedback, patterns, generatedAt);
  const trend = buildFeedbackTrendSummary(input.previousTrendPoints ?? [], currentTrend);
  const governance = classifyLearningGovernance(recommendations);
  const dashboard = buildExecutiveLearningDashboard({
    organizationId,
    generatedAt,
    patterns,
    insights,
    recommendations,
    classifications: governance,
    trend,
    success,
  });
  const signature = stableSignature([
    "d10-executive-feedback-learning-loop",
    organizationId,
    generatedAt,
    input.registry.signature,
    classifications.map((item) => item.signature),
    priorities.map((item) => item.signature),
    patterns.map((item) => item.signature),
    dashboard.signature,
  ]);

  return {
    organizationId,
    generatedAt,
    classifications,
    priorities,
    patterns,
    insights,
    recommendations,
    success,
    dashboard,
    signature,
  };
}

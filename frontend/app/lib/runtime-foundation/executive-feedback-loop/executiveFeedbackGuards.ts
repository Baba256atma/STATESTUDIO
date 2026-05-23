import type {
  ExecutiveFeedbackItem,
  ExecutiveFeedbackLearningResult,
  ExecutiveLearningDashboard,
  FeedbackCaptureRegistry,
  FeedbackClassification,
  FeedbackPriorityAssessment,
  LearningGovernanceClassification,
  LearningPattern,
  PilotInsightSummary,
  PilotSuccessAssessment,
  ProductImprovementRecommendation,
} from "./executiveFeedbackTypes.ts";

export function validateExecutiveFeedbackItem(item: ExecutiveFeedbackItem): boolean {
  return Boolean(item.feedbackId.trim() && item.organizationId.trim() && item.summary.trim() && item.signature.trim());
}

export function validateFeedbackCaptureRegistry(registry: FeedbackCaptureRegistry): boolean {
  return Boolean(registry.organizationId.trim() && registry.signature.trim() && registry.feedback.every(validateExecutiveFeedbackItem));
}

export function validateFeedbackClassification(classification: FeedbackClassification): boolean {
  return Boolean(classification.classificationId.trim() && classification.feedbackId.trim() && classification.confidence >= 0 && classification.confidence <= 1);
}

export function validateFeedbackPriorityAssessment(priority: FeedbackPriorityAssessment): boolean {
  return Boolean(priority.priorityId.trim() && priority.score >= 0 && priority.score <= 1 && priority.recommendation.trim());
}

export function validateLearningPattern(pattern: LearningPattern): boolean {
  return Boolean(pattern.patternId.trim() && pattern.label.trim() && pattern.occurrenceCount > 0 && pattern.signature.trim());
}

export function validatePilotInsightSummary(insight: PilotInsightSummary): boolean {
  return Boolean(insight.headline.trim() && insight.whatUsersTellUs.length > 0 && insight.improveFirst.length > 0 && insight.signature.trim());
}

export function validateProductImprovementRecommendation(recommendation: ProductImprovementRecommendation): boolean {
  return Boolean(recommendation.recommendationId.trim() && recommendation.advisoryOnly === true && recommendation.priorityScore >= 0 && recommendation.priorityScore <= 1);
}

export function validatePilotSuccessAssessment(success: PilotSuccessAssessment): boolean {
  return Boolean(success.signature.trim() && success.feedbackQuality >= 0 && success.executiveSatisfactionScore <= 1);
}

export function validateLearningGovernanceClassification(classification: LearningGovernanceClassification): boolean {
  return Boolean(classification.classificationId.trim() && classification.explanation.trim() && classification.recommendedNextStep.trim());
}

export function validateExecutiveLearningDashboard(dashboard: ExecutiveLearningDashboard): boolean {
  return Boolean(
    dashboard.dashboardId.trim() &&
      dashboard.organizationId.trim() &&
      dashboard.majorFeedbackThemes.length >= 0 &&
      dashboard.pilotRecommendations.every(validateProductImprovementRecommendation) &&
      dashboard.classifications.every(validateLearningGovernanceClassification) &&
      validatePilotSuccessAssessment(dashboard.pilotSuccess) &&
      validatePilotInsightSummary(dashboard.insightSummary) &&
      dashboard.signature.trim()
  );
}

export function validateExecutiveFeedbackLearningResult(result: ExecutiveFeedbackLearningResult): boolean {
  return Boolean(
    result.organizationId.trim() &&
      result.classifications.every(validateFeedbackClassification) &&
      result.priorities.every(validateFeedbackPriorityAssessment) &&
      result.patterns.every(validateLearningPattern) &&
      result.recommendations.every(validateProductImprovementRecommendation) &&
      validatePilotSuccessAssessment(result.success) &&
      validateExecutiveLearningDashboard(result.dashboard) &&
      result.signature.trim()
  );
}

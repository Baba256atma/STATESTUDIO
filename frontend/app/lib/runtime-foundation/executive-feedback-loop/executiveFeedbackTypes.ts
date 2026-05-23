/** D10:8 - Feedback capture and executive pilot learning loop contracts. */

import type { ExecutiveReadinessDashboardModel } from "../executive-readiness-dashboard/index.ts";
import type { ExecutiveDemoModePresentation } from "../executive-demo-mode/index.ts";
import type { ExecutiveLaunchGateResult } from "../executive-launch-gate/index.ts";
import type { ExecutiveValidationSuiteResult } from "../executive-validation/index.ts";

export type FeedbackType =
  | "observation"
  | "suggestion"
  | "issue"
  | "usability_concern"
  | "enhancement_request"
  | "validation_result"
  | "strategic_insight";

export type FeedbackSource =
  | "executive"
  | "pilot_user"
  | "stakeholder"
  | "internal_reviewer"
  | "validation"
  | "demonstration";

export type FeedbackClassificationCategory =
  | "product"
  | "UX"
  | "workflow"
  | "trust"
  | "simulation"
  | "dashboard"
  | "onboarding"
  | "operational_intelligence"
  | "recommendation_quality";

export type LearningGovernanceSeverity =
  | "informational"
  | "improvement_opportunity"
  | "priority_candidate"
  | "high_priority"
  | "strategic_priority";

export type PilotSuccessEvaluation = "unsuccessful" | "limited_success" | "successful" | "highly_successful";

export type FeedbackDimensionScores = {
  usability: number;
  trustworthiness: number;
  clarity: number;
  explainability: number;
  workflowQuality: number;
  decisionUsefulness: number;
  simulationUsefulness: number;
  dashboardEffectiveness: number;
};

export type ExecutiveFeedbackItem = {
  feedbackId: string;
  organizationId: string;
  type: FeedbackType;
  source: FeedbackSource;
  authorRole: string;
  summary: string;
  detail: string;
  relatedWorkflow: string | null;
  dimensions: FeedbackDimensionScores;
  tags: readonly string[];
  generatedAt: number;
  attribution: string;
  signature: string;
};

export type FeedbackCaptureRegistry = {
  organizationId: string;
  feedback: readonly ExecutiveFeedbackItem[];
  signature: string;
  updatedAt: number;
};

export type FeedbackClassification = {
  classificationId: string;
  feedbackId: string;
  category: FeedbackClassificationCategory;
  rationale: string;
  confidence: number;
  signalKey: string;
  signature: string;
};

export type FeedbackPriorityAssessment = {
  priorityId: string;
  feedbackId: string;
  score: number;
  executiveImpact: number;
  userImpact: number;
  businessValue: number;
  trustImpact: number;
  implementationComplexity: number;
  frequency: number;
  recommendation: string;
  signature: string;
};

export type LearningPatternType =
  | "recurring_concern"
  | "recurring_request"
  | "recurring_friction"
  | "successful_workflow"
  | "trusted_capability"
  | "underutilized_capability";

export type LearningPattern = {
  patternId: string;
  type: LearningPatternType;
  label: string;
  category: FeedbackClassificationCategory;
  occurrenceCount: number;
  evidence: readonly string[];
  confidence: number;
  signature: string;
};

export type PilotInsightSummary = {
  whatUsersTellUs: readonly string[];
  repeatedProblems: readonly string[];
  valuedCapabilities: readonly string[];
  confusionSources: readonly string[];
  improveFirst: readonly string[];
  headline: string;
  signature: string;
};

export type ProductImprovementRecommendation = {
  recommendationId: string;
  area:
    | "UX_improvement"
    | "workflow_improvement"
    | "onboarding_improvement"
    | "stability_improvement"
    | "intelligence_improvement"
    | "trust_improvement";
  priorityScore: number;
  summary: string;
  rationale: string;
  advisoryOnly: true;
  signature: string;
};

export type FeedbackTrendPoint = {
  generatedAt: number;
  feedbackVolume: number;
  recurringIssues: number;
  recurringRequests: number;
  trustObservations: number;
  executiveSatisfaction: number;
};

export type FeedbackTrendSummary = {
  volumeTrend: "increasing" | "decreasing" | "flat";
  recurringIssueTrend: "increasing" | "decreasing" | "flat";
  recurringRequestTrend: "increasing" | "decreasing" | "flat";
  trustObservationTrend: "increasing" | "decreasing" | "flat";
  executiveSatisfactionTrend: "increasing" | "decreasing" | "flat";
  points: readonly FeedbackTrendPoint[];
  signature: string;
};

export type LearningGovernanceClassification = {
  classificationId: string;
  severity: LearningGovernanceSeverity;
  explanation: string;
  rationale: string;
  confidence: number;
  recommendedNextStep: string;
};

export type PilotSuccessAssessment = {
  evaluation: PilotSuccessEvaluation;
  feedbackQuality: number;
  validationOutcomeScore: number;
  trustIndicatorScore: number;
  readinessIndicatorScore: number;
  executiveSatisfactionScore: number;
  rationale: string;
  signature: string;
};

export type ExecutiveLearningDashboard = {
  dashboardId: string;
  organizationId: string;
  generatedAt: number;
  majorFeedbackThemes: readonly string[];
  highestPriorityIssues: readonly ProductImprovementRecommendation[];
  strongestProductStrengths: readonly string[];
  trustObservations: readonly string[];
  pilotRecommendations: readonly ProductImprovementRecommendation[];
  nextImprovementOpportunities: readonly string[];
  classifications: readonly LearningGovernanceClassification[];
  trend: FeedbackTrendSummary;
  pilotSuccess: PilotSuccessAssessment;
  insightSummary: PilotInsightSummary;
  signature: string;
};

export type ExecutiveFeedbackLearningInput = {
  organizationId?: string;
  registry: FeedbackCaptureRegistry;
  dashboard?: ExecutiveReadinessDashboardModel | null;
  validationSuite?: ExecutiveValidationSuiteResult | null;
  launchGate?: ExecutiveLaunchGateResult | null;
  demoPresentation?: ExecutiveDemoModePresentation | null;
  previousTrendPoints?: readonly FeedbackTrendPoint[];
  now?: number;
};

export type ExecutiveFeedbackLearningResult = {
  organizationId: string;
  generatedAt: number;
  classifications: readonly FeedbackClassification[];
  priorities: readonly FeedbackPriorityAssessment[];
  patterns: readonly LearningPattern[];
  insights: PilotInsightSummary;
  recommendations: readonly ProductImprovementRecommendation[];
  success: PilotSuccessAssessment;
  dashboard: ExecutiveLearningDashboard;
  signature: string;
};

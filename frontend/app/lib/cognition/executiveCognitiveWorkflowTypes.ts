export type ExecutiveCognitiveStage =
  | "awareness"
  | "risk_interpretation"
  | "strategic_framing"
  | "comparison"
  | "decision_focus"
  | "confidence_review"
  | "monitoring";

export interface ExecutiveCognitiveWorkflow {
  id: string;
  currentStage: ExecutiveCognitiveStage;
  stageHeadline: string;
  stageSummary?: string;
  recommendedFocus?: string;
  relatedInsightIds?: string[];
  relatedScenarioIds?: string[];
  relatedRecommendationIds?: string[];
  confidence?: number;
  domainId?: string;
  updatedAt: number;
}

export type CognitiveWorkflowOverlayState = {
  currentStage: ExecutiveCognitiveStage;
  stageHeadline: string;
  stageSummary: string;
  recommendedFocus: string;
  confidence: number;
};

export type CognitiveWorkflowEvidence = {
  alertLevel: "none" | "info" | "attention" | "urgent" | "critical";
  compressedInsightCount: number;
  comparisonCount: number;
  recommendationCount: number;
  lowConfidenceCount: number;
  monitoringActive: boolean;
  graphHasPath: boolean;
};

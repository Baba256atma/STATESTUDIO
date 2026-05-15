export type DecisionReviewStatus =
  | "active"
  | "stabilized"
  | "superseded"
  | "resolved"
  | "monitoring";

export interface DecisionReviewRecord {
  id: string;
  title: string;
  summary: string;
  relatedRecommendationIds?: string[];
  relatedScenarioIds?: string[];
  relatedInsightIds?: string[];
  relatedObjectIds?: string[];
  previousState?: string;
  currentState?: string;
  reviewStatus: DecisionReviewStatus;
  confidence?: number;
  rationale?: string;
  lessonsLearned?: string[];
  createdAt: number;
  updatedAt?: number;
}

export type DecisionEvolutionChangeType =
  | "recommendation_changed"
  | "confidence_changed"
  | "monitoring_changed"
  | "fragility_changed"
  | "intervention_changed";

export type DecisionEvolutionChange = {
  id: string;
  type: DecisionEvolutionChangeType;
  previousState?: string;
  currentState?: string;
  confidenceDrift?: number;
  relatedRecommendationIds: string[];
  relatedObjectIds: string[];
};

export type DecisionReviewOverlayState = {
  topReviewId?: string;
  status: DecisionReviewStatus;
  headline: string;
  executiveSummary: string;
  relatedObjectIds: string[];
};

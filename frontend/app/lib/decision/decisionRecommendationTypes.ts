export type DecisionRecommendationCategory =
  | "stabilize"
  | "reduce_risk"
  | "monitor"
  | "diversify"
  | "optimize"
  | "investigate"
  | "protect"
  | "rebalance";

export type DecisionRecommendationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RecommendationLifecycle =
  | "new"
  | "reviewing"
  | "monitoring"
  | "deferred";

export interface DecisionRecommendation {
  id: string;
  title: string;
  summary: string;
  category: DecisionRecommendationCategory;
  rationale: string;
  recommendedFocus?: string;
  affectedObjectIds: string[];
  relatedScenarioIds?: string[];
  confidence: number;
  priority: DecisionRecommendationPriority;
  domainId?: string;
  createdAt: number;
}

export type DecisionRecommendationGroup = {
  label: string;
  category: DecisionRecommendationCategory;
  recommendations: DecisionRecommendation[];
};

export type DecisionRecommendationOverlayState = {
  topRecommendationId?: string;
  affectedObjectIds: string[];
  relatedScenarioIds: string[];
  executiveSummary: string;
  groups: DecisionRecommendationGroup[];
};

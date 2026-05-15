export type DecisionReadinessState =
  | "not_ready"
  | "limited"
  | "developing"
  | "ready_for_review"
  | "ready";

export interface ExecutiveDecisionReadiness {
  id: string;
  title: string;
  summary: string;
  readinessState: DecisionReadinessState;
  relatedObjectIds: string[];
  relatedRecommendationIds?: string[];
  relatedScenarioIds?: string[];
  confidenceScore?: number;
  uncertaintyLevel?: number;
  coordinationReadiness?: number;
  monitoringMaturity?: number;
  executiveRationale?: string;
  blockers?: string[];
  recommendedFocus?: string;
  domainIds?: string[];
  createdAt: number;
}

export type DecisionReadinessBlocker = {
  id: string;
  label: string;
  severity: "low" | "medium" | "high" | "critical";
  relatedObjectIds: string[];
  rationale: string;
};

export type ExecutiveDecisionReadinessOverlayState = {
  topReadinessId?: string;
  headline: string;
  executiveSummary: string;
  readinessState: DecisionReadinessState;
  relatedObjectIds: string[];
  blockerCount: number;
};

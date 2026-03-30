import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";

export type DecisionRiskLevel = "low" | "medium" | "high" | "critical";

export type ActionRecommendationType =
  | "stabilize"
  | "reduce_risk"
  | "optimize"
  | "protect"
  | "increase";

export type ActionUrgency = "low" | "medium" | "high";

export type DecisionSummary = {
  situation: string;
  core_problem: string;
  primary_object: string;
  risk_level: DecisionRiskLevel;
  confidence: number;
};

export type ActionRecommendation = {
  action_title: string;
  target_object_id: string | null;
  action_type: ActionRecommendationType;
  reasoning: string;
  urgency: ActionUrgency;
};

export type ExpectedImpact = {
  primary_effect: string;
  secondary_effects: string[];
  risk_reduction?: string;
  system_change_summary: string;
};

export type ValueFraming = {
  efficiency_gain?: string;
  risk_reduction?: string;
  cost_avoidance?: string;
  qualitative_roi: string;
};

export type DecisionBrief = {
  summary: DecisionSummary;
  recommendation: ActionRecommendation;
  canonical_recommendation: CanonicalRecommendation | null;
  expected_impact: ExpectedImpact;
  value_framing: ValueFraming;
  council_recommendation?: string | null;
  stable_system: boolean;
};

export type DecisionStrategyType =
  | "direct_recommendation"
  | "simulation_first"
  | "compare_first"
  | "memory_first"
  | "multi_agent_review"
  | "evidence_first"
  | "safe_mode_only";

export type DecisionStrategyScore = {
  strategy: DecisionStrategyType;
  score: number;
  reasons: string[];
};

export type MetaDecisionState = {
  generated_at: number;
  selected_strategy: DecisionStrategyType;
  strategy_scores: DecisionStrategyScore[];
  rationale: string;
  evidence_strength: "weak" | "moderate" | "strong";
  uncertainty_level: "low" | "medium" | "high";
  action_posture:
    | "recommend_action"
    | "recommend_simulation"
    | "recommend_comparison"
    | "recommend_more_evidence"
    | "recommend_safe_preview";
  constraints: string[];
  warnings: string[];
  next_best_actions: string[];
};

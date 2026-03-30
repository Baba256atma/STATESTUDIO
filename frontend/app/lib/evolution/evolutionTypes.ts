"use client";

export type ScenarioMemoryRecord = {
  record_id: string;
  timestamp: number;
  scenario_id: string | null;
  scenario_title: string | null;
  source_action_ids: string[];
  source_object_ids: string[];
  mode: "analysis" | "simulation" | "decision" | "compare" | "strategy_generation";
  predicted_summary?: {
    headline: string;
    expected_impact: number | null;
    expected_risk: number | null;
  } | null;
  observed_outcome?: {
    outcome_status: "unknown" | "positive" | "negative" | "mixed";
    observed_impact?: number | null;
    observed_risk?: number | null;
    note?: string | null;
  } | null;
  selected_strategy_id?: string | null;
  tags?: string[];
};

export type StrategyMemoryRecord = {
  record_id: string;
  timestamp: number;
  strategy_id: string;
  title: string;
  rationale: string;
  predicted_score: number | null;
  chosen: boolean;
  outcome_status: "unknown" | "positive" | "negative" | "mixed";
};

export type ComparisonMemoryRecord = {
  record_id: string;
  timestamp: number;
  scenario_a_id: string | null;
  scenario_b_id: string | null;
  winner: "A" | "B" | "tie" | "unknown";
  recommendation: string | null;
  user_choice: "A" | "B" | "hybrid" | "none" | "unknown";
  confidence: number | null;
};

export type LearningSignal = {
  signal_id: string;
  signal_type: "policy_boost" | "policy_penalty" | "confidence_adjustment" | "focus_pattern";
  target_scope: "object" | "path" | "strategy_kind" | "mode" | "global";
  target_key: string;
  value: number;
  rationale: string;
  confidence: number;
  timestamp: number;
};

export type PolicyAdjustment = {
  adjustment_id: string;
  policy_name: "intelligence" | "compare" | "strategy_generation";
  key: string;
  delta: number;
  reason: string;
  confidence: number;
};

export type EvolutionState = {
  active: boolean;
  learning_signals: LearningSignal[];
  policy_adjustments: PolicyAdjustment[];
  summary: {
    headline: string;
    explanation: string;
  };
};

export type RecentMemoryState = {
  scenario_records: ScenarioMemoryRecord[];
  strategy_records: StrategyMemoryRecord[];
  comparison_records: ComparisonMemoryRecord[];
};

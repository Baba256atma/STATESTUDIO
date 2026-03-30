export type SystemIntelligenceMode = "analysis" | "simulation" | "decision";

export type SystemIntelligenceInput = {
  scenario_action?: Record<string, unknown> | null;
  propagation?: Record<string, unknown> | null;
  decision_path?: Record<string, unknown> | null;
  scanner_summary?: Record<string, unknown> | null;
  scene_json?: Record<string, unknown> | null;
  current_focus_object_id?: string | null;
  mode?: SystemIntelligenceMode;
};

export type SystemIntelligenceObjectInsight = {
  object_id: string;
  role: "source" | "impacted" | "leverage" | "bottleneck" | "protected" | "destination" | "context";
  strategic_priority: number;
  pressure_score: number;
  leverage_score: number;
  fragility_score?: number | null;
  rationale: string | null;
};

export type SystemIntelligencePathInsight = {
  path_id: string;
  source_object_id: string | null;
  target_object_id: string | null;
  path_strength: number;
  path_role: "primary" | "secondary" | "tradeoff" | "feedback";
  significance_score: number;
  rationale: string | null;
};

export type SystemIntelligenceSummary = {
  headline: string;
  summary: string;
  key_signal: string | null;
  suggested_focus_object_id: string | null;
  suggested_mode: SystemIntelligenceMode | null;
};

export type SystemIntelligenceAdvice = {
  advice_id: string;
  kind: "focus" | "mitigate" | "protect" | "investigate" | "simulate_next";
  target_object_id: string | null;
  title: string;
  body: string;
  confidence: number;
};

export type SystemIntelligenceResult = {
  active: boolean;
  object_insights: SystemIntelligenceObjectInsight[];
  path_insights: SystemIntelligencePathInsight[];
  summary: SystemIntelligenceSummary;
  advice: SystemIntelligenceAdvice[];
  meta: {
    engine_version?: string;
    interpretation_mode?: string;
    source?: string;
    timestamp?: number;
  };
};

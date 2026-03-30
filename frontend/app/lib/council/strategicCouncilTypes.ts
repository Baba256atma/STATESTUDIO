export type CouncilAgentRole = "ceo" | "cfo" | "coo";

export type CouncilAgentInput = {
  text: string;
  mode?: string;
  focused_object_id?: string | null;
  allowed_objects?: string[];
  fragility?: Record<string, unknown> | null;
  propagation?: Record<string, unknown> | null;
  decision_path?: Record<string, unknown> | null;
  compare_result?: Record<string, unknown> | null;
  strategy_result?: Record<string, unknown> | null;
  memory_summary?: Record<string, unknown> | null;
  learning_summary?: Record<string, unknown> | null;
  scene_json?: Record<string, unknown> | null;
};

export type CouncilAgentOpinion = {
  role: CouncilAgentRole;
  headline: string;
  summary: string;
  priorities: string[];
  concerns: string[];
  recommended_actions: string[];
  confidence: number;
};

export type CouncilDisagreement = {
  dimension: string;
  ceo_position: string | null;
  cfo_position: string | null;
  coo_position: string | null;
  tension_level: number;
  summary: string;
};

export type CouncilSynthesis = {
  headline: string;
  summary: string;
  recommended_direction: string;
  top_actions: string[];
  tradeoffs: string[];
  confidence: number;
};

export type StrategicCouncilResult = {
  active: boolean;
  opinions: CouncilAgentOpinion[];
  disagreements: CouncilDisagreement[];
  synthesis: CouncilSynthesis;
  meta: {
    version: string;
    mode: string;
    source: string;
    timestamp: number;
  };
};

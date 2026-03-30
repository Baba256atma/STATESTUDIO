export type CanonicalRecommendation = {
  id: string;

  primary: {
    action: string;
    target_ids?: string[];
    impact_summary?: string;
  };

  alternatives: Array<{
    action: string;
    tradeoff?: string;
    impact_summary?: string;
  }>;

  reasoning: {
    why: string;
    key_drivers?: string[];
    risk_summary?: string;
  };

  confidence: {
    score: number;
    level: "low" | "medium" | "high";
  };

  simulation?: {
    scenario_id?: string;
    summary?: string;
  };

  source: "generic" | "ai_reasoning" | "simulation" | "multi_agent";

  created_at: number;
};

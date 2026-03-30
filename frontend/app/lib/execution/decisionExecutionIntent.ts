export type DecisionExecutionIntent = {
  id: string;
  action: string;
  source: "recommendation" | "compare" | "war_room" | "timeline";
  target_ids: string[];
  confidence?: number | null;
  impact_summary?: string | null;
  compare_ready?: boolean;
  simulation_ready?: boolean;
  safe_mode?: boolean;
};

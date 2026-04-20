import type {
  DecisionExecutionRequest,
  DecisionExecutionResponse as GeneratedDecisionExecutionResponse,
} from "../api/generated";
import type {
  CanonicalAdvicePanelData,
  CanonicalTimelinePanelData,
  CanonicalWarRoomPanelData,
} from "../panels/panelDataContract";

export type DecisionExecutionPayload = DecisionExecutionRequest;

export type DecisionExecutionKpiEffect = {
  kpi: string;
  change: number;
};

export type DecisionExecutionSimulationResult = {
  impact_score: number;
  risk_change: number;
  kpi_effects: DecisionExecutionKpiEffect[];
  affected_objects: string[];
};

export type DecisionExecutionComparisonItem = {
  option: string;
  score: number;
};

export type DecisionExecutionSceneActions = {
  highlight: string[];
  dim: string[];
};

export type DecisionExecutionRecommendation = {
  recommended_option_id: string;
  reason: string;
  expected_outcome: string;
  risk_level: string;
  key_actions: string[];
};

export type DecisionExecutionComparisonResult = {
  best_option_id: string;
  comparison_summary: string;
  options: Array<Record<string, unknown>>;
};

export type DecisionExecutionResult = Omit<
  GeneratedDecisionExecutionResponse,
  "simulation_result" | "comparison" | "scene_actions"
> & {
  simulation_result: DecisionExecutionSimulationResult;
  comparison: DecisionExecutionComparisonItem[];
  scene_actions: DecisionExecutionSceneActions;
  advice_slice?: CanonicalAdvicePanelData | null;
  timeline_slice?: CanonicalTimelinePanelData | null;
  war_room_slice?: CanonicalWarRoomPanelData | null;
  recommendation?: DecisionExecutionRecommendation | null;
  comparison_result?: DecisionExecutionComparisonResult | null;
};

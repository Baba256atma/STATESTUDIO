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

export type DecisionExecutionResult = GeneratedDecisionExecutionResponse & {
  advice_slice?: CanonicalAdvicePanelData | null;
  timeline_slice?: CanonicalTimelinePanelData | null;
  war_room_slice?: CanonicalWarRoomPanelData | null;
  recommendation?: DecisionExecutionRecommendation | null;
  comparison_result?: DecisionExecutionComparisonResult | null;
};

export type DecisionExecutionSimulationResult = DecisionExecutionResult["simulation_result"];
export type DecisionExecutionComparisonItem = DecisionExecutionResult["comparison"][number];
export type DecisionExecutionSceneActions = DecisionExecutionResult["scene_actions"];
export type DecisionExecutionKpiEffect =
  DecisionExecutionSimulationResult extends { kpi_effects?: Array<infer Effect> }
    ? Effect
    : Record<string, unknown>;

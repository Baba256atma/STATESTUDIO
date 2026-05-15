export type WarRoomStage =
  | "signal_review"
  | "risk_analysis"
  | "scenario_review"
  | "scenario_compare"
  | "recommendation_focus"
  | "decision_focus"
  | "monitoring";

export interface WarRoomFlowState {
  currentStage: WarRoomStage;
  activeScenarioId?: string;
  comparedScenarioIds?: string[];
  selectedInsightId?: string;
  recommendedFocus?: string;
  executiveSummary?: string;
  updatedAt: number;
}

export type WarRoomFlowPriority = "monitor" | "attention" | "urgent" | "critical";

export type WarRoomFlowPanelHint =
  | "dashboard"
  | "risk"
  | "scenario"
  | "compare"
  | "advice"
  | "timeline"
  | "war_room"
  | "monitoring";

export type WarRoomFlowOverlayState = {
  currentStage: WarRoomStage;
  stageLabel: string;
  executiveSummary: string;
  recommendedFocus: string;
  softPanelHints: WarRoomFlowPanelHint[];
  activeScenarioId?: string;
  comparedScenarioIds: string[];
  selectedInsightId?: string;
};

export type WarRoomFocusStripState = {
  stageLabel: string;
  executiveFocus: string;
  priority: WarRoomFlowPriority;
  summary: string;
};

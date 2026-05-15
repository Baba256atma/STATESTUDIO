import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import {
  labelForWarRoomStage,
} from "./warRoomStageNarratives.ts";
import type {
  WarRoomFlowOverlayState,
  WarRoomFlowPanelHint,
  WarRoomFlowPriority,
  WarRoomFlowState,
  WarRoomFocusStripState,
  WarRoomStage,
} from "./warRoomFlowTypes.ts";

function priorityForStage(stage: WarRoomStage, topInsight?: ExecutiveInsight | null): WarRoomFlowPriority {
  if (topInsight?.priorityScore !== undefined) {
    if (topInsight.priorityScore >= 76) return "critical";
    if (topInsight.priorityScore >= 51) return "urgent";
    if (topInsight.priorityScore >= 26) return "attention";
  }
  if (stage === "monitoring" || stage === "decision_focus") return "urgent";
  if (stage === "recommendation_focus" || stage === "scenario_compare") return "urgent";
  if (stage === "risk_analysis") return "attention";
  return "monitor";
}

function panelHintsForStage(stage: WarRoomStage): WarRoomFlowPanelHint[] {
  switch (stage) {
    case "signal_review":
      return ["dashboard", "timeline"];
    case "risk_analysis":
      return ["risk", "dashboard", "timeline"];
    case "scenario_review":
      return ["scenario", "war_room", "advice"];
    case "scenario_compare":
      return ["compare", "war_room", "advice"];
    case "recommendation_focus":
      return ["advice", "war_room", "dashboard"];
    case "decision_focus":
      return ["war_room", "advice", "timeline"];
    case "monitoring":
      return ["monitoring", "timeline", "dashboard"];
  }
}

export function buildWarRoomFlowOverlayState(params: {
  flow: WarRoomFlowState;
}): WarRoomFlowOverlayState {
  const summary = params.flow.executiveSummary ?? "War Room flow is ready for executive review.";
  return {
    currentStage: params.flow.currentStage,
    stageLabel: labelForWarRoomStage(params.flow.currentStage),
    executiveSummary: summary,
    recommendedFocus: params.flow.recommendedFocus ?? "Review the current executive signal",
    softPanelHints: panelHintsForStage(params.flow.currentStage),
    ...(params.flow.activeScenarioId ? { activeScenarioId: params.flow.activeScenarioId } : {}),
    comparedScenarioIds: params.flow.comparedScenarioIds?.slice() ?? [],
    ...(params.flow.selectedInsightId ? { selectedInsightId: params.flow.selectedInsightId } : {}),
  };
}

export function buildWarRoomFocusStripState(params: {
  flow: WarRoomFlowState;
  topInsight?: ExecutiveInsight | null;
}): WarRoomFocusStripState {
  return {
    stageLabel: labelForWarRoomStage(params.flow.currentStage),
    executiveFocus: params.flow.recommendedFocus ?? params.topInsight?.recommendedFocus ?? "Review current system movement",
    priority: priorityForStage(params.flow.currentStage, params.topInsight),
    summary: params.flow.executiveSummary ?? "War Room flow is ready for executive review.",
  };
}

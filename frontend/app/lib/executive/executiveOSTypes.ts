"use client";

import type { CompareResult } from "../compare/compareTypes";
import type { StrategicCouncilResult } from "../council/strategicCouncilTypes";
import type { EvolutionState, RecentMemoryState } from "../evolution/evolutionTypes";
import type { SystemIntelligenceResult } from "../intelligence/systemIntelligenceTypes";
import type { StrategyGenerationResult } from "../strategy-generation/strategyGenerationTypes";
import type { WarRoomController, WarRoomMode } from "../warroom/warRoomTypes";

export type ExecutiveOperatingMode = "observe" | "investigate" | "simulate" | "compare" | "decide" | "review";

export type ExecutiveSignal = {
  signal_id: string;
  kind: "risk" | "fragility" | "leverage" | "opportunity" | "attention" | "learning";
  title: string;
  summary: string;
  target_object_id?: string | null;
  severity?: number | null;
  confidence?: number | null;
};

export type ExecutivePriority = {
  priority_id: string;
  title: string;
  summary: string;
  target_object_id?: string | null;
  target_path_id?: string | null;
  source: "scanner" | "intelligence" | "compare" | "strategy" | "learning";
  urgency: number;
  confidence: number;
};

export type ExecutiveRecommendation = {
  recommendation_id: string;
  kind: "inspect" | "simulate" | "compare" | "protect" | "mitigate" | "explore_strategy" | "review_history";
  title: string;
  summary: string;
  target_object_id?: string | null;
  linked_scenario_id?: string | null;
  linked_strategy_id?: string | null;
  confidence: number;
};

export type ExecutiveQueueItem = {
  item_id: string;
  title: string;
  item_type: "focus" | "scenario" | "comparison" | "strategy" | "review";
  status: "ready" | "in_progress" | "done" | "dismissed";
  linked_object_id?: string | null;
  linked_scenario_id?: string | null;
  linked_strategy_id?: string | null;
};

export type ExecutiveHistoryItem = {
  item_id: string;
  timestamp: number;
  title: string;
  summary: string;
  linked_record_id?: string | null;
  type: "scenario" | "strategy" | "comparison" | "outcome";
};

export type ExecutiveLearningSummary = {
  headline: string;
  summary: string;
  top_signal?: string | null;
  confidence?: number | null;
};

export type ExecutiveWorkspaceSummary = {
  headline: string;
  summary: string;
  active_mode: ExecutiveOperatingMode;
  current_pressure_level?: number | null;
  current_focus_object_id?: string | null;
  council_summary?: string | null;
};

export type ExecutiveOSState = {
  active: boolean;
  operatingMode: ExecutiveOperatingMode;
  currentFocus: {
    objectId: string | null;
    pathId: string | null;
    scenarioId: string | null;
    strategyId: string | null;
  };
  executiveSignals: ExecutiveSignal[];
  priorities: ExecutivePriority[];
  recommendations: ExecutiveRecommendation[];
  operatingQueue: ExecutiveQueueItem[];
  recentHistory: ExecutiveHistoryItem[];
  learningSummary: ExecutiveLearningSummary | null;
  workspaceSummary: ExecutiveWorkspaceSummary | null;
  strategicCouncil: StrategicCouncilResult | null;
};

export type ComposeExecutiveOSInput = {
  operatingMode: ExecutiveOperatingMode;
  warRoom: WarRoomController;
  intelligence: SystemIntelligenceResult | null;
  comparison: CompareResult | null;
  strategyGeneration: StrategyGenerationResult | null;
  recentMemory: RecentMemoryState;
  evolutionState: EvolutionState | null;
  selectedObjectLabel?: string | null;
  scannerSummary?: Record<string, unknown> | null;
  strategicCouncil?: StrategicCouncilResult | null;
};

export type ExecutiveRecommendationActionContext = {
  recommendation: ExecutiveRecommendation;
  openWarRoom?: (() => void) | null;
  setOperatingMode: (mode: ExecutiveOperatingMode) => void;
  warRoom: WarRoomController;
};

export type ExecutiveOSController = {
  state: ExecutiveOSState;
  warRoom: WarRoomController;
  setOperatingMode: (mode: ExecutiveOperatingMode) => void;
  focusObject: (objectId: string | null) => void;
  runRecommendation: (recommendation: ExecutiveRecommendation) => void;
  activatePriority: (priority: ExecutivePriority) => void;
  openWarRoomForScenario: (scenarioId?: string | null) => void;
  openWarRoomForCompare: () => void;
  reviewRecord: (recordId?: string | null) => void;
};

export type ExecutiveOSHookParams = {
  warRoom: WarRoomController;
  selectedObjectLabel?: string | null;
  scannerSummary?: Record<string, unknown> | null;
  onOpenWarRoom?: (() => void) | null;
  strategicCouncil?: StrategicCouncilResult | null;
};

export function mapWarRoomModeToExecutiveMode(mode: WarRoomMode): ExecutiveOperatingMode {
  if (mode === "analysis") return "investigate";
  if (mode === "simulation") return "simulate";
  if (mode === "decision") return "decide";
  return "observe";
}

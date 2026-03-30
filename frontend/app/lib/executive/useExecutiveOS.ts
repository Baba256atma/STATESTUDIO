"use client";

import { useCallback, useMemo, useState } from "react";

import { composeExecutiveOSState } from "./executiveOSComposer";
import type {
  ExecutiveOperatingMode,
  ExecutiveOSController,
  ExecutiveOSHookParams,
  ExecutivePriority,
  ExecutiveRecommendation,
} from "./executiveOSTypes";
import { mapWarRoomModeToExecutiveMode } from "./executiveOSTypes";

function resolveInitialMode(params: ExecutiveOSHookParams): ExecutiveOperatingMode {
  if (params.warRoom.state.compare.active) return "compare";
  if (params.warRoom.state.strategyGeneration.active) return "decide";
  if (params.warRoom.recentMemory.scenario_records.length > 0 && !params.warRoom.session.active) return "review";
  return mapWarRoomModeToExecutiveMode(params.warRoom.state.mode);
}

export function useExecutiveOS(params: ExecutiveOSHookParams): ExecutiveOSController {
  const [operatingMode, setOperatingModeState] = useState<ExecutiveOperatingMode>(() => resolveInitialMode(params));

  const state = useMemo(
    () =>
      composeExecutiveOSState({
        operatingMode,
        warRoom: params.warRoom,
        intelligence: params.warRoom.intelligence,
        comparison: params.warRoom.comparison,
        strategyGeneration: params.warRoom.strategyGeneration,
        recentMemory: params.warRoom.recentMemory,
        evolutionState: params.warRoom.evolutionState,
        selectedObjectLabel: params.selectedObjectLabel,
        scannerSummary: params.scannerSummary,
        strategicCouncil: params.strategicCouncil ?? null,
      }),
    [operatingMode, params.scannerSummary, params.selectedObjectLabel, params.strategicCouncil, params.warRoom]
  );

  const setOperatingMode = useCallback(
    (mode: ExecutiveOperatingMode) => {
      setOperatingModeState(mode);
      if (mode === "observe") params.warRoom.switchMode("analysis");
      if (mode === "investigate") params.warRoom.switchMode("analysis");
      if (mode === "simulate") params.warRoom.switchMode("simulation");
      if (mode === "decide") params.warRoom.switchMode("decision");
      if (mode === "compare") params.warRoom.setCompareViewMode("summary");
    },
    [params.warRoom]
  );

  const focusObject = useCallback(
    (objectId: string | null) => {
      params.warRoom.updateFocus(objectId);
      params.warRoom.setSelectedObject(objectId);
      setOperatingModeState("investigate");
    },
    [params.warRoom]
  );

  const openWarRoomForScenario = useCallback(
    (scenarioId?: string | null) => {
      params.onOpenWarRoom?.();
      params.warRoom.openWarRoom();
      setOperatingModeState("simulate");
      if (scenarioId) {
        params.warRoom.runScenario(scenarioId);
      }
    },
    [params.onOpenWarRoom, params.warRoom]
  );

  const openWarRoomForCompare = useCallback(() => {
    params.onOpenWarRoom?.();
    params.warRoom.openWarRoom();
    params.warRoom.setCompareViewMode("summary");
    setOperatingModeState("compare");
  }, [params.onOpenWarRoom, params.warRoom]);

  const reviewRecord = useCallback((recordId?: string | null) => {
    if (recordId && process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][ExecutiveOS] review requested", { recordId });
    }
    setOperatingModeState("review");
  }, []);

  const runRecommendation = useCallback(
    (recommendation: ExecutiveRecommendation) => {
      if (recommendation.target_object_id) {
        params.warRoom.updateFocus(recommendation.target_object_id);
        params.warRoom.setSelectedObject(recommendation.target_object_id);
      }
      if (recommendation.kind === "inspect") {
        setOperatingModeState("investigate");
        return;
      }
      if (recommendation.kind === "simulate" || recommendation.kind === "protect" || recommendation.kind === "mitigate") {
        openWarRoomForScenario(recommendation.linked_scenario_id);
        return;
      }
      if (recommendation.kind === "compare") {
        openWarRoomForCompare();
        void params.warRoom.runCompare();
        return;
      }
      if (recommendation.kind === "explore_strategy") {
        params.onOpenWarRoom?.();
        params.warRoom.openWarRoom();
        setOperatingModeState("decide");
        if (recommendation.linked_strategy_id) {
          params.warRoom.selectGeneratedStrategy(recommendation.linked_strategy_id);
        } else {
          void params.warRoom.generateStrategies();
        }
        return;
      }
      reviewRecord();
    },
    [openWarRoomForCompare, openWarRoomForScenario, params.onOpenWarRoom, params.warRoom, reviewRecord]
  );

  const activatePriority = useCallback(
    (priority: ExecutivePriority) => {
      if (priority.target_object_id) {
        focusObject(priority.target_object_id);
      }
      if (priority.source === "compare") {
        openWarRoomForCompare();
        return;
      }
      if (priority.source === "strategy") {
        params.onOpenWarRoom?.();
        params.warRoom.openWarRoom();
        setOperatingModeState("decide");
        return;
      }
      setOperatingModeState(priority.target_path_id ? "compare" : "investigate");
    },
    [focusObject, openWarRoomForCompare, params.onOpenWarRoom, params.warRoom]
  );

  return {
    state,
    warRoom: params.warRoom,
    setOperatingMode,
    focusObject,
    runRecommendation,
    activatePriority,
    openWarRoomForScenario,
    openWarRoomForCompare,
    reviewRecord,
  };
}

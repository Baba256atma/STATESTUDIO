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
  const {
    warRoom,
    onOpenWarRoom,
    selectedObjectLabel,
    scannerSummary,
    strategicCouncil,
  } = params;
  const [operatingMode, setOperatingModeState] = useState<ExecutiveOperatingMode>(() => resolveInitialMode(params));

  const state = useMemo(
    () =>
      composeExecutiveOSState({
        operatingMode,
        warRoom,
        intelligence: warRoom.intelligence,
        comparison: warRoom.comparison,
        strategyGeneration: warRoom.strategyGeneration,
        recentMemory: warRoom.recentMemory,
        evolutionState: warRoom.evolutionState,
        selectedObjectLabel,
        scannerSummary,
        strategicCouncil: strategicCouncil ?? null,
      }),
    [operatingMode, scannerSummary, selectedObjectLabel, strategicCouncil, warRoom]
  );

  const setOperatingMode = useCallback(
    (mode: ExecutiveOperatingMode) => {
      setOperatingModeState(mode);
      if (mode === "observe") warRoom.switchMode("analysis");
      if (mode === "investigate") warRoom.switchMode("analysis");
      if (mode === "simulate") warRoom.switchMode("simulation");
      if (mode === "decide") warRoom.switchMode("decision");
      if (mode === "compare") warRoom.setCompareViewMode("summary");
    },
    [warRoom]
  );

  const focusObject = useCallback(
    (objectId: string | null) => {
      warRoom.updateFocus(objectId);
      warRoom.setSelectedObject(objectId);
      setOperatingModeState("investigate");
    },
    [warRoom]
  );

  const openWarRoomForScenario = useCallback(
    (scenarioId?: string | null) => {
      onOpenWarRoom?.();
      warRoom.openWarRoom();
      setOperatingModeState("simulate");
      if (scenarioId) {
        warRoom.runScenario(scenarioId);
      }
    },
    [onOpenWarRoom, warRoom]
  );

  const openWarRoomForCompare = useCallback(() => {
    onOpenWarRoom?.();
    warRoom.openWarRoom();
    warRoom.setCompareViewMode("summary");
    setOperatingModeState("compare");
  }, [onOpenWarRoom, warRoom]);

  const reviewRecord = useCallback((recordId?: string | null) => {
    if (recordId && process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][ExecutiveOS] review requested", { recordId });
    }
    setOperatingModeState("review");
  }, []);

  const runRecommendation = useCallback(
    (recommendation: ExecutiveRecommendation) => {
      if (recommendation.target_object_id) {
        warRoom.updateFocus(recommendation.target_object_id);
        warRoom.setSelectedObject(recommendation.target_object_id);
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
        void warRoom.runCompare();
        return;
      }
      if (recommendation.kind === "explore_strategy") {
        onOpenWarRoom?.();
        warRoom.openWarRoom();
        setOperatingModeState("decide");
        if (recommendation.linked_strategy_id) {
          warRoom.selectGeneratedStrategy(recommendation.linked_strategy_id);
        } else {
          void warRoom.generateStrategies();
        }
        return;
      }
      reviewRecord();
    },
    [openWarRoomForCompare, openWarRoomForScenario, onOpenWarRoom, warRoom, reviewRecord]
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
        onOpenWarRoom?.();
        warRoom.openWarRoom();
        setOperatingModeState("decide");
        return;
      }
      setOperatingModeState(priority.target_path_id ? "compare" : "investigate");
    },
    [focusObject, openWarRoomForCompare, onOpenWarRoom, warRoom]
  );

  return {
    state,
    warRoom,
    setOperatingMode,
    focusObject,
    runRecommendation,
    activatePriority,
    openWarRoomForScenario,
    openWarRoomForCompare,
    reviewRecord,
  };
}

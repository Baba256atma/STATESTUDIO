"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

import { useDecisionImpact } from "../impact/useDecisionImpact";
import { mapDecisionPathResultToOverlay } from "../simulation/decisionPathMapper";
import type { ScenarioActionPropagationIntent } from "../simulation/propagationTriggerTypes";
import { usePropagationBridge } from "../simulation/usePropagationBridge";
import { useSimulationOverlay } from "../simulation/useSimulationOverlay";
import { mergePropagationOverlayState } from "./mergePropagationOverlay";
import {
  getOverlayRuntimeServerVisibility,
  getOverlayRuntimeVisibility,
  isOverlayTypeVisible,
  setOverlayTypeVisibility,
  subscribeOverlayRuntime,
  syncSceneOverlays,
} from "./overlayRuntime";
import { resolveSceneOverlays } from "./resolveSceneOverlays";
import type { OverlayRuntimeVisibility, SceneOverlayType } from "./overlayContracts";

export type UseSceneOverlayRuntimeParams = {
  sceneJson: unknown;
  loops: unknown[];
  selectedObjectId?: string | null;
  scenarioTrigger?: ScenarioActionPropagationIntent | null;
  manualPropagationSourceId?: string | null;
  propagationPayload?: unknown;
  objectSelection?: {
    highlighted_objects?: string[];
    risk_sources?: string[];
    risk_targets?: string[];
    dim_unrelated_objects?: boolean;
  } | null;
  fragilityLevel?: string | null;
  previewEnabled?: boolean;
};

export function useSceneOverlayRuntime(params: UseSceneOverlayRuntimeParams) {
  const visibility = useSyncExternalStore(
    subscribeOverlayRuntime,
    getOverlayRuntimeVisibility,
    getOverlayRuntimeServerVisibility
  );

  const {
    propagationOverlay,
    scenarioOverlayPackage,
    propagationLoading,
    propagationError,
    propagationMode,
  } = usePropagationBridge({
    sceneJson: params.sceneJson as any,
    loops: params.loops as any,
    selectedObjectId: params.selectedObjectId,
    scenarioTrigger: params.scenarioTrigger,
    manualActionObjectId: params.manualPropagationSourceId,
    propagationPayload: params.propagationPayload,
    previewEnabled: params.previewEnabled ?? true,
  });

  const simulationOverlay = useSimulationOverlay(params.propagationPayload);

  const mergedPropagationOverlay = useMemo(
    () =>
      mergePropagationOverlayState(propagationOverlay, {
        highlightedIds: simulationOverlay.highlightedIds,
        intensityMap: simulationOverlay.intensityMap,
        links: simulationOverlay.links,
      }),
    [propagationOverlay, simulationOverlay.highlightedIds, simulationOverlay.intensityMap, simulationOverlay.links]
  );

  const decisionPathOverlay = useMemo(
    () => mapDecisionPathResultToOverlay(scenarioOverlayPackage.decisionPath ?? null),
    [scenarioOverlayPackage.decisionPath]
  );

  const { selection: decisionImpactSelection } = useDecisionImpact({
    propagation: mergedPropagationOverlay,
    decisionPath: scenarioOverlayPackage.decisionPath ?? null,
    strategicAdvice:
      (params.propagationPayload as any)?.strategic_advice ??
      (params.sceneJson as any)?.strategic_advice ??
      (params.sceneJson as any)?.scene?.strategic_advice ??
      null,
    strategicCouncil:
      (params.propagationPayload as any)?.strategic_council ??
      (params.sceneJson as any)?.strategic_council ??
      (params.sceneJson as any)?.scene?.strategic_council ??
      null,
    scenarioAction: scenarioOverlayPackage.sourceAction ?? params.scenarioTrigger ?? null,
    sceneJson: params.sceneJson,
    source: "scene_overlay_runtime",
  });

  const combinedObjectSelection = useMemo(() => {
    const base = params.objectSelection ?? null;
    if (!decisionImpactSelection) {
      if (simulationOverlay.highlightedIds.length === 0) return base;
      return {
        ...base,
        highlighted_objects: Array.from(
          new Set([...(base?.highlighted_objects ?? []).map(String), ...simulationOverlay.highlightedIds.map(String)])
        ),
      };
    }
    return {
      highlighted_objects: Array.from(
        new Set([
          ...(base?.highlighted_objects ?? []).map(String),
          ...decisionImpactSelection.highlighted_objects.map(String),
          ...simulationOverlay.highlightedIds.map(String),
        ])
      ),
      risk_sources: Array.from(
        new Set([...(base?.risk_sources ?? []).map(String), ...decisionImpactSelection.risk_sources.map(String)])
      ),
      risk_targets: Array.from(
        new Set([...(base?.risk_targets ?? []).map(String), ...decisionImpactSelection.risk_targets.map(String)])
      ),
      dim_unrelated_objects:
        decisionImpactSelection.dim_unrelated_objects || base?.dim_unrelated_objects === true,
    };
  }, [decisionImpactSelection, params.objectSelection, simulationOverlay.highlightedIds]);

  const resolvedOverlays = useMemo(
    () =>
      resolveSceneOverlays({
        propagation: mergedPropagationOverlay,
        decisionPath: decisionPathOverlay,
        riskSources: combinedObjectSelection?.risk_sources,
        riskTargets: combinedObjectSelection?.risk_targets,
        fragilityLevel: params.fragilityLevel ?? null,
        sceneJson: params.sceneJson,
      }),
    [
      combinedObjectSelection?.risk_sources,
      combinedObjectSelection?.risk_targets,
      decisionPathOverlay,
      mergedPropagationOverlay,
      params.fragilityLevel,
      params.sceneJson,
    ]
  );

  useEffect(() => {
    syncSceneOverlays(resolvedOverlays, "runtime");
  }, [resolvedOverlays]);

  const visiblePropagationOverlay = visibility.propagation ? mergedPropagationOverlay : null;
  const visibleDecisionPathOverlay = visibility.scenario ? decisionPathOverlay : null;

  const setOverlayVisibility = (type: SceneOverlayType, visible: boolean) => {
    setOverlayTypeVisibility(type, visible, "manual");
  };

  return {
    visibility,
    setOverlayVisibility,
    isOverlayTypeVisible,
    overlays: resolvedOverlays,
    mergedPropagationOverlay,
    visiblePropagationOverlay,
    decisionPathOverlay,
    visibleDecisionPathOverlay,
    combinedObjectSelection,
    scenarioOverlayPackage,
    propagationLoading,
    propagationError,
    propagationMode,
    simulationOverlay,
  };
}

export type SceneOverlayRuntimeState = ReturnType<typeof useSceneOverlayRuntime>;

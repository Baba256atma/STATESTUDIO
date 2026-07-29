"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

import { useDecisionImpact } from "../impact/useDecisionImpact";
import { mapDecisionPathResultToOverlay } from "../simulation/decisionPathMapper";
import type { ScenarioActionPropagationIntent } from "../simulation/propagationTriggerTypes";
import { usePropagationBridge } from "../simulation/usePropagationBridge";
import { useSimulationOverlay } from "../simulation/useSimulationOverlay";
import type { SceneJson, SceneLoop } from "../sceneTypes";
import type { StrategicCouncilResult } from "../council/strategicCouncilTypes";
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
import type { SceneOverlayType } from "./overlayContracts";

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

function asSceneJson(value: unknown): SceneJson | null {
  return value && typeof value === "object" ? (value as SceneJson) : null;
}

function asSceneLoops(value: unknown): SceneLoop[] | null {
  return Array.isArray(value) ? (value as SceneLoop[]) : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readNestedRecord(value: unknown, ...keys: string[]): Record<string, unknown> | null {
  let current: unknown = value;
  for (const key of keys) {
    current = asRecord(current)?.[key];
  }
  return asRecord(current);
}

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
    sceneJson: asSceneJson(params.sceneJson),
    loops: asSceneLoops(params.loops),
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
      readNestedRecord(params.propagationPayload, "strategic_advice") ??
      readNestedRecord(params.sceneJson, "strategic_advice") ??
      readNestedRecord(params.sceneJson, "scene", "strategic_advice") ??
      null,
    strategicCouncil:
      (readNestedRecord(params.propagationPayload, "strategic_council") ??
      readNestedRecord(params.sceneJson, "strategic_council") ??
      readNestedRecord(params.sceneJson, "scene", "strategic_council") ??
      null) as StrategicCouncilResult | null,
    scenarioAction: scenarioOverlayPackage.sourceAction ?? params.scenarioTrigger ?? null,
    sceneJson: asSceneJson(params.sceneJson),
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

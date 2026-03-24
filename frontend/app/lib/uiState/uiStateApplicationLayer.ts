import type { SceneJson } from "../sceneTypes";
import { traceHighlightFlow } from "../debug/highlightDebugTrace";
import type {
  NexoraUiReadableState,
  NexoraUiStateAdapters,
  NexoraUiStateApplicationInput,
  NexoraUiStateApplicationResult,
} from "./uiStateApplicationTypes";

function createApplyResult(result: NexoraUiStateApplicationInput["result"]): NexoraUiStateApplicationResult {
  return {
    ok: true,
    appliedSections: [],
    skippedSections: [],
    warnings: [...(result.warnings ?? [])],
    errors: [...(result.errors ?? [])],
    summary: result.executionSummary,
  };
}

function markSection(
  applyResult: NexoraUiStateApplicationResult,
  name: string,
  applied: boolean,
  warning?: string
): void {
  if (applied) {
    applyResult.appliedSections.push(name);
  } else {
    applyResult.skippedSections.push(name);
    if (warning) applyResult.warnings.push(warning);
  }
}

function derivePreferredFocusId(result: NexoraUiStateApplicationInput["result"]): string | null {
  return result.focusedObjectId ?? result.highlightedObjectIds[0] ?? null;
}

function buildNormalizedResponseData(result: NexoraUiStateApplicationInput["result"]): any | null {
  return (
    result.backendPayload ??
    result.scannerPayload ??
    result.simulationPayload ??
    result.advicePayload ??
    result.localDecisionPayload ??
    null
  );
}

function applyPanelSelection(
  result: NexoraUiStateApplicationInput["result"],
  adapters: NexoraUiStateAdapters,
  applyResult: NexoraUiStateApplicationResult
): void {
  if (result.shouldOpenPanel && result.preferredPanel) {
    if (adapters.openRightPanel) {
      adapters.openRightPanel(result.preferredPanel);
      markSection(applyResult, "panel_selection", true);
    } else if (adapters.setRightPanelTab && adapters.setInspectorOpen) {
      adapters.setRightPanelTab(result.preferredPanel);
      adapters.setInspectorOpen(true);
      markSection(applyResult, "panel_selection", true);
    } else {
      markSection(applyResult, "panel_selection", false, "Panel update requested but no panel adapter is available.");
    }
  } else {
    markSection(applyResult, "panel_selection", false);
  }

  if (result.shouldUpdateInspector && result.preferredInspectorTab) {
    if (adapters.setActiveInspectorReportTab) {
      adapters.setActiveInspectorReportTab(result.preferredInspectorTab);
      markSection(applyResult, "inspector_selection", true);
    } else {
      markSection(applyResult, "inspector_selection", false, "Inspector update requested but no inspector adapter is available.");
    }
  } else {
    markSection(applyResult, "inspector_selection", false);
  }
}

function applyResponseData(
  result: NexoraUiStateApplicationInput["result"],
  adapters: NexoraUiStateAdapters,
  applyResult: NexoraUiStateApplicationResult
): void {
  const normalized = buildNormalizedResponseData(result);
  if (adapters.setResponseData && normalized) {
    adapters.setResponseData(normalized);
    markSection(applyResult, "response_data", true);
  } else {
    markSection(applyResult, "response_data", false);
  }

  if (adapters.setLastAnalysisSummary) {
    adapters.setLastAnalysisSummary(
      typeof normalized?.analysis_summary === "string"
        ? normalized.analysis_summary
        : result.executionSummary ?? null
    );
    markSection(applyResult, "response_summary", true);
  } else {
    markSection(applyResult, "response_summary", false);
  }

  if (adapters.setSourceLabel) {
    adapters.setSourceLabel(
      typeof normalized?.source === "string" ? normalized.source : result.routeTarget ?? null
    );
    markSection(applyResult, "response_metadata", true);
  } else {
    markSection(applyResult, "response_metadata", false);
  }

  if (adapters.setLastActions) {
    const actions = Array.isArray(normalized?.actions) ? normalized.actions : [];
    adapters.setLastActions(actions);
  }
}

function applyFocusState(
  result: NexoraUiStateApplicationInput["result"],
  currentState: NexoraUiReadableState,
  adapters: NexoraUiStateAdapters,
  applyResult: NexoraUiStateApplicationResult
): void {
  const focusId = derivePreferredFocusId(result);
  if (!focusId) {
    markSection(applyResult, "focus_state", false);
    return;
  }

  adapters.setSelectedObjectIdState?.(focusId);
  adapters.setFocusedId?.(focusId);
  adapters.setFocusMode?.("selected");
  adapters.applyFocusModeToStore?.("selected");
  if (currentState.focusPinned) {
    adapters.applyPinToStore?.(true, focusId);
  }
  adapters.updateSelectedObjectInfo?.(focusId);
  markSection(applyResult, "focus_state", true);
}

function applySceneState(
  result: NexoraUiStateApplicationInput["result"],
  currentState: NexoraUiReadableState,
  adapters: NexoraUiStateAdapters,
  applyResult: NexoraUiStateApplicationResult
): void {
  if (!result.allowSceneMutation) {
    adapters.setNoSceneUpdate?.(true);
    if (result.appliedSceneMutation !== "none") {
      adapters.setSceneWarn?.("⚠️ Scene mutation was blocked by execution policy.");
    }
    markSection(applyResult, "scene_state", false);
    return;
  }

  if (result.unifiedReaction && adapters.applyUnifiedReaction) {
    adapters.applyUnifiedReaction(result.unifiedReaction, {
      sceneReplacement: result.sceneReplacement ?? null,
      allowSceneReplacement: result.appliedSceneMutation === "full_update" && !!result.sceneReplacement,
    });
    adapters.setNoSceneUpdate?.(result.appliedSceneMutation === "none");
    adapters.setSceneWarn?.(null);
    markSection(applyResult, "scene_state", true);
    return;
  }

  if (result.appliedSceneMutation === "full_update" && result.sceneReplacement && adapters.setSceneJson) {
    adapters.setSceneJson(result.sceneReplacement as SceneJson);
    adapters.setNoSceneUpdate?.(false);
    adapters.setSceneWarn?.(null);
    markSection(applyResult, "scene_state", true);
    return;
  }

  if (result.appliedSceneMutation === "none") {
    adapters.setNoSceneUpdate?.(true);
    markSection(applyResult, "scene_state", false);
    return;
  }

  adapters.setNoSceneUpdate?.(false);
  if (!result.sceneReplacement && !result.unifiedReaction) {
    adapters.setSceneWarn?.("⚠️ Scene mutation was requested but no safe scene payload was available.");
    markSection(applyResult, "scene_state", false);
    return;
  }
  adapters.setSceneWarn?.(null);
  markSection(applyResult, "scene_state", true);
}

function applyPanelPayloadState(
  result: NexoraUiStateApplicationInput["result"],
  adapters: NexoraUiStateAdapters,
  applyResult: NexoraUiStateApplicationResult
): void {
  const panelUpdates = result.panelUpdates ?? {};
  const normalized = buildNormalizedResponseData(result);

  if (panelUpdates.viewModel && adapters.applyProductFlowViewModel && normalized) {
    adapters.applyProductFlowViewModel(normalized, panelUpdates.viewModel, {
      applyActionsToScene: false,
      syncSceneState: false,
      applyVisualState: false,
    });
    markSection(applyResult, "panel_payloads", true);
    return;
  }

  let appliedAny = false;
  const maybeApply = <T,>(value: T | undefined, setter?: (value: T) => void) => {
    if (setter && value !== undefined) {
      setter(value);
      appliedAny = true;
    }
  };

  maybeApply(panelUpdates.objectSelection, adapters.setObjectSelection);
  maybeApply(panelUpdates.memoryInsights, adapters.setMemoryInsights);
  maybeApply(panelUpdates.riskPropagation, adapters.setRiskPropagation);
  maybeApply(panelUpdates.strategicAdvice, adapters.setStrategicAdvice);
  maybeApply(panelUpdates.strategyKpi, adapters.setStrategyKpi);
  maybeApply(panelUpdates.decisionCockpit, adapters.setDecisionCockpit);
  maybeApply(panelUpdates.productModeContext, adapters.setProductModeContext);
  maybeApply(panelUpdates.aiReasoning, adapters.setAiReasoning);
  maybeApply(panelUpdates.platformAssembly, adapters.setPlatformAssembly);
  maybeApply(panelUpdates.autonomousExploration, adapters.setAutonomousExploration);
  maybeApply(panelUpdates.opponentModel, adapters.setOpponentModel);
  maybeApply(panelUpdates.strategicPatterns, adapters.setStrategicPatterns);
  maybeApply(panelUpdates.conflicts, adapters.setConflicts);
  maybeApply(panelUpdates.kpi, adapters.setKpi);
  maybeApply(panelUpdates.loops, adapters.setLoops);
  maybeApply(panelUpdates.activeLoopId, adapters.setActiveLoopId);
  maybeApply(panelUpdates.loopSuggestions, adapters.setLoopSuggestions);

  if (panelUpdates.productModeId !== undefined && adapters.setProductModeId) {
    adapters.setProductModeId(String(panelUpdates.productModeId));
    appliedAny = true;
  }

  markSection(applyResult, "panel_payloads", appliedAny);
}

function applyObjectProfileState(
  result: NexoraUiStateApplicationInput["result"],
  currentState: NexoraUiReadableState,
  adapters: NexoraUiStateAdapters,
  applyResult: NexoraUiStateApplicationResult
): void {
  if (result.objectProfileUpdates && adapters.setObjectProfiles) {
    adapters.setObjectProfiles((prev: Record<string, unknown> = {}) => ({
      ...(prev ?? {}),
      ...(result.objectProfileUpdates ?? {}),
    }));
    const focusId = derivePreferredFocusId(result) ?? currentState.selectedObjectId ?? null;
    adapters.updateSelectedObjectInfo?.(focusId);
    markSection(applyResult, "object_profiles", true);
    return;
  }

  markSection(applyResult, "object_profiles", false);
}

function applySecondaryState(
  result: NexoraUiStateApplicationInput["result"],
  adapters: NexoraUiStateAdapters,
  applyResult: NexoraUiStateApplicationResult
): void {
  if (result.errors.length > 0) {
    adapters.setReplayError?.(result.errors[0]);
    adapters.setAlert?.({ type: "error", message: result.errors[0] });
    applyResult.ok = false;
  } else if (result.warnings.length > 0) {
    adapters.setSceneWarn?.(result.warnings[0]);
    adapters.setAlert?.({ type: "warning", message: result.warnings[0] });
  } else {
    adapters.setReplayError?.(null);
  }

  if (adapters.setHealthInfo) {
    adapters.setHealthInfo(result.ok ? null : result.errors[0] ?? "Execution completed with issues.");
  }

  markSection(applyResult, "secondary_state", true);
}

export function applyNexoraUiState(
  input: NexoraUiStateApplicationInput
): NexoraUiStateApplicationResult {
  const applyResult = createApplyResult(input.result);

  traceHighlightFlow("ui_state", {
    preferredPanel: input.result.preferredPanel ?? null,
    preferredInspectorTab: input.result.preferredInspectorTab ?? null,
    shouldOpenPanel: input.result.shouldOpenPanel,
    shouldUpdateInspector: input.result.shouldUpdateInspector,
    highlightedObjectIds: input.result.highlightedObjectIds,
    focusedObjectId: input.result.focusedObjectId ?? null,
    allowSceneMutation: input.result.allowSceneMutation,
    appliedSceneMutation: input.result.appliedSceneMutation,
    routeIntent: input.result.routeIntent,
    routeTarget: input.result.routeTarget,
    currentFocusedId: input.currentState.focusedId ?? null,
    currentSelectedObjectId: input.currentState.selectedObjectId ?? null,
    warnings: input.result.warnings,
    errors: input.result.errors,
  });

  applyPanelSelection(input.result, input.adapters, applyResult);
  applyResponseData(input.result, input.adapters, applyResult);
  applyFocusState(input.result, input.currentState, input.adapters, applyResult);
  applySceneState(input.result, input.currentState, input.adapters, applyResult);
  applyPanelPayloadState(input.result, input.adapters, applyResult);
  applyObjectProfileState(input.result, input.currentState, input.adapters, applyResult);
  applySecondaryState(input.result, input.adapters, applyResult);

  applyResult.summary = `Applied sections: ${applyResult.appliedSections.join(", ") || "none"}`;
  traceHighlightFlow("ui_state", {
    appliedSections: applyResult.appliedSections,
    skippedSections: applyResult.skippedSections,
    summary: applyResult.summary,
    highlightedObjectIds: input.result.highlightedObjectIds,
    focusedObjectId: input.result.focusedObjectId ?? null,
    allowSceneMutation: input.result.allowSceneMutation,
    appliedSceneMutation: input.result.appliedSceneMutation,
    ok: applyResult.ok,
    warnings: applyResult.warnings,
    errors: applyResult.errors,
  });
  return applyResult;
}

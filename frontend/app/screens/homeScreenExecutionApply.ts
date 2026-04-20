/**
 * Prep for applyExecutionResultToUi → applyNexoraUiState: readable state, adapters, trace payloads.
 * No React state ownership; HomeScreen passes setters/refs and runs applyNexoraUiState in order.
 */

import type { MutableRefObject } from "react";
import type { SceneJson } from "../lib/sceneTypes";
import type { NexoraExecutionResult } from "../lib/execution/actionExecutionTypes";
import type {
  NexoraUiReadableState,
  NexoraUiStateAdapters,
  NexoraUiStateApplicationResult,
} from "../lib/uiState/uiStateApplicationTypes";

/** Snapshot of HomeScreen UI read-model passed into applyNexoraUiState. */
export type HomeScreenUiSnapshotForApply = {
  rightPanelTab: string | null | undefined;
  activeInspectorReportTab: string | null | undefined;
  inspectorOpen: boolean;
  sceneJson: SceneJson | null;
  selectedObjectId: string | null;
  focusedId: string | null;
  focusMode: "all" | "selected";
  focusPinned: boolean;
  messages: NexoraUiReadableState["messages"];
  memory: NexoraUiReadableState["memory"];
  responseData: NexoraUiReadableState["responseData"];
};

export function buildNexoraUiReadableStateForApply(snapshot: HomeScreenUiSnapshotForApply): NexoraUiReadableState {
  return {
    rightPanelTab: snapshot.rightPanelTab,
    activeInspectorReportTab: snapshot.activeInspectorReportTab,
    inspectorOpen: snapshot.inspectorOpen,
    sceneJson: snapshot.sceneJson,
    selectedObjectId: snapshot.selectedObjectId,
    focusedId: snapshot.focusedId,
    focusMode: snapshot.focusMode,
    focusPinned: snapshot.focusPinned,
    messages: snapshot.messages,
    memory: snapshot.memory,
    responseData: snapshot.responseData,
  };
}

export function buildHomescreenExecutionApplyTracePayload(args: {
  executionResult: NexoraExecutionResult;
  rightPanelTab: string | null | undefined;
  activeInspectorReportTab: string | null | undefined;
  selectedObjectId: string | null;
  focusedId: string | null;
  focusMode: "all" | "selected";
  focusPinned: boolean;
  applyResult: NexoraUiStateApplicationResult;
}): Record<string, unknown> {
  return {
    highlightedObjectIds: args.executionResult.highlightedObjectIds,
    focusedObjectId: args.executionResult.focusedObjectId ?? null,
    allowSceneMutation: args.executionResult.allowSceneMutation,
    appliedSceneMutation: args.executionResult.appliedSceneMutation,
    rightPanelTab: args.rightPanelTab,
    activeInspectorReportTab: args.activeInspectorReportTab,
    selectedObjectId: args.selectedObjectId,
    focusedId: args.focusedId,
    focusMode: args.focusMode,
    focusPinned: args.focusPinned,
    applySummary: args.applyResult.summary,
    appliedSections: args.applyResult.appliedSections,
    skippedSections: args.applyResult.skippedSections,
  };
}

/** Dependencies for Nexora UI adapters used after executeNexoraAction (same behavior as prior inline object). */
export type NexoraUiAdapterDeps = {
  preferredRightPanelLegacyTabRef: MutableRefObject<string | null>;
  rightPanelIsOpen: boolean;
  handleCloseRightPanel: () => void;
  setSceneJson: NonNullable<NexoraUiStateAdapters["setSceneJson"]>;
  setSceneWarn: NonNullable<NexoraUiStateAdapters["setSceneWarn"]>;
  setNoSceneUpdate: NonNullable<NexoraUiStateAdapters["setNoSceneUpdate"]>;
  setLastActions: NonNullable<NexoraUiStateAdapters["setLastActions"]>;
  setFocusedId: NonNullable<NexoraUiStateAdapters["setFocusedId"]>;
  setSelectedObjectIdState: NonNullable<NexoraUiStateAdapters["setSelectedObjectIdState"]>;
  setFocusMode: NonNullable<NexoraUiStateAdapters["setFocusMode"]>;
  setFocusPinned: NonNullable<NexoraUiStateAdapters["setFocusPinned"]>;
  applyFocusModeToStore: NonNullable<NexoraUiStateAdapters["applyFocusModeToStore"]>;
  applyPinToStore: NonNullable<NexoraUiStateAdapters["applyPinToStore"]>;
  setMessages: NonNullable<NexoraUiStateAdapters["setMessages"]>;
  setResponseData: NonNullable<NexoraUiStateAdapters["setResponseData"]>;
  setLastAnalysisSummary: NonNullable<NexoraUiStateAdapters["setLastAnalysisSummary"]>;
  setSourceLabel: NonNullable<NexoraUiStateAdapters["setSourceLabel"]>;
  setObjectSelection: NonNullable<NexoraUiStateAdapters["setObjectSelection"]>;
  setMemoryInsights: NonNullable<NexoraUiStateAdapters["setMemoryInsights"]>;
  setRiskPropagation: NonNullable<NexoraUiStateAdapters["setRiskPropagation"]>;
  setStrategicAdvice: NonNullable<NexoraUiStateAdapters["setStrategicAdvice"]>;
  setStrategyKpi: NonNullable<NexoraUiStateAdapters["setStrategyKpi"]>;
  setDecisionCockpit: NonNullable<NexoraUiStateAdapters["setDecisionCockpit"]>;
  setProductModeContext: NonNullable<NexoraUiStateAdapters["setProductModeContext"]>;
  setAiReasoning: NonNullable<NexoraUiStateAdapters["setAiReasoning"]>;
  setPlatformAssembly: NonNullable<NexoraUiStateAdapters["setPlatformAssembly"]>;
  setAutonomousExploration: NonNullable<NexoraUiStateAdapters["setAutonomousExploration"]>;
  setOpponentModel: NonNullable<NexoraUiStateAdapters["setOpponentModel"]>;
  setStrategicPatterns: NonNullable<NexoraUiStateAdapters["setStrategicPatterns"]>;
  setConflictsNormalized: (value: unknown) => void;
  setSelectedObjectInfo: NonNullable<NexoraUiStateAdapters["setSelectedObjectInfo"]>;
  updateSelectedObjectInfo: NonNullable<NexoraUiStateAdapters["updateSelectedObjectInfo"]>;
  setObjectProfiles: NonNullable<NexoraUiStateAdapters["setObjectProfiles"]>;
  setObjectUxById: NonNullable<NexoraUiStateAdapters["setObjectUxById"]>;
  setAlert: NonNullable<NexoraUiStateAdapters["setAlert"]>;
  setReplayError: NonNullable<NexoraUiStateAdapters["setReplayError"]>;
  setHealthInfo: NonNullable<NexoraUiStateAdapters["setHealthInfo"]>;
  setKpi: NonNullable<NexoraUiStateAdapters["setKpi"]>;
  setLoops: NonNullable<NexoraUiStateAdapters["setLoops"]>;
  setActiveLoopId: NonNullable<NexoraUiStateAdapters["setActiveLoopId"]>;
  setLoopSuggestions: NonNullable<NexoraUiStateAdapters["setLoopSuggestions"]>;
  setProductModeId: NonNullable<NexoraUiStateAdapters["setProductModeId"]>;
  applyUnifiedSceneReaction: NonNullable<NexoraUiStateAdapters["applyUnifiedReaction"]>;
  applyProductFlowViewModel: NonNullable<NexoraUiStateAdapters["applyProductFlowViewModel"]>;
};

export function createNexoraUiAdaptersForExecutionApply(d: NexoraUiAdapterDeps): NexoraUiStateAdapters {
  return {
    openRightPanel: (tab) => {
      if (typeof tab === "string") {
        d.preferredRightPanelLegacyTabRef.current = tab;
      }
    },
    setRightPanelTab: (tab) => {
      d.preferredRightPanelLegacyTabRef.current = tab as string;
    },
    setActiveInspectorReportTab: (tab) => {
      d.preferredRightPanelLegacyTabRef.current = tab as string | null;
    },
    setInspectorOpen: (open: boolean | ((prev: boolean) => boolean)) => {
      const nextOpen = typeof open === "function" ? open(d.rightPanelIsOpen) : open;
      if (!nextOpen) {
        d.handleCloseRightPanel();
      }
    },
    setSceneJson: d.setSceneJson,
    setSceneWarn: d.setSceneWarn,
    setNoSceneUpdate: d.setNoSceneUpdate,
    setLastActions: d.setLastActions,
    setFocusedId: d.setFocusedId,
    setSelectedObjectIdState: d.setSelectedObjectIdState,
    setFocusMode: d.setFocusMode,
    setFocusPinned: d.setFocusPinned,
    applyFocusModeToStore: d.applyFocusModeToStore,
    applyPinToStore: d.applyPinToStore,
    setMessages: d.setMessages,
    setResponseData: d.setResponseData,
    setLastAnalysisSummary: d.setLastAnalysisSummary,
    setSourceLabel: d.setSourceLabel,
    setObjectSelection: d.setObjectSelection,
    setMemoryInsights: d.setMemoryInsights,
    setRiskPropagation: d.setRiskPropagation,
    setStrategicAdvice: d.setStrategicAdvice,
    setStrategyKpi: d.setStrategyKpi,
    setDecisionCockpit: d.setDecisionCockpit,
    setProductModeContext: d.setProductModeContext,
    setAiReasoning: d.setAiReasoning,
    setPlatformAssembly: d.setPlatformAssembly,
    setAutonomousExploration: d.setAutonomousExploration,
    setOpponentModel: d.setOpponentModel,
    setStrategicPatterns: d.setStrategicPatterns,
    setConflicts: (value) => d.setConflictsNormalized(value),
    setSelectedObjectInfo: d.setSelectedObjectInfo,
    updateSelectedObjectInfo: d.updateSelectedObjectInfo,
    setObjectProfiles: d.setObjectProfiles,
    setObjectUxById: d.setObjectUxById,
    setAlert: d.setAlert,
    setReplayError: d.setReplayError,
    setHealthInfo: d.setHealthInfo,
    setKpi: d.setKpi,
    setLoops: d.setLoops,
    setActiveLoopId: d.setActiveLoopId,
    setLoopSuggestions: d.setLoopSuggestions,
    setProductModeId: d.setProductModeId,
    applyUnifiedReaction: d.applyUnifiedSceneReaction,
    applyProductFlowViewModel: d.applyProductFlowViewModel,
  };
}

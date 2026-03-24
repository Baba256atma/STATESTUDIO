import type { SceneJson } from "../sceneTypes";
import type { NexoraExecutionResult } from "../execution/actionExecutionTypes";

export type NexoraUiReadableState = {
  rightPanelTab?: string | null;
  activeInspectorReportTab?: string | null;
  inspectorOpen?: boolean;
  sceneJson?: SceneJson | null;
  selectedObjectId?: string | null;
  focusedId?: string | null;
  focusMode?: "all" | "selected";
  focusPinned?: boolean;
  messages?: any[];
  memory?: any;
  responseData?: any | null;
};

export type NexoraUiStateAdapters = {
  openRightPanel?: (tab: string) => void;
  setRightPanelTab?: (tab: any) => void;
  setActiveInspectorReportTab?: (tab: any) => void;
  setInspectorOpen?: (open: boolean) => void;

  setSceneJson?: (scene: SceneJson | null | ((prev: SceneJson | null) => SceneJson | null)) => void;
  setSceneWarn?: (value: string | null) => void;
  setNoSceneUpdate?: (value: boolean) => void;
  setLastActions?: (value: any[]) => void;

  setFocusedId?: (id: string | null) => void;
  setSelectedObjectIdState?: (id: string | null) => void;
  setFocusMode?: (mode: "all" | "selected") => void;
  setFocusPinned?: (value: boolean) => void;
  setPinnedSafe?: (value: boolean, id: string | null) => void;
  applyFocusModeToStore?: (mode: "all" | "selected" | "pinned") => void;
  applyPinToStore?: (pinned: boolean, id: string | null) => void;

  setMessages?: (value: any) => void;
  setResponseData?: (value: any | null) => void;
  setLastAnalysisSummary?: (value: string | null) => void;
  setSourceLabel?: (value: string | null) => void;

  setObjectSelection?: (value: any | null) => void;
  setMemoryInsights?: (value: any | null) => void;
  setRiskPropagation?: (value: any | null) => void;
  setStrategicAdvice?: (value: any | null) => void;
  setStrategyKpi?: (value: any | null) => void;
  setDecisionCockpit?: (value: any | null) => void;
  setProductModeContext?: (value: any | null) => void;
  setAiReasoning?: (value: any | null) => void;
  setPlatformAssembly?: (value: any | null) => void;
  setAutonomousExploration?: (value: any | null) => void;
  setOpponentModel?: (value: any | null) => void;
  setStrategicPatterns?: (value: any | null) => void;
  setConflicts?: (value: any[] | null) => void;
  setKpi?: (value: any | null) => void;
  setLoops?: (value: any[]) => void;
  setActiveLoopId?: (value: string | null) => void;
  setLoopSuggestions?: (value: any[]) => void;
  setProductModeId?: (value: string) => void;

  setSelectedObjectInfo?: (value: any | null) => void;
  updateSelectedObjectInfo?: (id: string | null) => void;
  setObjectProfiles?: (value: any) => void;
  setObjectUxById?: (value: any) => void;

  setAlert?: (value: any | null) => void;
  setReplayError?: (value: string | null) => void;
  setHealthInfo?: (value: string | null) => void;

  applyUnifiedReaction?: (
    reaction: any,
    options?: { sceneReplacement?: SceneJson | null; allowSceneReplacement?: boolean }
  ) => void;
  applyProductFlowViewModel?: (
    payload: any,
    viewModel: any,
    options?: {
      applyActionsToScene?: boolean;
      syncSceneState?: boolean;
      applyVisualState?: boolean;
    }
  ) => void;
};

export type NexoraUiStateApplicationOptions = {
  applyChatReply?: boolean;
};

export type NexoraUiStateApplicationInput = {
  result: NexoraExecutionResult;
  currentState: NexoraUiReadableState;
  adapters: NexoraUiStateAdapters;
  options?: NexoraUiStateApplicationOptions;
};

export type NexoraUiStateApplicationResult = {
  ok: boolean;
  appliedSections: string[];
  skippedSections: string[];
  warnings: string[];
  errors: string[];
  summary: string;
};

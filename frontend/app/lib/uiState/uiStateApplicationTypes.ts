import type { SceneJson } from "../sceneTypes";
import type { NexoraExecutionResult } from "../execution/actionExecutionTypes";
import type { UnifiedSceneReaction } from "../scene/unifiedReaction";
import type { WorkspaceMsg } from "../workspace/workspacePersistence";
import type { ResolvedObjectDetails } from "../scene/composeResolvedObjectDetails";

export type NexoraUiReadableState = {
  rightPanelTab?: string | null;
  activeInspectorReportTab?: string | null;
  inspectorOpen?: boolean;
  sceneJson?: SceneJson | null;
  selectedObjectId?: string | null;
  focusedId?: string | null;
  focusMode?: "all" | "selected";
  focusPinned?: boolean;
  messages?: WorkspaceMsg[];
  memory?: unknown;
  responseData?: unknown | null;
};

export type NexoraUiStateAdapters = {
  openRightPanel?: (tab: string) => void;
  setRightPanelTab?: (tab: string) => void;
  setActiveInspectorReportTab?: (tab: string | null) => void;
  setInspectorOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;

  setSceneJson?: (scene: SceneJson | null | ((prev: SceneJson | null) => SceneJson | null)) => void;
  setSceneWarn?: (value: string | null) => void;
  setNoSceneUpdate?: (value: boolean) => void;
  setLastActions?: (value: unknown[] | ((prev: unknown[]) => unknown[])) => void;

  setFocusedId?: (id: string | null) => void;
  setSelectedObjectIdState?: (id: string | null) => void;
  setFocusMode?: (mode: "all" | "selected") => void;
  setFocusPinned?: (value: boolean) => void;
  setPinnedSafe?: (value: boolean, id: string | null) => void;
  applyFocusModeToStore?: (mode: "all" | "selected" | "pinned") => void;
  applyPinToStore?: (pinned: boolean, id: string | null) => void;

  setMessages?: (value: WorkspaceMsg[] | ((prev: WorkspaceMsg[]) => WorkspaceMsg[])) => void;
  setResponseData?: (value: unknown | null) => void;
  setLastAnalysisSummary?: (value: string | null) => void;
  setSourceLabel?: (value: string | null) => void;

  setObjectSelection?: (value: unknown | null) => void;
  setMemoryInsights?: (value: unknown | null) => void;
  setRiskPropagation?: (value: unknown | null) => void;
  setStrategicAdvice?: (value: unknown | null) => void;
  setStrategyKpi?: (value: unknown | null) => void;
  setDecisionCockpit?: (value: unknown | null) => void;
  setProductModeContext?: (value: unknown | null) => void;
  setAiReasoning?: (value: unknown | null) => void;
  setPlatformAssembly?: (value: unknown | null) => void;
  setAutonomousExploration?: (value: unknown | null) => void;
  setOpponentModel?: (value: unknown | null) => void;
  setStrategicPatterns?: (value: unknown | null) => void;
  setConflicts?: (value: unknown[] | null) => void;
  setKpi?: (value: unknown | null) => void;
  setLoops?: (value: unknown[]) => void;
  setActiveLoopId?: (value: string | null) => void;
  setLoopSuggestions?: (value: unknown[] | ((prev: unknown[]) => unknown[])) => void;
  setProductModeId?: (value: string) => void;

  setSelectedObjectInfo?: (value: ResolvedObjectDetails | null) => void;
  updateSelectedObjectInfo?: (id: string | null) => void;
  setObjectProfiles?: (value: unknown) => void;
  setObjectUxById?: (value: unknown) => void;

  setAlert?: (value: unknown | null) => void;
  setReplayError?: (value: string | null) => void;
  setHealthInfo?: (value: string | null) => void;

  applyUnifiedReaction?: (
    reaction: UnifiedSceneReaction,
    options?: { sceneReplacement?: SceneJson | null; allowSceneReplacement?: boolean }
  ) => void;
  applyProductFlowViewModel?: (
    payload: unknown,
    viewModel: unknown,
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

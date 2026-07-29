/**
 * O4:5 — Runtime deps shape for `createChatPipelineSendText`.
 * Values are supplied by HomeScreen `useMemo`; asserted once at destructuring.
 */
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import type { ChatRequestLifecycleStatus } from "../../../lib/chat/chatRequestLifecycle.ts";
import type { DecisionAction } from "../../../lib/decision/decisionRouter.ts";
import type { FirstMeaningfulState } from "../../homeScreenResponseReaders.ts";
import type { UnifiedSceneReaction } from "../../../lib/scene/unifiedReaction.ts";
import type { SceneJson } from "../../../lib/sceneTypes.ts";
import type { Msg, ScenePrefs } from "../../homeScreenUtils.ts";
import type { EmitChatPipelineDiagnosticFn } from "./useChatPipelineController.types.ts";

/** Callable surface for the send-text deps bag (single assertion site in controller). */
export type ChatPipelineSendTextRuntimeDeps = Readonly<{
  activeChatDebugCorrelationRef: MutableRefObject<string | null>;
  activeChatRequestRef: MutableRefObject<{
    seq: number;
    controller: AbortController;
    timeoutId: number;
    timedOut: boolean;
  } | null>;
  activeDomainExperience: { experience: { domainId: string } };
  activeLoopIdStore: string | null | undefined;
  activeMode: string;
  activePanelFamilyAuditRef: MutableRefObject<{
    seq: number;
    prompt: string;
    expectedFamily: string | null | undefined;
    source: string;
  } | null>;
  activeSidePanel: string;
  analyzeFull: (input: { episodeId: string; text: string }) => Promise<{ episode_id?: string } | null | undefined>;
  analyzeInFlightRef: MutableRefObject<boolean>;
  analyzePreflightArmedRef: MutableRefObject<boolean>;
  analyzeSelectionLockRef: MutableRefObject<{
    objectId: string;
    startedAt: number;
    requestId: string | null;
  } | null>;
  appendMessages: (messages: readonly Msg[], toAppend: readonly Msg[]) => Msg[];
  applyDecisionActions: (
    actions: DecisionAction[],
    deps: {
      setOverride?: (id: string, patch: { color?: string; scale?: number }) => void;
      updateObjectUx?: (id: string, patch: { opacity?: number; scale?: number }) => void;
    }
  ) => void;
  applyExecutionResultToUi: (result: unknown) => void;
  applyRetailTriggerEnhancement: (raw: unknown, text: string, sceneJson: SceneJson) => unknown;
  applySceneFromChat: (input: unknown) => {
    highlightedObjectIds: string[];
  };
  applyUICommands: (cmds: unknown[]) => void;
  buildChatEffectSignature: (input: unknown) => string;
  buildChatRequestPayload: (text: string) => unknown;
  buildFailureResponse: () => { insight: string; recommended_panel: string };
  buildPersistedProjectSnapshot: (input: {
    activeMode: string;
    sceneJson: SceneJson;
    messages: Msg[];
  }) => unknown;
  buildStarterSceneFromText: (text: string) => SceneJson;
  buildUnifiedReactionFromChatResponse: (
    data: unknown,
    options: unknown
  ) => UnifiedSceneReaction | null;
  buildUnifiedReactionFromRetailTriggerConfig: (
    config: unknown,
    sceneJson: SceneJson
  ) => UnifiedSceneReaction | null;
  chatLoopGuardActiveRef: MutableRefObject<boolean>;
  chatLoopGuardDepthRef: MutableRefObject<number>;
  chatRequestSeqRef: MutableRefObject<number>;
  chatToBackendLifecycle: (payload: unknown, options: { signal: AbortSignal }) => Promise<unknown>;
  clearAllOverridesRef: MutableRefObject<(() => void) | undefined>;
  demoFlowPauseRef: MutableRefObject<() => void>;
  deriveProductFlowViewModel: (data: unknown, sceneJson: SceneJson) => {
    nextSceneJson?: unknown;
    nextObjectSelection?: unknown;
    nextMemoryInsights?: unknown;
    nextRiskPropagation?: unknown;
    nextStrategicAdvice?: unknown;
    nextStrategyKpi?: unknown;
    nextDecisionCockpit?: unknown;
    nextProductModeContext?: { mode_id?: string | null } | null;
    nextAiReasoning?: unknown;
    nextPlatformAssembly?: unknown;
    nextAutonomousExploration?: unknown;
    nextOpponentModel?: unknown;
    nextStrategicPatterns?: unknown;
    nextConflicts?: unknown;
    nextKpi?: unknown;
    nextLoops?: unknown;
    nextActiveLoop?: string | null;
    nextLoopSuggestions?: unknown;
  };
  deriveVisualPatch: (memory: unknown, targetId: string) => { scale?: number; opacity?: number } | null | undefined;
  detectRetailTriggerConfig: (text: string) => unknown;
  emitChatResult: (text: string, ok: boolean, requestId?: string) => void;
  emitDebugEvent: (event: unknown) => void;
  emitGuardRailAlerts: (alerts: unknown) => void;
  entryFlowStateRef: MutableRefObject<string>;
  environmentConfig: unknown;
  episodeId: string;
  evaluateChatPipelineStability: (input: unknown) => {
    reason: string;
    shouldOpenPanel: boolean;
    shouldApplyScene: boolean;
    signature: string;
  };
  evaluateSelectedObjectGuard: (input: unknown) => {
    blocked: boolean;
    reason: string;
    assistantMessage: string;
  };
  executeNexoraAction: (input: unknown) => Promise<{
    ok: boolean;
    executionSummary?: string;
    executedSteps?: unknown;
    shouldOpenPanel?: boolean;
    shouldUpdateInspector?: boolean;
    preferredPanel?: string | null;
    preferredInspectorTab?: string | null;
    appliedSceneMutation?: string;
    allowSceneMutation?: boolean;
    unifiedReaction?: unknown;
    sceneReplacement?: unknown;
    scenePatch?: unknown;
    errors?: string[];
    warnings?: string[];
    localDecisionPayload?: { assistantReply: string; actions: DecisionAction[] };
    backendPayload?: unknown;
    chatReply?: string;
    highlightedObjectIds?: string[];
    focusedObjectId?: string | null;
  }>;
  finalizeChatRequest: (
    requestSeq: number,
    status: ChatRequestLifecycleStatus,
    options?: { clearInput?: boolean }
  ) => void;
  firstMeaningfulState: FirstMeaningfulState;
  focusModeStore: string;
  focusedId: string | null | undefined;
  getAnalyzeLockedObjectId: () => string | null;
  getChatLifecycleErrorMessage: (error: unknown, timedOut: boolean) => string;
  getHighlightedObjectIdsFromSelection: (selection: unknown) => string[];
  getLocalChatResponse: (text: string) => string | null | undefined;
  getRecentDebugEvents: () => unknown[];
  hasMeaningfulSceneMutation: (data: unknown, sceneJson: SceneJson) => boolean;
  isAbortLikeError: (error: unknown) => boolean;
  isAnalyzeLikeUserText: (text: string) => boolean;
  isLatestChatRequest: (requestSeq: number) => boolean;
  isMeaningfulPanel: (view: string | null) => boolean;
  isPilotProductMode: boolean;
  isRetailDemoScene: (sceneJson: SceneJson) => boolean;
  isRetailScenePayload: (data: unknown, sceneJson: SceneJson) => boolean;
  isSendingRef: MutableRefObject<boolean>;
  lastAppliedChatPipelineSignatureRef: MutableRefObject<string | null>;
  lastAppliedPanelEffectRef: MutableRefObject<{ signature: string; at: number } | null>;
  lastAppliedSceneEffectRef: MutableRefObject<{ signature: string; at: number } | null>;
  lastChatDedupRef: MutableRefObject<{ text: string; at: number } | null>;
  latestChatPipelineRunIdRef: MutableRefObject<string | null>;
  logPanelGuidedPromptWarn: (input: unknown) => void;
  loopGuardInFlightByTextRef: MutableRefObject<Map<string, number>>;
  makeMsg: (
    role: Msg["role"],
    text: string,
    meta?: Record<string, unknown>
  ) => Msg;
  mapNexoraTargetPanelToRightPanelView: (panel: string) => string | null | undefined;
  markUserStartedFlow: (source: string) => void;
  memory: unknown;
  mergeNextObjectSelectionFromUnifiedReaction: (reaction: unknown, next: unknown) => unknown;
  messagesRef: MutableRefObject<Msg[]>;
  nextDemoFlowSequence: (ref: MutableRefObject<number>) => number;
  normalizeChatInputForDedup: (text: string) => string;
  normalizeSceneJson: (raw: unknown) => SceneJson;
  objectProfiles: Record<string, unknown>;
  objectSelection: unknown;
  overridesRef: MutableRefObject<Record<string, { scale?: number } | undefined>>;
  panelFamilyDataFromExecutionPayloads: (backend: unknown, local: unknown) => unknown;
  passiveDeselectGuardUntilRef: MutableRefObject<number>;
  pendingPanelFamilyAuditClearTimeoutRef: MutableRefObject<number | null>;
  pendingVisualPatchesRef: MutableRefObject<{ memory: unknown; targets: string[] } | null>;
  pickAcceptedChatSceneReplacement: (input: unknown) => SceneJson | null;
  pinnedId: string | null | undefined;
  prefs: ScenePrefs;
  productModeContext: Record<string, unknown> | null;
  pruneOverridesRef: MutableRefObject<((validIds: string[]) => void) | undefined>;
  pulseObjectByText: (text: string) => void;
  pushHistory: (snapshot: unknown) => void;
  reactionModeHintFromIntent: (intent: string) => unknown;
  readPanelFamilySliceDiagnostics: (
    expectedFamily: string | null,
    payload: unknown
  ) => { familyPresent: boolean; payloadShape: string };
  resolveChatPipelinePanelOpen: (token: string) => string | null | undefined;
  resolveExplicitSelectedObject: (input: unknown) => {
    explicitSelectedObjectId: string | null;
    hasExplicitSelection: boolean;
    reason?: string | null;
  };
  resolveNexoraIntentRoute: (input: unknown) => {
    intent: string;
    explanation: string;
    preferredPanel?: string | null;
    confidence: number;
    target?: string | null;
    shouldCallBackend: boolean;
    shouldRunScanner: boolean;
    shouldRunSimulation: boolean;
    shouldGenerateAdvice: boolean;
    shouldAffectPanels: boolean;
    shouldAffectScene: boolean;
    sceneMutation?: string;
    primaryObjectId?: string | null;
  };
  resolvePreferredPanelFamilyFromIntent: (
    preferredPanel: string | null | undefined,
    source: string
  ) => { requestedView: string | null; expectedFamily: string | null | undefined };
  rightPanelRouteLockRef: MutableRefObject<{
    view: string;
    contextId: string;
    reason: string;
  } | null>;
  rightPanelState: { view?: string | null; contextId?: string | null };
  routeChatInput: (text: string, context: unknown) => { assistantReply: string; actions: DecisionAction[] };
  runGuardChecks: (input: unknown, events: unknown[]) => unknown;
  runNexoraChatPromptPipeline: (input: unknown) => Promise<{
    intent: string;
    routing: { target_panel: string; target_engine: string };
    coreResponse: {
      recommended_panel: string;
      confidence: number;
      insight: string;
      actions: Array<{ title: string }>;
    };
  }>;
  saveProject: (snapshot: unknown) => void;
  sceneJson: SceneJson;
  selectedIdRef: MutableRefObject<string | null>;
  selectedObjectIdState: string | null;
  selectedObjectInfo: { label?: string } | null | undefined;
  setActiveMode: Dispatch<SetStateAction<string>>;
  setActiveSidePanel: Dispatch<SetStateAction<string>>;
  setCameraLockedByUser: Dispatch<SetStateAction<boolean>>;
  setCenterComponent: Dispatch<SetStateAction<unknown>>;
  setCenterComponentVisible: Dispatch<SetStateAction<boolean>>;
  setCenterOverlay: Dispatch<SetStateAction<unknown>>;
  setChatDelayedBusy: Dispatch<SetStateAction<boolean>>;
  setChatRequestStatus: Dispatch<SetStateAction<ChatRequestLifecycleStatus>>;
  setEntryFlowState: Dispatch<SetStateAction<string>>;
  setEpisodeId: Dispatch<SetStateAction<string>>;
  setLastActions: Dispatch<SetStateAction<unknown[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMemory: Dispatch<SetStateAction<unknown>>;
  setMessages: Dispatch<SetStateAction<Msg[]>>;
  setNoSceneUpdate: Dispatch<SetStateAction<boolean>>;
  setObjectSelection: (value: unknown) => void;
  setOverrideRef: MutableRefObject<
    ((id: string, patch: { scale?: number; opacity?: number; color?: string }) => void) | undefined
  >;
  setPrefs: Dispatch<SetStateAction<ScenePrefs>>;
  setSceneWarn: Dispatch<SetStateAction<string | null>>;
  setSelectedObjectIdState: Dispatch<SetStateAction<string | null>>;
  setSourceLabel: Dispatch<SetStateAction<string | null>>;
  shouldAcceptIncomingSceneReplacement: (
    data: unknown,
    sceneJson: SceneJson,
    incoming: SceneJson | null
  ) => boolean;
  shouldApplyExecutionResultImmediately: (input: { hasLocalActions: boolean; hasBackendPayload: boolean }) => boolean;
  traceAnalyzeObjectRoute: (input: unknown) => void;
  traceAuditRef: (action: string, detail: unknown) => void;
  traceDemoFlowEvent: (input: unknown) => void;
  tracePanelFamilyAudit: (label: string, detail: unknown) => void;
  tracePanelFlowRuntime: (phase: string, detail?: unknown) => void;
  updateMemory: (
    prev: unknown,
    input: {
      now: number;
      focusedObjectId: string | undefined;
      activeLoopId?: string;
      actions: DecisionAction[];
      text: string;
      mode: string;
    }
  ) => unknown;
  updateObjectUx: (id: string, patch: { opacity?: number; scale?: number }) => void;
  userSafeChatMessage: (message: string) => string;
  writeChatPipelineDebug: (patch: unknown) => void;
  emitChatPipelineDiagnostic?: EmitChatPipelineDiagnosticFn;
}>;
#!/usr/bin/env python3
"""Generate chatPipelineSendTextLifecycle.ts from _sendTextFragment.txt + dependency key list."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRAG = ROOT / "_sendTextFragment.txt"
OUT = ROOT / "chatPipelineSendTextLifecycle.ts"

DEPS_ARRAY = """
activeExecutiveObjectId
activeMode
activeDomainExperience
activeSidePanel
episodeId
focusMode
focusModeStore
focusedId
focusPinned
pinnedId
activeLoopIdStore
loading
objectProfiles
prefs
productModeContext
rightPanelTab
selectedObjectIdState
applyTypeCChatIntent
applyExecutionResultToUi
applyProductFlowViewModel
applyUICommands
buildChatRequestPayload
deriveProductFlowViewModel
sceneJson
emitChatResult
applyRetailTriggerEnhancement
applyUnifiedSceneReactionUpstreamDedup
pulseObjectByText
updateSelectedObjectInfo
updateObjectUx
finalizeChatRequest
isLatestChatRequest
isPilotProductMode
objectSelection
requestPanelAuthorityOpen
writeChatPipelineDebug
""".split()

EXTRA = [
    "markUserStartedFlow",
    "normalizeChatInputForDedup",
    "makeMsg",
    "appendMessages",
    "messagesRef",
    "setMessages",
    "saveProject",
    "pushHistory",
    "buildPersistedProjectSnapshot",
    "buildStarterSceneFromText",
    "applySceneChangeUpstreamDedup",
    "setObjectSelection",
    "setSelectedObjectIdState",
    "setEntryFlowState",
    "setCenterOverlay",
    "setCenterComponent",
    "setCenterComponentVisible",
    "lastChatDedupRef",
    "loopGuardInFlightByTextRef",
    "chatLoopGuardDepthRef",
    "chatLoopGuardActiveRef",
    "demoFlowPauseRef",
    "activeChatRequestRef",
    "chatRequestSeqRef",
    "latestChatPipelineRunIdRef",
    "activeChatDebugCorrelationRef",
    "isSendingRef",
    "setChatRequestStatus",
    "setLoading",
    "setChatDelayedBusy",
    "setCameraLockedByUser",
    "setNoSceneUpdate",
    "setSourceLabel",
    "setPrefs",
    "setEpisodeId",
    "setActiveMode",
    "setActiveSidePanel",
    "setSceneWarn",
    "setLastActions",
    "setMemory",
    "setOverrideRef",
    "clearAllOverridesRef",
    "pruneOverridesRef",
    "entryFlowStateRef",
    "selectedIdRef",
    "overridesRef",
    "pendingVisualPatchesRef",
    "analyzeInFlightRef",
    "analyzePreflightArmedRef",
    "analyzeSelectionLockRef",
    "passiveDeselectGuardUntilRef",
    "rightPanelRouteLockRef",
    "lastAppliedChatPipelineSignatureRef",
    "lastAppliedPanelEffectRef",
    "lastAppliedSceneEffectRef",
    "activePanelFamilyAuditRef",
    "pendingPanelFamilyAuditClearTimeoutRef",
    "nextDemoFlowSequence",
    "chatToBackendLifecycle",
    "routeChatInput",
    "executeNexoraAction",
    "resolveNexoraIntentRoute",
    "runNexoraChatPromptPipeline",
    "getHighlightedObjectIdsFromSelection",
    "resolveExplicitSelectedObject",
    "getAnalyzeLockedObjectId",
    "getLocalChatResponse",
    "applyDecisionActions",
    "updateMemory",
    "deriveVisualPatch",
    "applySceneFromChat",
    "evaluateChatPipelineStability",
    "evaluateSelectedObjectGuard",
    "resolveChatPipelinePanelOpen",
    "mapNexoraTargetPanelToRightPanelView",
    "resolvePreferredPanelFamilyFromIntent",
    "logPanelGuidedPromptWarn",
    "panelFamilyDataFromExecutionPayloads",
    "readPanelFamilySliceDiagnostics",
    "shouldApplyExecutionResultImmediately",
    "mergeNextObjectSelectionFromUnifiedReaction",
    "pickAcceptedChatSceneReplacement",
    "reactionModeHintFromIntent",
    "buildChatEffectSignature",
    "buildFailureResponse",
    "buildUnifiedReactionFromChatResponse",
    "buildUnifiedReactionFromRetailTriggerConfig",
    "detectRetailTriggerConfig",
    "isRetailScenePayload",
    "isRetailDemoScene",
    "normalizeSceneJson",
    "hasMeaningfulSceneMutation",
    "shouldAcceptIncomingSceneReplacement",
    "emitDebugEvent",
    "emitGuardRailAlerts",
    "getRecentDebugEvents",
    "runGuardChecks",
    "traceDemoFlowEvent",
    "tracePanelFlowRuntime",
    "tracePanelFamilyAudit",
    "traceAuditRef",
    "traceAnalyzeObjectRoute",
    "memory",
    "environmentConfig",
    "rightPanelState",
    "selectedObjectInfo",
    "firstMeaningfulState",
    "analyzeFull",
    "visibleResponseData",
    "visibleStrategicAdvice",
    "visibleDecisionCockpit",
    "visibleRiskPropagation",
    "visibleSceneJson",
    "visibleSelectedObjectId",
    "visibleFocusedId",
    "visibleObjectSelection",
    "isMeaningfulPanel",
    "isAnalyzeLikeUserText",
    "isAbortLikeError",
    "getChatLifecycleErrorMessage",
    "userSafeChatMessage",
]

ALLOW = {x.strip() for x in DEPS_ARRAY if x.strip()}
ALLOW.update(EXTRA)
# Body uses upstream dedupe; dependency array historically listed the wrong symbol name.
if "applyUnifiedSceneReaction" in ALLOW:
    ALLOW.remove("applyUnifiedSceneReaction")
ALLOW.add("applyUnifiedSceneReactionUpstreamDedup")

keys = sorted(ALLOW)
destructure = "  const {\n" + ",\n".join(f"    {k}" for k in keys) + ",\n  } = deps as any;\n\n"

fragment = FRAG.read_text(encoding="utf-8")

header = '''// O4:5 — Core `sendText` request lifecycle (verbatim extraction from HomeScreen).
// HomeScreen supplies a fresh `deps` snapshot via `useMemo`; this module stays free of React.

import { chatToBackendLifecycle } from "../../../lib/api/chatApi.ts";
import { analyzeFull } from "../../../lib/api/analyzeApi.ts";
import {
  DEFAULT_CHAT_REQUEST_TIMEOUT_MS,
  getChatLifecycleErrorMessage,
  isAbortLikeError,
  mapNexoraTargetPanelToRightPanelView,
  runNexoraChatPromptPipeline,
  type ChatRequestLifecycleStatus,
} from "../../../lib/chat/chatRequestLifecycle.ts";
import { buildFailureResponse } from "../../../lib/chat/nexoraChatPromptSystem.ts";
import {
  evaluateChatPipelineStability,
  isMeaningfulPanel,
} from "../../../lib/chat/chatPipelineStability.ts";
import { evaluateSelectedObjectGuard } from "../../../lib/chat/selectedObjectGuard.ts";
import { resolveExplicitSelectedObject } from "../../../lib/selection/explicitSelectedObjectContract.ts";
import { getLocalChatResponse, userSafeChatMessage } from "../../../lib/chat/localChatFallback.ts";
import { clamp, parseSizeCommand, parseSelectedSizeCommand } from "../../../lib/sizeCommands.ts";
import type { UICommand } from "../../../lib/ui/uiCommands.ts";
import type { SceneJson, SceneObject } from "../../../lib/sceneTypes.ts";
import { routeChatInput } from "../../../lib/decision/decisionRouter.ts";
import { executeNexoraAction } from "../../../lib/execution/actionExecutionLayer.ts";
import { resolveNexoraIntentRoute } from "../../../lib/router/intentRouter.ts";
import { FAST_CHAT_THRESHOLD_MS } from "../../../components/assistant/LeftCommandAssistant.tsx";
import {
  nextDemoFlowSequence,
  shouldApplyExecutionResultImmediately,
  traceDemoFlowEvent,
} from "../../../lib/demo/demoFlowOrchestrator.ts";
import { applyDecisionActions } from "../../../lib/decision/applyDecisionActions.ts";
import { deriveVisualPatch, updateMemory } from "../../../lib/memory/decisionMemory.ts";
import {
  appendMessages,
  makeMsg,
  MEMORY_KEY,
  normalizeSceneJson,
  pushHistory,
  saveProject,
} from "../../homeScreenUtils.ts";
import { buildPersistedProjectSnapshot } from "../../homeScreenPersistenceApply.ts";
import {
  getHighlightedObjectIdsFromSelection,
  hasMeaningfulSceneMutation,
  readPanelFamilySliceDiagnostics,
  shouldAcceptIncomingSceneReplacement,
} from "../../homeScreenResponseReaders.ts";
import {
  buildUnifiedReactionFromRetailTriggerConfig,
  detectRetailTriggerConfig,
  isRetailDemoScene,
  isRetailScenePayload,
} from "../../homeScreenRetailDemo.ts";
import {
  logPanelGuidedPromptWarn,
  panelFamilyDataFromExecutionPayloads,
  resolvePreferredPanelFamilyFromIntent,
} from "../../homeScreenPanelHelpers.ts";
import {
  mergeNextObjectSelectionFromUnifiedReaction,
  pickAcceptedChatSceneReplacement,
  reactionModeHintFromIntent,
} from "../../homeScreenChatApplyPrep.ts";
import { resolveChatPipelinePanelOpen } from "../../../lib/ui/right-panel/rightPanelRouter.ts";
import { applySceneFromChat } from "../../../lib/scene/sceneApplyContract.ts";
import { emitDebugEvent } from "../../../lib/debug/debugEmit.ts";
import { getRecentDebugEvents } from "../../../lib/debug/debugEventStore.ts";
import { emitGuardRailAlerts, runGuardChecks } from "../../../lib/debug/debugGuardRails.ts";
import type { SendTextOptions } from "./useChatPipelineController.types.ts";
import { buildChatEffectSignature, normalizeChatInputForDedup } from "./chatPipelineSendTextHelpers.ts";

const NEXORA_PANEL_DEPRECATION_DEBUG = true;

const NEXORA_PIPELINE_USER_FAILURE = "System couldn't complete analysis. Please try again.";

type BackendChatResponse = {
  ok?: boolean;
  reply?: string;
  active_mode?: string;
  source?: string | null;
  scene_json?: unknown;
  actions?: unknown;
  analysis_summary?: string | null;
  error?: { message?: string } | null;
  episode_id?: string;
  [key: string]: unknown;
};

export type ChatPipelineSendTextDeps = Readonly<Record<string, unknown>>;

export function createChatPipelineSendText(deps: ChatPipelineSendTextDeps) {
  return async (textRaw: string, requestId?: string | undefined, options?: SendTextOptions | undefined): Promise<void> => {
    const text = textRaw.trim();
    if (!text) return;

'''

footer = """
  };
}
"""

# Fix duplicate import path for getHighlightedObjectIdsFromSelection - it's in homeScreenResponseReaders already with other imports - merge one import block

OUT.write_text(header + destructure + fragment + footer, encoding="utf-8")
print(f"Wrote {OUT} ({len(OUT.read_text(encoding='utf-8').splitlines())} lines)")

import { useCallback, useMemo, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";

import {
  DEFAULT_CHAT_REQUEST_TIMEOUT_MS,
  type ChatRequestLifecycleStatus,
} from "../../../lib/chat/chatRequestLifecycle.ts";
import { FAST_CHAT_THRESHOLD_MS } from "../../../components/assistant/LeftCommandAssistant.tsx";
import { parseSelectedSizeCommand, parseSizeCommand } from "../../../lib/sizeCommands.ts";
import type { UICommand } from "../../../lib/ui/uiCommands.ts";
import type { SceneObject } from "../../../lib/sceneTypes.ts";
import { appendMessages, MEMORY_KEY, type Msg, type ScenePrefs } from "../../homeScreenUtils.ts";
import { normalizeChatInputForDedup } from "./chatPipelineSendTextHelpers.ts";

import {
  CHAT_PIPELINE_CONTROLLER_EXTRACTION_PLAN,
  type ChatPipelineBridgeCallbacks,
  type ChatPipelineControllerCallbacks,
  type ChatPipelineControllerRefs,
  type ChatPipelineControllerState,
  type ChatPipelineDiagnosticEventName,
  type ChatPipelineDiagnosticPayload,
  type ChatPipelineMessage,
  type ChatSendInput,
  type ChatPipelineSendTextDeps,
  type EmitChatPipelineDiagnosticFn,
  type SendTextOptions,
  type UseChatPipelineControllerContract,
} from "./useChatPipelineController.types.ts";
import type { PanelAuthorityOpenRequest } from "../right-panel/useRightPanelController.types.ts";

// ---- O4:5 `sendText` lifecycle (verbatim from HomeScreen; O4:7 bridges, O4:8 diagnostics). O4:10 regression-verified. ----
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
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

let lastChatBridgeDispatchDiagKey = "";
let lastChatBridgeDispatchDiagAt = 0;

function emitChatBridgeDispatchDiag(payload: {
  runId: string;
  bridgeTarget: "scene" | "panel" | "typec";
  action: string;
  success: boolean;
  skippedReason: string | null;
  intent: string | null;
  targetPanel: string | null;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const now = Date.now();
  const dedupeKey = `${payload.bridgeTarget}|${payload.action}|${String(payload.success)}|${payload.skippedReason}|${payload.runId}|${payload.intent ?? ""}|${payload.targetPanel ?? ""}`;
  if (dedupeKey === lastChatBridgeDispatchDiagKey && now - lastChatBridgeDispatchDiagAt < 250) {
    return;
  }
  lastChatBridgeDispatchDiagKey = dedupeKey;
  lastChatBridgeDispatchDiagAt = now;
  if (!payload.success) {
    globalThis.console.warn("[Nexora][ChatPipeline][BridgeDispatch]", payload);
    return;
  }
  globalThis.console.debug("[Nexora][ChatPipeline][BridgeDispatch]", payload);
}

function dispatchChatSceneBridge(
  bridges: ChatPipelineBridgeCallbacks | null | undefined,
  diag: { runId: string; intent?: string | undefined; targetPanel?: string | undefined },
  spec:
    | {
        action: "applySceneChangeUpstreamDedup";
        nextOrUpdater: unknown;
        source: string;
        options?: { bypassDedupe?: boolean };
      }
    | {
        action: "applyUnifiedSceneReactionUpstreamDedup";
        reaction: unknown;
        options: { allowSceneReplacement: boolean; sceneReplacement?: unknown | null };
      },
): boolean {
  const b = bridges ?? {};
  if (spec.action === "applySceneChangeUpstreamDedup") {
    const fn = b.applySceneChangeUpstreamDedup;
    if (!fn) {
      emitChatBridgeDispatchDiag({
        runId: diag.runId,
        bridgeTarget: "scene",
        action: spec.action,
        success: false,
        skippedReason: "missing_bridge",
        intent: diag.intent ?? null,
        targetPanel: diag.targetPanel ?? null,
      });
      return false;
    }
    fn(spec.nextOrUpdater, spec.source, spec.options);
    emitChatBridgeDispatchDiag({
      runId: diag.runId,
      bridgeTarget: "scene",
      action: spec.action,
      success: true,
      skippedReason: null,
      intent: diag.intent ?? null,
      targetPanel: diag.targetPanel ?? null,
    });
    return true;
  }
  const fn = b.applyUnifiedSceneReactionUpstreamDedup;
  if (!fn) {
    emitChatBridgeDispatchDiag({
      runId: diag.runId,
      bridgeTarget: "scene",
      action: spec.action,
      success: false,
      skippedReason: "missing_bridge",
      intent: diag.intent ?? null,
      targetPanel: diag.targetPanel ?? null,
    });
    return false;
  }
  fn(spec.reaction, spec.options);
  emitChatBridgeDispatchDiag({
    runId: diag.runId,
    bridgeTarget: "scene",
    action: spec.action,
    success: true,
    skippedReason: null,
    intent: diag.intent ?? null,
    targetPanel: diag.targetPanel ?? null,
  });
  return true;
}

function dispatchChatPanelBridge(
  bridges: ChatPipelineBridgeCallbacks | null | undefined,
  diag: { runId: string; intent?: string | undefined; targetPanel?: string | undefined },
  request: PanelAuthorityOpenRequest,
): boolean {
  const fn = bridges?.requestPanelAuthorityOpen;
  const action = "requestPanelAuthorityOpen";
  if (!fn) {
    emitChatBridgeDispatchDiag({
      runId: diag.runId,
      bridgeTarget: "panel",
      action,
      success: false,
      skippedReason: "missing_bridge",
      intent: diag.intent ?? null,
      targetPanel: diag.targetPanel ?? request.view ?? null,
    });
    return false;
  }
  fn(request);
  emitChatBridgeDispatchDiag({
    runId: diag.runId,
    bridgeTarget: "panel",
    action,
    success: true,
    skippedReason: null,
    intent: diag.intent ?? null,
    targetPanel: diag.targetPanel ?? request.view ?? null,
  });
  return true;
}

function dispatchChatTypeCBridge(
  bridges: ChatPipelineBridgeCallbacks | null | undefined,
  diag: { runId: string; intent?: string | undefined; targetPanel?: string | undefined },
  userText: string,
): boolean {
  const fn = bridges?.applyTypeCChatIntent;
  if (!fn) {
    emitChatBridgeDispatchDiag({
      runId: diag.runId,
      bridgeTarget: "typec",
      action: "applyTypeCChatIntent",
      success: false,
      skippedReason: "missing_bridge",
      intent: diag.intent ?? null,
      targetPanel: diag.targetPanel ?? null,
    });
    return false;
  }
  const handled = fn(userText);
  emitChatBridgeDispatchDiag({
    runId: diag.runId,
    bridgeTarget: "typec",
    action: "applyTypeCChatIntent",
    success: true,
    skippedReason: null,
    intent: diag.intent ?? null,
    targetPanel: diag.targetPanel ?? null,
  });
  return handled;
}

function createChatPipelineSendText(
  deps: ChatPipelineSendTextDeps,
  bridges: ChatPipelineBridgeCallbacks | null | undefined,
) {
  return async (textRaw: string, requestId?: string | undefined, options?: SendTextOptions | undefined): Promise<void> => {
    const text = textRaw.trim();
    if (!text) return;

  const {
    activeChatDebugCorrelationRef,
    activeChatRequestRef,
    activeDomainExperience,
    activeExecutiveObjectId,
    activeLoopIdStore,
    activeMode,
    activePanelFamilyAuditRef,
    activeSidePanel,
    analyzeFull,
    analyzeInFlightRef,
    analyzePreflightArmedRef,
    analyzeSelectionLockRef,
    appendMessages,
    applyDecisionActions,
    applyExecutionResultToUi,
    applyProductFlowViewModel,
    applyRetailTriggerEnhancement,
    applySceneFromChat,
    applyUICommands,
    buildChatEffectSignature,
    buildChatRequestPayload,
    buildFailureResponse,
    buildPersistedProjectSnapshot,
    buildStarterSceneFromText,
    buildUnifiedReactionFromChatResponse,
    buildUnifiedReactionFromRetailTriggerConfig,
    chatLoopGuardActiveRef,
    chatLoopGuardDepthRef,
    chatRequestSeqRef,
    chatToBackendLifecycle,
    clearAllOverridesRef,
    demoFlowPauseRef,
    deriveProductFlowViewModel,
    deriveVisualPatch,
    detectRetailTriggerConfig,
    emitChatResult,
    emitDebugEvent,
    emitGuardRailAlerts,
    entryFlowStateRef,
    environmentConfig,
    episodeId,
    evaluateChatPipelineStability,
    evaluateSelectedObjectGuard,
    executeNexoraAction,
    finalizeChatRequest,
    firstMeaningfulState,
    focusMode,
    focusModeStore,
    focusPinned,
    focusedId,
    getAnalyzeLockedObjectId,
    getChatLifecycleErrorMessage,
    getHighlightedObjectIdsFromSelection,
    getLocalChatResponse,
    getRecentDebugEvents,
    hasMeaningfulSceneMutation,
    isAbortLikeError,
    isAnalyzeLikeUserText,
    isLatestChatRequest,
    isMeaningfulPanel,
    isPilotProductMode,
    isRetailDemoScene,
    isRetailScenePayload,
    isSendingRef,
    lastAppliedChatPipelineSignatureRef,
    lastAppliedPanelEffectRef,
    lastAppliedSceneEffectRef,
    lastChatDedupRef,
    latestChatPipelineRunIdRef,
    loading,
    logPanelGuidedPromptWarn,
    loopGuardInFlightByTextRef,
    makeMsg,
    mapNexoraTargetPanelToRightPanelView,
    markUserStartedFlow,
    memory,
    mergeNextObjectSelectionFromUnifiedReaction,
    messagesRef,
    nextDemoFlowSequence,
    normalizeChatInputForDedup,
    normalizeSceneJson,
    objectProfiles,
    objectSelection,
    overridesRef,
    panelFamilyDataFromExecutionPayloads,
    passiveDeselectGuardUntilRef,
    pendingPanelFamilyAuditClearTimeoutRef,
    pendingVisualPatchesRef,
    pickAcceptedChatSceneReplacement,
    pinnedId,
    prefs,
    productModeContext,
    pruneOverridesRef,
    pulseObjectByText,
    pushHistory,
    reactionModeHintFromIntent,
    readPanelFamilySliceDiagnostics,
    resolveChatPipelinePanelOpen,
    resolveExplicitSelectedObject,
    resolveNexoraIntentRoute,
    resolvePreferredPanelFamilyFromIntent,
    rightPanelRouteLockRef,
    rightPanelState,
    rightPanelTab,
    routeChatInput,
    runGuardChecks,
    runNexoraChatPromptPipeline,
    saveProject,
    sceneJson,
    selectedIdRef,
    selectedObjectIdState,
    selectedObjectInfo,
    setActiveMode,
    setActiveSidePanel,
    setCameraLockedByUser,
    setCenterComponent,
    setCenterComponentVisible,
    setCenterOverlay,
    setChatDelayedBusy,
    setChatRequestStatus,
    setEntryFlowState,
    setEpisodeId,
    setLastActions,
    setLoading,
    setMemory,
    setMessages,
    setNoSceneUpdate,
    setObjectSelection,
    setOverrideRef,
    setPrefs,
    setSceneWarn,
    setSelectedObjectIdState,
    setSourceLabel,
    shouldAcceptIncomingSceneReplacement,
    shouldApplyExecutionResultImmediately,
    traceAnalyzeObjectRoute,
    traceAuditRef,
    traceDemoFlowEvent,
    tracePanelFamilyAudit,
    tracePanelFlowRuntime,
    updateMemory,
    updateObjectUx,
    updateSelectedObjectInfo,
    userSafeChatMessage,
    visibleDecisionCockpit,
    visibleFocusedId,
    visibleObjectSelection,
    visibleResponseData,
    visibleRiskPropagation,
    visibleSceneJson,
    visibleSelectedObjectId,
    visibleStrategicAdvice,
    writeChatPipelineDebug,
  } = deps as any;

    const emitChatPipelineDiagnostic: EmitChatPipelineDiagnosticFn =
      typeof (deps as any).emitChatPipelineDiagnostic === "function"
        ? ((deps as any).emitChatPipelineDiagnostic as EmitChatPipelineDiagnosticFn)
        : ((_event: ChatPipelineDiagnosticEventName, _payload: ChatPipelineDiagnosticPayload) => {});

    markUserStartedFlow("chat_message");
    const preRunBridgeRunId = latestChatPipelineRunIdRef.current ?? "pre-run";
    const handledTypeCChatIntent = dispatchChatTypeCBridge(bridges, { runId: preRunBridgeRunId }, text);
    const isDescribePhase = entryFlowStateRef.current === "describing_system";
    const hasSceneObjects = Array.isArray(sceneJson?.scene?.objects) && sceneJson.scene.objects.length > 0;
    if (isDescribePhase && !handledTypeCChatIntent) {
      const starterScene = buildStarterSceneFromText(text);
      dispatchChatSceneBridge(
        bridges,
        { runId: preRunBridgeRunId, intent: "describe_system", targetPanel: undefined },
        {
          action: "applySceneChangeUpstreamDedup",
          nextOrUpdater: starterScene,
          source: "describe_system",
          options: { bypassDedupe: true },
        }
      );
      setObjectSelection({
        highlighted_objects: ["delivery"],
        highlighted_ids: ["delivery"],
        dim_unrelated_objects: false,
      } as any);
      setSelectedObjectIdState("delivery");
      setEntryFlowState("objects_created");
      setCenterOverlay(null);
      setCenterComponent(null);
      setCenterComponentVisible(false);
      dispatchChatPanelBridge(
        bridges,
        { runId: preRunBridgeRunId, intent: "describe_system", targetPanel: "object" },
        {
          view: "object",
          source: "manual_user_nav",
          reason: "describe_system_objects_created",
          contextId: "delivery",
          forceOpen: true,
        }
      );
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", "I created a starter system map. Select an object and run Analyze.");
      const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(nextMessages);
      emitChatResult(assistantMsg.text, true, requestId);
      saveProject(
        buildPersistedProjectSnapshot({
          activeMode,
          sceneJson: starterScene,
          messages: nextMessages,
        })
      );
      pushHistory(
        buildPersistedProjectSnapshot({
          activeMode,
          sceneJson: starterScene,
          messages: nextMessages,
        })
      );
      return;
    }
    if (!hasSceneObjects && options?.source !== "demo" && !handledTypeCChatIntent) {
      const starterScene = buildStarterSceneFromText(text);
      dispatchChatSceneBridge(
        bridges,
        { runId: preRunBridgeRunId, intent: "describe_system", targetPanel: undefined },
        {
          action: "applySceneChangeUpstreamDedup",
          nextOrUpdater: starterScene,
          source: "describe_system",
          options: { bypassDedupe: true },
        }
      );
      setObjectSelection({
        highlighted_objects: ["delivery"],
        highlighted_ids: ["delivery"],
        dim_unrelated_objects: false,
      } as any);
      setSelectedObjectIdState("delivery");
      setEntryFlowState("objects_created");
      dispatchChatPanelBridge(
        bridges,
        { runId: preRunBridgeRunId, intent: "describe_system", targetPanel: "object" },
        {
          view: "object",
          source: "manual_user_nav",
          reason: "chat_no_objects_starter_scene",
          contextId: "delivery",
          forceOpen: true,
        }
      );
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg(
        "assistant",
        "Got it. I'll build starter objects from this system description."
      );
      const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(nextMessages);
      emitChatResult(assistantMsg.text, true, requestId);
      const snapshot = buildPersistedProjectSnapshot({
        activeMode,
        sceneJson: starterScene,
        messages: nextMessages,
      });
      saveProject(snapshot);
      pushHistory(snapshot);
      return;
    }

    const normalizedText = normalizeChatInputForDedup(text);
    const lastDedup = lastChatDedupRef.current;
    const now = Date.now();
    if (lastDedup && lastDedup.text === normalizedText && now - lastDedup.at < 700) {
      emitChatPipelineDiagnostic("duplicate_prompt_skipped", {
        promptSignature: normalizedText,
        skippedReason: "deduped_rapid_duplicate",
        target: String(now - lastDedup.at),
      });
      writeChatPipelineDebug({
        loopGuard: {
          dedupedRapidDuplicate: true,
          lastReason: "deduped_rapid_duplicate",
          lastAt: now,
        },
      });
      return;
    }
    lastChatDedupRef.current = {
      text: normalizedText,
      at: now,
    };

    if ((loopGuardInFlightByTextRef.current.get(normalizedText) ?? 0) > 0) {
      emitChatPipelineDiagnostic("send_skipped", {
        promptSignature: normalizedText,
        skippedReason: "skipped_reentrant_same_text",
      });
      writeChatPipelineDebug({
        loopGuard: {
          skippedReentrantRun: true,
          lastReason: "skipped_reentrant_same_text",
          lastAt: Date.now(),
        },
      });
      return;
    }

    try {
      const prevInflight = loopGuardInFlightByTextRef.current.get(normalizedText) ?? 0;
      loopGuardInFlightByTextRef.current.set(normalizedText, prevInflight + 1);
      chatLoopGuardDepthRef.current += 1;
      chatLoopGuardActiveRef.current = true;
      emitChatPipelineDiagnostic("request_started", {
        promptSignature: normalizedText,
        skippedReason: "loop_guard_enter",
        intent: String(chatLoopGuardDepthRef.current),
      });

      const runSendTextLifecycle = async () => {
    const isAnalyzeCommand = /analyze[_\s-]*system|analyze the current system/i.test(text);
    const analyzeHl = getHighlightedObjectIdsFromSelection(objectSelection);
    const explicitSelection = resolveExplicitSelectedObject({
      selectedObjectIdState,
      objectSelection,
    });
    const lockedAnalyzeObjectId = isAnalyzeCommand ? getAnalyzeLockedObjectId() : null;
    const stableAnalyzeObjectId = explicitSelection.explicitSelectedObjectId ?? lockedAnalyzeObjectId;
    const routeExecutiveObjectOnSuccess = isAnalyzeCommand && explicitSelection.hasExplicitSelection;
    if (isAnalyzeCommand) {
      if (!explicitSelection.hasExplicitSelection) {
        emitChatPipelineDiagnostic("send_skipped", {
          promptSignature: normalizeChatInputForDedup(text),
          skippedReason: "analyze_blocked_mvp_object_first",
        });
        return;
      }
      const objectId = explicitSelection.explicitSelectedObjectId;
      if (objectId) {
        analyzeSelectionLockRef.current = {
          objectId,
          startedAt: Date.now(),
          requestId: requestId ?? null,
        };
        emitChatPipelineDiagnostic("request_started", {
          skippedReason: "analyze_selection_lock_armed",
          target: objectId,
        });
        writeChatPipelineDebug({
          analyzeSelectionLock: {
            active: true,
            objectId,
            lastReason: "armed",
          },
        });
      }
    }
    if (isAnalyzeCommand && analyzeInFlightRef.current && !analyzePreflightArmedRef.current) {
      return;
    }
    if (isAnalyzeCommand) {
      analyzeInFlightRef.current = true;
      analyzePreflightArmedRef.current = false;
    }
    if (options?.source !== "demo") {
      demoFlowPauseRef.current();
    }
    if (activeChatRequestRef.current) {
      window.clearTimeout(activeChatRequestRef.current.timeoutId);
      activeChatRequestRef.current.controller.abort();
    }
    const requestSeq = nextDemoFlowSequence(chatRequestSeqRef);
    const runId = `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    latestChatPipelineRunIdRef.current = runId;
    writeChatPipelineDebug({
      runId,
      userInput: text,
      lifecycleStatus: "submitting",
      staleSkipped: false,
    });
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      const active = activeChatRequestRef.current;
      if (!active || active.seq !== requestSeq) return;
      active.timedOut = true;
      controller.abort();
    }, DEFAULT_CHAT_REQUEST_TIMEOUT_MS);
    activeChatRequestRef.current = {
      seq: requestSeq,
      controller,
      timeoutId,
      timedOut: false,
    };
    const chatCorrelationId = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    activeChatDebugCorrelationRef.current = chatCorrelationId;
    emitDebugEvent({
      type: "chat_submitted",
      layer: "chat",
      source: "HomeScreen",
      status: "info",
      message: "Chat message submitted",
      metadata: {
        textLength: text.length,
        source: options?.source ?? "user",
        requestId: requestId ?? null,
        requestSeq,
        mode: activeMode,
        domain: activeDomainExperience.experience.domainId,
      },
      correlationId: chatCorrelationId,
    });
    const finishLocalChatDebug = (path: string, extra?: Record<string, unknown>) => {
      emitDebugEvent({
        type: "chat_local_shortcut",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: `Local chat path: ${path}`,
        metadata: {
          path,
          requestSeq,
          skippedMainPipeline: true,
          skippedBackend: true,
          ...extra,
        },
        correlationId: chatCorrelationId,
      });
      emitDebugEvent({
        type: "chat_response_completed",
        layer: "chat",
        source: "HomeScreen",
        status: "ok",
        message: "Chat turn finished (local handler)",
        metadata: { path, requestSeq, localShortcut: true, ...extra },
        correlationId: chatCorrelationId,
      });
      emitGuardRailAlerts(
        runGuardChecks(
          { trigger: "chat_response", chat: { chatCorrelationId }, correlationId: chatCorrelationId },
          getRecentDebugEvents()
        )
      );
      if (activeChatDebugCorrelationRef.current === chatCorrelationId) {
        activeChatDebugCorrelationRef.current = null;
      }
    };
    traceDemoFlowEvent({
      phase: "started",
      source: options?.source ?? "chat",
      seq: requestSeq,
      requestId,
      detail: { textLength: text.length },
    });
    isSendingRef.current = true;
    setChatRequestStatus("submitting");
    emitChatPipelineDiagnostic("send_requested", {
      runId,
      requestSeq,
      skippedReason: "phase:submit_start",
      targetPanel: rightPanelState.view ?? null,
      source: options?.source ?? "user",
    });
    pulseObjectByText(text);
    let lifecycleStatus: ChatRequestLifecycleStatus = "submitting";
    let shouldClearInput = false;

    if (/\bfocus\b/i.test(text)) {
      const candidateId = selectedIdRef.current ?? selectedObjectIdState ?? null;
      const cmds: UICommand[] = [];
      if (candidateId) cmds.push({ type: "select", id: candidateId });
      cmds.push({ type: "toast", message: "Focus applied" });
      applyUICommands(cmds);
    }

    // Handle selected-object size commands first (no backend call)
    try {
      const hasSelectedKeyword = /\bselected\b/i.test(text);
      const selectedId = selectedIdRef.current;
      if (hasSelectedKeyword) {
        if (!selectedId) {
          const reply = "⚠️ No object selected. Click an object first.";
          const userMsg = makeMsg("user", text);
          const assistantMsg = makeMsg("assistant", reply);
          const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
          setMessages(nextMessages);
          emitChatResult(reply, true, requestId);
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const snapshot = buildPersistedProjectSnapshot({
            activeMode,
            sceneJson,
            messages: nextMessages,
          });
          saveProject(snapshot);
          pushHistory(snapshot);
          lifecycleStatus = "success";
          shouldClearInput = true;
          finishLocalChatDebug("selected_size_no_selection");
          return;
        }

        const cur = overridesRef.current[selectedId]?.scale ?? 1;
        const sel = parseSelectedSizeCommand(text, cur);
        if (sel.handled) {
          const userMsg = makeMsg("user", text);
          const assistantMsg = makeMsg("assistant", sel.reply);
          const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
          setMessages(nextMessages);
          emitChatResult(sel.reply, true, requestId);
          // apply override
          setOverrideRef.current(selectedId, { scale: sel.nextScale });
          setNoSceneUpdate(false);
          setSourceLabel(null);
          const snapshot = buildPersistedProjectSnapshot({
            activeMode,
            sceneJson,
            messages: nextMessages,
          });
          saveProject(snapshot);
          pushHistory(snapshot);
          lifecycleStatus = "success";
          shouldClearInput = true;
          finishLocalChatDebug("selected_size_command");
          return;
        }
      }
    } catch (err) {
      // fall through to normal flow on any error
    }

    // Global size commands handled next
    const sizeResult = parseSizeCommand(text, prefs.globalScale);
    if (sizeResult.handled) {
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", sizeResult.reply);
      const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(nextMessages);
      emitChatResult(sizeResult.reply, true, requestId);
      setPrefs((prev: ScenePrefs) => ({ ...prev, globalScale: sizeResult.nextScale }));
      setNoSceneUpdate(false);
      setSourceLabel(null);
      const snapshot = buildPersistedProjectSnapshot({
        activeMode,
        sceneJson,
        messages: nextMessages,
      });
      saveProject(snapshot);
      pushHistory(snapshot);
      lifecycleStatus = "success";
      shouldClearInput = true;
      finishLocalChatDebug("global_size_command");
      return;
    }

    if (options?.source !== "demo") {
      const localResponse = getLocalChatResponse(text);
      if (localResponse) {
        const userMsg = makeMsg("user", text);
        const assistantMsg = makeMsg("assistant", localResponse);
        const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
        setMessages(nextMessages);
        emitChatResult(localResponse, true, requestId);
        setNoSceneUpdate(false);
        setSourceLabel(null);
        const snapshot = buildPersistedProjectSnapshot({
          activeMode,
          sceneJson,
          messages: nextMessages,
        });
        saveProject(snapshot);
        pushHistory(snapshot);
        lifecycleStatus = "success";
        shouldClearInput = true;
        finishLocalChatDebug("local_chat_fallback");
        finalizeChatRequest(requestSeq, "success", { clearInput: true });
        return;
      }
    }

    // Decision router (deterministic, local)
    // IMPORTANT: Only handle locally when there are actual deterministic actions to apply.
    // Otherwise, fall through to the backend so the chat remains useful.
    const focusedObjectId: string | undefined =
      focusModeStore === "pinned" ? (pinnedId ?? undefined) : (focusedId ?? undefined);

    const availableSceneObjectIds = Array.isArray(sceneJson?.scene?.objects)
      ? sceneJson.scene.objects
          .map((obj: SceneObject, idx: number) => String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`))
          .filter(Boolean)
      : [];

    const intentRoute = resolveNexoraIntentRoute({
      text,
      activeMode,
      activeDomain: activeDomainExperience.experience.domainId,
      currentRightPanelTab: rightPanelState.view,
      selectedObjectId: selectedObjectIdState,
      availableSceneObjectIds,
      sceneJson,
      objectProfiles: objectProfiles as Record<string, unknown>,
      productModeContext: productModeContext as Record<string, unknown> | null,
    });
    emitChatPipelineDiagnostic("routing_resolved", {
      runId,
      intent: intentRoute.intent,
      targetPanel: intentRoute.preferredPanel ?? null,
      skippedReason: "explicit_selection",
      target: explicitSelection.reason ?? null,
    });
    writeChatPipelineDebug({
      explicitSelection: {
        explicitSelectedObjectId: explicitSelection.explicitSelectedObjectId,
        hasExplicitSelection: explicitSelection.hasExplicitSelection,
        reason: explicitSelection.reason,
      },
    });
    if (isAnalyzeLikeUserText(text) && !explicitSelection.hasExplicitSelection) {
      const guardReason = "analysis_requires_selected_object";
      const assistantMessage = "Select an object first so I can analyze the right surface.";
      emitChatPipelineDiagnostic("send_skipped", {
        runId,
        requestSeq,
        intent: intentRoute.intent,
        targetPanel: intentRoute.preferredPanel ?? null,
        skippedReason: guardReason,
      });
      if (!isMeaningfulPanel(rightPanelState.view ?? null)) {
        dispatchChatPanelBridge(
          bridges,
          {
            runId,
            intent: intentRoute.intent,
            targetPanel: intentRoute.preferredPanel ?? undefined,
          },
          {
            view: "workspace",
            family: "SCN",
            source: "chat",
            contextId: null,
            reason: "selected_object_required",
            forceOpen: true,
          }
        );
      }
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", assistantMessage, {
        confidence: 0.2,
        guard: guardReason,
      });
      const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(nextMessages);
      emitChatResult(assistantMessage, true, requestId);
      setNoSceneUpdate(false);
      setSourceLabel(null);
      const snapshot = buildPersistedProjectSnapshot({
        activeMode,
        sceneJson,
        messages: nextMessages,
      });
      saveProject(snapshot);
      pushHistory(snapshot);
      lifecycleStatus = "success";
      shouldClearInput = true;
      finishLocalChatDebug("selected_object_guard_pre_route", { reason: guardReason });
      writeChatPipelineDebug({
        selectedObjectGuard: {
          blocked: true,
          reason: guardReason,
          selectedObjectId: null,
          intent: intentRoute.intent,
          targetPanel: intentRoute.preferredPanel ?? null,
          assistantMessage,
        },
        signature: `guard::${guardReason}`,
        sceneSignature: `guard::${guardReason}`,
        lifecycleStatus: "success",
        sceneReactionApplied: false,
        lastCompletedAt: Date.now(),
      });
      finalizeChatRequest(requestSeq, "success", { clearInput: true });
      return;
    }
    const promptPipeline = await runNexoraChatPromptPipeline({
      userInput: text,
      context: {
        selectedObjectId: selectedObjectIdState ?? null,
        focusedObjectId: focusedId ?? null,
        rightPanelContextId: rightPanelState.contextId ?? null,
      },
      engines: {
        runExplainEngine: () => ({
          explanation: intentRoute.explanation,
          related_panel: intentRoute.preferredPanel ?? "dashboard",
        }),
        runAnalysisEngine: () => ({
          insight: intentRoute.explanation,
          options: [],
          recommended: "Review panel context and commit next step.",
          confidence: intentRoute.confidence,
        }),
        runDecisionEngine: () => ({
          insight: intentRoute.explanation,
          options: [],
          recommended: "Choose the lowest-risk option with highest confidence.",
          confidence: intentRoute.confidence,
        }),
        runContextBuilder: () => ({
          missing: ["context_id"],
          questions:
            selectedObjectIdState || focusedId
              ? ["Which objective should this decision optimize first?"]
              : ["Which object or loop should this analysis focus on?"],
        }),
      },
    });
    emitChatPipelineDiagnostic("routing_resolved", {
      runId,
      intent: promptPipeline.intent,
      targetPanel: promptPipeline.routing.target_panel,
      promptSignature: normalizeChatInputForDedup(text),
    });
    const pipelinePanelToken = promptPipeline.coreResponse.recommended_panel || promptPipeline.routing.target_panel;
    const pipelinePanelView =
      resolveChatPipelinePanelOpen(pipelinePanelToken) ??
      mapNexoraTargetPanelToRightPanelView(promptPipeline.routing.target_panel);
    const pipelinePanelFamily =
      pipelinePanelToken === "RSK"
        ? "RSK"
        : pipelinePanelToken === "SIM_TIMELINE" || pipelinePanelToken === "SIM_WAR_ROOM"
          ? "SIM"
          : pipelinePanelToken === "SCN"
            ? "SCN"
            : "EXE";
    const stability = evaluateChatPipelineStability({
      runId,
      intent: promptPipeline.intent,
      targetPanel: pipelinePanelToken,
      confidence: promptPipeline.coreResponse.confidence,
      userInput: text,
      currentPanel: rightPanelState.view ?? null,
      lastAppliedSignature: lastAppliedChatPipelineSignatureRef.current,
    });
    emitChatPipelineDiagnostic("routing_resolved", {
      runId,
      intent: promptPipeline.intent,
      targetPanel: pipelinePanelToken,
      skippedReason: stability.reason,
    });
    writeChatPipelineDebug({
      runId,
      intent: promptPipeline.intent,
      targetPanel: pipelinePanelToken,
      confidence: promptPipeline.coreResponse.confidence,
      stabilityReason: stability.reason,
      shouldOpenPanel: stability.shouldOpenPanel,
      shouldApplyScene: stability.shouldApplyScene,
      panelView: pipelinePanelView ?? null,
      message: promptPipeline.coreResponse.insight,
    });
    if (latestChatPipelineRunIdRef.current !== runId) {
      emitChatPipelineDiagnostic("stale_response_ignored", {
        runId,
        activeRunId: latestChatPipelineRunIdRef.current,
        skippedReason: "prompt_pipeline_stale_run",
      });
      writeChatPipelineDebug({
        runId,
        staleSkipped: true,
        lifecycleStatus: "stale_ignored",
      });
      return;
    }

    const selectedGuard = evaluateSelectedObjectGuard({
      intent: promptPipeline.intent,
      userInput: text,
      selectedObjectId: stableAnalyzeObjectId,
    });

    if (selectedGuard.blocked) {
      emitChatPipelineDiagnostic("send_skipped", {
        runId,
        requestSeq,
        intent: promptPipeline.intent,
        targetPanel: promptPipeline.routing.target_panel,
        skippedReason: selectedGuard.reason,
      });
      if (!isMeaningfulPanel(rightPanelState.view ?? null)) {
        dispatchChatPanelBridge(
          bridges,
          {
            runId,
            intent: promptPipeline.intent,
            targetPanel: promptPipeline.routing.target_panel,
          },
          {
            view: "workspace",
            family: "SCN",
            source: "chat",
            contextId: stableAnalyzeObjectId,
            reason: "selected_object_required",
            forceOpen: true,
          }
        );
      }
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg("assistant", selectedGuard.assistantMessage, {
        confidence: 0.2,
        guard: selectedGuard.reason,
      });
      const nextMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(nextMessages);
      emitChatResult(selectedGuard.assistantMessage, true, requestId);
      setNoSceneUpdate(false);
      setSourceLabel(null);
      const snapshot = buildPersistedProjectSnapshot({
        activeMode,
        sceneJson,
        messages: nextMessages,
      });
      saveProject(snapshot);
      pushHistory(snapshot);
      lifecycleStatus = "success";
      shouldClearInput = true;
      finishLocalChatDebug("selected_object_guard", { reason: selectedGuard.reason });
      writeChatPipelineDebug({
        selectedObjectGuard: {
          blocked: true,
          reason: selectedGuard.reason,
          selectedObjectId: stableAnalyzeObjectId,
          intent: promptPipeline.intent,
          targetPanel: promptPipeline.routing.target_panel,
          assistantMessage: selectedGuard.assistantMessage,
        },
        signature: stability.signature,
        sceneSignature: stability.signature,
        lifecycleStatus: "success",
        sceneReactionApplied: false,
        lastCompletedAt: Date.now(),
      });
      finalizeChatRequest(requestSeq, "success", { clearInput: true });
      return;
    }

    writeChatPipelineDebug({
      selectedObjectGuard: {
        blocked: false,
        reason: selectedGuard.reason,
        selectedObjectId: stableAnalyzeObjectId,
        intent: promptPipeline.intent,
        targetPanel: promptPipeline.routing.target_panel,
      },
    });

    const effectNow = Date.now();
    if (pipelinePanelView && !routeExecutiveObjectOnSuccess && stability.shouldOpenPanel) {
      const panelEffectSignature = `${promptPipeline.intent}::${pipelinePanelToken}`;
      const lastPanelEffect = lastAppliedPanelEffectRef.current;
      if (
        lastPanelEffect &&
        lastPanelEffect.signature === panelEffectSignature &&
        effectNow - lastPanelEffect.at < 2000
      ) {
        emitChatPipelineDiagnostic("send_skipped", {
          runId,
          intent: promptPipeline.intent,
          skippedReason: "panel_idempotent_ttl",
          assistantSignature: panelEffectSignature,
        });
        writeChatPipelineDebug({
          idempotency: {
            panelSkipped: true,
            lastPanelSignature: panelEffectSignature,
            lastReason: "panel_idempotent_ttl",
          },
        });
      } else {
        dispatchChatPanelBridge(
          bridges,
          {
            runId,
            intent: promptPipeline.intent,
            targetPanel: pipelinePanelToken,
          },
          {
            view: pipelinePanelView,
            family: pipelinePanelFamily,
            source: "chat",
            contextId: stableAnalyzeObjectId ?? rightPanelState.contextId ?? null,
            reason: "chat_prompt_pipeline",
            forceOpen: true,
          }
        );
        lastAppliedPanelEffectRef.current = {
          signature: panelEffectSignature,
          at: effectNow,
        };
        writeChatPipelineDebug({
          idempotency: {
            panelSkipped: false,
            lastPanelSignature: panelEffectSignature,
            lastReason: "panel_applied",
          },
        });
      }
    }

    const pipelineSceneReaction = applySceneFromChat({
      insight: promptPipeline.coreResponse.insight,
      actions: promptPipeline.coreResponse.actions,
      intent: promptPipeline.intent,
      routing: promptPipeline.routing,
      candidateObjectIds: [
        explicitSelection.explicitSelectedObjectId ?? "",
      ].filter(Boolean),
    });
    const pipelineSceneLineSignature = [
      promptPipeline.intent,
      promptPipeline.routing.target_engine,
      promptPipeline.routing.target_panel,
      pipelineSceneReaction.highlightedObjectIds.join(","),
    ].join("::");
    const sceneEffectSignature = buildChatEffectSignature({
      intent: promptPipeline.intent,
      targetPanel: pipelinePanelToken,
      sceneSignature: pipelineSceneLineSignature,
      userInput: text,
    });
    let sceneReactionAppliedThisTurn = false;
    if (
      latestChatPipelineRunIdRef.current === runId &&
      stability.shouldApplyScene &&
      pipelineSceneReaction.highlightedObjectIds.length > 0
    ) {
      const lastSceneEffect = lastAppliedSceneEffectRef.current;
      if (
        lastSceneEffect &&
        lastSceneEffect.signature === sceneEffectSignature &&
        effectNow - lastSceneEffect.at < 3000
      ) {
        emitChatPipelineDiagnostic("send_skipped", {
          runId,
          intent: promptPipeline.intent,
          skippedReason: "scene_idempotent_ttl",
          assistantSignature: sceneEffectSignature,
        });
        writeChatPipelineDebug({
          idempotency: {
            sceneSkipped: true,
            lastSceneSignature: sceneEffectSignature,
            lastReason: "scene_idempotent_ttl",
          },
        });
      } else {
        dispatchChatSceneBridge(
          bridges,
          {
            runId,
            intent: promptPipeline.intent,
            targetPanel: pipelinePanelToken,
          },
          {
            action: "applyUnifiedSceneReactionUpstreamDedup",
            reaction: pipelineSceneReaction,
            options: {
              allowSceneReplacement: false,
              sceneReplacement: null,
            },
          }
        );
        lastAppliedSceneEffectRef.current = {
          signature: sceneEffectSignature,
          at: effectNow,
        };
        sceneReactionAppliedThisTurn = true;
        writeChatPipelineDebug({
          idempotency: {
            sceneSkipped: false,
            lastSceneSignature: sceneEffectSignature,
            lastReason: "scene_applied",
          },
        });
      }
    }
    if (latestChatPipelineRunIdRef.current === runId) {
      lastAppliedChatPipelineSignatureRef.current = stability.signature;
      writeChatPipelineDebug({
        runId,
        signature: stability.signature,
        sceneSignature: pipelineSceneLineSignature,
        sceneReactionApplied: sceneReactionAppliedThisTurn,
      });
    }

      emitChatPipelineDiagnostic("routing_resolved", {
        runId,
        intent: intentRoute.intent,
        targetPanel: intentRoute.preferredPanel ?? null,
        skippedReason: "intent_router_post_pipeline",
      });

      const { requestedView, expectedFamily } = resolvePreferredPanelFamilyFromIntent(
        intentRoute.preferredPanel,
        "action_intent"
      );
      if (requestedView && !routeExecutiveObjectOnSuccess && !pipelinePanelView) {
        const instantPanelSig = `${promptPipeline.intent}::${requestedView}`;
        const lastInstantPanel = lastAppliedPanelEffectRef.current;
        const instantNow = Date.now();
        if (
          lastInstantPanel &&
          lastInstantPanel.signature === instantPanelSig &&
          instantNow - lastInstantPanel.at < 2000
        ) {
          emitChatPipelineDiagnostic("send_skipped", {
            runId,
            intent: promptPipeline.intent,
            skippedReason: "panel_idempotent_ttl_instant",
            assistantSignature: instantPanelSig,
          });
          writeChatPipelineDebug({
            idempotency: {
              panelSkipped: true,
              lastPanelSignature: instantPanelSig,
              lastReason: "panel_idempotent_ttl_instant",
            },
          });
        } else {
          dispatchChatPanelBridge(
            bridges,
            {
              runId,
              intent: promptPipeline.intent,
              targetPanel: requestedView,
            },
            {
              view: requestedView,
              family:
                requestedView === "dashboard" || requestedView === "strategic_command" || requestedView === "executive_object"
                  ? "EXE"
                  : requestedView === "risk" || requestedView === "fragility" || requestedView === "explanation"
                    ? "RSK"
                    : requestedView === "workspace" || requestedView === "object" || requestedView === "object_focus"
                      ? "SCN"
                      : "SIM",
              source: "chat",
              contextId: selectedObjectIdState ?? null,
              reason: "chat_submit_instant_open",
              forceOpen: true,
            }
          );
          lastAppliedPanelEffectRef.current = {
            signature: instantPanelSig,
            at: instantNow,
          };
          writeChatPipelineDebug({
            idempotency: {
              panelSkipped: false,
              lastPanelSignature: instantPanelSig,
              lastReason: "panel_applied_instant",
            },
          });
        }
        if (NEXORA_PANEL_DEPRECATION_DEBUG) {
          emitChatPipelineDiagnostic("routing_resolved", {
            runId,
            intent: "chat_instant_open",
            targetPanel: requestedView,
            skippedReason: "panel_deprecation_debug",
            source: options?.source ?? "user",
          });
        }
      }
      if (requestedView === null && options?.guidedPrompt) {
        logPanelGuidedPromptWarn({
          phase: "skipped_empty_view",
          rawView: intentRoute.preferredPanel ?? null,
          source: options?.source ?? "user",
          prompt: options.guidedPrompt.prompt ?? text,
        });
      }
      if (pendingPanelFamilyAuditClearTimeoutRef.current !== null) {
        window.clearTimeout(pendingPanelFamilyAuditClearTimeoutRef.current);
        pendingPanelFamilyAuditClearTimeoutRef.current = null;
      }
      activePanelFamilyAuditRef.current = {
        seq: requestSeq,
        prompt: text,
        expectedFamily,
        source: options?.source ?? "user",
      };
      traceAuditRef("set", {
        source: options?.source ?? "user",
        seq: requestSeq,
        prompt: text,
        expectedFamily: expectedFamily ?? null,
        contractRenderable: false,
        contractSalvaged: false,
        reason: "chat_submit_expected_family",
      });
      tracePanelFlowRuntime("prompt_submitted");
      tracePanelFamilyAudit("[Nexora][PanelFamilyAudit] expected_family", {
        expectedFamily: expectedFamily ?? null,
        intent: intentRoute.intent,
        preferredPanel: intentRoute.preferredPanel ?? null,
      });
      tracePanelFlowRuntime("expected_family", {
        requestedView: expectedFamily ?? null,
      });

    emitDebugEvent({
      type: "chat_intent_detected",
      layer: "intent",
      source: "HomeScreen",
      status: "info",
      message: `Intent ${intentRoute.intent}`,
      metadata: {
        intent: intentRoute.intent,
        target: intentRoute.target ?? null,
        preferredPanel: intentRoute.preferredPanel ?? null,
        expectedFamily: expectedFamily ?? null,
        shouldCallBackend: intentRoute.shouldCallBackend,
        shouldRunScanner: intentRoute.shouldRunScanner,
        shouldRunSimulation: intentRoute.shouldRunSimulation,
        shouldGenerateAdvice: intentRoute.shouldGenerateAdvice,
        shouldAffectPanels: intentRoute.shouldAffectPanels,
        shouldAffectScene: intentRoute.shouldAffectScene,
        sceneMutation: intentRoute.sceneMutation,
        primaryObjectId: intentRoute.primaryObjectId ?? null,
        requestSeq,
      },
      correlationId: chatCorrelationId,
    });

    if (intentRoute.intent === "chat_general" && !intentRoute.primaryObjectId) {
    setNoSceneUpdate(false);
    setSourceLabel(null);
  }

    const shouldShowLoading =
      intentRoute.shouldCallBackend ||
      intentRoute.shouldRunScanner ||
      intentRoute.shouldRunSimulation ||
      intentRoute.shouldGenerateAdvice;

    let loadingDelayTimer: number | null = null;
    const chatBusyIndicatorTimer: number | null = window.setTimeout(() => {
      setChatDelayedBusy(true);
    }, FAST_CHAT_THRESHOLD_MS);

    try {
      if (shouldShowLoading) {
        loadingDelayTimer = window.setTimeout(() => {
          emitChatPipelineDiagnostic("request_started", {
            runId,
            requestSeq,
            skippedReason: "phase:loading_delay_fired",
            targetPanel: rightPanelState.view ?? null,
          });
          setLoading(true);
          setNoSceneUpdate(false);
          setSourceLabel(null);
          setCameraLockedByUser(false);
        }, FAST_CHAT_THRESHOLD_MS);
      }

      emitDebugEvent({
        type: "chat_request_started",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: "Chat execution pipeline started",
        metadata: {
          requestSeq,
          shouldShowLoading,
          shouldCallBackend: intentRoute.shouldCallBackend,
        },
        correlationId: chatCorrelationId,
      });
      await new Promise<void>((r) => queueMicrotask(() => r()));
      const executionResult = await executeNexoraAction({
      userText: text,
      route: intentRoute,
      activeMode,
      activeDomain: activeDomainExperience.experience.domainId,
      currentScene: sceneJson,
      currentRightPanelTab: rightPanelState.view,
      selectedObjectId: selectedObjectIdState,
      objectProfiles,
      productModeContext,
      memoryState: memory,
      environmentConfig,
      handlers: {
        runBackendChat: async (nextText: string) => {
          const payload = buildChatRequestPayload(nextText);

          emitChatPipelineDiagnostic("request_started", {
            runId,
            requestSeq,
            skippedReason: "debug_backend_chat_payload",
            messageCount: (() => {
              try {
                return JSON.stringify(payload).length;
              } catch {
                return -1;
              }
            })(),
          });

          const raw = await chatToBackendLifecycle(payload, { signal: controller.signal });
          emitChatPipelineDiagnostic("request_started", {
            runId,
            requestSeq,
            skippedReason: "debug_backend_chat_response",
            messageCount: (() => {
              try {
                return JSON.stringify(raw).length;
              } catch {
                return -1;
              }
            })(),
          });
          return raw;
        },
        runLocalDecisionRouter: (nextText: string) =>
          routeChatInput(nextText, {
            focusedObjectId,
            activeLoopId: activeLoopIdStore ?? undefined,
            focusMode: focusModeStore,
            pinnedLabel: selectedObjectInfo?.label ?? undefined,
          }),
      },
    });

    if (!isLatestChatRequest(requestSeq)) {
      emitChatPipelineDiagnostic("stale_response_ignored", {
        runId,
        requestSeq,
        activeRunId: latestChatPipelineRunIdRef.current,
        skippedReason: "execution_stale_request_seq",
      });
      traceDemoFlowEvent({
        phase: "stale_ignored",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
      });
      lifecycleStatus = "stale_ignored";
      return;
    }

    emitChatPipelineDiagnostic("request_completed", {
      runId,
      requestSeq,
      skippedReason: "action_execution",
      intent: executionResult.ok ? "ok" : "warn",
    });

    const routerResult = executionResult.localDecisionPayload;
    const hasLocalActions = Array.isArray(routerResult?.actions) && routerResult.actions.length > 0;
    const hasBackendPayload = Boolean(executionResult.backendPayload);
    const rawFamilyDiag = readPanelFamilySliceDiagnostics(
      activePanelFamilyAuditRef.current?.expectedFamily ?? null,
      panelFamilyDataFromExecutionPayloads(
        executionResult.backendPayload,
        executionResult.localDecisionPayload
      )
    );
    tracePanelFamilyAudit("[Nexora][PanelFamilyAudit] raw_payload_presence", {
      rawFamilyPresent: rawFamilyDiag.familyPresent,
      rawPayloadShape: rawFamilyDiag.payloadShape,
    });
    traceDemoFlowEvent({
      phase: "response_received",
      source: options?.source ?? "chat",
      seq: requestSeq,
      requestId,
      detail: {
        hasLocalActions,
        hasBackendPayload,
        allowSceneMutation: executionResult.allowSceneMutation,
      },
    });

    emitDebugEvent({
      type: "chat_action_extracted",
      layer: "intent",
      source: "HomeScreen",
      status: executionResult.ok ? "ok" : "warn",
      message: executionResult.executionSummary ?? "execution",
      metadata: {
        ok: executionResult.ok,
        executedSteps: executionResult.executedSteps,
        hasLocalActions,
        hasBackendPayload,
        shouldOpenPanel: executionResult.shouldOpenPanel,
        shouldUpdateInspector: executionResult.shouldUpdateInspector,
        preferredPanel: executionResult.preferredPanel ?? null,
        appliedSceneMutation: executionResult.appliedSceneMutation,
        allowSceneMutation: executionResult.allowSceneMutation,
        hasUnifiedReaction: Boolean(executionResult.unifiedReaction),
        hasSceneReplacement: Boolean(executionResult.sceneReplacement),
        hasScenePatch: Boolean(executionResult.scenePatch),
        errorCount: Array.isArray(executionResult.errors) ? executionResult.errors.length : 0,
        warningCount: Array.isArray(executionResult.warnings) ? executionResult.warnings.length : 0,
        requestSeq,
      },
      correlationId: chatCorrelationId,
    });

    if (executionResult.shouldOpenPanel || executionResult.preferredPanel) {
      emitDebugEvent({
        type: "chat_panel_request",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: "Chat result requests panel / inspector update",
        metadata: {
          shouldOpenPanel: executionResult.shouldOpenPanel,
          preferredPanel: executionResult.preferredPanel ?? null,
          preferredInspectorTab: executionResult.preferredInspectorTab ?? null,
          requestSeq,
        },
        correlationId: chatCorrelationId,
      });
    }

    const hasChatSceneRequest =
      executionResult.appliedSceneMutation !== "none" ||
      Boolean(executionResult.unifiedReaction) ||
      Boolean(executionResult.sceneReplacement) ||
      Boolean(executionResult.scenePatch);
    if (hasChatSceneRequest) {
      emitDebugEvent({
        type: "chat_scene_request",
        layer: "chat",
        source: "HomeScreen",
        status: "info",
        message: "Chat result includes scene mutation / reaction",
        metadata: {
          appliedSceneMutation: executionResult.appliedSceneMutation,
          hasUnifiedReaction: Boolean(executionResult.unifiedReaction),
          hasSceneReplacement: Boolean(executionResult.sceneReplacement),
          requestSeq,
        },
        correlationId: chatCorrelationId,
      });
    }

    if (
      shouldApplyExecutionResultImmediately({
        hasLocalActions,
        hasBackendPayload,
      })
    ) {
      applyExecutionResultToUi(executionResult);
      traceDemoFlowEvent({
        phase: "commit_applied",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
        detail: { mode: hasLocalActions ? "local_actions" : "fallback_reply" },
      });
    }

    if (hasLocalActions) {
      const userMsg = makeMsg("user", text);
      const assistantMsg = makeMsg(
        "assistant",
        promptPipeline.coreResponse.insight || routerResult.assistantReply,
        {
          confidence: promptPipeline.coreResponse.confidence,
          followUp: promptPipeline.coreResponse.actions.slice(0, 2).map((a: { title: string }) => a.title),
        }
      );
      const routedMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(routedMessages);
      emitChatResult(assistantMsg.text, true, requestId);

      applyDecisionActions(routerResult.actions, {
        setOverride: setOverrideRef.current,
        updateObjectUx,
      });

      // Update memory (pure) and persist. Any visual side-effects must be scheduled
      // AFTER React finishes the current update to avoid cross-component updates during render.
      setMemory((prev: unknown) => {
        const next = updateMemory(prev, {
          now: Date.now(),
          focusedObjectId,
          activeLoopId: activeLoopIdStore ?? undefined,
          actions: routerResult.actions,
          text,
          mode: activeMode,
        });

        try {
          window.localStorage.setItem(MEMORY_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        const targets = routerResult.actions
          .map((a: any) => (a && typeof (a as any).target === "string" ? (a as any).target : null))
          .filter((t: string | null): t is string => !!t);

        // Defer visual patches; applying overrides touches SceneStateProvider.
        pendingVisualPatchesRef.current = { memory: next, targets };

        return next;
      });

      // Apply derived visual patches on the next tick to avoid React warning:
      // "Cannot update a component while rendering a different component".
      window.setTimeout(() => {
        const pending = pendingVisualPatchesRef.current;
        if (!pending) return;
        pendingVisualPatchesRef.current = null;

        for (const targetId of pending.targets) {
          const patch = deriveVisualPatch(pending.memory, targetId);
          if (patch && (patch.scale !== undefined || patch.opacity !== undefined)) {
            setOverrideRef.current?.(targetId, patch);
          }
        }
      }, 0);

      lifecycleStatus = "success";
      shouldClearInput = true;
      return;
    }

    if (!executionResult.backendPayload) {
      const userMsg = makeMsg("user", text);
      const fallbackReply =
        promptPipeline.coreResponse.insight ??
        executionResult.chatReply ??
        executionResult.errors[0] ??
        executionResult.warnings[0] ??
        intentRoute.explanation;
      const assistantMsg = makeMsg("assistant", fallbackReply, {
        confidence: promptPipeline.coreResponse.confidence,
        followUp: promptPipeline.coreResponse.actions.slice(0, 2).map((a: { title: string }) => a.title),
      });
      const routedMessages = appendMessages(messagesRef.current, [userMsg, assistantMsg]);
      setMessages(routedMessages);
      emitChatResult(fallbackReply, executionResult.ok, requestId);
      setLastActions([]);
      lifecycleStatus = executionResult.ok ? "success" : "error";
      shouldClearInput = executionResult.ok;
      if (executionResult.ok && !hasLocalActions) {
        emitDebugEvent({
          type: "chat_noop_result",
          layer: "chat",
          source: "HomeScreen",
          status: "info",
          message: "No backend payload and no local actions (fallback reply only)",
          metadata: {
            requestSeq,
            hadPanelIntent: Boolean(executionResult.shouldOpenPanel || executionResult.preferredPanel),
            hadSceneIntent: hasChatSceneRequest,
          },
          correlationId: chatCorrelationId,
        });
      }
      return;
    }

    // No deterministic actions to apply locally → use backend for assistant reply.
      const raw = executionResult.backendPayload;
      const data = applyRetailTriggerEnhancement(raw, text, sceneJson) as BackendChatResponse;
      if (typeof data?.episode_id === "string" && data.episode_id.trim()) {
        setEpisodeId(data.episode_id);
      }
      if (!data || (data as any).ok === false || (data as any).error) {
        const rawMsg =
          ((data as any)?.error?.message as string | undefined) ??
          "Request failed; no changes applied.";
        const msg = userSafeChatMessage(rawMsg);
        setMessages((m: Msg[]) => appendMessages(m, [makeMsg("assistant", msg)]));
        emitChatResult(msg, false, requestId);
        setLastActions([]);
        lifecycleStatus = "error";
        emitDebugEvent({
          type: "chat_error",
          layer: "chat",
          source: "HomeScreen",
          status: "error",
          message: msg,
          metadata: { requestSeq, reason: "backend_response_error" },
          correlationId: chatCorrelationId,
        });
        return;
      }
      const userBackendMsg = makeMsg("user", text);
      const baseMessages = appendMessages(messagesRef.current, [userBackendMsg]);
      setMessages(baseMessages);
      const nextActiveMode: string =
        typeof (data as any)?.active_mode === "string" && (data as any).active_mode.trim().length
          ? (data as any).active_mode
          : activeMode;
      setActiveMode(nextActiveMode);
      const viewModel = deriveProductFlowViewModel(data, sceneJson);
      const shouldApplySceneMutation = hasMeaningfulSceneMutation(data, sceneJson);
      const incomingSceneJson = data.scene_json ? normalizeSceneJson(data.scene_json) : null;
      const viewModelSceneJson = viewModel?.nextSceneJson ? normalizeSceneJson(viewModel.nextSceneJson) : null;
      const shouldReplaceIncomingSceneFromChat = shouldAcceptIncomingSceneReplacement(
        data,
        sceneJson,
        incomingSceneJson
      );
      const shouldReplaceViewModelSceneFromChat = shouldAcceptIncomingSceneReplacement(
        data,
        sceneJson,
        viewModelSceneJson
      );

      const acceptedSceneForChatReplacement = pickAcceptedChatSceneReplacement({
        allowSceneMutation: executionResult.allowSceneMutation,
        viewModelSceneJson,
        incomingSceneJson,
        shouldReplaceViewModelSceneFromChat,
        shouldReplaceIncomingSceneFromChat,
      });

      if (acceptedSceneForChatReplacement) {
        try {
          const policy = prefs.overridePolicy ?? "match";
          if (policy === "clear") {
            clearAllOverridesRef.current?.();
          } else if (policy === "match") {
            const objsForPolicy: SceneObject[] = Array.isArray(acceptedSceneForChatReplacement?.scene?.objects)
              ? acceptedSceneForChatReplacement.scene.objects
              : [];
            const validIds = objsForPolicy.map((o: any, idx: number) => o.id ?? o.name ?? `${o.type ?? "obj"}:${idx}`);
            pruneOverridesRef.current?.(validIds);
          }
        } catch (e) {
          // ignore policy errors
        }
      } else if (incomingSceneJson || viewModelSceneJson) {
        setNoSceneUpdate(true);
      }
      const assistantReply =
        promptPipeline.coreResponse.insight ||
        (typeof data.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : executionResult.chatReply ??
            intentRoute.explanation ??
            `${firstMeaningfulState.headline}. Confidence: ${firstMeaningfulState.confidence}. ${firstMeaningfulState.evidenceLabel ?? "No live signal yet"}.`);
      const assistantMsg = makeMsg("assistant", assistantReply, {
        confidence: promptPipeline.coreResponse.confidence,
        followUp: promptPipeline.coreResponse.actions.slice(0, 2).map((a: { title: string }) => a.title),
      });
      const finalMessages = appendMessages(baseMessages, [assistantMsg]);
      setMessages(finalMessages);
      emitChatResult(assistantMsg.text, true, requestId);
      const nextActions = Array.isArray((data as any)?.actions) ? ((data as any).actions as any[]) : [];
      setLastActions(nextActions);
      if (nextActions.length === 0) {
        setLastActions(promptPipeline.coreResponse.actions);
      }
      const shouldApplySceneEffectsFromChat =
        executionResult.allowSceneMutation && executionResult.appliedSceneMutation !== "none";
      const retailChatTrigger = detectRetailTriggerConfig(text);
      const unifiedChatReaction =
        retailChatTrigger &&
        isRetailScenePayload(data, acceptedSceneForChatReplacement ?? sceneJson) &&
        isRetailDemoScene(acceptedSceneForChatReplacement ?? sceneJson)
          ? buildUnifiedReactionFromRetailTriggerConfig(
              retailChatTrigger,
              acceptedSceneForChatReplacement ?? sceneJson
            )
          : buildUnifiedReactionFromChatResponse(data, {
              acceptedSceneForChatReplacement,
              allowSceneEffects: shouldApplySceneEffectsFromChat,
              fallbackHighlightedObjectIds: executionResult.highlightedObjectIds,
              fallbackPrimaryObjectId: executionResult.focusedObjectId ?? intentRoute.primaryObjectId ?? null,
              reactionModeHint: reactionModeHintFromIntent(intentRoute.intent),
            });
      const analyzeSelectionHighlights = getHighlightedObjectIdsFromSelection(objectSelection);
      const hasSelectedObjectForAnalyze =
        (typeof selectedObjectIdState === "string" && selectedObjectIdState.trim().length > 0) ||
        (typeof focusedId === "string" && focusedId.trim().length > 0) ||
        analyzeSelectionHighlights.length > 0;
      const globalSceneAnalyze = isAnalyzeCommand && !hasSelectedObjectForAnalyze;
      const unifiedReactionForApply =
        globalSceneAnalyze && unifiedChatReaction
          ? {
              ...unifiedChatReaction,
              highlightedObjectIds: [],
              primaryObjectId: null,
              relatedObjectIds: [],
              riskSources: [],
              riskTargets: [],
              dimUnrelatedObjects: false,
              allowFocusMutation: false,
              reason: [unifiedChatReaction.reason, "Analyze the current system (global_scene_analysis)"]
                .filter((s) => typeof s === "string" && s.trim().length > 0)
                .join(" "),
            }
          : unifiedChatReaction;
      const nextObjectSelectionFromReaction = globalSceneAnalyze
        ? viewModel.nextObjectSelection
        : mergeNextObjectSelectionFromUnifiedReaction(unifiedChatReaction, viewModel.nextObjectSelection);
      const enrichedExecutionResult = {
        ...executionResult,
        chatReply: assistantMsg.text,
        backendPayload: data,
        highlightedObjectIds: globalSceneAnalyze
          ? []
          : Array.isArray(unifiedChatReaction?.highlightedObjectIds) && unifiedChatReaction.highlightedObjectIds.length > 0
            ? unifiedChatReaction.highlightedObjectIds
            : executionResult.highlightedObjectIds,
        focusedObjectId: globalSceneAnalyze
          ? null
          : (Array.isArray(unifiedChatReaction?.highlightedObjectIds)
              ? unifiedChatReaction.highlightedObjectIds[0]
              : null) ??
            executionResult.focusedObjectId ??
            null,
        unifiedReaction: executionResult.allowSceneMutation ? unifiedReactionForApply : null,
        sceneReplacement: acceptedSceneForChatReplacement,
        panelUpdates: {
          preferredPanel: executionResult.preferredPanel,
          preferredInspectorTab: executionResult.preferredInspectorTab,
          viewModel,
          objectSelection: nextObjectSelectionFromReaction,
          memoryInsights: viewModel.nextMemoryInsights,
          riskPropagation: viewModel.nextRiskPropagation,
          strategicAdvice: viewModel.nextStrategicAdvice,
          strategyKpi: viewModel.nextStrategyKpi,
          decisionCockpit: viewModel.nextDecisionCockpit,
          productModeContext: viewModel.nextProductModeContext,
          productModeId: viewModel.nextProductModeContext?.mode_id ?? null,
          aiReasoning: viewModel.nextAiReasoning,
          platformAssembly: viewModel.nextPlatformAssembly,
          autonomousExploration: viewModel.nextAutonomousExploration,
          opponentModel: viewModel.nextOpponentModel,
          strategicPatterns: viewModel.nextStrategicPatterns,
          conflicts: viewModel.nextConflicts,
          kpi: viewModel.nextKpi,
          loops: viewModel.nextLoops,
          activeLoopId: viewModel.nextActiveLoop ?? null,
          loopSuggestions: viewModel.nextLoopSuggestions,
        },
      };
      traceDemoFlowEvent({
        phase: "canonical_result_ready",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
        detail: {
          highlightedObjectCount: Array.isArray(unifiedChatReaction?.highlightedObjectIds)
            ? unifiedChatReaction.highlightedObjectIds.length
            : 0,
          hasPanelViewModel: Boolean(viewModel),
        },
      });
      applyExecutionResultToUi(enrichedExecutionResult);
      traceDemoFlowEvent({
        phase: "commit_applied",
        source: options?.source ?? "chat",
        seq: requestSeq,
        requestId,
        detail: { mode: "backend_canonical" },
      });
      if (
        (incomingSceneJson || viewModelSceneJson) &&
        shouldApplySceneMutation &&
        !acceptedSceneForChatReplacement &&
        process.env.NODE_ENV !== "production" &&
        !isPilotProductMode
      ) {
        setSceneWarn("⚠️ Rejected incompatible fallback scene replacement.");
      }

      const snapshot = buildPersistedProjectSnapshot({
        activeMode: nextActiveMode,
        sceneJson: acceptedSceneForChatReplacement ?? sceneJson,
        messages: finalMessages,
      });
      saveProject(snapshot);
      pushHistory(snapshot);

      try {
        const replay = await analyzeFull({ episodeId, text });
        if (isLatestChatRequest(requestSeq) && replay?.episode_id) setEpisodeId(replay.episode_id);
      } catch {
        // ignore replay errors to keep chat responsive
      }
      lifecycleStatus = "success";
      shouldClearInput = true;
      if (routeExecutiveObjectOnSuccess && isLatestChatRequest(requestSeq)) {
        const routeContextId =
          explicitSelection.explicitSelectedObjectId ?? getAnalyzeLockedObjectId();
        if (!routeContextId) {
          emitChatPipelineDiagnostic("request_failed", {
            runId,
            requestSeq,
            skippedReason: "executive_route_no_explicit_selection",
            error: "ExecutiveRouteBlocked",
            target: JSON.stringify({ selectedObjectIdState, focusedId, analyzeHl }),
          });
          return;
        }
        traceAnalyzeObjectRoute({
          stage: "analyze_success_before_route",
          requestedView: "executive_object",
          resolvedView: "executive_object",
          family: "EXE",
          contextId: routeContextId,
          rightPanelView: rightPanelState.view ?? null,
        });
        globalThis.console?.warn?.("[NEXORA_EXECUTIVE_ROUTE_ATTEMPT]", {
          view: "executive_object",
          contextId: routeContextId,
          timestamp: Date.now(),
        });
        if (process.env.NODE_ENV !== "production") {
          globalThis.console?.debug?.("[Nexora][AnalyzeRouting]", {
            targetView: "executive_object",
            contextId: routeContextId,
          });
        }
        passiveDeselectGuardUntilRef.current = Date.now() + 1200;
        setActiveSidePanel("decisions");
        dispatchChatPanelBridge(
          bridges,
          {
            runId,
            intent: "analyze_object",
            targetPanel: "executive_object",
          },
          {
            view: "executive_object",
            family: "EXE",
            source: "analyze_object",
            reason: "analyze_object_success",
            contextId: routeContextId,
            forceOpen: true,
          }
        );
        globalThis.console?.warn?.("[Nexora][AnalyzeFinalPanelTarget]", {
          family: "EXE",
          view: "executive_object",
          contextId: routeContextId,
          activeSidePanel,
        });
        rightPanelRouteLockRef.current = {
          view: "executive_object",
          contextId: routeContextId,
          reason: "analyze_object_success",
        };
        globalThis.console?.debug?.("[Nexora][RightPanelWriter]", {
          writer: "HomeScreen.analyze_success",
          nextView: "executive_object",
          contextId: routeContextId,
          reason: "analyze_object_success",
        });
        globalThis.console?.debug?.("[Nexora][RightPanelRouteTrace]", {
          writer: "analyze_success_route",
          requestedView: "executive_object",
          resolvedView: "executive_object",
          family: "EXE",
          contextId: routeContextId,
          reason: "analyze_object_success",
          source: "analyze_object",
        });
      }
    } catch (e: any) {
      if (!isLatestChatRequest(requestSeq)) {
        traceDemoFlowEvent({
          phase: "stale_ignored",
          source: options?.source ?? "chat",
          seq: requestSeq,
          requestId,
        });
        lifecycleStatus = "stale_ignored";
        return;
      }
      const timedOut = activeChatRequestRef.current?.seq === requestSeq && activeChatRequestRef.current.timedOut === true;
      lifecycleStatus = isAbortLikeError(e) ? "aborted" : "error";
      let msg = isPilotProductMode ? NEXORA_PIPELINE_USER_FAILURE : getChatLifecycleErrorMessage(e, timedOut);
      msg = userSafeChatMessage(msg);
      if (
        !isPilotProductMode &&
        intentRoute.shouldCallBackend &&
        (!isAbortLikeError(e) || timedOut)
      ) {
        const networkLike =
          /system temporarily unavailable|couldn't reach the server|request timed out/i.test(msg) || timedOut;
        if (networkLike) {
          msg = "I couldn't analyze the system right now, but you can still explore objects manually.";
        }
      }
      if (!isAbortLikeError(e) || timedOut) {
        const fallback = buildFailureResponse();
        const fallbackPanelView = resolveChatPipelinePanelOpen(fallback.recommended_panel);
        const preserveCurrentPanel = isMeaningfulPanel(rightPanelState.view ?? null);
        if (fallbackPanelView && !preserveCurrentPanel) {
          dispatchChatPanelBridge(
            bridges,
            {
              runId,
              intent: intentRoute.intent,
              targetPanel: fallbackPanelView,
            },
            {
              view: fallbackPanelView,
              family: "SCN",
              source: "chat",
              reason: "chat_pipeline_fallback",
              contextId: stableAnalyzeObjectId ?? rightPanelState.contextId ?? null,
              forceOpen: true,
            }
          );
        }
        setMessages((m: Msg[]) => appendMessages(m, [makeMsg("assistant", fallback.insight)]));
        emitChatResult(fallback.insight, false, requestId);
        emitDebugEvent({
          type: "chat_error",
          layer: "chat",
          source: "HomeScreen",
          status: "error",
          message: fallback.insight,
          metadata: { requestSeq, timedOut, reason: "chat_pipeline_exception" },
          correlationId: chatCorrelationId,
        });
        writeChatPipelineDebug({
          runId,
          lifecycleStatus,
          fallbackUsed: true,
          message: fallback.insight,
        });
      }
    } finally {
      if (isAnalyzeCommand) {
        analyzeInFlightRef.current = false;
        window.setTimeout(() => {
          emitChatPipelineDiagnostic("request_completed", {
            runId,
            requestSeq,
            skippedReason: "analyze_selection_lock_released",
            target: analyzeSelectionLockRef.current?.objectId ?? null,
          });
          analyzeSelectionLockRef.current = null;
          writeChatPipelineDebug({
            analyzeSelectionLock: {
              active: false,
              objectId: null,
              lastReason: "released",
            },
          });
        }, 500);
      }
      if (loadingDelayTimer != null) {
        window.clearTimeout(loadingDelayTimer);
      }
      if (chatBusyIndicatorTimer != null) {
        window.clearTimeout(chatBusyIndicatorTimer);
      }
      setChatDelayedBusy(false);
      writeChatPipelineDebug({
        runId,
        lifecycleStatus,
        lastCompletedAt: Date.now(),
      });
      if (activeChatDebugCorrelationRef.current === chatCorrelationId) {
        emitDebugEvent({
          type: "chat_response_completed",
          layer: "chat",
          source: "HomeScreen",
          status:
            lifecycleStatus === "error"
              ? "error"
              : lifecycleStatus === "aborted" || lifecycleStatus === "stale_ignored"
                ? "warn"
                : "ok",
          message: `Chat pipeline finalized: ${lifecycleStatus}`,
          metadata: {
            lifecycleStatus,
            requestSeq,
            clearInput: shouldClearInput,
          },
          correlationId: chatCorrelationId,
        });
        emitGuardRailAlerts(
          runGuardChecks(
            { trigger: "chat_response", chat: { chatCorrelationId }, correlationId: chatCorrelationId },
            getRecentDebugEvents()
          )
        );
        activeChatDebugCorrelationRef.current = null;
      }
      finalizeChatRequest(requestSeq, lifecycleStatus, { clearInput: shouldClearInput });
    }
      };

      await runSendTextLifecycle();
    } finally {
      window.setTimeout(() => {
        const cur = loopGuardInFlightByTextRef.current.get(normalizedText) ?? 1;
        const next = cur - 1;
        if (next <= 0) {
          loopGuardInFlightByTextRef.current.delete(normalizedText);
        } else {
          loopGuardInFlightByTextRef.current.set(normalizedText, next);
        }
        chatLoopGuardDepthRef.current = Math.max(0, chatLoopGuardDepthRef.current - 1);
        chatLoopGuardActiveRef.current = chatLoopGuardDepthRef.current > 0;
        emitChatPipelineDiagnostic("request_completed", {
          promptSignature: normalizedText,
          skippedReason: "loop_guard_released",
          messageCount: chatLoopGuardDepthRef.current,
        });
        writeChatPipelineDebug({
          loopGuard: {
            lastReason: "released",
            lastAt: Date.now(),
          },
        });
      }, 0);
    }

  };
}

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export type UseChatPipelineControllerInput = Readonly<{
  messages: readonly ChatPipelineMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  lastRunId?: string | null;

  refs?: Partial<ChatPipelineControllerRefs> | null;
  bridges?: Partial<ChatPipelineBridgeCallbacks> | null;

  /** HomeScreen-built snapshot for `createChatPipelineSendText` deps (O4:5); bridges passed separately (O4:7). */
  sendTextDeps: ChatPipelineSendTextDeps;

  /** HomeScreen-owned `setMessages` — hook appends/replaces via `appendMessages` only. */
  setMessages: Dispatch<SetStateAction<Msg[]>>;
  setChatRequestStatus: Dispatch<SetStateAction<ChatRequestLifecycleStatus>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setChatDelayedBusy: Dispatch<SetStateAction<boolean>>;
  /** Clears `isSendingRef` in HomeScreen (same tick behavior as `finalizeChatRequest` clearing). */
  releaseChatSendingLock: () => void;
}>;

export type UseChatPipelineControllerResult = UseChatPipelineControllerContract &
  Readonly<{
    extractionPlan: typeof CHAT_PIPELINE_CONTROLLER_EXTRACTION_PLAN;
  }>;

/**
 * O4:3+ — Chat Pipeline Controller. O4:4: message helpers. O4:5: canonical `sendText` + full request lifecycle (same module).
 */
export function useChatPipelineController(input: UseChatPipelineControllerInput): UseChatPipelineControllerResult {
  const diagnosticDedupeKeyRef = useRef<string | null>(null);
  const diagnosticDedupeAtRef = useRef(0);

  const emitChatPipelineDiagnostic = useCallback<EmitChatPipelineDiagnosticFn>((eventName, payload) => {
    if (process.env.NODE_ENV === "production") return;
    try {
      const now = Date.now();
      const key = `${eventName}|${payload.runId ?? ""}|${payload.promptSignature ?? ""}|${payload.skippedReason ?? ""}|${payload.activeRunId ?? ""}|${payload.requestSeq ?? ""}|${payload.chatRequestStatus ?? ""}|${payload.intent ?? ""}`;
      if (diagnosticDedupeKeyRef.current === key && now - diagnosticDedupeAtRef.current < 220) {
        return;
      }
      diagnosticDedupeKeyRef.current = key;
      diagnosticDedupeAtRef.current = now;
      const infoEvents = new Set([
        "stale_response_ignored",
        "request_failed",
        "duplicate_prompt_skipped",
      ]);
      const logFn = infoEvents.has(eventName)
        ? globalThis.console.info.bind(globalThis.console)
        : globalThis.console.debug.bind(globalThis.console);
      logFn("[Nexora][ChatPipeline][Diagnostic]", { eventName, ...payload });
    } catch {
      // ignore
    }
  }, []);

  const emitMessageHelper = useCallback(
    (action: string, detail: { messageCount: number; role?: string | null }) => {
      emitChatPipelineDiagnostic("message_appended", {
        messageCount: detail.messageCount,
        role: detail.role ?? null,
        source: `message_helper:${action}`,
      });
    },
    [emitChatPipelineDiagnostic]
  );

  const placeholderActiveRunIdRef = useRef<string | null>(null);
  const placeholderLastPromptSignatureRef = useRef<string | null>(null);
  const placeholderLastAssistantMessageSignatureRef = useRef<string | null>(null);
  const placeholderStaleRunGuardRef = useRef<string | null>(null);

  const activeRunIdRef = input.refs?.activeRunIdRef ?? placeholderActiveRunIdRef;
  const lastPromptSignatureRef = input.refs?.lastPromptSignatureRef ?? placeholderLastPromptSignatureRef;
  const lastAssistantMessageSignatureRef =
    input.refs?.lastAssistantMessageSignatureRef ?? placeholderLastAssistantMessageSignatureRef;
  const staleRunGuardRef = input.refs?.staleRunGuardRef ?? placeholderStaleRunGuardRef;

  const emitSendTextDiag = useCallback(
    (detail: {
      runId: string | null;
      source: string;
      promptSignature: string;
      messageCountBefore: number;
      skippedReason?: string | null;
    }) => {
      const skipped = detail.skippedReason ?? null;
      emitChatPipelineDiagnostic(skipped ? "send_skipped" : "send_requested", {
        runId: detail.runId,
        activeRunId: activeRunIdRef.current,
        promptSignature: detail.promptSignature || null,
        messageCount: detail.messageCountBefore,
        source: detail.source,
        skippedReason: skipped,
      });
    },
    [activeRunIdRef, emitChatPipelineDiagnostic]
  );

  const refs = useMemo<ChatPipelineControllerRefs>(
    () => ({
      activeRunIdRef,
      lastPromptSignatureRef,
      lastAssistantMessageSignatureRef,
      staleRunGuardRef,
    }),
    [activeRunIdRef, lastAssistantMessageSignatureRef, lastPromptSignatureRef, staleRunGuardRef]
  );

  const bridges = useMemo<ChatPipelineBridgeCallbacks>(
    () => ({
      applySceneChangeSafe: input.bridges?.applySceneChangeSafe ?? null,
      applySceneChangeUpstreamDedup: input.bridges?.applySceneChangeUpstreamDedup ?? null,
      applyUnifiedSceneReactionUpstreamDedup: input.bridges?.applyUnifiedSceneReactionUpstreamDedup ?? null,
      openRightPanel: input.bridges?.openRightPanel ?? null,
      requestPanelAuthorityOpen: input.bridges?.requestPanelAuthorityOpen ?? null,
      closeRightPanel: input.bridges?.closeRightPanel ?? null,
      applyTypeCChatIntent: input.bridges?.applyTypeCChatIntent ?? null,
      runTypeCAction: input.bridges?.runTypeCAction ?? null,
    }),
    [
      input.bridges?.applySceneChangeSafe,
      input.bridges?.applySceneChangeUpstreamDedup,
      input.bridges?.applyUnifiedSceneReactionUpstreamDedup,
      input.bridges?.openRightPanel,
      input.bridges?.requestPanelAuthorityOpen,
      input.bridges?.closeRightPanel,
      input.bridges?.applyTypeCChatIntent,
      input.bridges?.runTypeCAction,
    ]
  );

  const sendTextDepsForImpl = useMemo(
    () => ({ ...input.sendTextDeps, emitChatPipelineDiagnostic } as ChatPipelineSendTextDeps),
    [emitChatPipelineDiagnostic, input.sendTextDeps]
  );

  const sendTextImpl = useMemo(
    () => createChatPipelineSendText(sendTextDepsForImpl, bridges),
    [bridges, sendTextDepsForImpl]
  );

  const sendText = useCallback(
    async (textRaw: string | ChatSendInput, requestId?: string, options?: SendTextOptions) => {
      const raw = typeof textRaw === "string" ? textRaw : textRaw.text;
      const trimmed = raw.trim();
      if (!trimmed) {
        emitSendTextDiag({
          runId: activeRunIdRef.current,
          source: options?.source ?? (typeof textRaw === "object" ? String(textRaw.source ?? "user") : "user"),
          promptSignature: "",
          messageCountBefore: input.messages.length,
          skippedReason: "empty_input",
        });
        return;
      }
      const promptSignature = normalizeChatInputForDedup(trimmed);
      emitSendTextDiag({
        runId: activeRunIdRef.current,
        source: options?.source ?? (typeof textRaw === "object" ? String(textRaw.source ?? "user") : "user"),
        promptSignature,
        messageCountBefore: input.messages.length,
      });
      await sendTextImpl(raw, requestId, options);
    },
    [activeRunIdRef, emitSendTextDiag, input.messages.length, sendTextImpl]
  );

  const clearChatError = useCallback(() => {
    input.setChatRequestStatus("idle");
    input.setLoading(false);
    input.setChatDelayedBusy(false);
    input.releaseChatSendingLock();
    emitMessageHelper("clear_error", { messageCount: input.messages.length });
  }, [
    emitMessageHelper,
    input.messages.length,
    input.releaseChatSendingLock,
    input.setChatDelayedBusy,
    input.setChatRequestStatus,
    input.setLoading,
  ]);

  const appendMessage = useCallback(
    (message: ChatPipelineMessage) => {
      input.setMessages((m) => appendMessages(m, [message as Msg]));
      emitMessageHelper("append", {
        messageCount: input.messages.length + 1,
        role: message.role ?? null,
      });
    },
    [emitMessageHelper, input.messages.length, input.setMessages]
  );

  const replaceMessages = useCallback(
    (next: readonly ChatPipelineMessage[]) => {
      const nextArr = [...(next as Msg[])];
      input.setMessages(nextArr);
      emitMessageHelper("replace", { messageCount: nextArr.length });
    },
    [emitMessageHelper, input.setMessages]
  );

  const callbacks = useMemo<ChatPipelineControllerCallbacks>(
    () => ({
      sendText,
      clearChatError,
      appendMessage,
      replaceMessages,
    }),
    [appendMessage, clearChatError, replaceMessages, sendText]
  );

  const state = useMemo<ChatPipelineControllerState>(
    () => ({
      messages: input.messages,
      inputValue: input.inputValue,
      isLoading: input.isLoading,
      error: input.error,
      lastRunId: input.lastRunId ?? null,
    }),
    [input.error, input.inputValue, input.isLoading, input.lastRunId, input.messages]
  );

  return useMemo(
    () => ({
      state,
      refs,
      bridges,
      callbacks,
      emitChatPipelineDiagnostic,
      extractionPlan: CHAT_PIPELINE_CONTROLLER_EXTRACTION_PLAN,
    }),
    [bridges, callbacks, emitChatPipelineDiagnostic, refs, state]
  );
}
